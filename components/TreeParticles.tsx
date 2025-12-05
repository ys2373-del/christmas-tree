
import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useStore } from '../store';
import { TreeState } from '../types';
import { generateTreeData } from './TreeUtils';

// Custom Shader for Magical Particles
const particleVertexShader = `
  uniform float uTime;
  uniform float uProgress; // 0 = Scatter, 1 = Tree
  
  attribute vec3 aTreePos;
  attribute vec3 aScatterPos;
  attribute float aPhase;
  attribute float aSize;
  attribute vec3 aColor;
  
  varying vec3 vColor;
  
  void main() {
    vColor = aColor;
    
    // Mix positions based on state
    vec3 targetPos = mix(aScatterPos, aTreePos, uProgress);
    
    // Add breathing/floating movement
    float floatStrength = (1.0 - uProgress) * 2.0 + 0.2;
    float offset = sin(uTime * 2.0 + aPhase) * floatStrength;
    
    vec3 finalPos = targetPos;
    finalPos.y += offset * 0.2;
    finalPos.x += cos(uTime + aPhase) * offset * 0.1;
    
    vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
    
    gl_Position = projectionMatrix * mvPosition;
    
    // Size attenuation (make them smaller when far away)
    // Scale up slightly during transition
    float transitionPop = 1.0 + sin(uProgress * 3.14159) * 0.5;
    gl_PointSize = aSize * (300.0 / -mvPosition.z) * transitionPop;
  }
`;

const particleFragmentShader = `
  varying vec3 vColor;
  
  void main() {
    // Create a soft circle
    vec2 xy = gl_PointCoord.xy - vec2(0.5);
    float ll = length(xy);
    if(ll > 0.5) discard;
    
    // Glow effect from center
    float alpha = (0.5 - ll) * 2.0;
    
    // Make it shiny/additive feeling
    gl_FragColor = vec4(vColor, alpha);
  }
`;

export const TreeParticles: React.FC = () => {
  const shaderRef = useRef<THREE.ShaderMaterial>(null);
  const treeState = useStore((state) => state.treeState);
  const progressRef = useRef(1);

  // INCREASED COUNT: 14000 particles for extremely dense dust look
  const count = 14000;
  
  const { positions, treePositions, scatterPositions, colors, phases, sizes } = useMemo(() => {
    // Increased Radius to 5.2 to gently wrap around the geometry
    // Increased Height to 14 to cover top star area
    const data = generateTreeData(count, 5.2, 14, 0.5, 1.5, undefined, 0.2); 
    
    const positions = new Float32Array(count * 3);
    const treePositions = new Float32Array(count * 3);
    const scatterPositions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const sizes = new Float32Array(count);

    data.forEach((d, i) => {
      // Initial pos
      positions[i * 3] = d.treePos.x;
      positions[i * 3 + 1] = d.treePos.y;
      positions[i * 3 + 2] = d.treePos.z;

      treePositions[i * 3] = d.treePos.x;
      treePositions[i * 3 + 1] = d.treePos.y;
      treePositions[i * 3 + 2] = d.treePos.z;

      scatterPositions[i * 3] = d.scatterPos.x;
      scatterPositions[i * 3 + 1] = d.scatterPos.y;
      scatterPositions[i * 3 + 2] = d.scatterPos.z;

      const color = d.color;
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      phases[i] = d.phase;
      sizes[i] = Math.random() * 0.4 + 0.05; 
    });

    return { positions, treePositions, scatterPositions, colors, phases, sizes };
  }, []);

  useFrame((state, delta) => {
    if (!shaderRef.current) return;
    
    const target = treeState === TreeState.TREE_SHAPE ? 1 : 0;
    progressRef.current = THREE.MathUtils.lerp(progressRef.current, target, delta * 1.5);
    
    shaderRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    shaderRef.current.uniforms.uProgress.value = progressRef.current;
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aTreePos"
          count={count}
          array={treePositions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aScatterPos"
          count={count}
          array={scatterPositions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aColor"
          count={count}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aPhase"
          count={count}
          array={phases}
          itemSize={1}
        />
         <bufferAttribute
          attach="attributes-aSize"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={shaderRef}
        vertexShader={particleVertexShader}
        fragmentShader={particleFragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{
          uTime: { value: 0 },
          uProgress: { value: 1 }
        }}
      />
    </points>
  );
};

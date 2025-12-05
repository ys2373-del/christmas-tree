
import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useStore } from '../store';
import { TreeState } from '../types';

export const TopStar: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const treeState = useStore((state) => state.treeState);
  
  // Tree Top Position - Raised slightly to 6.5
  const treePos = new THREE.Vector3(0, 6.5, 0); 
  // Scatter Position: inside tree
  const scatterPos = new THREE.Vector3(0, 2, 0);
  
  const progressRef = useRef(1);

  // Create 5-pointed Star Shape
  const starShape = useMemo(() => {
    const shape = new THREE.Shape();
    const points = 5;
    const outerRadius = 1.0; 
    const innerRadius = 0.4; 

    for (let i = 0; i < points * 2; i++) {
      const angle = (i / (points * 2)) * Math.PI * 2 + Math.PI / 2;
      const r = i % 2 === 0 ? outerRadius : innerRadius;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();
    return shape;
  }, []);

  const extrudeSettings = useMemo(() => ({
    depth: 0.3,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.05,
    bevelSegments: 3
  }), []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    const time = state.clock.getElapsedTime();
    const target = treeState === TreeState.TREE_SHAPE ? 1 : 0;
    progressRef.current = THREE.MathUtils.lerp(progressRef.current, target, delta * 1.5);

    // Position Morph
    groupRef.current.position.lerpVectors(scatterPos, treePos, progressRef.current);
    
    // Scale: Smaller overall, shrinks when hidden
    const scale = THREE.MathUtils.lerp(0.0, 0.8, progressRef.current);
    groupRef.current.scale.setScalar(scale);

    // Spin
    groupRef.current.rotation.y = time * 0.8;
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <extrudeGeometry args={[starShape, extrudeSettings]} />
        <meshStandardMaterial 
          color="#FFD700" 
          emissive="#FFD700"
          emissiveIntensity={0.8}
          roughness={0.1} 
          metalness={1} 
        />
      </mesh>
      
      {/* Outer Glow Halo (Point Light) */}
      <pointLight color="#FFD700" intensity={2} distance={8} decay={2} />
    </group>
  );
};

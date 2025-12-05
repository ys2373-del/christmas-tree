
import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export const FallingSnow: React.FC = () => {
  const count = 400; // Number of snowflakes
  const geomRef = useRef<THREE.BufferGeometry>(null);
  
  // Initial positions and velocities
  const [positions, userData] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const data = [];
    
    for (let i = 0; i < count; i++) {
      // Random spread in a box
      pos[i * 3] = (Math.random() - 0.5) * 25;     // x
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30 + 5; // y (start higher)
      pos[i * 3 + 2] = (Math.random() - 0.5) * 25; // z
      
      data.push({
        yVelocity: 0.01 + Math.random() * 0.03, // Slow falling speed
        xOffset: Math.random() * Math.PI * 2,
        zOffset: Math.random() * Math.PI * 2,
        swaySpeed: 0.5 + Math.random() * 0.5
      });
    }
    return [pos, data];
  }, []);

  useFrame((state) => {
    if (!geomRef.current) return;
    
    const posAttribute = geomRef.current.attributes.position;
    const array = posAttribute.array as Float32Array;
    const time = state.clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const data = userData[i];

      // Fall down
      array[i3 + 1] -= data.yVelocity;

      // Reset if below floor (floor is approx -8)
      if (array[i3 + 1] < -10) {
        array[i3 + 1] = 15; // Reset to top
        // Randomize x/z again on reset to avoid loops
        array[i3] = (Math.random() - 0.5) * 25;
        array[i3 + 2] = (Math.random() - 0.5) * 25;
      }

      // Add gentle sway (Sine wave drift)
      array[i3] += Math.cos(time * data.swaySpeed + data.xOffset) * 0.005;
      array[i3 + 2] += Math.sin(time * data.swaySpeed + data.zOffset) * 0.005;
    }

    posAttribute.needsUpdate = true;
  });

  return (
    <points>
      <bufferGeometry ref={geomRef}>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#FFFFFF"
        size={0.12}
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
};

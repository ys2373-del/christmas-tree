import React, { useRef, useMemo, useLayoutEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { ParticleData, TreeState } from '../types';
import { useStore } from '../store';

interface InstancedOrnamentsProps {
  data: ParticleData[];
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
}

export const InstancedOrnaments: React.FC<InstancedOrnamentsProps> = ({ data, geometry, material }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const treeState = useStore((state) => state.treeState);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Animation state
  const progress = useRef(1); // 1 = Tree, 0 = Scatter

  useLayoutEffect(() => {
    if (meshRef.current) {
      data.forEach((particle, i) => {
        dummy.position.copy(particle.treePos);
        dummy.rotation.copy(particle.rotation);
        dummy.scale.setScalar(particle.scale);
        dummy.updateMatrix();
        meshRef.current!.setMatrixAt(i, dummy.matrix);
        meshRef.current!.setColorAt(i, particle.color);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
      meshRef.current.instanceColor!.needsUpdate = true;
    }
  }, [data, dummy]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Smooth transition logic
    const target = treeState === TreeState.TREE_SHAPE ? 1 : 0;
    progress.current = THREE.MathUtils.lerp(progress.current, target, delta * 2); // Speed of morph

    const time = state.clock.getElapsedTime();

    data.forEach((particle, i) => {
      // Interpolate position
      const currentPos = new THREE.Vector3().lerpVectors(
        particle.scatterPos,
        particle.treePos,
        progress.current
      );

      // Add "Floating" effect when scattered or slightly when tree
      // More float when scattered (1 - progress)
      const floatFactor = (1 - progress.current) * 2 + 0.1; 
      
      currentPos.y += Math.sin(time * particle.speed + particle.phase) * floatFactor * 0.2;
      currentPos.x += Math.cos(time * particle.speed * 0.5 + particle.phase) * floatFactor * 0.1;

      // Rotate continuously
      dummy.rotation.set(
        particle.rotation.x + time * 0.1 * (1 - progress.current),
        particle.rotation.y + time * 0.2,
        particle.rotation.z
      );

      dummy.position.copy(currentPos);
      
      // Scale pop effect during transition
      const scaleMult = 1 + Math.sin(progress.current * Math.PI) * 0.2;
      dummy.scale.setScalar(particle.scale * scaleMult);

      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, data.length]}
      castShadow
      receiveShadow
    />
  );
};
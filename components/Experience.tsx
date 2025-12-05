
import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Environment, ContactShadows, OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom, ToneMapping } from '@react-three/postprocessing';
import { generateTreeData } from './TreeUtils';
import { InstancedOrnaments } from './InstancedOrnaments';
import { TreeParticles } from './TreeParticles';
import { TopStar } from './TopStar';
import { FallingSnow } from './FallingSnow';

export const Experience: React.FC = () => {
  // 1. Generate Data for different layers
  
  // Metallic Spheres (Small Mixed)
  const sphereData = useMemo(() => generateTreeData(300, 4, 12, 0.2, 0.4), []);

  // Pure White Small Spheres
  const whiteSphereData = useMemo(() => 
    generateTreeData(250, 4.5, 12, 0.15, 0.3, new THREE.Color('#FFFFFF'), 0.5), 
  []);

  // Small Golden Spheres (Luxurious accents)
  const goldSphereData = useMemo(() => 
    generateTreeData(300, 4.3, 11.5, 0.2, 0.35, new THREE.Color('#FFD700'), 1.0), 
  []);

  // NEW: Glowing Medium Orbs (Warm Light)
  const glowingOrbData = useMemo(() => 
    generateTreeData(50, 3.5, 10, 0.5, 0.8, new THREE.Color('#FF8C00'), 1.5), 
  []);
  
  // Gifts (Standard Boxes) - Large amount - scale 0.8 to 1.4
  const boxDataStandard = useMemo(() => generateTreeData(200, 3.8, 10.5, 0.8, 1.4, undefined, 0.5), []);
  
  // Gifts (Giant Boxes) - Mixed colors - scale 1.5 to 2.2
  const boxDataGiant = useMemo(() => generateTreeData(50, 4.0, 9, 1.5, 2.2, undefined, 2.0), []);

  // Deep Pink Giant Boxes - scale 1.8 to 2.5
  const boxDataDeepPink = useMemo(() => 
    generateTreeData(40, 4.2, 9.5, 1.8, 2.5, new THREE.Color('#FF69B4'), 3.0), 
  []);
  
  // Gems (Icosahedrons) - Random sizes
  const gemData = useMemo(() => generateTreeData(150, 4.2, 11, 0.4, 1.0, undefined, 1.0), []);

  // 2. Materials
  
  const metalMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#FFFFFF',
    roughness: 0.1,
    metalness: 0.9,
    envMapIntensity: 1.5
  }), []);

  const satinMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#FFFFFF',
    roughness: 0.3,
    metalness: 0.4,
  }), []);
  
  const crystalMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#FFFFFF',
    roughness: 0.05,
    metalness: 0.9,
    emissive: '#FFD1DC',
    emissiveIntensity: 0.1
  }), []);

  // New Emissive Material for Glowing Orbs
  const glowingMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#FFD700',
    emissive: '#FF6000',
    emissiveIntensity: 2.0,
    toneMapped: false
  }), []);

  // Geometries
  const sphereGeo = useMemo(() => new THREE.SphereGeometry(0.25, 32, 32), []);
  const boxGeo = useMemo(() => new THREE.BoxGeometry(0.4, 0.4, 0.4), []);
  const gemGeo = useMemo(() => new THREE.IcosahedronGeometry(0.3, 0), []);

  return (
    <>
      {/* Controls: Allow rotation only. Disable Pan and Zoom. */}
      <OrbitControls 
        enablePan={false}
        enableZoom={false}
        minPolarAngle={0} 
        maxPolarAngle={Math.PI / 1.8} 
        dampingFactor={0.05}
        rotateSpeed={0.5}
      />

      {/* Lighting & Environment */}
      <Environment preset="city" />
      <ambientLight intensity={0.6} color="#FFD1DC" />
      <directionalLight position={[10, 10, 5]} intensity={2.5} color="#FFD700" castShadow />
      <spotLight position={[-10, 20, -5]} intensity={6} color="#FF69B4" angle={0.5} penumbra={1} />
      
      {/* Light Snow Falling Globally */}
      <FallingSnow />

      {/* Scene Content - Moved UP to y=-2 */}
      <group position={[0, -2, 0]}>
        
        {/* Layer 1: Metallic Spheres */}
        <InstancedOrnaments 
          data={sphereData} 
          geometry={sphereGeo} 
          material={metalMaterial} 
        />

        {/* Layer 1.5: White Small Spheres */}
        <InstancedOrnaments 
          data={whiteSphereData} 
          geometry={sphereGeo} 
          material={metalMaterial} 
        />

         {/* Layer 1.6: Golden Small Spheres */}
         <InstancedOrnaments 
          data={goldSphereData} 
          geometry={sphereGeo} 
          material={metalMaterial} 
        />

        {/* Layer 1.7: Glowing Medium Orbs (New) */}
        <InstancedOrnaments 
          data={glowingOrbData} 
          geometry={sphereGeo} 
          material={glowingMaterial} 
        />
        
        {/* Layer 2: Standard Gift Boxes */}
        <InstancedOrnaments 
          data={boxDataStandard} 
          geometry={boxGeo} 
          material={satinMaterial} 
        />
        
        {/* Layer 3: Giant Gift Boxes */}
        <InstancedOrnaments 
          data={boxDataGiant} 
          geometry={boxGeo} 
          material={satinMaterial} 
        />

        {/* Layer 3.5: Deep Pink Giant Boxes */}
        <InstancedOrnaments 
          data={boxDataDeepPink} 
          geometry={boxGeo} 
          material={satinMaterial} 
        />

        {/* Layer 4: Crystal Gems */}
        <InstancedOrnaments 
          data={gemData} 
          geometry={gemGeo} 
          material={crystalMaterial} 
        />

        {/* Layer 5: The Foliage / Dust */}
        <TreeParticles />
        
        {/* Layer 6: The Top Star */}
        <TopStar />
        
        {/* Shadows on floor */}
        <ContactShadows opacity={0.6} scale={40} blur={2.5} far={10} resolution={256} color="#4a0f1d" />
      </group>

      {/* Post Processing for Cinematic Look */}
      <EffectComposer disableNormalPass>
        <Bloom 
          luminanceThreshold={0.75} 
          mipmapBlur 
          intensity={1.3} 
          radius={0.6}
        />
        <ToneMapping />
      </EffectComposer>
    </>
  );
};

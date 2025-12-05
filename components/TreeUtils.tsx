
import * as THREE from 'three';
import { ParticleData } from '../types';

// Palette: Dominant Light Pink, Highlight Gold, Accent White
const COLORS = [
  new THREE.Color('#FFD1DC'), // Pastel Pink (Main)
  new THREE.Color('#FFD1DC'), // Pastel Pink (Main)
  new THREE.Color('#FFC0CB'), // Pink
  new THREE.Color('#FFB7C5'), // Sakura Pink
  new THREE.Color('#FFD700'), // Gold
  new THREE.Color('#FFFFFF'), // White
];

export const generateTreeData = (
  count: number, 
  radius: number, 
  height: number,
  minScale: number = 0.5,
  maxScale: number = 1.5,
  specificColor?: THREE.Color, // Optional fixed color for specific layers
  angularJitter: number = 0 // New: 0 = perfect spiral, >1 = random distribution
): ParticleData[] => {
  const data: ParticleData[] = [];

  for (let i = 0; i < count; i++) {
    // 1. Calculate Tree Position (Cone Spiral)
    const rawT = i / count; 
    
    // Bottom-heavy distribution: Power curve pushes more items to lower values (bottom)
    const t = Math.pow(rawT, 1.2);

    // Height from bottom to top
    const y = -height / 2 + t * height; 
    
    // Radius decreases as we go up. Taper to 0 at the very top (t=1)
    const currentRadius = (1 - t) * radius; 
    
    // Spiral angle logic
    // We add random jitter to the angle to break "lines" of objects
    const spiralTurns = 25;
    const baseAngle = t * Math.PI * spiralTurns;
    const randomOffset = (Math.random() - 0.5) * Math.PI * 2 * angularJitter;
    const angle = baseAngle + randomOffset;

    // Add some organic surface variation (don't make it a perfect geometric cone)
    const surfaceNoise = Math.random() * 0.3 * (1 - t); // Less noise at top
    const x = Math.cos(angle) * (currentRadius + surfaceNoise);
    const z = Math.sin(angle) * (currentRadius + surfaceNoise);
    
    const treePos = new THREE.Vector3(x, y, z);

    // 2. Calculate Scatter Position (Sphere/Nebula)
    // Random point inside a sphere
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);
    const scatterR = 15 + Math.random() * 10; // Large radius
    
    const sx = scatterR * Math.sin(phi) * Math.cos(theta);
    const sy = scatterR * Math.sin(phi) * Math.sin(theta);
    const sz = scatterR * Math.cos(phi);
    
    const scatterPos = new THREE.Vector3(sx, sy, sz);

    // 3. Attributes
    const rotation = new THREE.Euler(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );

    // Use provided scale range
    const scale = minScale + Math.random() * (maxScale - minScale);
    
    // Use specific color if provided, otherwise random from palette
    const color = specificColor ? specificColor.clone() : COLORS[Math.floor(Math.random() * COLORS.length)];

    data.push({
      id: i,
      treePos,
      scatterPos,
      rotation,
      scale,
      color,
      speed: 0.2 + Math.random() * 0.8,
      phase: Math.random() * Math.PI * 2
    });
  }

  return data;
};

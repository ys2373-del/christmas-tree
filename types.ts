import * as THREE from 'three';

export enum TreeState {
  SCATTERED = 'SCATTERED',
  TREE_SHAPE = 'TREE_SHAPE',
}

export interface ParticleData {
  id: number;
  // Position in Tree formation
  treePos: THREE.Vector3;
  // Position in Scattered formation
  scatterPos: THREE.Vector3;
  // Rotation for the instance
  rotation: THREE.Euler;
  // Scale for the instance
  scale: number;
  // Color variation
  color: THREE.Color;
  // Speed of floating animation
  speed: number;
  // Phase offset for animation
  phase: number;
}

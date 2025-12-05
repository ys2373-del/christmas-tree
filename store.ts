import { create } from 'zustand';
import { TreeState } from './types';

interface AppState {
  treeState: TreeState;
  toggleTreeState: () => void;
}

export const useStore = create<AppState>((set) => ({
  treeState: TreeState.TREE_SHAPE,
  toggleTreeState: () => set((state) => ({
    treeState: state.treeState === TreeState.TREE_SHAPE 
      ? TreeState.SCATTERED 
      : TreeState.TREE_SHAPE
  })),
}));
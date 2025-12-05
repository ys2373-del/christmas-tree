
import React from 'react';
import { useStore } from '../store';
import { TreeState } from '../types';

export const UI: React.FC = () => {
  const { treeState, toggleTreeState } = useStore();

  const isAssembled = treeState === TreeState.TREE_SHAPE;

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 flex flex-col justify-between p-6 md:p-10">
      {/* Header - Significantly reduced size */}
      <header className="flex flex-col items-start space-y-1 opacity-90">
        <h1 className="text-xl md:text-2xl font-light tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,215,0,0.6)]">
          ARIX <span className="font-bold text-[#FFD700]">SIGNATURE</span>
        </h1>
        <div className="h-[1px] w-12 bg-[#FFD700]"></div>
      </header>

      {/* Controls */}
      <div className="flex justify-end items-end pointer-events-auto">
        <button
          onClick={toggleTreeState}
          className={`
            group relative px-6 py-3 md:px-8 md:py-4 overflow-hidden rounded-full 
            transition-all duration-500 ease-out
            border border-white/20 backdrop-blur-md shadow-lg
            ${isAssembled 
              ? 'bg-[#FFD700]/20 hover:bg-[#FFD700]/40 text-[#FFD700]' 
              : 'bg-pink-500/20 hover:bg-pink-500/40 text-pink-200'
            }
          `}
        >
          {/* Button Text */}
          <span className="relative z-10 font-bold tracking-widest uppercase text-sm md:text-base">
            {isAssembled ? 'Release / 释放' : 'Assemble / 组装'}
          </span>
          
          {/* Hover Glow */}
          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        </button>
      </div>
      
      {/* Status Indicator */}
      <div className="absolute bottom-12 left-12 flex items-center space-x-3 hidden md:flex">
        <div className={`w-1.5 h-1.5 rounded-full ${isAssembled ? 'bg-green-400 shadow-[0_0_10px_#4ade80]' : 'bg-pink-500 shadow-[0_0_10px_#ec4899]'} animate-pulse`}></div>
        <span className="text-white/40 text-[10px] font-mono uppercase tracking-widest">
            {isAssembled ? 'System Online' : 'Awaiting Input'}
        </span>
      </div>
    </div>
  );
};

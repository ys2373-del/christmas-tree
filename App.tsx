import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader } from '@react-three/drei';
import { Experience } from './components/Experience';
import { UI } from './components/UI';

const App: React.FC = () => {
  return (
    <>
      <div className="relative w-full h-full bg-[#1a050a]">
        <Canvas
          shadows
          camera={{ position: [0, 0, 25], fov: 35 }}
          gl={{ antialias: false, stencil: false, depth: true }}
          dpr={[1, 2]} // Optimize for mobile vs desktop
        >
          <color attach="background" args={['#1a050a']} />
          
          <fog attach="fog" args={['#1a050a', 20, 50]} />
          
          <Suspense fallback={null}>
            <Experience />
          </Suspense>
        </Canvas>
        
        <UI />
        <Loader 
          containerStyles={{ background: '#1a050a' }}
          barStyles={{ background: '#FFD700', height: '2px' }}
          dataStyles={{ color: '#FFC0CB', fontFamily: 'monospace' }}
        />
      </div>
    </>
  );
};

export default App;
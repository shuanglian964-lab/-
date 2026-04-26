import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'motion/react';

function PaperPlane() {
  const mesh = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    mesh.current.position.y = Math.sin(t) * 0.2;
    mesh.current.rotation.x = Math.cos(t / 4) / 8;
    mesh.current.rotation.y = Math.sin(t / 4) / 8;
    mesh.current.rotation.z = Math.sin(t / 4) / 4;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={mesh} rotation={[0, -0.5, 0]}>
        <planeGeometry args={[3, 4, 32, 32]} />
        <MeshDistortMaterial
          color="#f9f6f1"
          speed={1.5}
          distort={0.2}
          radius={1}
          roughness={0.1}
        />
      </mesh>
    </Float>
  );
}

export default function Hero() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-paper">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={1.5} />
          <pointLight position={[10, 10, 10]} intensity={2} color="#eab308" />
          <PaperPlane />
        </Canvas>
      </div>

      {/* Sunlight Layer */}
      <div className="absolute inset-0 z-10 sunlight-overlay" />
      <div className="absolute inset-0 z-10 paper-texture opacity-30" />

      {/* Nav */}
      <nav className="absolute top-0 w-full z-30 px-10 py-8 flex justify-between items-center bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="text-2xl font-shoujin tracking-wider">文踪影迹</div>
        <div className="hidden md:flex flex-col items-end">
          <span className="text-[10px] tracking-[0.3em] font-serif uppercase text-ink/30 mb-1">每日微光</span>
          <p className="font-serif text-xs italic text-ink/60 tracking-wider">
            {[`“草木有本心，何求美人折。”`, `“此心安处是吾乡。”`, `“闲看庭前花开花落。”`, `“身无彩凤双飞翼，心有灵犀一点通。”`, `“一生大半，笔墨人生。”`][Math.floor(Math.random() * 5)]}
          </p>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
           className="flex flex-col items-center"
        >
          <span className="text-sun font-serif italic text-lg mb-4 block tracking-widest">— 寻觅文人的脚步 —</span>
          <h1 className="text-7xl md:text-9xl mb-12 font-shoujin text-ink drop-shadow-xl">
             见字如面
          </h1>
          <div className="max-w-2xl text-lg md:text-xl font-serif italic leading-loose text-ink/70 text-center space-y-2">
            <p>“每一座城市，都是一叠未寄出的信笺。”</p>
            <p>“我们循着墨迹，走进作家曾凝视过的晨曦与黄昏。”</p>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-10 flex flex-col items-center gap-4"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <span className="text-[10px] tracking-[0.3em] font-serif uppercase text-ink/40">向下滚动</span>
          <div className="w-[1px] h-12 bg-ink/20" />
        </motion.div>
      </div>
    </div>
  );
}

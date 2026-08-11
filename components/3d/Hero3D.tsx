'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function AnimatedCore() {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.x = time * 0.2;
    meshRef.current.rotation.y = time * 0.3;
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1.5}>
      <Sphere ref={meshRef} args={[1, 64, 64]} scale={1.8}>
        <MeshDistortMaterial
          color="#4f46e5"
          attach="material"
          distort={0.45}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          wireframe={false}
        />
      </Sphere>
    </Float>
  );
}

export default function Hero3D() {
  return (
    <div className="w-full h-[350px] md:h-[500px] relative">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#06b6d4" />
        <pointLight position={[-10, -10, -5]} intensity={1} color="#a855f7" />
        <ambientLight intensity={0.4} />
        <AnimatedCore />
      </Canvas>
    </div>
  );
}

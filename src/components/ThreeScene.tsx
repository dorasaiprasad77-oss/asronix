'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Trail } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

function FloatingParticles({ count = 50 }) {
  const meshRef = useRef<THREE.Points>(null);
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#00aaff"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function AsronixLogo3D() {
  const meshRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      meshRef.current.rotation.y += 0.005;
    }
    if (outerRef.current) {
      outerRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2 + 1) * 0.05;
      outerRef.current.rotation.y -= 0.003;
    }
  });

  return (
    <group>
      {/* Outer ring */}
      <mesh ref={outerRef}>
        <torusGeometry args={[2.2, 0.03, 32, 100]} />
        <MeshDistortMaterial
          color="#6a00ff"
          transparent
          opacity={0.4}
          distort={0.2}
          speed={2}
        />
      </mesh>

      {/* Middle ring */}
      <mesh rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[1.8, 0.02, 32, 100]} />
        <MeshDistortMaterial
          color="#00aaff"
          transparent
          opacity={0.6}
          distort={0.3}
          speed={1.5}
        />
      </mesh>

      {/* Core sphere - "A" letterform */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh ref={meshRef}>
          <dodecahedronGeometry args={[1.2, 0]} />
          <MeshDistortMaterial
            color="#00aaff"
            emissive="#6a00ff"
            emissiveIntensity={0.3}
            transparent
            opacity={0.9}
            distort={0.15}
            speed={2}
          />
        </mesh>
      </Float>

      {/* Orbiting small particles */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 2.8;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * radius, Math.sin(angle) * radius * 0.5, Math.sin(angle) * 0.5]}
          >
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color={i % 2 === 0 ? '#00aaff' : '#6a00ff'} />
          </mesh>
        );
      })}
    </group>
  );
}

export default function ThreeScene() {
  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-5, -5, -5]} intensity={0.3} color="#6a00ff" />
        <pointLight position={[0, 0, 3]} intensity={0.5} color="#00aaff" />

        <AsronixLogo3D />
        <FloatingParticles count={80} />
      </Canvas>
    </div>
  );
}

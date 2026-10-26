import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Procedural night-time skyline: towers rise out of a glowing grid, a branded
// location pin hovers over the landmark tower, and the camera drifts with the
// pointer and pulls back as the visitor scrolls.

const NAVY = new THREE.Color('#0b2a66');
const BLUE = new THREE.Color('#1d4ed8');
const STEEL = new THREE.Color('#1e3a8a');
const CORAL = new THREE.Color('#FF6B35');

// Deterministic PRNG so the skyline is identical on every visit
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeWindowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const rand = mulberry32(7);
  for (let y = 4; y < canvas.height - 4; y += 8) {
    for (let x = 4; x < canvas.width - 4; x += 10) {
      const lit = rand();
      if (lit > 0.45) {
        const warm = lit > 0.85;
        ctx.fillStyle = warm ? '#ffb27a' : `rgba(170, 205, 255, ${0.35 + lit * 0.5})`;
        ctx.fillRect(x, y, 6, 4);
      }
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.magFilter = THREE.NearestFilter;
  return tex;
}

interface Tower {
  x: number;
  z: number;
  w: number;
  d: number;
  h: number;
  delay: number;
  color: THREE.Color;
}

function useTowers(count: number) {
  return useMemo<Tower[]>(() => {
    const rand = mulberry32(42);
    const towers: Tower[] = [];
    const span = 13;
    let attempts = 0;
    while (towers.length < count && attempts < count * 20) {
      attempts++;
      const x = Math.round((rand() * 2 - 1) * span * 2) / 2;
      const z = Math.round((rand() * 2 - 1) * span * 0.75 * 2) / 2 - 2;
      if (Math.abs(x) < 1.6 && Math.abs(z + 2) < 1.6) continue; // keep the landmark plot clear
      if (towers.some((t) => Math.abs(t.x - x) < 1 && Math.abs(t.z - z) < 1)) continue;
      const dist = Math.hypot(x, z + 2);
      const h = Math.max(0.6, (1 - dist / (span * 1.1)) * 6.5 * (0.45 + rand() * 0.9));
      const palette = [NAVY, BLUE, STEEL];
      towers.push({
        x,
        z,
        w: 0.55 + rand() * 0.45,
        d: 0.55 + rand() * 0.45,
        h,
        delay: dist * 0.06 + rand() * 0.25,
        color: rand() > 0.94 ? CORAL.clone().multiplyScalar(0.7) : palette[Math.floor(rand() * palette.length)].clone()
      });
    }
    return towers;
  }, [count]);
}

const easeOutBack = (t: number) => {
  const c1 = 1.4;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

function Skyline({ count }: { count: number }) {
  const towers = useTowers(count);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const windowTex = useMemo(() => makeWindowTexture(), []);
  const start = useRef<number | null>(null);
  const done = useRef(false);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    towers.forEach((t, i) => mesh.setColorAt(i, t.color));
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [towers]);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh || done.current) return;
    if (start.current === null) start.current = clock.elapsedTime;
    const elapsed = clock.elapsedTime - start.current;
    let allDone = true;
    towers.forEach((t, i) => {
      const p = Math.min(1, Math.max(0, (elapsed - t.delay) / 1.1));
      if (p < 1) allDone = false;
      const s = Math.max(0.001, easeOutBack(p));
      dummy.position.set(t.x, (t.h * s) / 2, t.z);
      dummy.scale.set(t.w, t.h * s, t.d);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    done.current = allDone;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, towers.length]} castShadow={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        roughness={0.35}
        metalness={0.55}
        emissive={new THREE.Color('#ffffff')}
        emissiveMap={windowTex}
        emissiveIntensity={0.9}
      />
    </instancedMesh>
  );
}

function LandmarkTower() {
  const ringRef = useRef<THREE.Mesh>(null);
  const pinRef = useRef<THREE.Group>(null);
  const towerRef = useRef<THREE.Group>(null);
  const windowTex = useMemo(() => makeWindowTexture(), []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const rise = Math.min(1, t / 1.6);
    if (towerRef.current) towerRef.current.scale.y = Math.max(0.001, easeOutBack(rise));
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.8;
      ringRef.current.position.y = 4 + Math.sin(t * 1.2) * 1.8 + 1.8;
    }
    if (pinRef.current) {
      pinRef.current.position.y = 9.2 + Math.sin(t * 1.6) * 0.25;
      pinRef.current.rotation.y = t * 0.9;
      pinRef.current.scale.setScalar(Math.min(1, Math.max(0, (t - 1.2) / 0.6)));
    }
  });

  return (
    <group position={[0, 0, -2]}>
      <group ref={towerRef}>
        <mesh position={[0, 3.9, 0]}>
          <boxGeometry args={[1.5, 7.8, 1.5]} />
          <meshStandardMaterial
            color="#0f3b8c"
            metalness={0.7}
            roughness={0.2}
            emissive="#ffffff"
            emissiveMap={windowTex}
            emissiveIntensity={1.1}
          />
        </mesh>
        <mesh position={[0, 8.05, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.8, 8]} />
          <meshBasicMaterial color="#FF6B35" />
        </mesh>
      </group>
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.35, 0.035, 12, 64]} />
        <meshBasicMaterial color="#FF6B35" transparent opacity={0.85} />
      </mesh>
      {/* Brand location pin */}
      <group ref={pinRef} position={[0, 9.2, 0]}>
        <mesh position={[0, 0.25, 0]}>
          <sphereGeometry args={[0.42, 32, 32]} />
          <meshStandardMaterial color="#FF6B35" emissive="#FF6B35" emissiveIntensity={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.32, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.34, 0.75, 32]} />
          <meshStandardMaterial color="#FF6B35" emissive="#FF6B35" emissiveIntensity={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.25, 0.36]}>
          <sphereGeometry args={[0.13, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>
    </group>
  );
}

function Particles({ count = 260 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const rand = mulberry32(99);
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (rand() * 2 - 1) * 16;
      arr[i * 3 + 1] = rand() * 12;
      arr[i * 3 + 2] = (rand() * 2 - 1) * 10 - 2;
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    const pts = ref.current;
    if (!pts) return;
    const attr = pts.geometry.getAttribute('position') as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      let y = attr.getY(i) + delta * (0.25 + (i % 7) * 0.05);
      if (y > 12) y = 0;
      attr.setY(i, y);
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.06} color="#ffc4a8" transparent opacity={0.75} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function CameraRig() {
  const { camera, pointer } = useThree();
  const target = useMemo(() => new THREE.Vector3(0, 5.2, -2), []);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    const scroll = Math.min(1, window.scrollY / Math.max(1, window.innerHeight));
    const orbit = t * 0.06;
    const radius = 17 + scroll * 6;
    const desired = new THREE.Vector3(
      Math.sin(orbit) * radius * 0.35 + pointer.x * 2.2,
      6.5 + pointer.y * 1.4 + scroll * 5,
      Math.cos(orbit) * radius
    );
    camera.position.lerp(desired, 1 - Math.pow(0.001, delta));
    camera.lookAt(target);
  });

  return null;
}

function Ground() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, -2]}>
        <planeGeometry args={[80, 60]} />
        <meshStandardMaterial color="#020b24" roughness={0.9} metalness={0.1} />
      </mesh>
      <gridHelper args={[60, 60, '#FF6B35', '#1e3a8a']} position={[0, 0.005, -2]} />
    </group>
  );
}

export default function HeroScene() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const isSmall = typeof window !== 'undefined' && window.innerWidth < 768;

  // Stop rendering frames when the hero is scrolled out of view
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapperRef} className="absolute inset-0" aria-hidden="true">
      <Canvas
        frameloop={visible ? 'always' : 'never'}
        dpr={[1, isSmall ? 1.25 : 1.75]}
        camera={{ position: [0, 9, 22], fov: 42, near: 0.1, far: 120 }}
        gl={{ antialias: !isSmall, alpha: true, powerPreference: 'high-performance' }}
      >
        <fog attach="fog" args={['#001947', 14, 42]} />
        <ambientLight intensity={0.35} />
        <hemisphereLight args={['#6ea8ff', '#001133', 0.6]} />
        <directionalLight position={[8, 14, 6]} intensity={1.2} color="#ffd2b8" />
        <pointLight position={[0, 6, -2]} intensity={18} distance={14} color="#FF6B35" />
        <Ground />
        <Skyline count={isSmall ? 70 : 140} />
        <LandmarkTower />
        <Particles count={isSmall ? 120 : 260} />
        <CameraRig />
      </Canvas>
    </div>
  );
}

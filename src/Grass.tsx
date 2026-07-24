import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Brins d'herbe instanciés qui ondulent au vent
export default function Grass({ count = 5000, radius = 22 }: { count?: number; radius?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const positions = useMemo(() => {
    const arr: { x: number; z: number; s: number; r: number }[] = [];
    for (let i = 0; i < count; i++) {
      let x = 0, z = 0;
      let tries = 0;
      do {
        x = (Math.random() - 0.5) * radius * 2;
        z = (Math.random() - 0.5) * radius * 2;
        tries++;
      } while (Math.abs(x) < 3 && Math.abs(z) < 20 && tries < 10);
      const s = 0.7 + Math.random() * 0.8;
      const r = Math.random() * Math.PI;
      arr.push({ x, z, s, r });
    }
    return arr;
  }, [count, radius]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < positions.length; i++) {
      const p = positions[i];
      const sway = Math.sin(t * 1.5 + p.x * 0.3 + p.z * 0.2) * 0.12;
      dummy.position.set(p.x, 0.12 * p.s, p.z);
      dummy.rotation.set(sway, p.r, 0);
      dummy.scale.set(1, p.s, 1);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  // Texture de brin pour le material
  const bladeAlpha = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 16; c.height = 64;
    const ctx = c.getContext('2d')!;
    ctx.clearRect(0,0,16,64);
    // forme de brin pointu
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(8, 0);
    ctx.quadraticCurveTo(14, 30, 10, 64);
    ctx.lineTo(6, 64);
    ctx.quadraticCurveTo(2, 30, 8, 0);
    ctx.fill();
    const tex = new THREE.CanvasTexture(c);
    return tex;
  }, []);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} castShadow>
      <planeGeometry args={[0.12, 0.35]} />
      <meshStandardMaterial
        color="#4a9a3a"
        side={THREE.DoubleSide}
        roughness={1}
        transparent
        alphaMap={bladeAlpha}
        alphaTest={0.2}
      />
    </instancedMesh>
  );
}

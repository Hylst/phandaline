import { useMemo } from 'react';
import * as THREE from 'three';

interface RoomProps {
  isNight: boolean;
}

export default function Room({ isNight }: RoomProps) {
  const W = 10;
  const H = 4.5;
  const D = 10;

  // Procedural stone wall texture
  const stoneTexture = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 512;
    const ctx = c.getContext('2d')!;
    const base = isNight ? '#3a3631' : '#6b6357';
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, 512, 512);
    // stone blocks (brick-like staggered)
    const bh = 64;
    const bw = 128;
    for (let row = 0; row < 512 / bh; row++) {
      const offset = row % 2 === 0 ? 0 : bw / 2;
      for (let col = -1; col < 512 / bw + 1; col++) {
        const x = col * bw + offset;
        const y = row * bh;
        const v = Math.random() * 30 - 15;
        const r = (isNight ? 70 : 110) + v;
        const g = (isNight ? 64 : 99) + v;
        const b = (isNight ? 56 : 87) + v;
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(x + 3, y + 3, bw - 6, bh - 6);
        // subtle inner shading
        ctx.fillStyle = 'rgba(0,0,0,0.12)';
        ctx.fillRect(x + 3, y + bh - 12, bw - 6, 9);
        ctx.fillStyle = 'rgba(255,255,255,0.05)';
        ctx.fillRect(x + 3, y + 3, bw - 6, 6);
      }
    }
    // dark mortar lines
    ctx.strokeStyle = 'rgba(20,18,15,0.6)';
    ctx.lineWidth = 3;
    for (let row = 0; row <= 512 / bh; row++) {
      ctx.beginPath();
      ctx.moveTo(0, row * bh);
      ctx.lineTo(512, row * bh);
      ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2.5, 1.2);
    return tex;
  }, [isNight]);

  // Procedural stone floor texture
  const floorTexture = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 512;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = isNight ? '#33302a' : '#5a544a';
    ctx.fillRect(0, 0, 512, 512);
    const tile = 128;
    for (let y = 0; y < 512; y += tile) {
      for (let x = 0; x < 512; x += tile) {
        const v = Math.random() * 24 - 12;
        const r = (isNight ? 60 : 95) + v;
        const g = (isNight ? 56 : 88) + v;
        const b = (isNight ? 48 : 76) + v;
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(x + 4, y + 4, tile - 8, tile - 8);
        // cracks
        ctx.strokeStyle = 'rgba(0,0,0,0.25)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x + tile * 0.3, y + tile * 0.2);
        ctx.lineTo(x + tile * 0.5, y + tile * 0.7);
        ctx.stroke();
      }
    }
    ctx.strokeStyle = 'rgba(15,12,10,0.7)';
    ctx.lineWidth = 5;
    for (let i = 0; i <= 512; i += tile) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 512);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(512, i);
      ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 3);
    return tex;
  }, [isNight]);

  const woodColor = isNight ? '#2a1c11' : '#3a2718';
  const ceilingColor = isNight ? '#241a10' : '#3d2a18';

  return (
    <group>
      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial map={floorTexture} roughness={0.95} />
      </mesh>

      {/* back wall */}
      <mesh position={[0, H / 2, -D / 2]} receiveShadow>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial map={stoneTexture} roughness={1} side={THREE.DoubleSide} />
      </mesh>

      {/* left wall */}
      <mesh position={[-W / 2, H / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[D, H]} />
        <meshStandardMaterial map={stoneTexture} roughness={1} side={THREE.DoubleSide} />
      </mesh>

      {/* right wall with arched window */}
      <group position={[W / 2, H / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        {/* top */}
        <mesh position={[0, H / 2 - 0.6, 0]} receiveShadow>
          <planeGeometry args={[D, 1.2]} />
          <meshStandardMaterial map={stoneTexture} roughness={1} side={THREE.DoubleSide} />
        </mesh>
        {/* bottom */}
        <mesh position={[0, -H / 2 + 0.85, 0]} receiveShadow>
          <planeGeometry args={[D, 1.7]} />
          <meshStandardMaterial map={stoneTexture} roughness={1} side={THREE.DoubleSide} />
        </mesh>
        {/* left of window */}
        <mesh position={[-D / 2 + 2, 0.4, 0]} receiveShadow>
          <planeGeometry args={[4, 2.5]} />
          <meshStandardMaterial map={stoneTexture} roughness={1} side={THREE.DoubleSide} />
        </mesh>
        {/* right of window */}
        <mesh position={[D / 2 - 2, 0.4, 0]} receiveShadow>
          <planeGeometry args={[4, 2.5]} />
          <meshStandardMaterial map={stoneTexture} roughness={1} side={THREE.DoubleSide} />
        </mesh>
        {/* sky behind window */}
        <mesh position={[0, 0.6, -0.15]}>
          <planeGeometry args={[2, 2.4]} />
          <meshStandardMaterial
            color={isNight ? '#0a1430' : '#9ec5e8'}
            emissive={isNight ? '#1a2a55' : '#cfe4f5'}
            emissiveIntensity={isNight ? 0.5 : 0.7}
          />
        </mesh>
        {/* arched top of sky */}
        <mesh position={[0, 1.8, -0.15]}>
          <circleGeometry args={[1, 24, 0, Math.PI]} />
          <meshStandardMaterial
            color={isNight ? '#0a1430' : '#9ec5e8'}
            emissive={isNight ? '#1a2a55' : '#cfe4f5'}
            emissiveIntensity={isNight ? 0.5 : 0.7}
          />
        </mesh>
        {/* moon or sun */}
        <mesh position={[0.4, 1.2, -0.1]}>
          <circleGeometry args={[0.22, 24]} />
          <meshStandardMaterial
            color={isNight ? '#e8e4d0' : '#fff6c0'}
            emissive={isNight ? '#c0c0a0' : '#ffdd66'}
            emissiveIntensity={1.5}
          />
        </mesh>
        {/* window stone arch frame */}
        <mesh position={[0, 1.8, 0]} rotation={[0, 0, 0]}>
          <ringGeometry args={[1, 1.25, 24, 1, 0, Math.PI]} />
          <meshStandardMaterial color={isNight ? '#4a443a' : '#7a7264'} roughness={1} />
        </mesh>
        {/* window mullions (bars) */}
        <mesh position={[0, 0.6, 0.05]}>
          <boxGeometry args={[0.08, 2.4, 0.08]} />
          <meshStandardMaterial color="#2c2c30" metalness={0.5} roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.6, 0.05]}>
          <boxGeometry args={[2, 0.08, 0.08]} />
          <meshStandardMaterial color="#2c2c30" metalness={0.5} roughness={0.6} />
        </mesh>
      </group>

      {/* ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, H, 0]}>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial color={ceilingColor} roughness={1} />
      </mesh>

      {/* wooden ceiling beams */}
      {[-3.5, -1.75, 0, 1.75, 3.5].map((x, i) => (
        <mesh key={i} position={[x, H - 0.15, 0]} castShadow>
          <boxGeometry args={[0.3, 0.3, D]} />
          <meshStandardMaterial color={woodColor} roughness={0.9} />
        </mesh>
      ))}

      {/* big wooden cross-beam */}
      <mesh position={[0, H - 0.15, 0]} castShadow>
        <boxGeometry args={[W, 0.35, 0.4]} />
        <meshStandardMaterial color={woodColor} roughness={0.9} />
      </mesh>

      {/* stone baseboards / plinth */}
      {[
        { pos: [0, 0.2, -D / 2 + 0.05] as [number, number, number], rot: [0, 0, 0] as [number, number, number], len: W },
        { pos: [-W / 2 + 0.05, 0.2, 0] as [number, number, number], rot: [0, Math.PI / 2, 0] as [number, number, number], len: D },
        { pos: [W / 2 - 0.05, 0.2, 0] as [number, number, number], rot: [0, Math.PI / 2, 0] as [number, number, number], len: D },
      ].map((b, i) => (
        <mesh key={i} position={b.pos} rotation={b.rot}>
          <boxGeometry args={[b.len, 0.4, 0.1]} />
          <meshStandardMaterial color={isNight ? '#2a2620' : '#4a443a'} roughness={1} />
        </mesh>
      ))}

      {/* large banner on back wall */}
      <group position={[0, 2.6, -D / 2 + 0.08]}>
        <mesh>
          <planeGeometry args={[1.4, 2.4]} />
          <meshStandardMaterial color={isNight ? '#5a1520' : '#7a1f2b'} roughness={0.9} side={THREE.DoubleSide} />
        </mesh>
        {/* banner pole */}
        <mesh position={[0, 1.3, 0.05]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.05, 0.05, 1.7, 8]} />
          <meshStandardMaterial color="#3a2718" roughness={0.9} />
        </mesh>
        {/* gold emblem */}
        <mesh position={[0, 0.2, 0.02]}>
          <circleGeometry args={[0.35, 24]} />
          <meshStandardMaterial color="#c9a227" metalness={0.6} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.2, 0.03]}>
          <ringGeometry args={[0.2, 0.28, 6]} />
          <meshStandardMaterial color={isNight ? '#5a1520' : '#7a1f2b'} />
        </mesh>
      </group>

      {/* hanging iron chandelier */}
      <group position={[0, H - 0.3, 0]}>
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 0.4, 6]} />
          <meshStandardMaterial color="#2c2c30" />
        </mesh>
        <mesh>
          <torusGeometry args={[0.7, 0.04, 8, 24]} />
          <meshStandardMaterial color="#2c2c30" metalness={0.5} roughness={0.6} />
        </mesh>
        {Array.from({ length: 6 }).map((_, i) => {
          const a = (i / 6) * Math.PI * 2;
          return (
            <group key={i} position={[Math.cos(a) * 0.7, 0, Math.sin(a) * 0.7]}>
              <mesh position={[0, 0.08, 0]}>
                <cylinderGeometry args={[0.03, 0.03, 0.16, 8]} />
                <meshStandardMaterial color="#e8dcc0" />
              </mesh>
              <mesh position={[0, 0.2, 0]}>
                <coneGeometry args={[0.04, 0.12, 8]} />
                <meshStandardMaterial
                  color="#ffb030"
                  emissive="#ff8800"
                  emissiveIntensity={isNight ? 3 : 1}
                />
              </mesh>
            </group>
          );
        })}
        {isNight && <pointLight position={[0, -0.5, 0]} color="#ffaa55" intensity={1.5} distance={9} decay={2} />}
      </group>
    </group>
  );
}

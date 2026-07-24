import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { makePlasterTexture, makeStoneTexture, makeWoodTexture } from './textures';

function WavingBanner({ position, color }: { position: [number, number, number]; color: string }) {
  const flagRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (flagRef.current) {
      flagRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2.2) * 0.25;
      flagRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.4) * 0.08;
    }
  });
  return (
    <group position={position}>
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, 1.8, 6]} />
        <meshStandardMaterial color="#2a1810" roughness={0.9} />
      </mesh>
      <mesh ref={flagRef} position={[0.45, 1.15, 0]} castShadow>
        <planeGeometry args={[0.9, 0.55, 4, 1]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} roughness={0.95} />
      </mesh>
      {/* simple falcon emblem */}
      <mesh position={[0.45, 1.15, 0.012]}>
        <coneGeometry args={[0.13, 0.28, 3]} />
        <meshStandardMaterial color="#d8c06a" metalness={0.2} roughness={0.5} />
      </mesh>
    </group>
  );
}

function LitWindow({ position, rotationY = 0, isNight }: { position: [number, number, number]; rotationY?: number; isNight: boolean }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh>
        <boxGeometry args={[0.65, 0.85, 0.07]} />
        <meshStandardMaterial color={isNight ? '#ff9a3a' : '#fff0b8'} emissive={isNight ? '#ff7722' : '#fff0b8'} emissiveIntensity={isNight ? 2.1 : 0.18} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[0.07, 0.85, 0.04]} />
        <meshStandardMaterial color="#2a1810" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[0.65, 0.07, 0.04]} />
        <meshStandardMaterial color="#2a1810" roughness={0.8} />
      </mesh>
      {isNight && <pointLight position={[0, 0, 0.45]} color="#ffb060" intensity={0.45} distance={4} decay={2} />}
    </group>
  );
}

function Tower({ position, isNight }: { position: [number, number, number]; isNight: boolean }) {
  const stoneTex = useMemo(() => makeStoneTexture(isNight), [isNight]);
  const roofTex = useMemo(() => makeWoodTexture(isNight, 'roof'), [isNight]);
  return (
    <group position={position}>
      <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.95, 1.1, 5, 14]} />
        <meshStandardMaterial map={stoneTex} roughness={1} />
      </mesh>
      <mesh position={[0, 5.3, 0]} castShadow>
        <coneGeometry args={[1.25, 1.25, 14]} />
        <meshStandardMaterial map={roofTex} color={isNight ? '#281018' : '#7a2430'} roughness={1} />
      </mesh>
      <LitWindow position={[0, 2.7, 1.08]} isNight={isNight} />
      <LitWindow position={[0.75, 3.8, 0.75]} rotationY={Math.PI / 4} isNight={isNight} />
    </group>
  );
}

function DragonTomb({ position, isNight }: { position: [number, number, number]; isNight: boolean }) {
  const stoneTex = useMemo(() => makeStoneTexture(isNight), [isNight]);
  return (
    <group position={position}>
      <mesh position={[0, 0.18, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[1.6, 1.9, 0.35, 18]} />
        <meshStandardMaterial color={isNight ? '#25301f' : '#50603a'} roughness={1} />
      </mesh>
      <mesh position={[0, 0.65, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <boxGeometry args={[1.1, 0.75, 1.1]} />
        <meshStandardMaterial map={stoneTex} roughness={1} />
      </mesh>
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.11, 1.15, 8]} />
        <meshStandardMaterial color={isNight ? '#5b5547' : '#a08d63'} roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.82, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.055, 0.055, 0.65, 8]} />
        <meshStandardMaterial color={isNight ? '#5b5547' : '#a08d63'} roughness={0.8} />
      </mesh>
      {/* dragon green memory flame */}
      <mesh position={[0, 2.1, 0]}>
        <sphereGeometry args={[0.15, 10, 10]} />
        <meshStandardMaterial color="#40ff80" emissive="#20ff60" emissiveIntensity={isNight ? 2.5 : 0.7} transparent opacity={0.75} />
      </mesh>
      {isNight && <pointLight position={[0, 2.1, 0]} color="#40ff80" intensity={1.2} distance={6} decay={2} />}
    </group>
  );
}

export default function Mansion({ isNight }: { isNight: boolean }) {
  const stoneTex = useMemo(() => makeStoneTexture(isNight), [isNight]);
  const woodTex = useMemo(() => makeWoodTexture(isNight, 'dark'), [isNight]);
  const roofTex = useMemo(() => makeWoodTexture(isNight, 'roof'), [isNight]);
  const plasterTex = useMemo(() => makePlasterTexture(isNight), [isNight]);

  return (
    <group position={[0, 0, -52]}>
      {/* hill above Phandaline */}
      <mesh position={[0, 0.15, 0]} receiveShadow>
        <cylinderGeometry args={[11, 14, 0.45, 22]} />
        <meshStandardMaterial color={isNight ? '#1d2918' : '#405c2b'} roughness={1} />
      </mesh>
      {/* stone road from north gate */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.42, 7.5]} receiveShadow>
        <planeGeometry args={[3.2, 17]} />
        <meshStandardMaterial map={stoneTex} roughness={1} />
      </mesh>

      {/* curtain wall of the manor court */}
      {[
        [0, 0.95, -7.2, 12.5, 1.7, 0.45],
        [0, 0.95, 7.2, 12.5, 1.7, 0.45],
        [-7.2, 0.95, 0, 0.45, 1.7, 14],
        [7.2, 0.95, 0, 0.45, 1.7, 14],
      ].map(([x, y, z, sx, sy, sz], i) => (
        <mesh key={i} position={[x, y, z]} castShadow receiveShadow>
          <boxGeometry args={[sx, sy, sz]} />
          <meshStandardMaterial map={stoneTex} roughness={1} />
        </mesh>
      ))}

      {/* main manor */}
      <mesh position={[0, 1.25, -0.3]} castShadow receiveShadow>
        <boxGeometry args={[8.8, 2.2, 5.8]} />
        <meshStandardMaterial map={stoneTex} roughness={1} />
      </mesh>
      <mesh position={[0, 3.45, -0.3]} castShadow receiveShadow>
        <boxGeometry args={[9.2, 2.2, 6.1]} />
        <meshStandardMaterial map={plasterTex} roughness={0.95} />
      </mesh>
      {/* half-timbering */}
      {[-4.3, -2.1, 0, 2.1, 4.3].map((x, i) => (
        <mesh key={i} position={[x, 3.45, 2.78]} castShadow>
          <boxGeometry args={[0.16, 2.25, 0.08]} />
          <meshStandardMaterial map={woodTex} color="#2a1810" roughness={0.9} />
        </mesh>
      ))}
      {[2.4, 3.45, 4.5].map((y, i) => (
        <mesh key={i} position={[0, y, 2.82]} castShadow>
          <boxGeometry args={[9.2, 0.16, 0.08]} />
          <meshStandardMaterial map={woodTex} color="#2a1810" roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[0, 5.05, -0.3]} rotation={[Math.PI / 2, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[4.95, 4.95, 7.2, 3, 1, false, Math.PI]} />
        <meshStandardMaterial map={roofTex} color={isNight ? '#281018' : '#6b1f2b'} roughness={1} />
      </mesh>
      <mesh position={[0, 5.75, 0]} castShadow>
        <boxGeometry args={[0.18, 0.16, 7.5]} />
        <meshStandardMaterial map={woodTex} roughness={0.9} />
      </mesh>

      {/* towers */}
      <Tower position={[-5.2, 0.35, -3.4]} isNight={isNight} />
      <Tower position={[5.2, 0.35, -3.4]} isNight={isNight} />
      <Tower position={[-5.2, 0.35, 3.1]} isNight={isNight} />
      <Tower position={[5.2, 0.35, 3.1]} isNight={isNight} />

      {/* doors and windows */}
      <mesh position={[0, 1.05, 2.68]} castShadow>
        <boxGeometry args={[1.25, 1.9, 0.12]} />
        <meshStandardMaterial map={woodTex} color="#1a0f08" roughness={0.9} />
      </mesh>
      <mesh position={[0, 2.05, 2.75]}>
        <ringGeometry args={[0.55, 0.75, 18, 1, Math.PI, Math.PI]} />
        <meshStandardMaterial map={stoneTex} side={THREE.DoubleSide} roughness={1} />
      </mesh>
      {[-3, -1.4, 1.4, 3].map((x, i) => (
        <LitWindow key={i} position={[x, 3.5, 2.9]} isNight={isNight} />
      ))}
      {[-2.5, 2.5].map((x, i) => (
        <LitWindow key={i} position={[x, 1.25, 2.9]} isNight={isNight} />
      ))}

      {/* Phlandys banners and dragon memorial */}
      <WavingBanner position={[-3.6, 5.2, 2.95]} color="#204080" />
      <WavingBanner position={[3.6, 5.2, 2.95]} color="#a02020" />
      <DragonTomb position={[8.5, 0.35, 0]} isNight={isNight} />

      {/* magical blue glow from Phancreux water channel */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-8.8, 0.5, -0.5]}>
        <planeGeometry args={[1.3, 8]} />
        <meshStandardMaterial color="#2aa8ff" emissive="#1478ff" emissiveIntensity={isNight ? 1.2 : 0.35} transparent opacity={0.65} />
      </mesh>
      {isNight && <pointLight position={[-8.8, 1, -0.5]} color="#2aa8ff" intensity={1.4} distance={8} decay={2} />}
    </group>
  );
}
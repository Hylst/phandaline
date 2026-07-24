import { useRef, useState, useEffect, ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useGame, playerWorld } from './store';
import { audio } from './audio';

const PICK_RANGE = 2.5;

export default function QuestItem({
  position,
  label,
  onPickup,
  children,
}: {
  position: [number, number, number];
  label: string;
  onPickup: () => void;
  children: ReactNode;
}) {
  const [inRange, setInRange] = useState(false);
  const inRangeRef = useRef(false);
  const ringRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const cameraMode = useGame((s) => s.cameraMode);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== 'KeyE') return;
      const st = useGame.getState();
      if (!st.dialogue && inRangeRef.current && st.cameraMode !== 'orbit') {
        audio.playPickup();
        onPickup();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onPickup]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // halo doré pulsant
    if (ringRef.current) {
      const s = 1 + Math.sin(t * 3) * 0.12;
      ringRef.current.scale.set(s, s, 1);
      ringRef.current.rotation.z = t * 0.8;
    }
    // léger flottement de l'objet
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(t * 2.2) * 0.05;
    }
    const st = useGame.getState();
    const playerMode = st.cameraMode !== 'orbit' && playerWorld.active;
    let dist = Infinity;
    if (playerMode) {
      dist = Math.hypot(position[0] - playerWorld.pos.x, position[2] - playerWorld.pos.z);
    }
    const ir = dist < PICK_RANGE;
    if (ir !== inRangeRef.current) {
      inRangeRef.current = ir;
      setInRange(ir);
    }
  });

  return (
    <group position={position}>
      <group
        ref={groupRef}
        onClick={(e) => {
          e.stopPropagation();
          audio.playPickup();
          onPickup();
        }}
      >
        {children}
      </group>
      {/* halo au sol */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[0.45, 0.6, 24]} />
        <meshStandardMaterial
          color="#ffd040"
          emissive="#ffaa00"
          emissiveIntensity={1.5}
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* étiquette */}
      <Html position={[0, 1.1, 0]} center distanceFactor={10} zIndexRange={[10, 0]}>
        <div
          className="pointer-events-none select-none whitespace-nowrap rounded-md border border-amber-500 bg-[#1a130c]/90 px-2 py-1 text-center shadow-lg"
          style={{ fontFamily: 'serif' }}
        >
          <div className="text-[11px] font-bold text-amber-300">✨ {label}</div>
          <div className="text-[9px] text-amber-100/80">
            {cameraMode === 'orbit' ? 'Cliquer pour ramasser' : inRange ? '[E] Ramasser' : ''}
          </div>
        </div>
      </Html>
    </group>
  );
}

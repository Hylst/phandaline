import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import Character from './Characters';
import { useGame, playerWorld } from './store';
import { audio } from './audio';

const PATROL_RANGE = 4.0;

export function GoblinScout({ startPos, radius = 6, speed = 0.4 }: {
  startPos: [number, number, number];
  radius?: number;
  speed?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [defeated, setDefeated] = useState(false);
  const [inRange, setInRange] = useState(false);
  const inRangeRef = useRef(false);

  useFrame((state) => {
    if (defeated || !groupRef.current) return;
    const t = state.clock.elapsedTime * speed * 0.3;
    groupRef.current.position.x = startPos[0] + Math.cos(t) * radius;
    groupRef.current.position.z = startPos[2] + Math.sin(t * 1.3) * radius;
    groupRef.current.rotation.y = Math.atan2(-Math.sin(t), Math.cos(t * 1.3) * 1.3);

    const st = useGame.getState();
    const playerMode = st.cameraMode !== 'orbit' && playerWorld.active;
    if (playerMode) {
      const dx = playerWorld.pos.x - groupRef.current.position.x;
      const dz = playerWorld.pos.z - groupRef.current.position.z;
      const dist = Math.hypot(dx, dz);
      const ir = dist < PATROL_RANGE;
      if (ir !== inRangeRef.current) {
        inRangeRef.current = ir;
        setInRange(ir);
        if (ir) audio.playAlert();
      }
    }
  });

  const defeat = () => {
    setDefeated(true);
    audio.playSwordSlash();
    audio.playGoldCollect();
    const st = useGame.getState();
    st.addGold(5);
    st.addDefeat('goblin');
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== 'KeyE' || defeated) return;
      const st = useGame.getState();
      if (!st.dialogue && inRangeRef.current && st.cameraMode !== 'orbit') {
        defeat();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [defeated]);

  if (defeated) return null;

  const h = 2.2;

  return (
    <group ref={groupRef} position={startPos}>
      <group scale={0.78} onClick={(e) => { e.stopPropagation(); defeat(); }}>
        <Character
          position={[0, 0, 0]}
          rotationY={0}
          color="#2a4a2a"
          pantColor="#1a2a1a"
          hatType="none"
          hairColor="#1a2a0a"
          skinColor="#6a8a4a"
          species="goblin"
          variant={0}
          animate={false}
          walking
          walkSpeed={speed * 1.5}
        />
      </group>
      {inRange && (
        <Html position={[0, h, 0]} center distanceFactor={10} zIndexRange={[15, 0]}>
          <div className="pointer-events-none whitespace-nowrap rounded-md border border-red-700/60 bg-red-950/90 px-2 py-1 font-serif text-[10px] font-bold text-red-300 shadow-lg">
            👺 Éclaireur Gobelin
            <br /><span className="text-[8px] text-red-200/70">[E] Attaquer !</span>
          </div>
        </Html>
      )}
    </group>
  );
}

export function RedbrandMarauder({ startPos, radius = 5, speed = 0.5 }: {
  startPos: [number, number, number];
  radius?: number;
  speed?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [defeated, setDefeated] = useState(false);
  const [inRange, setInRange] = useState(false);
  const inRangeRef = useRef(false);

  useFrame((state) => {
    if (defeated || !groupRef.current) return;
    const t = state.clock.elapsedTime * speed * 0.25;
    groupRef.current.position.x = startPos[0] + Math.cos(t + 1) * radius;
    groupRef.current.position.z = startPos[2] + Math.sin(t * 1.5 + 1) * radius;
    groupRef.current.rotation.y = Math.atan2(Math.sin(t + 1), -Math.cos(t * 1.5 + 1) * 1.5);

    const st = useGame.getState();
    const playerMode = st.cameraMode !== 'orbit' && playerWorld.active;
    if (playerMode) {
      const dx = playerWorld.pos.x - groupRef.current.position.x;
      const dz = playerWorld.pos.z - groupRef.current.position.z;
      const dist = Math.hypot(dx, dz);
      const ir = dist < PATROL_RANGE;
      if (ir !== inRangeRef.current) {
        inRangeRef.current = ir;
        setInRange(ir);
        if (ir) audio.playAlert();
      }
    }
  });

  const defeat = () => {
    setDefeated(true);
    audio.playSwordSlash();
    audio.playGoldCollect();
    const st = useGame.getState();
    st.addGold(8);
    st.addDefeat('redbrand');
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== 'KeyE' || defeated) return;
      const st = useGame.getState();
      if (!st.dialogue && inRangeRef.current && st.cameraMode !== 'orbit') {
        defeat();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [defeated]);

  if (defeated) return null;

  const h = 2.45;

  return (
    <group ref={groupRef} position={startPos}>
      <group onClick={(e) => { e.stopPropagation(); defeat(); }}>
        <Character
          position={[0, 0, 0]}
          rotationY={0}
          color="#7a2020"
          pantColor="#3a1010"
          hatType="helm"
          hatColor="#4a1515"
          hairColor="#1a0808"
          skinColor="#d0a080"
          variant={1}
          animate={false}
          walking
          walkSpeed={speed}
          accessory="staff"
        />
      </group>
      {inRange && (
        <Html position={[0, h, 0]} center distanceFactor={10} zIndexRange={[15, 0]}>
          <div className="pointer-events-none whitespace-nowrap rounded-md border border-red-700/70 bg-red-950/90 px-2 py-1 font-serif text-[10px] font-bold text-red-300 shadow-lg">
            🛡️ Fers Rouges — Maraudeur
            <br /><span className="text-[8px] text-red-200/70">[E] Affronter !</span>
          </div>
        </Html>
      )}
    </group>
  );
}

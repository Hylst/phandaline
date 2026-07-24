import { useRef, useState, useEffect, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import Character from './Characters';
import { NpcDef, npcScript } from './npcData';
import { useGame, playerWorld } from './store';
import { audio } from './audio';

const TALK_RANGE = 3.2;
const LEAVE_RANGE = 5.5;

function shortestAngle(a: number): number {
  while (a > Math.PI) a -= Math.PI * 2;
  while (a < -Math.PI) a += Math.PI * 2;
  return a;
}

const HAMMER_INTERVAL = 1.2;

export default function InteractiveNPC({ def }: { def: NpcDef }) {
  const lastHammerTime = useRef(0);
  const lastActionSfx = useRef(0);
  const dialogue = useGame((s) => s.dialogue);
  const quests = useGame((s) => s.quests);
  const cameraMode = useGame((s) => s.cameraMode);
  const isTalking = dialogue?.npcId === def.id;
  const [inRange, setInRange] = useState(false);
  const inRangeRef = useRef(false);
  const groupRef = useRef<THREE.Group>(null);

  const script = npcScript(def.id, quests);
  const lineIdx = isTalking ? Math.min(dialogue!.line, script.lines.length - 1) : 0;
  const isLastLine = lineIdx >= script.lines.length - 1;


  const advance = useCallback(() => {
    const st = useGame.getState();
    if (st.dialogue?.npcId !== def.id) return;
    const sc = npcScript(def.id, st.quests);
    audio.playDialogueNext();
    if (st.dialogue.line + 1 < sc.lines.length) {
      st.setLine(st.dialogue.line + 1);
    } else {
      sc.onEnd?.();
      st.endDialogue();
      audio.playDialogueClose();
    }
  }, [def.id, voice.pitch, voice.rate]);

  // Touche E : parler / continuer
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== 'KeyE') return;
      const st = useGame.getState();
      if (st.dialogue?.npcId === def.id) {
        advance();
      } else if (!st.dialogue && inRangeRef.current && st.cameraMode !== 'orbit') {
        st.startDialogue(def.id);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [def.id, advance]);

  // Jouer son d'ouverture de dialogue + première ligne
  useEffect(() => {
    if (dialogue?.npcId === def.id && dialogue.line === 0) {
      audio.playDialogueOpen();
      const sc = npcScript(def.id, useGame.getState().quests);
      setTimeout(() => {
      }, 200);
    }
  }, [dialogue?.npcId, dialogue?.line, def.id]);

  useFrame((state) => {
    const st = useGame.getState();
    const playerMode = st.cameraMode !== 'orbit' && playerWorld.active;
    let dist = Infinity;
    if (playerMode) {
      dist = Math.hypot(def.position[0] - playerWorld.pos.x, def.position[2] - playerWorld.pos.z);
    }
    const ir = dist < TALK_RANGE;
    if (ir !== inRangeRef.current) {
      inRangeRef.current = ir;
      setInRange(ir);
    }
    // Le PNJ se tourne vers le joueur quand il est proche ou qu'il parle
    if (groupRef.current) {
      let target = def.rotationY;
      if (playerMode && (ir || st.dialogue?.npcId === def.id)) {
        const dx = playerWorld.pos.x - def.position[0];
        const dz = playerWorld.pos.z - def.position[2];
        target = Math.atan2(dx, dz);
      }
      groupRef.current.rotation.y += shortestAngle(target - groupRef.current.rotation.y) * 0.08;
    }
    // Fermer le dialogue si le joueur s'éloigne
    if (st.dialogue?.npcId === def.id && playerMode && dist > LEAVE_RANGE) {
      st.endDialogue();
    }
    // SFX d'action : chaque artisan / héros existe aussi hors dialogue.
    if (def.id === 'anton' && def.appearance.action === 'hammer' && !isTalking) {
      const t2 = state.clock.elapsedTime;
      if (Math.floor(t2 / HAMMER_INTERVAL) > lastHammerTime.current) {
        lastHammerTime.current = Math.floor(t2 / HAMMER_INTERVAL);
        audio.playHammer();
      }
    }
    if (!isTalking) {
      const t2 = state.clock.elapsedTime;
      if (t2 - lastActionSfx.current > 5.5) {
        if (def.appearance.accessory === 'lute') {
          audio.playLuteString();
          lastActionSfx.current = t2;
        }
        if (def.appearance.accessory === 'staff' && (def.id === 'azureas' || def.id === 'sindaros')) {
          audio.playSpellCast();
          lastActionSfx.current = t2;
        }
        if (def.appearance.accessory === 'pan') {
          audio.playCookingBubble();
          lastActionSfx.current = t2;
        }
      }
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    const st = useGame.getState();
    if (st.dialogue?.npcId === def.id) advance();
    else if (!st.dialogue) st.startDialogue(def.id);
  };

  const headHeight = 2.45 * (def.scale ?? 1);

  return (
    <group position={def.position}>
      <group ref={groupRef} rotation={[0, def.rotationY, 0]} scale={def.scale ?? 1} onClick={handleClick}>
        <Character
          position={[0, 0, 0]}
          {...def.appearance}
          action={isTalking ? 'idle' : def.appearance.action}
          talking={isTalking}
        />
      </group>

      {/* Marqueur 💬 en mode observation, ou prompt E à proximité */}
      {!isTalking && (cameraMode === 'orbit' || inRange) && (
        <Html position={[0, headHeight + 0.25, 0]} center distanceFactor={12} zIndexRange={[10, 0]}>
          <div
            className="pointer-events-none select-none whitespace-nowrap rounded-md border border-amber-600/70 bg-[#1a130c]/90 px-2 py-1 text-center shadow-lg"
            style={{ fontFamily: 'serif' }}
          >
            <div className="text-[11px] font-bold text-amber-300">💬 {def.name}</div>
            {inRange && cameraMode !== 'orbit' && (
              <div className="text-[9px] text-amber-100/80">[E] Parler</div>
            )}
            {cameraMode === 'orbit' && (
              <div className="text-[9px] text-amber-100/60">Cliquer pour parler</div>
            )}
          </div>
        </Html>
      )}

      {/* Bulle de dialogue */}
      {isTalking && (
        <Html position={[0, headHeight + 0.45, 0]} center distanceFactor={9} zIndexRange={[100, 50]}>
          <div
            className="pointer-events-auto w-[300px] select-none rounded-lg border-2 border-amber-600 bg-gradient-to-b from-[#f5e8cc] to-[#e8d4ac] p-3 shadow-2xl"
            style={{ fontFamily: 'serif' }}
            onClick={(e) => {
              e.stopPropagation();
              advance();
            }}
          >
            <div className="mb-1 flex items-baseline justify-between border-b border-amber-800/40 pb-1">
              <span className="text-[13px] font-bold text-amber-900">{def.name}</span>
              <span className="text-[9px] italic text-amber-800/70">{def.role}</span>
            </div>
            <p className="text-[12px] leading-snug text-stone-800">{script.lines[lineIdx]}</p>
            <div className="mt-1.5 text-right text-[9px] font-semibold text-amber-800/80">
              {isLastLine ? '[E] Terminer ✕' : `[E] Suite ▸ ${lineIdx + 1}/${script.lines.length}`}
            </div>
            {/* petite flèche de bulle */}
            <div
              className="absolute left-1/2 top-full -translate-x-1/2"
              style={{
                width: 0,
                height: 0,
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderTop: '10px solid #d97706',
              }}
            />
          </div>
        </Html>
      )}
    </group>
  );
}

import { create } from 'zustand';
import * as THREE from 'three';

// Position du joueur partagée (mutable, hors React pour la perf)
export const playerWorld = {
  pos: new THREE.Vector3(0, 0, 6),
  active: false,
};

export type QuestId = 'apples' | 'hammer' | 'letter';
export type QuestStatus = 'none' | 'active' | 'found' | 'done';
export type CameraMode = 'orbit' | 'first' | 'third';

interface GameState {
  gold: number;
  reputation: number;
  defeated: { goblins: number; redbrands: number };
  quests: Record<QuestId, QuestStatus>;
  dialogue: { npcId: string; line: number } | null;
  cameraMode: CameraMode;
  setCameraMode: (m: CameraMode) => void;
  startDialogue: (npcId: string) => void;
  setLine: (line: number) => void;
  endDialogue: () => void;
  setQuest: (id: QuestId, s: QuestStatus) => void;
  addGold: (n: number) => void;
  addReputation: (n: number) => void;
  addDefeat: (kind: 'goblin' | 'redbrand') => void;
}

export const useGame = create<GameState>((set) => ({
  gold: 0,
  reputation: 0,
  defeated: { goblins: 0, redbrands: 0 },
  quests: { apples: 'none', hammer: 'none', letter: 'none' },
  dialogue: null,
  cameraMode: 'orbit',
  setCameraMode: (m) => set({ cameraMode: m }),
  startDialogue: (npcId) => set({ dialogue: { npcId, line: 0 } }),
  setLine: (line) => set((s) => (s.dialogue ? { dialogue: { ...s.dialogue, line } } : {})),
  endDialogue: () => set({ dialogue: null }),
  setQuest: (id, st) => set((s) => ({ quests: { ...s.quests, [id]: st } })),
  addGold: (n) => set((s) => ({ gold: s.gold + n })),
  addReputation: (n) => set((s) => ({ reputation: s.reputation + n })),
  addDefeat: (kind) => set((s) => ({
    defeated: {
      goblins: s.defeated.goblins + (kind === 'goblin' ? 1 : 0),
      redbrands: s.defeated.redbrands + (kind === 'redbrand' ? 1 : 0),
    },
    reputation: s.reputation + (kind === 'goblin' ? 1 : 2),
  })),
}));

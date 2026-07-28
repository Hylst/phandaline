import { useState, Suspense, useMemo, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky, Stars } from '@react-three/drei';
import * as THREE from 'three';
import Village from './Village';
import Mansion from './Mansion';
import Character, { Knight, WanderingNPC } from './Characters';
import { GoblinScout, RedbrandMarauder } from './Encounters';
import PlayerController from './PlayerController';
import InteractiveNPC from './InteractiveNPC';
import QuestItem from './QuestItem';
import { NPC_DEFS } from './npcData';
import { useGame, CameraMode } from './store';
import { audio } from './audio';
import Onboarding from './Onboarding';

export default function App() {
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [isNight, setIsNight] = useState(false);
  const [musicOn, setMusicOn] = useState(true);
  const [mode, setMode] = useState<CameraMode>('orbit');
  const [loading, setLoading] = useState(false);
  const gold = useGame((s) => s.gold);
  const reputation = useGame((s) => s.reputation);
  const defeated = useGame((s) => s.defeated);
  const quests = useGame((s) => s.quests);
  const dialogue = useGame((s) => s.dialogue);

  // synchronise le mode caméra avec le store de jeu
  useEffect(() => {
    useGame.getState().setCameraMode(mode);
  }, [mode]);

  // Charge la musique au montage, démarre au premier clic
  useEffect(() => {
    audio.loadMusic('./balade.mp3');
    const startAudio = () => {
      audio.resume();
      audio.startMusic();
      window.removeEventListener('click', startAudio);
      window.removeEventListener('keydown', startAudio);
    };
    window.addEventListener('click', startAudio);
    window.addEventListener('keydown', startAudio);
    return () => {
      window.removeEventListener('click', startAudio);
      window.removeEventListener('keydown', startAudio);
    };
  }, []);

  // Joue un son quand une quête est terminée
  const prevQuests = useMemo(() => ({ ...quests }), []);
  useEffect(() => {
    Object.keys(quests).forEach((key) => {
      const k = key as keyof typeof quests;
      if (quests[k] === 'done' && prevQuests[k] !== 'done') {
        audio.playQuestComplete();
        audio.playGoldCollect();
      }
      if (quests[k] === 'found' && prevQuests[k] === 'active') {
        audio.playPickup();
      }
    });
  }, [quests]);



  // Paramètres d'éclairage corrigés et plus marqués
  const lighting = useMemo(() => {
    if (isNight) {
      return {
        sunIntensity: 0.2,
        sunColor: '#aabbdd',
        ambientIntensity: 0.22,
        ambientColor: '#4a5577',
        hemiSky: '#3a4a6a',
        hemiGround: '#1a1a1a',
        hemiIntensity: 0.25,
        sunPosition: [5, 6, -8] as [number, number, number],
      };
    }
    // JOUR : lumineux et chaud
    return {
      sunIntensity: 2.2,
      sunColor: '#fff1c8',
      ambientIntensity: 0.75,
      ambientColor: '#fff5e0',
      hemiSky: '#87ceeb',
      hemiGround: '#6a8a3a',
      hemiIntensity: 0.8,
      sunPosition: [20, 30, 15] as [number, number, number],
    };
  }, [isNight]);

  if (!onboardingDone) {
    return (
      <Onboarding onComplete={() => {
        setOnboardingDone(true);
        setLoading(true);
        setTimeout(() => setLoading(false), 500);
      }} />
    );
  }

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
        <div className="text-center">
          <p className="text-2xl font-serif text-amber-300 animate-pulse">Chargement du monde...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black font-serif">
      {/* Crédit en bas */}
      <div className="pointer-events-none absolute bottom-1 left-0 right-0 z-50 text-center text-[9px]" style={{ color: '#332211', fontFamily: 'serif' }}>
        <span style={{ color: '#554433' }}>Geoffroy Streit</span> — <span style={{ color: '#443322' }}>Rôliste Fantasque</span>
      </div>
      <Canvas
        shadows
        camera={{ position: mode === 'orbit' ? [32, 28, 44] : [0, 1.6, 5], fov: 65 }}
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          {/* Ciel */}
          {isNight ? (
            <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />
          ) : (
            <Sky
              distance={450000}
              sunPosition={lighting.sunPosition}
              inclination={0.5}
              azimuth={0.25}
              turbidity={8}
              rayleigh={3}
            />
          )}

          <fog attach="fog" args={[isNight ? '#0a0e1a' : '#b8d0e8', 55, 160]} />

          {/* Ambiante */}
          <ambientLight intensity={lighting.ambientIntensity} color={lighting.ambientColor} />

          {/* Soleil / Lune */}
          <directionalLight
            position={lighting.sunPosition}
            intensity={lighting.sunIntensity}
            color={lighting.sunColor}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-left={-50}
            shadow-camera-right={50}
            shadow-camera-top={50}
            shadow-camera-bottom={-50}
            shadow-camera-near={1}
            shadow-camera-far={90}
          />

          {/* Remplissage hémisphère */}
          <hemisphereLight
            args={[lighting.hemiSky, lighting.hemiGround, lighting.hemiIntensity]}
          />

          <Village isNight={isNight} />
          <Mansion isNight={isNight} />

          {/* Gardes des portes (ambiance) */}
          <Knight position={[-2.5, 0, -31.2]} rotationY={Math.PI} />
          <Knight position={[2.5, 0, -31.2]} rotationY={Math.PI} />
          <Knight position={[-2.5, 0, 31.2]} rotationY={0} />
          <Knight position={[2.5, 0, 31.2]} rotationY={0} />

          {/* ===== PNJ INTERACTIFS (dialogues + quêtes) ===== */}
          {NPC_DEFS.map((def) => (
            <InteractiveNPC key={def.id} def={def} />
          ))}

          {/* ===== OBJETS DE QUÊTE ===== */}
          {quests.apples === 'active' && (
            <QuestItem
              position={[1.5, 0, 27.5]}
              label="Sac de pommes"
              onPickup={() => useGame.getState().setQuest('apples', 'found')}
            >
              {/* sac de toile */}
              <mesh position={[0, 0.3, 0]} castShadow>
                <sphereGeometry args={[0.32, 10, 10]} />
                <meshStandardMaterial color="#b09a6a" roughness={1} />
              </mesh>
              <mesh position={[0, 0.62, 0]} castShadow>
                <cylinderGeometry args={[0.06, 0.1, 0.15, 8]} />
                <meshStandardMaterial color="#8a7a50" roughness={1} />
              </mesh>
              {/* pommes qui dépassent */}
              {[[-0.15, 0.45, 0.2], [0.18, 0.5, 0.12], [0.02, 0.42, 0.28]].map(([x, y, z], i) => (
                <mesh key={i} position={[x, y, z]} castShadow>
                  <sphereGeometry args={[0.08, 8, 8]} />
                  <meshStandardMaterial color="#c0282a" roughness={0.4} />
                </mesh>
              ))}
            </QuestItem>
          )}
          {quests.hammer === 'active' && (
            <QuestItem
              position={[18.6, 0, -16.2]}
              label="Marteau de forge"
              onPickup={() => useGame.getState().setQuest('hammer', 'found')}
            >
              <group rotation={[0, 0.6, Math.PI / 2.3]} position={[0, 0.18, 0]}>
                <mesh castShadow>
                  <cylinderGeometry args={[0.035, 0.035, 0.6, 8]} />
                  <meshStandardMaterial color="#5a3d24" roughness={0.9} />
                </mesh>
                <mesh position={[0, 0.3, 0]} castShadow>
                  <boxGeometry args={[0.22, 0.13, 0.13]} />
                  <meshStandardMaterial color="#3a3a40" metalness={0.7} roughness={0.4} />
                </mesh>
              </group>
            </QuestItem>
          )}
          {/* Enclume du forgeron sur billot */}
          <group position={[6.1, 0, -4.7]}>
            <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.32, 0.38, 0.5, 12]} />
              <meshStandardMaterial color="#3a2718" roughness={1} />
            </mesh>
            <mesh position={[0, 0.58, 0]} castShadow>
              <boxGeometry args={[0.6, 0.18, 0.3]} />
              <meshStandardMaterial color="#3a3a40" metalness={0.7} roughness={0.4} />
            </mesh>
            <mesh position={[0.4, 0.58, 0]} rotation={[0, 0, -0.1]} castShadow>
              <coneGeometry args={[0.09, 0.35, 10]} />
              <meshStandardMaterial color="#3a3a40" metalness={0.7} roughness={0.4} />
            </mesh>
            {/* lame en cours de forge, rougeoyante */}
            <mesh position={[-0.1, 0.69, 0]} rotation={[0, 0.3, 0]}>
              <boxGeometry args={[0.45, 0.025, 0.08]} />
              <meshStandardMaterial color="#ff5510" emissive="#ff3300" emissiveIntensity={1.6} />
            </mesh>
           </group>
           {/* Habitants d'ambiance (non interactifs) */}
           <Character position={[26.5, 0, 22.6]} rotationY={-0.4} color="#7a6a3a" hatType="none" hairColor="#6a4a20" action="carry" variant={1} />
           <Character position={[-18, 0, -13.5]} rotationY={1.1} color="#8a4a6a" hatType="hood" hatColor="#5a3040" skinColor="#e0b090" action="idle" variant={2} />
           <Character position={[21, 0, -3.8]} rotationY={-1.6} color="#3a5a7a" hatType="conical" hatColor="#2a1810" hairColor="#2a1810" action="wave" variant={1} />
           {/* Sergent des Serres en patrouille */}
           <Knight position={[-15, 0, 8]} rotationY={Math.PI / 3} />
           <Knight position={[15, 0, -8]} rotationY={-Math.PI * 0.8} />

          {/* PNJ marcheurs */}
          <WanderingNPC startPos={[-7.5, 0, 0.5]} radius={2.5} speed={0.8} color="#5a6b8a" hatColor="#4a2a1a" hairColor="#3a2818" variant={2} />
          <WanderingNPC startPos={[7.5, 0, 0.5]} radius={2.5} speed={1.0} color="#8a6b4a" hatColor="#3a1810" hatType="hood" variant={0} />
          <WanderingNPC startPos={[0, 0, 8.5]} radius={3} speed={0.7} color="#6b8a4a" hatColor="#2a1810" hairColor="#6a4a20" variant={3} />
          <WanderingNPC startPos={[-9, 0, -4]} radius={2} speed={1.2} color="#8a4a4a" hatType="turban" hatColor="#c23a3a" skinColor="#d0a070" variant={1} />
          <WanderingNPC startPos={[13, 0, 12]} radius={3.5} speed={0.9} color="#4a6b8a" hatType="none" hairColor="#5a4525" variant={2} />
          <WanderingNPC startPos={[-16, 0, 9]} radius={3.2} speed={0.75} color="#8a7a4a" hatType="hood" hatColor="#4a3a2a" variant={3} />
          <WanderingNPC startPos={[0, 0, -18]} radius={4.2} speed={1.05} color="#6a4a8a" hatType="turban" hatColor="#c2a24a" skinColor="#d0a070" variant={1} />
          <WanderingNPC startPos={[24, 0, -10]} radius={2.8} speed={0.65} color="#5a8a4a" hatColor="#4a2a1a" variant={0} />
          <WanderingNPC startPos={[-24, 0, -10]} radius={2.8} speed={0.7} color="#8a5a4a" hatType="none" hairColor="#2a1810" variant={2} />
          <WanderingNPC startPos={[0, 0, 25]} radius={4.5} speed={0.85} color="#4a8a7a" hatType="hood" hatColor="#2a3a2a" variant={3} />

          {/* ===== RENCONTRES ALÉATOIRES ===== */}
          <GoblinScout startPos={[-28, 0, 18]} radius={5} speed={0.5} />
          <GoblinScout startPos={[22, 0, -22]} radius={6} speed={0.45} />
          <RedbrandMarauder startPos={[18, 0, 16]} radius={5.5} speed={0.55} />
          <RedbrandMarauder startPos={[-20, 0, -20]} radius={6} speed={0.5} />

          {(mode === 'first' || mode === 'third') && <PlayerController mode={mode} />}

          {mode === 'orbit' && (
            <OrbitControls
              enableDamping
              dampingFactor={0.08}
              minDistance={5}
              maxDistance={85}
              maxPolarAngle={Math.PI / 2.1}
              minPolarAngle={0.1}
              target={new THREE.Vector3(0, 1, 0)}
            />
          )}
        </Suspense>
      </Canvas>

      {/* Vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          boxShadow: isNight
            ? 'inset 0 0 300px 100px rgba(0,0,0,0.9)'
            : 'inset 0 0 180px 40px rgba(80,50,20,0.25)',
        }}
      />

      {/* EN-TÊTE */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 flex items-start justify-between p-4">
        <div className="pointer-events-auto rounded-md border-2 border-amber-700/70 bg-gradient-to-b from-[#2a2018]/95 to-[#1a130c]/95 px-5 py-3 text-amber-100 shadow-2xl">
          <h1 className="text-xl font-bold tracking-wide text-amber-300 drop-shadow">
            🏰 Phandaline — Les Tréfonds de Phancreux
          </h1>
          <p className="text-xs italic text-amber-200/70">
            Côte des Épées · Campagne D&D 5e maison · Quid Facis
          </p>
        </div>

        <div className="pointer-events-auto flex items-center gap-3 rounded-md border-2 border-amber-700/70 bg-gradient-to-b from-[#2a2018]/95 to-[#1a130c]/95 px-4 py-2 shadow-2xl">
          {/* Bourse d'or */}
          <span className="mr-1 border-r border-amber-700/50 pr-3 text-sm font-bold text-yellow-400">
            🪙 {gold} PO
          </span>
          <span className="mr-1 border-r border-amber-700/50 pr-3 text-sm font-bold text-sky-300">
            ✦ {reputation} Renom
          </span>
          {/* Contrôle volume */}
          <button
            onClick={() => {
              const playing = audio.toggleMusic();
              setMusicOn(playing);
            }}
            className="rounded-md border border-amber-700/60 bg-black/40 px-2 py-1 text-sm transition hover:bg-amber-900/30"
            title={musicOn ? 'Couper musique' : 'Activer musique'}
          >
            {musicOn ? '🎵' : '🚫'}
          </button>
          <div className="flex items-center gap-1 border-r border-amber-700/50 pr-2">
            <span className="text-lg">🔊</span>
            <input
              type="range"
              min="0"
              max="100"
              defaultValue="60"
              onChange={(e) => {
                const v = Number(e.target.value) / 100;
                audio.setMusicVolume(v * 0.25);
                audio.setSfxVolume(v * 0.4);
              }}
              className="w-16 accent-amber-400"
              title="Volume"
            />
          </div>
          <span className="text-lg">{isNight ? '🌙' : '☀️'}</span>
          <button
            onClick={() => setIsNight((v) => !v)}
            className={`relative h-7 w-14 rounded-full border-2 transition ${
              isNight ? 'border-indigo-300/40 bg-indigo-900' : 'border-amber-300/60 bg-amber-500'
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-amber-100 shadow transition ${
                isNight ? 'left-7' : 'left-0.5'
              }`}
            />
          </button>
          <span className="w-12 text-xs font-semibold uppercase tracking-wider text-amber-200">
            {isNight ? 'Nuit' : 'Jour'}
          </span>
        </div>
      </div>

      {/* SÉLECTEUR CAMÉRA */}
      <div className="pointer-events-auto absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
        <div className="rounded-md border-2 border-amber-800/70 bg-gradient-to-b from-[#2a2018]/95 to-[#1a130c]/95 p-2 shadow-2xl">
          <div className="mb-2 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400/80">
            ⚜ Caméra ⚜
          </div>
          {([
            ['orbit', 'Libre', '🗺️'],
            ['third', '3e pers.', '🧍'],
            ['first', '1e pers.', '👁️'],
          ] as [CameraMode, string, string][]).map(([m, label, icon]) => {
            const active = mode === m;
            return (
              <button
                key={m}
                onClick={() => {
                  if (m === 'orbit' && document.pointerLockElement) {
                    document.exitPointerLock?.();
                  }
                  setMode(m);
                }}
                className={`mb-1 flex w-full items-center gap-2 rounded border-2 px-2 py-1.5 text-left text-xs font-semibold transition ${
                  active
                    ? 'border-amber-300 bg-gradient-to-b from-amber-600 to-amber-800 text-amber-50 shadow-[0_0_12px_rgba(201,162,39,0.6)]'
                    : 'border-amber-900/60 bg-[#241a10] text-amber-200 hover:border-amber-600 hover:bg-[#352818]'
                }`}
              >
                <span className="text-base">{icon}</span>
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Réticule 1ère personne */}
      {mode === 'first' && (
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative h-6 w-6">
            <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-amber-200/60" />
            <div className="absolute top-1/2 left-0 h-0.5 w-full -translate-y-1/2 bg-amber-200/60" />
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2">
        <div className="rounded-md border-2 border-amber-800/70 bg-gradient-to-b from-[#2a2018]/95 to-[#1a130c]/95 px-5 py-3 text-center text-amber-100 shadow-2xl">
          {mode === 'orbit' ? (
            <div className="text-xs">
              <span className="font-bold text-amber-300">Mode observation : </span>
              clic-glisser pour pivoter · molette pour zoomer · clique sur un PNJ 💬 pour discuter
            </div>
          ) : (
            <div className="text-xs">
              <span className="font-bold text-amber-300">
                {mode === 'first' ? '1ère personne' : '3ème personne'} —{' '}
              </span>
              <span className="text-amber-200/80">
                Clique pour capturer la souris · <b>WASD</b> se déplacer · <b>E</b> parler / ramasser / attaquer · <b>Échap</b> libérer
              </span>
            </div>
          )}
        </div>
      </div>

      {/* JOURNAL DE QUÊTES */}
      <div className="pointer-events-none absolute right-4 top-1/2 w-56 -translate-y-1/2 rounded-md border-2 border-amber-800/60 bg-gradient-to-b from-[#2a2018]/90 to-[#1a130c]/90 px-3 py-2 text-[11px] text-amber-200/80 shadow-2xl">
        <div className="mb-2 border-b border-amber-800/50 pb-1 text-center font-bold uppercase tracking-widest text-amber-300">
          📜 Journal de quêtes
        </div>

        {/* Quête des pommes */}
        <div className="mb-2">
          <div className={`font-bold ${quests.apples === 'done' ? 'text-green-400 line-through' : 'text-amber-200'}`}>
            🍎 Les pommes d\'Oscar
          </div>
          <div className="text-[10px] italic text-amber-200/60">
            {quests.apples === 'none' && 'Parle à Oscar Bon-Vivant, à l\'auberge du Bon-Vivant.'}
            {quests.apples === 'active' && 'Retrouve le sac de pommes près de la porte sud.'}
            {quests.apples === 'found' && 'Rapporte le sac à Oscar ! (+10 PO)'}
            {quests.apples === 'done' && 'Terminée ✓ (+10 PO + tarte gratuite)'}
          </div>
        </div>

        {/* Quête du marteau */}
        <div className="mb-2">
          <div className={`font-bold ${quests.hammer === 'done' ? 'text-green-400 line-through' : 'text-amber-200'}`}>
            🔨 Le marteau d\'Anton
          </div>
          <div className="text-[10px] italic text-amber-200/60">
            {quests.hammer === 'none' && 'Parle à Anton Hizark, l\'Homme-de-Fer, à sa forge.'}
            {quests.hammer === 'active' && 'Cherche près des mannequins d\'entraînement, à l\'est.'}
            {quests.hammer === 'found' && 'Rapporte le marteau à Anton ! (+15 PO)'}
            {quests.hammer === 'done' && 'Terminée ✓ (+15 PO + rabais épée)'}
          </div>
        </div>

        {/* Quête de la lettre */}
        <div className="mb-1">
          <div className={`font-bold ${quests.letter === 'done' ? 'text-green-400 line-through' : 'text-amber-200'}`}>
            ✉️ Lettre pour Sildar
          </div>
          <div className="text-[10px] italic text-amber-200/60">
            {quests.letter === 'none' && 'Parle à Mira Bonne-Fortune, au magasin.'}
            {quests.letter === 'active' && 'Remets la lettre à Sildar Hallwinter, conseiller du Prince. (+20 PO)'}
            {quests.letter === 'done' && 'Terminée ✓ (+20 PO)'}
          </div>
        </div>

        <div className="mt-1 border-t border-amber-800/50 pt-1">
          <div className="text-[10px] font-bold text-red-400">👺 Menaces</div>
          <div className="text-[9px] italic text-red-300/67">
            Des gobelins et Fers Rouges rodent aux abords. Approche-toi et appuie sur [E] pour les affronter ! (+5 PO 🔩 / +8 PO 🛡️)
          </div>
          <div className="mt-1 text-[9px] text-red-200/80">
            Gobelins vaincus : {defeated.goblins}/2 · Fers Rouges : {defeated.redbrands}/2
          </div>
          {defeated.goblins >= 2 && defeated.redbrands >= 2 && (
            <div className="mt-1 text-[9px] font-bold text-green-400">
              Patrouilles sécurisées ✓ Les routes respirent.
            </div>
          )}
        </div>
        <div className="mt-2 border-t border-amber-800/50 pt-1 text-center text-[9px] text-amber-200/50">
          Approche-toi d\'un PNJ 💬 · [E] pour parler
        </div>
      </div>
    </div>
  );
}

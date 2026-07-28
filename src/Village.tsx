import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  makeStoneTexture,
  makeGrassTexture,
  makeWoodTexture,
  makeStoneFloorTexture,
  makePlasterTexture,
} from './textures';
import Grass from './Grass';

interface Props {
  isNight: boolean;
}

function Tree({ position, scale = 1, isNight }: { position: [number, number, number]; scale?: number; isNight: boolean }) {
  const leaves1 = useRef<THREE.Mesh>(null);
  const leaves2 = useRef<THREE.Mesh>(null);
  const leaves3 = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const sway = Math.sin(t * 0.8 + position[0] * 0.1) * 0.03;
    if (leaves1.current) { leaves1.current.rotation.z = sway; leaves1.current.rotation.x = sway * 0.5; }
    if (leaves2.current) { leaves2.current.rotation.z = sway * 1.2; leaves2.current.rotation.x = sway * 0.7; }
    if (leaves3.current) { leaves3.current.rotation.z = sway * 1.4; leaves3.current.rotation.x = sway; }
  });
  const woodTex = useMemo(() => makeWoodTexture(isNight, 'light'), [isNight]);
  return (
    <group position={position} scale={scale}>
      {/* trunk */}
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.18, 0.25, 2, 10]} />
        <meshStandardMaterial map={woodTex} roughness={1} />
      </mesh>
      {/* roots hint */}
      <mesh position={[0, 0.05, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.4, 0.1, 10]} />
        <meshStandardMaterial color={isNight ? '#2a1c11' : '#3a2418'} roughness={1} />
      </mesh>
      {/* leaves layers */}
      <mesh ref={leaves1} position={[0, 2.2, 0]} castShadow>
        <sphereGeometry args={[1.3, 12, 12]} />
        <meshStandardMaterial color={isNight ? '#0f2a0f' : '#2e5c1e'} roughness={1} flatShading />
      </mesh>
      <mesh ref={leaves2} position={[0, 3.1, 0]} castShadow>
        <sphereGeometry args={[1, 10, 10]} />
        <meshStandardMaterial color={isNight ? '#1a3a1a' : '#3a7a2a'} roughness={1} flatShading />
      </mesh>
      <mesh ref={leaves3} position={[0, 3.8, 0]} castShadow>
        <sphereGeometry args={[0.6, 8, 8]} />
        <meshStandardMaterial color={isNight ? '#204020' : '#4a8a3a'} roughness={1} flatShading />
      </mesh>
    </group>
  );
}

function House({
  position,
  rotationY = 0,
  isNight,
  scale = 1,
}: {
  position: [number, number, number];
  rotationY?: number;
  isNight: boolean;
  scale?: number;
}) {
  const stoneTex = useMemo(() => makeStoneTexture(isNight), [isNight]);
  const woodTex = useMemo(() => makeWoodTexture(isNight, 'dark'), [isNight]);
  const roofTex = useMemo(() => makeWoodTexture(isNight, 'roof'), [isNight]);
  const plasterTex = useMemo(() => makePlasterTexture(isNight), [isNight]);

  // Dimensions généreuses
  const w = 4.2;   // largeur
  const d = 3.6;   // profondeur
  const h1 = 2.4;  // étage pierre
  const h2 = 2.0;  // étage colombages
  const jetty = 0.35; // encorbellement (étage qui dépasse)
  const uw = w + jetty;
  const ud = d + jetty;
  const baseY = 0.2;
  const upperY = baseY + h1;
  const roofBaseY = upperY + h2;
  const roofR = (uw + 0.9) / 1.73;
  const roofSquash = 0.62;
  const beamColor = isNight ? '#1a1008' : '#3a2718';

  return (
    <group position={position} rotation={[0, rotationY, 0]} scale={scale}>
      {/* ---- fondation ---- */}
      <mesh position={[0, baseY / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w + 0.3, baseY, d + 0.3]} />
        <meshStandardMaterial map={stoneTex} roughness={1} />
      </mesh>

      {/* ---- REZ-DE-CHAUSSÉE EN PIERRE ---- */}
      <mesh position={[0, baseY + h1 / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h1, d]} />
        <meshStandardMaterial map={stoneTex} roughness={1} />
      </mesh>
      {/* chaînage d'angle (pierres de taille aux coins) */}
      {[[-w / 2, -d / 2], [w / 2, -d / 2], [-w / 2, d / 2], [w / 2, d / 2]].map(([x, z], i) => (
        <mesh key={i} position={[x, baseY + h1 / 2, z]} castShadow>
          <boxGeometry args={[0.3, h1, 0.3]} />
          <meshStandardMaterial color={isNight ? '#46413a' : '#7d756a'} roughness={1} />
        </mesh>
      ))}

      {/* ---- ÉTAGE À COLOMBAGES (encorbellement) ---- */}
      <mesh position={[0, upperY + h2 / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[uw, h2, ud]} />
        <meshStandardMaterial map={plasterTex} roughness={0.95} />
      </mesh>
      {/* poutre de rive entre les deux étages */}
      <mesh position={[0, upperY + 0.04, 0]} castShadow>
        <boxGeometry args={[uw + 0.1, 0.16, ud + 0.1]} />
        <meshStandardMaterial map={woodTex} color={beamColor} roughness={0.9} />
      </mesh>
      {/* corbeaux de soutien sous l'encorbellement */}
      {[[-uw / 2 + 0.3, d / 2], [uw / 2 - 0.3, d / 2], [-uw / 2 + 0.3, -d / 2], [uw / 2 - 0.3, -d / 2]].map(([x, z], i) => (
        <mesh key={i} position={[x, upperY - 0.12, z * 1.02]} rotation={[z > 0 ? -0.6 : 0.6, 0, 0]} castShadow>
          <boxGeometry args={[0.12, 0.3, 0.12]} />
          <meshStandardMaterial map={woodTex} color={beamColor} roughness={0.9} />
        </mesh>
      ))}

      {/* colombages face avant + arrière */}
      {[ud / 2 + 0.015, -ud / 2 - 0.015].map((z, zi) => (
        <group key={zi} position={[0, upperY + h2 / 2, z]}>
          {/* sablières haute et basse */}
          <mesh position={[0, h2 / 2 - 0.08, 0]}>
            <boxGeometry args={[uw, 0.16, 0.05]} />
            <meshStandardMaterial map={woodTex} color={beamColor} roughness={0.9} />
          </mesh>
          <mesh position={[0, -h2 / 2 + 0.08, 0]}>
            <boxGeometry args={[uw, 0.16, 0.05]} />
            <meshStandardMaterial map={woodTex} color={beamColor} roughness={0.9} />
          </mesh>
          {/* poteaux verticaux */}
          {[-uw / 2 + 0.1, -uw / 4, 0, uw / 4, uw / 2 - 0.1].map((x, i) => (
            <mesh key={i} position={[x, 0, 0]}>
              <boxGeometry args={[0.14, h2, 0.05]} />
              <meshStandardMaterial map={woodTex} color={beamColor} roughness={0.9} />
            </mesh>
          ))}
          {/* écharpes diagonales (croix de Saint-André) */}
          <mesh position={[-uw / 2 + uw / 8 + 0.05, 0, 0]} rotation={[0, 0, 0.62]}>
            <boxGeometry args={[0.11, h2 * 1.05, 0.04]} />
            <meshStandardMaterial map={woodTex} color={beamColor} roughness={0.9} />
          </mesh>
          <mesh position={[uw / 2 - uw / 8 - 0.05, 0, 0]} rotation={[0, 0, -0.62]}>
            <boxGeometry args={[0.11, h2 * 1.05, 0.04]} />
            <meshStandardMaterial map={woodTex} color={beamColor} roughness={0.9} />
          </mesh>
        </group>
      ))}
      {/* colombages côtés */}
      {[uw / 2 + 0.015, -uw / 2 - 0.015].map((x, xi) => (
        <group key={xi} position={[x, upperY + h2 / 2, 0]}>
          <mesh position={[0, h2 / 2 - 0.08, 0]}>
            <boxGeometry args={[0.05, 0.16, ud]} />
            <meshStandardMaterial map={woodTex} color={beamColor} roughness={0.9} />
          </mesh>
          <mesh position={[0, -h2 / 2 + 0.08, 0]}>
            <boxGeometry args={[0.05, 0.16, ud]} />
            <meshStandardMaterial map={woodTex} color={beamColor} roughness={0.9} />
          </mesh>
          {[-ud / 2 + 0.1, 0, ud / 2 - 0.1].map((z, i) => (
            <mesh key={i} position={[0, 0, z]}>
              <boxGeometry args={[0.05, h2, 0.14]} />
              <meshStandardMaterial map={woodTex} color={beamColor} roughness={0.9} />
            </mesh>
          ))}
        </group>
      ))}

      {/* ---- TOIT À PIGNON (prisme triangulaire) ---- */}
      <mesh
        position={[0, roofBaseY + roofR * 0.5 * roofSquash - 0.05, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[1, 1, roofSquash]}
        castShadow
      >
        <cylinderGeometry args={[roofR, roofR, ud + 1, 3, 1, false, Math.PI]} />
        <meshStandardMaterial map={roofTex} color={isNight ? '#2a1008' : '#6b2a1a'} roughness={1} />
      </mesh>
      {/* faîtière */}
      <mesh position={[0, roofBaseY + roofR * roofSquash - 0.02, 0]} castShadow>
        <boxGeometry args={[0.18, 0.12, ud + 1.1]} />
        <meshStandardMaterial map={woodTex} color={beamColor} roughness={0.9} />
      </mesh>

      {/* ---- PORTE (grande, arquée, dans la pierre) ---- */}
      <group position={[0, 0, d / 2]}>
        <mesh position={[0, baseY + 0.85, 0.03]} castShadow>
          <boxGeometry args={[0.85, 1.7, 0.06]} />
          <meshStandardMaterial map={woodTex} color={isNight ? '#1a0f08' : '#2a1810'} roughness={0.85} />
        </mesh>
        {/* renforts de porte */}
        {[0.5, 1.0, 1.5].map((y, i) => (
          <mesh key={i} position={[0, baseY + y - 0.1, 0.07]}>
            <boxGeometry args={[0.85, 0.06, 0.02]} />
            <meshStandardMaterial color="#2c2c30" metalness={0.5} roughness={0.5} />
          </mesh>
        ))}
        {/* arc de pierre */}
        <mesh position={[0, baseY + 1.7, 0.04]}>
          <ringGeometry args={[0.42, 0.6, 16, 1, Math.PI, Math.PI]} />
          <meshStandardMaterial color={isNight ? '#46413a' : '#7d756a'} roughness={1} side={THREE.DoubleSide} />
        </mesh>
        {/* poignée */}
        <mesh position={[0.28, baseY + 0.85, 0.08]}>
          <torusGeometry args={[0.06, 0.015, 8, 16]} />
          <meshStandardMaterial color="#2c2c30" metalness={0.7} roughness={0.4} />
        </mesh>
        {/* lanterne au-dessus de la porte */}
        <mesh position={[0.6, baseY + 1.9, 0.15]}>
          <boxGeometry args={[0.14, 0.18, 0.14]} />
          <meshStandardMaterial
            color={isNight ? '#ffcc80' : '#d8d0b8'}
            emissive={isNight ? '#ffaa40' : '#fff'}
            emissiveIntensity={isNight ? 2 : 0.1}
          />
        </mesh>
        {isNight && <pointLight position={[0.6, baseY + 1.9, 0.4]} color="#ffb060" intensity={1.2} distance={5} decay={2} />}
      </group>

      {/* ---- FENÊTRES rez-de-chaussée (petites, encadrées de pierre) ---- */}
      {[
        [-w / 2 - 0.01, baseY + 1.5, 0, Math.PI / 2],
        [w / 2 + 0.01, baseY + 1.5, 0, -Math.PI / 2],
        [-1.2, baseY + 1.5, d / 2 + 0.01, 0],
        [1.2, baseY + 1.5, d / 2 + 0.01, 0],
      ].map(([x, y, z, r], i) => (
        <group key={i} position={[x as number, y as number, z as number]} rotation={[0, r as number, 0]}>
          {/* encadrement pierre */}
          <mesh>
            <boxGeometry args={[0.55, 0.65, 0.08]} />
            <meshStandardMaterial color={isNight ? '#46413a' : '#7d756a'} roughness={1} />
          </mesh>
          {/* vitre lumineuse */}
          <mesh position={[0, 0, 0.03]}>
            <boxGeometry args={[0.4, 0.5, 0.04]} />
            <meshStandardMaterial
              color={isNight ? '#ff8830' : '#fff0c0'}
              emissive={isNight ? '#ff7720' : '#fff0c0'}
              emissiveIntensity={isNight ? 2.2 : 0.25}
            />
          </mesh>
          {/* croisillons */}
          <mesh position={[0, 0, 0.06]}>
            <boxGeometry args={[0.04, 0.5, 0.02]} />
            <meshStandardMaterial color={beamColor} />
          </mesh>
          <mesh position={[0, 0, 0.06]}>
            <boxGeometry args={[0.4, 0.04, 0.02]} />
            <meshStandardMaterial color={beamColor} />
          </mesh>
          {/* barreaux de fer */}
          <mesh position={[0, 0, 0.07]}>
            <boxGeometry args={[0.02, 0.5, 0.015]} />
            <meshStandardMaterial color="#2c2c30" metalness={0.5} />
          </mesh>
        </group>
      ))}

      {/* ---- FENÊTRES de l'étage (avec volets en bois) ---- */}
      {[
        [-uw / 4, upperY + h2 / 2, ud / 2 + 0.03, 0],
        [uw / 4, upperY + h2 / 2, ud / 2 + 0.03, 0],
        [-uw / 2 - 0.03, upperY + h2 / 2, 0, Math.PI / 2],
        [uw / 2 + 0.03, upperY + h2 / 2, 0, -Math.PI / 2],
      ].map(([x, y, z, r], i) => (
        <group key={i} position={[x as number, y as number, z as number]} rotation={[0, r as number, 0]}>
          {/* vitre */}
          <mesh>
            <boxGeometry args={[0.45, 0.55, 0.04]} />
            <meshStandardMaterial
              color={isNight ? '#ff8830' : '#fff0c0'}
              emissive={isNight ? '#ff7720' : '#fff0c0'}
              emissiveIntensity={isNight ? 2.2 : 0.25}
            />
          </mesh>
          {/* croisillons */}
          <mesh position={[0, 0, 0.025]}>
            <boxGeometry args={[0.04, 0.55, 0.02]} />
            <meshStandardMaterial color={beamColor} />
          </mesh>
          <mesh position={[0, 0, 0.025]}>
            <boxGeometry args={[0.45, 0.04, 0.02]} />
            <meshStandardMaterial color={beamColor} />
          </mesh>
          {/* volets ouverts */}
          <mesh position={[-0.36, 0, 0.02]} rotation={[0, 0.5, 0]} castShadow>
            <boxGeometry args={[0.22, 0.55, 0.025]} />
            <meshStandardMaterial map={woodTex} color={isNight ? '#241608' : '#4a5a2a'} roughness={0.9} />
          </mesh>
          <mesh position={[0.36, 0, 0.02]} rotation={[0, -0.5, 0]} castShadow>
            <boxGeometry args={[0.22, 0.55, 0.025]} />
            <meshStandardMaterial map={woodTex} color={isNight ? '#241608' : '#4a5a2a'} roughness={0.9} />
          </mesh>
          {/* jardinière fleurie */}
          {!isNight && (
            <group position={[0, -0.36, 0.06]}>
              <mesh>
                <boxGeometry args={[0.45, 0.1, 0.1]} />
                <meshStandardMaterial color="#5a3d24" roughness={1} />
              </mesh>
              {[-0.15, 0, 0.15].map((fx, fi) => (
                <mesh key={fi} position={[fx, 0.08, 0]}>
                  <sphereGeometry args={[0.045, 6, 6]} />
                  <meshStandardMaterial color={['#c23a3a', '#d0a020', '#b05ac2'][fi]} roughness={0.7} />
                </mesh>
              ))}
            </group>
          )}
        </group>
      ))}

      {/* ---- CHEMINÉE traversant le toit ---- */}
      <mesh position={[w / 4, roofBaseY + roofR * roofSquash * 0.7, -d / 4]} castShadow>
        <boxGeometry args={[0.4, 1.6, 0.4]} />
        <meshStandardMaterial map={stoneTex} roughness={1} />
      </mesh>
      <mesh position={[w / 4, roofBaseY + roofR * roofSquash * 0.7 + 0.85, -d / 4]} castShadow>
        <boxGeometry args={[0.5, 0.1, 0.5]} />
        <meshStandardMaterial color={isNight ? '#46413a' : '#7d756a'} roughness={1} />
      </mesh>
      <SmokePlume position={[w / 4, roofBaseY + roofR * roofSquash * 0.7 + 1, -d / 4]} isNight={isNight} />
    </group>
  );
}

function SmokePlume({ position, isNight }: { position: [number, number, number]; isNight: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const particles = useMemo(
    () =>
      Array.from({ length: 6 }, () => ({
        x: (Math.random() - 0.5) * 0.1,
        z: (Math.random() - 0.5) * 0.1,
        phase: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.3,
        size: 0.15 + Math.random() * 0.15,
      })),
    []
  );
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.children.forEach((child, i) => {
      const p = particles[i];
      const y = ((t * p.speed + p.phase) % 3) - 0.5;
      child.position.set(
        p.x + Math.sin(t * 0.5 + p.phase) * 0.1,
        y,
        p.z + Math.cos(t * 0.5 + p.phase) * 0.1
      );
      const s = p.size * (0.5 + y * 0.3);
      child.scale.set(s, s, s);
      const opacity = Math.max(0, 1 - y / 3);
      (child as THREE.Mesh).material = new THREE.MeshBasicMaterial({
        color: isNight ? '#3a3a45' : '#c0c0c0',
        transparent: true,
        opacity: opacity * 0.35,
      });
    });
  });
  return (
    <group ref={groupRef} position={position}>
      {particles.map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

function Well({ position, isNight }: { position: [number, number, number]; isNight: boolean }) {
  const stoneTex = useMemo(() => makeStoneTexture(isNight), [isNight]);
  const woodTex = useMemo(() => makeWoodTexture(isNight, 'dark'), [isNight]);
  return (
    <group position={position}>
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.65, 0.75, 0.6, 16]} />
        <meshStandardMaterial map={stoneTex} roughness={1} />
      </mesh>
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.08, 16]} />
        <meshStandardMaterial color="#0a1520" transparent opacity={0.7} />
      </mesh>
      {[-0.45, 0.45].map((x, i) => (
        <mesh key={i} position={[x, 1.3, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.06, 1.6, 8]} />
          <meshStandardMaterial map={woodTex} roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[0, 2.1, 0]} castShadow>
        <coneGeometry args={[0.8, 0.5, 4]} />
        <meshStandardMaterial map={woodTex} color={isNight ? '#2a1008' : '#6b2a1a'} roughness={0.9} />
      </mesh>
      {/* bucket rope */}
      <mesh position={[0, 1.6, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.6, 6]} />
        <meshStandardMaterial color="#1a1008" />
      </mesh>
    </group>
  );
}

function MarketStall({ position, rotationY = 0, isNight }: { position: [number, number, number]; rotationY?: number; isNight: boolean }) {
  const woodTex = useMemo(() => makeWoodTexture(isNight, 'dark'), [isNight]);
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {[[-0.7, -0.5], [0.7, -0.5], [-0.7, 0.5], [0.7, 0.5]].map(([x, z], i) => (
        <mesh key={i} position={[x, 1, z]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 2, 8]} />
          <meshStandardMaterial map={woodTex} roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[0, 2.1, 0]} castShadow>
        <boxGeometry args={[1.8, 0.05, 1.2]} />
        <meshStandardMaterial color={isNight ? '#4a1515' : '#a02a2a'} roughness={1} />
      </mesh>
      {/* counter */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <boxGeometry args={[1.5, 0.08, 1]} />
        <meshStandardMaterial map={woodTex} roughness={0.9} />
      </mesh>
      {/* goods - baskets */}
      <mesh position={[-0.3, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.15, 0.3, 8]} />
        <meshStandardMaterial color={isNight ? '#3a2818' : '#8a6a4a'} />
      </mesh>
      {/* fruits */}
      {[-0.4, -0.25, -0.15].map((x, i) => (
        <mesh key={i} position={[x, 1.3, 0.05]} castShadow>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color={i === 0 ? '#c24a2a' : '#d0a020'} roughness={0.6} />
        </mesh>
      ))}
      {/* bread */}
      <mesh position={[0.3, 0.95, 0.1]} rotation={[0, 0.3, 0]} castShadow>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial color={isNight ? '#6a4a20' : '#c9a25a'} roughness={0.9} />
      </mesh>
      {/* second basket */}
      <mesh position={[0.3, 1.1, -0.2]} castShadow>
        <cylinderGeometry args={[0.18, 0.13, 0.2, 8]} />
        <meshStandardMaterial color={isNight ? '#3a2818' : '#8a6a4a'} />
      </mesh>
    </group>
  );
}

function StreetLamp({ position, isNight }: { position: [number, number, number]; isNight: boolean }) {
  const flameRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const flicker = 0.85 + Math.sin(t * 11) * 0.1 + Math.sin(t * 23) * 0.05;
    if (flameRef.current) flameRef.current.scale.set(flicker, 1 + Math.sin(t*14)*0.15, flicker);
    if (lightRef.current) lightRef.current.intensity = (isNight ? 2.5 : 0.15) * flicker;
  });
  return (
    <group position={position}>
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.12, 0.6, 8]} />
        <meshStandardMaterial color="#2a2620" metalness={0.4} roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.7, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.06, 2.8, 8]} />
        <meshStandardMaterial color="#2c2c30" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* lamp head */}
      <mesh position={[0, 3.1, 0]} castShadow>
        <boxGeometry args={[0.35, 0.35, 0.35]} />
        <meshStandardMaterial color="#2c2c30" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* glass */}
      <mesh position={[0, 3.1, 0]}>
        <boxGeometry args={[0.28, 0.3, 0.28]} />
        <meshStandardMaterial
          color={isNight ? '#ffcc80' : '#f0e8c0'}
          emissive={isNight ? '#ffaa40' : '#fff'}
          emissiveIntensity={isNight ? 2.5 : 0.15}
          transparent
          opacity={0.85}
        />
      </mesh>
      {/* flame */}
      <mesh ref={flameRef} position={[0, 3.05, 0]}>
        <coneGeometry args={[0.08, 0.18, 8]} />
        <meshStandardMaterial color="#ffb030" emissive="#ff7722" emissiveIntensity={3} transparent opacity={isNight ? 1 : 0.2} />
      </mesh>
      <pointLight ref={lightRef} position={[0, 3, 0]} color="#ffb060" distance={10} decay={2} />
    </group>
  );
}

function Fence({ position, rotationY = 0, length = 3, isNight }: { position: [number, number, number]; rotationY?: number; length?: number; isNight: boolean }) {
  const woodTex = useMemo(() => makeWoodTexture(isNight, 'dark'), [isNight]);
  const count = Math.floor(length * 2);
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {Array.from({ length: count }).map((_, i) => (
        <mesh key={i} position={[-length / 2 + (i / count) * length, 0.35, 0]} castShadow>
          <boxGeometry args={[0.08, 0.7, 0.08]} />
          <meshStandardMaterial map={woodTex} roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[length, 0.05, 0.05]} />
        <meshStandardMaterial map={woodTex} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[length, 0.05, 0.05]} />
        <meshStandardMaterial map={woodTex} roughness={0.9} />
      </mesh>
    </group>
  );
}

function WallSegment({
  position,
  length,
  axis,
  isNight,
}: {
  position: [number, number, number];
  length: number;
  axis: 'x' | 'z';
  isNight: boolean;
}) {
  const stoneTex = useMemo(() => makeStoneTexture(isNight), [isNight]);
  const merlons = Math.floor(length / 2);
  return (
    <group position={position}>
      <mesh position={[0, 1.6, 0]} castShadow receiveShadow>
        <boxGeometry args={axis === 'x' ? [length, 3.2, 1] : [1, 3.2, length]} />
        <meshStandardMaterial map={stoneTex} roughness={1} />
      </mesh>
      <mesh position={[0, 3.3, 0]} castShadow>
        <boxGeometry args={axis === 'x' ? [length + 0.2, 0.25, 1.15] : [1.15, 0.25, length + 0.2]} />
        <meshStandardMaterial color={isNight ? '#46413a' : '#7d756a'} roughness={1} />
      </mesh>
      {Array.from({ length: merlons }).map((_, i) => {
        const t = -length / 2 + 0.8 + i * 2;
        return (
          <mesh key={i} position={axis === 'x' ? [t, 3.75, 0] : [0, 3.75, t]} castShadow>
            <boxGeometry args={axis === 'x' ? [0.8, 0.8, 1.2] : [1.2, 0.8, 0.8]} />
            <meshStandardMaterial map={stoneTex} roughness={1} />
          </mesh>
        );
      })}
    </group>
  );
}

function WatchTower({ position, isNight }: { position: [number, number, number]; isNight: boolean }) {
  const stoneTex = useMemo(() => makeStoneTexture(isNight), [isNight]);
  const woodTex = useMemo(() => makeWoodTexture(isNight, 'roof'), [isNight]);
  return (
    <group position={position}>
      <mesh position={[0, 2.3, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.35, 1.6, 4.6, 12]} />
        <meshStandardMaterial map={stoneTex} roughness={1} />
      </mesh>
      <mesh position={[0, 4.8, 0]} castShadow>
        <coneGeometry args={[1.7, 1.2, 12]} />
        <meshStandardMaterial map={woodTex} color={isNight ? '#2a1008' : '#6b2a1a'} roughness={1} />
      </mesh>
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 1.35, 4.45, Math.sin(a) * 1.35]} castShadow>
            <boxGeometry args={[0.45, 0.7, 0.45]} />
            <meshStandardMaterial map={stoneTex} roughness={1} />
          </mesh>
        );
      })}
      <mesh position={[0, 2.4, 1.62]}>
        <boxGeometry args={[0.45, 0.65, 0.05]} />
        <meshStandardMaterial
          color={isNight ? '#ff8830' : '#fff0c0'}
          emissive={isNight ? '#ff7720' : '#fff0c0'}
          emissiveIntensity={isNight ? 1.8 : 0.15}
        />
      </mesh>
      {isNight && <pointLight position={[0, 2.5, 1.8]} color="#ffb060" intensity={0.9} distance={6} decay={2} />}
    </group>
  );
}

function Gatehouse({ position, rotationY = 0, isNight }: { position: [number, number, number]; rotationY?: number; isNight: boolean }) {
  const stoneTex = useMemo(() => makeStoneTexture(isNight), [isNight]);
  const woodTex = useMemo(() => makeWoodTexture(isNight, 'dark'), [isNight]);
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <WatchTower position={[-3, 0, 0]} isNight={isNight} />
      <WatchTower position={[3, 0, 0]} isNight={isNight} />
      <mesh position={[0, 3.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.8, 2.8, 1.2]} />
        <meshStandardMaterial map={stoneTex} roughness={1} />
      </mesh>
      <mesh position={[0, 1.2, 0.05]} castShadow>
        <boxGeometry args={[3.1, 2.4, 0.25]} />
        <meshStandardMaterial map={woodTex} color={isNight ? '#1a0f08' : '#2a1810'} roughness={0.9} />
      </mesh>
      {/* iron portcullis */}
      {[-1.1, -0.55, 0, 0.55, 1.1].map((x, i) => (
        <mesh key={i} position={[x, 1.3, 0.25]}>
          <boxGeometry args={[0.08, 2.3, 0.08]} />
          <meshStandardMaterial color="#2c2c30" metalness={0.65} roughness={0.45} />
        </mesh>
      ))}
      <mesh position={[0, 2.25, 0.25]}>
        <boxGeometry args={[3.1, 0.08, 0.08]} />
        <meshStandardMaterial color="#2c2c30" metalness={0.65} roughness={0.45} />
      </mesh>
    </group>
  );
}

function CityWalls({ isNight }: { isNight: boolean }) {
  return (
    <group>
      <WallSegment position={[-20, 0, -35]} length={27} axis="x" isNight={isNight} />
      <WallSegment position={[20, 0, -35]} length={27} axis="x" isNight={isNight} />
      <WallSegment position={[-20, 0, 35]} length={27} axis="x" isNight={isNight} />
      <WallSegment position={[20, 0, 35]} length={27} axis="x" isNight={isNight} />
      <WallSegment position={[-35, 0, 0]} length={70} axis="z" isNight={isNight} />
      <WallSegment position={[35, 0, 0]} length={70} axis="z" isNight={isNight} />
      <Gatehouse position={[0, 0, -35]} isNight={isNight} />
      <Gatehouse position={[0, 0, 35]} rotationY={Math.PI} isNight={isNight} />
      <WatchTower position={[-35, 0, -35]} isNight={isNight} />
      <WatchTower position={[35, 0, -35]} isNight={isNight} />
      <WatchTower position={[-35, 0, 35]} isNight={isNight} />
      <WatchTower position={[35, 0, 35]} isNight={isNight} />
    </group>
  );
}


function Cart({ position, rotationY = 0, isNight }: { position: [number, number, number]; rotationY?: number; isNight: boolean }) {
  const woodTex = useMemo(() => makeWoodTexture(isNight, 'dark'), [isNight]);
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.7, 0.45, 1]} />
        <meshStandardMaterial map={woodTex} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.85, -0.48]} castShadow>
        <boxGeometry args={[1.8, 0.25, 0.08]} />
        <meshStandardMaterial map={woodTex} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.85, 0.48]} castShadow>
        <boxGeometry args={[1.8, 0.25, 0.08]} />
        <meshStandardMaterial map={woodTex} roughness={0.9} />
      </mesh>
      {[-0.75, 0.75].map((x, i) => (
        <mesh key={i} position={[x, 0.28, -0.58]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.28, 0.055, 8, 16]} />
          <meshStandardMaterial color="#2a1810" roughness={0.8} />
        </mesh>
      ))}
      {[-0.75, 0.75].map((x, i) => (
        <mesh key={i} position={[x, 0.28, 0.58]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.28, 0.055, 8, 16]} />
          <meshStandardMaterial color="#2a1810" roughness={0.8} />
        </mesh>
      ))}
      <mesh position={[0, 0.9, 0.05]} castShadow>
        <boxGeometry args={[0.55, 0.35, 0.45]} />
        <meshStandardMaterial color={isNight ? '#2a1810' : '#8a6a4a'} roughness={0.9} />
      </mesh>
      <mesh position={[0.55, 0.95, -0.1]} castShadow>
        <cylinderGeometry args={[0.18, 0.16, 0.4, 10]} />
        <meshStandardMaterial color={isNight ? '#2a1810' : '#5a3d24'} roughness={0.9} />
      </mesh>
    </group>
  );
}

function Fountain({ position, isNight }: { position: [number, number, number]; isNight: boolean }) {
  const stoneTex = useMemo(() => makeStoneTexture(isNight), [isNight]);
  const waterRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (waterRef.current) {
      waterRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.8) * 0.03;
      waterRef.current.position.y = 0.62 + Math.sin(state.clock.elapsedTime * 2) * 0.015;
    }
  });
  return (
    <group position={position}>
      <mesh position={[0, 0.25, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[1.45, 1.6, 0.5, 20]} />
        <meshStandardMaterial map={stoneTex} roughness={1} />
      </mesh>
      <mesh ref={waterRef} position={[0, 0.62, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.2, 32]} />
        <meshStandardMaterial color="#2a6a9a" emissive="#1a4a7a" emissiveIntensity={isNight ? 0.45 : 0.12} transparent opacity={0.78} roughness={0.25} />
      </mesh>
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.3, 1.2, 12]} />
        <meshStandardMaterial map={stoneTex} roughness={1} />
      </mesh>
      <mesh position={[0, 1.75, 0]} castShadow>
        <sphereGeometry args={[0.28, 12, 12]} />
        <meshStandardMaterial color={isNight ? '#64605a' : '#9a9285'} roughness={1} />
      </mesh>
    </group>
  );
}

function Shrine({ position, rotationY = 0, isNight }: { position: [number, number, number]; rotationY?: number; isNight: boolean }) {
  const stoneTex = useMemo(() => makeStoneTexture(isNight), [isNight]);
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.4, 1.2]} />
        <meshStandardMaterial map={stoneTex} roughness={1} />
      </mesh>
      <mesh position={[0, 0.95, 0]} castShadow>
        <boxGeometry args={[0.45, 1.1, 0.35]} />
        <meshStandardMaterial color={isNight ? '#5a5550' : '#9a9285'} roughness={1} />
      </mesh>
      <mesh position={[0, 1.6, 0]} castShadow>
        <sphereGeometry args={[0.18, 10, 10]} />
        <meshStandardMaterial color={isNight ? '#5a5550' : '#9a9285'} roughness={1} />
      </mesh>
      {[-0.55, 0.55].map((x, i) => (
        <group key={i} position={[x, 0.55, 0.45]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.2, 8]} />
            <meshStandardMaterial color="#e8dcc0" />
          </mesh>
          <mesh position={[0, 0.13, 0]}>
            <coneGeometry args={[0.035, 0.11, 8]} />
            <meshStandardMaterial color="#ffb030" emissive="#ff7722" emissiveIntensity={isNight ? 2.5 : 0.7} />
          </mesh>
        </group>
      ))}
      {isNight && <pointLight position={[0, 0.9, 0.6]} color="#ffb060" intensity={1.1} distance={5} decay={2} />}
    </group>
  );
}

function NoticeBoard({ position, rotationY = 0, isNight }: { position: [number, number, number]; rotationY?: number; isNight: boolean }) {
  const woodTex = useMemo(() => makeWoodTexture(isNight, 'dark'), [isNight]);
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {[-0.55, 0.55].map((x, i) => (
        <mesh key={i} position={[x, 0.8, 0]} castShadow>
          <boxGeometry args={[0.08, 1.6, 0.08]} />
          <meshStandardMaterial map={woodTex} roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[0, 1.25, 0.02]} castShadow>
        <boxGeometry args={[1.35, 0.9, 0.08]} />
        <meshStandardMaterial map={woodTex} roughness={0.9} />
      </mesh>
      {[[-0.35, 1.38], [0.1, 1.22], [0.38, 1.42], [-0.05, 1.55]].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0.08]} rotation={[0, 0, i * 0.2 - 0.2]}>
          <boxGeometry args={[0.28, 0.22, 0.01]} />
          <meshStandardMaterial color="#d8c8a0" roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

function HayStack({ position, rotationY = 0 }: { position: [number, number, number]; rotationY?: number }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.7, 0.85, 0.7, 10]} />
        <meshStandardMaterial color="#c9a85a" roughness={1} />
      </mesh>
      <mesh position={[0, 0.85, 0]} castShadow>
        <coneGeometry args={[0.85, 0.8, 10]} />
        <meshStandardMaterial color="#d8b86a" roughness={1} />
      </mesh>
    </group>
  );
}

function TrainingDummy({ position, rotationY = 0, isNight }: { position: [number, number, number]; rotationY?: number; isNight: boolean }) {
  const woodTex = useMemo(() => makeWoodTexture(isNight, 'dark'), [isNight]);
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.75, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 1.5, 8]} />
        <meshStandardMaterial map={woodTex} roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.25, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 1.2, 8]} />
        <meshStandardMaterial map={woodTex} roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.6, 0]} castShadow>
        <sphereGeometry args={[0.18, 8, 8]} />
        <meshStandardMaterial color="#c9a85a" roughness={1} />
      </mesh>
      <mesh position={[0, 0.95, 0]} castShadow>
        <boxGeometry args={[0.45, 0.55, 0.22]} />
        <meshStandardMaterial color="#c9a85a" roughness={1} />
      </mesh>
      <mesh position={[0, 1.0, 0.12]}>
        <ringGeometry args={[0.1, 0.18, 16]} />
        <meshStandardMaterial color="#7a1f2b" roughness={1} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function LaundryLine({ position, rotationY = 0, isNight }: { position: [number, number, number]; rotationY?: number; isNight: boolean }) {
  const woodTex = useMemo(() => makeWoodTexture(isNight, 'dark'), [isNight]);
  const clothRefs = [useRef<THREE.Mesh>(null), useRef<THREE.Mesh>(null), useRef<THREE.Mesh>(null)];
  useFrame((state) => {
    clothRefs.forEach((ref, i) => {
      if (ref.current) ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 2 + i) * 0.05;
    });
  });
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {[-1.1, 1.1].map((x, i) => (
        <mesh key={i} position={[x, 0.9, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.05, 1.8, 8]} />
          <meshStandardMaterial map={woodTex} roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[0, 1.55, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.012, 0.012, 2.3, 6]} />
        <meshStandardMaterial color="#1a1008" roughness={1} />
      </mesh>
      {[['#d8c8a0', -0.6], ['#8a4a4a', 0], ['#4a6b8a', 0.6]].map(([color, x], i) => (
        <mesh key={i} ref={clothRefs[i]} position={[x as number, 1.25, 0.02]} castShadow>
          <planeGeometry args={[0.45, 0.55]} />
          <meshStandardMaterial color={color as string} side={THREE.DoubleSide} roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

function FarmPlot({ position, rotationY = 0, isNight }: { position: [number, number, number]; rotationY?: number; isNight: boolean }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <planeGeometry args={[4.5, 3]} />
        <meshStandardMaterial color={isNight ? '#2a1f18' : '#6a4a2e'} roughness={1} />
      </mesh>
      {[-1.4, -0.45, 0.5, 1.45].map((x, row) => (
        <group key={row} position={[x, 0.05, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[0.35, 2.7]} />
            <meshStandardMaterial color={isNight ? '#36291d' : '#7a5734'} roughness={1} />
          </mesh>
          {Array.from({ length: 7 }).map((_, i) => (
            <mesh key={i} position={[0, 0.13, -1.1 + i * 0.38]} castShadow>
              <sphereGeometry args={[0.11, 6, 6]} />
              <meshStandardMaterial color={row % 2 === 0 ? '#3a8a3a' : '#7a2a2a'} roughness={1} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}


function Fireflies({ isNight, count = 25 }: { isNight: boolean; count?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const positions = useMemo(() => Array.from({ length: count }, () => ({
    x: (Math.random() - 0.5) * 40,
    y: 1 + Math.random() * 3,
    z: (Math.random() - 0.5) * 40,
    speed: 0.2 + Math.random() * 0.4,
    phase: Math.random() * Math.PI * 2,
  })), [count]);

  useFrame((state) => {
    if (!groupRef.current || !isNight) return;
    const t = state.clock.elapsedTime;
    groupRef.current.children.forEach((child, i) => {
      const p = positions[i];
      child.position.set(
        p.x + Math.sin(t * p.speed + p.phase) * 1.5,
        p.y + Math.sin(t * p.speed * 1.3 + p.phase) * 0.5,
        p.z + Math.cos(t * p.speed * 0.8 + p.phase) * 1.5
      );
      const pulse = (Math.sin(t * 2 + p.phase) + 1) * 0.5;
      child.scale.setScalar(0.3 + pulse * 0.7);
      const m = child as THREE.Mesh;
      if (m.material && typeof (m.material as THREE.MeshBasicMaterial).opacity === 'number') {
        (m.material as THREE.MeshBasicMaterial).opacity = pulse * 0.8;
      }
    });
  });

  if (!isNight) return null;
  return (
    <group ref={groupRef}>
      {positions.map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.05, 6, 6]} />
          <meshBasicMaterial color="#ffe060" transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}


export default function Village({ isNight }: Props) {
  const stoneTex = useMemo(() => makeStoneTexture(isNight), [isNight]);
  const stoneFloor = useMemo(() => makeStoneFloorTexture(isNight), [isNight]);
  const grassTex = useMemo(() => makeGrassTexture(isNight), [isNight]);

  const houses: { pos: [number, number, number]; rot?: number; scale?: number }[] = [
    { pos: [-11, 0, -8], scale: 1.03 },
    { pos: [-15.5, 0, -1.5], scale: 0.92 },
    { pos: [-13.5, 0, 8.5], scale: 0.98 },
    { pos: [-8, 0, 16], scale: 0.9 },
    { pos: [-1.5, 0, 19], scale: 1.0 },
    { pos: [6.5, 0, 17.5], scale: 0.88 },
    { pos: [14, 0, 10], scale: 1.0 },
    { pos: [16, 0, 1.5], scale: 0.94 },
    { pos: [12, 0, -8.5], scale: 0.96 },
    { pos: [5.5, 0, -17.5], scale: 1.04 },
    { pos: [-4.5, 0, -18], scale: 0.95 },
    { pos: [0, 0, -24], rot: 0, scale: 1.22 },
    { pos: [-24, 0, -12], scale: 0.85 },
    { pos: [-26, 0, 2], scale: 0.88 },
    { pos: [-23, 0, 15], scale: 0.86 },
    { pos: [23, 0, -13], scale: 0.88 },
    { pos: [26, 0, 1], scale: 0.9 },
    { pos: [23, 0, 15], scale: 0.86 },
    { pos: [-8, 0, -27], scale: 0.82 },
    { pos: [9, 0, -28], scale: 0.84 },
  ];

  const trees: [number, number, number, number][] = [
    [-14, 0, -12, 1.2], [14, 0, -12, 1.3], [-15, 0, 4, 1.1], [15, 0, 4, 1.2],
    [-12, 0, 14, 1.4], [12, 0, 14, 1.1], [-18, 0, -4, 1.3], [18, 0, -4, 1.2],
    [-16, 0, 10, 1.1], [16, 0, 10, 1.3], [-20, 0, 0, 1.5], [20, 0, 0, 1.4],
    [0, 0, 18, 1.3], [0, 0, -20, 1.2], [-20, 0, -15, 1.4], [20, 0, -15, 1.4],
    [-20, 0, 15, 1.3], [20, 0, 15, 1.2], [-6, 0, -4, 0.8], [6, 0, -4, 0.9],
    [-4, 0, 6, 0.9], [4, 0, 6, 0.85], [-30, 0, -25, 1.2], [30, 0, -25, 1.2],
    [-30, 0, 25, 1.1], [30, 0, 25, 1.15], [-28, 0, 5, 0.9], [28, 0, 5, 0.9],
    [-5, 0, 28, 1.0], [6, 0, 29, 0.95], [-17, 0, -27, 1.1], [17, 0, -27, 1.05],
  ];

  return (
    <group>
      <CityWalls isNight={isNight} />
      <Fireflies isNight={isNight} />

      {/* ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial map={grassTex} roughness={1} />
      </mesh>

      {/* grass blades */}
      <Grass count={9000} radius={38} />

      {/* plaza stone floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <circleGeometry args={[7.5, 40]} />
        <meshStandardMaterial map={stoneFloor} roughness={1} />
      </mesh>
      {/* roads */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.008, 0]} receiveShadow>
        <planeGeometry args={[7, 72]} />
        <meshStandardMaterial map={stoneFloor} roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 2]} position={[0, 0.007, 0]} receiveShadow>
        <planeGeometry args={[6, 72]} />
        <meshStandardMaterial map={stoneFloor} roughness={1} />
      </mesh>

      {/* Well & stalls */}
      <Well position={[0, 0, 0]} isNight={isNight} />
      <Fountain position={[0, 0, 8.5]} isNight={isNight} />
      <MarketStall position={[-4.5, 0, 2.8]} rotationY={0.4} isNight={isNight} />
      <MarketStall position={[4.5, 0, -2.8]} rotationY={-0.4 + Math.PI} isNight={isNight} />
      <MarketStall position={[-4.6, 0, -3.5]} rotationY={-0.45} isNight={isNight} />
      <MarketStall position={[4.6, 0, 3.5]} rotationY={Math.PI + 0.45} isNight={isNight} />

      {/* Houses */}
      {houses.map((h, i) => (
        <House
          key={i}
          position={h.pos}
          rotationY={h.rot ?? Math.atan2(-h.pos[0], -h.pos[2])}
          isNight={isNight}
          scale={h.scale}
        />
      ))}

      {/* Trees */}
      {trees.map(([x, y, z, s], i) => (
        <Tree key={i} position={[x, y, z]} scale={s} isNight={isNight} />
      ))}

      {/* Fences */}
      <Fence position={[-15, 0, -6]} length={5} isNight={isNight} />
      <Fence position={[-16, 0, 7]} length={5} isNight={isNight} />
      <Fence position={[15, 0, -6]} length={5} isNight={isNight} />
      <Fence position={[16, 0, 7]} length={5} isNight={isNight} />
      <Fence position={[-24, 0, 8]} rotationY={Math.PI / 2} length={4.5} isNight={isNight} />
      <Fence position={[24, 0, 8]} rotationY={Math.PI / 2} length={4.5} isNight={isNight} />

      {/* Street lamps */}
      {[
        [-6, -6], [6, 6], [-6, 6], [6, -6],
        [-15, -2], [15, 2], [-2, 15], [2, -15],
        [-25, -6], [25, -6], [-25, 12], [25, 12],
      ].map(([x, z], i) => (
        <StreetLamp key={i} position={[x, 0, z]} isNight={isNight} />
      ))}

      {/* Props de ville : quartiers, artisanat, marche, jardins */}
      <Cart position={[-9, 0, -1.5]} rotationY={0.4} isNight={isNight} />
      <Cart position={[11, 0, 5.5]} rotationY={-0.8} isNight={isNight} />
      <Cart position={[0, 0, -10.5]} rotationY={Math.PI / 2} isNight={isNight} />
      {/* la charrette de Toblen, près de la porte sud (quête des pommes) */}
      <Cart position={[2.4, 0, 27.8]} rotationY={0.25} isNight={isNight} />
      <Shrine position={[-18, 0, 18]} rotationY={Math.PI / 4} isNight={isNight} />
      <NoticeBoard position={[-2.8, 0, 6.7]} rotationY={0.3} isNight={isNight} />
      <NoticeBoard position={[21, 0, -2.8]} rotationY={-Math.PI / 2} isNight={isNight} />
      <TrainingDummy position={[17.5, 0, -17.5]} rotationY={-0.7} isNight={isNight} />
      <TrainingDummy position={[19.2, 0, -18.1]} rotationY={0.4} isNight={isNight} />
      <LaundryLine position={[-18.5, 0, -14]} rotationY={0.2} isNight={isNight} />
      <LaundryLine position={[18, 0, 13.5]} rotationY={-0.6} isNight={isNight} />
      <FarmPlot position={[-26, 0, 23]} rotationY={0.2} isNight={isNight} />
      <FarmPlot position={[26, 0, 23]} rotationY={-0.3} isNight={isNight} />
      <HayStack position={[-22, 0, 25]} rotationY={0.4} />
      <HayStack position={[-28, 0, 20]} rotationY={-0.3} />
      <HayStack position={[22, 0, 25]} rotationY={0.1} />
      <HayStack position={[29, 0, 20]} rotationY={0.7} />

      {/* Bancs, barils et sacs pour casser la répétition */}
      {[
        [-2.5, 4.6, 0.2], [2.6, -4.5, -0.2], [-8, 7, 0.9], [8, -7, -0.6],
      ].map(([x, z, r], i) => (
        <group key={i} position={[x, 0, z]} rotation={[0, r, 0]}>
          <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.3, 0.12, 0.35]} />
            <meshStandardMaterial color={isNight ? '#2a1810' : '#5a3d24'} roughness={0.9} />
          </mesh>
          {[-0.45, 0.45].map((lx, li) => (
            <mesh key={li} position={[lx, 0.22, 0]} castShadow>
              <boxGeometry args={[0.08, 0.45, 0.25]} />
              <meshStandardMaterial color={isNight ? '#2a1810' : '#5a3d24'} roughness={0.9} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Scattered crates */}
      {[
        [-2.5, -1, 0.15], [-2.2, -1, 0.45], [2.5, 1, 0.15], [2.8, 1, 0.45], [2.5, 1, 0.75],
        [-11, 3, 0.15], [-10.5, 3.4, 0.15], [12, -4, 0.15], [12.5, -4.4, 0.15], [-21, -3, 0.15], [20, 8, 0.15],
      ].map(([x, z, y], i) => (
        <mesh key={i} position={[x, y, z]} castShadow receiveShadow>
          <boxGeometry args={[0.4, 0.3, 0.4]} />
          <meshStandardMaterial map={stoneTex} roughness={0.9} />
        </mesh>
      ))}

      {/* Distant hills */}
      {[
        [-48, 2, -48, 22, 6, 8],
        [48, 2.5, -48, 20, 7, 8],
        [-48, 2, 48, 24, 6, 8],
        [48, 2.5, 48, 20, 7, 8],
        [0, 3, -55, 28, 8, 10],
        [0, 2.5, 55, 24, 7, 10],
      ].map((h, i) => (
        <mesh key={i} position={[h[0], h[1], h[2]]} castShadow>
          <boxGeometry args={[h[3], h[4], h[5]]} />
          <meshStandardMaterial color={isNight ? '#0a1a25' : '#5a7a9a'} roughness={1} flatShading />
        </mesh>
      ))}

      {/* Clouds (simple low-poly) */}
      {[
        [-35, 15, -35, 1.2],
        [12, 17, -42, 1.0],
        [32, 16, 5, 1.1],
        [-30, 18, 30, 0.9],
        [0, 19, 35, 1.3],
        [45, 17, -25, 1.0],
      ].map(([x, y, z, s], i) => (
        <Cloud key={i} position={[x, y, z]} scale={s} isNight={isNight} />
      ))}
    </group>
  );
}


function Cloud({ position, scale, isNight }: { position: [number, number, number]; scale: number; isNight: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.x += 0.012;
      if (ref.current.position.x > 55) ref.current.position.x = -55;
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });
  return (
    <group ref={ref} position={position} scale={scale}>
      {[
        [0, 0, 0, 2],
        [1.5, 0.2, 0, 1.6],
        [-1.5, 0.1, 0, 1.5],
        [0, 0.4, 0.5, 1.4],
      ].map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[r, 8, 8]} />
          <meshStandardMaterial
            color={isNight ? '#2a3040' : '#e8e8ee'}
            roughness={1}
            flatShading
          />
        </mesh>
      ))}
    </group>
  );
}

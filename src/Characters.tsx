import { useRef, useMemo, MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { makeFaceTexture } from './textures';

export type HatType = 'conical' | 'helm' | 'none' | 'turban' | 'hood';
export type ActionType = 'idle' | 'hammer' | 'wave' | 'carry' | 'cast' | 'play' | 'cook';
export type Species = 'human' | 'dwarf' | 'elf' | 'tiefling' | 'goblin' | 'halfling';
export type Accessory = 'none' | 'staff' | 'lute' | 'bow' | 'holySymbol' | 'pan';

export interface CharacterProps {
  position: [number, number, number];
  rotationY?: number;
  color?: string;          // tunique
  pantColor?: string;      // pantalon
  hatColor?: string;
  skinColor?: string;
  hairColor?: string;
  hatType?: HatType;
  animate?: boolean;
  isPlayer?: boolean;
  walking?: boolean;
  walkingRef?: MutableRefObject<boolean>; // pour le joueur (sans re-render)
  walkSpeed?: number;
  variant?: number;
  action?: ActionType;
  talking?: boolean;       // anime la bouche et les gestes de parole
  species?: Species;
  accessory?: Accessory;
}

/**
 * Tête détaillée : visage texturé (face avant), cheveux, nez 3D, oreilles.
 */
function Head({
  skinColor,
  hairColor,
  faceTex,
  headRef,
  mouthRef,
  showHair,
  species,
  variant,
}: {
  skinColor: string;
  hairColor: string;
  faceTex: THREE.Texture;
  headRef: MutableRefObject<THREE.Group | null>;
  mouthRef: MutableRefObject<THREE.Mesh | null>;
  showHair: boolean;
  species: Species;
  variant: number;
}) {
  const isPointed = species === 'elf' || species === 'goblin';
  const isTiefling = species === 'tiefling';
  const isDwarf = species === 'dwarf';
  return (
    <group ref={headRef} position={[0, 0.72, 0]}>
      {/* crâne : visage texturé sur la face avant uniquement */}
      <mesh castShadow>
        <boxGeometry args={[0.3, 0.34, 0.3]} />
        <meshStandardMaterial attach="material-0" color={skinColor} roughness={0.75} />
        <meshStandardMaterial attach="material-1" color={skinColor} roughness={0.75} />
        <meshStandardMaterial attach="material-2" color={hairColor} roughness={1} />
        <meshStandardMaterial attach="material-3" color={skinColor} roughness={0.75} />
        <meshStandardMaterial attach="material-4" map={faceTex} roughness={0.7} />
        <meshStandardMaterial attach="material-5" color={hairColor} roughness={1} />
      </mesh>
      {/* chevelure : calotte + arrière */}
      {showHair && (
        <>
          <mesh position={[0, 0.14, -0.03]} castShadow>
            <boxGeometry args={[0.34, 0.14, 0.32]} />
            <meshStandardMaterial color={hairColor} roughness={1} />
          </mesh>
          <mesh position={[0, -0.02, -0.16]} castShadow>
            <boxGeometry args={[0.32, 0.3, 0.05]} />
            <meshStandardMaterial color={hairColor} roughness={1} />
          </mesh>
          {/* mèches latérales */}
          <mesh position={[-0.165, 0.04, 0]} castShadow>
            <boxGeometry args={[0.035, 0.2, 0.28]} />
            <meshStandardMaterial color={hairColor} roughness={1} />
          </mesh>
          <mesh position={[0.165, 0.04, 0]} castShadow>
            <boxGeometry args={[0.035, 0.2, 0.28]} />
            <meshStandardMaterial color={hairColor} roughness={1} />
          </mesh>
        </>
      )}
      {/* nez 3D */}
      <mesh position={[0, -0.03, 0.165]} castShadow>
        <boxGeometry args={[0.055, 0.09, 0.06]} />
        <meshStandardMaterial color={skinColor} roughness={0.75} />
      </mesh>
      {/* bouche animée (visible seulement quand le PNJ parle) */}
      <mesh ref={mouthRef} position={[0, -0.095, 0.152]} visible={false}>
        <boxGeometry args={[0.085, 0.03, 0.015]} />
        <meshStandardMaterial color="#4a1512" roughness={0.6} />
      </mesh>
      {/* oreilles : pointues pour elfes et gobelins */}
      {isPointed ? (
        <>
          <mesh position={[-0.205, -0.005, 0.02]} rotation={[0, 0, Math.PI / 2.8]}>
            <coneGeometry args={[0.04, 0.16, 4]} />
            <meshStandardMaterial color={skinColor} roughness={0.75} />
          </mesh>
          <mesh position={[0.205, -0.005, 0.02]} rotation={[0, 0, -Math.PI / 2.8]}>
            <coneGeometry args={[0.04, 0.16, 4]} />
            <meshStandardMaterial color={skinColor} roughness={0.75} />
          </mesh>
        </>
      ) : (
        <>
          <mesh position={[-0.165, -0.02, 0.02]}>
            <boxGeometry args={[0.035, 0.09, 0.06]} />
            <meshStandardMaterial color={skinColor} roughness={0.75} />
          </mesh>
          <mesh position={[0.165, -0.02, 0.02]}>
            <boxGeometry args={[0.035, 0.09, 0.06]} />
            <meshStandardMaterial color={skinColor} roughness={0.75} />
          </mesh>
        </>
      )}
      {/* cornes pour tieffelins */}
      {isTiefling && (
        <>
          <mesh position={[-0.12, 0.18, 0.02]} rotation={[0.3, 0, 0.55]} castShadow>
            <coneGeometry args={[0.045, 0.28, 8]} />
            <meshStandardMaterial color="#1a0a08" roughness={0.8} />
          </mesh>
          <mesh position={[0.12, 0.18, 0.02]} rotation={[0.3, 0, -0.55]} castShadow>
            <coneGeometry args={[0.045, 0.28, 8]} />
            <meshStandardMaterial color="#1a0a08" roughness={0.8} />
          </mesh>
        </>
      )}
      {/* barbe volumétrique pour certains nains */}
      {isDwarf && variant % 2 === 0 && (
        <mesh position={[0, -0.18, 0.12]} castShadow>
          <boxGeometry args={[0.22, 0.18, 0.08]} />
          <meshStandardMaterial color={hairColor} roughness={1} />
        </mesh>
      )}
      {/* cou */}
      <mesh position={[0, -0.22, 0]} castShadow>
        <cylinderGeometry args={[0.075, 0.09, 0.1, 8]} />
        <meshStandardMaterial color={skinColor} roughness={0.75} />
      </mesh>
    </group>
  );
}

/**
 * Personnage articulé : pivots aux épaules et aux hanches pour des
 * animations naturelles (marche, marteau, salut, transport).
 */
export default function Character({
  position,
  rotationY = 0,
  color = '#4a6b8a',
  pantColor = '#3a2a1a',
  hatColor = '#6b4a2b',
  skinColor = '#e8c8a0',
  hairColor = '#3a2818',
  hatType = 'conical',
  animate = true,
  isPlayer = false,
  walking = false,
  walkingRef,
  walkSpeed = 1,
  variant = 0,
  action = 'idle',
  talking = false,
  species = 'human',
  accessory = 'none',
}: CharacterProps) {
  const rootRef = useRef<THREE.Group>(null);
  const torsoRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const mouthRef = useRef<THREE.Mesh>(null);
  const lShoulder = useRef<THREE.Group>(null);
  const rShoulder = useRef<THREE.Group>(null);
  const lHip = useRef<THREE.Group>(null);
  const rHip = useRef<THREE.Group>(null);
  const phaseRef = useRef(Math.random() * Math.PI * 2);

  const faceTex = useMemo(() => makeFaceTexture(skinColor, variant), [skinColor, variant]);

  useFrame((state) => {
    if (!animate && !walkingRef) return;
    if (!rootRef.current) return;
    const t = state.clock.elapsedTime * walkSpeed + phaseRef.current;
    const isWalking = walking || (walkingRef?.current ?? false);

    // bouche : visible et animée seulement pendant la parole
    if (mouthRef.current) {
      mouthRef.current.visible = talking;
      if (talking) {
        const open = 0.4 + Math.abs(Math.sin(t * 9)) * 1.6 + Math.abs(Math.sin(t * 14.3)) * 0.8;
        mouthRef.current.scale.y = open;
        mouthRef.current.scale.x = 1 - Math.abs(Math.sin(t * 9)) * 0.25;
      }
    }

    if (talking) {
      // ----- PARLE : gestes des mains, hochements de tête, sourcils -----
      rootRef.current.position.y = position[1] + Math.sin(t * 2) * 0.015;
      if (torsoRef.current) {
        torsoRef.current.rotation.x = 0.03;
        torsoRef.current.rotation.z = Math.sin(t * 1.2) * 0.02;
        torsoRef.current.scale.y = 1 + Math.sin(t * 2.5) * 0.01;
      }
      // gesticulation naturelle des bras pendant la parole
      if (lShoulder.current) {
        lShoulder.current.rotation.x = -0.3 + Math.sin(t * 2.4) * 0.22;
        lShoulder.current.rotation.z = 0.18 + Math.sin(t * 1.7) * 0.1;
      }
      if (rShoulder.current) {
        rShoulder.current.rotation.x = -0.35 + Math.sin(t * 2.1 + 1.4) * 0.25;
        rShoulder.current.rotation.z = -0.18 - Math.sin(t * 1.9) * 0.1;
      }
      if (lHip.current) lHip.current.rotation.x = 0;
      if (rHip.current) rHip.current.rotation.x = 0;
      // hochements de tête expressifs
      if (headRef.current) {
        headRef.current.rotation.x = Math.sin(t * 3.2) * 0.06 + 0.02;
        headRef.current.rotation.y = Math.sin(t * 1.1) * 0.08;
        headRef.current.rotation.z = Math.sin(t * 2.6) * 0.025;
      }
    } else if (isWalking) {
      // ----- CYCLE DE MARCHE -----
      const f = t * 7;
      const swing = Math.sin(f);
      // jambes : pivot à la hanche
      if (lHip.current) lHip.current.rotation.x = swing * 0.65;
      if (rHip.current) rHip.current.rotation.x = -swing * 0.65;
      // bras : balancement opposé, léger écart
      if (lShoulder.current) {
        lShoulder.current.rotation.x = -swing * 0.5;
        lShoulder.current.rotation.z = 0.08;
      }
      if (rShoulder.current) {
        rShoulder.current.rotation.x = swing * 0.5;
        rShoulder.current.rotation.z = -0.08;
      }
      // rebond vertical + inclinaison avant + roulis des épaules
      rootRef.current.position.y = position[1] + Math.abs(Math.sin(f)) * 0.06;
      if (torsoRef.current) {
        torsoRef.current.rotation.x = 0.09;
        torsoRef.current.rotation.z = Math.sin(f) * 0.04;
      }
      if (headRef.current) {
        headRef.current.rotation.y = Math.sin(f * 0.5) * 0.08;
        headRef.current.rotation.x = -0.05;
      }
    } else if (action === 'hammer') {
      // ----- FORGERON : COUP DE MARTEAU -----
      const cycle = Math.max(0, Math.sin(t * 4));
      const raise = Math.pow(cycle, 0.6); // monte vite, frappe sec
      if (rShoulder.current) rShoulder.current.rotation.x = -0.5 - raise * 1.6;
      if (lShoulder.current) lShoulder.current.rotation.x = 0.25;
      if (torsoRef.current) torsoRef.current.rotation.x = 0.18 + (1 - raise) * 0.12;
      if (headRef.current) headRef.current.rotation.x = 0.25;
      rootRef.current.position.y = position[1];
      if (lHip.current) lHip.current.rotation.x = 0.1;
      if (rHip.current) rHip.current.rotation.x = -0.15;
    } else if (action === 'wave') {
      // ----- SALUT DE LA MAIN -----
      if (rShoulder.current) {
        rShoulder.current.rotation.x = -2.7;
        rShoulder.current.rotation.z = Math.sin(t * 7) * 0.35;
      }
      if (lShoulder.current) lShoulder.current.rotation.x = Math.sin(t * 2) * 0.06;
      if (headRef.current) headRef.current.rotation.y = Math.sin(t * 0.8) * 0.2;
      rootRef.current.position.y = position[1] + Math.sin(t * 2) * 0.015;
    } else if (action === 'carry') {
      // ----- PORTE UN SEAU/PANIER (deux bras devant) -----
      if (lShoulder.current) { lShoulder.current.rotation.x = -0.55; lShoulder.current.rotation.z = 0.15; }
      if (rShoulder.current) { rShoulder.current.rotation.x = -0.55; rShoulder.current.rotation.z = -0.15; }
      if (torsoRef.current) torsoRef.current.rotation.x = -0.05;
      rootRef.current.position.y = position[1] + Math.sin(t * 2) * 0.015;
      if (headRef.current) headRef.current.rotation.y = Math.sin(t * 0.6) * 0.25;
    } else {
      // ----- IDLE : respiration, regard, balancement -----
      rootRef.current.position.y = position[1] + Math.sin(t * 2) * 0.02;
      if (torsoRef.current) {
        torsoRef.current.scale.y = 1 + Math.sin(t * 2) * 0.018;
        torsoRef.current.rotation.z = Math.sin(t * 0.8) * 0.02;
        torsoRef.current.rotation.x = 0;
      }
      if (lShoulder.current) { lShoulder.current.rotation.x = Math.sin(t * 2) * 0.06; lShoulder.current.rotation.z = 0.05; }
      if (rShoulder.current) { rShoulder.current.rotation.x = -Math.sin(t * 2) * 0.06; rShoulder.current.rotation.z = -0.05; }
      if (lHip.current) lHip.current.rotation.x = 0;
      if (rHip.current) rHip.current.rotation.x = 0;
      if (headRef.current) {
        headRef.current.rotation.y = Math.sin(t * 0.55) * 0.35;
        headRef.current.rotation.x = Math.sin(t * 0.4) * 0.06;
      }
    }
    rootRef.current.rotation.y = rotationY;
  });

  return (
    <group ref={rootRef} position={position} rotation={[0, rotationY, 0]}>
      {/* ============ TORSE (groupe pour lean/respiration) ============ */}
      <group ref={torsoRef} position={[0, 1.06, 0]}>
        {/* tunique */}
        <mesh castShadow>
          <boxGeometry args={[0.42, 0.62, 0.26]} />
          <meshStandardMaterial color={color} roughness={0.85} />
        </mesh>
        {/* bas de tunique évasé */}
        <mesh position={[0, -0.36, 0]} castShadow>
          <boxGeometry args={[0.46, 0.14, 0.3]} />
          <meshStandardMaterial color={color} roughness={0.9} />
        </mesh>
        {/* épaules rembourrées */}
        <mesh position={[-0.24, 0.26, 0]} castShadow>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color={color} roughness={0.85} />
        </mesh>
        <mesh position={[0.24, 0.26, 0]} castShadow>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color={color} roughness={0.85} />
        </mesh>
        {/* laçage frontal */}
        {[0.12, 0.04, -0.04].map((y, i) => (
          <mesh key={i} position={[0, y + 0.12, 0.135]}>
            <boxGeometry args={[0.1, 0.015, 0.01]} />
            <meshStandardMaterial color="#2a1810" />
          </mesh>
        ))}
        {/* ceinture */}
        <mesh position={[0, -0.24, 0]} castShadow>
          <boxGeometry args={[0.45, 0.08, 0.3]} />
          <meshStandardMaterial color="#2a1810" roughness={0.9} />
        </mesh>
        <mesh position={[0, -0.24, 0.155]}>
          <boxGeometry args={[0.09, 0.07, 0.02]} />
          <meshStandardMaterial color="#c9a227" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* bourse à la ceinture */}
        <mesh position={[0.17, -0.32, 0.1]} castShadow>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#5a3d24" roughness={1} />
        </mesh>

        {/* ============ TÊTE ============ */}
        <Head
          skinColor={skinColor}
          hairColor={hairColor}
          faceTex={faceTex}
          headRef={headRef}
          mouthRef={mouthRef}
          showHair={hatType !== 'helm' && hatType !== 'hood'}
          species={species}
          variant={variant}
        />

        {/* détails raciaux / équipement visibles */}
        {species === 'tiefling' && (
          <mesh position={[0.06, -0.18, -0.28]} rotation={[1.0, 0.25, 0]} castShadow>
            <torusGeometry args={[0.26, 0.025, 8, 18, Math.PI * 1.35]} />
            <meshStandardMaterial color={skinColor} roughness={0.8} />
          </mesh>
        )}
        {accessory === 'staff' && (
          <mesh position={[0.42, -0.08, 0.12]} rotation={[0.12, 0, 0.08]} castShadow>
            <cylinderGeometry args={[0.025, 0.035, 1.8, 8]} />
            <meshStandardMaterial color="#3a2718" roughness={0.9} />
          </mesh>
        )}
        {accessory === 'lute' && (
          <group position={[0.35, -0.1, 0.15]} rotation={[0.2, -0.2, -0.2]}>
            <mesh castShadow>
              <sphereGeometry args={[0.16, 10, 10]} />
              <meshStandardMaterial color="#7a4a24" roughness={0.7} />
            </mesh>
            <mesh position={[0, 0.22, 0]} castShadow>
              <boxGeometry args={[0.06, 0.36, 0.04]} />
              <meshStandardMaterial color="#3a2718" roughness={0.8} />
            </mesh>
          </group>
        )}
        {accessory === 'bow' && (
          <mesh position={[-0.42, -0.05, -0.05]} rotation={[0.1, 0.2, 0.35]} castShadow>
            <torusGeometry args={[0.36, 0.018, 8, 24, Math.PI * 1.55]} />
            <meshStandardMaterial color="#5a3d24" roughness={0.9} />
          </mesh>
        )}
        {accessory === 'holySymbol' && (
          <mesh position={[0, 0.03, 0.155]}>
            <torusGeometry args={[0.055, 0.009, 8, 16]} />
            <meshStandardMaterial color="#c9a227" metalness={0.8} roughness={0.25} />
          </mesh>
        )}
        {accessory === 'pan' && (
          <group position={[0.42, -0.32, 0.08]} rotation={[0.2, 0, -0.6]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.14, 0.12, 0.05, 12]} />
              <meshStandardMaterial color="#2c2c30" metalness={0.7} roughness={0.35} />
            </mesh>
            <mesh position={[0, 0.22, 0]} castShadow>
              <boxGeometry args={[0.04, 0.4, 0.035]} />
              <meshStandardMaterial color="#2c2c30" metalness={0.6} roughness={0.4} />
            </mesh>
          </group>
        )}

        {/* ============ COUVRE-CHEF ============ */}
        {hatType === 'conical' && (
          <group position={[0, 0.98, 0]}>
            <mesh castShadow>
              <coneGeometry args={[0.27, 0.34, 12]} />
              <meshStandardMaterial color={hatColor} roughness={0.85} />
            </mesh>
            <mesh position={[0, -0.13, 0]} castShadow>
              <cylinderGeometry args={[0.33, 0.33, 0.04, 12]} />
              <meshStandardMaterial color={hatColor} roughness={0.85} />
            </mesh>
          </group>
        )}
        {hatType === 'turban' && (
          <mesh position={[0, 0.94, 0]} castShadow>
            <sphereGeometry args={[0.21, 12, 10]} />
            <meshStandardMaterial color={hatColor} roughness={1} />
          </mesh>
        )}
        {hatType === 'hood' && (
          <group>
            <mesh position={[0, 0.88, -0.02]} castShadow>
              <sphereGeometry args={[0.22, 10, 10]} />
              <meshStandardMaterial color={hatColor} roughness={1} />
            </mesh>
            <mesh position={[0, 0.56, -0.12]} castShadow>
              <boxGeometry args={[0.36, 0.4, 0.12]} />
              <meshStandardMaterial color={hatColor} roughness={1} />
            </mesh>
          </group>
        )}
        {hatType === 'helm' && (
          <group position={[0, 0.82, 0]}>
            <mesh castShadow>
              <sphereGeometry args={[0.19, 10, 10]} />
              <meshStandardMaterial color="#8a8a95" metalness={0.7} roughness={0.35} />
            </mesh>
            <mesh position={[0, -0.05, 0.16]}>
              <boxGeometry args={[0.04, 0.16, 0.05]} />
              <meshStandardMaterial color="#8a8a95" metalness={0.7} roughness={0.35} />
            </mesh>
          </group>
        )}

        {/* ============ BRAS (pivot épaule) ============ */}
        <group ref={lShoulder} position={[-0.27, 0.24, 0]}>
          {/* manche haute */}
          <mesh position={[0, -0.14, 0]} castShadow>
            <boxGeometry args={[0.13, 0.3, 0.13]} />
            <meshStandardMaterial color={color} roughness={0.85} />
          </mesh>
          {/* avant-bras (peau) */}
          <mesh position={[0, -0.38, 0]} castShadow>
            <boxGeometry args={[0.11, 0.24, 0.11]} />
            <meshStandardMaterial color={skinColor} roughness={0.75} />
          </mesh>
          {/* main */}
          <mesh position={[0, -0.54, 0]} castShadow>
            <sphereGeometry args={[0.065, 8, 8]} />
            <meshStandardMaterial color={skinColor} roughness={0.75} />
          </mesh>
          {/* seau si porte */}
          {action === 'carry' && (
            <group position={[0.13, -0.6, 0.08]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.12, 0.09, 0.18, 10]} />
                <meshStandardMaterial color="#5a3d24" roughness={0.9} />
              </mesh>
              <mesh position={[0, 0.05, 0]}>
                <torusGeometry args={[0.11, 0.012, 6, 12]} />
                <meshStandardMaterial color="#2c2c30" metalness={0.5} />
              </mesh>
            </group>
          )}
        </group>
        <group ref={rShoulder} position={[0.27, 0.24, 0]}>
          <mesh position={[0, -0.14, 0]} castShadow>
            <boxGeometry args={[0.13, 0.3, 0.13]} />
            <meshStandardMaterial color={color} roughness={0.85} />
          </mesh>
          <mesh position={[0, -0.38, 0]} castShadow>
            <boxGeometry args={[0.11, 0.24, 0.11]} />
            <meshStandardMaterial color={skinColor} roughness={0.75} />
          </mesh>
          <mesh position={[0, -0.54, 0]} castShadow>
            <sphereGeometry args={[0.065, 8, 8]} />
            <meshStandardMaterial color={skinColor} roughness={0.75} />
          </mesh>
          {/* marteau si forgeron */}
          {action === 'hammer' && (
            <group position={[0, -0.6, 0.05]} rotation={[0.4, 0, 0]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.022, 0.022, 0.5, 8]} />
                <meshStandardMaterial color="#5a3d24" roughness={0.9} />
              </mesh>
              <mesh position={[0, 0.25, 0]} castShadow>
                <boxGeometry args={[0.16, 0.1, 0.1]} />
                <meshStandardMaterial color="#3a3a40" metalness={0.7} roughness={0.4} />
              </mesh>
            </group>
          )}
        </group>
      </group>

      {/* ============ JAMBES (pivot hanche) ============ */}
      <group ref={lHip} position={[-0.11, 0.78, 0]}>
        <mesh position={[0, -0.26, 0]} castShadow>
          <boxGeometry args={[0.15, 0.52, 0.15]} />
          <meshStandardMaterial color={pantColor} roughness={0.95} />
        </mesh>
        {/* botte */}
        <mesh position={[0, -0.52, 0.04]} castShadow>
          <boxGeometry args={[0.16, 0.14, 0.26]} />
          <meshStandardMaterial color="#1a1008" roughness={0.85} />
        </mesh>
      </group>
      <group ref={rHip} position={[0.11, 0.78, 0]}>
        <mesh position={[0, -0.26, 0]} castShadow>
          <boxGeometry args={[0.15, 0.52, 0.15]} />
          <meshStandardMaterial color={pantColor} roughness={0.95} />
        </mesh>
        <mesh position={[0, -0.52, 0.04]} castShadow>
          <boxGeometry args={[0.16, 0.14, 0.26]} />
          <meshStandardMaterial color="#1a1008" roughness={0.85} />
        </mesh>
      </group>

      {/* Marqueur joueur */}
      {isPlayer && (
        <mesh position={[0, 2.55, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.12, 0.25, 4]} />
          <meshStandardMaterial color="#ffd040" emissive="#ffaa00" emissiveIntensity={1.2} />
        </mesh>
      )}
    </group>
  );
}

/**
 * Chevalier en armure, articulé, idle avec épée
 */
export function Knight({ position, rotationY = 0 }: { position: [number, number, number]; rotationY?: number }) {
  const ref = useRef<THREE.Group>(null);
  const swordArm = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = rotationY + Math.sin(t * 0.4) * 0.05;
    ref.current.position.y = position[1] + Math.sin(t * 1.3) * 0.02;
    if (swordArm.current) swordArm.current.rotation.x = Math.sin(t * 1.3) * 0.12 - 0.15;
    if (headRef.current) headRef.current.rotation.y = Math.sin(t * 0.5) * 0.3;
  });
  const steel = { color: '#9aa0ab', metalness: 0.75, roughness: 0.3 };
  return (
    <group ref={ref} position={position}>
      {/* cuirasse */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <boxGeometry args={[0.48, 0.65, 0.32]} />
        <meshStandardMaterial {...steel} />
      </mesh>
      {/* plastron bombé */}
      <mesh position={[0, 1.18, 0.14]} castShadow>
        <sphereGeometry args={[0.2, 10, 10]} />
        <meshStandardMaterial {...steel} />
      </mesh>
      {/* emblème doré */}
      <mesh position={[0, 1.12, 0.19]}>
        <cylinderGeometry args={[0.07, 0.07, 0.02, 6]} />
        <meshStandardMaterial color="#c9a227" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* jupe d'armure */}
      <mesh position={[0, 0.72, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.36, 0.25, 8]} />
        <meshStandardMaterial {...steel} />
      </mesh>
      {/* cape */}
      <mesh position={[0, 1.15, -0.2]} rotation={[0.08, 0, 0]} castShadow>
        <boxGeometry args={[0.55, 1.15, 0.04]} />
        <meshStandardMaterial color="#7a1f2b" roughness={1} />
      </mesh>
      {/* tête casquée */}
      <group ref={headRef} position={[0, 1.66, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.2, 12, 12]} />
          <meshStandardMaterial color="#a8aeb8" metalness={0.85} roughness={0.25} />
        </mesh>
        <mesh position={[0, -0.02, 0.17]}>
          <boxGeometry args={[0.21, 0.045, 0.02]} />
          <meshStandardMaterial color="#1a0a05" emissive="#ff5500" emissiveIntensity={0.9} />
        </mesh>
        {/* panache */}
        <mesh position={[0, 0.26, -0.05]} rotation={[0.3, 0, 0]} castShadow>
          <boxGeometry args={[0.07, 0.3, 0.18]} />
          <meshStandardMaterial color="#c23a3a" roughness={1} />
        </mesh>
      </group>
      {/* épaulières */}
      <mesh position={[-0.3, 1.42, 0]} castShadow>
        <sphereGeometry args={[0.13, 8, 8]} />
        <meshStandardMaterial {...steel} />
      </mesh>
      <mesh position={[0.3, 1.42, 0]} castShadow>
        <sphereGeometry args={[0.13, 8, 8]} />
        <meshStandardMaterial {...steel} />
      </mesh>
      {/* bras gauche + bouclier */}
      <group position={[-0.3, 1.36, 0]}>
        <mesh position={[0, -0.25, 0]} castShadow>
          <boxGeometry args={[0.15, 0.52, 0.15]} />
          <meshStandardMaterial {...steel} />
        </mesh>
        <group position={[-0.08, -0.4, 0.05]} rotation={[0, 0.25, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.32, 0.26, 0.07, 6]} />
            <meshStandardMaterial color="#7a1f2b" metalness={0.3} roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.045, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.03, 12]} />
            <meshStandardMaterial color="#c9a227" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      </group>
      {/* bras droit + épée */}
      <group ref={swordArm} position={[0.3, 1.36, 0]}>
        <mesh position={[0, -0.25, 0]} castShadow>
          <boxGeometry args={[0.15, 0.52, 0.15]} />
          <meshStandardMaterial {...steel} />
        </mesh>
        <group position={[0, -0.52, 0.08]} rotation={[-0.35, 0, 0]}>
          <mesh position={[0, 0.5, 0]} castShadow>
            <boxGeometry args={[0.05, 1.15, 0.025]} />
            <meshStandardMaterial color="#e0e4e8" metalness={0.95} roughness={0.12} />
          </mesh>
          <mesh position={[0, 1.1, 0]} castShadow>
            <coneGeometry args={[0.04, 0.12, 4]} />
            <meshStandardMaterial color="#e0e4e8" metalness={0.95} roughness={0.12} />
          </mesh>
          <mesh position={[0, -0.08, 0]} castShadow>
            <boxGeometry args={[0.26, 0.05, 0.07]} />
            <meshStandardMaterial color="#c9a227" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, -0.2, 0]} castShadow>
            <cylinderGeometry args={[0.028, 0.028, 0.18, 8]} />
            <meshStandardMaterial color="#2a1810" />
          </mesh>
          <mesh position={[0, -0.32, 0]}>
            <sphereGeometry args={[0.045, 8, 8]} />
            <meshStandardMaterial color="#c9a227" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      </group>
      {/* jambes */}
      {[-0.13, 0.13].map((x, i) => (
        <group key={i} position={[x, 0.62, 0]}>
          <mesh position={[0, -0.18, 0]} castShadow>
            <boxGeometry args={[0.17, 0.45, 0.17]} />
            <meshStandardMaterial {...steel} />
          </mesh>
          <mesh position={[0, -0.42, 0.05]} castShadow>
            <boxGeometry args={[0.19, 0.13, 0.28]} />
            <meshStandardMaterial color="#3a3a42" metalness={0.6} roughness={0.4} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * PNJ qui marche en cercle avec vraie animation de marche
 */
export function WanderingNPC({
  startPos,
  radius = 3,
  speed = 0.5,
  color,
  pantColor,
  hatColor,
  hatType = 'conical',
  skinColor,
  hairColor,
  variant = 0,
}: {
  startPos: [number, number, number];
  radius?: number;
  speed?: number;
  color?: string;
  pantColor?: string;
  hatColor?: string;
  hatType?: HatType;
  skinColor?: string;
  hairColor?: string;
  variant?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime * speed * 0.3;
    const x = startPos[0] + Math.cos(t) * radius;
    const z = startPos[2] + Math.sin(t * 1.3) * radius;
    groupRef.current.position.x = x;
    groupRef.current.position.z = z;
    const dx = -Math.sin(t);
    const dz = Math.cos(t * 1.3) * 1.3;
    groupRef.current.rotation.y = Math.atan2(dx, dz);
  });
  return (
    <group ref={groupRef} position={startPos}>
      <Character
        position={[0, 0, 0]}
        rotationY={0}
        color={color}
        pantColor={pantColor}
        hatColor={hatColor}
        hatType={hatType}
        skinColor={skinColor}
        hairColor={hairColor}
        walking
        walkSpeed={Math.max(0.8, speed)}
        variant={variant}
      />
    </group>
  );
}

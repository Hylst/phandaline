import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export type FurnitureType =
  | 'throne'
  | 'table'
  | 'chest'
  | 'bed'
  | 'torch'
  | 'barrel'
  | 'bookshelf'
  | 'anvil'
  | 'brazier'
  | 'weaponrack';

interface FurnitureProps {
  type: FurnitureType;
  position: [number, number, number];
  rotation?: [number, number, number];
  isNight?: boolean;
}

export default function Furniture({ type, position, rotation = [0, 0, 0], isNight = false }: FurnitureProps) {
  switch (type) {
    case 'throne':
      return <Throne position={position} rotation={rotation} />;
    case 'table':
      return <Table position={position} rotation={rotation} />;
    case 'chest':
      return <Chest position={position} rotation={rotation} />;
    case 'bed':
      return <Bed position={position} rotation={rotation} />;
    case 'torch':
      return <Torch position={position} isNight={isNight} />;
    case 'barrel':
      return <Barrel position={position} rotation={rotation} />;
    case 'bookshelf':
      return <Bookshelf position={position} rotation={rotation} />;
    case 'anvil':
      return <Anvil position={position} rotation={rotation} />;
    case 'brazier':
      return <Brazier position={position} isNight={isNight} />;
    case 'weaponrack':
      return <WeaponRack position={position} rotation={rotation} />;
    default:
      return null;
  }
}

const STONE = '#6b6357';
const DARK_WOOD = '#3a2718';
const WOOD = '#5a3d24';
const GOLD = '#c9a227';
const IRON = '#2c2c30';
const RUST = '#5a3a28';

function Throne({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* base / dais */}
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.2, 1.6]} />
        <meshStandardMaterial color={STONE} roughness={0.9} />
      </mesh>
      {/* seat */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[1, 0.2, 0.9]} />
        <meshStandardMaterial color={DARK_WOOD} roughness={0.7} />
      </mesh>
      {/* seat cushion */}
      <mesh position={[0, 0.72, 0]} castShadow>
        <boxGeometry args={[0.85, 0.08, 0.75]} />
        <meshStandardMaterial color="#7a1f2b" roughness={0.8} />
      </mesh>
      {/* tall back */}
      <mesh position={[0, 1.5, -0.4]} castShadow>
        <boxGeometry args={[1, 1.9, 0.18]} />
        <meshStandardMaterial color={DARK_WOOD} roughness={0.7} />
      </mesh>
      {/* back cushion */}
      <mesh position={[0, 1.2, -0.3]} castShadow>
        <boxGeometry args={[0.7, 1, 0.08]} />
        <meshStandardMaterial color="#7a1f2b" roughness={0.8} />
      </mesh>
      {/* gold crown top */}
      <mesh position={[0, 2.5, -0.4]} castShadow>
        <boxGeometry args={[1.1, 0.15, 0.25]} />
        <meshStandardMaterial color={GOLD} metalness={0.7} roughness={0.3} />
      </mesh>
      {/* gold spikes on top */}
      {[-0.4, 0, 0.4].map((x, i) => (
        <mesh key={i} position={[x, 2.75, -0.4]} castShadow>
          <coneGeometry args={[0.1, 0.4, 4]} />
          <meshStandardMaterial color={GOLD} metalness={0.7} roughness={0.3} />
        </mesh>
      ))}
      {/* armrests */}
      {[-0.55, 0.55].map((x, i) => (
        <mesh key={i} position={[x, 0.85, 0]} castShadow>
          <boxGeometry args={[0.15, 0.5, 0.9]} />
          <meshStandardMaterial color={DARK_WOOD} roughness={0.7} />
        </mesh>
      ))}
      {/* gold orbs on armrests */}
      {[-0.55, 0.55].map((x, i) => (
        <mesh key={i} position={[x, 1.15, 0.4]} castShadow>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshStandardMaterial color={GOLD} metalness={0.7} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

function Table({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* thick top */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 0.12, 1.1]} />
        <meshStandardMaterial color={WOOD} roughness={0.8} />
      </mesh>
      {/* iron bands */}
      {[-0.9, 0.9].map((x, i) => (
        <mesh key={i} position={[x, 0.75, 0]} castShadow>
          <boxGeometry args={[0.1, 0.14, 1.12]} />
          <meshStandardMaterial color={IRON} metalness={0.6} roughness={0.5} />
        </mesh>
      ))}
      {/* legs */}
      {[[-1.0, -0.42], [1.0, -0.42], [-1.0, 0.42], [1.0, 0.42]].map((p, i) => (
        <mesh key={i} position={[p[0], 0.37, p[1]]} castShadow>
          <boxGeometry args={[0.18, 0.75, 0.18]} />
          <meshStandardMaterial color={DARK_WOOD} roughness={0.8} />
        </mesh>
      ))}
      {/* cross support */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[2.0, 0.1, 0.1]} />
        <meshStandardMaterial color={DARK_WOOD} roughness={0.8} />
      </mesh>
      {/* goblet */}
      <mesh position={[-0.6, 0.92, 0.2]} castShadow>
        <cylinderGeometry args={[0.08, 0.05, 0.18, 12]} />
        <meshStandardMaterial color={GOLD} metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[-0.6, 0.82, 0.2]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.06, 12]} />
        <meshStandardMaterial color={GOLD} metalness={0.7} roughness={0.3} />
      </mesh>
      {/* candle */}
      <mesh position={[0.5, 0.86, -0.1]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.16, 10]} />
        <meshStandardMaterial color="#e8dcc0" />
      </mesh>
      <mesh position={[0.5, 0.96, -0.1]}>
        <coneGeometry args={[0.03, 0.08, 8]} />
        <meshStandardMaterial color="#ffb030" emissive="#ff8800" emissiveIntensity={2} />
      </mesh>
      {/* scroll */}
      <mesh position={[0.3, 0.83, 0.3]} rotation={[0, 0.5, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.4, 12]} />
        <meshStandardMaterial color="#d8c8a0" />
      </mesh>
    </group>
  );
}

function Chest({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* body */}
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.1, 0.6, 0.7]} />
        <meshStandardMaterial color={WOOD} roughness={0.8} />
      </mesh>
      {/* lid (rounded via cylinder) */}
      <mesh position={[0, 0.62, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.36, 0.36, 1.1, 16, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color={DARK_WOOD} roughness={0.8} side={THREE.DoubleSide} />
      </mesh>
      {/* iron bands */}
      {[-0.35, 0.35].map((x, i) => (
        <mesh key={i} position={[x, 0.45, 0]} castShadow>
          <boxGeometry args={[0.08, 0.95, 0.74]} />
          <meshStandardMaterial color={IRON} metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
      {/* gold lock */}
      <mesh position={[0, 0.45, 0.36]} castShadow>
        <boxGeometry args={[0.18, 0.22, 0.06]} />
        <meshStandardMaterial color={GOLD} metalness={0.8} roughness={0.3} />
      </mesh>
      {/* treasure glow inside (peeking) */}
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[0.9, 0.05, 0.5]} />
        <meshStandardMaterial color={GOLD} emissive={GOLD} emissiveIntensity={0.4} metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

function Bed({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* frame */}
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.35, 2.8]} />
        <meshStandardMaterial color={DARK_WOOD} roughness={0.8} />
      </mesh>
      {/* straw mattress */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <boxGeometry args={[1.9, 0.25, 2.7]} />
        <meshStandardMaterial color="#c9a85a" roughness={1} />
      </mesh>
      {/* fur blanket */}
      <mesh position={[0, 0.68, 0.5]} castShadow>
        <boxGeometry args={[1.95, 0.12, 1.7]} />
        <meshStandardMaterial color="#5a4632" roughness={1} />
      </mesh>
      {/* pillow */}
      <mesh position={[0, 0.72, -1]} castShadow>
        <boxGeometry args={[1.4, 0.18, 0.5]} />
        <meshStandardMaterial color="#d8c8a8" roughness={0.9} />
      </mesh>
      {/* tall carved posts */}
      {[[-0.9, -1.35], [0.9, -1.35], [-0.9, 1.35], [0.9, 1.35]].map((p, i) => (
        <group key={i}>
          <mesh position={[p[0], 0.9, p[1]]} castShadow>
            <cylinderGeometry args={[0.1, 0.12, 1.8, 12]} />
            <meshStandardMaterial color={WOOD} roughness={0.8} />
          </mesh>
          <mesh position={[p[0], 1.85, p[1]]} castShadow>
            <sphereGeometry args={[0.14, 12, 12]} />
            <meshStandardMaterial color={GOLD} metalness={0.6} roughness={0.4} />
          </mesh>
        </group>
      ))}
      {/* canopy */}
      <mesh position={[0, 1.85, 0]} castShadow>
        <boxGeometry args={[2.1, 0.1, 2.9]} />
        <meshStandardMaterial color="#5a1f2b" roughness={0.9} />
      </mesh>
    </group>
  );
}

function Torch({ position, isNight }: { position: [number, number, number]; isNight: boolean }) {
  const flameRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const flicker = 0.85 + Math.sin(t * 12) * 0.1 + Math.sin(t * 23) * 0.05;
    if (flameRef.current) {
      flameRef.current.scale.set(flicker, 1 + Math.sin(t * 15) * 0.15, flicker);
    }
    if (lightRef.current) {
      lightRef.current.intensity = (isNight ? 2.2 : 0.8) * flicker;
    }
  });
  return (
    <group position={position}>
      {/* wall bracket */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.6, 8]} />
        <meshStandardMaterial color={IRON} metalness={0.6} roughness={0.5} />
      </mesh>
      {/* handle wrap */}
      <mesh position={[0, 1.55, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.06, 0.2, 10]} />
        <meshStandardMaterial color={RUST} roughness={0.9} />
      </mesh>
      {/* flame */}
      <mesh ref={flameRef} position={[0, 1.78, 0]}>
        <coneGeometry args={[0.13, 0.4, 10]} />
        <meshStandardMaterial color="#ff9020" emissive="#ff6600" emissiveIntensity={2.5} transparent opacity={0.95} />
      </mesh>
      <mesh position={[0, 1.72, 0]}>
        <coneGeometry args={[0.08, 0.25, 10]} />
        <meshStandardMaterial color="#ffe080" emissive="#ffcc00" emissiveIntensity={3} />
      </mesh>
      <pointLight ref={lightRef} position={[0, 1.8, 0.2]} color="#ff7722" distance={6} decay={2} />
    </group>
  );
}

function Barrel({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.38, 0.32, 0.9, 16]} />
        <meshStandardMaterial color={WOOD} roughness={0.85} />
      </mesh>
      {/* iron hoops */}
      {[0.15, 0.45, 0.75].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <torusGeometry args={[i === 1 ? 0.39 : 0.36, 0.025, 8, 24]} />
          <meshStandardMaterial color={IRON} metalness={0.6} roughness={0.5} />
        </mesh>
      ))}
      {/* top */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.33, 0.33, 0.04, 16]} />
        <meshStandardMaterial color={DARK_WOOD} roughness={0.85} />
      </mesh>
    </group>
  );
}

function Bookshelf({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  const bookColors = ['#5a2a2a', '#2a3a5a', '#5a4a1a', '#3a2a4a', '#2a4a3a', '#4a3020', '#3a1a3a'];
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.3, 2.2, 0.4]} />
        <meshStandardMaterial color={DARK_WOOD} roughness={0.85} />
      </mesh>
      {[0.35, 0.9, 1.45, 1.9].map((y, shelfIdx) => (
        <group key={shelfIdx}>
          <mesh position={[0, y, 0]} castShadow>
            <boxGeometry args={[1.2, 0.04, 0.38]} />
            <meshStandardMaterial color={WOOD} roughness={0.85} />
          </mesh>
          {Array.from({ length: 7 }).map((_, i) => {
            const h = 0.26 + ((i * 7 + shelfIdx) % 3) * 0.03;
            return (
              <mesh key={i} position={[-0.52 + i * 0.17, y + h / 2 + 0.02, 0]} castShadow>
                <boxGeometry args={[0.11, h, 0.3]} />
                <meshStandardMaterial color={bookColors[(i + shelfIdx) % bookColors.length]} roughness={0.9} />
              </mesh>
            );
          })}
        </group>
      ))}
      {/* a potion on top */}
      <mesh position={[0.3, 2.35, 0]} castShadow>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial color="#40c0a0" emissive="#20a080" emissiveIntensity={0.5} transparent opacity={0.85} />
      </mesh>
    </group>
  );
}

function Anvil({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* wood stump base */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.35, 0.4, 0.5, 12]} />
        <meshStandardMaterial color={DARK_WOOD} roughness={0.9} />
      </mesh>
      {/* anvil body */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[0.45, 0.2, 0.3]} />
        <meshStandardMaterial color={IRON} metalness={0.7} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.72, 0]} castShadow>
        <boxGeometry args={[0.7, 0.12, 0.35]} />
        <meshStandardMaterial color={IRON} metalness={0.7} roughness={0.4} />
      </mesh>
      {/* horn */}
      <mesh position={[0.45, 0.72, 0]} rotation={[0, 0, -0.1]} castShadow>
        <coneGeometry args={[0.1, 0.4, 12]} />
        <meshStandardMaterial color={IRON} metalness={0.7} roughness={0.4} />
      </mesh>
      {/* hammer leaning */}
      <mesh position={[-0.3, 0.55, 0.25]} rotation={[0.3, 0, 0.6]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.6, 8]} />
        <meshStandardMaterial color={WOOD} roughness={0.9} />
      </mesh>
      <mesh position={[-0.42, 0.83, 0.32]} rotation={[0.3, 0, 0.6]} castShadow>
        <boxGeometry args={[0.18, 0.1, 0.1]} />
        <meshStandardMaterial color={IRON} metalness={0.7} roughness={0.4} />
      </mesh>
    </group>
  );
}

function Brazier({ position, isNight }: { position: [number, number, number]; isNight: boolean }) {
  const fireRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const flicker = 0.8 + Math.sin(t * 10) * 0.12 + Math.sin(t * 19) * 0.08;
    if (fireRef.current) {
      fireRef.current.scale.set(flicker, 1 + Math.sin(t * 14) * 0.2, flicker);
      fireRef.current.rotation.y = t * 0.5;
    }
    if (lightRef.current) {
      lightRef.current.intensity = (isNight ? 3 : 1.2) * flicker;
    }
  });
  return (
    <group position={position}>
      {/* legs */}
      {[0, 1, 2].map((i) => {
        const a = (i / 3) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.25, 0.4, Math.sin(a) * 0.25]} rotation={[0, -a, 0.25]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.9, 8]} />
            <meshStandardMaterial color={IRON} metalness={0.6} roughness={0.5} />
          </mesh>
        );
      })}
      {/* bowl */}
      <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.3, 0.3, 16]} />
        <meshStandardMaterial color={IRON} metalness={0.6} roughness={0.5} />
      </mesh>
      {/* coals */}
      <mesh position={[0, 0.92, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.06, 16]} />
        <meshStandardMaterial color="#3a0a00" emissive="#ff3300" emissiveIntensity={1.2} />
      </mesh>
      {/* flames */}
      <group ref={fireRef} position={[0, 1.05, 0]}>
        <mesh>
          <coneGeometry args={[0.3, 0.7, 12]} />
          <meshStandardMaterial color="#ff7010" emissive="#ff5500" emissiveIntensity={2.5} transparent opacity={0.85} />
        </mesh>
        <mesh position={[0, 0.05, 0]}>
          <coneGeometry args={[0.18, 0.5, 12]} />
          <meshStandardMaterial color="#ffd040" emissive="#ffaa00" emissiveIntensity={3} transparent opacity={0.9} />
        </mesh>
      </group>
      <pointLight ref={lightRef} position={[0, 1.2, 0]} color="#ff6622" distance={8} decay={2} />
    </group>
  );
}

function WeaponRack({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* posts */}
      {[-0.6, 0.6].map((x, i) => (
        <mesh key={i} position={[x, 0.9, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.06, 0.07, 1.8, 10]} />
          <meshStandardMaterial color={DARK_WOOD} roughness={0.85} />
        </mesh>
      ))}
      {/* cross bars */}
      {[0.5, 1.5].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 1.3, 10]} />
          <meshStandardMaterial color={DARK_WOOD} roughness={0.85} />
        </mesh>
      ))}
      {/* sword */}
      <group position={[-0.3, 0.5, 0.1]} rotation={[0.05, 0, 0]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[0.08, 1, 0.02]} />
          <meshStandardMaterial color="#c8ccd0" metalness={0.8} roughness={0.25} />
        </mesh>
        <mesh position={[0, 1.05, 0]}>
          <coneGeometry args={[0.05, 0.15, 4]} />
          <meshStandardMaterial color="#c8ccd0" metalness={0.8} roughness={0.25} />
        </mesh>
        <mesh position={[0, -0.05, 0]} castShadow>
          <boxGeometry args={[0.3, 0.06, 0.05]} />
          <meshStandardMaterial color={GOLD} metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.2, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.25, 8]} />
          <meshStandardMaterial color={RUST} roughness={0.8} />
        </mesh>
      </group>
      {/* shield */}
      <group position={[0.35, 0.95, 0.12]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.35, 0.28, 0.06, 6]} />
          <meshStandardMaterial color="#7a1f2b" metalness={0.3} roughness={0.6} />
        </mesh>
        <mesh position={[0, 0, 0.04]}>
          <cylinderGeometry args={[0.1, 0.1, 0.04, 12]} />
          <meshStandardMaterial color={GOLD} metalness={0.7} roughness={0.3} />
        </mesh>
        {/* cross emblem */}
        <mesh position={[0, 0, 0.05]}>
          <boxGeometry args={[0.06, 0.4, 0.02]} />
          <meshStandardMaterial color={GOLD} metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.08, 0.05]}>
          <boxGeometry args={[0.3, 0.06, 0.02]} />
          <meshStandardMaterial color={GOLD} metalness={0.7} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
}

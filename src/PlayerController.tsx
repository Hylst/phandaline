import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import Character from './Characters';
import { playerWorld } from './store';
import { audio } from './audio';

interface Props {
  mode: 'first' | 'third';
  onPositionChange?: (pos: [number, number, number]) => void;
}

const PLAYER_SPEED = 5;
const WORLD_RADIUS = 58; // permet de sortir jusqu'au manoir Tresendar

// Obstacles circulaires simples (maisons, puits, étals) pour collision
const OBSTACLES: { x: number; z: number; r: number }[] = [
  { x: 0, z: 0, r: 1.1 },        // puits
  { x: 0, z: 8.5, r: 1.7 },      // fontaine
  // maisons et bâtiments principaux
  { x: -11, z: -8, r: 3.5 }, { x: -15.5, z: -1.5, r: 3.2 }, { x: -13.5, z: 8.5, r: 3.4 },
  { x: -8, z: 16, r: 3.1 }, { x: -1.5, z: 19, r: 3.4 }, { x: 6.5, z: 17.5, r: 3.1 },
  { x: 14, z: 10, r: 3.4 }, { x: 16, z: 1.5, r: 3.2 }, { x: 12, z: -8.5, r: 3.3 },
  { x: 5.5, z: -17.5, r: 3.5 }, { x: -4.5, z: -18, r: 3.3 }, { x: 0, z: -24, r: 4.2 },
  { x: -24, z: -12, r: 3 }, { x: -26, z: 2, r: 3 }, { x: -23, z: 15, r: 3 },
  { x: 23, z: -13, r: 3 }, { x: 26, z: 1, r: 3 }, { x: 23, z: 15, r: 3 },
  { x: -8, z: -27, r: 2.8 }, { x: 9, z: -28, r: 2.8 },
  // étals, forge, sanctuaire
  { x: -4.5, z: 2.8, r: 1.4 }, { x: 4.5, z: -2.8, r: 1.4 }, { x: -4.6, z: -3.5, r: 1.4 }, { x: 4.6, z: 3.5, r: 1.4 },
  { x: 6.1, z: -4.7, r: 1.1 }, { x: -18, z: 18, r: 1.4 },
  // manoir Tresendar, au nord du village
  { x: 0, z: -52, r: 5.2 }, { x: -5.2, z: -55.4, r: 1.4 }, { x: 5.2, z: -55.4, r: 1.4 },
];

export default function PlayerController({ mode, onPositionChange }: Props) {
  const { camera, gl } = useThree();
  const playerPos = useRef(new THREE.Vector3(0, 0, 6));
  const yaw = useRef(0);
  const pitch = useRef(0);
  const keys = useRef<Record<string, boolean>>({});
  const movingRef = useRef(false);
  const playerGroupRef = useRef<THREE.Group>(null);
  const lastFootstep = useRef(0);

  // Signale la présence du joueur dans le monde
  useEffect(() => {
    playerWorld.active = true;
    return () => {
      playerWorld.active = false;
    };
  }, []);

  useEffect(() => {
    const canvas = gl.domElement;
    const onClick = () => {
      if (!document.pointerLockElement) canvas.requestPointerLock?.();
    };
    canvas.addEventListener('click', onClick);

    const onKeyDown = (e: KeyboardEvent) => { keys.current[e.code] = true; };
    const onKeyUp = (e: KeyboardEvent) => { keys.current[e.code] = false; };
    const onMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement === canvas) {
        yaw.current -= e.movementX * 0.002;
        pitch.current -= e.movementY * 0.002;
        pitch.current = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, pitch.current));
      }
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    document.addEventListener('mousemove', onMouseMove);

    return () => {
      canvas.removeEventListener('click', onClick);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      document.removeEventListener('mousemove', onMouseMove);
    };
  }, [gl]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1);
    const forward = new THREE.Vector3(-Math.sin(yaw.current), 0, -Math.cos(yaw.current));
    const right = new THREE.Vector3(Math.cos(yaw.current), 0, -Math.sin(yaw.current));

    const move = new THREE.Vector3();
    if (keys.current['KeyW'] || keys.current['ArrowUp']) move.add(forward);
    if (keys.current['KeyS'] || keys.current['ArrowDown']) move.sub(forward);
    if (keys.current['KeyD'] || keys.current['ArrowRight']) move.add(right);
    if (keys.current['KeyA'] || keys.current['ArrowLeft']) move.sub(right);

    movingRef.current = move.lengthSq() > 0;

    if (movingRef.current) {
      move.normalize().multiplyScalar(PLAYER_SPEED * dt);
      const next = playerPos.current.clone().add(move);
      // collision simple avec obstacles
      let blocked = false;
      for (const ob of OBSTACLES) {
        const dx = next.x - ob.x;
        const dz = next.z - ob.z;
        if (dx * dx + dz * dz < ob.r * ob.r) { blocked = true; break; }
      }
      if (!blocked) {
        playerPos.current.copy(next);
        // Bruit de pas toutes les ~0.5 secondes
        const t = performance.now() / 1000;
        if (t - lastFootstep.current > 0.45) {
          lastFootstep.current = t;
          // Surface : pierre si près du centre, herbe sinon
          const onStone = Math.abs(playerPos.current.x) < 4 && Math.abs(playerPos.current.z) < 25;
          audio.playFootstep(onStone ? 'stone' : 'grass');
        }
      }
    }

    playerPos.current.x = Math.max(-WORLD_RADIUS, Math.min(WORLD_RADIUS, playerPos.current.x));
    playerPos.current.z = Math.max(-WORLD_RADIUS, Math.min(WORLD_RADIUS, playerPos.current.z));
    playerPos.current.y = 0;

    // partage la position avec les PNJ interactifs
    playerWorld.pos.copy(playerPos.current);

    onPositionChange?.([playerPos.current.x, 0, playerPos.current.z]);

    // mise à jour du modèle 3D du joueur (3ème personne)
    if (playerGroupRef.current) {
      playerGroupRef.current.position.set(playerPos.current.x, 0, playerPos.current.z);
      // le modèle regarde vers l'avant (direction de la caméra)
      playerGroupRef.current.rotation.y = yaw.current + Math.PI;
    }

    if (mode === 'first') {
      camera.position.set(playerPos.current.x, 1.65, playerPos.current.z);
      const euler = new THREE.Euler(pitch.current, yaw.current, 0, 'YXZ');
      camera.quaternion.setFromEuler(euler);
    } else {
      const distance = 5.5;
      const height = 2.8 + pitch.current * -2; // la souris ajuste la hauteur de caméra
      const camOffset = new THREE.Vector3(
        Math.sin(yaw.current) * distance,
        Math.max(0.8, height),
        Math.cos(yaw.current) * distance
      );
      const targetPos = new THREE.Vector3(playerPos.current.x, 1.4, playerPos.current.z);
      camera.position.lerp(targetPos.clone().add(camOffset), 0.2);
      camera.lookAt(targetPos);
    }
  });

  if (mode === 'first') return null;

  return (
    <group ref={playerGroupRef} position={[playerPos.current.x, 0, playerPos.current.z]}>
      <Character
        position={[0, 0, 0]}
        color="#4a6b8a"
        pantColor="#3a2a1a"
        hatColor="#6b4a2b"
        hairColor="#4a3018"
        hatType="none"
        walkingRef={movingRef}
        walkSpeed={1.4}
        isPlayer
        variant={1}
      />
    </group>
  );
}

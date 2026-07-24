import * as THREE from 'three';
import { createNoise2D } from 'simplex-noise';

// ========================= STONE WALL =========================
export function makeStoneTexture(isNight: boolean): THREE.Texture {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 512;
  const ctx = c.getContext('2d')!;
  const noise = createNoise2D();
  // Base
  ctx.fillStyle = isNight ? '#2a2620' : '#5a5247';
  ctx.fillRect(0, 0, 512, 512);
  // Blocks
  const bh = 48; const bw = 128;
  for (let row = 0; row < 512 / bh; row++) {
    const offset = (row % 2) * (bw / 2);
    for (let col = -1; col < 512 / bw + 1; col++) {
      const x = col * bw + offset;
      const y = row * bh;
      const rnd = (noise(x * 0.01, y * 0.01) + 1) * 0.5;
      const base = (isNight ? 70 : 110) + rnd * 30;
      ctx.fillStyle = `rgb(${base - 10},${base - 15},${base - 25})`;
      ctx.fillRect(x + 2, y + 2, bw - 4, bh - 4);
      // highlight top-left
      ctx.fillStyle = `rgba(255,255,255,${0.05 + rnd * 0.08})`;
      ctx.fillRect(x + 2, y + 2, bw - 4, 6);
      ctx.fillRect(x + 2, y + 2, 6, bh - 4);
      // shadow bottom-right
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.fillRect(x + 2, y + bh - 8, bw - 4, 6);
      ctx.fillRect(x + bw - 8, y + 2, 6, bh - 4);
      // small chips & cracks
      for (let k = 0; k < 3; k++) {
        const cx = x + 10 + Math.random() * (bw - 20);
        const cy = y + 10 + Math.random() * (bh - 20);
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(cx, cy, 2 + Math.random() * 3, 2 + Math.random() * 3);
      }
    }
  }
  // Mortar
  ctx.strokeStyle = 'rgba(15,12,10,0.85)';
  ctx.lineWidth = 4;
  for (let row = 0; row <= 512 / bh; row++) {
    ctx.beginPath(); ctx.moveTo(0, row * bh); ctx.lineTo(512, row * bh); ctx.stroke();
  }
  // moss spots
  if (!isNight) {
    ctx.fillStyle = 'rgba(60,90,40,0.45)';
    for (let i = 0; i < 40; i++) {
      const x = Math.random() * 512, y = Math.random() * 512;
      ctx.beginPath();
      ctx.arc(x, y, 3 + Math.random() * 6, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2.5, 1.3);
  tex.anisotropy = 8;
  return tex;
}

// ========================= GRASS =========================
export function makeGrassTexture(isNight: boolean): THREE.Texture {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 512;
  const ctx = c.getContext('2d')!;
  // base
  ctx.fillStyle = isNight ? '#0f1a0f' : '#2e5216';
  ctx.fillRect(0, 0, 512, 512);
  // clumps
  for (let i = 0; i < 12000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const h = 2 + Math.random() * 5;
    const shade = Math.random();
    const r = isNight ? 20 + shade * 30 : 40 + shade * 60;
    const g = isNight ? 35 + shade * 35 : 80 + shade * 80;
    const b = isNight ? 15 + shade * 20 : 25 + shade * 35;
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(x, y, 1, h);
    // occasional flowers
    if (Math.random() < 0.003 && !isNight) {
      ctx.fillStyle = ['#ffe04a','#ff6a6a','#e0c0ff','#ffffff'][Math.floor(Math.random()*4)];
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  // dirt patches
  for (let i = 0; i < 25; i++) {
    const x = Math.random() * 512, y = Math.random() * 512;
    const r = 20 + Math.random() * 40;
    ctx.fillStyle = isNight ? 'rgba(40,30,20,0.5)' : 'rgba(100,75,45,0.35)';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  // small rocks
  ctx.fillStyle = isNight ? '#2a2620' : '#70685a';
  for (let i = 0; i < 30; i++) {
    const x = Math.random() * 512, y = Math.random() * 512;
    ctx.beginPath();
    ctx.ellipse(x, y, 3 + Math.random() * 3, 2 + Math.random() * 2, Math.random()*Math.PI, 0, Math.PI*2);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(12, 12);
  tex.anisotropy = 8;
  return tex;
}

// ========================= WOOD PLANKS =========================
export function makeWoodTexture(isNight: boolean, variant: 'dark' | 'light' | 'roof' = 'dark'): THREE.Texture {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 256;
  const ctx = c.getContext('2d')!;
  let base = isNight ? '#2a1c11' : '#5a3d24';
  if (variant === 'light') base = isNight ? '#3a2c1e' : '#7a5a3a';
  if (variant === 'roof') base = isNight ? '#2a1008' : '#5a2a1a';
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, 256, 256);
  for (let y = 0; y < 256; y++) {
    const v = Math.sin(y * 0.2) * 0.1 + Math.sin(y * 0.5) * 0.05;
    ctx.fillStyle = `rgba(0,0,0,${0.1 + v * 0.3})`;
    ctx.fillRect(0, y, 256, 1);
  }
  // plank separators
  ctx.strokeStyle = 'rgba(0,0,0,0.5)';
  ctx.lineWidth = 2;
  for (let x = 0; x < 256; x += 32) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 256); ctx.stroke();
  }
  // knots
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  for (let i = 0; i < 8; i++) {
    ctx.beginPath();
    ctx.ellipse(Math.random()*256, Math.random()*256, 3 + Math.random()*4, 5 + Math.random()*5, Math.random()*Math.PI, 0, Math.PI*2);
    ctx.fill();
  }
  if (variant === 'roof') {
    // tile pattern
    for (let y = 0; y < 256; y += 16) {
      ctx.strokeStyle = 'rgba(0,0,0,0.3)';
      ctx.beginPath();
      for (let x = 0; x < 256; x += 4) ctx.arc(x, y, 2, 0, Math.PI);
      ctx.stroke();
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 8;
  return tex;
}

// ========================= STONE FLOOR =========================
export function makeStoneFloorTexture(isNight: boolean): THREE.Texture {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 512;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = isNight ? '#2a2620' : '#5a544a';
  ctx.fillRect(0, 0, 512, 512);
  for (let y = 0; y < 512; y += 64) {
    for (let x = 0; x < 512; x += 64) {
      const v = Math.random() * 25;
      const r = (isNight ? 55 : 90) + v, g = (isNight ? 50 : 80) + v, b = (isNight ? 45 : 70) + v;
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(x + 3, y + 3, 58, 58);
      ctx.fillStyle = 'rgba(255,255,255,0.04)';
      ctx.fillRect(x + 3, y + 3, 58, 4);
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.fillRect(x + 3, y + 57, 58, 4);
    }
  }
  ctx.strokeStyle = 'rgba(15,12,10,0.8)';
  ctx.lineWidth = 5;
  for (let i = 0; i <= 512; i += 64) {
    ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,512); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(512,i); ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  tex.anisotropy = 8;
  return tex;
}

// ========================= FACE TEXTURE =========================
export function makeFaceTexture(skinTone: string = '#e8c8a0', variant: number = 0): THREE.Texture {
  const c = document.createElement('canvas');
  c.width = 128; c.height = 128;
  const ctx = c.getContext('2d')!;
  // skin base
  ctx.fillStyle = skinTone;
  ctx.fillRect(0, 0, 128, 128);
  // soft shading (front lit, jaw darker)
  const grd = ctx.createLinearGradient(0, 0, 0, 128);
  grd.addColorStop(0, 'rgba(255,225,195,0.3)');
  grd.addColorStop(0.45, 'rgba(0,0,0,0.02)');
  grd.addColorStop(1, 'rgba(110,55,35,0.3)');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, 128, 128);
  // side shading (cheekbones)
  const side = ctx.createLinearGradient(0, 0, 128, 0);
  side.addColorStop(0, 'rgba(0,0,0,0.18)');
  side.addColorStop(0.2, 'rgba(0,0,0,0)');
  side.addColorStop(0.8, 'rgba(0,0,0,0)');
  side.addColorStop(1, 'rgba(0,0,0,0.18)');
  ctx.fillStyle = side;
  ctx.fillRect(0, 0, 128, 128);

  // cheeks blush
  ctx.fillStyle = 'rgba(230,110,90,0.28)';
  ctx.beginPath(); ctx.ellipse(34, 82, 10, 6, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(94, 82, 10, 6, 0, 0, Math.PI * 2); ctx.fill();

  // eye sockets shading
  ctx.fillStyle = 'rgba(120,70,50,0.15)';
  ctx.beginPath(); ctx.ellipse(38, 58, 14, 9, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(90, 58, 14, 9, 0, 0, Math.PI * 2); ctx.fill();

  // eyebrows (hair color-ish)
  const browColors = ['#3a2818', '#1a1410', '#5a4525', '#6a6a68'];
  ctx.fillStyle = browColors[variant % 4];
  ctx.save();
  ctx.translate(38, 46); ctx.rotate(-0.08);
  ctx.fillRect(-13, -2, 26, 5);
  ctx.restore();
  ctx.save();
  ctx.translate(90, 46); ctx.rotate(0.08);
  ctx.fillRect(-13, -2, 26, 5);
  ctx.restore();

  // eyes : white, iris, pupil, highlight
  const irisColors = ['#5a4527', '#3a5a78', '#4a6a3a', '#2a2a2a'];
  for (const ex of [38, 90]) {
    // white (almond shape)
    ctx.fillStyle = '#f8f4ec';
    ctx.beginPath(); ctx.ellipse(ex, 58, 11, 6.5, 0, 0, Math.PI * 2); ctx.fill();
    // top lid line
    ctx.strokeStyle = 'rgba(80,45,30,0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(ex, 58, 11, 6.5, 0, Math.PI, Math.PI * 2); ctx.stroke();
    // iris
    ctx.fillStyle = irisColors[variant % 4];
    ctx.beginPath(); ctx.arc(ex, 59, 5, 0, Math.PI * 2); ctx.fill();
    // pupil
    ctx.fillStyle = '#0a0a0a';
    ctx.beginPath(); ctx.arc(ex, 59, 2.4, 0, Math.PI * 2); ctx.fill();
    // highlight
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.beginPath(); ctx.arc(ex - 1.8, 57, 1.4, 0, Math.PI * 2); ctx.fill();
  }

  // nose (shading + nostrils)
  ctx.fillStyle = 'rgba(150,85,60,0.3)';
  ctx.beginPath();
  ctx.moveTo(64, 60);
  ctx.lineTo(58, 84);
  ctx.lineTo(70, 84);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'rgba(90,45,30,0.55)';
  ctx.beginPath(); ctx.ellipse(58, 84, 3, 2, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(70, 84, 3, 2, 0, 0, Math.PI * 2); ctx.fill();
  // nose highlight
  ctx.fillStyle = 'rgba(255,230,200,0.4)';
  ctx.fillRect(62, 62, 4, 18);

  // mouth (two-tone lips)
  ctx.fillStyle = '#9a4a38';
  ctx.beginPath(); ctx.ellipse(64, 100, 14, 4.5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#7a3028';
  ctx.beginPath(); ctx.ellipse(64, 101.5, 12, 2.5, 0, 0, Math.PI); ctx.fill();
  ctx.strokeStyle = 'rgba(70,30,20,0.6)';
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(50, 100); ctx.lineTo(78, 100); ctx.stroke();
  // smile corners
  ctx.fillStyle = 'rgba(70,30,20,0.4)';
  ctx.beginPath(); ctx.arc(49, 99, 1.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(79, 99, 1.5, 0, Math.PI * 2); ctx.fill();

  // chin shading
  ctx.fillStyle = 'rgba(120,60,40,0.15)';
  ctx.beginPath(); ctx.ellipse(64, 116, 16, 6, 0, 0, Math.PI * 2); ctx.fill();

  // beard / stubble for some variants
  if (variant % 3 === 0) {
    ctx.fillStyle = 'rgba(50,35,20,0.4)';
    ctx.beginPath();
    ctx.ellipse(64, 110, 26, 16, 0, 0, Math.PI);
    ctx.fill();
    ctx.fillStyle = 'rgba(50,35,20,0.25)';
    ctx.fillRect(38, 92, 8, 16);
    ctx.fillRect(82, 92, 8, 16);
  }
  // wrinkles for variant 3 (older)
  if (variant % 4 === 3) {
    ctx.strokeStyle = 'rgba(110,60,40,0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(40, 34); ctx.quadraticCurveTo(64, 28, 88, 34); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(44, 38); ctx.quadraticCurveTo(64, 33, 84, 38); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(28, 70); ctx.lineTo(32, 78); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(100, 70); ctx.lineTo(96, 78); ctx.stroke();
  }
  // freckles for variant 2
  if (variant % 4 === 2) {
    ctx.fillStyle = 'rgba(140,80,50,0.45)';
    for (let i = 0; i < 14; i++) {
      const fx = 40 + Math.random() * 48;
      const fy = 74 + Math.random() * 12;
      ctx.beginPath(); ctx.arc(fx, fy, 1.1, 0, Math.PI * 2); ctx.fill();
    }
  }

  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 4;
  return tex;
}

// ========================= PLASTER (colombage) =========================
export function makePlasterTexture(isNight: boolean): THREE.Texture {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 256;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = isNight ? '#4a4034' : '#d8c8a8';
  ctx.fillRect(0, 0, 256, 256);
  // grain irrégulier
  for (let i = 0; i < 3000; i++) {
    const x = Math.random() * 256, y = Math.random() * 256;
    const a = Math.random() * 0.08;
    ctx.fillStyle = Math.random() > 0.5 ? `rgba(255,255,255,${a})` : `rgba(0,0,0,${a})`;
    ctx.fillRect(x, y, 2, 2);
  }
  // taches d'humidité
  for (let i = 0; i < 8; i++) {
    const x = Math.random() * 256, y = 180 + Math.random() * 70;
    ctx.fillStyle = 'rgba(90,75,55,0.18)';
    ctx.beginPath(); ctx.arc(x, y, 12 + Math.random() * 18, 0, Math.PI * 2); ctx.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 4;
  return tex;
}

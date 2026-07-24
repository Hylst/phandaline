export class AudioManager {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private musicSource: AudioBufferSourceNode | null = null;
  private musicBuffer: AudioBuffer | null = null;
  private musicPlaying = false;
  private hammerInterval: number | null = null;
  private birdInterval: number | null = null;
  private cricketInterval: number | null = null;

  constructor() {
    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.musicGain = this.ctx.createGain();
      this.musicGain.connect(this.ctx.destination);
      this.musicGain.gain.value = 0.25;

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.connect(this.ctx.destination);
      this.sfxGain.gain.value = 0.35;

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.connect(this.ctx.destination);
      this.ambientGain.gain.value = 0.06;
    } catch (e) {
      console.warn('Web Audio API non supporté');
    }
  }

  resume() {
    if (this.ctx?.state === 'suspended') this.ctx.resume();
  }

  setMusicVolume(v: number) {
    if (this.musicGain) this.musicGain.gain.value = v;
  }

  setSfxVolume(v: number) {
    if (this.sfxGain) this.sfxGain.gain.value = v;
  }

  stopAll() {
    this.stopMusic();
    this.stopAmbientSFX();
  }

  stopAmbientSFX() {
    if (this.hammerInterval) { clearInterval(this.hammerInterval); this.hammerInterval = null; }
    if (this.birdInterval) { clearInterval(this.birdInterval); this.birdInterval = null; }
    if (this.cricketInterval) { clearInterval(this.cricketInterval); this.cricketInterval = null; }
  }

  async loadMusic(url: string) {
    if (!this.ctx) return;
    try {
      const resp = await fetch(url);
      const arrayBuffer = await resp.arrayBuffer();
      this.musicBuffer = await this.ctx.decodeAudioData(arrayBuffer);
    } catch (e) {
      console.warn('Erreur chargement musique MP3:', e);
    }
  }

  startMusic() {
    if (!this.ctx || !this.musicBuffer || !this.musicGain) return;
    this.stopMusic();
    const source = this.ctx.createBufferSource();
    source.buffer = this.musicBuffer;
    source.loop = true;
    source.connect(this.musicGain);
    source.start();
    this.musicSource = source;
    this.musicPlaying = true;
    this.startBirds();
  }

  stopMusic() {
    if (this.musicSource) {
      try { this.musicSource.stop(); } catch (e) {}
      this.musicSource = null;
    }
    this.musicPlaying = false;
  }

  toggleMusic(): boolean {
    if (this.musicPlaying) {
      this.stopMusic();
    } else {
      this.startMusic();
    }
    return this.musicPlaying;
  }

  isMusicPlaying(): boolean {
    return this.musicPlaying;
  }

  private startBirds() {
    if (!this.ctx) return;
    const chirp = () => {
      if (!this.ctx || !this.sfxGain) return;
      const t = this.ctx.currentTime;
      const baseFreq = 1800 + Math.random() * 1500;
      for (let i = 0; i < 2 + Math.floor(Math.random() * 3); i++) {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq + i * 150, t + i * 0.1);
        osc.frequency.exponentialRampToValueAtTime(baseFreq + i * 150 + 200, t + i * 0.1 + 0.05);
        osc.frequency.exponentialRampToValueAtTime(baseFreq + i * 150 - 100, t + i * 0.1 + 0.12);
        gain.gain.setValueAtTime(0, t + i * 0.1);
        gain.gain.linearRampToValueAtTime(0.04, t + i * 0.1 + 0.02);
        gain.gain.linearRampToValueAtTime(0, t + i * 0.1 + 0.15);
        osc.connect(gain);
        gain.connect(this.sfxGain!);
        osc.start(t + i * 0.1);
        osc.stop(t + i * 0.1 + 0.15);
      }
    };
    chirp();
    this.birdInterval = window.setInterval(chirp, 3000 + Math.random() * 5000);
  }

  // ==================== SFX ====================

  playFootstep(surface: 'grass' | 'stone' = 'grass') {
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;
    const noise = this.ctx.createBufferSource();
    const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.08, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = surface === 'grass' ? 400 : 800;
    filter.Q.value = 0.5;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(surface === 'grass' ? 0.12 : 0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain!);
    noise.start();
  }

  playDialogueOpen() {
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;
    [440, 660, 880].forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, t + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.15, t + i * 0.08 + 0.03);
      gain.gain.linearRampToValueAtTime(0, t + i * 0.08 + 0.2);
      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(t + i * 0.08);
      osc.stop(t + i * 0.08 + 0.2);
    });
  }

  playDialogueClose() {
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;
    [660, 440].forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, t + i * 0.1);
      gain.gain.linearRampToValueAtTime(0.12, t + i * 0.1 + 0.03);
      gain.gain.linearRampToValueAtTime(0, t + i * 0.1 + 0.18);
      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(t + i * 0.1);
      osc.stop(t + i * 0.1 + 0.18);
    });
  }

  playDialogueNext() {
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = 990;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.06, t + 0.02);
    gain.gain.linearRampToValueAtTime(0, t + 0.06);
    osc.connect(gain);
    gain.connect(this.sfxGain!);
    osc.start();
    osc.stop(t + 0.06);
  }

  playPickup() {
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;
    [523.25, 783.99, 1046.50].forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, t + i * 0.07);
      gain.gain.linearRampToValueAtTime(0.18, t + i * 0.07 + 0.02);
      gain.gain.linearRampToValueAtTime(0, t + i * 0.07 + 0.25);
      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(t + i * 0.07);
      osc.stop(t + i * 0.07 + 0.25);
    });
  }

  playQuestComplete() {
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const filter = this.ctx!.createBiquadFilter();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      filter.type = 'lowpass';
      filter.frequency.value = 3000;
      gain.gain.setValueAtTime(0, t + i * 0.1);
      gain.gain.linearRampToValueAtTime(0.22, t + i * 0.1 + 0.04);
      gain.gain.linearRampToValueAtTime(0, t + i * 0.1 + 0.5);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(t + i * 0.1);
      osc.stop(t + i * 0.1 + 0.5);
    });
  }

  playGoldCollect() {
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;
    for (let i = 0; i < 6; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 2400 + Math.random() * 800;
      gain.gain.setValueAtTime(0, t + i * 0.05);
      gain.gain.linearRampToValueAtTime(0.06, t + i * 0.05 + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.05 + 0.12);
      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(t + i * 0.05);
      osc.stop(t + i * 0.05 + 0.12);
    }
  }

  playHammer() {
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;
    // Métallique
    const noise = this.ctx.createBufferSource();
    const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.06, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (data.length * 0.08));
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1200 + Math.random() * 400;
    filter.Q.value = 2;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.06);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain!);
    noise.start();
    // Résonance
    const osc = this.ctx.createOscillator();
    const g2 = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 800 + Math.random() * 300;
    g2.gain.setValueAtTime(0.08, t);
    g2.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    osc.connect(g2);
    g2.connect(this.sfxGain!);
    osc.start();
    osc.stop(t + 0.15);
  }

  playDoorOpen() {
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, t);
    osc.frequency.linearRampToValueAtTime(120, t + 0.3);
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 300;
    gain.gain.setValueAtTime(0.06, t);
    gain.gain.linearRampToValueAtTime(0, t + 0.3);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain!);
    osc.start();
    osc.stop(t + 0.3);
  }

  playWhoosh() {
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;
    const noise = this.ctx.createBufferSource();
    const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.2, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1);
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(500, t);
    filter.frequency.exponentialRampToValueAtTime(3000, t + 0.1);
    filter.frequency.exponentialRampToValueAtTime(500, t + 0.2);
    filter.Q.value = 1;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain!);
    noise.start();
  }

  playBell() {
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;
    [523.25, 1046.50, 1568.00].forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(i === 0 ? 0.2 : 0.08, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 2);
      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(t);
      osc.stop(t + 2);
    });
  }

  playLuteString() {
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;
    const freqs = [392, 523.25, 659.25];
    freqs.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, t + i * 0.035);
      gain.gain.linearRampToValueAtTime(0.055, t + i * 0.035 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.035 + 0.38);
      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(t + i * 0.035);
      osc.stop(t + i * 0.035 + 0.38);
    });
  }

  playCookingBubble() {
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;
    for (let i = 0; i < 3; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(180 + Math.random() * 120, t + i * 0.07);
      osc.frequency.exponentialRampToValueAtTime(320 + Math.random() * 120, t + i * 0.07 + 0.08);
      gain.gain.setValueAtTime(0, t + i * 0.07);
      gain.gain.linearRampToValueAtTime(0.045, t + i * 0.07 + 0.015);
      gain.gain.linearRampToValueAtTime(0, t + i * 0.07 + 0.12);
      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(t + i * 0.07);
      osc.stop(t + i * 0.07 + 0.12);
    }
  }

  private bestFrenchVoice(pitch: number) {
    if (!('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    const fr = voices.filter(v => v.lang.toLowerCase().startsWith('fr'));
    if (fr.length === 0) return null;

    const premium = [
      'microsoft denise', 'microsoft henri', 'microsoft hortense',
      'google français', 'google francais', 'audrey', 'aurélie', 'aurelie',
      'thomas', 'amelie', 'amélie', 'daniel', 'marie', 'paul'
    ];
    const sorted = [...fr].sort((a, b) => {
      const an = a.name.toLowerCase();
      const bn = b.name.toLowerCase();
      const as = premium.findIndex(p => an.includes(p));
      const bs = premium.findIndex(p => bn.includes(p));
      const av = as === -1 ? 99 : as;
      const bv = bs === -1 ? 99 : bs;
      return av - bv;
    });
    if (pitch > 1.12) {
      return sorted.find(v => /denise|hortense|audrey|aurelie|aurélie|amelie|amélie|marie/i.test(v.name)) || sorted[0];
    }
    if (pitch < 0.9) {
      return sorted.find(v => /henri|thomas|daniel|paul/i.test(v.name)) || sorted[0];
    }
    return sorted[0];
  }

  private cleanSpeechText(text: string) {
    return text
      .replace(/[🐉⚔️🏘️🗡️🍺⚒️🛒🐴🔮🪨🔵🏹🎵🌿✨🍲🍎🔨✉️👺🛡️]/g, '')
      .replace(/\[[^\]]+\]/g, '')
      .replace(/\s+/g, ' ')
      .replace(/—/g, ', ')
      .trim();
  }

  private splitSpeech(text: string) {
    const clean = this.cleanSpeechText(text);
    const sentences = clean.match(/[^.!?…]+[.!?…]*/g) || [clean];
    const chunks: string[] = [];
    let current = '';
    for (const s of sentences) {
      if ((current + ' ' + s).trim().length > 180 && current) {
        chunks.push(current.trim());
        current = s;
      } else {
        current += ' ' + s;
      }
    }
    if (current.trim()) chunks.push(current.trim());
    return chunks;
  }

  // Profils de voix par PNJ, avec découpage en phrases pour une voix française plus naturelle.
  speak(text: string, pitch = 1, rate = 0.9) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    this.speechQueue = [];
    const chunks = this.splitSpeech(text);
    const voice = this.bestFrenchVoice(pitch);
    chunks.forEach((chunk, index) => {
      const utterance = new SpeechSynthesisUtterance(chunk);
      utterance.lang = 'fr-FR';
      utterance.pitch = Math.max(0.55, Math.min(1.55, pitch));
      utterance.rate = Math.max(0.62, Math.min(1.12, rate));
      utterance.volume = 0.78;
      if (voice) utterance.voice = voice;
      utterance.onend = () => {
        const next = this.speechQueue.shift();
        if (next) window.speechSynthesis.speak(next);
      };
      if (index === 0) window.speechSynthesis.speak(utterance);
      else this.speechQueue.push(utterance);
    });
  }

  stopSpeaking() {
    this.speechQueue = [];
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }

  // ========== BRUITAGES DE COMBAT / MAGIE =========
  playSpellCast() {
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;
    for (let i = 0; i < 8; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400 + i * 80, t + i * 0.03);
      osc.frequency.exponentialRampToValueAtTime(1200 + i * 200, t + i * 0.03 + 0.15);
      gain.gain.setValueAtTime(0, t + i * 0.03);
      gain.gain.linearRampToValueAtTime(0.08, t + i * 0.03 + 0.03);
      gain.gain.linearRampToValueAtTime(0, t + i * 0.03 + 0.2);
      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(t + i * 0.03);
      osc.stop(t + i * 0.03 + 0.2);
    }
  }

  playSwordSlash() {
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;
    const noise = this.ctx.createBufferSource();
    const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.12, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (data.length * 0.06));
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2000, t);
    filter.frequency.exponentialRampToValueAtTime(800, t + 0.1);
    filter.Q.value = 3;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.22, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain!);
    noise.start();
  }

  playAlert() {
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;
    [440, 660, 880].forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'square';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, t + i * 0.06);
      gain.gain.linearRampToValueAtTime(0.1, t + i * 0.06 + 0.02);
      gain.gain.linearRampToValueAtTime(0, t + i * 0.06 + 0.12);
      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(t + i * 0.06);
      osc.stop(t + i * 0.06 + 0.12);
    });
  }

  playCrowdMurmur() {
    if (!this.ctx || !this.ambientGain) return;
    const t = this.ctx.currentTime;
    const noise = this.ctx.createBufferSource();
    const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.9, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 600;
    filter.Q.value = 0.3;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.025, t);
    gain.gain.setValueAtTime(0.025, t + 0.8);
    gain.gain.linearRampToValueAtTime(0, t + 0.9);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ambientGain!);
    noise.start();
    noise.stop(t + 0.9);
  }
}

export const audio = new AudioManager();

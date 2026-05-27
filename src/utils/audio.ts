/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private volume: number = 0.5;
  private isMuted: boolean = false;
  private droneHumGain: GainNode | null = null;
  private droneHumOsc1: OscillatorNode | null = null;
  private droneHumOsc2: OscillatorNode | null = null;

  constructor() {
    // Audio Context is initialized lazy based on user interaction
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    this.initCtx();
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    this.initCtx();
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : this.volume, this.ctx.currentTime);
    }
  }

  public playLaunch(velocity: number = 1.0) {
    this.initCtx();
    if (!this.ctx || this.isMuted || this.volume === 0) return;

    const now = this.ctx.currentTime;
    
    // Create oscillator for Whistling Ascent sound
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    // Glide frequency from 150Hz up to 1200Hz
    osc.frequency.setValueAtTime(120 + Math.random() * 50, now);
    osc.frequency.exponentialRampToValueAtTime(900 + Math.random() * 300, now + 0.8 * velocity);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.08 * velocity, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8 * velocity);
    
    osc.connect(gain);
    if (this.masterGain) {
      gain.connect(this.masterGain);
    }
    
    osc.start(now);
    osc.stop(now + 0.9 * velocity);
  }

  public playExplosion(type: string, volumeScale: number = 1.0) {
    this.initCtx();
    if (!this.ctx || this.isMuted || this.volume === 0) return;

    const now = this.ctx.currentTime;
    const baseVolume = 0.6 * volumeScale;

    // 1. Deep Bass Thump (sine oscillator)
    const thumpOsc = this.ctx.createOscillator();
    const thumpGain = this.ctx.createGain();
    
    thumpOsc.type = 'sine';
    thumpOsc.frequency.setValueAtTime(100 + Math.random() * 30, now);
    thumpOsc.frequency.exponentialRampToValueAtTime(20, now + 0.4);
    
    thumpGain.gain.setValueAtTime(baseVolume, now);
    thumpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    
    thumpOsc.connect(thumpGain);
    if (this.masterGain) thumpGain.connect(this.masterGain);
    thumpOsc.start(now);
    thumpOsc.stop(now + 0.6);

    // 2. High frequency mid-range blast (noise)
    const bufferSize = this.ctx.sampleRate * 0.4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = buffer;
    
    // Highpass filter for crackling tone
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(type === 'chrysanthemum' ? 1200 : 600, now);
    filter.Q.setValueAtTime(1.5, now);
    
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(baseVolume * 0.4, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    
    noiseSource.connect(filter);
    filter.connect(noiseGain);
    if (this.masterGain) noiseGain.connect(this.masterGain);
    noiseSource.start(now);
    noiseSource.stop(now + 0.4);

    // 3. Crackling Secondary Sparkles (multiple tiny crackle pops if chrysanthemum or crossette)
    if (type === 'chrysanthemum' || type === 'crossette') {
      const crackleCount = type === 'crossette' ? 8 : 15;
      for (let i = 0; i < crackleCount; i++) {
        const delay = 0.2 + Math.random() * 0.4;
        this.playCrackle(now + delay, 0.3 * volumeScale);
      }
    }
  }

  private playCrackle(time: number, volume: number) {
    if (!this.ctx || !this.masterGain) return;

    // Fast static impulse click
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1500 + Math.random() * 1500, time);
    
    gain.gain.setValueAtTime(volume * 0.15, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + 0.06);
  }

  // Active drone swarm sound (quiet high-tech buzz)
  public startDroneHum(droneCount: number) {
    this.initCtx();
    if (!this.ctx || this.isMuted || this.volume === 0) return;

    if (!this.droneHumOsc1) {
      const now = this.ctx.currentTime;
      this.droneHumGain = this.ctx.createGain();
      this.droneHumGain.gain.setValueAtTime(0, now);
      
      this.droneHumOsc1 = this.ctx.createOscillator();
      this.droneHumOsc1.type = 'sawtooth';
      this.droneHumOsc1.frequency.setValueAtTime(55, now); // A1 note
      
      this.droneHumOsc2 = this.ctx.createOscillator();
      this.droneHumOsc2.type = 'triangle';
      this.droneHumOsc2.frequency.setValueAtTime(110.5, now); // Detuned A2
      
      // Lowpass filter to muffle it so it sounds like a distant swarm
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(250, now);

      this.droneHumOsc1.connect(filter);
      this.droneHumOsc2.connect(filter);
      
      if (this.droneHumGain && this.masterGain) {
        filter.connect(this.droneHumGain);
        this.droneHumGain.connect(this.masterGain);
      }
      
      this.droneHumOsc1.start(now);
      this.droneHumOsc2.start(now);
    }

    // Dynamic gain adjustment based on count
    if (this.droneHumGain && this.ctx) {
      const targetGain = Math.min(0.015, (droneCount / 400) * 0.015);
      this.droneHumGain.gain.linearRampToValueAtTime(targetGain, this.ctx.currentTime + 1.5);
    }
  }

  public stopDroneHum() {
    if (this.droneHumGain && this.ctx) {
      this.droneHumGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1.0);
    }
  }
}

export const audio = new SoundEngine();

class SoundSystem {
  private audioContext: AudioContext | null = null;
  private masterVolume = 0.3;

  constructor() {
    // Initialize audio context on first user interaction
    this.initAudioContext();
  }

  private initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }

  private async ensureAudioContext() {
    if (!this.audioContext) {
      this.initAudioContext();
    }
    
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  private createTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 1) {
    return new Promise<void>((resolve) => {
      if (!this.audioContext) {
        resolve();
        return;
      }

      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
      oscillator.type = type;
      
      const finalVolume = this.masterVolume * volume;
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(finalVolume, this.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
      
      oscillator.onended = () => resolve();
    });
  }

  private async playSequence(notes: Array<{frequency: number, duration: number, type?: OscillatorType, volume?: number}>) {
    for (const note of notes) {
      await this.createTone(note.frequency, note.duration, note.type || 'sine', note.volume || 1);
      await new Promise(resolve => setTimeout(resolve, note.duration * 1000 * 0.1)); // Small gap between notes
    }
  }

  async playCoinCollect() {
    await this.ensureAudioContext();
    // Pleasant coin collection sound - ascending notes
    await this.playSequence([
      { frequency: 523.25, duration: 0.1, type: 'sine', volume: 0.6 }, // C5
      { frequency: 659.25, duration: 0.1, type: 'sine', volume: 0.8 }, // E5
      { frequency: 783.99, duration: 0.15, type: 'sine', volume: 1.0 } // G5
    ]);
  }

  async playGemCollect() {
    await this.ensureAudioContext();
    // Special gem sound - more magical
    await this.playSequence([
      { frequency: 880, duration: 0.08, type: 'sine', volume: 0.7 }, // A5
      { frequency: 1108.73, duration: 0.08, type: 'sine', volume: 0.8 }, // C#6
      { frequency: 1318.51, duration: 0.12, type: 'sine', volume: 0.9 }, // E6
      { frequency: 1760, duration: 0.2, type: 'sine', volume: 1.0 } // A6
    ]);
  }

  async playBombHit() {
    await this.ensureAudioContext();
    // Explosion sound - low frequencies with noise
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filterNode = this.audioContext.createBiquadFilter();
    
    oscillator.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.3);
    oscillator.type = 'sawtooth';
    
    filterNode.type = 'lowpass';
    filterNode.frequency.setValueAtTime(200, this.audioContext.currentTime);
    
    const finalVolume = this.masterVolume * 0.8;
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(finalVolume, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.3);
  }

  async playGameOver() {
    await this.ensureAudioContext();
    // Sad descending melody
    await this.playSequence([
      { frequency: 523.25, duration: 0.3, type: 'sine', volume: 0.8 }, // C5
      { frequency: 493.88, duration: 0.3, type: 'sine', volume: 0.7 }, // B4
      { frequency: 440, duration: 0.3, type: 'sine', volume: 0.6 }, // A4
      { frequency: 392, duration: 0.5, type: 'sine', volume: 0.5 } // G4
    ]);
  }

  async playNewRecord() {
    await this.ensureAudioContext();
    // Triumphant fanfare
    await this.playSequence([
      { frequency: 523.25, duration: 0.15, type: 'sine', volume: 0.7 }, // C5
      { frequency: 659.25, duration: 0.15, type: 'sine', volume: 0.8 }, // E5
      { frequency: 783.99, duration: 0.15, type: 'sine', volume: 0.9 }, // G5
      { frequency: 1046.5, duration: 0.4, type: 'sine', volume: 1.0 }, // C6
      { frequency: 783.99, duration: 0.2, type: 'sine', volume: 0.8 }, // G5
      { frequency: 1046.5, duration: 0.3, type: 'sine', volume: 1.0 } // C6
    ]);
  }

  async playLevelUp() {
    await this.ensureAudioContext();
    // Level up sound - ascending arpeggio
    await this.playSequence([
      { frequency: 440, duration: 0.1, type: 'sine', volume: 0.6 }, // A4
      { frequency: 554.37, duration: 0.1, type: 'sine', volume: 0.7 }, // C#5
      { frequency: 659.25, duration: 0.1, type: 'sine', volume: 0.8 }, // E5
      { frequency: 880, duration: 0.2, type: 'sine', volume: 1.0 } // A5
    ]);
  }

  async playGameStart() {
    await this.ensureAudioContext();
    // Energetic start sound
    await this.playSequence([
      { frequency: 659.25, duration: 0.1, type: 'sine', volume: 0.8 }, // E5
      { frequency: 783.99, duration: 0.1, type: 'sine', volume: 0.9 }, // G5
      { frequency: 1046.5, duration: 0.2, type: 'sine', volume: 1.0 } // C6
    ]);
  }

  async playChickenClick1() {
    await this.ensureAudioContext();
    // High pitched chicken sound
    await this.playSequence([
      { frequency: 800, duration: 0.05, type: 'square', volume: 0.4 },
      { frequency: 1200, duration: 0.08, type: 'square', volume: 0.6 },
      { frequency: 900, duration: 0.06, type: 'square', volume: 0.3 }
    ]);
  }

  async playChickenClick2() {
    await this.ensureAudioContext();
    // Lower pitched chicken sound
    await this.playSequence([
      { frequency: 600, duration: 0.08, type: 'square', volume: 0.5 },
      { frequency: 400, duration: 0.1, type: 'square', volume: 0.7 },
      { frequency: 500, duration: 0.05, type: 'square', volume: 0.4 }
    ]);
  }

  async playRandomChickenSound() {
    if (Math.random() > 0.5) {
      await this.playChickenClick1();
    } else {
      await this.playChickenClick2();
    }
  }

  setVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }

  getVolume() {
    return this.masterVolume;
  }
}

// Create singleton instance
export const soundSystem = new SoundSystem();
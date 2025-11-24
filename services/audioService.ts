
class AudioService {
  private ctx: AudioContext | null = null;
  private bgm: HTMLAudioElement | null = null;
  private preview: HTMLAudioElement | null = null;
  private isMuted: boolean = false;
  private bgmUrl: string = 'https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f69d2.mp3'; // Ambient lo-fi track

  constructor() {
    this.bgm = new Audio(this.bgmUrl);
    this.bgm.loop = true;
    this.bgm.volume = 0.3;

    this.preview = new Audio();
    this.preview.volume = 0.5;
  }

  private getContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.ctx;
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.bgm) this.bgm.muted = this.isMuted;
    if (this.preview) this.preview.muted = this.isMuted;
    return this.isMuted;
  }

  public getMuteState() {
    return this.isMuted;
  }

  // --- Background Music (Generic) ---

  public async startGenericBGM() {
    if (this.bgm && !this.isMuted) {
      // If a preview is playing, don't start BGM
      if (this.preview && !this.preview.paused) return;
      
      try {
        await this.bgm.play();
      } catch (e) {
        console.warn("Autoplay blocked (BGM), waiting for interaction");
      }
    }
  }

  public stopGenericBGM() {
    if (this.bgm) {
      this.bgm.pause();
    }
  }

  // --- Song Preview (Specific) ---

  public async playSongPreview(url: string) {
    // Stop generic BGM first
    this.stopGenericBGM();

    if (this.preview) {
      this.preview.src = url;
      this.preview.muted = this.isMuted;
      try {
        await this.preview.play();
      } catch (e) {
        console.warn("Autoplay blocked (Preview), waiting for interaction");
      }
    }
  }

  public pauseSongPreview() {
    if (this.preview) {
      this.preview.pause();
    }
  }

  public async resumeSongPreview() {
    if (this.preview && !this.isMuted) {
      this.stopGenericBGM();
      try {
        await this.preview.play();
      } catch (e) {
        console.warn("Resume blocked (Preview)");
      }
    }
  }

  public stopSongPreview() {
    if (this.preview) {
      this.preview.pause();
      this.preview.currentTime = 0;
    }
  }

  public stopAllMusic() {
    this.stopGenericBGM();
    this.stopSongPreview();
  }

  // --- Synthesized SFX ---

  public playClick() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  }

  public playStart() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.3);
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  }

  public playCorrect() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    
    // Play a major third chord arpeggio
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      const startTime = ctx.currentTime + (i * 0.05);
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.1, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.5);
    });
  }

  public playIncorrect() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.3);
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  }

  public playFanfare() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    
    // Simple victory sequence
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'square';
      osc.frequency.value = freq;
      
      const startTime = ctx.currentTime + (i * 0.1);
      const duration = i === notes.length - 1 ? 0.6 : 0.1;
      
      gain.gain.setValueAtTime(0.05, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  }
}

export const audioService = new AudioService();

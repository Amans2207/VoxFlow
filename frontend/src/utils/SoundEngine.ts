"use client";

class SoundEngine {
  private sounds: Record<string, HTMLAudioElement | null> = {};

  constructor() {
    if (typeof window !== "undefined") {
      this.sounds = {
        click: new Audio("https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3"),
        cut: new Audio("https://assets.mixkit.co/active_storage/sfx/2592/2592-preview.mp3"),
        snap: new Audio("https://assets.mixkit.co/active_storage/sfx/2581/2581-preview.mp3"),
        success: new Audio("https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3"),
        processing: new Audio("https://assets.mixkit.co/active_storage/sfx/2569/2569-preview.mp3"),
      };
      
      // Pre-set volumes
      Object.values(this.sounds).forEach(s => {
        if (s) s.volume = 0.2;
      });
    }
  }

  play(soundName: 'click' | 'cut' | 'snap' | 'success' | 'processing') {
    const sound = this.sounds[soundName];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(() => {
         // Silently fail if browser blocks autoplay
      });
    }
  }
}

export const soundEngine = new SoundEngine();

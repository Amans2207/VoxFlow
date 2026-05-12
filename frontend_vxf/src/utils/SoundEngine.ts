"use client";

class SoundEngine {
  private static instance: SoundEngine;
  private sounds: { [key: string]: HTMLAudioElement } = {};
  private enabled: boolean = true;

  private constructor() {
    if (typeof window !== "undefined") {
      // High-end cinematic sound placeholders
      this.sounds = {
        startup: new Audio("https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3"), // Cinematic whoosh
        success: new Audio("https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3"), // Digital chime
        error: new Audio("https://assets.mixkit.co/active_storage/sfx/951/951-preview.mp3"), // Low thud
        process: new Audio("https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3"), // Neural pulse
        click: new Audio("https://assets.mixkit.co/active_storage/sfx/2562/2562-preview.mp3"), // Minimal click
      };

      // Preload and set volumes
      Object.values(this.sounds).forEach(audio => {
        audio.volume = 0.4;
        audio.load();
      });
    }
  }

  public static getInstance(): SoundEngine {
    if (!SoundEngine.instance) {
      SoundEngine.instance = new SoundEngine();
    }
    return SoundEngine.instance;
  }

  public play(soundName: "startup" | "success" | "error" | "process" | "click") {
    if (!this.enabled || !this.sounds[soundName]) return;
    
    // Reset and play
    const sound = this.sounds[soundName];
    sound.currentTime = 0;
    sound.play().catch(e => console.log("Audio play blocked by browser policy until user interaction."));
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }
}

export const soundEngine = typeof window !== "undefined" ? SoundEngine.getInstance() : null;

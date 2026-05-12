/**
 * ElevenLabs Utility Module
 * Handles API key retrieval and voice synthesis configurations.
 */

export const getElevenLabsKey = (): string => {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) {
    console.warn("ELEVENLABS_API_KEY is not defined in environment variables. Using placeholder.");
    return "PLACEHOLDER_KEY";
  }
  return key;
};

export const DEFAULT_VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; // Rachel

export const voiceSettings = {
  stability: 0.5,
  similarity_boost: 0.75,
  style: 0.06,
  use_speaker_boost: true
};

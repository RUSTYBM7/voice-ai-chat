import type { Voice } from '../types';

const ELEVENLABS_BASE_URL = 'https://api.elevenlabs.io/v1';
const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY || '';

export const DEFAULT_VOICES: Voice[] = [
  { voice_id: '21m00TScm4G4t8A4LkDy', name: 'Rachel', gender: 'Female', accent: 'American' },
  { voice_id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi', gender: 'Female', accent: 'Warm' },
  { voice_id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella', gender: 'Female', accent: 'British' },
  { voice_id: 'MF02DwAAnsz0MNHw39cB', name: 'Antoni', gender: 'Male', accent: 'American' },
  { voice_id: 'VR6AewLTigWG4xSOukaG', name: 'Arnold', gender: 'Male', accent: 'American' },
  { voice_id: 'pFZP5JQG7iVDjD9XbUXJ', name: 'Thomas', gender: 'Male', accent: 'British' },
];

export const MODELS = [
  { id: 'eleven_v3', name: 'Eleven V3', desc: 'Latest, multilingual' },
  { id: 'eleven_multilingual_v2', name: 'Multilingual V2', desc: 'Multi-language' },
];

export class ElevenLabsClient {
  private apiKey: string;

  constructor(apiKey: string = ELEVENLABS_API_KEY) {
    this.apiKey = apiKey;
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getVoices(): Promise<Voice[]> {
    if (!this.apiKey) {
      return DEFAULT_VOICES;
    }

    try {
      const response = await fetch(`${ELEVENLABS_BASE_URL}/voices`, {
        headers: { 'xi-api-key': this.apiKey }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch voices');
      }

      const data = await response.json();
      return data.voices || DEFAULT_VOICES;
    } catch (error) {
      console.error('Error fetching voices:', error);
      return DEFAULT_VOICES;
    }
  }

  async textToSpeech(
    text: string,
    voiceId: string,
    settings: {
      model?: string;
      stability?: number;
      similarity?: number;
      style?: number;
      speakerBoost?: boolean;
    } = {}
  ): Promise<string> {
    if (!this.apiKey) {
      return '';
    }

    try {
      const response = await fetch(
        `${ELEVENLABS_BASE_URL}/text-to-speech/${voiceId}/stream`,
        {
          method: 'POST',
          headers: {
            'xi-api-key': this.apiKey,
            'Content-Type': 'application/json',
            'Accept': 'audio/mpeg'
          },
          body: JSON.stringify({
            text,
            model_id: settings.model || 'eleven_v3',
            voice_settings: {
              stability: settings.stability ?? 0.5,
              similarity_boost: settings.similarity ?? 0.75,
              style: settings.style ?? 0.5,
              use_speaker_boost: settings.speakerBoost ?? true
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error('TTS failed');
      }

      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('TTS error:', error);
      return '';
    }
  }

  async speechToSpeech(audioBlob: Blob, voiceId: string): Promise<string> {
    if (!this.apiKey) {
      return '';
    }

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'audio.wav');
      formData.append('model_id', 'scribe-1');

      const response = await fetch(
        `${ELEVENLABS_BASE_URL}/speech-to-speech/${voiceId}`,
        {
          method: 'POST',
          headers: { 'xi-api-key': this.apiKey },
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error('STS failed');
      }

      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('STS error:', error);
      return '';
    }
  }
}

export const elevenlabsClient = new ElevenLabsClient();
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  audioUrl?: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
}

export interface Voice {
  voice_id: string;
  name: string;
  gender?: string;
  accent?: string;
  preview_url?: string;
}

export interface ElevenLabsSettings {
  voiceId: string;
  model: string;
  stability: number;
  similarity: number;
  style: number;
  speakerBoost: boolean;
}

export interface ChatSettings {
  minimaxApiKey: string;
  elevenlabsApiKey: string;
  voiceSettings: ElevenLabsSettings;
}

export interface AppState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  settings: ChatSettings;
  isConnected: boolean;
  isGenerating: boolean;
  voices: Voice[];
}
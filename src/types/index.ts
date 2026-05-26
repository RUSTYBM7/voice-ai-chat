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

export type SkillType = 'general' | 'coding' | 'writing' | 'chat' | 'roleplay' | 'voice_clone' | 'data_analysis';

export interface Skill {
  id: SkillType;
  name: string;
  description: string;
  icon: string;
  color: string;
  capabilities?: string[];
}

export interface User {
  id: string;
  email: string;
  created_at?: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export const SKILLS: Skill[] = [
  {
    id: 'general',
    name: 'General Chat',
    description: 'Conversational AI for any topic',
    icon: 'MessageCircle',
    color: 'violet'
  },
  {
    id: 'coding',
    name: 'Coding Expert',
    description: 'Code generation, debugging, and architecture',
    icon: 'Code',
    color: 'blue',
    capabilities: [
      'Write clean code in any language',
      'Debug and fix issues',
      'Design system architecture',
      'Review and optimize code',
      'Explain programming concepts'
    ]
  },
  {
    id: 'writing',
    name: 'Writing Assistant',
    description: 'Articles, emails, creative content',
    icon: 'PenTool',
    color: 'green',
    capabilities: [
      'Professional emails',
      'Articles and blog posts',
      'Creative writing',
      'Copywriting and marketing',
      'Technical documentation'
    ]
  },
  {
    id: 'chat',
    name: 'Chat Specialist',
    description: 'Friendly conversation and support',
    icon: 'Heart',
    color: 'pink',
    capabilities: [
      'Emotional support',
      'Active listening',
      'Meaningful conversations',
      'Thoughtful discussions'
    ]
  },
  {
    id: 'roleplay',
    name: 'Role Play',
    description: 'Interactive scenarios and interviews',
    icon: 'Users',
    color: 'orange',
    capabilities: [
      'Job interview practice',
      'Training simulations',
      'Social scenarios',
      'Customer service training'
    ]
  },
  {
    id: 'voice_clone',
    name: 'Voice Assistant',
    description: 'Voice synthesis and cloning support',
    icon: 'Mic',
    color: 'cyan',
    capabilities: [
      'Voice quality feedback',
      'Synthesis settings',
      'Voice persona creation',
      'Natural speech generation'
    ]
  },
  {
    id: 'data_analysis',
    name: 'Data Analyst',
    description: 'Statistics, analytics, and insights',
    icon: 'BarChart',
    color: 'yellow',
    capabilities: [
      'Statistical analysis',
      'Trend identification',
      'Data visualization',
      'Business insights'
    ]
  }
];

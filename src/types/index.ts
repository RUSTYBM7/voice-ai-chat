export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  audioUrl?: string;
  timestamp: Date;
  skill?: SkillType;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
  skill?: SkillType;
}

export interface Voice {
  voice_id: string;
  name: string;
  gender?: string;
  accent?: string;
  preview_url?: string;
  category?: string;
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

export type SkillType =
  | 'bmvoice_ai'
  | 'general'
  | 'coding'
  | 'linux_coder'
  | 'openclaw'
  | 'writing'
  | 'chat'
  | 'roleplay'
  | 'voice_clone'
  | 'data_analysis'
  | 'terminal'
  | 'automation'
  | 'elevenlabs_v2'
  | 'elevenlabs_v3'
  | 'file_manager'
  | 'webhooks'
  | 'github_integration'
  | 'api_tools';

export interface Skill {
  id: SkillType;
  name: string;
  description: string;
  icon: string;
  color: string;
  capabilities?: string[];
  voiceId?: string;
  fictional?: boolean;
  fictionalName?: string;
  fictionalRole?: string;
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

export interface FileAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  content: string | ArrayBuffer;
  url?: string;
}

export interface AutomationTask {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: string;
  createdAt: Date;
}

export interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  events: string[];
  active: boolean;
}

export interface GitHubResource {
  id: string;
  name: string;
  description: string;
  url: string;
  stars: number;
  language: string;
}

export const ELEVENLABS_VOICE_IDS = {
  // Premium V3 voices
  rachel: '21m00TScm4G4t8A4LkDy',
  domi: 'AZnzlk1XvdvUeBnXmlld',
  bella: 'EXAVITQu4vr4xnSDxMaL',
  antoni: 'MF02DwAAnsz0MNHw39cB',
  arnold: 'VR6AewLTigWG4xSOukaG',
  thomas: 'pFZP5JQG7iVDjD9XbUXJ',
  // Additional fresh voices
  charlie: 'IKre5Mwo8wBPa3aPxNVs',
  george: 'nPJWCzBGjMRyGsZlE9KL',
  finn: 'XB48aJBTKuoEqGf5qY7R',
  james: 'TxbSbg47H9yCXCf8Pows',
  emma: 'FGYbWhKPLo1fZ8Y1O4Mp',
  // ElevenLabs Agent voices
  agent_rachel: 'XqBEtw0wRdsNGta2VtM7',
  agent_david: 'zGpB7v8L7g9XQmvNPHqm',
  agent_sarah: 'pF4cUBJ7N8XRCfBDqpR9',
  agent_michael: '9U3ZTy0wRdsNGta2VtM7',
  agent_jessica: 'K8LPCy3wRdsNGta2VtM7',
};

export const SKILLS: Skill[] = [
  {
    id: 'bmvoice_ai',
    name: 'BMVoiceAI',
    description: 'Central AI hub powered by MiniMax Agent. Handles all general tasks, answers any question, and assists in any situation.',
    icon: 'Cpu',
    color: 'violet',
    capabilities: [
      'Universal question answering',
      'Task automation and execution',
      'Multi-domain assistance',
      'File handling and analysis',
      'Integration with all tools',
      'Web search and research',
      'Code execution and debugging'
    ]
  },
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
    id: 'linux_coder',
    name: 'Linux Coder',
    description: 'Fictional Linux shell expert named ShadowByte - masters the terminal, system administration, and DevOps',
    icon: 'Terminal',
    color: 'green',
    capabilities: [
      'Bash/Shell scripting',
      'System administration',
      'Docker & Kubernetes',
      'CI/CD pipelines',
      'Cloud automation',
      'Network configuration',
      'Security hardening'
    ],
    fictional: true,
    fictionalName: 'ShadowByte',
    fictionalRole: 'Linux System Architect',
    voiceId: ELEVENLABS_VOICE_IDS.arnold
  },
  {
    id: 'openclaw',
    name: 'OpenClaw Agent',
    description: 'Fictional AI agent named ClawBot - specialized in task automation, plugin management, and workflow optimization',
    icon: 'Bot',
    color: 'orange',
    capabilities: [
      'Task automation',
      'Plugin installations',
      'Webhook management',
      'Workflow optimization',
      'Tool integration',
      'API orchestration',
      'System monitoring'
    ],
    fictional: true,
    fictionalName: 'ClawBot',
    fictionalRole: 'Automation Specialist',
    voiceId: ELEVENLABS_VOICE_IDS.antoni
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
    name: 'Voice Cloner',
    description: 'Create custom synthetic voices',
    icon: 'Mic',
    color: 'cyan',
    capabilities: [
      'Voice cloning',
      'Voice settings optimization',
      'Multi-voice synthesis',
      'Voice sharing'
    ],
    voiceId: ELEVENLABS_VOICE_IDS.bella
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
  },
  {
    id: 'terminal',
    name: 'Terminal Pro',
    description: 'Advanced command-line interface powered by MiniMax Agent for system administration and automation',
    icon: 'Terminal',
    color: 'emerald',
    capabilities: [
      'Command execution',
      'Script generation',
      'System diagnostics',
      'File operations',
      'Process management'
    ]
  },
  {
    id: 'automation',
    name: 'Automation Hub',
    description: 'Job automation, tool installation, and workflow management',
    icon: 'Zap',
    color: 'amber',
    capabilities: [
      'Task scheduling',
      'Tool installations',
      'Workflow automation',
      'Cron job management',
      'CI/CD integration'
    ]
  },
  {
    id: 'elevenlabs_v2',
    name: 'ElevenLabs V2',
    description: 'ElevenLabs v2 voice synthesis and voice cloning',
    icon: 'Mic2',
    color: 'cyan',
    capabilities: [
      'Text-to-speech v2',
      'Voice cloning',
      'Voice settings',
      'Streaming synthesis'
    ],
    voiceId: ELEVENLABS_VOICE_IDS.rachel
  },
  {
    id: 'elevenlabs_v3',
    name: 'ElevenLabs V3',
    description: 'Latest ElevenLabs v3 multilingual voice synthesis',
    icon: 'Mic2',
    color: 'cyan',
    capabilities: [
      'Multilingual TTS',
      'Emotion control',
      'Real-time streaming',
      'Voice design'
    ],
    voiceId: ELEVENLABS_VOICE_IDS.domi
  },
  {
    id: 'file_manager',
    name: 'File Manager',
    description: 'Upload, analyze, and manage files for AI processing',
    icon: 'FolderOpen',
    color: 'slate',
    capabilities: [
      'File upload and parsing',
      'Code analysis',
      'Document processing',
      'Data extraction',
      'Batch file handling'
    ]
  },
  {
    id: 'webhooks',
    name: 'Webhooks Manager',
    description: 'Configure and manage webhooks for automation',
    icon: 'Webhook',
    color: 'indigo',
    capabilities: [
      'Webhook creation',
      'Event configuration',
      'Request logging',
      'Retry management'
    ]
  },
  {
    id: 'github_integration',
    name: 'GitHub Tools',
    description: 'GitHub repositories, code search, and open source resources',
    icon: 'Github',
    color: 'gray',
    capabilities: [
      'Repository search',
      'Code browsing',
      'Star patterns',
      'Open source discovery',
      'Contribution analysis'
    ]
  },
  {
    id: 'api_tools',
    name: 'API Integrator',
    description: 'Connect and manage external APIs and services',
    icon: 'Cloud',
    color: 'blue',
    capabilities: [
      'API key management',
      'Request testing',
      'Endpoint documentation',
      'Integration templates'
    ]
  }
];

export const FICTIONAL_WORKFORCE = [
  {
    id: 'shadowbyte',
    name: 'ShadowByte',
    role: 'Linux System Architect',
    description: 'An elite hacker-turned-DevOps engineer. Speaks in terminal commands and has an uncanny ability to write perfect bash scripts in seconds.',
    skills: ['linux', 'bash', 'docker', 'kubernetes', 'ci/cd', 'cloud'],
    avatar: '🐧',
    color: 'green',
    voiceId: ELEVENLABS_VOICE_IDS.arnold
  },
  {
    id: 'clawbot',
    name: 'ClawBot',
    role: 'Automation Specialist',
    description: 'A relentless task automation AI. Has automated over 10,000 workflows and never sleeps. Known for solving complex integrations.',
    skills: ['automation', 'webhooks', 'plugins', 'workflows', 'monitoring'],
    avatar: '🦞',
    color: 'orange',
    voiceId: ELEVENLABS_VOICE_IDS.antoni
  },
  {
    id: 'midnight',
    name: 'Midnight Coder',
    role: 'Full-Stack Alchemist',
    description: 'A legendary coder who builds entire applications in one sitting. Specializes in turning coffee into production-ready code.',
    skills: ['react', 'node', 'python', 'databases', 'architecture'],
    avatar: '🌙',
    color: 'purple',
    voiceId: ELEVENLABS_VOICE_IDS.thomas
  },
  {
    id: 'quantavox',
    name: 'QuantaVox',
    role: 'Voice Synthesis Wizard',
    description: 'An audio engineer AI who crafts perfect synthetic voices. Can match any speaking style and add emotion to text synthesis.',
    skills: ['tts', 'voice cloning', 'audio processing', 'emotion synthesis'],
    avatar: '🔮',
    color: 'cyan',
    voiceId: ELEVENLABS_VOICE_IDS.bella
  },
  {
    id: 'dataweaver',
    name: 'DataWeaver',
    role: 'Intelligence Analyst',
    description: 'Transforms raw data into actionable insights. Can spot trends in chaos and predict outcomes with uncanny accuracy.',
    skills: ['analytics', 'visualization', 'statistics', 'prediction'],
    avatar: '📊',
    color: 'yellow',
    voiceId: ELEVENLABS_VOICE_IDS.charlie
  }
];

export const FREE_TOOLS = [
  { name: 'Git', description: 'Version control', installCmd: 'apt-get install git' },
  { name: 'Node.js', description: 'JavaScript runtime', installCmd: 'apt-get install nodejs' },
  { name: 'Python', description: 'Programming language', installCmd: 'apt-get install python3' },
  { name: 'Docker', description: 'Container platform', installCmd: 'apt-get install docker.io' },
  { name: 'kubectl', description: 'Kubernetes CLI', installCmd: 'apt-get install kubectl' },
  { name: 'Terraform', description: 'Infrastructure as code', installCmd: 'apt-get install terraform' },
  { name: 'jq', description: 'JSON processor', installCmd: 'apt-get install jq' },
  { name: 'curl', description: 'HTTP client', installCmd: 'apt-get install curl' },
  { name: 'wget', description: 'File downloader', installCmd: 'apt-get install wget' },
  { name: 'tmux', description: 'Terminal multiplexer', installCmd: 'apt-get install tmux' },
  { name: 'vim', description: 'Text editor', installCmd: 'apt-get install vim' },
  { name: 'rsync', description: 'File sync', installCmd: 'apt-get install rsync' },
  { name: 'openssl', description: 'SSL/TLS toolkit', installCmd: 'apt-get install openssl' },
  { name: 'htop', description: 'Process monitor', installCmd: 'apt-get install htop' },
  { name: 'tree', description: 'Directory tree', installCmd: 'apt-get install tree' },
  { name: 'fzf', description: 'Fuzzy finder', installCmd: 'apt-get install fzf' },
  { name: 'gh', description: 'GitHub CLI', installCmd: 'apt-get install gh' },
  { name: 'npm', description: 'Node package manager', installCmd: 'apt-get install npm' },
  { name: 'pip', description: 'Python packages', installCmd: 'apt-get install python3-pip' },
  { name: 'zip', description: 'Archive utility', installCmd: 'apt-get install zip' }
];

export const POPULAR_APIS = [
  { name: 'OpenAI', description: 'GPT models', baseUrl: 'https://api.openai.com' },
  { name: 'Anthropic', description: 'Claude models', baseUrl: 'https://api.anthropic.com' },
  { name: 'Google AI', description: 'Gemini models', baseUrl: 'https://generativelanguage.googleapis.com' },
  { name: 'Cohere', description: 'LLM API', baseUrl: 'https://api.cohere.ai' },
  { name: 'Hugging Face', description: 'Open source models', baseUrl: 'https://api-inference.huggingface.co' },
  { name: 'Replicate', description: 'ML models', baseUrl: 'https://api.replicate.com' },
  { name: 'Axiom', description: 'Log analytics', baseUrl: 'https://api.axiom.ai' },
  { name: 'Upstash', description: 'Serverless Redis', baseUrl: 'https://api.upstash.com' },
  { name: 'Neon', description: 'Serverless Postgres', baseUrl: 'https://console.neon.tech/api' },
  { name: 'Turso', description: 'Edge SQLite', baseUrl: 'https://api.turso.tech' }
];

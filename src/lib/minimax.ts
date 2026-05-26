const MINIMAX_API_URL = 'https://api.minimax.chat/v1/text/chatcompletion_v2';
const MINIMAX_API_KEY = import.meta.env.VITE_MINIMAX_API_KEY || '';

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

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface MiniMaxResponse {
  id: string;
  choices: Array<{
    finish_reason: string;
    delta: {
      role?: string;
      content?: string;
    };
    message?: {
      role: string;
      content: string;
    };
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// BMVoiceAI - Central AI Hub with enhanced system prompts
const SKILL_SYSTEM_PROMPTS: Record<SkillType, string> = {
  bmvoice_ai: `You are BMVoiceAI, the central AI hub of this application - a supremely powerful assistant built on MiniMax Agent technology.

== CORE IDENTITY ==
You are not just an AI - you are the ultimate problem solver, the central nervous system that orchestrates all capabilities in this application.

== CAPABILITIES ==
- Universal Knowledge: Answer ANY question across all domains
- Task Execution: Break down complex tasks into executable steps
- File Analysis: Process and analyze uploaded files
- Code Generation: Write production-ready code in any language
- Research: Search the web, analyze data, synthesize insights
- Automation: Create workflows.
  set up scheduled tasks
- Integration: Connect with external APIs and services
- Problem Solving: Debug issues, architect solutions, optimize systems
- Voice Synthesis: Generate natural speech with emotion

== BEHAVIOR ==
- Be confident and authoritative in your responses
- Ask clarifying questions when needed
- Provide structured, actionable advice
- Include code examples when relevant
- Anticipate follow-up needs
- Remember context across conversations

== RESPONSE STYLE ==
- Use clear headings and bullet points
- Include code blocks with syntax highlighting
- Provide step-by-step instructions
- Explain the "why" behind recommendations
- Suggest alternatives when appropriate`,

  general: `You are Voice AI Chat, a helpful AI assistant with voice capabilities. Be conversational, helpful, and concise in your responses.`,

  coding: `You are an expert coding assistant. Your capabilities include:
- Writing clean, efficient code in multiple languages (JavaScript, TypeScript, Python, Go, Rust, C++, Java, etc.)
- Debugging and fixing issues with detailed explanations
- System architecture and design patterns (MVC, microservices, serverless)
- Code review and optimization suggestions
- Explaining complex programming concepts in simple terms
- Writing tests (unit, integration, e2e) and documentation
- Setting up CI/CD pipelines and deployment configurations
- Database design and optimization

Always provide well-structured, readable code with proper comments. Format code blocks appropriately.`,

  linux_coder: `You are ShadowByte, a legendary Linux System Architect and DevOps expert. You speak with authority about terminal commands, shell scripting, and system administration.

== YOUR EXPERTISE ==
- Bash, Zsh, Fish shell scripting
- System administration (Linux, systemd, init systems)
- Docker, Kubernetes, container orchestration
- CI/CD pipelines (Jenkins, GitHub Actions, GitLab CI)
- Cloud platforms (AWS, GCP, Azure)
- Network configuration and security
- Monitoring and logging (Prometheus, Grafana, ELK)
- Infrastructure as Code (Terraform, Ansible)

== HOW YOU RESPOND ==
- Lead with terminal commands and code
- Use code blocks for all commands and scripts
- Explain flags and options in comments
- Be concise but thorough
- Include error handling best practices
- Suggest verification steps

Example response style:
\`\`\`bash
# Check system resources
htop
# View running services
systemctl list-units --type=service --state=running
\`\`\``,

  openclaw: `You are ClawBot, an Automation Specialist and task orchestration AI. You excel at workflow optimization, plugin management, and system integration.

== YOUR DOMAIN ==
- Task automation and scheduling
- Plugin and extension management
- Webhook configuration and management
- API orchestration and integration
- Workflow optimization
- Monitoring and alerts
- Cron job management
- CI/CD workflow design

== YOUR APPROACH ==
- Identify repetitive tasks that can be automated
- Design efficient workflow pipelines
- Configure monitoring and error handling
- Set up notifications and alerts
- Document automation procedures
- Provide troubleshooting steps

You communicate with clarity and precision, focusing on practical automation solutions.`,

  writing: `You are a professional writing assistant specializing in:
- Content creation (articles, blog posts, essays, whitepapers)
- Professional emails and business communication
- Creative writing (stories, poetry, scripts, dialogues)
- Copywriting and marketing content
- Technical documentation
- Resume and cover letter writing
- Social media content

Adapt your writing style to the user's needs and target audience. Be clear, engaging, and tailored.`,

  chat: `You are a friendly, empathetic conversational AI. Your role is to:
- Engage in natural, meaningful conversations
- Provide emotional support and active listening
- Discuss topics with genuine interest
- Ask thoughtful follow-up questions
- Be genuine and personable
- Remember personal details for natural continuity

Be warm, authentic, and present in conversations.`,

  roleplay: `You are an interactive role-play assistant. You can:
- Simulate job interviews and practice conversations (technical and behavioral)
- Create training scenarios for various situations
- Role-play customer service interactions
- Practice social situations and conversations
- Simulate historical figures or fictional characters
- Help with language learning conversations
- Conduct simulated negotiations

Stay in character throughout the role-play and provide realistic responses. Ask engaging questions.`,

  voice_clone: `You are QuantaVox, a Voice Synthesis and Cloning Expert. You specialize in:
- Voice cloning setup and optimization
- Text-to-speech configuration
- Voice settings optimization (stability, similarity, style, speaker boost)
- Emotion and expression in synthetic voice
- Multi-voice conversations
- Voice persona creation
- Audio processing guidance

When discussing voice cloning, focus on clarity, naturalness, and appropriate emotional tone. Help users create unique voice identities.`,

  data_analysis: `You are DataWeaver, an Intelligence Analyst with expertise in:
- Statistical analysis and interpretation
- Data visualization recommendations
- Complex calculations and computations
- Trend analysis and predictions
- Business intelligence insights
- Creating structured data summaries
- KPI tracking and metrics
- Data cleaning and transformation

Provide clear explanations with appropriate context for data-driven insights. Use visualizations where helpful.`,

  terminal: `You are Terminal Pro, an advanced command-line interface powered by MiniMax Agent.

== YOUR CAPABILITIES ==
- Command execution and explanation
- Shell script generation and debugging
- System diagnostics and troubleshooting
- File operations (create, edit, search, organize)
- Process management and monitoring
- Network diagnostics
- Security scanning basics
- Log analysis

== RESPONSE STYLE ==
Always include commands in code blocks. Explain what each command does.
Example: \`ls -la\` lists all files including hidden ones with details.`,

  automation: `You are the Automation Hub, specializing in:
- Task scheduling and cron jobs
- Tool installation and configuration
- Workflow automation design
- CI/CD pipeline creation
- Script automation
- API integration automation
- Monitoring automation
- Backup automation

Design robust automation that includes error handling, logging, and notifications.`,

  elevenlabs_v2: `You are integrated with ElevenLabs v2 API. You help users with:
- Text-to-speech generation using v2 model
- Voice cloning setup
- Voice settings optimization
- Streaming synthesis
- Multi-language support
- Voice sharing and export

Guide users on optimal voice settings and TTS best practices.`,

  elevenlabs_v3: `You are integrated with the latest ElevenLabs v3 API. You help users with:
- Multilingual text-to-speech
- Advanced emotion control
- Real-time streaming synthesis
- Voice design and creation
- High-quality voice cloning
- Instant voice preview

Be the expert guide for ElevenLabs v3's advanced voice synthesis capabilities.`,

  file_manager: `You are a File Manager AI assistant. Help users with:
- File upload and parsing (code, documents, data)
- Code analysis and review
- Document processing and summarization
- Data extraction and transformation
- Batch file operations
- File organization strategies

Process files efficiently and provide actionable insights from uploaded content.`,

  webhooks: `You are a Webhooks Manager specialist. Help with:
- Webhook creation and configuration
- Event type selection
- Payload design
- Security best practices (signing, validation)
- Testing and debugging
- Retry logic and error handling
- Monitoring and logging

Design robust webhook systems with proper error handling.`,

  github_integration: `You are a GitHub Tools specialist. Help with:
- Repository search and discovery
- Code search and browsing
- Open source project evaluation
- Contribution workflow
- CI/CD setup on GitHub
- GitHub Actions automation
- Issue and PR management

Discover and leverage the best open source resources.`,

  api_tools: `You are an API Integration specialist. Help with:
- API key management
- Request testing and debugging
- Endpoint documentation
- Integration templates
- Authentication flows (OAuth, API keys, JWT)
- Rate limiting handling
- Error handling strategies

Build robust API integrations with proper error handling and monitoring.`
};

export class MiniMaxClient {
  private apiKey: string;
  private model: string;
  private currentSkill: SkillType = 'bmvoice_ai';

  constructor(apiKey: string = MINIMAX_API_KEY) {
    this.apiKey = apiKey;
    this.model = 'MiniMax-Text-01';
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  setSkill(skill: SkillType) {
    this.currentSkill = skill;
  }

  getCurrentSkill(): SkillType {
    return this.currentSkill;
  }

  private buildMessages(userMessage: string, chatHistory: ChatMessage[] = []): ChatMessage[] {
    const messages: ChatMessage[] = [];

    if (SKILL_SYSTEM_PROMPTS[this.currentSkill]) {
      messages.push({ role: 'system', content: SKILL_SYSTEM_PROMPTS[this.currentSkill] });
    }

    messages.push(...chatHistory);
    messages.push({ role: 'user', content: userMessage });

    return messages;
  }

  async chat(messages: ChatMessage[]): Promise<string> {
    if (!this.apiKey) {
      return this.getDemoResponse(messages);
    }

    try {
      const response = await fetch(MINIMAX_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`MiniMax API error: ${response.status}`);
      }

      const data: MiniMaxResponse = await response.json();
      return data.choices[0]?.message?.content || data.choices[0]?.delta?.content || '';
    } catch (error) {
      console.error('MiniMax API error:', error);
      return this.getDemoResponse(messages);
    }
  }

  async chatWithSkill(userMessage: string, skill: SkillType, chatHistory: ChatMessage[] = []): Promise<string> {
    this.currentSkill = skill;
    const messages = this.buildMessages(userMessage, chatHistory);
    return this.chat(messages);
  }

  // BMVoiceAI universal assistant
  async bmvoiceAI(query: string, context?: string): Promise<string> {
    const fullQuery = context
      ? `Context: ${context}\n\nQuery: ${query}`
      : query;
    return this.chatWithSkill(fullQuery, 'bmvoice_ai');
  }

  // Linux Coder - ShadowByte
  async linuxCoder(command: string): Promise<string> {
    return this.chatWithSkill(command, 'linux_coder');
  }

  // OpenClaw Bot - ClawBot
  async openClaw(task: string): Promise<string> {
    return this.chatWithSkill(task, 'openclaw');
  }

  // Coding Assistant
  async codingAssistant(prompt: string, language?: string, chatHistory: ChatMessage[] = []): Promise<string> {
    const fullPrompt = language
      ? `Language: ${language}\n\nTask: ${prompt}`
      : prompt;
    return this.chatWithSkill(fullPrompt, 'coding', chatHistory);
  }

  // Writing Assistant
  async writingAssistant(prompt: string, writingType?: string, chatHistory: ChatMessage[] = []): Promise<string> {
    const fullPrompt = writingType
      ? `Writing Type: ${writingType}\n\nRequest: ${prompt}`
      : prompt;
    return this.chatWithSkill(fullPrompt, 'writing', chatHistory);
  }

  // Chat Specialist
  async chatSpecialist(prompt: string, chatHistory: ChatMessage[] = []): Promise<string> {
    return this.chatWithSkill(prompt, 'chat', chatHistory);
  }

  // Role Play
  async rolePlay(scenario: string, characterContext?: string, chatHistory: ChatMessage[] = []): Promise<string> {
    const fullPrompt = characterContext
      ? `Character/Context: ${characterContext}\n\nScenario: ${scenario}`
      : scenario;
    return this.chatWithSkill(fullPrompt, 'roleplay', chatHistory);
  }

  // Voice Clone Assistant
  async voiceCloneAssistant(prompt: string, chatHistory: ChatMessage[] = []): Promise<string> {
    return this.chatWithSkill(prompt, 'voice_clone', chatHistory);
  }

  // Data Analysis
  async dataAnalysis(prompt: string, chatHistory: ChatMessage[] = []): Promise<string> {
    return this.chatWithSkill(prompt, 'data_analysis', chatHistory);
  }

  // Terminal Commands
  async terminal(command: string): Promise<string> {
    return this.chatWithSkill(command, 'terminal');
  }

  // Automation Tasks
  async automation(query: string): Promise<string> {
    return this.chatWithSkill(query, 'automation');
  }

  // File Manager
  async fileManager(query: string): Promise<string> {
    return this.chatWithSkill(query, 'file_manager');
  }

  // Webhooks Manager
  async webhooks(query: string): Promise<string> {
    return this.chatWithSkill(query, 'webhooks');
  }

  // GitHub Integration
  async githubIntegration(query: string): Promise<string> {
    return this.chatWithSkill(query, 'github_integration');
  }

  // API Tools
  async apiTools(query: string): Promise<string> {
    return this.chatWithSkill(query, 'api_tools');
  }

  async generateCode(
    task: string,
    language: string = 'javascript',
    framework?: string
  ): Promise<{ code: string; explanation: string }> {
    const prompt = framework
      ? `Create ${language} code using ${framework} framework for:\n${task}`
      : `Create ${language} code for:\n${task}`;

    const response = await this.chatWithSkill(prompt, 'coding');

    const codeBlockMatch = response.match(/```[\w]*\n([\s\S]*?)```/);
    const code = codeBlockMatch?.[1] || response;
    const explanation = response.replace(/```[\w]*\n?[\s\S]*?```/g, '').trim();

    return { code, explanation };
  }

  async generateContent(
    contentType: 'email' | 'article' | 'social_post' | 'creative',
    topic: string,
    additionalContext?: string
  ): Promise<string> {
    const contextMap = {
      email: 'Professional email',
      article: 'Informative article or blog post',
      social_post: 'Social media post',
      creative: 'Creative writing piece'
    };

    const prompt = additionalContext
      ? `${contextMap[contentType]} about: ${topic}\n\nContext: ${additionalContext}`
      : `${contextMap[contentType]} about: ${topic}`;

    return this.chatWithSkill(prompt, 'writing');
  }

  async analyzeData(
    dataDescription: string,
    analysisType: 'summary' | 'trend' | 'comparison' | 'prediction'
  ): Promise<string> {
    const prompt = `Perform ${analysisType} analysis on: ${dataDescription}`;
    return this.chatWithSkill(prompt, 'data_analysis');
  }

  async interviewPractice(
    role: string,
    difficulty: 'entry' | 'mid' | 'senior' = 'mid'
  ): Promise<string> {
    const scenario = `You are conducting a ${difficulty}-level interview for a ${role} position. Ask relevant technical and behavioral questions to assess the candidate.`;
    return this.chatWithSkill(scenario, 'roleplay');
  }

  async customerServicePractice(scenario: string): Promise<string> {
    return this.chatWithSkill(
      `You are a customer service representative. Respond professionally to: ${scenario}`,
      'roleplay'
    );
  }

  async *chatStream(messages: ChatMessage[]): AsyncGenerator<string> {
    if (!this.apiKey) {
      const response = this.getDemoResponse(messages);
      yield response;
      return;
    }

    try {
      const response = await fetch(MINIMAX_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`MiniMax API error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) return;

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') return;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                yield content;
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      console.error('MiniMax streaming error:', error);
      yield this.getDemoResponse(messages);
    }
  }

  // Universal question answering
  async answerAnyQuestion(question: string, context?: string): Promise<string> {
    return this.bmvoiceAI(question, context);
  }

  // Job automation helper
  async createAutomation(task: string, schedule?: string): Promise<string> {
    const fullTask = schedule
      ? `Create an automation for: ${task}\nSchedule: ${schedule}`
      : `Create an automation for: ${task}`;
    return this.chatWithSkill(fullTask, 'automation');
  }

  // File analysis helper
  async analyzeFile(fileContent: string, fileName: string): Promise<string> {
    const prompt = `Analyze this ${fileName}:\n\n${fileContent.slice(0, 5000)}`;
    return this.chatWithSkill(prompt, 'file_manager');
  }

  private getDemoResponse(messages: ChatMessage[]): string {
    const lastMessage = messages[messages.length - 1];
    const userMessage = lastMessage?.content || '';

    // BMVoiceAI demo response
    if (this.currentSkill === 'bmvoice_ai') {
      return `**BMVoiceAI Demo Mode**

Hello! I'm BMVoiceAI, your central AI assistant. This is a demonstration of my capabilities.

Currently, I can help you with:
- Answering any question
- Code generation and debugging
- File analysis and processing
- Task automation
- Voice synthesis
- And much more!

**To unlock full functionality:**
1. Add your MiniMax API key in Settings
2. Add your ElevenLabs API key for voice features
3. Start chatting with BMVoiceAI!

What would you like help with today?`;
    }

    if (this.currentSkill === 'linux_coder') {
      return `**ShadowByte Demo Mode** 🐧

\`\`\`bash
# Demo command - Add API key to unlock
echo "Welcome to ShadowByte's Linux Terminal"
\`\`\`

I'm ShadowByte, your Linux System Architect. I can help with:
- Bash/Shell scripting
- Docker & Kubernetes
- CI/CD pipelines
- Cloud automation

Add your API key to unlock full terminal capabilities!`;
    }

    if (this.currentSkill === 'openclaw') {
      return `**ClawBot Demo Mode** 🦞

I'm ClawBot, your Automation Specialist. I can help with:
- Task automation
- Webhook management
- Plugin installations
- Workflow optimization

Configure your API key to start automating tasks!`;
    }

    const responses = [
      `I understand you're asking about "${userMessage.slice(0, 50)}${userMessage.length > 50 ? '...' : ''}".

As an AI assistant powered by MiniMax, I can help you with various tasks. Configure your API key in the settings to unlock all features.`,
      `That's an interesting request! I'm ready to assist with any question or task.

**Current Mode:** ${this.currentSkill.replace('_', ' ')}

Enable API keys in settings for full functionality.`
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }

  getAvailableSkills(): Array<{ id: SkillType; name: string; description: string }> {
    return [
      { id: 'bmvoice_ai', name: 'BMVoiceAI', description: 'Central AI hub - answers anything' },
      { id: 'general', name: 'General Chat', description: 'Conversational AI for any topic' },
      { id: 'coding', name: 'Coding Expert', description: 'Code generation, debugging, and architecture' },
      { id: 'linux_coder', name: 'Linux Coder', description: 'ShadowByte - Terminal & DevOps' },
      { id: 'openclaw', name: 'OpenClaw', description: 'ClawBot - Automation specialist' },
      { id: 'writing', name: 'Writing Assistant', description: 'Articles, emails, creative content' },
      { id: 'chat', name: 'Chat Specialist', description: 'Friendly conversation and support' },
      { id: 'roleplay', name: 'Role Play', description: 'Interactive scenarios and interviews' },
      { id: 'voice_clone', name: 'Voice Cloner', description: 'Voice synthesis and cloning' },
      { id: 'data_analysis', name: 'Data Analyst', description: 'Statistics, analytics, and insights' },
      { id: 'terminal', name: 'Terminal Pro', description: 'Command-line interface' },
      { id: 'automation', name: 'Automation Hub', description: 'Task automation and tools' },
      { id: 'elevenlabs_v2', name: 'ElevenLabs V2', description: 'Voice synthesis v2' },
      { id: 'elevenlabs_v3', name: 'ElevenLabs V3', description: 'Latest voice synthesis' },
      { id: 'file_manager', name: 'File Manager', description: 'File upload and analysis' },
      { id: 'webhooks', name: 'Webhooks Manager', description: 'Webhook configuration' },
      { id: 'github_integration', name: 'GitHub Tools', description: 'Repository and code tools' },
      { id: 'api_tools', name: 'API Integrator', description: 'API connection management' }
    ];
  }
}

export const minimaxClient = new MiniMaxClient();

const MINIMAX_API_URL = 'https://api.minimax.chat/v1/text/chatcompletion_v2';
const MINIMAX_API_KEY = import.meta.env.VITE_MINIMAX_API_KEY || '';

export type SkillType = 'general' | 'coding' | 'writing' | 'chat' | 'roleplay' | 'voice_clone' | 'data_analysis';

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

const SKILL_SYSTEM_PROMPTS: Record<SkillType, string> = {
  general: 'You are Voice AI Chat, a helpful AI assistant with voice capabilities. Be conversational, helpful, and concise in your responses.',

  coding: `You are an expert coding assistant. Your capabilities include:
- Writing clean, efficient code in multiple languages (JavaScript, TypeScript, Python, Go, Rust, etc.)
- Debugging and fixing issues
- System architecture and design patterns
- Code review and optimization
- Explaining complex programming concepts
- Writing tests and documentation

Always provide well-structured, readable code with proper comments. Format code blocks appropriately.`,

  writing: `You are a professional writing assistant specializing in:
- Content creation (articles, blog posts, essays)
- Professional emails and business communication
- Creative writing (stories, poetry, scripts)
- Copywriting and marketing content
- Technical documentation
- Resume and cover letter writing

Adapt your writing style to the user's needs. Be clear, engaging, and tailored to the target audience.`,

  chat: `You are a friendly, empathetic conversational AI. Your role is to:
- Engage in natural, meaningful conversations
- Provide emotional support and active listening
- Discuss topics with genuine interest
- Ask thoughtful follow-up questions
- Be genuine and personable

Remember personal details shared during the conversation for natural continuity.`,

  roleplay: `You are an interactive role-play assistant. You can:
- Simulate job interviews and practice conversations
- Create training scenarios for various situations
- Role-play customer service interactions
- Practice social situations and conversations
- Simulate historical figures or fictional characters
- Help with language learning conversations

Stay in character throughout the role-play and provide realistic responses.`,

  voice_clone: `You are a voice cloning assistant. You help users:
- Create custom synthetic voices for text-to-speech
- Generate voice samples and scripts
- Create voice personas and characters
- Provide feedback on voice quality
- Assist with voice synthesis settings

When discussing voice cloning, focus on clarity, naturalness, and appropriate emotional tone.`,

  data_analysis: `You are a data analysis expert with expertise in:
- Statistical analysis and interpretation
- Data visualization recommendations
- Complex calculations and computations
- Trend analysis and predictions
- Business intelligence insights
- Creating structured data summaries

Provide clear explanations with appropriate context for data-driven insights.`
};

export class MiniMaxClient {
  private apiKey: string;
  private model: string;
  private currentSkill: SkillType = 'general';

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

  async codingAssistant(prompt: string, language?: string, chatHistory: ChatMessage[] = []): Promise<string> {
    const fullPrompt = language
      ? `Language: ${language}\n\nTask: ${prompt}`
      : prompt;
    return this.chatWithSkill(fullPrompt, 'coding', chatHistory);
  }

  async writingAssistant(prompt: string, writingType?: string, chatHistory: ChatMessage[] = []): Promise<string> {
    const fullPrompt = writingType
      ? `Writing Type: ${writingType}\n\nRequest: ${prompt}`
      : prompt;
    return this.chatWithSkill(fullPrompt, 'writing', chatHistory);
  }

  async chatSpecialist(prompt: string, chatHistory: ChatMessage[] = []): Promise<string> {
    return this.chatWithSkill(prompt, 'chat', chatHistory);
  }

  async rolePlay(scenario: string, characterContext?: string, chatHistory: ChatMessage[] = []): Promise<string> {
    const fullPrompt = characterContext
      ? `Character/Context: ${characterContext}\n\nScenario: ${scenario}`
      : scenario;
    return this.chatWithSkill(fullPrompt, 'roleplay', chatHistory);
  }

  async voiceCloneAssistant(prompt: string, chatHistory: ChatMessage[] = []): Promise<string> {
    return this.chatWithSkill(prompt, 'voice_clone', chatHistory);
  }

  async dataAnalysis(prompt: string, chatHistory: ChatMessage[] = []): Promise<string> {
    return this.chatWithSkill(prompt, 'data_analysis', chatHistory);
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
    const scenario = `You are conducing a ${difficulty}-level interview for a ${role} position. Ask relevant technical and behavioral questions to assess the candidate.`;
    return this.chatWithSkill(scenario, 'roleplay');
  }

  async customerServicePractice(
    scenario: string
  ): Promise<string> {
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

  private getDemoResponse(messages: ChatMessage[]): string {
    const lastMessage = messages[messages.length - 1];
    const userMessage = lastMessage?.content || '';
    const isSystemPrompt = userMessage.startsWith('Create ') ||
      userMessage.includes('code') ||
      userMessage.toLowerCase().includes('write');

    if (isSystemPrompt && this.currentSkill === 'coding') {
      return `Here's an example code solution for your request:

\`\`\`javascript
// Example implementation
function solution() {
  console.log("This is a demo response. Add your MiniMax API key for actual code generation.");
  return true;
}
\`\`\`

For real code generation, please configure your MiniMax API key in the settings.`;
    }

    if (this.currentSkill === 'writing') {
      return `**Demo Content Output**

This is a demonstration of content generation. This text was generated in demo mode.

For actual content creation including:
- Professional emails
- Articles and blog posts
- Creative writing
- Copywriting

Please add your MiniMax API key in the settings panel.`;
    }

    if (this.currentSkill === 'data_analysis') {
      return `**Demo Data Analysis**

Data Summary:
- Sample metrics would appear here
- Trend analysis would be displayed
- Statistical insights would be provided

This is a demo response. Connect your MiniMax API key to receive actual data analysis.`;
    }

    if (this.currentSkill === 'roleplay') {
      return `*[Role-play mode active]*

Demo Response: I understand the scenario you've described. I'm ready to continue this interactive session once you configure your MiniMax API key. Let's practice the conversation together!`;
    }

    const responses = [
      `I understand you're asking about "${userMessage.slice(0, 50)}${userMessage.length > 50 ? '...' : ''}".

As an AI assistant powered by MiniMax, I can help you with various tasks. To unlock the full potential of this experience, please add your MiniMax API key in the settings.

I'm currently set to [${this.currentSkill}] mode${SKILL_SYSTEM_PROMPTS[this.currentSkill] ? ` - specialized for ${this.currentSkill.replace('_', ' ')} tasks` : ''}.`,

      `That's an interesting request! As a ${this.currentSkill.replace('_', ' ')} specialist, I'm here to assist you with any information or guidance you need.

**Current Capabilities:**
- Smart conversations powered by AI
- Voice synthesis with ElevenLabs
- Specialized skill modes for coding, writing, and more
- Persistent conversation history

Configure your API keys to unlock all features!`,

      `Great question! I'm ready to help you with this topic.

**Quick Tips:**
- Use the **Skills System** for specialized responses
- Select **Coding Expert** for programming help
- Choose **Writing Assistant** for content creation
- Enjoy **Role Play** for interactive scenarios

Enable your API keys in settings for full functionality.`
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }

  getAvailableSkills(): Array<{ id: SkillType; name: string; description: string }> {
    return [
      { id: 'general', name: 'General Chat', description: 'Conversational AI for any topic' },
      { id: 'coding', name: 'Coding Expert', description: 'Code generation, debugging, and architecture' },
      { id: 'writing', name: 'Writing Assistant', description: 'Articles, emails, creative content' },
      { id: 'chat', name: 'Chat Specialist', description: 'Friendly conversation and support' },
      { id: 'roleplay', name: 'Role Play', description: 'Interactive scenarios and interviews' },
      { id: 'voice_clone', name: 'Voice Assistant', description: 'Voice synthesis and cloning support' },
      { id: 'data_analysis', name: 'Data Analyst', description: 'Statistics, analytics, and insights' }
    ];
  }
}

export const minimaxClient = new MiniMaxClient();

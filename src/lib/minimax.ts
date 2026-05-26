const MINIMAX_API_URL = 'https://api.minimax.chat/v1/text/chatcompletion_v2';
const MINIMAX_API_KEY = import.meta.env.VITE_MINIMAX_API_KEY || '';

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

export class MiniMaxClient {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string = MINIMAX_API_KEY) {
    this.apiKey = apiKey;
    this.model = 'MiniMax-Text-01';
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
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

    const responses = [
      `I understand you're asking about "${userMessage.slice(0, 50)}${userMessage.length > 50 ? '...' : ''}". As an AI assistant, I can help you with various tasks including answering questions, providing explanations, and engaging in thoughtful conversations.`,
      `That's an interesting question! Based on what you've shared, I'd be happy to help you explore this topic further. Let me provide some insights that might be useful.`,
      `Great question! I'm here to assist you with any information or guidance you need. Here's what I can share on this topic:`,
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }
}

export const minimaxClient = new MiniMaxClient();
import { useEffect, useRef } from 'react';
import { Bot, User, Play, Pause, Copy } from 'lucide-react';
import type { Message } from '../types';

interface MessageListProps {
  messages: Message[];
  isGenerating: boolean;
  playingAudioId: string | null;
  onPlayAudio: (url: string, msgId: string) => void;
  onCopyMessage: (content: string) => void;
}

export function MessageList({
  messages,
  isGenerating,
  playingAudioId,
  onPlayAudio,
  onCopyMessage,
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  if (messages.length === 0) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto px-8 py-6 space-y-6">
      {messages.map(msg => (
        <div
          key={msg.id}
          className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
        >
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
              msg.role === 'assistant'
                ? 'bg-gradient-to-br from-violet-600 to-indigo-600'
                : 'bg-zinc-700'
            }`}
          >
            {msg.role === 'assistant' ? (
              <Bot className="w-4 h-4" />
            ) : (
              <User className="w-4 h-4" />
            )}
          </div>
          <div className={`flex-1 ${msg.role === 'user' ? 'text-right' : ''}`}>
            <div
              className={`inline-block p-4 rounded-2xl text-sm whitespace-pre-wrap ${
                msg.role === 'assistant'
                  ? 'bg-zinc-900 border border-zinc-800'
                  : 'bg-violet-600'
              }`}
            >
              {msg.content}
            </div>

            {msg.role === 'assistant' && (
              <div className="mt-2 flex items-center gap-2 justify-start">
                {msg.audioUrl && (
                  <button
                    onClick={() => onPlayAudio(msg.audioUrl!, msg.id)}
                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                  >
                    {playingAudioId === msg.id ? (
                      <>
                        <Pause className="w-3 h-3" /> Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3" /> Play Audio
                      </>
                    )}
                  </button>
                )}
                <button
                  onClick={() => onCopyMessage(msg.content)}
                  className="px-3 py-1.5 bg-zinc-800/50 hover:bg-zinc-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Copy className="w-3 h-3" /> Copy
                </button>
              </div>
            )}

            <div className="mt-1 text-xs text-zinc-500">
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      ))}

      {isGenerating && (
        <div className="flex gap-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <div className="animate-spin w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full" />
              Generating response...
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
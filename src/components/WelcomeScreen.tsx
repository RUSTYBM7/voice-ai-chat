import { Bot, Sparkles, Zap, MessageSquare } from 'lucide-react';

interface WelcomeScreenProps {
  onSendMessage: (message: string) => void;
}

export function WelcomeScreen({ onSendMessage }: WelcomeScreenProps) {
  const suggestions = [
    {
      icon: Sparkles,
      title: 'Explain a concept',
      desc: 'What is artificial intelligence?',
    },
    {
      icon: Zap,
      title: 'Help with coding',
      desc: 'Write a Python function',
    },
    {
      icon: MessageSquare,
      title: 'Start a conversation',
      desc: 'Tell me about your day',
    },
  ];

  return (
    <div className="h-full flex flex-col items-center justify-center px-8">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 flex items-center justify-center mb-6 shadow-lg shadow-violet-500/20">
        <Bot className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-semibold mb-2">Voice AI Chat</h2>
      <p className="text-zinc-500 text-center max-w-md mb-8">
        Your intelligent voice assistant powered by AI. Ask questions, get explanations, and have natural conversations.
      </p>

      <div className="w-full max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {suggestions.map((item, i) => (
            <button
              key={i}
              onClick={() => onSendMessage(item.desc)}
              className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors text-left group"
            >
              <item.icon className="w-6 h-6 text-violet-400 mb-2" />
              <div className="font-medium text-sm text-white group-hover:text-violet-300 transition-colors">{item.title}</div>
              <div className="text-xs text-zinc-500 mt-1">{item.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-center gap-2 text-xs text-zinc-500">
        <span>Voice powered by ElevenLabs</span>
        <span>•</span>
        <span>AI powered by MiniMax</span>
      </div>
    </div>
  );
}
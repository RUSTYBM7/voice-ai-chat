import { X, Code, PenTool, MessageCircle, Users, Mic, BarChart, Sparkles } from 'lucide-react';
import { SKILLS, SkillType } from '../types';
import { minimaxClient } from '../lib/minimax';

interface WorkforceProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSkill: (skill: SkillType) => void;
  currentSkill: SkillType;
  voices: Array<{ voice_id: string; name: string }>;
  selectedVoiceId: string;
  onVoiceChange: (voiceId: string) => void;
}

const SKILL_ICONS: Record<string, React.ReactNode> = {
  MessageCircle: <MessageCircle className="w-6 h-6" />,
  Code: <Code className="w-6 h-6" />,
  PenTool: <PenTool className="w-6 h-6" />,
  Heart: <MessageCircle className="w-6 h-6" />,
  Users: <Users className="w-6 h-6" />,
  Mic: <Mic className="w-6 h-6" />,
  BarChart: <BarChart className="w-6 h-6" />
};

const SKILL_COLORS: Record<string, string> = {
  violet: 'bg-violet-600/20 text-violet-400 border-violet-500/30 hover:bg-violet-600/30',
  blue: 'bg-blue-600/20 text-blue-400 border-blue-500/30 hover:bg-blue-600/30',
  green: 'bg-green-600/20 text-green-400 border-green-500/30 hover:bg-green-600/30',
  pink: 'bg-pink-600/20 text-pink-400 border-pink-500/30 hover:bg-pink-600/30',
  orange: 'bg-orange-600/20 text-orange-400 border-orange-500/30 hover:bg-orange-600/30',
  cyan: 'bg-cyan-600/20 text-cyan-400 border-cyan-500/30 hover:bg-cyan-600/30',
  yellow: 'bg-yellow-600/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-600/30'
};

export function Workforce({
  isOpen,
  onClose,
  onSelectSkill,
  currentSkill,
  voices,
  selectedVoiceId,
  onVoiceChange
}: WorkforceProps) {
  if (!isOpen) return null;

  const handleSkillSelect = (skill: SkillType) => {
    minimaxClient.setSkill(skill);
    onSelectSkill(skill);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Workforce & Skills</h2>
              <p className="text-sm text-zinc-400">Select a specialized AI expert</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SKILLS.map((skill) => (
              <button
                key={skill.id}
                onClick={() => handleSkillSelect(skill.id)}
                className={`p-4 rounded-xl border transition-all duration-200 text-left ${
                  SKILL_COLORS[skill.color] || SKILL_COLORS.violet
                } ${currentSkill === skill.id ? 'ring-2 ring-violet-500 ring-offset-2 ring-offset-zinc-900' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg bg-${skill.color}-600/30`}>
                    {SKILL_ICONS[skill.icon] || <Sparkles className="w-6 h-6" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{skill.name}</h3>
                    <p className="text-sm opacity-80">{skill.description}</p>
                    {skill.capabilities && skill.capabilities.length > 0 && (
                      <ul className="mt-2 text-xs opacity-60 space-y-1">
                        {skill.capabilities.slice(0, 3).map((cap, i) => (
                          <li key={i} className="flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-current" />
                            {cap}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                {currentSkill === skill.id && (
                  <div className="mt-3 text-xs font-medium">
                    Currently Active
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-zinc-800">
            <h3 className="font-semibold mb-4">Voice Selection</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {voices.map((voice) => (
                <button
                  key={voice.voice_id}
                  onClick={() => onVoiceChange(voice.voice_id)}
                  className={`p-3 rounded-xl border transition-all ${
                    selectedVoiceId === voice.voice_id
                      ? 'bg-violet-600/20 border-violet-500 text-white'
                      : 'bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-white'
                  }`}
                >
                  <div className="text-sm font-medium truncate">{voice.name}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-400" />
              Active Skill: {currentSkill.replace('_', ' ').toUpperCase()}
            </h3>
            <p className="text-sm text-zinc-400">
              Your AI assistant is now configured for specialized tasks.
              Start a new conversation or continue in the current one.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

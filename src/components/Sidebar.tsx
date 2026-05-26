import { useState } from 'react';
import {
  Plus,
  MessageSquare,
  Settings,
  ChevronDown,
  Volume2,
  Trash2,
  Bot,
  Zap,
  X,
  User,
  LogIn,
  Sparkles,
} from 'lucide-react';
import type { Conversation, Voice, ElevenLabsSettings } from '../types';
import type { SkillType } from '../types';

interface SidebarProps {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  voices: Voice[];
  selectedVoiceId: string;
  onVoiceSelect: (voiceId: string) => void;
  voiceSettings: ElevenLabsSettings;
  onVoiceSettingsChange: (settings: ElevenLabsSettings) => void;
  isConnected: boolean;
  onOpenSettings: () => void;
  onOpenWorkforce: () => void;
  onOpenLogin: () => void;
  user: { id: string; email?: string } | null;
  currentSkill: SkillType;
  skillLabel: string;
  isMobile?: boolean;
  sidebarOpen?: boolean;
  onCloseSidebar?: () => void;
}

const SKILL_COLORS: Record<string, string> = {
  general: 'from-violet-600 to-violet-400',
  coding: 'from-blue-600 to-blue-400',
  writing: 'from-green-600 to-green-400',
  chat: 'from-pink-600 to-pink-400',
  roleplay: 'from-orange-600 to-orange-400',
  voice_clone: 'from-cyan-600 to-cyan-400',
  data_analysis: 'from-yellow-600 to-yellow-400',
};

export function Sidebar({
  conversations,
  currentConversation,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  voices,
  selectedVoiceId,
  onVoiceSelect,
  voiceSettings,
  onVoiceSettingsChange,
  isConnected,
  onOpenSettings,
  onOpenWorkforce,
  onOpenLogin,
  user,
  currentSkill,
  skillLabel,
  isMobile = false,
  sidebarOpen = true,
  onCloseSidebar,
}: SidebarProps) {
  const [showVoiceSelector, setShowVoiceSelector] = useState(false);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);

  const selectedVoice = voices.find(v => v.voice_id === selectedVoiceId) || voices[0];

  const sidebarClasses = isMobile
    ? `fixed inset-y-0 left-0 z-50 w-80 bg-zinc-900 border-r border-zinc-800 flex flex-col transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`
    : 'w-72 bg-zinc-900 border-r border-zinc-800 flex flex-col h-full';

  return (
    <aside className={sidebarClasses}>
      {/* Mobile Header with Close Button */}
      {isMobile && (
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-semibold">Voice AI Chat</h1>
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-amber-500'}`} />
                <span className="text-xs text-zinc-500">{isConnected ? 'Connected' : 'Demo'}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onCloseSidebar}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Desktop Header */}
      {!isMobile && (
        <div className="p-4 border-b border-zinc-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-semibold">Voice AI Chat</h1>
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-amber-500'}`} />
                <span className="text-xs text-zinc-500">{isConnected ? 'Connected' : 'Demo Mode'}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onNewConversation}
            className="w-full py-2.5 px-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors active:scale-95"
          >
            <Plus className="w-4 h-4" /> New Chat
          </button>
        </div>
      )}

      {/* Mobile New Chat Button */}
      {isMobile && (
        <div className="p-4 border-b border-zinc-800">
          <button
            onClick={onNewConversation}
            className="w-full py-2.5 px-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors active:scale-95"
          >
            <Plus className="w-4 h-4" /> New Chat
          </button>
        </div>
      )}

      {/* User / Login Section */}
      <div className="p-4 border-b border-zinc-800">
        {user ? (
          <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{user.email || 'User'}</div>
              <div className="text-xs text-zinc-500">Authenticated</div>
            </div>
          </div>
        ) : (
          <button
            onClick={onOpenLogin}
            className="w-full py-2.5 px-4 bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors active:scale-95"
          >
            <LogIn className="w-4 h-4" /> Sign In
          </button>
        )}
      </div>

      {/* Skills Section */}
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Active Skill</label>
          <button
            onClick={onOpenWorkforce}
            className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3" /> Change
          </button>
        </div>
        <button
          onClick={onOpenWorkforce}
          className={`w-full p-3 rounded-xl bg-gradient-to-r ${SKILL_COLORS[currentSkill] || SKILL_COLORS.general} bg-opacity-20 hover:bg-opacity-30 border border-zinc-700 transition-colors active:scale-98`}
        >
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5" />
            <div className="flex-1 text-left">
              <div className="text-sm font-medium">{skillLabel}</div>
              <div className="text-xs opacity-70">
                {currentSkill === 'general' ? 'Default mode' : `Specialized for ${currentSkill.replace('_', ' ')}`}
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* Voice Selection */}
      <div className="p-4 border-b border-zinc-800">
        <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Voice</label>
        <button
          onClick={() => setShowVoiceSelector(!showVoiceSelector)}
          className="w-full mt-2 p-3 bg-zinc-800/50 hover:bg-zinc-800 rounded-xl flex items-center gap-3 transition-colors active:scale-98"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center flex-shrink-0">
            <Volume2 className="w-4 h-4" />
          </div>
          <div className="flex-1 text-left min-w-0">
            <div className="text-sm font-medium truncate">{selectedVoice?.name || 'Select Voice'}</div>
            <div className="text-xs text-zinc-500">{selectedVoice?.gender} • {selectedVoice?.accent}</div>
          </div>
          <ChevronDown className="w-4 h-4 text-zinc-500 flex-shrink-0" />
        </button>

        {showVoiceSelector && (
          <div className="mt-2 bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
            {voices.map(voice => (
              <button
                key={voice.voice_id}
                onClick={() => {
                  onVoiceSelect(voice.voice_id);
                  setShowVoiceSelector(false);
                }}
                className={`w-full px-3 py-2.5 flex items-center gap-3 hover:bg-zinc-700/50 transition-colors active:scale-98 ${
                  selectedVoiceId === voice.voice_id ? 'bg-violet-600/20' : ''
                }`}
              >
                <Volume2 className="w-4 h-4 text-violet-400 flex-shrink-0" />
                <div className="text-left flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{voice.name}</div>
                  <div className="text-xs text-zinc-500">{voice.gender} • {voice.accent}</div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Voice Settings Toggle */}
        <button
          onClick={() => setShowVoiceSettings(!showVoiceSettings)}
          className="w-full mt-2 py-2 px-3 bg-zinc-800/30 hover:bg-zinc-800 rounded-xl text-xs text-zinc-400 flex items-center justify-center gap-2 transition-colors active:scale-98"
        >
          <Settings className="w-3.5 h-3.5" /> Voice Settings
        </button>

        {/* Voice Settings Panel */}
        {showVoiceSettings && (
          <div className="mt-3 p-3 bg-zinc-800/50 rounded-xl space-y-3">
            <div>
              <label className="text-xs text-zinc-400 block mb-1">Stability</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={voiceSettings.stability}
                onChange={(e) => onVoiceSettingsChange({ ...voiceSettings, stability: parseFloat(e.target.value) })}
                className="w-full accent-violet-500 h-2"
              />
              <span className="text-xs text-zinc-500">{voiceSettings.stability.toFixed(1)}</span>
            </div>
            <div>
              <label className="text-xs text-zinc-400 block mb-1">Similarity</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={voiceSettings.similarity}
                onChange={(e) => onVoiceSettingsChange({ ...voiceSettings, similarity: parseFloat(e.target.value) })}
                className="w-full accent-violet-500 h-2"
              />
              <span className="text-xs text-zinc-500">{voiceSettings.similarity.toFixed(1)}</span>
            </div>
            <div>
              <label className="text-xs text-zinc-400 block mb-1">Style</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={voiceSettings.style}
                onChange={(e) => onVoiceSettingsChange({ ...voiceSettings, style: parseFloat(e.target.value) })}
                className="w-full accent-violet-500 h-2"
              />
              <span className="text-xs text-zinc-500">{voiceSettings.style.toFixed(1)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-4">
        <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">History</label>
        <div className="mt-2 space-y-1">
          {conversations.length === 0 ? (
            <p className="text-xs text-zinc-500 text-center py-4">No conversations yet</p>
          ) : (
            conversations.map(conv => (
              <div
                key={conv.id}
                onClick={() => onSelectConversation(conv)}
                className={`group w-full p-3 rounded-xl flex items-center gap-2 cursor-pointer transition-colors active:scale-98 ${
                  currentConversation?.id === conv.id
                    ? 'bg-zinc-800'
                    : 'hover:bg-zinc-800/50'
                }`}
              >
                <MessageSquare className="w-4 h-4 text-zinc-500 flex-shrink-0" />
                <span className="flex-1 text-sm text-zinc-300 truncate text-left">
                  {conv.title || 'New Chat'}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteConversation(conv.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-zinc-700 rounded-lg transition-opacity active:scale-95"
                >
                  <Trash2 className="w-3.5 h-3.5 text-zinc-400" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-zinc-800 space-y-2">
        <button
          onClick={onOpenSettings}
          className="w-full py-2.5 px-4 bg-zinc-800/50 hover:bg-zinc-800 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors active:scale-95"
        >
          <Zap className="w-4 h-4" /> API Settings
        </button>
        <button
          onClick={onOpenWorkforce}
          className="w-full py-2.5 px-4 bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors active:scale-95"
        >
          <Sparkles className="w-4 h-4" /> Workforce
        </button>
      </div>
    </aside>
  );
}
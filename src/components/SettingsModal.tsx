import { X, Key, Zap, Loader2 } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  minimaxApiKey: string;
  elevenlabsApiKey: string;
  onMinimaxKeyChange: (key: string) => void;
  onElevenlabsKeyChange: (key: string) => void;
  onSave: () => void;
  isConnecting: boolean;
}

export function SettingsModal({
  isOpen,
  onClose,
  minimaxApiKey,
  elevenlabsApiKey,
  onMinimaxKeyChange,
  onElevenlabsKeyChange,
  onSave,
  isConnecting,
}: SettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-zinc-800">
          <h2 className="text-lg font-semibold">API Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4" /> MiniMax API Key
              </div>
            </label>
            <input
              type="password"
              value={minimaxApiKey}
              onChange={(e) => onMinimaxKeyChange(e.target.value)}
              placeholder="Enter your MiniMax API key"
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
            />
            <p className="text-xs text-zinc-500 mt-1">
              Get your API key from MiniMax dashboard
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4" /> ElevenLabs API Key
              </div>
            </label>
            <input
              type="password"
              value={elevenlabsApiKey}
              onChange={(e) => onElevenlabsKeyChange(e.target.value)}
              placeholder="Enter your ElevenLabs API key"
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
            />
            <p className="text-xs text-zinc-500 mt-1">
              Get your API key from ElevenLabs dashboard
            </p>
          </div>

          <button
            onClick={onSave}
            disabled={isConnecting}
            className="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:bg-zinc-700 disabled:cursor-not-allowed rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
          >
            {isConnecting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Connecting...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" /> Save & Connect
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
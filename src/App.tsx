import { useState, useEffect, useRef, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { WelcomeScreen } from './components/WelcomeScreen';
import { MessageList } from './components/MessageList';
import { InputArea } from './components/InputArea';
import { SettingsModal } from './components/SettingsModal';
import { supabase, getConversations, getMessages, saveMessage, createConversation } from './lib/supabase';
import { minimaxClient } from './lib/minimax';
import { elevenlabsClient, DEFAULT_VOICES } from './lib/elevenlabs';
import type { Message, Conversation, Voice, ElevenLabsSettings } from './types';

const DEFAULT_VOICE_SETTINGS: ElevenLabsSettings = {
  voiceId: '21m00TScm4G4t8A4LkDy',
  model: 'eleven_v3',
  stability: 0.5,
  similarity: 0.75,
  style: 0.5,
  speakerBoost: true,
};

function generateId() {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

export default function App() {
  // State
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const [voices, setVoices] = useState<Voice[]>(DEFAULT_VOICES);
  const [selectedVoiceId, setSelectedVoiceId] = useState('21m00TScm4G4t8A4LkDy');
  const [voiceSettings, setVoiceSettings] = useState<ElevenLabsSettings>(DEFAULT_VOICE_SETTINGS);

  const [minimaxApiKey, setMinimaxApiKey] = useState('');
  const [elevenlabsApiKey, setElevenlabsApiKey] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load saved API keys
  useEffect(() => {
    const savedMinimaxKey = localStorage.getItem('minimax_api_key');
    const savedElevenlabsKey = localStorage.getItem('elevenlabs_api_key');

    if (savedMinimaxKey) {
      setMinimaxApiKey(savedMinimaxKey);
      minimaxClient.setApiKey(savedMinimaxKey);
    }

    if (savedElevenlabsKey) {
      setElevenlabsApiKey(savedElevenlabsKey);
      elevenlabsClient.setApiKey(savedElevenlabsKey);
      loadVoices(savedElevenlabsKey);
    }

    loadConversations();
  }, []);

  const loadVoices = async (apiKey: string) => {
    elevenlabsClient.setApiKey(apiKey);
    const voiceList = await elevenlabsClient.getVoices();
    setVoices(voiceList.length > 0 ? voiceList : DEFAULT_VOICES);
  };

  const loadConversations = async () => {
    const convos = await getConversations();
    const mappedConversations: Conversation[] = convos.map(c => ({
      id: c.id,
      title: c.title,
      createdAt: new Date(c.created_at),
      updatedAt: new Date(c.updated_at),
      messages: [],
    }));
    setConversations(mappedConversations);
    setIsConnected(true);
  };

  const handleSaveSettings = useCallback(async () => {
    setIsConnecting(true);

    localStorage.setItem('minimax_api_key', minimaxApiKey);
    localStorage.setItem('elevenlabs_api_key', elevenlabsApiKey);

    minimaxClient.setApiKey(minimaxApiKey);
    elevenlabsClient.setApiKey(elevenlabsApiKey);

    if (elevenlabsApiKey) {
      await loadVoices(elevenlabsApiKey);
    }

    await loadConversations();

    setIsConnecting(false);
    setIsConnected(true);
    setShowSettings(false);
  }, [minimaxApiKey, elevenlabsApiKey]);

  const handleNewConversation = async () => {
    const newConv: Conversation = {
      id: generateId(),
      title: 'New Chat',
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [],
    };

    setConversations(prev => [newConv, ...prev]);
    setCurrentConversation(newConv);
    setMessages([]);
    setInputText('');

    if (supabase) {
      const saved = await createConversation('New Chat');
      if (saved) {
        newConv.id = saved.id;
      }
    }
  };

  const handleSelectConversation = async (conversation: Conversation) => {
    setCurrentConversation(conversation);

    if (supabase) {
      const msgs = await getMessages(conversation.id);
      setMessages(
        msgs.map(m => ({
          id: m.id,
          role: m.role,
          content: m.content,
          audioUrl: m.audio_url || undefined,
          timestamp: new Date(m.created_at),
        }))
      );
    } else {
      setMessages(conversation.messages);
    }
  };

  const handleDeleteConversation = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (currentConversation?.id === id) {
      setCurrentConversation(null);
      setMessages([]);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isGenerating) return;

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsGenerating(true);

    try {
      const chatHistory = messages.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));

      chatHistory.push({ role: 'user', content: userMessage.content });

      const response = await minimaxClient.chat(chatHistory);

      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      if (elevenlabsApiKey && response) {
        const audioUrl = await elevenlabsClient.textToSpeech(response, selectedVoiceId, {
          model: voiceSettings.model,
          stability: voiceSettings.stability,
          similarity: voiceSettings.similarity,
          style: voiceSettings.style,
          speakerBoost: voiceSettings.speakerBoost,
        });
        if (audioUrl) {
          assistantMessage.audioUrl = audioUrl;
        }
      }

      setMessages(prev => [...prev, assistantMessage]);

      if (currentConversation && supabase) {
        await saveMessage(currentConversation.id, 'user', userMessage.content);
        await saveMessage(currentConversation.id, 'assistant', assistantMessage.content, assistantMessage.audioUrl);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePlayAudio = (url: string, msgId: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    if (playingAudioId === msgId) {
      setPlayingAudioId(null);
      return;
    }

    const audio = new Audio(url);
    audio.onended = () => setPlayingAudioId(null);
    audio.play();
    audioRef.current = audio;
    setPlayingAudioId(msgId);
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  // Recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = e => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
    setIsRecording(false);

    const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

    if (elevenlabsApiKey) {
      setIsGenerating(true);
      elevenlabsClient.speechToSpeech(blob, selectedVoiceId)
        .then(audioUrl => {
          const msg: Message = {
            id: generateId(),
            role: 'assistant',
            content: 'Voice conversion complete',
            audioUrl,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, msg]);
          if (audioUrl) {
            setPlayingAudioId(msg.id);
            const audio = new Audio(audioUrl);
            audio.onended = () => setPlayingAudioId(null);
            audio.play();
          }
        })
        .catch(console.error)
        .finally(() => setIsGenerating(false));
    }
  };

  return (
    <div className="h-screen flex bg-zinc-950 text-white overflow-hidden safe-area-container">
      {/* Mobile Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        conversations={conversations}
        currentConversation={currentConversation}
        onSelectConversation={(conv) => {
          handleSelectConversation(conv);
          if (isMobile) setSidebarOpen(false);
        }}
        onNewConversation={() => {
          handleNewConversation();
          if (isMobile) setSidebarOpen(false);
        }}
        onDeleteConversation={handleDeleteConversation}
        voices={voices}
        selectedVoiceId={selectedVoiceId}
        onVoiceSelect={setSelectedVoiceId}
        voiceSettings={voiceSettings}
        onVoiceSettingsChange={setVoiceSettings}
        isConnected={isConnected}
        onOpenSettings={() => setShowSettings(true)}
        isMobile={isMobile}
        sidebarOpen={sidebarOpen}
        onCloseSidebar={() => setSidebarOpen(false)}
      />

      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* Mobile Menu Button */}
        {isMobile && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="absolute top-4 left-4 z-30 p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg md:hidden"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

        <div className="flex-1 overflow-y-auto pt-16 md:pt-0">
          {messages.length === 0 ? (
            <WelcomeScreen onSendMessage={setInputText} />
          ) : (
            <MessageList
              messages={messages}
              isGenerating={isGenerating}
              playingAudioId={playingAudioId}
              onPlayAudio={handlePlayAudio}
              onCopyMessage={handleCopyMessage}
            />
          )}
        </div>

        <InputArea
          value={inputText}
          onChange={setInputText}
          onSend={handleSendMessage}
          isGenerating={isGenerating}
          isRecording={isRecording}
          onStartRecording={startRecording}
          onStopRecording={stopRecording}
        />
      </main>

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        minimaxApiKey={minimaxApiKey}
        elevenlabsApiKey={elevenlabsApiKey}
        onMinimaxKeyChange={setMinimaxApiKey}
        onElevenlabsKeyChange={setElevenlabsApiKey}
        onSave={handleSaveSettings}
        isConnecting={isConnecting}
      />
    </div>
  );
}
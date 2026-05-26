# Voice AI Chat

A powerful ChatGPT-style AI chat application with real-time voice synthesis, advanced skill capabilities, and enterprise-grade authentication built with React, Supabase, ElevenLabs, and MiniMax.

![Voice AI Chat](https://img.shields.io/badge/Version-2.0-blue) ![License](https://img.shields.io/badge/License-MIT-green) ![PWA](https://img.shields.io/badge/PWA-Ready-orange)

## Features

### Core Capabilities

- **AI Chat** - Intelligent conversations powered by MiniMax's advanced language model
- **Voice Synthesis** - Natural text-to-speech using ElevenLabs with 6 premium voices
- **Speech-to-Speech** - Real-time voice conversion with cloned voice output
- **Conversation History** - Persistent chat storage with Supabase backend
- **PWA Support** - Installable as a native app on desktop and mobile

### Advanced Skills System

The Workforce System provides specialized AI agents for different tasks:

| Skill | Description | Capabilities |
|-------|-------------|--------------|
| **Coding Expert** | Professional software development | Code generation, debugging, architecture design, code review |
| **Writing Assistant** | Content creation and editing | Articles, emails, creative writing, copywriting |
| **Chat Specialist** | Conversational AI | Customer service, mental health support, friendly chat |
| **Role Play** | Interactive scenarios | Training simulations, interviews, social practice |
| **Voice Cloning** | Custom voice synthesis | Create and use personalized synthetic voices |
| **Data Analyst** | Insight generation | Analytics, statistics, data visualization |

### Authentication & Security

- **Supabase Auth** - Secure email/password authentication
- **Row Level Security** - User data isolation and protection
- **Session Management** - Persistent login states
- **Guest Mode** - Try without account creation

### User Interface

- **ChatGPT-Style Design** - Modern, dark-themed interface
- **Responsive Layout** - Optimized for desktop and iPhone 17 Pro Max
- **Voice Selection** - Choose from 6 premium ElevenLabs voices
- **Custom Settings** - Adjust voice stability, similarity, and style
- **Mobile Optimized** - Swipe sidebar, safe area support, PWA-ready

### API Integrations

- **MiniMax** - Chat completion and streaming responses
- **ElevenLabs** - Premium text-to-speech and voice cloning
- **Supabase** - PostgreSQL database, auth, and realtime

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS |
| Backend | Supabase (PostgreSQL) |
| AI Model | MiniMax Text-01 |
| Voice AI | ElevenLabs API |
| PWA | Service Worker, Web App Manifest |
| Deployment | Vercel / Netlify / Static Hosting |

## Installation

### Prerequisites

- Node.js 18+ or pnpm
- Supabase account
- MiniMax API key
- ElevenLabs API key

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/RUSTYBM7/voice-ai-chat.git
cd voice-ai-chat
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Configure environment variables**
Create a `.env` file in the project root:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_MINIMAX_API_KEY=your_minimax_api_key
VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

4. **Set up Supabase database**
Run the SQL schema in Supabase SQL Editor:
```bash
# Open Supabase dashboard > SQL Editor > paste contents of supabase-schema.sql
```

5. **Start development server**
```bash
pnpm dev
```

## Database Schema

### Conversations Table
```sql
- id: UUID (Primary Key)
- user_id: UUID (FK to auth.users)
- title: TEXT
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

### Messages Table
```sql
- id: UUID (Primary Key)
- conversation_id: UUID (FK to conversations)
- role: TEXT ('user', 'assistant', 'system')
- content: TEXT
- audio_url: TEXT (nullable)
- created_at: TIMESTAMPTZ
```

## PWA Installation

### Desktop (Chrome, Edge, Firefox)
1. Click the **Install** icon in the address bar
2. Or click **"Install Voice AI Chat"** in the settings menu

### iOS (Safari)
1. Tap the **Share** button
2. Scroll down and tap **"Add to Home Screen"**
3. Tap **Add** to confirm

### Android (Chrome)
1. Tap the menu (⋮)
2. Tap **"Install app"** or **"Add to Home screen"**

## API Keys Setup

### MiniMax API
1. Visit [MiniMax Dashboard](https://platform.minimax.chat)
2. Create account or sign in
3. Navigate to API Keys section
4. Create new API key
5. Copy and paste into settings

### ElevenLabs API
1. Visit [ElevenLabs](https://elevenlabs.io)
2. Create account or sign in
3. Go to Profile > API Key
4. Copy your API key
5. Enter in application settings

### Supabase
1. Visit [Supabase](https://supabase.com)
2. Create new project
3. Go to Settings > API
4. Copy Project URL and public anon key
5. Run the database schema

## Usage Guide

### Basic Chat
1. Enter your API keys in Settings
2. Click "New Chat" to start
3. Type your message and press Enter
4. AI will respond with text and audio

### Voice Selection
1. Open the sidebar
2. Click the voice picker
3. Select from 6 premium voices
4. Adjust voice settings (stability, similarity, style)

### Recording Voice Messages
1. Click and hold the microphone button
2. Speak your message
3. Release to send
4. AI will respond with voice-cloned output

### Skills System
1. Access Workforce page from sidebar
2. Select specialized skill (Coding, Writing, etc.)
3. System automatically configures AI behavior
4. Enjoy enhanced responses for your use case

### Voice Cloning
1. Navigate to Voice Cloning section
2. Upload voice samples (2+ minutes recommended)
3. Create custom voice profile
4. Use cloned voice for synthesis

## Project Structure

```
voice-ai-chat/
├── public/
│   ├── manifest.json       # PWA manifest
│   ├── sw.js               # Service worker
│   └── *.xml               # iOS configurations
├── src/
│   ├── App.tsx             # Main application
│   ├── components/
│   │   ├── Sidebar.tsx    # Navigation sidebar
│   │   ├── WelcomeScreen.tsx
│   │   ├── MessageList.tsx
│   │   ├── InputArea.tsx
│   │   ├── SettingsModal.tsx
│   │   ├── LoginPage.tsx  # Authentication
│   │   └── Workforce.tsx   # Skills system
│   ├── lib/
│   │   ├── supabase.ts    # Database client
│   │   ├── minimax.ts     # MiniMax AI client
│   │   └── elevenlabs.ts  # Voice synthesis
│   └── types.ts           # TypeScript definitions
├── supabase-schema.sql    # Database schema
├── index.html              # Entry HTML
└── package.json
```

## Deployment

### Build for Production
```bash
pnpm build
```

Output will be in the `dist/` directory.

### Deploy Options

**Vercel**
```bash
npx vercel --prod
```

**Netlify**
```bash
netlify deploy --prod --dir dist
```

**GitHub Pages**
1-way configuration in `vite.config.ts`:
```ts
export default defineConfig({
  base: '/voice-ai-chat/',
  build: { outDir: 'dist' }
});
```

## Advanced Configuration

### Voice Settings
```typescript
{
  voiceId: '21m00TScm4G4t8A4LkDy',
  model: 'eleven_v3',
  stability: 0.5,        // 0-1, voice consistency
  similarity: 0.75,      // 0-1, voice mimicking
  style: 0.5,           // 0-1, emotional range
  speakerBoost: true     // speaker clarity
}
```

### Supabase RLS Policies
- Users can only access their own conversations
- Messages inherit conversation access
- Guest users can create but not view others' data

### MiniMax Model Options
- **MiniMax-Text-01** - Latest flagship model
- Streaming support enabled
- Context window: 100K tokens

## Troubleshooting

### Common Issues

**"API key not working"**
- Verify key format matches expected pattern
- Check key is active in provider dashboard
- Ensure no whitespace in env variables

**"Voice not playing"**
- Confirm ElevenLabs API key is set
- Check browser audio permissions
- Verify CORS settings on production

**"Database connection failed"**
- Verify Supabase URL format
- Check anon key is valid
- Confirm RLS policies allow access

**"PWA not installing"**
- Ensure HTTPS on production
- Check manifest.json validity
- Verify service worker registered

## License

This project is licensed under the MIT License - see [LICENSE](LICENSE) for details.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request

## Acknowledgments

- [MiniMax](https://minimax.chat) - AI Language Model
- [ElevenLabs](https://elevenlabs.io) - Voice Synthesis
- [Supabase](https://supabase.com) - Backend Infrastructure
- [Tailwind CSS](https://tailwindcss.com) - Styling Framework
- [Lucide](https://lucide.dev) - Icon Library

---

Built with passion for voice-enabled AI interactions

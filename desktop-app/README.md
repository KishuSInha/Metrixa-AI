# Metrixa AI Desktop App

AI-powered screen analysis assistant for macOS.

## Features

- 🎯 **Screen Analysis**: Captures your screen every 3 seconds
- 🤖 **AI Suggestions**: GPT-4 Vision analyzes and provides actionable tips
- ⌨️ **Global Hotkey**: Press `⌘+K` to summon the assistant
- 🔒 **Privacy-First**: Local processing with encrypted API calls
- 💨 **Lightweight**: Minimal resource usage

## Installation

1. Download `Metrixa-AI.dmg` from the website
2. Drag to Applications folder
3. Open the app
4. Grant Screen Recording permission when prompted
5. Enter your OpenAI API key in settings

## Usage

- **Summon Assistant**: Press `⌘+K` anywhere
- **Manual Analysis**: Click "Analyze Now" button
- **Settings**: Click "Settings" to configure API key

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for macOS
npm run build

# Create DMG installer
npm run build:dmg
```

## Requirements

- macOS 10.15 or later
- OpenAI API key
- Screen Recording permission

## Privacy

- All screen captures are processed in real-time
- No data is stored locally
- API calls are encrypted
- You control when analysis happens

## License

MIT

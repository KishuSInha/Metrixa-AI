# Metrixa AI - Productivity Tracking System

## 🚀 What's New

Metrixa AI has been transformed into a comprehensive productivity tracking system with:

- **Automatic Screenshot Capture**: Captures your screen every 5-10 seconds with smart battery-aware intervals
- **Intelligent OCR**: Extracts text from screenshots using macOS Vision (fast) or Tesseract (fallback)
- **Context Building**: Automatically groups your work into sessions (Email, Browser, Documents, Communication, etc.)
- **AI-Powered Insights**: Generates daily summaries, email digests, and extracts tasks from your activity
- **Privacy-First**: All data stored locally with encryption, you control what's monitored

## 📦 Installation

```bash
cd desktop-app
npm install
npm start
```

## 🎯 MVP Features

### 1. Daily Work Summary
Get an AI-generated summary of your day:
```javascript
// In renderer process
const summary = await window.electronAPI.getDailySummary();
console.log(summary.summary); // "Today you worked on emails (2h), design doc (1.5h), code review (45m)"
```

### 2. Email Digest
See who emailed you and what needs replies:
```javascript
const digest = await window.electronAPI.getEmailDigest();
console.log(digest.needsReply); // List of emails needing response
```

### 3. Task Extraction
Automatically extract tasks from your screen activity:
```javascript
const tasks = await window.electronAPI.extractTasksFromActivity();
// Returns: [{ description: "Reply to John", priority: "high", source: "email" }, ...]
```

### 4. Search
Search across all captured data:
```javascript
// Simple search
const results = await window.electronAPI.search("project proposal");

// Natural language search
const results = await window.electronAPI.naturalLanguageSearch("What was I doing yesterday afternoon?");
```

## 🔧 Configuration

### Monitoring Controls

```javascript
// Start monitoring
window.electronAPI.startMonitoring();

// Stop monitoring
window.electronAPI.stopMonitoring();

// Pause (temporary)
window.electronAPI.pauseMonitoring();

// Resume
window.electronAPI.resumeMonitoring();

// Set capture interval (milliseconds)
window.electronAPI.setCaptureInterval(15000); // 15 seconds

// Exclude apps from monitoring
window.electronAPI.addExcludedApp("1Password");
window.electronAPI.removeExcludedApp("1Password");
```

### Privacy Settings

By default, Metrixa:
- Stores all data locally in SQLite
- Encrypts sensitive text
- Never uploads screenshots to the cloud
- Allows you to exclude specific apps
- Auto-deletes data older than 30 days (configurable)

## 🗄️ Database Schema

Data is stored in `~/Library/Application Support/Metrixa AI/metrixa.db`:

- **screenshots**: Metadata about captured screens
- **extracted_text**: OCR results
- **sessions**: Work sessions grouped by context
- **tasks**: Extracted and manual tasks
- **settings**: User preferences

## 🧠 AI Integration

Metrixa uses a hybrid AI approach:

- **Local (Ollama)**: For classification, OCR cleanup, simple summaries
- **Cloud (Optional)**: For deep analysis and complex summaries

Currently only Ollama is implemented. To use:

1. Install Ollama: `brew install ollama`
2. Pull the model: `ollama pull llava`
3. Ollama will auto-start when needed

## 🔐 Permissions

On macOS, Metrixa requires:

1. **Screen Recording**: To capture screenshots
2. **Accessibility** (optional): For GUI automation features

The app will prompt for these on first run. You can also grant them manually:
- System Preferences → Security & Privacy → Privacy → Screen Recording
- System Preferences → Security & Privacy → Privacy → Accessibility

## 📊 Performance

- **CPU Usage**: < 5% average
- **Memory**: ~150MB
- **Battery Impact**: Minimal with smart intervals
- **Storage**: ~50MB per day of captured data

## 🛠️ Development

### Project Structure

```
desktop-app/
├── src/
│   ├── core/
│   │   ├── monitor.js          # Main monitoring service
│   │   └── permissions.js      # Permission handling
│   ├── storage/
│   │   └── database.js         # SQLite wrapper
│   ├── ai/
│   │   ├── llm-router.js       # LLM routing logic
│   │   ├── summarizer.js       # Summary generation
│   │   └── task-extractor.js   # Task extraction
│   ├── features/
│   │   ├── daily-summary.js    # Daily summary feature
│   │   ├── email-digest.js     # Email digest feature
│   │   ├── task-list.js        # Task management
│   │   └── search.js           # Search functionality
│   └── ipc-handlers.js         # IPC communication
├── main.js                     # Electron main process
└── package.json
```

### Adding New Features

1. Create feature module in `src/features/`
2. Add IPC handlers in `src/ipc-handlers.js`
3. Expose API in `preload.js`
4. Use in renderer process

## 🐛 Troubleshooting

### OCR Not Working
- Ensure Tesseract is installed: `npm install tesseract.js`
- Check console for OCR errors
- Try reducing screenshot resolution

### Monitoring Not Starting
- Check screen recording permission
- Verify Ollama is running: `ollama list`
- Check console for errors

### High CPU Usage
- Increase capture interval
- Reduce screenshot resolution
- Check for OCR worker leaks

## 🚀 Next Steps

See `implementation_plan.md` for the full roadmap. Upcoming features:

- Proactive notifications ("You missed replying to this email")
- Weekly productivity reports
- Context-switching analysis
- Meeting auto-notes
- Calendar + email intelligence

## 📝 License

MIT

## 🤝 Contributing

This is a work in progress. Feel free to open issues or submit PRs!

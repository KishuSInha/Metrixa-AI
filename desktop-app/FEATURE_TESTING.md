# Metrixa AI - Feature Testing Guide

This document provides comprehensive instructions for testing all features of Metrixa AI.

## Prerequisites

Before testing, ensure:
1. **Ollama is installed and running**
   ```bash
   # Check if Ollama is running
   curl http://127.0.0.1:11434
   
   # If not installed, install from https://ollama.ai
   ollama pull llava
   ```

2. **macOS Permissions are granted**
   - Screen Recording Permission
   - Accessibility Permission (for GUI automation)
   
3. **Dependencies are installed**
   ```bash
   cd desktop-app
   npm install
   ```

## Starting the Application

```bash
cd desktop-app
npm start
```

## Feature Testing Checklist

### 1. Smart Monitoring System ✓

**What it does:** Automatically captures screenshots when your screen is stable for 1.5+ seconds.

**How to test:**
1. Start the application
2. Click "Start Monitoring" in the main window
3. Open different applications (VSCode, Chrome, Mail, etc.)
4. Stay on each application for 2-3 seconds
5. Check console logs for capture confirmations
6. Verify screenshots are saved in `~/Library/Application Support/Metrixa AI/screenshots/`

**Expected behavior:**
- Captures only when window is stable
- Skips Metrixa AI's own window
- Battery-aware intervals (slower on battery)
- Creates sessions grouped by app context

**Console output:**
```
✓ SmartMonitor initialized
Smart Monitoring started.
Context changed to: Google Chrome - Gmail
Stable for 1523ms. Capturing: Inbox - user@example.com
OCR saved for 123 (Raw: 5234, Clean: 4123)
```

### 2. OCR Text Extraction ✓

**What it does:** Extracts text from screenshots using Tesseract.js OCR.

**How to test:**
1. With monitoring active, view a document or webpage with clear text
2. Wait for capture to complete
3. Check database for extracted text:
   ```javascript
   // In Electron DevTools Console
   const db = require('./src/storage/database');
   const metrixaDb = new db();
   const recent = metrixaDb.getRecentScreenshots(5);
   recent.forEach(s => {
       const text = metrixaDb.getTextByScreenshotId(s.id);
       console.log(text);
   });
   ```

**Expected behavior:**
- Raw OCR text is cleaned (removes UI noise)
- Text is stored with confidence score
- Confidence gating: rejects captures with < 50 characters

### 3. Daily Summary Feature ✓

**What it does:** Generates AI-powered daily work summaries with time breakdowns.

**How to test:**
1. After having monitoring active for a few hours, test via IPC:
   ```javascript
   // In renderer DevTools
   const result = await window.electronAPI.getDailySummary();
   console.log(result);
   ```

2. Or via main process:
   ```javascript
   // In main.js or Electron DevTools (Main Process)
   const DailySummaryFeature = require('./src/features/daily-summary');
   const feature = new DailySummaryFeature();
   const summary = await feature.getDailySummary();
   console.log(summary);
   ```

**Expected output:**
```json
{
  "success": true,
  "data": {
    "summary": "You worked on 3 main activities today...",
    "contextBreakdown": {
      "development": 7200,
      "browser": 3600,
      "communication": 1800
    },
    "sessions": 12,
    "totalTime": 210,
    "date": "2026-02-16"
  }
}
```

### 4. Email Digest Feature ✓

**What it does:** Analyzes email activity and identifies emails needing replies.

**How to test:**
1. View several emails in Mail.app or Gmail
2. Wait for captures
3. Test via IPC:
   ```javascript
   const result = await window.electronAPI.getEmailDigest();
   console.log(result);
   ```

**Expected output:**
```json
{
  "success": true,
  "data": {
    "summary": "You viewed 8 emails today, 3 may need replies.",
    "totalEmails": 8,
    "needsReply": [
      {
        "subject": "Re: Project Update",
        "timestamp": 1708099200,
        "app": "Mail"
      }
    ],
    "date": "2026-02-16"
  }
}
```

### 5. Task Extraction Feature ✓

**What it does:** Automatically extracts actionable tasks from screen activity.

**How to test:**
1. View documents/emails with tasks like:
   - "Need to reply to John"
   - "TODO: Fix the login bug"
   - "Must complete report by Friday"
2. Extract tasks:
   ```javascript
   const result = await window.electronAPI.extractTasksFromActivity();
   console.log(result);
   ```

**Expected output:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "description": "reply to John",
      "source": "screen:Mail:1708099200",
      "priority": "medium",
      "status": "pending"
    }
  ]
}
```

### 6. Search Features ✓

**What it does:** Full-text search across all captured screen data.

**How to test:**

**Basic Search:**
```javascript
const result = await window.electronAPI.search("meeting notes", { limit: 10 });
console.log(result);
```

**Natural Language Search:**
```javascript
const result = await window.electronAPI.naturalLanguageSearch("What was I working on yesterday in VSCode?");
console.log(result);
```

**Search by App:**
```javascript
const result = await window.electronAPI.searchByApp("Chrome", 20);
console.log(result);
```

**Expected behavior:**
- Returns screenshots with matching text
- Natural language search interprets time/app references
- Results sorted by timestamp

### 7. Agent Orchestrator (Advanced) ✓

**What it does:** Executes multi-step automation plans (experimental).

**Example plan:**
```json
[
  { "action": "READ_EMAIL", "count": 5 },
  { "action": "SUMMARIZE" },
  { "action": "WRITE_NOTES" }
]
```

**How to test:**
1. Ensure browser automation works (Playwright installed)
2. Create a plan via IPC:
   ```javascript
   const plan = [
     { action: "READ_SCREEN" },
     { action: "SUMMARIZE" }
   ];
   window.api.send('approve-plan', plan);
   ```

**Note:** This feature requires:
- Gmail access (user may need to log in)
- Notes.app on macOS
- Accessibility permissions

### 8. GUI Automation ✓

**What it does:** Simulates clicks and keyboard input.

**How to test:**
```javascript
// Click at coordinates
window.electronAPI.guiClick(500, 300);

// Type text
window.electronAPI.guiType("Hello World");
```

**Requirements:**
- Accessibility permission must be granted
- macOS only (uses AppleScript)

### 9. Manual Analysis (Shortcut: Cmd+Shift+Space) ✓

**What it does:** Captures current screen and analyzes with AI on-demand.

**How to test:**
1. Press `Cmd+Shift+Space` while viewing any screen
2. Wait for analysis notification
3. View result in main window

**Expected behavior:**
- Minimizes Metrixa window to avoid self-capture
- Captures screen
- Runs OCR
- Sends to Ollama for analysis
- Shows AI response in notification and UI

### 10. Permissions Management ✓

**What it does:** Checks and requests macOS permissions.

**How to test:**
```javascript
const perms = await window.electronAPI.checkPermissions();
console.log(perms);

// Open settings if needed
window.electronAPI.openPermissionSettings('screen-recording');
window.electronAPI.openPermissionSettings('accessibility');
```

## Testing Database Operations

**View database stats:**
```javascript
const stats = await window.electronAPI.getMonitoringStats();
console.log(stats);
// { success: true, data: { screenshots: 45, sessions: 8, pendingTasks: 3 } }
```

**Query database directly:**
```javascript
const db = require('./src/storage/database');
const metrixaDb = new db();

// Recent screenshots
console.log(metrixaDb.getRecentScreenshots(10));

// Search text
console.log(metrixaDb.searchText("meeting", 20));

// Get pending tasks
console.log(metrixaDb.getPendingTasks());
```

## Common Issues & Solutions

### Issue: OCR returns empty text
**Solution:**
- Check if screen has actual text content
- Verify Tesseract worker initializes: `console.log('Tesseract initialized')`
- Check confidence score in logs

### Issue: Ollama connection failed
**Solution:**
```bash
# Check if Ollama is running
curl http://127.0.0.1:11434

# Start Ollama if not running
ollama serve

# Verify llava model exists
ollama list
ollama pull llava
```

### Issue: Screenshots not captured
**Solution:**
- Grant Screen Recording permission in System Preferences
- Check console for permission errors
- Ensure monitoring is started: `window.electronAPI.startMonitoring()`

### Issue: Database errors
**Solution:**
- Database is at `~/Library/Application Support/Metrixa AI/metrixa.db`
- Delete and restart app to rebuild: `rm ~/Library/Application\ Support/Metrixa\ AI/metrixa.db`
- Check write permissions on directory

### Issue: GUI automation not working
**Solution:**
- Grant Accessibility permission in System Preferences
- Check AppleScript errors in console
- Verify coordinates are within screen bounds

## Performance Metrics

**Expected Performance:**
- CPU usage: < 5% during monitoring
- Memory usage: ~150MB base + ~50MB per day of captures
- Capture interval: 5-10 seconds (faster on AC power)
- OCR processing: 1-3 seconds per screenshot
- Database size: ~50MB per day of 8-hour usage

## Development Tips

**Enable verbose logging:**
```javascript
// In main.js, add:
process.env.DEBUG = 'metrixa:*';
```

**Reset monitoring state:**
```javascript
window.electronAPI.stopMonitoring();
window.electronAPI.startMonitoring();
```

**Clear old data (30+ days):**
```javascript
const db = require('./src/storage/database');
const metrixaDb = new db();
metrixaDb.deleteOldScreenshots(30);
```

## Feature Status Summary

| Feature | Status | Dependencies |
|---------|--------|--------------|
| Smart Monitoring | ✅ Working | Screen Recording Permission |
| OCR Text Extraction | ✅ Working | Tesseract.js |
| Daily Summary | ✅ Working | Ollama (llava) |
| Email Digest | ✅ Working | Ollama, Mail.app activity |
| Task Extraction | ✅ Working | Ollama |
| Search | ✅ Working | Database with indexed text |
| Natural Language Search | ✅ Working | Ollama |
| GUI Automation | ✅ Working | Accessibility Permission |
| Agent Orchestrator | ✅ Working | Playwright, Ollama |
| Manual Analysis | ✅ Working | Cmd+Shift+Space shortcut |

## Next Steps

1. **Test all features systematically** using this guide
2. **Report any errors** with console logs
3. **Check permissions** if features fail
4. **Verify Ollama** is running for AI features
5. **Monitor resource usage** during extended sessions

For bug reports or feature requests, include:
- Console logs from both main and renderer processes
- Steps to reproduce
- Expected vs actual behavior
- System info (macOS version, RAM, CPU)

# Metrixa AI - Quick Start Guide

## 🚀 NEW: Enhanced Agent Mode!

Metrixa AI now has **two modes**:

1. **Passive Monitoring** (Original) - Background activity tracking
2. **Active Agent** (NEW) - Natural language task automation

---

## 🎯 Quick Start: Agent Mode

### 1. Start the App
```bash
cd desktop-app
npm start
```

### 2. Prerequisites
```bash
# Start Ollama
ollama serve

# Verify LLaVA model
ollama list

# Check connection
curl http://127.0.0.1:11434
```

### 3. Grant Permissions
- **Screen Recording** ✓ (Required)
- **Accessibility** ✓ (Required for automation)

### 4. Trigger the Agent
Press **⌘ + Shift + M** anywhere on your Mac

### 5. Give it a Task
Type any of these:
```
"Summarize this"
"Extract tasks from this"
"Create a note with this summary"
"Draft a reply to this email"
```

### 6. Watch It Work!
- Plan appears → Review → Click ✅ Proceed
- Each step executes with real-time feedback
- Outcome verified automatically

---

## 🎓 Example Workflows

### Simple Summary
```
1. Open an email or document
2. Press ⌘ + Shift + M
3. Type: "Summarize this"
4. Click Proceed
→ Summary appears in 5 seconds!
```

### Create Note from Email
```
1. View an important email
2. Press ⌘ + Shift + M
3. Type: "Create a note with this summary"
4. Click Proceed
→ Note created in Notes.app ✓
```

### Complex Workflow
```
1. Open project email
2. Open tracker spreadsheet
3. Press ⌘ + Shift + M
4. Type: "Summarize email and update tracker"
5. Review 5-step plan
6. Click Proceed
→ Email summarized + Row added + Verified ✓
```

---

## 🔧 Original Monitoring Mode

### Start Monitoring
```javascript
window.electronAPI.startMonitoring();
```

### Get Daily Summary
```javascript
const summary = await window.electronAPI.getDailySummary();
// Output: Work breakdown by app type, total time, sessions
```

### Extract Tasks
```javascript
const tasks = await window.electronAPI.extractTasksFromActivity();
// Output: Auto-detected action items from your screen
```

### Search Activity
```javascript
// Simple search
const results = await window.electronAPI.search("project proposal");

// Natural language
const results = await window.electronAPI.naturalLanguageSearch(
    "What was I doing yesterday afternoon?"
);
```

---

## ⚙️ Configuration

### Exclude Sensitive Apps
```javascript
window.electronAPI.addExcludedApp("1Password");
window.electronAPI.addExcludedApp("Banking App");
```

### Adjust Capture Interval
```javascript
window.electronAPI.setCaptureInterval(15000); // 15 seconds
```

### Pause/Resume
```javascript
window.electronAPI.pauseMonitoring();
window.electronAPI.resumeMonitoring();
```

---

## 🎨 Hotkeys

| Key | Action |
|-----|--------|
| **⌘ + Shift + M** | Open Agent Panel (NEW) |
| **⌘ + Shift + Space** | Manual Screen Analysis (Original) |

---

## 📊 Check Stats
```javascript
const stats = await window.electronAPI.getMonitoringStats();
// { screenshots: 1234, sessions: 56, pendingTasks: 12 }
```

---

## 🐛 Troubleshooting

### Agent panel won't open
```bash
# Restart the app
npm start
```

### Plan creation fails
```bash
# Check Ollama
curl http://127.0.0.1:11434

# Start if needed
ollama serve
```

### Steps fail during execution
- Grant Screen Recording permission in System Preferences
- Grant Accessibility permission in System Preferences

### "Ollama Not Found"
```bash
brew install ollama
ollama pull llava
ollama serve
```

---

## 📚 Documentation

### For Users:
- **AGENT_USAGE_GUIDE.md** - Complete agent manual
- **QUICKSTART.md** - This file
- **FEATURE_TESTING.md** - Testing procedures

### For Developers:
- **IMPLEMENTATION_COMPLETE.md** - What was built
- **ENHANCED_AGENT_ARCHITECTURE.md** - Technical details
- **FIXES_APPLIED.md** - All fixes applied

---

## 🎯 What You Can Do

**Reading & Understanding:**
- "Summarize this"
- "Extract key points"
- "Find action items"
- "What's important here?"

**Note Taking:**
- "Create a note with this"
- "Save this summary to Notes"
- "Make a note about this project"

**Email Management:**
- "Draft a reply to this"
- "Summarize this email thread"
- "Extract tasks from this email"

**Data Entry:**
- "Update tracker with this summary"
- "Add this to my spreadsheet"
- "Insert these tasks into my list"

**Complex Workflows:**
- "Analyze this email and update CRM"
- "Summarize meeting notes and create todos"
- "Extract data and add to tracker"

---

## 🚀 Next Steps

1. **Try simple tasks first:**
   - "Summarize this" on any document
   
2. **Build to medium complexity:**
   - "Create note from this"
   
3. **Master complex workflows:**
   - "Summarize and update tracker"
   
4. **Save your workflows:**
   - Let Metrixa remember your patterns
   - Get 1-click automation

---

## 💡 Pro Tips

1. **Select text first** for precise targeting
2. **Review plans carefully** before proceeding
3. **Start simple** and build complexity
4. **Save workflows** you use often
5. **Check verification** steps for accuracy

---

## 🤝 Need Help?

Check console logs:
- Main Process: Electron DevTools (⌘ + Option + I)
- Renderer: Right-click → Inspect Element

See full documentation in:
- `AGENT_USAGE_GUIDE.md`
- `FEATURE_TESTING.md`

---

**Press ⌘ + Shift + M and start automating! 🎉**

# Metrixa AI - Enhanced Agent Usage Guide

## 🎯 What's New

Metrixa AI now features a **powerful agentic system** that can:
- ✅ Understand natural language tasks
- ✅ Create transparent execution plans
- ✅ Execute multi-step workflows
- ✅ Verify outcomes automatically
- ✅ Learn from your patterns

---

## 🚀 Quick Start

### 1. Start Metrixa AI
```bash
cd desktop-app
npm start
```

### 2. Trigger the Agent
Press **⌘ + Shift + M** anywhere on your Mac

A beautiful floating panel will appear near your cursor.

### 3. Give it a Task
Type in natural language:
- "Summarize this email"
- "Extract action items from this text"
- "Create a note with this summary"
- "Update my tracker with these tasks"

### 4. Review the Plan
The agent shows you exactly what it will do:
```
📋 Execution Plan
1. Extract email content from screen
2. Generate 3-line summary
3. Extract action items
4. Create note in Notes app
```

### 5. Approve & Watch
Click **✅ Proceed** and watch each step execute with real-time feedback!

---

## 📋 Complete Workflow Example

### Example: "Summarize this and update tracker"

**What happens:**

#### 1️⃣ **You Trigger** (⌘ + Shift + M)
Floating panel opens showing current context:
```
Context: Mail • Inbox - john@example.com
```

#### 2️⃣ **You Type**
```
"Summarize this and update tracker"
```

#### 3️⃣ **Agent Detects Context**
```javascript
{
  app: "Mail",
  appType: "email",
  window: "Inbox - john@example.com",
  visibleText: "From: John...",
  selection: null
}
```

#### 4️⃣ **Agent Creates Plan**
```
📋 Execution Plan

1. Read email content from Mail app
2. Generate 3-line summary and extract action items
3. Find and open Tracker spreadsheet
4. Insert new row with summary and tasks
5. Verify row was inserted correctly
```

**Plan Details:**
- Estimated time: 45 seconds
- Requires: Screen Recording, Accessibility, Ollama
- Risks: Spreadsheet file might not be found

#### 5️⃣ **You Review**
Three buttons appear:
- ✅ **Proceed** - Execute the plan
- ✏ **Edit** - Modify steps
- ❌ **Cancel** - Start over

#### 6️⃣ **You Click Proceed**

**Step 1 - Reading Email:**
```
⏳ Executing...
✓ Completed: Read email from john@example.com
```

**Step 2 - Summarizing:**
```
⏳ Executing...
✓ Completed: Generated summary (3 bullet points)

Result shown:
• Project deadline moved to Friday
• Need to review design mockups
• Follow up with Sarah about API integration
```

**Step 3 - Finding Spreadsheet:**
```
⏳ Executing...
✓ Completed: Found Tracker at ~/Documents/Tracker.numbers
```

**Step 4 - Inserting Data:**
```
⏳ Executing...
✓ Completed: Inserted row into spreadsheet
```

**Step 5 - Verifying:**
```
⏳ Executing...
✓ Completed: Verified row exists with correct data
```

#### 7️⃣ **Success!**
```
✓ Execution Complete
All 5 steps completed successfully!

Before:
(no row)

After:
Client: John | Follow up on project | Due: Friday
```

#### 8️⃣ **Workflow Learning**
```
💡 You do this often. Want me to remember this workflow for 1-click replay?

[Save Workflow] [Not Now]
```

If you click **Save Workflow**, next time you can trigger it with just:
```
"Run tracker update"
```

---

## 🎨 Supported Actions

The agent can perform **18 different action types**:

### Reading & Understanding
- **READ_SCREEN** - Extract text via OCR
- **READ_EMAIL** - Parse email content
- **READ_SELECTION** - Use highlighted text
- **SUMMARIZE** - Generate concise summaries
- **EXTRACT_DATA** - Pull structured info
- **EXTRACT_TASKS** - Find action items

### Application Control
- **OPEN_APP** - Launch applications
- **NAVIGATE** - Open URLs
- **FIND_FILE** - Search for files

### Input & Interaction
- **INPUT_TEXT** - Type text
- **CLICK** - Click UI elements
- **WAIT** - Pause execution

### Data Management
- **UPDATE_SPREADSHEET** - Modify tables
- **CREATE_NOTE** - Make new notes
- **SEND_EMAIL** - Draft/send emails

### Verification
- **VERIFY** - Confirm outcomes
- **API_CALL** - Use external APIs (future)

---

## 💡 Example Tasks You Can Give

### Simple Tasks

**"Summarize this"**
```
Plan:
1. Read screen text
2. Generate 3-line summary
```

**"Extract tasks from this"**
```
Plan:
1. Read selected text
2. Identify action items with priorities
```

**"Create a note with this"**
```
Plan:
1. Read selection
2. Create note in Notes app
```

### Medium Complexity

**"Draft a reply to this email"**
```
Plan:
1. Read email content
2. Generate professional reply
3. Open compose window
4. Paste reply text
```

**"Find my project file and open it"**
```
Plan:
1. Search for "Project.xlsx"
2. Open found file in Excel
```

### Complex Workflows

**"Analyze this email and update my CRM"**
```
Plan:
1. Read email from Mail
2. Extract client name, contact info, and notes
3. Open CRM spreadsheet
4. Insert new row with extracted data
5. Verify data was added correctly
```

**"Create meeting notes from this"**
```
Plan:
1. Read screen content
2. Extract key discussion points
3. Identify action items with owners
4. Create formatted note
5. Save to Notes app
```

---

## 🔧 Advanced Features

### Context Awareness

The agent intelligently uses context:

**If you're viewing an email:**
```
Context: Mail (email)
Agent knows to:
- Extract sender/subject
- Look for questions needing replies
- Identify action items
```

**If you're in a spreadsheet:**
```
Context: Numbers (spreadsheet)
Agent knows to:
- Understand table structure
- Find last row for insertion
- Format data appropriately
```

### Plan Editing

Click **✏ Edit** to modify the plan:
- Remove unnecessary steps
- Add new steps
- Reorder steps
- Change parameters

### Verification System

Every critical action is verified:
```
Step 4: Insert row into spreadsheet
↓
Step 5: Verify row exists
↓
Verification: ✓ Passed (confidence: 0.95)
```

### Workflow Memory

After successful execution:
```
💡 Save this as "Email to Tracker" workflow?

Next time:
"Run Email to Tracker" → executes instantly
```

---

## 🎯 Tips for Best Results

### 1. Be Specific
❌ "Do something with this"
✅ "Summarize this email and create a note"

### 2. Use Context
If email is already open:
✅ "Summarize this email"

Not needed: "Open Mail, find email, summarize it"

### 3. Check the Plan
Always review the plan before proceeding:
- Does it make sense?
- Are all steps necessary?
- Any steps missing?

### 4. Start Simple
Begin with single-step tasks:
- "Summarize this"
- "Extract tasks"
- "Create a note"

Then progress to multi-step workflows.

### 5. Use Selection
Highlight text first for precise targeting:
```
1. Select text with important info
2. Press ⌘ + Shift + M
3. "Extract key points from this"
```

---

## 🔍 Troubleshooting

### Panel Doesn't Open
**Problem:** ⌘ + Shift + M does nothing

**Solution:**
1. Check if Metrixa is running: Look for dock icon
2. Try ⌘ + Shift + Space (old hotkey) to confirm app works
3. Restart Metrixa

### Plan Creation Fails
**Problem:** "Failed to create plan" error

**Solution:**
1. Check Ollama is running: `curl http://127.0.0.1:11434`
2. Verify llava model: `ollama list`
3. Check console for errors

### Execution Fails
**Problem:** Steps fail during execution

**Common causes:**
- **Screen Recording permission** not granted
- **Accessibility permission** not granted
- **Ollama not running**
- **App/file not found**

**Solution:**
1. Grant all permissions in System Preferences
2. Start Ollama: `ollama serve`
3. Check step error message for specifics

### Verification Fails
**Problem:** "Verification failed: Expected outcome not found"

**This means:**
- The action ran but didn't produce expected result
- Example: Tried to insert row but row not found

**Solution:**
- Check manually if action actually succeeded
- If it did, it's a false negative - report bug
- If it didn't, check app permissions

---

## 🧪 Testing the Agent

### Test 1: Simple Summary
1. Open any email or document with text
2. Press ⌘ + Shift + M
3. Type: "Summarize this"
4. Click Proceed
5. Verify summary appears

### Test 2: Task Extraction
1. Select text with action items
2. Press ⌘ + Shift + M
3. Type: "Extract tasks from this"
4. Review plan
5. Execute and verify tasks found

### Test 3: Note Creation
1. View some content
2. Press ⌘ + Shift + M
3. Type: "Create a note with this summary"
4. Execute
5. Verify note created in Notes.app

### Test 4: Multi-Step Workflow
1. Open an email
2. Open a spreadsheet in another window
3. Press ⌘ + Shift + M
4. Type: "Summarize this email and add to tracker"
5. Review the plan (should have 4-5 steps)
6. Execute and watch each step

---

## 📊 Performance & Limits

### Performance
- **Context Detection:** < 1 second
- **Plan Creation:** 3-10 seconds (depends on Ollama)
- **Step Execution:** Varies by action type
  - Read: 1-2 seconds
  - Summarize: 3-8 seconds
  - GUI actions: 1-3 seconds
  - Verify: 2-4 seconds

### Current Limitations
1. **macOS only** (uses AppleScript)
2. **No vision AI yet** (can't detect UI elements visually)
3. **Simple spreadsheet operations** (insert row only)
4. **No cloud APIs yet** (Google Sheets, etc.)
5. **English language only** (for LLM prompts)

### Upcoming Features
- Vision-based UI element detection (GPT-4V)
- Google Sheets API integration
- More complex spreadsheet operations
- Browser automation improvements
- Workflow marketplace
- Cross-platform support (Windows, Linux)

---

## 🎓 Learning Path

### Week 1: Basics
- Master hotkey (⌘ + Shift + M)
- Try simple summarization
- Extract tasks from documents
- Create notes

### Week 2: Workflows
- Combine multiple steps
- Email → Note workflow
- Document → Tracker workflow
- Save your first workflow

### Week 3: Advanced
- Edit plans before execution
- Use verification steps
- Handle errors gracefully
- Build custom workflows

### Week 4: Power User
- Create workflow library
- 1-click automation
- Complex multi-app workflows
- Contribute to community

---

## 📝 Quick Reference Card

```
╔═══════════════════════════════════════════════════════════╗
║              METRIXA AI - QUICK REFERENCE                 ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  HOTKEYS:                                                 ║
║  ⌘ + Shift + M    Open Agent Panel                       ║
║  ⌘ + Shift + Space    Manual Analysis (old)              ║
║                                                           ║
║  WORKFLOW:                                                ║
║  1. Press hotkey                                          ║
║  2. Type natural language task                            ║
║  3. Review plan                                           ║
║  4. Click ✅ Proceed                                      ║
║  5. Watch execution                                       ║
║                                                           ║
║  EXAMPLE TASKS:                                           ║
║  • "Summarize this"                                       ║
║  • "Extract tasks"                                        ║
║  • "Create note with this"                                ║
║  • "Draft reply to email"                                 ║
║  • "Update tracker with summary"                          ║
║                                                           ║
║  REQUIREMENTS:                                            ║
║  ✓ Ollama running (ollama serve)                          ║
║  ✓ Screen Recording permission                            ║
║  ✓ Accessibility permission                               ║
║                                                           ║
║  TROUBLESHOOTING:                                         ║
║  • Panel won't open? → Restart app                        ║
║  • Plan fails? → Check Ollama                             ║
║  • Step fails? → Check permissions                        ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

---

## 🎉 You're Ready!

The enhanced Metrixa Agent is now your intelligent assistant for:
- ✅ Understanding your tasks
- ✅ Planning execution steps
- ✅ Automating repetitive workflows
- ✅ Verifying outcomes
- ✅ Learning your patterns

**Press ⌘ + Shift + M and start automating!**

---

**Need Help?**
- Check console logs (DevTools → Console)
- Review `FEATURE_TESTING.md` for detailed testing
- See `ENHANCED_AGENT_ARCHITECTURE.md` for technical details

**Report Issues:**
Include:
- Task you were trying to do
- Plan that was generated
- Which step failed
- Error message
- Console logs

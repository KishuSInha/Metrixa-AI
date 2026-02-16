# Metrixa AI - Enhanced Agentic Architecture Implementation Plan

## Vision Overview
Transform Metrixa from a passive monitoring tool into an **active AI agent** that can:
- Understand user intent from natural language
- Create transparent, verifiable action plans
- Execute multi-step workflows across applications
- Learn and remember user patterns
- Provide trustworthy, auditable automation

---

## Current State vs Target State

### Current Implementation ✅
- Passive screenshot monitoring
- OCR text extraction
- Basic AI analysis (on-demand via hotkey)
- Simple agent orchestrator (READ_EMAIL → SUMMARIZE → WRITE_NOTES)
- Database storage of captures

### Target Implementation 🎯
- **Hotkey activation** (⌘ + Shift + M) with floating UI
- **Context detection** (app, window, selection, screen region)
- **LLM-powered task planning** (convert intent → structured plan)
- **Trust layer** (show plan before execution, allow editing)
- **Step-by-step execution** with real-time feedback
- **Outcome verification** (confirm each step succeeded)
- **Workflow learning** (remember patterns, offer automation)
- **Timeline/audit log** (transparent history)

---

## Architecture Design

### Layer 1: UI Layer (Floating Panel)

#### Components to Build

**1. Floating Panel (Swift/Electron Overlay)**
```
Location: src/ui/floating-panel/
Files:
  - panel.html (minimal, draggable UI)
  - panel.css (glassmorphism, always-on-top)
  - panel.js (renderer logic)
```

**Design Specs:**
- Size: 400px × 200px (expandable to 400px × 600px)
- Position: Near cursor or screen center
- Style: Translucent, frameless, always-on-top
- Features:
  - Input field for natural language commands
  - Context preview (app, selection)
  - Plan display area
  - Action buttons (✅ Proceed, ✏ Edit, ❌ Cancel)
  - Progress indicator during execution
  - Results display

**2. Context Selection UI**
```
User flow:
1. No selection → Show dialog: "Use current window or select region?"
2. Options:
   - Current Window
   - Select Region (draw rectangle)
   - Full Screen
   - Selected Text
```

**3. Plan Editor**
```
Inline editing of AI-generated plan:
- Add/remove steps
- Edit step descriptions
- Reorder steps (drag-and-drop)
- Save as workflow template
```

---

### Layer 2: Context Detection Engine

#### Implementation: `src/context/context-detector.js`

```javascript
class ContextDetector {
    async detect() {
        return {
            app: await this.getActiveApp(),
            window: await this.getWindowInfo(),
            selection: await this.getSelectedText(),
            visibleText: await this.getScreenText(),
            region: await this.getScreenRegion(),
            timestamp: Date.now()
        };
    }

    async getActiveApp() {
        // Use active-win package (already installed)
        const window = await activeWin();
        return {
            name: window.owner.name,
            bundleId: window.owner.bundleId,
            title: window.title
        };
    }

    async getSelectedText() {
        // Use AppleScript to get clipboard or system selection
        const script = `
            tell application "System Events"
                keystroke "c" using command down
                delay 0.1
            end tell
            set the clipboard to (the clipboard as text)
        `;
        // Return selected text
    }

    async getScreenText(region = null) {
        // Use existing OCR from src/context/screen.js
        if (region) {
            // Crop to region before OCR
            return await this.getScreenTextInRegion(region);
        }
        return await getScreenText(this.mainWindow);
    }

    async getScreenRegion() {
        // Implement region selector
        // Return { x, y, width, height }
    }

    // Detect application type for smart context
    detectAppType(appName) {
        const types = {
            'Mail': 'email',
            'Gmail': 'email',
            'Outlook': 'email',
            'Chrome': 'browser',
            'Safari': 'browser',
            'Excel': 'spreadsheet',
            'Numbers': 'spreadsheet',
            'Google Sheets': 'spreadsheet',
            'VSCode': 'code',
            'Terminal': 'terminal',
            'Slack': 'communication',
            'Notes': 'notes'
        };
        
        for (const [key, type] of Object.entries(types)) {
            if (appName.includes(key)) return type;
        }
        return 'general';
    }
}

module.exports = ContextDetector;
```

**Dependencies:**
- ✅ active-win (already installed)
- ✅ screenshot-desktop (already installed)
- ✅ tesseract.js (already installed)
- Need: AppleScript for clipboard/selection

---

### Layer 3: Task Planning Engine

#### Implementation: `src/planning/task-planner.js`

```javascript
const LLMRouter = require('../ai/llm-router');

class TaskPlanner {
    constructor() {
        this.llm = new LLMRouter();
    }

    async createPlan(userIntent, context) {
        const prompt = this.buildPlanningPrompt(userIntent, context);
        const response = await this.llm.route(prompt, 'complex', {
            temperature: 0.3,
            maxTokens: 1000
        });

        return this.parsePlan(response);
    }

    buildPlanningPrompt(userIntent, context) {
        return `You are a task planning AI. Convert user intent into a structured action plan.

CONTEXT:
- App: ${context.app.name}
- Window: ${context.window.title}
- App Type: ${context.appType}
- Selected Text Length: ${context.selection?.length || 0} chars
- Visible Text Length: ${context.visibleText?.length || 0} chars

USER INTENT: "${userIntent}"

Create a detailed, step-by-step plan. Return ONLY valid JSON:

{
  "intent": "brief_description",
  "steps": [
    {
      "id": 1,
      "action": "action_type",
      "description": "What this step does",
      "requires": ["permission", "app"],
      "verifiable": true
    }
  ],
  "risks": ["potential issues"],
  "estimated_time": "30 seconds"
}

Valid action types:
- READ_SCREEN: Extract text from screen
- READ_EMAIL: Read email content
- READ_SELECTION: Use selected text
- SUMMARIZE: Generate summary
- EXTRACT_DATA: Pull specific data
- OPEN_APP: Launch application
- NAVIGATE: Go to URL or location
- INPUT_TEXT: Type text
- CLICK: Click UI element
- API_CALL: Use API (Google Sheets, etc.)
- VERIFY: Check outcome
- CREATE_FILE: Make new document
- UPDATE_SPREADSHEET: Modify table

Plan:`;
    }

    parsePlan(llmResponse) {
        // Extract JSON from response
        const jsonMatch = llmResponse.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('LLM did not return valid JSON plan');
        }

        const plan = JSON.parse(jsonMatch[0]);

        // Validate plan structure
        if (!plan.intent || !plan.steps || !Array.isArray(plan.steps)) {
            throw new Error('Invalid plan structure');
        }

        // Add metadata
        plan.created_at = Date.now();
        plan.status = 'pending_approval';

        return plan;
    }

    // Edit plan based on user feedback
    editPlan(plan, edits) {
        // Apply user modifications
        // { stepId: 2, action: 'remove' }
        // { stepId: 1, field: 'description', value: 'new desc' }
        // { action: 'reorder', newOrder: [1, 3, 2] }
        
        return modifiedPlan;
    }
}

module.exports = TaskPlanner;
```

**Example Plans:**

**Example 1: "Summarize this and update tracker"**
```json
{
  "intent": "summarize_email_and_update_spreadsheet",
  "steps": [
    {
      "id": 1,
      "action": "READ_EMAIL",
      "description": "Extract email content from Mail app",
      "requires": ["screen_recording"],
      "verifiable": true
    },
    {
      "id": 2,
      "action": "SUMMARIZE",
      "description": "Generate 3-line summary and extract action items",
      "requires": ["ollama"],
      "verifiable": true
    },
    {
      "id": 3,
      "action": "OPEN_APP",
      "description": "Open Numbers/Excel tracker spreadsheet",
      "requires": ["accessibility"],
      "verifiable": true,
      "params": { "app": "Numbers", "file": "Tracker" }
    },
    {
      "id": 4,
      "action": "UPDATE_SPREADSHEET",
      "description": "Insert new row with summary and action items",
      "requires": ["accessibility"],
      "verifiable": true,
      "params": { "table": "main", "operation": "insert_row" }
    },
    {
      "id": 5,
      "action": "VERIFY",
      "description": "Confirm row was inserted correctly",
      "requires": ["screen_recording"],
      "verifiable": true
    }
  ],
  "risks": [
    "Spreadsheet file might not be found",
    "Table structure might differ from expected"
  ],
  "estimated_time": "45 seconds"
}
```

**Example 2: "Draft reply to this email"**
```json
{
  "intent": "draft_email_reply",
  "steps": [
    {
      "id": 1,
      "action": "READ_EMAIL",
      "description": "Extract email content and metadata",
      "requires": ["screen_recording"],
      "verifiable": true
    },
    {
      "id": 2,
      "action": "GENERATE_REPLY",
      "description": "Create contextual reply based on email content",
      "requires": ["ollama"],
      "verifiable": true
    },
    {
      "id": 3,
      "action": "CLICK",
      "description": "Click Reply button in Mail",
      "requires": ["accessibility"],
      "verifiable": true,
      "params": { "target": "reply_button" }
    },
    {
      "id": 4,
      "action": "INPUT_TEXT",
      "description": "Paste generated reply into compose field",
      "requires": ["accessibility"],
      "verifiable": true
    }
  ],
  "risks": ["Reply button might not be detected"],
  "estimated_time": "20 seconds"
}
```

---

### Layer 4: Action Execution Engine

#### Enhanced Implementation: `src/execution/action-executor.js`

```javascript
const { guiClick, guiType } = require('../actions/gui');
const { getScreenText } = require('../context/screen');
const LLMRouter = require('../ai/llm-router');

class ActionExecutor {
    constructor(mainWindow) {
        this.mainWindow = mainWindow;
        this.llm = new LLMRouter();
        this.actionHandlers = this.initializeHandlers();
    }

    initializeHandlers() {
        return {
            'READ_SCREEN': this.readScreen.bind(this),
            'READ_EMAIL': this.readEmail.bind(this),
            'READ_SELECTION': this.readSelection.bind(this),
            'SUMMARIZE': this.summarize.bind(this),
            'EXTRACT_DATA': this.extractData.bind(this),
            'OPEN_APP': this.openApp.bind(this),
            'NAVIGATE': this.navigate.bind(this),
            'INPUT_TEXT': this.inputText.bind(this),
            'CLICK': this.clickElement.bind(this),
            'API_CALL': this.apiCall.bind(this),
            'VERIFY': this.verify.bind(this),
            'UPDATE_SPREADSHEET': this.updateSpreadsheet.bind(this),
            'GENERATE_REPLY': this.generateReply.bind(this)
        };
    }

    async executeStep(step, context, memory) {
        const handler = this.actionHandlers[step.action];
        
        if (!handler) {
            throw new Error(`Unknown action: ${step.action}`);
        }

        console.log(`[EXECUTOR] Executing step ${step.id}: ${step.description}`);
        
        // Notify UI of progress
        this.notifyProgress(step.id, 'executing');

        try {
            const result = await handler(step, context, memory);
            
            // Verify if step is verifiable
            if (step.verifiable) {
                const verified = await this.verifyStep(step, result);
                if (!verified) {
                    throw new Error(`Step ${step.id} verification failed`);
                }
            }

            this.notifyProgress(step.id, 'completed', result);
            return result;

        } catch (error) {
            this.notifyProgress(step.id, 'failed', { error: error.message });
            throw error;
        }
    }

    // Action Handlers

    async readScreen(step, context, memory) {
        return await getScreenText(this.mainWindow);
    }

    async readEmail(step, context, memory) {
        // Extract from context or read current email
        if (context.appType === 'email') {
            return context.visibleText;
        }
        throw new Error('Not viewing an email');
    }

    async readSelection(step, context, memory) {
        return context.selection;
    }

    async summarize(step, context, memory) {
        const text = memory.text || context.visibleText;
        const prompt = `Summarize the following in 3 concise bullet points:\n\n${text}`;
        return await this.llm.route(prompt, 'medium');
    }

    async extractData(step, context, memory) {
        const text = memory.text || context.visibleText;
        const prompt = `Extract structured data from: ${text}\nReturn JSON only.`;
        const response = await this.llm.route(prompt, 'medium');
        return JSON.parse(response);
    }

    async openApp(step, context, memory) {
        const { app, file } = step.params;
        
        // Use AppleScript to open app
        const script = file 
            ? `tell application "${app}" to open file "${file}"`
            : `tell application "${app}" to activate`;
        
        await this.runAppleScript(script);
        await this.wait(2000); // Wait for app to open
        
        return { app, opened: true };
    }

    async navigate(step, context, memory) {
        const { url } = step.params;
        // Open URL in default browser
        await this.runAppleScript(`open location "${url}"`);
        return { url, navigated: true };
    }

    async inputText(step, context, memory) {
        const text = step.params.text || memory.generatedText;
        await guiType(text);
        return { typed: text.length };
    }

    async clickElement(step, context, memory) {
        const { target, x, y } = step.params;
        
        if (x && y) {
            // Direct coordinates
            await guiClick(x, y);
        } else {
            // Find element by name (needs vision AI)
            const coords = await this.findElement(target, context);
            await guiClick(coords.x, coords.y);
        }
        
        return { clicked: true };
    }

    async findElement(target, context) {
        // Use vision AI to locate UI element
        // This is advanced - needs Claude or GPT-4V
        const screenImage = await this.captureScreen();
        const prompt = `Locate the "${target}" button/element in this screenshot. Return coordinates as JSON: {"x": 123, "y": 456}`;
        
        // Send to vision model
        // For now, throw error
        throw new Error('Vision-based element detection not yet implemented. Use manual coordinates.');
    }

    async apiCall(step, context, memory) {
        const { api, method, endpoint, data } = step.params;
        
        if (api === 'google_sheets') {
            return await this.googleSheetsAPI(method, endpoint, data);
        }
        
        throw new Error(`API ${api} not supported`);
    }

    async updateSpreadsheet(step, context, memory) {
        const { table, operation } = step.params;
        
        if (operation === 'insert_row') {
            // Extract data from memory
            const data = memory.extractedData || memory.summary;
            
            // Use GUI automation to insert row
            // 1. Focus on spreadsheet
            // 2. Navigate to end
            // 3. Type data
            // 4. Press Enter
            
            await guiClick(500, 300); // Click in spreadsheet
            await guiType('cmd+down'); // Go to last row
            await guiType('down'); // New row
            
            // Type data
            await guiType(JSON.stringify(data));
            await guiType('return');
            
            return { inserted: true };
        }
        
        throw new Error(`Operation ${operation} not supported`);
    }

    async generateReply(step, context, memory) {
        const email = memory.emailContent || context.visibleText;
        const prompt = `Draft a professional reply to this email:\n\n${email}\n\nReply:`;
        return await this.llm.route(prompt, 'medium');
    }

    async verify(step, context, memory) {
        // Re-read screen and compare with expected state
        const currentState = await getScreenText(this.mainWindow);
        
        // Use LLM to verify
        const prompt = `Verify if this state matches expectations:\n
Expected: ${step.params.expected}\n
Actual: ${currentState.text}\n
Return: {"verified": true/false, "reason": "..."}`;
        
        const response = await this.llm.route(prompt, 'simple');
        return JSON.parse(response);
    }

    async verifyStep(step, result) {
        // Generic verification
        if (!result) return false;
        if (typeof result === 'object' && result.error) return false;
        return true;
    }

    // Utility methods

    async runAppleScript(script) {
        const { exec } = require('child_process');
        return new Promise((resolve, reject) => {
            exec(`osascript -e '${script}'`, (error, stdout, stderr) => {
                if (error) reject(error);
                else resolve(stdout);
            });
        });
    }

    async wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    notifyProgress(stepId, status, data = {}) {
        if (this.mainWindow) {
            this.mainWindow.webContents.send('step-progress', {
                stepId,
                status,
                data,
                timestamp: Date.now()
            });
        }
    }
}

module.exports = ActionExecutor;
```

---

### Layer 5: Verification Engine

#### Implementation: `src/verification/outcome-verifier.js`

```javascript
const { getScreenText } = require('../context/screen');
const LLMRouter = require('../ai/llm-router');

class OutcomeVerifier {
    constructor(mainWindow) {
        this.mainWindow = mainWindow;
        this.llm = new LLMRouter();
    }

    async verifyOutcome(plan, executionResults) {
        const verifications = [];

        for (let i = 0; i < plan.steps.length; i++) {
            const step = plan.steps[i];
            const result = executionResults[i];

            if (step.verifiable) {
                const verification = await this.verifyStep(step, result);
                verifications.push(verification);

                if (!verification.passed) {
                    return {
                        success: false,
                        failedAt: step.id,
                        reason: verification.reason,
                        verifications
                    };
                }
            }
        }

        return {
            success: true,
            verifications,
            summary: this.generateSummary(verifications)
        };
    }

    async verifyStep(step, result) {
        // Capture current state
        const currentState = await this.captureState();

        // Use LLM to verify
        const prompt = `Verify if step "${step.description}" succeeded.

Step Action: ${step.action}
Expected Result: ${JSON.stringify(step.expected || 'success')}
Actual Result: ${JSON.stringify(result)}
Current State: ${JSON.stringify(currentState)}

Did the step succeed? Return JSON:
{"passed": true/false, "reason": "explanation", "confidence": 0.0-1.0}`;

        const response = await this.llm.route(prompt, 'simple', {
            temperature: 0.2
        });

        return JSON.parse(response);
    }

    async captureState() {
        const screenText = await getScreenText(this.mainWindow);
        const activeApp = await activeWin();
        
        return {
            screenText: screenText.text.substring(0, 1000),
            app: activeApp.owner.name,
            window: activeApp.title,
            timestamp: Date.now()
        };
    }

    generateSummary(verifications) {
        const passed = verifications.filter(v => v.passed).length;
        const total = verifications.length;
        const avgConfidence = verifications.reduce((sum, v) => sum + v.confidence, 0) / total;

        return {
            passed: `${passed}/${total}`,
            avgConfidence: avgConfidence.toFixed(2),
            allPassed: passed === total
        };
    }

    // Generate before/after diff
    async generateDiff(beforeState, afterState) {
        const prompt = `Compare before and after states and show what changed:

BEFORE:
${JSON.stringify(beforeState)}

AFTER:
${JSON.stringify(afterState)}

Show concise diff:`;

        return await this.llm.route(prompt, 'simple');
    }
}

module.exports = OutcomeVerifier;
```

---

### Layer 6: Timeline & Audit Log

#### Implementation: `src/timeline/execution-timeline.js`

```javascript
const MetrixaDatabase = require('../storage/database');

class ExecutionTimeline {
    constructor() {
        this.db = new MetrixaDatabase();
        this.initTimelineSchema();
    }

    initTimelineSchema() {
        this.db.db.exec(`
            CREATE TABLE IF NOT EXISTS executions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                intent TEXT NOT NULL,
                plan TEXT NOT NULL,
                status TEXT DEFAULT 'pending',
                started_at INTEGER NOT NULL,
                completed_at INTEGER,
                error TEXT
            );

            CREATE TABLE IF NOT EXISTS execution_steps (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                execution_id INTEGER,
                step_id INTEGER,
                action TEXT NOT NULL,
                description TEXT,
                status TEXT DEFAULT 'pending',
                started_at INTEGER,
                completed_at INTEGER,
                result TEXT,
                error TEXT,
                FOREIGN KEY (execution_id) REFERENCES executions(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS verifications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                execution_id INTEGER,
                step_id INTEGER,
                passed BOOLEAN,
                confidence REAL,
                reason TEXT,
                timestamp INTEGER,
                FOREIGN KEY (execution_id) REFERENCES executions(id) ON DELETE CASCADE
            );
        `);
    }

    startExecution(intent, plan) {
        const stmt = this.db.db.prepare(`
            INSERT INTO executions (intent, plan, status, started_at)
            VALUES (?, ?, ?, ?)
        `);
        
        const result = stmt.run(
            intent,
            JSON.stringify(plan),
            'running',
            Math.floor(Date.now() / 1000)
        );

        return result.lastInsertRowid;
    }

    logStepStart(executionId, step) {
        const stmt = this.db.db.prepare(`
            INSERT INTO execution_steps (execution_id, step_id, action, description, status, started_at)
            VALUES (?, ?, ?, ?, ?, ?)
        `);

        return stmt.run(
            executionId,
            step.id,
            step.action,
            step.description,
            'running',
            Math.floor(Date.now() / 1000)
        );
    }

    logStepComplete(executionId, stepId, result) {
        const stmt = this.db.db.prepare(`
            UPDATE execution_steps
            SET status = 'completed', completed_at = ?, result = ?
            WHERE execution_id = ? AND step_id = ?
        `);

        stmt.run(
            Math.floor(Date.now() / 1000),
            JSON.stringify(result),
            executionId,
            stepId
        );
    }

    logStepError(executionId, stepId, error) {
        const stmt = this.db.db.prepare(`
            UPDATE execution_steps
            SET status = 'failed', completed_at = ?, error = ?
            WHERE execution_id = ? AND step_id = ?
        `);

        stmt.run(
            Math.floor(Date.now() / 1000),
            error.message,
            executionId,
            stepId
        );
    }

    logVerification(executionId, stepId, verification) {
        const stmt = this.db.db.prepare(`
            INSERT INTO verifications (execution_id, step_id, passed, confidence, reason, timestamp)
            VALUES (?, ?, ?, ?, ?, ?)
        `);

        stmt.run(
            executionId,
            stepId,
            verification.passed ? 1 : 0,
            verification.confidence,
            verification.reason,
            Math.floor(Date.now() / 1000)
        );
    }

    completeExecution(executionId, status, error = null) {
        const stmt = this.db.db.prepare(`
            UPDATE executions
            SET status = ?, completed_at = ?, error = ?
            WHERE id = ?
        `);

        stmt.run(
            status,
            Math.floor(Date.now() / 1000),
            error,
            executionId
        );
    }

    getExecutionHistory(limit = 50) {
        const stmt = this.db.db.prepare(`
            SELECT * FROM executions
            ORDER BY started_at DESC
            LIMIT ?
        `);

        return stmt.all(limit);
    }

    getExecutionDetails(executionId) {
        const execution = this.db.db.prepare(`
            SELECT * FROM executions WHERE id = ?
        `).get(executionId);

        const steps = this.db.db.prepare(`
            SELECT * FROM execution_steps WHERE execution_id = ?
            ORDER BY step_id ASC
        `).all(executionId);

        const verifications = this.db.db.prepare(`
            SELECT * FROM verifications WHERE execution_id = ?
            ORDER BY step_id ASC
        `).all(executionId);

        return {
            execution,
            steps,
            verifications
        };
    }
}

module.exports = ExecutionTimeline;
```

---

### Layer 7: Workflow Learning & Memory

#### Implementation: `src/learning/workflow-memory.js`

```javascript
class WorkflowMemory {
    constructor() {
        this.db = new MetrixaDatabase();
        this.initWorkflowSchema();
    }

    initWorkflowSchema() {
        this.db.db.exec(`
            CREATE TABLE IF NOT EXISTS workflows (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                intent_pattern TEXT NOT NULL,
                plan TEXT NOT NULL,
                usage_count INTEGER DEFAULT 0,
                success_rate REAL DEFAULT 0.0,
                avg_duration INTEGER,
                created_at INTEGER NOT NULL,
                last_used INTEGER
            );

            CREATE TABLE IF NOT EXISTS workflow_triggers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                workflow_id INTEGER,
                context_pattern TEXT,
                confidence REAL,
                FOREIGN KEY (workflow_id) REFERENCES workflows(id) ON DELETE CASCADE
            );
        `);
    }

    // Detect if current task matches a saved workflow
    async detectWorkflow(intent, context) {
        const workflows = this.db.db.prepare(`
            SELECT * FROM workflows
            WHERE usage_count > 2 AND success_rate > 0.7
        `).all();

        for (const workflow of workflows) {
            const similarity = this.calculateSimilarity(intent, workflow.intent_pattern);
            if (similarity > 0.8) {
                return {
                    found: true,
                    workflow,
                    confidence: similarity
                };
            }
        }

        return { found: false };
    }

    // Save workflow for future use
    saveWorkflow(name, intent, plan, context) {
        const stmt = this.db.db.prepare(`
            INSERT INTO workflows (name, intent_pattern, plan, created_at)
            VALUES (?, ?, ?, ?)
        `);

        const workflowId = stmt.run(
            name,
            intent,
            JSON.stringify(plan),
            Math.floor(Date.now() / 1000)
        ).lastInsertRowid;

        // Save context pattern
        this.saveContextPattern(workflowId, context);

        return workflowId;
    }

    saveContextPattern(workflowId, context) {
        const pattern = {
            appType: context.appType,
            hasSelection: !!context.selection
        };

        const stmt = this.db.db.prepare(`
            INSERT INTO workflow_triggers (workflow_id, context_pattern, confidence)
            VALUES (?, ?, ?)
        `);

        stmt.run(workflowId, JSON.stringify(pattern), 0.8);
    }

    // Update workflow stats after execution
    updateWorkflowStats(workflowId, success, duration) {
        const workflow = this.db.db.prepare(`
            SELECT * FROM workflows WHERE id = ?
        `).get(workflowId);

        const newUsageCount = workflow.usage_count + 1;
        const newSuccessRate = (workflow.success_rate * workflow.usage_count + (success ? 1 : 0)) / newUsageCount;
        const newAvgDuration = (workflow.avg_duration * workflow.usage_count + duration) / newUsageCount;

        this.db.db.prepare(`
            UPDATE workflows
            SET usage_count = ?, success_rate = ?, avg_duration = ?, last_used = ?
            WHERE id = ?
        `).run(
            newUsageCount,
            newSuccessRate,
            newAvgDuration,
            Math.floor(Date.now() / 1000),
            workflowId
        );
    }

    calculateSimilarity(str1, str2) {
        // Simple word overlap similarity
        const words1 = str1.toLowerCase().split(/\s+/);
        const words2 = str2.toLowerCase().split(/\s+/);
        
        const intersection = words1.filter(w => words2.includes(w));
        const union = [...new Set([...words1, ...words2])];
        
        return intersection.length / union.length;
    }
}

module.exports = WorkflowMemory;
```

---

## Implementation Phases

### Phase 1: Foundation (Week 1-2)
- ✅ Fix existing features (DONE)
- ✅ Add missing IPC handlers (DONE)
- Create floating panel UI
- Implement hotkey activation (⌘ + Shift + M)
- Build basic context detector

### Phase 2: Core Agent (Week 3-4)
- Implement TaskPlanner with LLM integration
- Build ActionExecutor with all action handlers
- Create trust layer UI (show plan, allow editing)
- Implement step-by-step execution

### Phase 3: Verification (Week 5)
- Build OutcomeVerifier
- Implement before/after state comparison
- Add verification UI in floating panel
- Create execution timeline/audit log

### Phase 4: Learning (Week 6)
- Implement WorkflowMemory
- Add workflow detection
- Build "Save as workflow" feature
- Implement 1-click replay

### Phase 5: Polish & Advanced (Week 7-8)
- Vision-based element detection (GPT-4V)
- Google Sheets API integration
- Region selection UI
- Advanced verification strategies
- Performance optimization

---

## File Structure

```
desktop-app/
├── src/
│   ├── ui/
│   │   ├── floating-panel/
│   │   │   ├── panel.html
│   │   │   ├── panel.css
│   │   │   ├── panel.js
│   │   │   └── plan-editor.js
│   │   └── region-selector/
│   │       ├── selector.html
│   │       └── selector.js
│   ├── context/
│   │   ├── context-detector.js (NEW)
│   │   ├── screen.js (existing)
│   │   ├── gmail.js (existing)
│   │   └── browser.js (existing)
│   ├── planning/
│   │   ├── task-planner.js (NEW)
│   │   └── plan-templates.js (NEW)
│   ├── execution/
│   │   ├── action-executor.js (NEW, replaces runner.js)
│   │   └── action-handlers/ (NEW)
│   │       ├── spreadsheet.js
│   │       ├── email.js
│   │       └── browser.js
│   ├── verification/
│   │   ├── outcome-verifier.js (NEW)
│   │   └── state-comparer.js (NEW)
│   ├── timeline/
│   │   ├── execution-timeline.js (NEW)
│   │   └── audit-reporter.js (NEW)
│   ├── learning/
│   │   ├── workflow-memory.js (NEW)
│   │   ├── pattern-detector.js (NEW)
│   │   └── similarity-scorer.js (NEW)
│   ├── actions/ (existing, enhanced)
│   │   ├── gui.js
│   │   ├── readEmail.js
│   │   ├── summarize.js
│   │   └── pasteToNotes.js
│   └── ai/ (existing)
│       ├── llm-router.js
│       └── summarizer.js
└── main.js (add new IPC handlers)
```

---

## IPC Handlers to Add

```javascript
// In main.js

// Floating Panel
ipcMain.on('show-floating-panel', (event, { x, y }) => {
    // Create or show floating panel window
});

ipcMain.on('hide-floating-panel', () => {
    // Hide panel
});

// Context Detection
ipcMain.handle('detect-context', async () => {
    const detector = new ContextDetector(mainWindow);
    return await detector.detect();
});

// Task Planning
ipcMain.handle('create-plan', async (event, { intent, context }) => {
    const planner = new TaskPlanner();
    return await planner.createPlan(intent, context);
});

ipcMain.handle('edit-plan', async (event, { plan, edits }) => {
    const planner = new TaskPlanner();
    return planner.editPlan(plan, edits);
});

// Execution
ipcMain.handle('execute-plan', async (event, { plan, context }) => {
    const executor = new ActionExecutor(mainWindow);
    const timeline = new ExecutionTimeline();
    const verifier = new OutcomeVerifier(mainWindow);
    
    const executionId = timeline.startExecution(plan.intent, plan);
    const results = [];
    
    try {
        for (const step of plan.steps) {
            timeline.logStepStart(executionId, step);
            
            const result = await executor.executeStep(step, context, results);
            results.push(result);
            
            timeline.logStepComplete(executionId, step.id, result);
            
            // Verify step
            if (step.verifiable) {
                const verification = await verifier.verifyStep(step, result);
                timeline.logVerification(executionId, step.id, verification);
                
                if (!verification.passed) {
                    throw new Error(`Step ${step.id} verification failed: ${verification.reason}`);
                }
            }
        }
        
        timeline.completeExecution(executionId, 'success');
        
        return {
            success: true,
            executionId,
            results
        };
        
    } catch (error) {
        timeline.completeExecution(executionId, 'failed', error.message);
        return {
            success: false,
            error: error.message,
            executionId
        };
    }
});

// Workflow Learning
ipcMain.handle('detect-workflow', async (event, { intent, context }) => {
    const memory = new WorkflowMemory();
    return await memory.detectWorkflow(intent, context);
});

ipcMain.handle('save-workflow', async (event, { name, intent, plan, context }) => {
    const memory = new WorkflowMemory();
    return memory.saveWorkflow(name, intent, plan, context);
});

ipcMain.handle('get-execution-history', async (event, { limit }) => {
    const timeline = new ExecutionTimeline();
    return timeline.getExecutionHistory(limit || 50);
});

ipcMain.handle('get-execution-details', async (event, { executionId }) => {
    const timeline = new ExecutionTimeline();
    return timeline.getExecutionDetails(executionId);
});
```

---

## Next Steps

1. **Review this architecture** - Does it match your vision?
2. **Prioritize features** - Which parts are most critical?
3. **Start Phase 1** - Build floating panel and context detector
4. **Integrate existing code** - Connect new architecture to fixed codebase
5. **Test iteratively** - Build one layer at a time, test thoroughly

This architecture provides:
- ✅ Transparent, trustworthy AI agent
- ✅ Step-by-step verification
- ✅ Auditable execution history
- ✅ Learning from user patterns
- ✅ Extensible action system
- ✅ Professional UX with floating panel

Ready to start implementation?

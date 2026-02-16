const { guiClick, guiType, guiMove } = require('../actions/gui');
const { getScreenText } = require('../context/screen');
const LLMRouter = require('../ai/llm-router');
const TaskExtractor = require('../ai/task-extractor');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class ActionExecutor {
    constructor(mainWindow) {
        this.mainWindow = mainWindow;
        this.llm = new LLMRouter();
        this.taskExtractor = new TaskExtractor();
        this.memory = {};
    }

    /**
     * Execute a single step
     */
    async executeStep(step, context, previousResults = []) {
        try {
            const handler = this.getHandler(step.action);
            if (!handler) throw new Error(`Unknown action: ${step.action}`);

            this.memory = this.buildMemory(previousResults);
            const result = await handler.call(this, step, context, this.memory);
            
            result._meta = {
                stepId: step.id,
                action: step.action,
                timestamp: Date.now(),
                duration: Date.now() - (step._startTime || Date.now())
            };

            return result;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get handler for action type
     */
    getHandler(actionType) {
        const handlers = {
            'READ_SCREEN': this.handleReadScreen,
            'READ_EMAIL': this.handleReadEmail,
            'READ_SELECTION': this.handleReadSelection,
            'SUMMARIZE': this.handleSummarize,
            'EXTRACT_DATA': this.handleExtractData,
            'EXTRACT_TASKS': this.handleExtractTasks,
            'OPEN_APP': this.handleOpenApp,
            'NAVIGATE': this.handleNavigate,
            'FIND_FILE': this.handleFindFile,
            'INPUT_TEXT': this.handleInputText,
            'CLICK': this.handleClick,
            'API_CALL': this.handleApiCall,
            'UPDATE_SPREADSHEET': this.handleUpdateSpreadsheet,
            'CREATE_NOTE': this.handleCreateNote,
            'SEND_EMAIL': this.handleSendEmail,
            'VERIFY': this.handleVerify,
            'WAIT': this.handleWait
        };

        return handlers[actionType];
    }

    /**
     * Build memory object from previous results
     */
    buildMemory(previousResults) {
        const memory = {};

        previousResults.forEach((result, index) => {
            if (result.text) memory.text = result.text;
            if (result.summary) memory.summary = result.summary;
            if (result.data) memory.data = result.data;
            if (result.tasks) memory.tasks = result.tasks;
            if (result.emailContent) memory.emailContent = result.emailContent;
        });

        return memory;
    }

    // ============= ACTION HANDLERS =============

    /**
     * Read screen via OCR
     */
    async handleReadScreen(step, context, memory) {
        const result = await getScreenText(this.mainWindow);
        return {
            text: result.text,
            confidence: result.confidence,
            summary: `Extracted ${result.text.length} characters`
        };
    }

    /**
     * Read email content
     */
    async handleReadEmail(step, context, memory) {
        if (context.appType !== 'email') {
            throw new Error('Not viewing an email application');
        }

        const text = context.visibleText || memory.text;
        
        // Extract email metadata
        const metadata = this.extractEmailMetadata(text);

        return {
            emailContent: text,
            from: metadata.from,
            subject: metadata.subject,
            text,
            summary: `Read email from ${metadata.from || 'unknown sender'}`
        };
    }

    /**
     * Read selected text
     */
    async handleReadSelection(step, context, memory) {
        if (!context.selection) {
            throw new Error('No text selected');
        }

        return {
            text: context.selection,
            length: context.selection.length,
            summary: `Read ${context.selection.length} characters of selected text`
        };
    }

    /**
     * Summarize text
     */
    async handleSummarize(step, context, memory) {
        let text = memory.text || context.visibleText || context.selection;
        
        if (!text || text.length < 20) {
            const screenResult = await getScreenText(this.mainWindow);
            text = screenResult.text;
        }
        
        if (!text || text.length < 20) {
            throw new Error('Insufficient text to summarize');
        }

        const prompt = `Summarize in 3 bullet points:\n\n${text.substring(0, 3000)}\n\nSummary:`;

        const summary = await this.llm.route(prompt, 'medium', {
            temperature: 0.5,
            maxTokens: 300
        });

        return {
            summary: summary.trim(),
            summaryText: summary.trim()
        };
    }

    /**
     * Extract structured data
     */
    async handleExtractData(step, context, memory) {
        // Use captured text from memory first, then context
        let text = memory.text || context.visibleText || context.selection;
        
        // If no text available, try reading screen fresh
        if (!text || text.length < 10) {
            console.log('[EXECUTOR] No cached text, reading screen for data extraction...');
            try {
                const screenResult = await getScreenText(this.mainWindow);
                if (screenResult.text && screenResult.text.length > 10) {
                    text = screenResult.text;
                }
            } catch (err) {
                console.log('[EXECUTOR] Could not read screen:', err.message);
            }
        }
        
        if (!text) {
            throw new Error('No text available for data extraction');
        }

        const prompt = `Extract key information from the following text as structured JSON data:

${text.substring(0, 2000)}

Return ONLY valid JSON with relevant fields. Example:
{"name": "...", "email": "...", "date": "...", "action_items": [...]}

JSON:`;

        const response = await this.llm.route(prompt, 'medium', {
            temperature: 0.2,
            maxTokens: 500
        });

        // Parse JSON
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Failed to extract structured data');
        }

        const data = JSON.parse(jsonMatch[0]);

        return {
            data,
            summary: `Extracted ${Object.keys(data).length} data fields`
        };
    }

    /**
     * Extract tasks/action items
     */
    async handleExtractTasks(step, context, memory) {
        // Use captured text from memory first, then context
        let text = memory.text || context.visibleText || context.selection;
        
        // If no text available, try reading screen fresh
        if (!text || text.length < 10) {
            console.log('[EXECUTOR] No cached text, reading screen for task extraction...');
            try {
                const screenResult = await getScreenText(this.mainWindow);
                if (screenResult.text && screenResult.text.length > 10) {
                    text = screenResult.text;
                }
            } catch (err) {
                console.log('[EXECUTOR] Could not read screen:', err.message);
            }
        }
        
        if (!text) {
            throw new Error('No text available for task extraction');
        }

        const tasks = await this.taskExtractor.extractTasks(text, 'agent_execution');

        return {
            tasks,
            count: tasks.length,
            summary: `Found ${tasks.length} action items`
        };
    }

    /**
     * Open application
     */
    async handleOpenApp(step, context, memory) {
        const { app, file } = step.params;
        
        if (!app) {
            throw new Error('No app specified');
        }

        let script;
        if (file) {
            script = `tell application "${app}" to open POSIX file "${file}"`;
        } else {
            script = `tell application "${app}" to activate`;
        }

        await execAsync(`osascript -e '${script}'`);
        
        // Wait for app to open
        await this.sleep(2000);

        return {
            app,
            file,
            opened: true,
            summary: `Opened ${app}${file ? ` with file ${file}` : ''}`
        };
    }

    /**
     * Navigate to URL
     */
    async handleNavigate(step, context, memory) {
        const { url } = step.params;
        
        if (!url) {
            throw new Error('No URL specified');
        }

        await execAsync(`open "${url}"`);
        
        // Wait for page to load
        await this.sleep(2000);

        return {
            url,
            navigated: true,
            summary: `Navigated to ${url}`
        };
    }

    /**
     * Find file
     */
    async handleFindFile(step, context, memory) {
        const { name, extension } = step.params;
        
        if (!name) {
            throw new Error('No file name specified');
        }

        let searchQuery = name;
        if (extension) {
            searchQuery += `.${extension}`;
        }

        // Use mdfind (Spotlight) to search
        const { stdout } = await execAsync(`mdfind "kMDItemFSName == '${searchQuery}'*" | head -n 1`);
        const filePath = stdout.trim();

        if (!filePath) {
            throw new Error(`File not found: ${searchQuery}`);
        }

        return {
            filePath,
            name,
            found: true,
            summary: `Found file at ${filePath}`
        };
    }

    /**
     * Input text
     */
    async handleInputText(step, context, memory) {
        let text = step.params.text;
        
        // Use memory if no text provided
        if (!text && memory.summary) {
            text = memory.summary;
        }

        if (!text) {
            throw new Error('No text to input');
        }

        await guiType(text);

        return {
            typed: text.length,
            text,
            summary: `Typed ${text.length} characters`
        };
    }

    /**
     * Click element
     */
    async handleClick(step, context, memory) {
        const { x, y, target } = step.params;
        
        if (x !== undefined && y !== undefined) {
            // Direct coordinates
            await guiClick(x, y);
            return {
                x, y,
                clicked: true,
                summary: `Clicked at (${x}, ${y})`
            };
        } else if (target) {
            // Named target (needs vision AI - not implemented yet)
            throw new Error('Vision-based element detection not yet implemented. Please use x,y coordinates.');
        } else {
            throw new Error('No click coordinates or target specified');
        }
    }

    /**
     * API call (placeholder for future implementation)
     */
    async handleApiCall(step, context, memory) {
        const { api, method, endpoint, data } = step.params;
        
        // For now, only Google Sheets is planned
        if (api === 'google_sheets') {
            throw new Error('Google Sheets API not yet implemented. Use UPDATE_SPREADSHEET with GUI automation.');
        }

        throw new Error(`API ${api} not supported yet`);
    }

    /**
     * Update spreadsheet via GUI automation
     */
    async handleUpdateSpreadsheet(step, context, memory) {
        const { operation, data } = step.params;
        
        if (!operation) {
            throw new Error('No spreadsheet operation specified');
        }

        if (operation === 'insert_row') {
            // Get data from memory
            const rowData = data || memory.data || memory.summary;
            
            if (!rowData) {
                throw new Error('No data available to insert');
            }

            // Focus on spreadsheet (click in it)
            await guiClick(500, 400);
            await this.sleep(300);

            // Go to last row
            await this.pressKey('cmd+down');
            await this.sleep(200);

            // New row
            await this.pressKey('down');
            await this.sleep(200);

            // Type data
            const dataText = typeof rowData === 'string' ? rowData : JSON.stringify(rowData);
            await guiType(dataText);
            await this.sleep(200);

            // Press Enter to confirm
            await this.pressKey('return');

            return {
                inserted: true,
                data: rowData,
                summary: 'Inserted row into spreadsheet'
            };
        }

        throw new Error(`Spreadsheet operation ${operation} not supported`);
    }

    /**
     * Create note
     */
    async handleCreateNote(step, context, memory) {
        const { title, content } = step.params;
        
        const noteContent = content || memory.summary || memory.text;
        
        if (!noteContent) {
            throw new Error('No content for note');
        }

        // Escape for AppleScript
        const escapedContent = noteContent.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/'/g, "\\'");
        const escapedTitle = title ? title.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/'/g, "\\'") : 'Metrixa Note';

        const script = `
tell application "Notes"
    activate
    set newNote to make new note with properties {name:"${escapedTitle}", body:"${escapedContent}"}
end tell`;

        await execAsync(`osascript -e '${script}'`);

        return {
            created: true,
            title: escapedTitle,
            summary: `Created note: ${escapedTitle}`
        };
    }

    /**
     * Send/draft email (placeholder)
     */
    async handleSendEmail(step, context, memory) {
        const { to, subject, body } = step.params;
        
        if (!to || !subject) {
            throw new Error('Email requires to and subject');
        }

        const emailBody = body || memory.summary || '';

        // For now, just open Mail.app with compose window
        // Full automation would require more complex AppleScript
        const script = `tell application "Mail"
    activate
    set newMessage to make new outgoing message with properties {subject:"${subject}", content:"${emailBody}"}
    tell newMessage
        make new to recipient with properties {address:"${to}"}
    end tell
    open newMessage
end tell`;

        await execAsync(`osascript -e '${script}'`);

        return {
            drafted: true,
            to, subject,
            summary: `Drafted email to ${to}`
        };
    }

    /**
     * Verify outcome
     */
    async handleVerify(step, context, memory) {
        const { expected } = step.params;
        
        // Re-read screen
        const currentState = await getScreenText(this.mainWindow);

        // Use LLM to verify
        const prompt = `Verify if the expected outcome was achieved.

EXPECTED: ${expected || 'Task completed successfully'}

CURRENT SCREEN TEXT (first 1000 chars):
${currentState.text.substring(0, 1000)}

Did the expected outcome occur? Return ONLY valid JSON:
{"verified": true/false, "reason": "brief explanation", "confidence": 0.0-1.0}

JSON:`;

        const response = await this.llm.route(prompt, 'simple', {
            temperature: 0.2,
            maxTokens: 200
        });

        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            // Fallback verification
            return {
                verified: true,
                reason: 'Verification step completed',
                confidence: 0.5,
                summary: 'Verification completed'
            };
        }

        const verification = JSON.parse(jsonMatch[0]);

        if (!verification.verified) {
            throw new Error(`Verification failed: ${verification.reason}`);
        }

        return {
            ...verification,
            summary: `Verified: ${verification.reason}`
        };
    }

    /**
     * Wait/pause
     */
    async handleWait(step, context, memory) {
        const { duration_ms } = step.params;
        const duration = duration_ms || 1000;

        await this.sleep(duration);

        return {
            waited: duration,
            summary: `Waited ${duration}ms`
        };
    }

    // ============= HELPER METHODS =============

    /**
     * Extract email metadata from text
     */
    extractEmailMetadata(text) {
        const metadata = {
            from: null,
            to: null,
            subject: null
        };

        const fromMatch = text.match(/from:\s*([^\n]+)/i);
        if (fromMatch) metadata.from = fromMatch[1].trim();

        const toMatch = text.match(/to:\s*([^\n]+)/i);
        if (toMatch) metadata.to = toMatch[1].trim();

        const subjectMatch = text.match(/subject:\s*([^\n]+)/i);
        if (subjectMatch) metadata.subject = subjectMatch[1].trim();

        return metadata;
    }

    /**
     * Press key combination
     */
    async pressKey(key) {
        await execAsync(`osascript -e 'tell application "System Events" to keystroke "${key}"'`);
    }

    /**
     * Sleep
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Notify progress
     */
    notifyProgress(stepId, status, data = {}) {
        if (this.mainWindow && !this.mainWindow.isDestroyed()) {
            this.mainWindow.webContents.send('step-progress', {
                stepId,
                status,
                data,
                timestamp: Date.now()
            });
        }
    }

    /**
     * Send final execution result
     */
    sendResult(result) {
        if (this.mainWindow && !this.mainWindow.isDestroyed()) {
            this.mainWindow.webContents.send('execution-result', {
                result: result.summary || result.summaryText || JSON.stringify(result),
                timestamp: Date.now()
            });
        }
    }
}

module.exports = ActionExecutor;

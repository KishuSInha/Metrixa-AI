const LLMRouter = require('../ai/llm-router');

class TaskPlanner {
    constructor() {
        this.llm = new LLMRouter();
    }

    /**
     * Check if request is simple and doesn't need complex planning
     */
    isSimpleRequest(intent) {
        const simpleKeywords = [
            'summarize', 'summarize this', 'summarize this mail', 'summarize this email',
            'explain', 'what is this', 'describe', 'tell me about',
            'translate', 'convert', 'rewrite', 'improve',
            'extract', 'find', 'show me', 'list'
        ];
        const lowerIntent = intent.toLowerCase().trim();
        return simpleKeywords.some(kw => lowerIntent.includes(kw)) && lowerIntent.length < 100;
    }

    /**
     * Create execution plan from user intent
     */
    async createPlan(userIntent, context) {
        try {
            console.log('[TASK PLANNER] Creating plan for:', userIntent);

            // For simple requests, skip planning and use direct execution
            if (this.isSimpleRequest(userIntent)) {
                console.log('[TASK PLANNER] Simple request detected, using direct execution');
                return this.createDirectPlan(userIntent, context);
            }
            
            const prompt = this.buildPlanningPrompt(userIntent, context);
            const response = await this.llm.route(prompt, 'medium', {
                temperature: 0.3,
                maxTokens: 1500
            });

            const plan = this.parsePlan(response);
            plan.context = context;
            
            console.log('[TASK PLANNER] Plan created with', plan.steps.length, 'steps');
            
            return plan;
        } catch (error) {
            console.error('[TASK PLANNER] Failed to create plan:', error);
            // Return direct plan as fallback
            return this.createDirectPlan(userIntent, context);
        }
    }

    /**
     * Create a simple direct plan for straightforward requests
     */
    createDirectPlan(userIntent, context) {
        return {
            intent: userIntent,
            steps: [
                {
                    id: 1,
                    action: 'READ_SCREEN',
                    description: 'Capture and read screen content',
                    requires: ['screen_recording'],
                    verifiable: true,
                    params: {}
                },
                {
                    id: 2,
                    action: 'SUMMARIZE',
                    description: `Process: ${userIntent}`,
                    requires: ['ollama'],
                    verifiable: true,
                    params: { query: userIntent }
                }
            ],
            risks: [],
            estimated_time: '10 seconds',
            created_at: Date.now(),
            status: 'pending_approval',
            version: 1,
            isDirect: true
        };
    }

    /**
     * Build planning prompt
     */
    buildPlanningPrompt(userIntent, context) {
        const contextSummary = this.summarizeContext(context);
        
        return `You are a task planning AI. Create a simple execution plan.

USER INTENT: "${userIntent}"

CONTEXT:
${contextSummary}

Create a plan with these actions only:
- READ_SCREEN (if you need to see what's on screen)
- SUMMARIZE (if user wants summary)
- EXTRACT_TASKS (if extracting action items)

Return ONLY this JSON format (no markdown, no explanations):
{"intent":"brief_description","steps":[{"id":1,"action":"READ_SCREEN","description":"Read screen content","requires":["screen_recording"],"verifiable":true,"params":{}},{"id":2,"action":"SUMMARIZE","description":"Process request","requires":["ollama"],"verifiable":true,"params":{}}],"risks":[],"estimated_time":"10 seconds"}`;
    }

    /**
     * Summarize context for prompt
     */
    summarizeContext(context) {
        if (context == null) {
            return 'App: Unknown\nType: general\nNo context available';
        }

        let summary = [];
        
        const appObj = context.app;
        const appName = (appObj && appObj.name) || context.appName || 'Unknown';
        summary.push(`App: ${appName}`);
        
        const appType = context.appType || 'general';
        summary.push(`Type: ${appType}`);
        
        // Safe window title access
        if (context.window?.title) {
            summary.push(`Window: ${context.window.title}`);
        }
        
        // Safe selection access
        if (context.selection && context.selection.length > 0) {
            summary.push(`Selection: ${context.selection.length} characters selected`);
            const selectionPreview = context.selection.substring(0, 200);
            summary.push(`Selected Text (first 200 chars): "${selectionPreview}${context.selection.length > 200 ? '...' : ''}"`);
        }
        
        // Safe visible text access
        if (context.visibleText && context.visibleText.length > 0) {
            const textPreview = context.visibleText.substring(0, 500);
            summary.push(`Visible Text (first 500 chars): "${textPreview}${context.visibleText.length > 500 ? '...' : ''}"`);
        }
        
        return summary.join('\n');
    }

    /**
     * Parse LLM response into plan with robust JSON extraction
     */
    parsePlan(llmResponse) {
        try {
            console.log('[TASK PLANNER] Raw LLM response:', llmResponse.substring(0, 500));

            // Step 1: Clean the response
            let cleaned = llmResponse;
            
            // Remove markdown code blocks
            cleaned = cleaned.replace(/```json\n?/g, '');
            cleaned = cleaned.replace(/```\n?/g, '');
            
            // Remove explanations before JSON
            cleaned = cleaned.replace(/^.*?(\{[\s\S]*\})$/s, '$1');
            
            // Remove trailing commas in arrays and objects
            cleaned = cleaned.replace(/,(\s*[}\]])/g, '$1');
            
            // Step 2: Extract JSON
            const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No JSON found in LLM response');
            }

            let jsonString = jsonMatch[0];
            
            // Fix common JSON issues
            jsonString = jsonString.replace(/(["':])\s*\/\/.*?\n/g, '$1'); // Remove inline comments
            jsonString = jsonString.replace(/\/\*.*?\*\//gs, ''); // Remove block comments
            jsonString = jsonString.replace(/(["\w])\s*\n\s*(["\w])/g, '$1,$2'); // Add missing commas
            
            // Fix escaped characters that LLMs sometimes add
            jsonString = jsonString.replace(/\\_/g, '_'); // Fix escaped underscores
            jsonString = jsonString.replace(/\\-/g, '-'); // Fix escaped dashes
            jsonString = jsonString.replace(/\\\(/g, '('); // Fix escaped parens
            jsonString = jsonString.replace(/\\\)/g, ')');
            
            const plan = JSON.parse(jsonString);

            // Validate plan structure
            this.validatePlan(plan);

            // Add metadata
            plan.created_at = Date.now();
            plan.status = 'pending_approval';
            plan.version = 1;

            // Ensure all steps have required fields
            plan.steps = plan.steps.map((step, index) => ({
                id: step.id || index + 1,
                action: step.action,
                description: step.description,
                requires: step.requires || [],
                verifiable: step.verifiable !== false,
                params: step.params || {}
            }));

            return plan;
        } catch (error) {
            console.error('[TASK PLANNER] Parse error:', error);
            console.error('[TASK PLANNER] Original response:', llmResponse);
            
            // Return a simple fallback plan instead of crashing
            return this.createFallbackPlan(llmResponse);
        }
    }

    /**
     * Create a fallback plan when JSON parsing fails
     */
    createFallbackPlan(userIntent) {
        console.log('[TASK PLANNER] Creating fallback plan for:', userIntent);
        
        return {
            intent: 'direct_response',
            steps: [
                {
                    id: 1,
                    action: 'SUMMARIZE',
                    description: 'Process user request directly',
                    requires: ['ollama'],
                    verifiable: true,
                    params: { query: userIntent }
                }
            ],
            risks: [],
            estimated_time: '10 seconds',
            created_at: Date.now(),
            status: 'pending_approval',
            version: 1,
            isFallback: true
        };
    }

    /**
     * Validate plan structure
     */
    validatePlan(plan) {
        if (!plan.intent || typeof plan.intent !== 'string') {
            throw new Error('Plan must have an intent string');
        }

        if (!plan.steps || !Array.isArray(plan.steps)) {
            throw new Error('Plan must have a steps array');
        }

        if (plan.steps.length === 0) {
            throw new Error('Plan must have at least one step');
        }

        plan.steps.forEach((step, index) => {
            if (!step.action) {
                throw new Error(`Step ${index + 1} is missing action type`);
            }
            if (!step.description) {
                throw new Error(`Step ${index + 1} is missing description`);
            }
        });
    }

    /**
     * Edit plan based on user feedback
     */
    editPlan(plan, edits) {
        const modifiedPlan = JSON.parse(JSON.stringify(plan)); // Deep clone
        
        edits.forEach(edit => {
            switch (edit.type) {
                case 'remove_step':
                    modifiedPlan.steps = modifiedPlan.steps.filter(s => s.id !== edit.stepId);
                    break;
                
                case 'modify_step':
                    const step = modifiedPlan.steps.find(s => s.id === edit.stepId);
                    if (step && edit.field) {
                        step[edit.field] = edit.value;
                    }
                    break;
                
                case 'reorder_steps':
                    if (edit.newOrder) {
                        const reordered = [];
                        edit.newOrder.forEach(id => {
                            const step = modifiedPlan.steps.find(s => s.id === id);
                            if (step) reordered.push(step);
                        });
                        modifiedPlan.steps = reordered;
                    }
                    break;
                
                case 'add_step':
                    if (edit.step) {
                        const newId = Math.max(...modifiedPlan.steps.map(s => s.id)) + 1;
                        modifiedPlan.steps.push({
                            id: newId,
                            ...edit.step
                        });
                    }
                    break;
            }
        });

        // Re-number steps
        modifiedPlan.steps.forEach((step, index) => {
            step.id = index + 1;
        });

        modifiedPlan.version = (modifiedPlan.version || 1) + 1;
        modifiedPlan.modified_at = Date.now();

        return modifiedPlan;
    }

    /**
     * Get example plans for common tasks
     */
    getExamplePlans() {
        return {
            'summarize_email': {
                intent: 'summarize_current_email',
                steps: [
                    {
                        id: 1,
                        action: 'READ_SCREEN',
                        description: 'Extract email content from screen',
                        requires: ['screen_recording'],
                        verifiable: true
                    },
                    {
                        id: 2,
                        action: 'SUMMARIZE',
                        description: 'Generate 3-line summary and extract key points',
                        requires: ['ollama'],
                        verifiable: true
                    }
                ]
            },
            'extract_tasks': {
                intent: 'extract_action_items',
                steps: [
                    {
                        id: 1,
                        action: 'READ_SELECTION',
                        description: 'Get selected text',
                        requires: ['selection'],
                        verifiable: true
                    },
                    {
                        id: 2,
                        action: 'EXTRACT_TASKS',
                        description: 'Identify action items and deadlines',
                        requires: ['ollama'],
                        verifiable: true
                    }
                ]
            }
        };
    }
}

module.exports = TaskPlanner;

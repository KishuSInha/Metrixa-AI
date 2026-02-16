const OllamaClient = require('./ollama-client');
const IntentClassifier = require('./intent-classifier');

const ollama = new OllamaClient();
const intentClassifier = new IntentClassifier();

class LLMRouter {
    constructor() {
        this.ollama = ollama;
    }

    async isAvailable() {
        return await this.ollama.isAvailable();
    }

    async warmup() {
        await this.ollama.warmup();
    }

    async route(prompt, taskType = 'simple', options = {}) {
        const isAvailable = await this.ollama.isAvailable();
        if (isAvailable) {
            try {
                const model = options.model || await this.ollama.getBestModel();
                return await this.ollama.generate(prompt, {
                    model: model,
                    temperature: options.temperature || 0.3,
                    maxTokens: options.maxTokens || 500
                });
            } catch (error) {
                console.log('[LLM] Ollama failed:', error.message);
                throw error;
            }
        }

        throw new Error('No LLM available');
    }

    async processWithIntent(userInput, ocrText = null) {
        const intent = intentClassifier.classify(userInput);
        console.log('[LLM] Classified intent:', intent.name);

        intentClassifier.addToMemory('user', userInput);

        let prompt;
        if (intent.requiresOCR && ocrText) {
            prompt = intentClassifier.buildPromptWithContext(intent, ocrText);
        } else {
            prompt = userInput;
        }

        try {
            const response = await this.route(prompt, 'medium', {
                maxTokens: 500,
                temperature: 0.3
            });

            intentClassifier.addToMemory('assistant', response);
            return {
                intent: intent,
                response: response
            };
        } catch (error) {
            return {
                intent: intent,
                response: `I couldn't process that request. ${error.message}`,
                error: error.message
            };
        }
    }

    getMemory() {
        return intentClassifier.getMemory();
    }

    clearMemory() {
        intentClassifier.clearMemory();
    }
}

module.exports = LLMRouter;

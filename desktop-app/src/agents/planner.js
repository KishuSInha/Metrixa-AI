const https = require('https');

async function generatePlan(query, screenContext = "") {
    const systemPrompt = `
You are the Planning Agent for Metrixa AI, a sovereign desktop agent.
Your task is to decompose a high-level user request into a structured JSON plan.
A plan consists of a sequence of mission steps.

Mission Step Structure:
{
  "step": "Short description of the action",
  "action": "CLICK | TYPE | READ | SUMMARIZE | NOTIFY",
  "target": "Descriptive target (e.g., 'Gmail Tab', 'Notes App')",
  "data": "Optional data for the action (e.g., text to type)"
}

SCREEN CONTEXT: ${screenContext.substring(0, 1000)}...

USER REQUEST: "${query}"

Return ONLY a JSON array of steps. No conversational text.
Example:
[
  { "step": "Locate Gmail tab", "action": "READ", "target": "Browser" },
  { "step": "Read last 5 email subjects", "action": "READ", "target": "Email Inbox" },
  { "step": "Summarize findings", "action": "SUMMARIZE", "target": "Email Content" },
  { "step": "Type summary into Notes", "action": "TYPE", "target": "Notes App", "data": "[Summary Text]" }
]
`;

    // In this implementation, we'll use Ollama as the default engine
    // We expect Ollama to be running locally with the 'llava' model
    const data = JSON.stringify({
        model: "llava",
        prompt: systemPrompt,
        stream: false
    });

    const http = require('http');

    const options = {
        hostname: '127.0.0.1',
        port: 11434,
        path: '/api/generate',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let responseBody = '';
            res.on('data', (chunk) => { responseBody += chunk; });
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(responseBody);
                    const rawResponse = parsed.response;

                    if (typeof rawResponse !== 'string') {
                        throw new Error(`Unexpected Ollama response format: ${JSON.stringify(parsed)}`);
                    }

                    // Extract JSON array from LLM response (handling potential markdown)
                    const jsonMatch = rawResponse.match(/\[[\s\S]*\]/);
                    if (jsonMatch) {
                        resolve(JSON.parse(jsonMatch[0]));
                    } else {
                        throw new Error("No valid JSON plan found in LLM response");
                    }
                } catch (e) {
                    reject(new Error("Failed to parse LLM plan: " + e.message));
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.write(data);
        req.end();
    });
}

module.exports = { generatePlan };

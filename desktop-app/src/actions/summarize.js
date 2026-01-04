const { generatePlan } = require("../agents/planner");
const https = require('https');

async function summarize(data) {
    console.log("[ACTION]: Summarizing context...");

    let textToSummarize = "";
    if (Array.isArray(data)) {
        textToSummarize = data.map(e => `${e.sender}: ${e.subject}`).join("\n");
    } else {
        textToSummarize = String(data);
    }

    // Use Ollama to summarize
    const payload = JSON.stringify({
        model: "llava",
        prompt: `Summarize the following clearly and concisely for my Notes app:\n\n${textToSummarize}`,
        stream: false
    });

    const options = {
        hostname: 'localhost',
        port: 11434,
        path: '/api/generate',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': payload.length
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let responseBody = '';
            res.on('data', (chunk) => { responseBody += chunk; });
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(responseBody);
                    resolve(parsed.response);
                } catch (e) {
                    reject(new Error("Failed to parse LLM summary: " + e.message));
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.write(payload);
        req.end();
    });
}

module.exports = { summarize };

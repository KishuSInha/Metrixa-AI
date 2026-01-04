const { readRecentEmails } = require("../context/gmail");

async function readEmail(step) {
    console.log(`[ACTION]: Reading ${step.count || 5} emails...`);
    return await readRecentEmails(step.count || 5);
}

module.exports = { readEmail };

const { exec } = require("child_process");

function pasteIntoNotes(text) {
    return new Promise((resolve, reject) => {
        // Escape double quotes and backslashes for AppleScript string
        const escapedText = text.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

        const script = `
tell application "Notes"
  activate
  set newNote to make new note with properties {body:"${escapedText}"}
end tell`;

        exec(`osascript -e '${script}'`, (err, stdout, stderr) => {
            if (err) {
                console.error("AppleScript Notes Error:", stderr);
                reject(err);
            } else {
                resolve(stdout);
            }
        });
    });
}

module.exports = { pasteIntoNotes };

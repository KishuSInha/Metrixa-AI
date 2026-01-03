const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    // Send one-way message
    send: (channel, data) => {
        const validChannels = [
            'complete-setup',
            'get-settings',
            'save-settings',
            'start-monitoring',
            'stop-monitoring',
            'manual-analysis',
            'check-ollama',
            'install-ollama',
            'pull-model'
        ];
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },
    // Invoke for async response
    invoke: (channel, data) => {
        const validChannels = ['complete-setup-async', 'analyze-screen-logic', 'is-ollama-installed'];
        if (validChannels.includes(channel)) {
            return ipcRenderer.invoke(channel, data);
        }
    },
    // Listen for events
    on: (channel, func) => {
        const validChannels = [
            'command-result',
            'settings-loaded',
            'screen-captured',
            'analysis-result',
            'loading-progress',
            'ollama-status',
            'download-progress'
        ];
        if (validChannels.includes(channel)) {
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    }
});

console.log('✓ Preload script loaded successfully');

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
            'manual-analysis'
        ];
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },
    // Invoke for async response
    invoke: (channel, data) => {
        const validChannels = ['complete-setup-async', 'analyze-screen-logic'];
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
            'analysis-result', // If we move analysis to main
            'loading-progress'
        ];
        if (validChannels.includes(channel)) {
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    }
});

console.log('✓ Preload script loaded successfully');

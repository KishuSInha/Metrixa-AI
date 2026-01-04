const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    send: (channel, data) => {
        ipcRenderer.send(channel, data);
    },
    invoke: (channel, data) => {
        return ipcRenderer.invoke(channel, data);
    },
    on: (channel, callback) => {
        ipcRenderer.removeAllListeners(channel);
        ipcRenderer.on(channel, (_event, data) => callback(data));
    },
    once: (channel, callback) => {
        ipcRenderer.once(channel, (_event, data) => callback(data));
    }
});

console.log('✓ Robust Preload script loaded successfully');

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    selectCache: () => ipcRenderer.invoke('select-cache'),
    clearCache: () => ipcRenderer.invoke('clear-cache'),
    connectToServer: () => ipcRenderer.invoke('connect-server')
});

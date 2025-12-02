const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  loadConfig: () => ipcRenderer.invoke("config:load"),
  saveConfig: (payload) => ipcRenderer.invoke("config:save", payload),
  pickCache: () => ipcRenderer.invoke("dialog:pick-cache"),
  pickRedm: () => ipcRenderer.invoke("dialog:pick-redm"),
  clearCache: () => ipcRenderer.invoke("cache:clear"),
  connect: () => ipcRenderer.invoke("connect:server"),
  openCacheFolder: () => ipcRenderer.invoke("open:cache"),
});

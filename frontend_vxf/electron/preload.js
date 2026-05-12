const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  sendNotification: (title, body) => ipcRenderer.send('notify-render-complete', title, body),
  isNative: true,
});

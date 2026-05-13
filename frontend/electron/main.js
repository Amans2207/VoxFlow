const { app, BrowserWindow, ipcMain, Notification } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    title: "VoxFlow AI Studio",
    icon: path.join(__dirname, '../public/favicon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      gpu: true,
    },
    backgroundColor: '#000000',
  });

  // Load the Next.js app
  const url = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../out/index.html')}`;
  win.loadURL(url);

  // GPU Acceleration for local hardware (HP Pavilion / RTX)
  app.commandLine.appendSwitch('ignore-gpu-blacklist');
  app.commandLine.appendSwitch('enable-gpu-rasterization');
  app.commandLine.appendSwitch('enable-native-gpu-memory-buffers');

  if (isDev) {
    win.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Native Notification Bridge
ipcMain.on('notify-render-complete', (event, title, body) => {
  new Notification({ title, body }).show();
});

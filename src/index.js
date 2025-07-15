const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const fs = require('node:fs');

const settingsPath = path.join(__dirname, 'settings.json');

// Load settings from settings.json file
function loadSettings() {
  try {
    const data = fs.readFileSync(settingsPath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error("Could not load settings from file", err);
    return {
      timerDuration: "25:00",
      minigamesEnabled: true,
      selectedBackground: 0
    };
  }
}

// Save settings to settings.json file
function saveSettings(newSettings) {
  try {
    fs.writeFileSync(settingsPath, JSON.stringify(newSettings, null, 2));
  } catch (err) {
    console.error("Could not save settings to file", err);
  }
}

let mainWindow;

const createWindow = () => {
mainWindow = new BrowserWindow({
  width: 320,
  height: 420,
  useContentSize: true,
  resizable: true,
  frame: false,
  icon: path.join(__dirname, 'assets/catboba.ico'), 
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false
  }
});

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Uncomment to open DevTools for debugging
  // mainWindow.webContents.openDevTools();

  // Handle IPC from renderer process
  ipcMain.on('close-app', () => {
    mainWindow.close();
  });

  ipcMain.on('minimize-app', () => {
    mainWindow.minimize();
  });

  // Optional: Handle IPC to read/write settings from renderer
  ipcMain.handle('load-settings', () => {
    return loadSettings();
  });

  ipcMain.handle('save-settings', (event, newSettings) => {
    saveSettings(newSettings);
  });
};


// App lifecycle
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // Keep app open on macOS unless user quits explicitly
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

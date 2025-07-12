
const { contextBridge } = require('electron');
const fs = require('fs');
const path = require('path');
const settingsPath = path.join(__dirname, 'settings.json');

contextBridge.exposeInMainWorld('settingsAPI', {
  loadSettings: () => {
    try {
      const data = fs.readFileSync(settingsPath, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      console.error("Could not load settings:", err);
      return {};
    }
  },
  saveSettings: (settings) => {
    try {
      fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
    } catch (err) {
      console.error("Could not save settings:", err);
    }
  }
});

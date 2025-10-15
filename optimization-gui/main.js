// main.js
const { app, BrowserWindow } = require('electron');
const path = require('path');
require('dotenv').config();

function createWindow() {
    const path1 = path.join(__dirname, 'preload.js');
    console.log("Preload path:", path1);

    const win = new BrowserWindow({
        width: 900,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path1,
        }
    });
    win.loadURL("http://localhost:3000"); // React dev server
}

app.on('web-contents-created', (_event, contents) => {
    contents.on('will-attach-webview', (_wawevent, webPreferences, _params) => {
        webPreferences.preloadURL = `file://${__dirname}/preload.js`;
    });
});

app.whenReady().then(createWindow);
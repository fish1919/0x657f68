
const electron = require('electron');

const { app, BrowserWindow } = electron;

app.on('window-all-closed', () => {

    app.quit();

});

app.on('ready', function() {

    mainWindow = new BrowserWindow({
        width: 800,
        height: 600
    });

    mainWindow.webContents.on('will-navigate', (event, url) => {
        event.preventDefault();
    });

    mainWindow.loadURL('file://' + __dirname + '/index.html');

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

});


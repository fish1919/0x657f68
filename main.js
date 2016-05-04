
const electron = require('electron');

const BrowserWindow = electron.BrowserWindow;

const app = electron.app;

app.on('window-all-closed', () => {

    app.quit();

});

app.on('ready', function() {

    app.commandLine.appendSwitch('js-flags', '--harmony-destructuring');

    mainWindow = new BrowserWindow({
        width: 800,
        height: 600
    });

    mainWindow.webContents.on('will-navigate', (event, url) => {
        event.preventDefault();
    });

    mainWindow.loadURL('file://' + __dirname + '/index.html');

    mainWindow.openDevTools();

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

});

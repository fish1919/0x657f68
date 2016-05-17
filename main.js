
const electron = require('electron');

const { app, ipcMain, BrowserWindow } = electron;

const Hentai = require('./lib/hentai');
const Cache = require('./lib/cache');

app.on('window-all-closed', () => {

    app.quit();

});

app.on('ready', function() {

    const protocol = electron.protocol;

    protocol.registerFileProtocol('ximage', (request, callback) => {

        Hentai.ImageRequest(request.url.replace('ximage://', 'http://'), {}, () => {}, () => {}, (err, id, res, body) => {

            if(err) {
                return callback(err);
            }

            if(res && res.statusCode != 200) {
                return callback(new Error('ERROR_STATUS_NOT_OK'));
            }

            callback(Cache.Path(id));

        });

    });

    ipcMain.on('setCookies', (event, cookies) => {

        Hentai.SetCookies(cookies);

        event.returnValue = null;

    });

    ipcMain.on('setProxy', (event, proxy) => {

        if(proxy) process.env.HTTP_PROXY = proxy;
        else delete process.env['HTTP_PROXY'];

        event.returnValue = null;

    });

    ipcMain.on('browse', (event, options) => {
        Hentai.Browse(options, (err, browseResult) => event.sender.send('browse', err, browseResult));
    });

    ipcMain.on('detail', (event, options) => {
        Hentai.Detail(options, (err, detailResult) => event.sender.send('detail', err, detailResult));
    });

    ipcMain.on('view', (event, options) => {
        Hentai.View(options, (err, viewResult) => event.sender.send('view', err, viewResult));
    });

    ipcMain.on('login', (event, options) => {
        Hentai.Login(options, (err, loginResult) => event.sender.send('login', err, loginResult));
    });

    mainWindow = new BrowserWindow({
        width: 800,
        height: 600
    });

    mainWindow.webContents.on('will-navigate', (event, url) => {
        event.preventDefault();
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    mainWindow.loadURL('file://' + __dirname + '/index.html');

    //mainWindow.openDevTools();

});


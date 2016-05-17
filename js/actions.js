
'use strict';

const { deprecate } = require('util');

const { ipcRenderer } = require('electron');

const {
    ImageRequest: HentaiImageRequest,
} = require('../lib/hentai');

const Error = (store, err) => {

    console.error(err);

    store.dispatch('ERROR', err);

};

const UpdateSettings = (store, settings, callback) => {

    store.dispatch('SETTINGS_UPDATE', Object.assign({}, settings));

    ipcRenderer.sendSync('setCookies', {
        ipb_member_id: store.state.settings.ipb_member_id ? store.state.settings.ipb_member_id : null,
        ipb_pass_hash: store.state.settings.ipb_pass_hash ? store.state.settings.ipb_pass_hash : null
    });

    ipcRenderer.sendSync('setProxy', store.state.settings.proxy ? store.state.settings.proxy : "");

    return callback ? callback(null) : null;

};

const Login = (store, username, password, callback) => {

    store.dispatch('QUEUE_PUSH');

    ipcRenderer.send('login', {
        username, password
    });

    ipcRenderer.once('login', (event, err, loginResult) => {

        store.dispatch('QUEUE_POP');

        if(err) {
            Error(store, err);
            return callback ? callback(err) : null;
        }

        return callback ? callback(null, loginResult) : null;

    });

};

const Browse = (store, useExtra, keywords, filters, pageIdx, callback) => {

    store.dispatch('QUEUE_PUSH');

    ipcRenderer.send('browse', {
        useExtra, keywords, pageIdx, filters
    });

    ipcRenderer.once('browse', (event, err, browseResult) => {

        store.dispatch('QUEUE_POP');

        if(err) {
            Error(store, err);
            return callback ? callback(err) : null;
        }

        store.dispatch('BROWSE', browseResult);

        return callback ? callback(null, browseResult) : null;

    });

};

const Detail = (store, url, pageIdx, callback) => {

    store.dispatch('QUEUE_PUSH');

    ipcRenderer.send('detail', {
        url, pageIdx
    });

    ipcRenderer.once('detail', (event, err, detailResult) => {

        store.dispatch('QUEUE_POP');

        if(err) {
            Error(store, err);
            return callback ? callback(err) : null;
        }

        store.dispatch('DETAIL', detailResult);

        return callback ? callback(null, detailResult) : null;

    });

};

const View = (store, url, refererUrl, callback) => {

    store.dispatch('QUEUE_PUSH');

    ipcRenderer.send('view', {
        url, refererUrl
    });

    ipcRenderer.once('view', (event, err, viewResult) => {

        store.dispatch('QUEUE_POP');

        if(err) {
            Error(store, err);
            return callback ? callback(err) : null;
        }

        store.dispatch('VIEW', viewResult);

        return callback ? callback(null, viewResult) : null;

    });

};

// As images can be directly requested, IPC isn't necessary for this.
// Not a good pattern though.
const ImageRequest = (store, url, options, sizeCallback, progressCallback, endCallback) => {

    store.dispatch('QUEUE_PUSH');

    HentaiImageRequest(url, {}, (err, size) => {

        if(err) {
            Error(store, err);
            return sizeCallback ? sizeCallback(err) : null;
        }

        return sizeCallback ? sizeCallback(err, size) : null;

    }, (progress) => {
        return progressCallback ? progressCallback(progress) : null;
    }, (err, id, res, body) => {

        store.dispatch('QUEUE_POP');

        if(err) {
            Error(store, err);
            return endCallback ? endCallback(err) : null;
        }

        return endCallback ? endCallback(err, id, res, body) : null;

    });

};

Object.assign(module.exports, {
    Error,
    UpdateSettings,
    Login,
    Browse,
    Detail,
    View,
    ImageRequest
});

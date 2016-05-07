
'use strict';

const {
    Browse: HentaiBrowse,
    Detail: HentaiDetail,
    View: HentaiView,
    ImageRequest: HentaiImageRequest,
    Login: HentaiLogin
} = require('./hentai');

const Error = (store, err) => {

    console.error(err);

    store.dispatch('ERROR', err);

};

const UpdateSettings = (store, settings, callback) => {

    store.dispatch('SETTINGS_UPDATE', Object.assign({}, settings));

};

const Browse = (store, useExtra, keywords, filters, pageIdx, callback) => {

    store.dispatch('QUEUE_PUSH');

    HentaiBrowse({
        useExtra, keywords, pageIdx,
        filters: Object.assign({}, filters),
        proxy: store.state.settings.proxy ? store.state.settings.proxy : null
    }, (err, browseResult) => {

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

    HentaiDetail({
        url, pageIdx,
        proxy: store.state.settings.proxy ? store.state.settings.proxy : null
    }, (err, detailResult) => {

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

    HentaiView({
        url, refererUrl,
        proxy: store.state.settings.proxy ? store.state.settings.proxy : null
    }, (err, viewResult) => {

        store.dispatch('QUEUE_POP');

        if(err) {
            Error(store, err);
            return callback ? callback(err) : null;
        }

        store.dispatch('VIEW', viewResult);

        return callback ? callback(null, viewResult) : null;

    });

};

const ImageRequest = (store, url, options, sizeCallback, progressCallback, endCallback) => {

    store.dispatch('QUEUE_PUSH');

    HentaiImageRequest({
        url, options, sizeCallback, progressCallback, endCallback,
        proxy: store.state.settings.proxy ? store.state.settings.proxy : null
    }, (err, size) => {

        if(err) {
            Error(store, err);
            return sizeCallback ? sizeCallback(err) : null;
        }

        return sizeCallback ? sizeCallback(err, size) : null;

    }, (progress) => {
        return progressCallback ? progressCallback(progress) : null;
    }, (err, res, body) => {

        store.dispatch('QUEUE_POP');

        if(err) {
            Error(store, err);
            return endCallback ? endCallback(err) : null;
        }

        return endCallback ? endCallback(err, res, body) : null;

    });

};

const Login = (store, username, password, callback) => {

    store.dispatch('QUEUE_PUSH');

    HentaiLogin({
        username, password,
        proxy: store.state.settings.proxy ? store.state.settings.proxy : null
    }, (err, loginResult) => {

        store.dispatch('QUEUE_POP');

        if(err) {
            Error(store, err);
            return callback ? callback(err) : null;
        }

        return callback ? callback(null, loginResult) : null;

    });

};

module.exports.Error = Error;
module.exports.UpdateSettings = UpdateSettings;
module.exports.Browse = Browse;
module.exports.Detail = Detail;
module.exports.View = View;
module.exports.ImageRequest = ImageRequest;
// FIXME: Not support recaptcha.
//module.exports.Login = Login;

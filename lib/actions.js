
'use strict';

const {
    Browse: HentaiBrowse,
    Detail: HentaiDetail,
    View: HentaiView
} = require('./hentai');

const UpdateSettings = (store, settings, callback) => {

    store.dispatch({
        type: 'SETTINGS_UPDATE',
        payload: Object.assign({}, settings)
    });

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

            store.dispatch({
                type: 'ERROR',
                payload: err
            });

            return callback ? callback(err) : null;

        }

        store.dispatch({
            type: 'BROWSE',
            payload: browseResult
        });

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

            store.dispatch({
                type: 'ERROR',
                payload: err
            });

            return callback ? callback(err) : null;

        }

        store.dispatch({
            type: 'DETAIL',
            payload: detailResult
        });

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

            store.dispatch({
                type: 'ERROR',
                payload: err
            });

            return callback ? callback(err) : null;

        }

        store.dispatch({
            type: 'VIEW',
            payload: viewResult
        });

        return callback ? callback(null, viewResult) : null;

    });

};

module.exports.UpdateSettings = UpdateSettings;
module.exports.Browse = Browse;
module.exports.Detail = Detail;
module.exports.View = View;

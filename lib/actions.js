
'use strict';

const { Browse: HentaiBrowse, Detail: HentaiDetail } = require('./hentai');

const SaveSettings = (store, settings, callback) => {

    store.dispatch({
        type: 'SETTINGS_SAVE',
        payload: Object.assign({}, settings)
    });

};

const Browse = (store, useExtra, keywords, filters, pageIdx, callback) => {

    HentaiBrowse({
        useExtra, keywords, filters, pageIdx,
        proxy: store.state.settings.proxy ? store.state.settings.proxy : null
    }, (err, browseResult) => {

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

    HentaiDetail({
        url, pageIdx,
        proxy: store.state.settings.proxy ? store.state.settings.proxy : null
    }, (err, detailResult) => {

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

module.exports.SaveSettings = SaveSettings;
module.exports.Browse = Browse;
module.exports.Detail = Detail;

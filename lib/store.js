
'use strict';

const { existsSync, readFileSync, writeFileSync } = require('fs');

const Vue = require('vue');
const Vuex = require('vuex');

const FILE_SETTINGS = './settings.json';

Vue.use(Vuex);

const state = {
    title: '0x657f68',
    runtime: {
        error: '',
        queue: [],
        footprints: [],
        browseResult: {},
        detailResult: {},
        viewResult: {}
    },
    settings: {
        ipb_member_id: '',
        ipb_pass_hash: '',
        proxy: '',
        viewMode: 'gallery'
    }
};

// Load settings.
if(existsSync(FILE_SETTINGS)) {

    Object.assign(state.settings, JSON.parse(readFileSync(FILE_SETTINGS)));

}

// Save settings.
window.onbeforeunload = (event) => {

    writeFileSync(FILE_SETTINGS, JSON.stringify(state.settings));

};

const mutations = {
    ERROR: (state, err) => {
        state.runtime.error = err;
    },
    QUEUE_PUSH: (state) => {
        state.runtime.queue.push(Date.now());
    },
    QUEUE_POP: (state) => {
        state.runtime.queue.pop();
    },
    SETTINGS_SAVE: (state, settings) => {
        state.settings = settings;
    },
    BROWSE: (state, browseResult) => {
        state.runtime.browseResult = browseResult;
    },
    DETAIL: (state, detailResult) => {
        state.runtime.detailResult = detailResult;
    },
    VIEW: (state, viewResult) => {
        state.runtime.viewResult = viewResult;
    }
};

module.exports = new Vuex.Store({
    state, mutations,
    strict: true
});

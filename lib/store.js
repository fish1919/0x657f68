
'use strict';

const Vue = require('vue');
const Vuex = require('vuex');

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

const mutations = {
    ERROR: (state, err) => {
        state.runtime.error = err;
    },
    QUEUE_PUSH: (state) => {
        state.runtime.error = '';
        state.runtime.queue.push(Date.now());
    },
    QUEUE_POP: (state) => {
        state.runtime.queue.pop();
    },
    SETTINGS_UPDATE: (state, settings) => {
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

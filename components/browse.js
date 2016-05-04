
const Vue = require('vue');

const template = `<div>
<xportal></xportal>
<router-view></router-view>
</div>`;

module.exports = Vue.extend({
    template,
    components: {
        xportal: require('./portal')
    },
    vuex: {
        getters: {

        }
    }
});

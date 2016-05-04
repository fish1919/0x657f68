
const Vue = require('vue');

const template = `<div class="row">
<div class="col-md-offset-2 col-md-8">

    <h2>About</h2>



</div>
</div>`;

module.exports = Vue.extend({
    template,
    data: () => ({}),
    vuex: {
        getters: {

        },
        actions: require('../lib/actions')
    }
});

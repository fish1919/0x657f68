
const Vue = require('vue');

const { alert } = require('vue-strap');

const template = `<nav class="navbar navbar-inverse navbar-fix-top">
<div class="container">

    <div class="navbar-header">
        <a class="navbar-brand">0x657f68</a>
    </div>

    <div>

        <ul class="nav navbar-nav">

            <li><a v-link="{ path: '/' }">Home</a></li>
            <li><a v-link="{ path: '/settings' }">Settings</a></li>
            <li><a v-link="{ path: '/about' }">About</a></li>

        </ul>

        <ul class="nav navbar-nav navbar-right">

            <li v-if="runtime.error"><a v-on:click="showAlert = true"><span class="glyphicon glyphicon-alert"></span></a></li>

            <li v-if="runtime.queue.length"><a><span class="glyphicon glyphicon-refresh spinning"></span></a></li>

            <li><a href="javascript: OpenDevTools();"><span class="glyphicon glyphicon-briefcase"></span></a></li>

        </ul>

    </div>

    <alert type="danger" placement="top" width="240px" :duration="3000" :show.sync="showAlert" dismissable>
        {{ runtime.error }}
    </alert>

</div>
</nav>`;

module.exports = Vue.extend({
    template,
    components: {
        alert
    },
    data: () => ({
        showAlert: false
    }),
    vuex: {
        getters: {
            runtime: (state) => state.runtime
        }
    }
});

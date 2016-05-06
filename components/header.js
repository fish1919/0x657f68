
const Vue = require('vue');

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

            <li v-if="runtime.error"><a title="{{ runtime.error }}"><span class="glyphicon glyphicon-alert"></span></a></li>

            <li v-if="runtime.queue.length"><a><span class="glyphicon glyphicon-refresh spinning"></span></a></li>

        </ul>

    </div>
</div>
</nav>`;

module.exports = Vue.extend({
    template,
    data: () => ({}),
    vuex: {
        getters: {
            runtime: (state) => state.runtime
        }
    }
});

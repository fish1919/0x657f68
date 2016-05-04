
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
            <li><a>{{ error }}</a></li>
        </ul>

    </div>
</div>
</nav>`;

module.exports = Vue.extend({
    template,
    data: () => ({}),
    vuex: {
        getters: {
            error: (state) => state.runtime.error
        }
    }
});

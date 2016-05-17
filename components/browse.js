
const { dirname } = require('path');

const Vue = require('vue');

const template = `<div>

<xportal></xportal>

<div class="row">

    <nav class="col-md-offset-2 col-md-8">
        <ul class="pager">

            <li class="previous"><a v-on:click="JumpUp()">&uarr; Up</a></li>
            <li class="previous"><a href="javascript:window.history.back();">&larr; Back</a></li>
            <li v-if="$route.name == 'Browse'"><a v-bind:title="$route.query">Page {{ $route.params.pageIdx }}</a></li>
            <li v-if="$route.name == 'Detail'"><a>{{ $route.params.url | decodeURIComponent | decodeURIComponent }}, page {{ $route.params.pageIdx }}</a></li>
            <li v-if="$route.name == 'View'"><a>{{ $route.params.url | decodeURIComponent }}, page {{ $route.params.pageIdx }}, image {{ $route.params.imageIdx }}</a></li>
            <li class="next"><a href="javascript:window.history.forward();">Forward &rarr;</a></li>

        </ul>
    </nav>

</div>

<router-view></router-view>

</div>`;

Vue.filter('decodeURIComponent', function(value) {
    return decodeURIComponent(value);
});

module.exports = Vue.extend({
    template,
    components: {
        xportal: require('./portal')
    },
    data: () => ({}),
    methods: {
        JumpUp: function() {
            this.$route.router.go(dirname(this.$route.path));
        }
    },
    vuex: {
        getters: {

        }
    }
});

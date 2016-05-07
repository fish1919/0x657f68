
const { dirname } = require('path');

const Vue = require('vue');

const template = `<div>

<xportal></xportal>

<div class="row">

    <nav class="col-md-offset-2 col-md-8">
        <ul class="pager">

            <li class="previous"><a v-on:click="JumpUp()">&uarr; Up</a></li>
            <li class="previous"><a href="javascript:window.history.back();">&larr; Back</a></li>
            <li><a>{{ route }}</a></li>
            <li class="next"><a href="javascript:window.history.forward();">Forward &rarr;</a></li>

        </ul>
    </nav>

</div>

<router-view></router-view>

</div>`;

module.exports = Vue.extend({
    template,
    components: {
        xportal: require('./portal')
    },
    data: () => ({
        route: ''
    }),
    methods: {
        JumpUp: function() {
            this.$route.router.go(dirname(this.route));
        }
    },
    route: {
        data: function(transition) {
            return transition.next({
                route: transition.to.path
            });
        }
    },
    vuex: {
        getters: {

        }
    }
});

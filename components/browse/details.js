
const Vue = require('vue');

const template = `<div class="row">
<div class="col-xs-6 col-sm-4 col-md-3 col-lg-2" v-for="image of detailResult.Images">

    <a class="thumbnail" style="text-align: center;" v-link="{ path: '/browse/resources/' + encodeURIComponent(detailResult.Url) + '/' + detailResult.PageIdx + '/' + $index }" v-bind:style="{ height: imageHeight + 'px' }">

        <div style="margin: auto;" v-bind:style="{ backgroundImage: 'url('+image.ImageUrl+')', width: image.Width+'px', height: image.Height+'px', backgroundPositionX: '-'+image.OffsetX+'px' }"></div>

    </a>

</div>
</div>`;

module.exports = Vue.extend({
    template,
    data: () => ({}),
    computed: {
        imageHeight: function() {
            return Math.max.apply(null, this.detailResult.Images.map((image) => image.Height)) + 8;
        }
    },
    route: {
        data: function(transition) {

            const url = decodeURIComponent(transition.to.params.url);
            const pageIdx = transition.to.params.pageIdx;

            this.Detail(url, pageIdx, (err, detailResult) => transition.next());

        }
    },
    vuex: {
        getters: {
            detailResult: (state) => state.runtime.detailResult
        },
        actions: require('../../lib/actions')
    }
});

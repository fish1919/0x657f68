
const Vue = require('vue');

const template = `<div class="row">

<nav class="col-md-offset-2 col-md-10">

    <ul class="pagination">

        <li v-bind:class="{ disabled: detailResult.PageIdx == 0 }"><a v-on:click="BrowsePrevious()">&larr;</a></li>

        <li v-for="pageIdx of pageIndices" v-bind:class="{ active: pageIdx == detailResult.PageIdx }">
            <a v-on:click="BrowseJump(pageIdx)">{{ pageIdx }}</a>
        </li>

        <li v-bind:class="{ disabled: detailResult.PageIdx == detailResult.PageCount - 1 }"><a v-on:click="BrowseNext()">&rarr;</a></li>

    </ul>

</nav>

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
        pageIndices: function() {
            return this.detailResult.PageIdx || this.detailResult.PageIdx == 0 ? [0, 1, 2, 3, 4, 5, 6, 7, 8].map((val) => this.detailResult.PageIdx + val - 4).filter((val) => val >= 0 && val < this.detailResult.PageCount) : [];
        },
        imageHeight: function() {
            return Math.max.apply(null, this.detailResult.Images.map((image) => image.Height)) + 8;
        }
    },
    methods: {
        BrowsePrevious: function() {
            this.Detail(
                this.detailResult.Url,
                this.detailResult.PageIdx > 0 ? this.detailResult.PageIdx - 1 : 0
            );
        },
        BrowseJump: function(pageIdx) {
            this.Detail(
                this.detailResult.Url,
                pageIdx
            );
        },
        BrowseNext: function() {
            this.Detail(
                this.detailResult.Url,
                this.detailResult.PageIdx < this.detailResult.PageCount - 1 ? this.detailResult.PageIdx + 1 : this.detailResult.PageIdx
            );
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

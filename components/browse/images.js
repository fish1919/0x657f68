
const { basename } = require('path');

const Vue = require('vue');

const Flow = require('@evshiron/node-flow');

const LazyImage = require('../lazyImage');

const template = `<div class="row">

<nav class="col-md-offset-2 col-md-10">

    <ul class="pagination">

        <li v-bind:class="{ disabled: imageIdx == 0 }"><a v-on:click="JumpPrevious()">&larr;</a></li>

        <li v-for="pageIdx of pageIndices" v-bind:class="{ active: pageIdx == imageIdx }">
            <a v-on:click="Jump(pageIdx)">{{ pageIdx }}</a>
        </li>

        <li v-bind:class="{ disabled: imageIdx == detailResult.Images.length - 1 }"><a v-on:click="JumpNext()">&rarr;</a></li>

    </ul>

</nav>

<div class="col-xs-offset-1 col-xs-10 col-sm-offset-1 col-sm-10 col-md-offset-0 col-md-12 col-lg-offset-0 col-lg-12">

    <lazy-image class="img-thumbnail img-responsive center-block" :identity="$route.path" :url="viewResult.ImageUrl" :alt="viewResult.ImageUrl | basename" progressbar></lazy-image>

</div>

</div>`;

Vue.filter('basename', function(value) {
    return basename(value);
});

module.exports = Vue.extend({
    template,
    components: {
        LazyImage
    },
    data: () => ({
        url: '',
        pageIdx: 0,
        imageIdx: 0
    }),
    computed: {
        pageIndices: function() {
            return this.imageIdx || this.imageIdx == 0 ? [0, 1, 2, 3, 4, 5, 6, 7, 8].map((val) => this.imageIdx + val - 4).filter((val) => val >= 0 && val < this.detailResult.Images.length) : [];
        }
    },
    methods: {
        JumpPrevious: function() {
            this.Jump(this.imageIdx - 1);
        },
        Jump: function(imageIdx) {

            if(imageIdx < 0) imageIdx = 0;
            if(imageIdx > this.detailResult.Images.length - 1) imageIdx = this.detailResult.Images.length - 1;

            this.$route.router.go('/browse/resources/' + encodeURIComponent(this.url) + '/' + this.pageIdx + '/' + imageIdx);

        },
        JumpNext: function() {
            this.Jump(this.imageIdx + 1);
        }
    },
    route: {
        data: function(transition) {

            const url = decodeURIComponent(decodeURIComponent(transition.to.params.url));
            const pageIdx = parseInt(transition.to.params.pageIdx);
            const imageIdx = parseInt(transition.to.params.imageIdx);

            Flow(function*(cb) {

                if(url != this.detailResult.Url) {

                    var [err, detailResult] = yield this.Detail(url, pageIdx, cb);

                    if(err) {
                        this.Error(err);
                        return;
                    }

                    if(!detailResult.Images[imageIdx]) {
                        this.Error('ERROR_IMAGE_NOT_EXIST');
                        return;
                    }

                }
                else {

                    var detailResult = this.detailResult;

                }

                if(imageIdx < 0) imageIdx = 0;
                if(imageIdx > detailResult.Images.length - 1) imageIdx = detailResult.Images.length - 1;

                const imageUrl = detailResult.Images[imageIdx].Url;

                var [err, viewResult] = yield this.View(imageUrl, url, cb);

                if(err) {
                    this.Error(err);
                    return;
                }

                return transition.next({ url, pageIdx, imageIdx });

            }.bind(this));

        }
    },
    vuex: {
        getters: {
            detailResult: (state) => state.runtime.detailResult,
            viewResult: (state) => state.runtime.viewResult
        },
        actions: require('../../js/actions')
    }
});


const Vue = require('vue');

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

<div class="col-xs-offset-1 col-xs-10 col-sm-offset-2 col-sm-8 col-md-offset-2 col-md-8 col-lg-12">

    <img class="img-thumbnail img-responsive center-block" v-bind:src="viewResult.ImageUrl" />

</div>

</div>`;

module.exports = Vue.extend({
    template,
    data: () => ({
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

            this.View(
                this.detailResult.Images[imageIdx].Url,
                this.detailResult.Url,
                (err, viewResult) => {

                    if(err) {
                        return;
                    }

                    this.imageIdx = imageIdx;

                }
            );

        },
        JumpNext: function() {
            this.Jump(this.imageIdx + 1);
        }
    },
    route: {
        data: function(transition) {

            const url = decodeURIComponent(transition.to.params.url);
            const pageIdx = parseInt(transition.to.params.pageIdx);
            const imageIdx = parseInt(transition.to.params.imageIdx);

            this.Detail(url, pageIdx, (err, detailResult) => {

                if(err) {
                    return;
                }

                if(!detailResult.Images[imageIdx]) {
                    this.Error('ERROR_IMAGE_NOT_EXIST');
                    return;
                }

                const imageUrl = detailResult.Images[imageIdx].Url;

                this.View(imageUrl, url, (err, viewResult) => {

                    transition.next({ imageIdx });

                });

            });

        }
    },
    vuex: {
        getters: {
            detailResult: (state) => state.runtime.detailResult,
            viewResult: (state) => state.runtime.viewResult
        },
        actions: require('../../lib/actions')
    }
});

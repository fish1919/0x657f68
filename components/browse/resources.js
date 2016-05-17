
const Vue = require('vue');

const LazyImage = require('../lazyImage');

const template = `<div class="row">

<nav class="col-md-offset-2 col-md-10">

    <ul class="pagination">

        <li v-bind:class="{ disabled: browseResult.PageIdx == 0 }"><a v-on:click="JumpPrevious()">&larr;</a></li>

        <li v-for="pageIdx of pageIndices" v-bind:class="{ active: pageIdx == browseResult.PageIdx }">
            <a v-on:click="Jump(pageIdx)">{{ pageIdx }}</a>
        </li>

        <li v-bind:class="{ disabled: browseResult.PageIdx == browseResult.PageCount - 1 }"><a v-on:click="JumpNext()">&rarr;</a></li>

    </ul>

</nav>

<div v-if="settings.viewMode == 'list'">

    <div class="list-group">

        <div class="list-group-item" v-for="resource of browseResult.Resources" v-on:mouseover="PreviewSetImageUrl(resource.ImageUrl)" v-on:mouseleave="PreviewSetImageUrl('')">

            <span class="label label-default">{{ resource.Type }}</span>
            <span class="label label-success"><a v-link="{ path: '/browse/torrents/' + encodeURIComponent(resource.TorrentsUrl) }">Torrents</a></span>
            <span><a v-link="{ path: '/browse/resources/' + encodeURIComponent(resource.Url) + '/0' }">{{ resource.Name }}</a></span>

        </div>

    </div>

    <img class="img-rounded" v-el:preview v-if="preview.imageUrl" v-bind:src="preview.imageUrl" v-bind:style="preview.styles" />

</div>

<div v-if="settings.viewMode == 'gallery'">

    <div class="col-xs-6 col-sm-4 col-md-3 col-lg-2" v-for="resource of browseResult.Resources">

        <div class="thumbnail" title="{{ resource.Name }}" style="height: 276px; max-height: 276px; overflow: hidden;">

            <a v-link="{ path: '/browse/resources/' + encodeURIComponent(resource.Url) + '/0' }">
                <img class="center-block" v-bind:src="resource.ImageUrl.replace('http://', 'ximage://')" style="height: 180px;" />
            </a>

            <div class="caption">

                <span class="label label-default">{{ resource.Type }}</span>
                <span class="label label-success"><a v-link="{ path: '/browse/torrents/' + encodeURIComponent(resource.TorrentsUrl) }">Torrents</a></span>
                <span>{{ resource.Name }}</span>

            </div>

        </div>

    </div>

</div>

</div>`;

module.exports = Vue.extend({
    template,
    components: {
        LazyImage
    },
    data: () => ({
        pageIdx: 0,
        preview: {
            imageUrl: '',
            styles: {
                position: 'absolute',
                left: 0,
                top: 0,
                zIndex: 1024,
                pointerEvents: 'none'
            }
        }
    }),
    computed: {
        pageIndices: function() {
            return this.browseResult.PageIdx || this.browseResult.PageIdx == 0 ? [0, 1, 2, 3, 4, 5, 6, 7, 8].map((val) => this.browseResult.PageIdx + val - 4).filter((val) => val >= 0 && val < this.browseResult.PageCount) : [];
        }
    },
    created: function() {
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
    },
    destroyed: function() {
        window.removeEventListener('mousemove', this.onMouseMove.bind(this));
    },
    methods: {
        onMouseMove: function(event) {

            if(this.$els.preview) {

                this.preview.styles.left = event.pageX - this.$els.preview.offsetWidth / 1.2;
                this.preview.styles.top = event.pageY - this.$els.preview.offsetHeight / 1.2;

            }

        },
        JumpPrevious: function() {
            this.Jump(this.browseResult.PageIdx - 1);
        },
        Jump: function(pageIdx) {
            this.$route.router.go('/browse/' + pageIdx);
        },
        JumpNext: function() {
            this.Jump(this.browseResult.PageIdx + 1);
        },
        PreviewSetImageUrl: function(imageUrl) {
            this.preview.imageUrl = imageUrl;
        }
    },
    route: {
        data: function(transition) {

            const pageIdx = parseInt(transition.to.params.pageIdx);

            if(this.browseResult.PageCount) {

                if(pageIdx < 0) pageIdx = 0;
                if(pageIdx > this.browseResult.PageCount - 1) pageIdx = this.browseResult.PageCount - 1;

                this.Browse(
                    this.browseResult.IsExtra,
                    this.browseResult.Keywords,
                    this.browseResult.Filters,
                    pageIdx,
                    (err, browseResult) => {

                        if(err) {
                            return;
                        }

                        transition.next({ pageIdx });

                    }
                );

            }
            else {

                this.Browse(false, '', {
                        nonh: true
                    }, 0, (err, browseResult) => {

                        if(err) {
                            return;
                        }

                        transition.next({ pageIdx });

                    }
                );

            }

        }
    },
    vuex: {
        getters: {
            browseResult: (state) => state.runtime.browseResult,
            settings: (state) => state.settings
        },
        actions: require('../../js//actions')
    }
});

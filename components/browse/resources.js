
const Vue = require('vue');

const template = `<div class="row">

<div v-if="settings.viewMode == 'list'">

    <div class="list-group">

        <div class="list-group-item" v-for="resource of browseResult.Resources" v-on:mouseover="SetPreviewImageUrl(resource.ImageUrl)" v-on:mouseleave="SetPreviewImageUrl('')">

            <span class="label label-default">{{ resource.Type }}</span>
            <span class="label label-success"><a v-link="{ path: '/browse/torrents/' + encodeURIComponent(resource.TorrentsUrl) }">Torrents</a></span>
            <span><a v-link="{ path: '/browse/resources/' + encodeURIComponent(resource.Url) + '/0' }">{{ resource.Name }}</a></span>

        </div>

    </div>

    <img class="img-rounded" v-el:preview v-if="preview.imageUrl" v-bind:src="preview.imageUrl" v-bind:style="preview.styles" />

</div>

<div v-if="settings.viewMode == 'gallery'">

    <div class="col-sm-4 col-md-3" v-for="resource of browseResult.Resources">

        <div class="thumbnail" title="{{ resource.Name }}" style="height: 276px; max-height: 276px; overflow: hidden;">

            <a v-link="{ path: '/browse/resources/' + encodeURIComponent(resource.Url) + '/0' }">
                <img style="min-height: 180px; max-height: 180px;" v-bind:src="resource.ImageUrl" />
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
    data: () => ({
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
        SetPreviewImageUrl: function(imageUrl) {
            this.preview.imageUrl = imageUrl;
        }
    },
    vuex: {
        getters: {
            browseResult: (state) => state.runtime.browseResult,
            settings: (state) => state.settings
        },
        actions: require('../../lib/actions')
    }
});


const Vue = require('vue');

const { progressbar } = require('vue-strap');

const { ImageRequest } = require('../lib/hentai');

const template = `<div>

<div class="progress" v-if="progressbar && progress < 100">
  <progressbar :type="progress < 90 ? 'primary' : 'success'" :now="progress" striped animated></progressbar>
</div>

<img v-el:image class="{{ class }}" v-bind:src="src" v-bind:style="style" />

</div>`;

module.exports = Vue.extend({
    template,
    components: {
        progressbar
    },
    props: {
        class: {
            type: String
        },
        style: {
            type: String
        },
        identity: {
            type: String,
            require: true
        },
        url: {
            type: String,
            require: true
        },
        progressbar: {
            type: Boolean,
            default: false
        }
    },
    data: () => ({
        src: '',
        progress: 0
    }),
    watch: {
        url: function(newValue, oldValue) {

            if(newValue == oldValue) {
                return;
            }

            return this.$emit('urlChanged', newValue);

        }
    },
    ready: function() {

        const load = () => {

            this.ImageRequest(this.url, {
                _identity: this.identity
            }, (err, size) => {

                if(err) {
                    return;
                }

            }, (progress) => {
                this.progress = progress.percentage * 100;
            }, (err, id, res, body) => {

                if(err) {
                    return;
                }

                this.progress = 100;
                this.src = 'data:image/jpeg;base64,' + body.toString('base64');

            });

        };

        // The url isn't updated when ready.
        // See also: https://github.com/vuejs/vue/issues/2397.

        if(this.url && this.url.startsWith('http')) {
            load();
        }
        else {
            this.$on('urlChanged', (url) => load());
        }

    },
    vuex: {
        actions: require('../lib/actions')
    }
});



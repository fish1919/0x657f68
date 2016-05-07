
const Vue = require('vue');

const { progressbar } = require('vue-strap');

const { ImageRequest } = require('../lib/hentai');

const template = `<div>

<div class="progress" v-if="progress < 100">
  <progressbar :type="progress < 90 ? 'primary' : 'success'" :now="progress" striped animated></progressbar>
</div>

<img v-el:image class="{{ class }}" v-bind:src="src" />

</div>`;

module.exports = Vue.extend({
    template,
    components: {
        progressbar
    },
    props: [ 'class', 'identity', 'url' ],
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

        // The url isn't updated when ready.
        // See also: https://github.com/vuejs/vue/issues/2397.

        this.$on('urlChanged', (url) => {

            this.ImageRequest(this.url, {
                _identity: this.identity
            }, (err, size) => {

                if(err) {
                    return;
                }

            }, (progress) => {
                this.progress = progress.percentage * 100;
            }, (err, res, body) => {

                if(err) {
                    return;
                }

                this.progress = 100;
                this.src = 'data:image/jpeg;base64,' + body.toString('base64');

            });

        });

    },
    vuex: {
        actions: require('../lib/actions')
    }
});




const Vue = require('vue');

const template = `<div class="row">
<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">

    <img class="img-responsive center-block" v-bind:src="viewResult.ImageUrl" />

</div>
</div>`;

module.exports = Vue.extend({
    template,
    data: () => ({}),
    route: {
        data: function(transition) {

            const url = decodeURIComponent(transition.to.params.url);
            const pageIdx = transition.to.params.pageIdx;
            const imageIdx = transition.to.params.imageIdx;

            this.Detail(url, pageIdx, (err, detailResult) => {

                if(err) {

                    alert(err);
                    return;

                }

                if(!detailResult.Images[imageIdx]) {

                    this.$store.dispatch({
                        type: 'ERROR',
                        payload: 'ERROR_IMAGE_NOT_EXIST'
                    });
                    return;

                }

                const imageUrl = detailResult.Images[imageIdx].Url;

                this.View(imageUrl, url, (err, viewResult) => transition.next());

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

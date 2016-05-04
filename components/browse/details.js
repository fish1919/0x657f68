
const Vue = require('vue');

const template = `<div class="row">
<div class="col-sm-4 col-md-3" v-for="image of detailResult.Images">

    <a class="thumbnail" style="text-align: center;" v-link="{ path: '/browse/resources/' + encodeURIComponent(detailResult.Url) + '/' + detailResult.PageIdx + '/' + $index }">

        <div style="margin: auto;" v-bind:style="{ backgroundImage: 'url('+image.ImageUrl+')', width: image.Width+'px', height: image.Height+'px', backgroundPositionX: '-'+image.OffsetX+'px' }"></div>

    </a>

</div>
</div>`;

module.exports = Vue.extend({
    template,
    data: () => ({}),
    vuex: {
        getters: {
            detailResult: (state) => state.runtime.detailResult
        },
        actions: require('../../lib/actions')
    }
});

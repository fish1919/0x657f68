
const Vue = require('vue');

const template = `<div class="row">

    <form class="col-md-offset-2 col-md-8">

        <div class="checkbox">

            <label><input type="checkbox" v-model="useExtra" /> Extra</label>

        </div>

        <div class="checkbox">

            <label><input type="checkbox" v-model="filters.doujinshi" /> Doujinshi</label>
            <label><input type="checkbox" v-model="filters.manga" /> Manga</label>
            <label><input type="checkbox" v-model="filters.artistcg" /> Artist CG</label>
            <label><input type="checkbox" v-model="filters.gamecg" /> Game CG</label>
            <label><input type="checkbox" v-model="filters.western" /> Western</label>
            <label><input type="checkbox" v-model="filters.nonh" /> Non H</label>
            <label><input type="checkbox" v-model="filters.imageset" /> Image Set</label>
            <label><input type="checkbox" v-model="filters.cosplay" /> Cosplay</label>
            <label><input type="checkbox" v-model="filters.asianporn" /> Asian Porn</label>
            <label><input type="checkbox" v-model="filters.misc" /> Misc</label>

        </div>

        <div class="form-group">

            <div class="input-group">

                <input type="text" class="form-control" v-model="keywords" placeholder="Keywords" style="width: 70%;" />
                <input type="text" class="form-control" v-model="pageIdx" placeholder="PageIndex" style="width: 30%;" />

                <div class="input-group-btn">
                    <button type="button" class="btn btn-primary" v-on:click="Search()">Browse</button>
                </div>

            </div>

        </div>

    </form>

</div>`;

module.exports = Vue.extend({
    template,
    data: () => ({
        useExtra: false,
        filters: {
            doujinshi: false,
            manga: false,
            artistcg: false,
            gamecg: false,
            western: false,
            nonh: true,
            imageset: false,
            cosplay: false,
            asianporn: false,
            misc: false
        },
        keywords: '',
        pageIdx: '0'
    }),
    methods: {
        Search: function() {

            this.$route.router.go({
                path: `/browse/${ this.pageIdx }`,
                query: {
                    useExtra: this.useExtra,
                    keywords: this.keywords,
                    filters: JSON.stringify(this.filters),
                }
            })
        }
    },
    vuex: {
        getters: {

        },
        actions: require('../js/actions')
    }
});

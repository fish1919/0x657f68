
const Vue = require('vue');

const { accordion, panel } = require('vue-strap');

const template = `<div class="row">
<div class="col-md-offset-2 col-md-8">

    <h2>Settings</h2>

    <form>

        <accordion>

            <panel header="Authorization" :is-open="true">

                <div class="form-group">

                    <label>ipb_member_id: </label>
                    <input type="text" class="form-control" v-model="form.ipb_member_id" />

                </div>

                <div class="form-group">

                    <label>ipb_pass_hash: </label>
                    <input type="text" class="form-control" v-model="form.ipb_pass_hash" />

                </div>

            </panel>

            <panel header="Network" :is-open="true">

                <div class="form-group">

                    <label>Proxy: </label>
                    <input type="text" class="form-control" v-model="form.proxy" />

                </div>

            </panel>

            <panel header="View" :is-open="true">

                <div class="form-group">

                    <label>View Mode: </label>

                    <div class="radio">
                        <label><input type="radio" value="list" v-model="form.viewMode" /> List</label>
                    </div>

                    <div class="radio">
                        <label><input type="radio" value="gallery" v-model="form.viewMode" /> Gallery</label>
                    </div>

                </div>

            </panel>

        </accordion>

        <div>

            <button type="button" class="btn btn-default" v-on:click="Reset()">Reset</button>
            <button type="button" class="btn btn-primary" v-on:click="UpdateSettings(form)">Save</button>

        </div>

    </form>

</div>
</div>`;

module.exports = Vue.extend({
    template,
    components: {
        accordion, panel
    },
    data: () => ({
        form: {
            ipb_member_id: '',
            ipb_pass_hash: '',
            proxy: '',
            viewMode: ''
        }
    }),
    methods: {
        Reset: function() {
            this.form = Object.assign({}, this.settings);
        }
    },
    route: {
        data: function(transition) {

            this.Reset();

            return transition.next();

        }
    },
    vuex: {
        getters: {
            settings: (state) => state.settings
        },
        actions: require('../lib/actions')
    }
});

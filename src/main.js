import Vue from "vue"
import App from "./App.vue"
import {BootstrapVue} from 'bootstrap-vue'
import {initContract} from "./utils"
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueLoading from 'vue-loading-overlay';

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'vue-loading-overlay/dist/vue-loading.css'

Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(VueAxios, axios)
Vue.use(VueLoading);

window.nearInitPromise = initContract()
  .then(() => {

    new Vue({
      render: h => h(App),
    }).$mount("#app")

  })
  
import Vue from 'vue';
import App from './AddressSuggest.vue';

import store from '../../../_data/tsp-store';

if (document.getElementById('address-search-appid')) {
  Vue.config.productionTip = false;
  new Vue({
    store,
    render: h => h(App),
  }).$mount('#address-search-appid');
}

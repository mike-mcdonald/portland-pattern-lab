import Vue from 'vue';
import Map from './Map.vue';

import store from '../../../_data/tsp-store';

if (document.getElementById('classification-mapid')) {
  Vue.config.productionTip = false;
  new Vue({
    store,
    render: h => h(Map)
  }).$mount('#classification-mapid');
}

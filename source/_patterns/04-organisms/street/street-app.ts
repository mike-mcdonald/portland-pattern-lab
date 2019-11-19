import Vue from 'vue';
import App from './App.vue';

import store from '../../../_data/tsp-store';
//import router from './router';

if (document.getElementById('streets-appid')) {
  Vue.config.productionTip = false;
  new Vue({
    store,
    //router,
    render: h => h(App)
  }).$mount('#streets-appid');
}

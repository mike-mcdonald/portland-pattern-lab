import Vue from 'vue';
import App from './App.vue';
import './esriconfig';

if (document.getElementById("address-search-appid")) {
    Vue.config.productionTip = false
    new Vue({
        render: h => h(App),
    }).$mount('#address-search-appid');
}


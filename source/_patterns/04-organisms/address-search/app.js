import Vue from "vue";
import App from "./App.vue";

if (document.getElementById("address-search-appid")) {
  Vue.config.productionTip = false;
  new Vue({
    render: h => h(App)
  }).$mount("#address-search-appid");
}

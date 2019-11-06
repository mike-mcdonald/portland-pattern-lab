import Vue from "vue";
import Map from "./Map.vue";
import "./esriconfig";

if (document.getElementById("classification-mapid")) {
  Vue.config.productionTip = false;
  new Vue({
    render: h => h(Map)
  }).$mount("#classification-mapid");
}
var t = {};

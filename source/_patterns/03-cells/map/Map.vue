<template>
  <div ref="mapid" class="relative h-full w-full">
    <slot></slot>
  </div>
</template>

<script>
import Map from "esri/Map";
import MapView from "esri/views/MapView";

import { layer, map } from "./data";
const wkt = "";

export default {
  name: "Map",
  components: {},
  mounted: function() {
    const el = this.$refs["mapid"];
    const view = new MapView({
      container: el,
      map: map
    });

    layer
      .when(function() {
        return layer.queryExtent();
      })
      .then(function(response) {
        view.goTo(response.extent);
      });
  }
};
</script>

<style lang="scss">
@import url("https://js.arcgis.com/4.12/esri/themes/light/main.css");

.portland-map-app {
  @appl;
}
@media print {
  .esri-ui {
    display: none;
  }

  .esri-view-user-storage {
    display: none;
  }
}
</style>

<template>
  <div ref="mapid" class="relative h-full w-full">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import Map from "esri/Map";
import Extent from "esri/geometry/Extent";
import Layer from "esri/layers/Layer";
import MapView from "esri/views/MapView";
import Expand from "esri/widgets/Expand";
import Legend from "esri/widgets/Legend";

import { layer, map } from "./data";
const wkt = "";

export default Vue.extend({
  name: "Map",
  props: ["layers"],
  components: {},
  mounted: function() {
    const el = this.$refs["mapid"];
    const view = new MapView({
      container: el,
      map: map
    });

    view.extent = new Extent({
      xmin: -13674088.5469,
      ymin: 5689892.284199998,
      xmax: -13633591.503800001,
      ymax: 5724418.291699998,
      spatialReference: {
        wkid: 102100
      }
    });

    this.layers = this.layers || [layer];

    map.layers = this.layers;

    for (const layer of this.layers) {
      layer
        .when(function() {
          return layer.queryExtent();
        })
        .then(function(response) {
          view.goTo(response.extent);
        });
    }

    const legend = new Legend({
      view,
      layerInfos: this.layers.map((l, i) => {
        return {
          layer: l
        };
      })
    });

    const expand = new Expand({
      content: legend
    });

    view.ui.add(legend, "bottom-left");
  }
});
</script>

<style lang="scss">
@import url("https://js.arcgis.com/4.12/esri/themes/light/main.css");

.portland-map-app {
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

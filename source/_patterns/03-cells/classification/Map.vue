<template>
  <div class="h-full">
    <section class="h-full">
      <div ref="map" class="relative h-full w-full"></div>
    </section>
    <div ref="top-right">
      <slot name="top-right">
        <button v-if="!showSettings" class="h-8 w-8 p-1 bg-white" v-on:click="showSettings = true;">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-6 w-6"
          >
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>
        </button>
        <div v-if="showSettings" class="p-2 bg-white">
          <header class="flex items-baseline justify-between">
            <h2 class="text-2xl">Settings</h2>
            <button v-on:click="showSettings = false;">X</button>
          </header>
          <main class="overflow-y-auto">
            <header class="flex items-baseline justify-between">
              <h3 class="text-xl">Layers</h3>
            </header>
            <checkbox title="Street design classification" />
            <checkbox title="Street design classification" />
            <checkbox title="Street design classification" />
            <checkbox title="Street design classification" />
            <checkbox title="Street design classification" />
            <checkbox title="Street design classification" />
          </main>
        </div>
      </slot>
    </div>
    <div ref="bottom-left">
      <slot name="bottom-left"></slot>
    </div>
    <div ref="bottom-right">
      <slot name="bottom-right">
        <div class="h-64 w-64 border rounded overflow-y-auto bg-white">{{ extent }}</div>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import Map from "esri/Map";
import watchUtils from "esri/core/watchUtils";
import Extent from "esri/geometry/Extent";
import Polyline from "esri/geometry/Polyline";
import Graphic from "esri/Graphic";
import GraphicsLayer from "esri/layers/GraphicsLayer";
import SimpleFillSymbol from "esri/symbols/SimpleFillSymbol";
import SimpleLineSymbol from "esri/symbols/SimpleLineSymbol";
import MapView from "esri/views/MapView";

import Checkbox from "../../02-molecules/form/Checkbox.vue";

import { layers, map } from "./data";

import store from "../../../_data/tsp-store";

const wkt = "";

export default Vue.extend({
  name: "Map",
  data: function() {
    return {
      extent: "",
      layers,
      showSettings: false
    };
  },
  components: {
    Checkbox
  },
  mounted: function() {
    const el = this.$refs["map"];
    const view = new MapView({
      container: el,
      map: store.state.map
    });

    view.extent = new Extent({
      spatialReference: { wkid: 102100 },
      xmin: -13656940.502309779,
      ymin: 5703052.172158225,
      xmax: -13656330.200412115,
      ymax: 5703440.328942453
    });

    map.layers = this.layers;

    view.ui.add(this.$refs["top-right"], "top-right");
    view.ui.add(this.$refs["bottom-left"], "bottom-left");
    view.ui.add(this.$refs["bottom-right"], {
      position: "bottom-right",
      index: 2
    });

    view.watch("extent", (newValue, oldValue, propertyName, target) => {
      this.extent = JSON.stringify(newValue, null, 2);
    });

    const streetGraphic = new Graphic({
      geometry: new Polyline({
        paths: [
          [-122.67970077639984, 45.517080607879706],
          [-122.68005927336847, 45.51640709738621]
        ],
        spatialReference: {
          wkid: 4326
        }
      }),
      symbol: new SimpleLineSymbol({
        color: "#b8dbdb",
        width: 6
      })
    });

    const graphicsLayer = new GraphicsLayer({
      graphics: [streetGraphic]
    });

    store.state.map.layers.add(graphicsLayer);

    view.goTo(streetGraphic);
  }
});
</script>

<style lang="scss">
@import url("https://js.arcgis.com/4.12/esri/themes/light/main.css");

@media print {
  .esri-ui {
    display: none;
  }

  .esri-view-user-storage {
    display: none;
  }
}
</style>

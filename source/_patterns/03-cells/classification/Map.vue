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
        <button v-if="!showLegend" class="h-8 w-8 p-1 bg-white" v-on:click="showLegend = true;">
          <!-- This is from feather.  Their site is here: https://www.feathericons.com -->
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
        <div v-show="showLegend" class="bg-white h-64 overflow-y-auto">
          <header class="p-2 flex items-baseline justify-between sticky top-0 bg-gray-100">
            <h2 class="m-0 text-2xl">Legend</h2>
            <button v-on:click="showLegend = false;">X</button>
          </header>
          <main ref="legend" class="overflow-y-auto"></main>
        </div>
      </slot>
    </div>
  </div>
</template>

<script lang='ts'>
import Vue from "vue";

import Map from "esri/Map";
import Extent from "esri/geometry/Extent";
import Polyline from "esri/geometry/Polyline";
import Graphic from "esri/Graphic";
import GraphicsLayer from "esri/layers/GraphicsLayer";
import SimpleLineSymbol from "esri/symbols/SimpleLineSymbol";
import MapView from "esri/views/MapView";
import Legend from "esri/widgets/Legend";

import Checkbox from "../../02-molecules/form/Checkbox.vue";

import store from "../../../_data/tsp-store";

export default Vue.extend({
  name: "Map",
  data: function() {
    return {
      extent: store.state.extent,
      layers: store.state.layers,
      showSettings: false,
      showLegend: false
    };
  },
  components: {
    Checkbox
  },
  mounted: function() {
    const view = new MapView({
      container: this.$refs["map"],
      map: store.state.map
    });

    store.actions.setView(view);

    store.actions.setExtent(
      new Extent({
        spatialReference: { wkid: 102100 },
        xmin: -13656728.731995031,
        ymin: 5703173.36547962,
        xmax: -13656594.817904502,
        ymax: 5703311.459720133
      })
    );

    store.state.view.ui.add(this.$refs["top-right"], {
      position: "top-right",
      index: 2
    });
    store.state.view.ui.add(this.$refs["bottom-left"], {
      position: "bottom-left",
      index: 2
    });
    store.state.view.ui.add(this.$refs["bottom-right"], {
      position: "bottom-right",
      index: 2
    });

    const legend = new Legend({
      view,
      container: this.$refs["legend"]
    });

    const streetGraphic = new Graphic({
      geometry: new Polyline({
        paths: [
          [
            [-122.67970077639984, 45.517080607879706],
            [-122.68005927336847, 45.51640709738621]
          ]
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

    store.actions.addLayer(graphicsLayer);
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

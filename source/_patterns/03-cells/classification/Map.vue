<template>
  <div class="h-full">
    <section class="h-full">
      <div ref="map" class="relative h-full w-full"></div>
    </section>
    <div ref="top-right">
      <slot name="top-right">
        <button v-if="!showSettings" class="p-2 bg-white" v-on:click="showSettings = true;">
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
        <div v-if="showSettings" class="bg-white h-64 overflow-y-auto">
          <header class="p-2 flex items-baseline justify-between sticky top-0 bg-gray-100">
            <h2 class="m-0 text-2xl">Settings</h2>
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
      <slot name="bottom-left">
        <div class="h-64 w-64 p-2 bg-white">
          <span>{{ JSON.stringify(extent, null, 2) }}</span>
        </div>
      </slot>
    </div>
    <div ref="bottom-right">
      <slot name="bottom-right">
        <button v-if="!showLegend" class="p-2 bg-white" v-on:click="showLegend = true;">
          <!-- This is from feather.  Their site is here: https://www.feathericons.com -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-6 w-6"
          >
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
        </button>
        <div v-show="showLegend" class="bg-white h-64 overflow-y-auto">
          <header class="p-2 flex items-baseline justify-between sticky top-0 bg-gray-100">
            <h2 class="m-0 text-2xl">Legend</h2>
            <button v-on:click="showLegend = false;">X</button>
          </header>
          <main ref="legend"></main>
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
        xmin: -13657201.014297701,
        ymin: 5702628.527716513,
        xmax: -13656122.535601832,
        ymax: 5703856.29748324
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
        color: "#00a0ae",
        width: 6
      })
    });

    const graphicsLayer = new GraphicsLayer({
      graphics: [streetGraphic]
    });

    store.actions.addLayer(graphicsLayer);

    store.state.view.watch("extent", newValue => {
      this.extent = newValue;
    });
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

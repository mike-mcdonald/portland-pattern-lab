<template>
  <div class="h-full">
    <section class="h-full">
      <div ref="map" class="relative h-full w-full" />
    </section>
    <div ref="top-right">
      <slot name="top-right">
        <button v-if="!showSettings" class="p-2 bg-white" @click="showSettings = true">
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
        <div v-if="showSettings" class="bg-white h-64 overflow-y-auto">
          <header class="p-2 flex items-baseline justify-between sticky top-0 bg-gray-100">
            <h2 class="m-0 text-2xl">
              Settings
            </h2>
            <button @click="showSettings = false">
              X
            </button>
          </header>
          <main class="overflow-y-auto">
            <header class="flex items-baseline justify-between">
              <h3 class="text-xl">
                Layers
              </h3>
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
        <div class="h-32 lg:h-full w-64 p-2 my-1 bg-white border rounded border-fog-900 overflow-y-auto">
          <h4>Extent</h4>
          <span>{{ extent }}</span>
        </div>
        <div class="h-32 lg:h-full w-64 p-2 my-1 bg-white border rounded border-fog-900 overflow-y-auto">
          <h4>Clicked map point</h4>
          <span>{{ clickPoint }}</span>
        </div>
        <div class="h-32 lg:h-full w-64 p-2 my-1 bg-white border rounded border-fog-900 overflow-y-auto">
          <h4>Selected graphic</h4>
          <span>{{ selectedGraphic }}</span>
        </div>
      </slot>
    </div>
    <div ref="bottom-right">
      <slot name="bottom-right">
        <button v-if="!showLegend" class="p-2 bg-white" @click="showLegend = true">
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
            <h2 class="m-0 text-2xl">
              Legend
            </h2>
            <button @click="showLegend = false">
              X
            </button>
          </header>
          <main ref="legend" />
        </div>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapMutations, mapState } from 'vuex';

import Map from 'esri/Map';
import Extent from 'esri/geometry/Extent';
import Polyline from 'esri/geometry/Polyline';
import Graphic from 'esri/Graphic';
import GraphicsLayer from 'esri/layers/GraphicsLayer';
import SimpleLineSymbol from 'esri/symbols/SimpleLineSymbol';
import MapView from 'esri/views/MapView';
import Legend from 'esri/widgets/Legend';

import Checkbox from '../../02-molecules/form/Checkbox.vue';

import { RootState } from '../../../_data/tsp-store';

export default Vue.extend({
  name: 'Map',
  components: {
    Checkbox
  },
  data: function() {
    return {
      extent: '',
      clickPoint: undefined,
      selectedGraphic: undefined,
      showSettings: false,
      showLegend: false
    };
  },
  computed: {
    ...mapState(['layers', 'basemaps'])
  },
  mounted: function() {
    const map = new Map({
      basemap: this.basemaps[1],
      layers: this.layers
    });

    const view = new MapView({
      container: this.$refs['map'] as HTMLDivElement,
      map
    });

    view.extent = new Extent({
      spatialReference: { wkid: 102100 },
      xmin: -13657201.014297701,
      ymin: 5702628.527716513,
      xmax: -13656122.535601832,
      ymax: 5703856.29748324
    });

    view.ui.add(this.$refs['top-right'] as HTMLDivElement, {
      position: 'top-right',
      index: 2
    });
    view.ui.add(this.$refs['bottom-left'] as HTMLDivElement, {
      position: 'bottom-left',
      index: 2
    });
    view.ui.add(this.$refs['bottom-right'] as HTMLDivElement, {
      position: 'bottom-right',
      index: 2
    });

    const legend = new Legend({
      view,
      container: this.$refs['legend'] as HTMLDivElement
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
        color: '#bfe7eb',
        width: 6
      })
    });

    const outlineGraphic = new Graphic({
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
        color: '#00484e',
        width: 8
      })
    });

    const graphicsLayer = new GraphicsLayer({
      graphics: [outlineGraphic, streetGraphic]
    });

    this.addLayer(graphicsLayer);

    view.watch('extent', (newValue: __esri.Extent) => {
      this.extent = JSON.stringify(newValue, null, 2);
    });

    view.on('click', (event: __esri.MapViewClickEvent) => {
      // the hitTest() checks to see if any graphics in the view
      // intersect the given screen x, y coordinates

      view.hitTest(event).then((response: __esri.HitTestResult) => {
        if (response.results.length) {
          var graphic = response.results[0].graphic;
          // do something with the result graphic
          this.selectedGraphic = graphic.toJSON();
        }
      });
    });

    this.setView(view);
  },
  methods: {
    ...mapMutations(['setView', 'addLayer'])
  }
});
</script>

<style lang="scss">
@import url('https://js.arcgis.com/4.12/esri/themes/light/main.css');

@media print {
  .esri-ui {
    display: none;
  }

  .esri-view-user-storage {
    display: none;
  }
}
</style>

<template>
  <div class="h-full">
    <section class="h-full">
      <div ref="map" class="relative h-full w-full"></div>
    </section>
    <aside>
      <div ref="top-right">
        <slot name="top-right">
          <div ref="search"></div>
        </slot>
      </div>
      <div ref="bottom-left">
        <slot name="bottom-left"></slot>
      </div>
      <div ref="bottom-right">
        <slot name="bottom-right"></slot>
      </div>
    </aside>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import Map from "esri/Map";
import Extent from "esri/geometry/Extent";
import Layer from "esri/layers/Layer";
import Locator from "esri/tasks/Locator";
import MapView from "esri/views/MapView";
import Expand from "esri/widgets/Expand";
import LayerList from "esri/widgets/LayerList";
import Legend from "esri/widgets/Legend";
import Search from "esri/widgets/Search";
import LocatorSearchSource from "esri/widgets/Search/LocatorSearchSource";

import { layer, map } from "./data";
const wkt = "";

export default Vue.extend({
  name: "Map",
  props: ["layers"],
  components: {},
  mounted: function() {
    const el = this.$refs["map"];
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

    var searchWidget = new Search({
      view: view,
      container: this.$refs["search"],
      sources: [
        new LocatorSearchSource({
          locator: new Locator({
            url:
              "https://www.portlandmaps.com/arcgis/rest/services/Public/Address_Geocoding_PDX/GeocodeServer"
          }),
          singleLineFieldName: "Single Line Input",
          name: "Portland Geocoding Service",
          placeholder: "Search Portland",
          maxResults: 3,
          maxSuggestions: 6,
          suggestionsEnabled: true,
          minSuggestCharacters: 0
        })
      ],
      includeDefaultSources: false
    });

    var layerList = new LayerList({
      view: view
    });
    // Adds widget below other elements in the top left corner of the view
    view.ui.add(layerList, {
      position: "bottom-right",
      index: 1
    });

    view.ui.add(this.$refs["top-right"], "top-right");
    view.ui.add(this.$refs["bottom-left"], "bottom-left");
    view.ui.add(this.$refs["bottom-right"], {
      position: "bottom-right",
      index: 2
    });
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

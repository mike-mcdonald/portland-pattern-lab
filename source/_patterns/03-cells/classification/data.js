import FeatureLayer from "esri/layers/FeatureLayer";
import GroupLayer from "esri/layers/GroupLayer";
import EsriMap from "esri/Map";
import { SimpleMarkerSymbol } from "esri/symbols";
import { SimpleRenderer } from "esri/renderers";

const url =
  "https://opendata.arcgis.com/datasets/ad5ed4193110452aac2d9485df3298e2_68.geojson";

const template = {
  title: "{FULL_NAME}",
  content: "From {LEFTADD1} to {LEFTADD2} in {LCITY}, Oregon"
};

const renderer = new SimpleRenderer({
  symbol: new SimpleMarkerSymbol(
    {
      size: 6,
      color: "#f58220"
    }
  )
});

const layerURLs = new Set([
  'https://www.portlandmaps.com/arcgis/rest/services/Public/Transportation_System_Plan/MapServer/1',
  'https://www.portlandmaps.com/arcgis/rest/services/Public/Transportation_System_Plan/MapServer/2',
  'https://www.portlandmaps.com/arcgis/rest/services/Public/Transportation_System_Plan/MapServer/3'
]);

export const layer = new GroupLayer(
  'https://www.portlandmaps.com/arcgis/rest/services/Public/Transportation_System_Plan/MapServer/0'
);

for (const url of layerURLs) {
  layer.add(new FeatureLayer({
    url,
  }));
}

export const map = new EsriMap({
  basemap: "streets-navigation-vector"
});

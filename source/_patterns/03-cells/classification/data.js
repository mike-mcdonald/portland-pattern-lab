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

export const layers = [];
const transitClassLayers = new GroupLayer({
  id: "tsp-classicifations",
  title: "Street classifications"
});

const transitClassURLs = new Set([
  'https://www.portlandmaps.com/arcgis/rest/services/Public/Transportation_System_Plan/MapServer/1',
  'https://www.portlandmaps.com/arcgis/rest/services/Public/Transportation_System_Plan/MapServer/2',
  'https://www.portlandmaps.com/arcgis/rest/services/Public/Transportation_System_Plan/MapServer/3'
]);

for (const classLayer of transitClassURLs) {
  layer.add(new FeatureLayer(
    classLayer
  ));
}

export const map = new EsriMap({
  basemap: "streets-vector"
});

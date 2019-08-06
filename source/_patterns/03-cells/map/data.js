import GeoJSONLayer from "esri/layers/GeoJSONLayer";
import EsriMap from "esri/Map";
import LineSymbol from "esri/symbols/LineSymbol";

const url =
  "https://opendata.arcgis.com/datasets/ad5ed4193110452aac2d9485df3298e2_68.geojson";

const template = {
  title: "{FULL_NAME}",
  content: "From {LEFTADD1} to {LEFTADD2} in {LCITY}, Oregon"
};

const renderer = {
  type: "simple",
  symbol: new LineSymbol(
    {
      color: "#f58220"
    }
  )
};

export const layer = new GeoJSONLayer({
  url,
  copyright: "Oregon Metro; City of Portland, Oregon",
  popupTemplate: template,
  renderer
});

export const map = new EsriMap({
  basemap: "streets-vector",
  layers: [layer]
});

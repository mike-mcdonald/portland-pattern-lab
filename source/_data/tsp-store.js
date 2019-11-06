import Basemap from "esri/Basemap";
import Polyline from "esri/geometry/Polyline";
import FeatureLayer from "esri/layers/FeatureLayer";
import TileLayer from "esri/layers/TileLayer";
import GraphicsLayer from "esri/layers/GraphicsLayer";
import GroupLayer from "esri/layers/GroupLayer";
import EsriMap from "esri/Map";
import { SimpleMarkerSymbol } from "esri/symbols";
import { SimpleRenderer } from "esri/renderers";

const url =
  "https://opendata.arcgis.com/datasets/ad5ed4193110452aac2d9485df3298e2_68.geojson";

const classificationTemplate = {
  title: "{StreetName}: ({TranPlanID})",
  content: `
  <div>
    <table class="w-full table-fixed border-collapse">
      <tbody>
        <tr>
          <th class="flex content-start px-2 py-1">Traffic</th>
          <td>{Traffic}</td>
        </tr>
        <tr>
          <th class="flex content-start px-2 py-1">Transit</th>
          <td>{Transit}</td>
        </tr>
        <tr>
          <th class="flex content-start px-2 py-1">Bicycle</th>
          <td>{Bicycle}</td>
        </tr>
        <tr>
          <th class="flex content-start px-2 py-1">Pedestrian</th>
          <td>{Pedestrian}</td>
        </tr>
        <tr>
          <th class="flex content-start px-2 py-1">Freight</th>
          <td>{Freight}</td>
        </tr>
        <tr>
          <th class="flex content-start px-2 py-1">Emergency</th>
          <td>{Emergency}</td>
        </tr>
        <tr>
          <th class="flex content-start px-2 py-1">Design</th>
          <td>{Design}</td>
        </tr>
        <tr>
          <th class="flex content-start px-2 py-1">Greenscape</th>
          <td>{Greenscape}</td>
        </tr>
      </tbody>
    </table>
  </div>
  `
};

export const basemaps = [
  "https://www.portlandmaps.com/arcgis/rest/services/Public/Basemap_Color_Complete/MapServer",
  "https://www.portlandmaps.com/arcgis/rest/services/Public/Basemap_Gray_Complete/MapServer",
  "https://www.portlandmaps.com/arcgis/rest/services/Public/Basemap_Color_Complete_Aerial/MapServer"
].map(
  url =>
    new Basemap({
      baseLayers: [
        new TileLayer({
          url
        })
      ],
      title: /Basemap_([a-zA-Z_]+)/i.exec(url)[1].replace("_", " ")
    })
);

export const layers = [
  new GroupLayer({
    id: "transit-classifications",
    title: "Transit classes",
    visibilityMode: "inheirited",
    visible: true,
    layers: [
      "https://www.portlandmaps.com/arcgis/rest/services/Public/Transportation_System_Plan/MapServer/1",
      "https://www.portlandmaps.com/arcgis/rest/services/Public/Transportation_System_Plan/MapServer/2",
      "https://www.portlandmaps.com/arcgis/rest/services/Public/Transportation_System_Plan/MapServer/3"
    ].map(
      url =>
        new FeatureLayer({
          url,
          popupTemplate: classificationTemplate
        })
    )
  }),
  new FeatureLayer({
    url:
      "https://www.portlandmaps.com/arcgis/rest/services/Public/Transportation_System_Plan/MapServer/4",
    visible: false,
    popupTemplate: classificationTemplate
  }),
  new GroupLayer({
    id: "emergency-classifications",
    title: "Emergency response classes",
    visibilityMode: "inheirited",
    visible: false,
    layers: [
      "https://www.portlandmaps.com/arcgis/rest/services/Public/Transportation_System_Plan/MapServer/6",
      "https://www.portlandmaps.com/arcgis/rest/services/Public/Transportation_System_Plan/MapServer/7"
    ].map(
      url =>
        new FeatureLayer({
          url,
          popupTemplate: classificationTemplate
        })
    )
  }),
  new GroupLayer({
    id: "street-design-classifications",
    title: "Street design classes",
    visibilityMode: "inheirited",
    visible: false,
    layers: [
      "https://www.portlandmaps.com/arcgis/rest/services/Public/Transportation_System_Plan/MapServer/9",
      "https://www.portlandmaps.com/arcgis/rest/services/Public/Transportation_System_Plan/MapServer/10"
    ].map(
      url =>
        new FeatureLayer({
          url,
          popupTemplate: classificationTemplate
        })
    )
  }),
  new GroupLayer({
    id: "bicycle-classifications",
    title: "Bicycle classes",
    visibilityMode: "inheirited",
    visible: false,
    layers: [
      "https://www.portlandmaps.com/arcgis/rest/services/Public/Transportation_System_Plan/MapServer/12",
      "https://www.portlandmaps.com/arcgis/rest/services/Public/Transportation_System_Plan/MapServer/13"
    ].map(
      url =>
        new FeatureLayer({
          url,
          popupTemplate: classificationTemplate
        })
    )
  }),
  new GroupLayer({
    id: "pedestrian-classifications",
    title: "Pedestrian classes",
    visibilityMode: "inheirited",
    visible: false,
    layers: [
      "https://www.portlandmaps.com/arcgis/rest/services/Public/Transportation_System_Plan/MapServer/15",
      "https://www.portlandmaps.com/arcgis/rest/services/Public/Transportation_System_Plan/MapServer/16"
    ].map(
      url =>
        new FeatureLayer({
          url,
          popupTemplate: classificationTemplate
        })
    )
  }),
  new GroupLayer({
    id: "freight-classifications",
    title: "Freight classes",
    visibilityMode: "inheirited",
    visible: false,
    layers: [
      "https://www.portlandmaps.com/arcgis/rest/services/Public/Transportation_System_Plan/MapServer/18",
      "https://www.portlandmaps.com/arcgis/rest/services/Public/Transportation_System_Plan/MapServer/19",
      "https://www.portlandmaps.com/arcgis/rest/services/Public/Transportation_System_Plan/MapServer/20"
    ].map(
      url =>
        new FeatureLayer({
          url,
          popupTemplate: classificationTemplate
        })
    )
  })
];

export const map = new EsriMap({
  basemap: basemaps[0],
  layers: layers
});

const state = {
  debug: true,
  message: "Hello!",
  view: null,
  basemaps,
  map,
  layers
};

const actions = {
  setView(view) {
    state.view = view;
  },
  addLayer(layer) {
    state.map.add(layer);
  },
  addGraphic(graphic) {
    state.view.graphics.add(graphic);
  }
};

export default {
  state,
  actions
};

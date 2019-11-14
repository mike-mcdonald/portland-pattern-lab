import Vue from 'vue';
import Vuex from 'vuex';

import Basemap from 'esri/Basemap';
import FeatureLayer from 'esri/layers/FeatureLayer';
import TileLayer from 'esri/layers/TileLayer';
import GroupLayer from 'esri/layers/GroupLayer';
import EsriMap from 'esri/Map';

import portlandmaps from './portlandmaps-module';

import secrets from './.secrets';

export const basemaps = [
  'https://www.portlandmaps.com/arcgis/rest/services/Public/Basemap_Color_Complete/MapServer',
  'https://www.portlandmaps.com/arcgis/rest/services/Public/Basemap_Gray_Complete/MapServer',
  'https://www.portlandmaps.com/arcgis/rest/services/Public/Basemap_Color_Complete_Aerial/MapServer'
].map(
  url =>
    new Basemap({
      baseLayers: [
        new TileLayer({
          url
        })
      ],
      title: /Basemap_([a-zA-Z_]+)/i.exec(url)[1].replace('_', ' ')
    })
);

export const layers = [
  new GroupLayer({
    id: 'transit-classifications',
    title: 'Transit classes',
    visibilityMode: 'inheirited',
    visible: true,
    layers: [
      'https://www.portlandmaps.com/arcgis/rest/services/Public/Transportation_System_Plan/MapServer/1',
      'https://www.portlandmaps.com/arcgis/rest/services/Public/Transportation_System_Plan/MapServer/2',
      'https://www.portlandmaps.com/arcgis/rest/services/Public/Transportation_System_Plan/MapServer/3'
    ].map(
      url =>
        new FeatureLayer({
          url
        })
    )
  }),
  new FeatureLayer({
    url:
      'https://www.portlandmaps.com/arcgis/rest/services/Public/Transportation_System_Plan/MapServer/4',
    visible: false
  }),
  new GroupLayer({
    id: 'emergency-classifications',
    title: 'Emergency response classes',
    visibilityMode: 'inheirited',
    visible: false,
    layers: [
      'https://www.portlandmaps.com/arcgis/rest/services/Public/Transportation_System_Plan/MapServer/6',
      'https://www.portlandmaps.com/arcgis/rest/services/Public/Transportation_System_Plan/MapServer/7'
    ].map(
      url =>
        new FeatureLayer({
          url
        })
    )
  }),
  new GroupLayer({
    id: 'street-design-classifications',
    title: 'Street design classes',
    visibilityMode: 'inheirited',
    visible: false,
    layers: [
      'https://www.portlandmaps.com/arcgis/rest/services/Public/Transportation_System_Plan/MapServer/9',
      'https://www.portlandmaps.com/arcgis/rest/services/Public/Transportation_System_Plan/MapServer/10'
    ].map(
      url =>
        new FeatureLayer({
          url
        })
    )
  }),
  new GroupLayer({
    id: 'bicycle-classifications',
    title: 'Bicycle classes',
    visibilityMode: 'inheirited',
    visible: false,
    layers: [
      'https://www.portlandmaps.com/arcgis/rest/services/Public/Transportation_System_Plan/MapServer/12',
      'https://www.portlandmaps.com/arcgis/rest/services/Public/Transportation_System_Plan/MapServer/13'
    ].map(
      url =>
        new FeatureLayer({
          url
        })
    )
  }),
  new GroupLayer({
    id: 'pedestrian-classifications',
    title: 'Pedestrian classes',
    visibilityMode: 'inheirited',
    visible: false,
    layers: [
      'https://www.portlandmaps.com/arcgis/rest/services/Public/Transportation_System_Plan/MapServer/15',
      'https://www.portlandmaps.com/arcgis/rest/services/Public/Transportation_System_Plan/MapServer/16'
    ].map(
      url =>
        new FeatureLayer({
          url
        })
    )
  }),
  new GroupLayer({
    id: 'freight-classifications',
    title: 'Freight classes',
    visibilityMode: 'inheirited',
    visible: false,
    layers: [
      'https://www.portlandmaps.com/arcgis/rest/services/Public/Transportation_System_Plan/MapServer/18',
      'https://www.portlandmaps.com/arcgis/rest/services/Public/Transportation_System_Plan/MapServer/19',
      'https://www.portlandmaps.com/arcgis/rest/services/Public/Transportation_System_Plan/MapServer/20'
    ].map(
      url =>
        new FeatureLayer({
          url
        })
    )
  })
];

export const map = new EsriMap({
  basemap: basemaps[1],
  layers
});

const state = {
  debug: true,
  message: 'Hello!',
  view: null,
  portlandmaps_api_key: secrets.portlandmapsApiKey,
  basemaps,
  map,
  layers
};

const mutations = {
  setView(view) {
    state.view = view;
  },
  setExtent(extent) {
    if (state.view) {
      state.view.extent = extent;
    }
  },
  addLayer(layer) {
    state.map.add(layer);
  },
  addGraphic(graphic) {
    state.view.graphics.add(graphic);
  }
};

Vue.use(Vuex);

const store = {
  state,
  mutations,
  modules: {
    portlandmaps
  }
};

export default new Vuex.Store(store);

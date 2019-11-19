import Vue from 'vue';
import Vuex, { MutationTree, StoreOptions } from 'vuex';

import Basemap from 'esri/Basemap';
import FeatureLayer from 'esri/layers/FeatureLayer';
import TileLayer from 'esri/layers/TileLayer';
import GroupLayer from 'esri/layers/GroupLayer';

import portlandmaps from './portlandmaps-module';

import data from './data.json';

export const basemaps = [
  'https://www.portlandmaps.com/arcgis/rest/services/Public/Basemap_Color_Complete/MapServer',
  'https://www.portlandmaps.com/arcgis/rest/services/Public/Basemap_Gray_Complete/MapServer',
  'https://www.portlandmaps.com/arcgis/rest/services/Public/Basemap_Color_Complete_Aerial/MapServer'
].map(url => {
  let title = undefined;
  const matches = /Basemap_([a-zA-Z_]+)/i.exec(url);
  if (matches) {
    title = matches[1].replace('_', ' ').replace('_', ' ');
  }
  return new Basemap({
    baseLayers: [
      new TileLayer({
        url
      })
    ],
    title
  });
});

export const layers = [
  new GroupLayer({
    id: 'transit-classifications',
    title: 'Transit classes',
    visibilityMode: 'inherited',
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
    url: 'https://www.portlandmaps.com/arcgis/rest/services/Public/Transportation_System_Plan/MapServer/4',
    visible: false
  }),
  new GroupLayer({
    id: 'emergency-classifications',
    title: 'Emergency response classes',
    visibilityMode: 'inherited',
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
    visibilityMode: 'inherited',
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
    visibilityMode: 'inherited',
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
    visibilityMode: 'inherited',
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
    visibilityMode: 'inherited',
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

export interface RootState {
  view?: __esri.MapView;
  map?: __esri.Map;
  basemaps?: __esri.Basemap[];
  layers: __esri.Layer[];
  streets?: any[];
}

const state: RootState = {
  view: undefined,
  map: undefined,
  basemaps,
  layers,
  streets: data.streets
};

const mutations: MutationTree<RootState> = {
  setView(state, view) {
    state.view = view;
  },
  setExtent(state, extent) {
    if (state.view) {
      state.view.extent = extent;
    }
  },
  addLayer(state, layer) {
    state.map?.add(layer);
  },
  addGraphic(state, graphic) {
    state.view?.graphics.add(graphic);
  }
};

Vue.use(Vuex);

const store: StoreOptions<RootState> = {
  state,
  mutations,
  modules: {
    portlandmaps
  }
};

export default new Vuex.Store<RootState>(store);

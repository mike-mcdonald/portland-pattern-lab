/* eslint-disable import/no-unresolved */
import Basemap from 'esri/Basemap'
import FeatureLayer from 'esri/layers/FeatureLayer'
import GroupLayer from 'esri/layers/GroupLayer'
import TileLayer from 'esri/layers/TileLayer'
import Map from 'esri/Map'
/* eslint-enable import/no-unresolved */

const baseLayer = new TileLayer({
  url:
    'https://www.portlandmaps.com/arcgis/rest/services/Public/Basemap_Gray_Complete/MapServer',
})

const basemap = new Basemap({
  baseLayers: [baseLayer],
})

export const layers = [
  new GroupLayer({
    id: 'tsp-projects',
    title: 'TSP Projects',
    visibilityMode: 'inheirited',
    visible: false,
    layers: [
      'https://www.portlandmaps.com/arcgis/rest/services/Public/Transportation_System_Plan/MapServer/22',
      'https://www.portlandmaps.com/arcgis/rest/services/Public/Transportation_System_Plan/MapServer/23',
      'https://www.portlandmaps.com/arcgis/rest/services/Public/Transportation_System_Plan/MapServer/24',
    ].map(
      (url) =>
        new FeatureLayer({
          url,
        }),
    ),
  }),
  new GroupLayer({
    id: 'transit-classifications',
    title: 'Transit classes',
    visibilityMode: 'inheirited',
    visible: true,
    layers: [
      'https://www.portlandmaps.com/arcgis/rest/services/Public/Transportation_System_Plan/MapServer/1',
      'https://www.portlandmaps.com/arcgis/rest/services/Public/Transportation_System_Plan/MapServer/2',
      'https://www.portlandmaps.com/arcgis/rest/services/Public/Transportation_System_Plan/MapServer/3',
    ].map(
      (url) =>
        new FeatureLayer({
          url,
        }),
    ),
  }),
]

export const map = new Map({
  basemap,
})

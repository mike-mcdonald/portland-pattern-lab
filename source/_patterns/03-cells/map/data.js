/* eslint-disable import/no-unresolved */
import Basemap from 'esri/Basemap';
import FeatureLayer from 'esri/layers/FeatureLayer';
import GroupLayer from 'esri/layers/GroupLayer';
import WebTiledLayer from 'esri/layers/WebTileLayer';
import EsriMap from 'esri/Map';
/* eslint-enable import/no-unresolved */

const baseLayer = new WebTiledLayer('https://{subDomain}.tiles.mapbox.com/v3/bpsgis.iad0l35m/{level}/{col}/{row}.png', {
  id: 'city-of-portland-basemap',
  subDomains: ['a', 'b', 'c'],
  copyright: 'City of Portland via Mapbox',
});

const basemap = new Basemap({
  baseLayers: [
    baseLayer,
  ],
});

export const layers = [
  new GroupLayer({
    id: 'tsp-projects',
    title: 'TSP Projects',
    visibilityMode: 'inheirited',
    visible: true,
    layers: [
      'https://www.portlandmaps.com/arcgis/rest/services/Public/Transportation_System_Plan/MapServer/22',
      'https://www.portlandmaps.com/arcgis/rest/services/Public/Transportation_System_Plan/MapServer/23',
      'https://www.portlandmaps.com/arcgis/rest/services/Public/Transportation_System_Plan/MapServer/24',
    ].map((url) => new FeatureLayer({
      url,
    })),
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
    ].map((url) => new FeatureLayer({
      url,
      popupTemplate: {
        title: '{StreetName}',
      },
    })),
  }),
];

export const map = new EsriMap({
  basemap,
});

import EsriMap = require("esri/Map");
import MapView = require("esri/views/MapView");
import FeatureLayer = require("esri/layers/FeatureLayer");

import { widgetInit } from "./widgets/core";
import store from "./stores/app";

import {
  mapOptions,
  mapViewOptions,
  layerInfos
} from "./config";

widgetInit();

const featureInfos = layerInfos.filter(x => x.layerType === "feature");
mapOptions.layers = featureInfos.map(x => new FeatureLayer(x));

const webmap = new EsriMap(mapOptions);
mapViewOptions.map = webmap;
const view = new MapView(mapViewOptions);

store.set({ webmap, view });

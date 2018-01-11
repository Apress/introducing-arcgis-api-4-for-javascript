export const webmap = {
  webmapid: "addawebmapidhere"
};

export const mapOptions: any = {
  basemap: "dark-gray-vector"
};

export const mapViewOptions: any = {
  container: "viewDiv",
  center: [-118.244, 34.052],
  zoom: 12
};

export const layerInfos = [
  {
    id: "tri",
    title: "Toxic Release Facilities",
    layerType: "feature",
    popupTemplate: {
      title: "{FACILITY_NAME}",
      content: "{*}"
    },
    outFields: ["*"],
    url: "http://services2.arcgis.com/j80Jz20at6Bi0thr/arcgis/rest/services/LosAngelesToxicReleaseLocations/FeatureServer/0"
  }
];

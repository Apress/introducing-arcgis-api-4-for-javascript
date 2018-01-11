import MapView from 'esri/views/MapView';
import EsriMap from 'esri/Map';
import FeatureLayer from 'esri/layers/FeatureLayer';
import * as watchUtils from 'esri/core/watchUtils';

const { whenNotOnce } = watchUtils;
const fLayer = new FeatureLayer({
	portalItem: {
		id: "067627fbaae94168a6edf4e1f0739314"
	}
});



const map = new EsriMap({
	basemap: "streets",
	layers: [fLayer]
});

const view = new MapView({
	container: "viewDiv",
	map: map
});


//fLayer.load().then(_ => view.goTo(fLayer.fullExtent));

view.whenLayerView(fLayer).then(layerView => {
	whenNotOnce(layerView, "updating", _ => {
		layerView.queryExtent().then((results) => view.goTo(results));
	})
})
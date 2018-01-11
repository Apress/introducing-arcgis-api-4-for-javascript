import MapView from 'esri/views/MapView';
import WebMap from 'esri/WebMap';

const webmap = new WebMap({
	portalItem: {
		id: '2dfaf8bdb45a4dcf8511a849e4583873'
	}
});

const view = new MapView({
	map: webmap,
	container: 'viewDiv'
});

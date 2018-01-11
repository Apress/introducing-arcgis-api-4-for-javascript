import MapView from 'esri/views/MapView';
import EsriMap from 'esri/Map';
import Layer from 'esri/layers/Layer';
import GroupLayer from 'esri/layers/GroupLayer';
import LayerList from 'esri/widgets/LayerList';

const groupLayer = new GroupLayer({
	title: "Households",
	listMode: "hide-children"
});

const map = new EsriMap({
	basemap: "dark-gray",
	layers: [groupLayer]
});
const view = new MapView({
	container: "viewDiv",
	map: map,
	center: [-90, 40],
	zoom: 6
});

const layerList = new LayerList({ view });

view.ui.add(layerList, "top-right")

const fromPortal = id => Layer.fromPortalItem({
	portalItem: {
		id: id
	}
});

const layerids = [
	"837f4f8be375464a8971c56a0856198e", // vt layer
	"5a99095bc95b45a7a830c9e25a389712" // source featurelayer
];

const layers = layerids.map(fromPortal);

Promise.all(layers)
	.then(results => {
		console.log(results);
		results.forEach(x => {
			if (x.type === "feature") {
				x.minScale = 2300000;
			}
			else {
				x.maxScale = 2300000;
			}
		});
		groupLayer.addMany(results);
	})
	.catch(error => console.warn(error.message));
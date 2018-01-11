import EsriMap from 'esri/Map';
import MapView from 'esri/views/MapView';
import Layer from 'esri/layers/Layer';

const map = new EsriMap({
	basemap: "streets-navigation-vector"
});

const view = new MapView({
	map: map,
	container: "viewDiv",
	center: [-117.24, 34.05],
	zoom: 8
});

view.popup.viewModel.on("trigger-action", ({ action }) => {
	console.log(event);
	if (action.id === "alcohol-details") {
		const attributes = view.popup.viewModel.selectedFeature.attributes;
		const name = attributes.NAME;
		window.open(`https://www.google.com/search?q=${name} Beer events`);
	}
});

Layer.fromPortalItem({
	portalItem: {
		id: "c531f67a12254c27af9479d436e23850"
	}
})
.then((layer) => {
	layer.popupTemplate = {
		title: '{Name}',
		content: '{*}',
		actions: [{
				id: 'alcohol-details',
				className: 'esri-icon-description',
				title: 'Events'
		}]
	};
	map.add(layer);
})
.otherwise(err => console.log(err));

import EsriMap from 'esri/Map';
import SceneView from 'esri/views/SceneView';
import FeatureLayer from 'esri/layers/FeatureLayer';
import Home from 'esri/widgets/Home';

const wellsUrl =
	'http://services.arcgis.com/jDGuO8tYggdCCnUJ/arcgis/rest/services/CA%20Class%20II%20Injection%20Wells/FeatureServer/6';

const wellsSurfaceRenderer = {
	type: 'simple',
	symbol: {
		type: 'point-3d',
		symbolLayers: [
			{
				type: 'icon',
				material: {
					color: '#0D2644'
				},
				resource: {
					primitive: 'circle'
				},
				size: 4
			}
		]
	}
};

const wellsDepthRenderer = {
	type: 'simple',
	symbol: {
		type: 'point-3d',
		symbolLayers: [
			{
				type: 'object',
				resource: {
					primitive: 'cylinder'
				},
				width: 50
			}
		]
	},
	visualVariables: [
		{
			type: 'size',
			field: 'WellDepthA',
			axis: 'height',
			stops: [
				{
					value: 1,
					size: -0.3048 // meters!
				},
				{
					value: 10000,
					size: -3048 // meters!
				}
			]
		},
		{
			type: 'size',
			axis: 'width',
			useSymbolValue: true // sets the width to 50m
		},
		{
			type: 'color',
			field: 'WellDepthA',
			stops: [
				{
					value: 0,
					color: '#FFFCD4'
				},

				{
					value: 10000,
					color: '#FF0000'
				}
			]
		}
	]
};

// Underground wells
const wellsLyr = new FeatureLayer({
	url: wellsUrl,
	definitionExpression: 'WellDepthA > 0',
	outFields: [ '*' ],
	popupTemplate: {
		title: 'Well',
		content: '{*}'
	},
	renderer: wellsDepthRenderer,
	// Keep the cylinders from poking above the ground
	elevationInfo: {
		mode: 'relative-to-ground',
		offset: -10
	}
});

// Wells shown on surface
const wellsSurfaceLyr = new FeatureLayer({
	url: wellsUrl,
	definitionExpression: 'WellDepthA > 0',
	outFields: [ '*' ],
	popupTemplate: {
		title: 'Well',
		content: '{*}'
	},
	renderer: wellsSurfaceRenderer,
	elevationInfo: {
		mode: 'on-the-ground'
	}
});

const losAngelesExtent = {
	xmax: -13151509,
	xmin: -13160242,
	ymax: 3999804,
	ymin: 3992447,
	spatialReference: {
		wkid: 102100
	}
};

const map = new EsriMap({
	basemap: 'topo',
	layers: [ wellsLyr, wellsSurfaceLyr ]
});

const view = new SceneView({
	container: 'viewDiv',
	map: map,
	viewingMode: 'local',
	clippingArea: losAngelesExtent,
	extent: losAngelesExtent,
	constraints: {
		collision: {
			enabled: false
		},
		tilt: {
			max: 360
		}
	},
	environment: {
		atmosphere: null,
		starsEnabled: false
	}
});

const homeBtn = new Home({
	view
});

view.ui.add(homeBtn, "top-left");

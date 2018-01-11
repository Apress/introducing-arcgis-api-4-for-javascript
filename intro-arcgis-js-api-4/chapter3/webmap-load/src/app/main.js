import MapView from 'esri/views/MapView';
import WebMap from 'esri/WebMap';

const webmap = new WebMap({
	portalItem: {
		id: '2dfaf8bdb45a4dcf8511a849e4583873'
	}
});

webmap.load().then(() => {
	const layer = webmap.layers.find(({ id }) => {
		return id.includes('CensusTractPoliticalAffiliationTotals');
	});
	layer.definitionExpression = 'TOTPOP_CY > 10000';
	const view = new MapView({
		map: webmap,
		container: 'viewDiv'
	});
});

import Map from 'esri/Map';
import SceneView from 'esri/views/SceneView';

const map = new Map({ basemap: 'topo' });
const view = new SceneView({
	container: 'viewDiv',
	map,
	center: [ -118.182, 33.913 ],
	scale: 836023
});

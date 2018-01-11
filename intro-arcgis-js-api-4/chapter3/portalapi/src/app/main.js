import EsriMap from 'esri/Map';
import MapView from 'esri/views/MapView';
import Layer from 'esri/layers/Layer';
import PortalItem from 'esri/portal/PortalItem';
import esriLang from 'esri/core/lang';
import on from 'dojo/on';

// create a card template to display Portal Item Information
const template = `
	<li data-itemid="{id}" class="card block">
		<article class="card"><img src="{thumbnailUrl}" alt="Card Thumbnail">
			<hr>
			<h6>{title}</h6>
			<ul class="card-info">
				<li>{created}</li>
				<li>{owner}</li>
			</ul>
			<div class="checkbox">
				<label>
					<input type="checkbox"> Add to map
				</label>
			</div>
		</article>
	</li>
  `;
// Array of Portal Items for Layers
const layerItems = [
	'a88018dc6c8045378f65b7abeb1d5a30',
	'6df6df711e8f4b09bf7c1fcbae2afdd3',
	'f1fca09035074e95a64c49548e79e625',
	'd816e92c10bd4505bfcfbb761d5ac97d',
	'ea7ff2ac9b4d49cdbe63dbf4ba2f21cd'
];
const map = new EsriMap({
	basemap: 'streets-navigation-vector'
});
const view = new MapView({
	map,
	container: 'viewDiv',
	zoom: 12,
	center: [ -118.167, 34.0224 ]
});
// container to hold our cards
const $cardsList = document.querySelector('.cards-list');
view.when(() => {
	// Create new PortalItem instances from our list
	const portalItems = layerItems.map((id) => new PortalItem({ id }).load());
	// Wait for all PortalItem Promises to complete.
	Promise.all(portalItems).then((items) => {
		let docFrag = document.createDocumentFragment();
		// Iterate over each item to create a card for it
		items.forEach((item) => {
			// esri/lang::substitute will create a new string using the PortalItem.
			const card = esriLang.substitute(item, template);
			const elem = document.createElement('div');
			elem.innerHTML = card;
			let layer;
			// add listener for when checkbox is checked
			on(elem, 'input:click', ({ target }) => {
				if (target.checked && !layer) {
					if (item.isLayer) {
						// This static method creates layers from
						// Portal Items
						Layer.fromPortalItem({
							portalItem: item
						}).then(function(lyr) {
							// Now you can add the Layer to the map
							layer = lyr;
							map.add(lyr);
							view.extent = item.extent;
						});
					}
				} else if (target.checked && layer) {
					// Layer already created, just add it
					map.add(layer);
					view.extent = item.extent;
				} else {
					// remove the layer if unchecked
					map.remove(layer);
				}
			});
			docFrag.appendChild(elem);
		});
		// Append the completed list to the page.
		$cardsList.appendChild(docFrag);
		docFrag = undefined;
	});
});

import EsriMap from 'esri/Map';
import SceneView from 'esri/views/SceneView';
import * as watchUtils from "esri/core/watchUtils";
import Scheduler from "esri/core/Scheduler";
import on from "dojo/on";

class CameraRecorder {
	constructor(params) {
		this.view = params.view;
		this.cameras = [ null ];
		this.timer = null;
		this.watcher = null;
		this.handler = null;
		this.intervalID = null;
		this.isPlaying = false;

		this.slider = document.getElementById('slider');

		this.reverseBtn = document.getElementById('reverseBtn');
		this.reverseBtn.addEventListener('click', this.playReverse.bind(this));

		this.playBtn = document.getElementById('playBtn');
		this.playBtn.addEventListener('click', this.play.bind(this));

		this.stopBtn = document.getElementById('stopBtn');
		this.stopBtn.addEventListener('click', this.stop.bind(this));
	}
	clear() {
		if (this.watcher) {
			this.watcher.remove();
		}
		if (this.handler) {
			this.handler.remove();
		}
		if (this.timer) {
			this.timer.remove();
		}
		this.recordStart();
	}
	recordStart() {
		if (this.isPlaying || this.isPaused) {
			return;
		}
		this.timer = Scheduler.schedule(() => {
			this._cameraWatch();
			this._sliderWatch();
		});
	}
	play() {
		if (this.isPlaying) {
			return;
		}
		this.playBtn.classList.toggle('btn-info');
		this.playBtn.classList.toggle('btn-success');
		this._play(false);
	}
	stop() {
		this.isPaused = !this.isPaused;
		this.stopBtn.classList.toggle('btn-info');
		this.stopBtn.classList.toggle('btn-danger');
		if (!this.isPaused) {
			this.recordStart();
		}
	}
	playReverse() {
		if (this.isPlaying) {
			return;
		}
		this.reverseBtn.classList.toggle('btn-info');
		this.reverseBtn.classList.toggle('btn-success');
		this._play(true);
	}
	_cameraWatch() {
		const view = this.view;
		const cameras = this.cameras;
		const slider = this.slider;
		this.watcher = view.watch('camera', (val) => {
			cameras.push(val.clone());
			slider.max = slider.value = cameras.length;
			this.clear();
		});
	}
	_sliderWatch() {
		const view = this.view;
		const cameras = this.cameras;
		this.handler = on(this.slider, 'input', (e) => {
			const val =Number(e.target.value);
			view.goTo(cameras[val] || view.camera.clone());
			this.clear();
		});
	}
	_play(inReverse) {
		this.isPlaying = true;
		let intervalID = this.intervalID;
		const slider = this.slider;
		const view = this.view;
		const cameras = this.cameras;
		let len = cameras.length;

		let i = 0;
		intervalID = setInterval(() => {
			if (!inReverse) {
				slider.value = i;
				view.goTo(cameras[i++] || view.camera.clone());
				if (i === len) {
					clearInterval(intervalID);
					this.playBtn.classList.toggle('btn-info');
					this.playBtn.classList.toggle('btn-success');
					this.isPlaying = false;
					this.recordStart();
				}
			} else {
				slider.value = len;
				view.camera = cameras[len--] || view.camera.clone();
				if (len < 1) {
					clearInterval(intervalID);
					this.reverseBtn.classList.toggle('btn-info');
					this.reverseBtn.classList.toggle('btn-success');
					this.isPlaying = false;
					this.recordStart();
				}
			}
		}, 15);
	}
}

const map = new EsriMap({
	basemap: 'streets'
});

const view = new SceneView({
	container: 'viewDiv',
	map: map,
	scale: 240000000
});

const camRecorder = new CameraRecorder({ view });

view.when(() => camRecorder.recordStart());
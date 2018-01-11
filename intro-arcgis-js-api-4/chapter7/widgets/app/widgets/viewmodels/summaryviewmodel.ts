/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />

import Accessor = require("esri/core/Accessor");
import watchUtils = require("esri/core/watchUtils");

import FeatureLayerView = require("esri/views/layers/FeatureLayerView");
import Graphic = require("esri/Graphic");

import Query = require("esri/tasks/support/Query");

import { subclass, declared, property } from "esri/core/accessorSupport/decorators";

import store from "../../stores/app";

const { init, whenOnce, whenNot } = watchUtils;

export type Stats = {
  "Carcinogen": number,
  "PBT": number,
  "Non-PBT": number,
  "Metal": number
};

const stats: Stats = {
  "Carcinogen": 0, // CARCINOGEN == "Yes"
  "PBT": 0,        // CLASS == "PBT"
  "Non-PBT": 0,    // CLASS == "Non-PBT"
  "Metal": 0       // METAL == "Yes"
};

function errorHandler(error: Error) {
  console.log("LayerView Query Error", error);
}

@subclass("app.widgets.viewmodels.summaryviewmodel")
class SummaryViewModel extends declared(Accessor) {

  @property()
  count = 0;

  @property()
  stats: Stats = stats;

  constructor() {
    super();
    whenOnce(store, "view").then(_ => {
      return store.webmap.findLayerById("tri");
    })
    .then(layer => {
      return store.view.whenLayerView(layer);
    })
    .then(this.watchLayerView.bind(this))
    .otherwise(errorHandler);
  }

  private watchLayerView(layerView: FeatureLayerView) {
    const queryFeatures = this.queryLayerView(layerView);
    init(store, "view.stationary", _ => {
      if (layerView.updating) {
        whenNot(layerView, "updating", queryFeatures.bind(this));
      }
      else {
        queryFeatures();
      }
    });
  }

  private queryLayerView(layerView: FeatureLayerView) {
    return () => layerView.queryFeatures(new Query({ geometry: store.view.extent })).then(this.parseResults.bind(this));
  }

  private parseResults(results: Graphic[]) {
    const _stats = (<any> Object).assign({}, stats);
    results.forEach(({ attributes: attr }) => {
      if (attr.CARCINOGEN === "Yes") {
        _stats["Carcinogen"]++;
      }
      if (attr.CLASS === "PBT") {
        _stats["PBT"]++;
      }
      else if (attr.CLASS === "Non-PBT") {
        _stats["Non-PBT"]++;
      }
      if (attr.METAL === "Yes") {
        _stats["Metal"]++;
      }
    });
    this.set({
      count: results.length,
      stats: _stats
    });
  }

}

export default SummaryViewModel;

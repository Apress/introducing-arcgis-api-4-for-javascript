/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />

import EsriMap = require("esri/Map");
import MapView = require("esri/views/MapView");
import Accessor = require("esri/core/Accessor");

import { subclass, declared, property } from "esri/core/accessorSupport/decorators";

type UIParams = {
  element: any,
  position?: string
};

interface Store {
  webmap: EsriMap;
  view: MapView;

  addToUI(params: UIParams): void;
}

@subclass("app.stores.AppStore")
class AppStore extends declared(Accessor) implements Store {

  @property()
  webmap: EsriMap;

  @property()
  view: MapView;

  addToUI({ element, position }: UIParams) {
    this.view.ui.add(element, position);
  }

}

export default new AppStore();

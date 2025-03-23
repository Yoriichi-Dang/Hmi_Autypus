import * as joint from "@joint/plus";
import { SocComponent } from "./soc-component";
export namespace DashboardV1 {
  export class Speedometer extends SocComponent.ArcValue {
    defaults() {
      return joint.util.defaultsDeep(
        {
          type: "dashboardV1.Speedometer",
          size: { width: 200, height: 200 },
          attrs: {
            root: { magnetSelector: "body" },
            body: {
              fill: "white",
            },
          },
          value: {
            min: 20,
            max: 220,
          },
          angleArc: {
            start: 135,
            middle: 270,
          },
          numberPart: 11,
          numberSubPart: 1,
          showLabel: true,
          label: "km/h",
        },
        joint.dia.Element.prototype.defaults
      );
    }
    initialize(): void {
      super.initialize(this.attributes);
    }
  }
  export class RpmGauge extends SocComponent.ArcValue {
    defaults() {
      return joint.util.defaultsDeep(
        {
          type: "dashboardV1.RpmGauge",
          size: { width: 200, height: 200 },
          attrs: {
            root: { magnetSelector: "body" },
          },
          value: {
            min: 1,
            max: 6,
          },
          angleArc: {
            start: 135,
            middle: 270,
          },
          numberPart: 6,
          numberSubPart: 1,
          showLabel: true,
          label: "x1000",
        },
        joint.dia.Element.prototype.defaults
      );
    }
    initialize(): void {
      super.initialize(this.attributes);
    }
  }
  export class FuelGauge extends SocComponent.ArcValue {
    defaults() {
      return joint.util.defaultsDeep(
        {
          type: "dashboardV1.RpmGauge",
          size: { width: 200, height: 200 },
          attrs: {
            root: { magnetSelector: "body" },
          },
          value: {
            min: 1,
            max: 6,
          },
          angleArc: {
            start: 270,
            middle: 315,
          },
          numberPart: 6,
          numberSubPart: 1,
          showLabel: true,
        },
        joint.dia.Element.prototype.defaults
      );
    }
    initialize(): void {
      super.initialize(this.attributes);
    }
    initLabel(): void {}
  }
  export class CoolantTemperature extends SocComponent.ArcValue {
    defaults() {
      return joint.util.defaultsDeep(
        {
          type: "dashboardV1.CoolantTemperature",
          size: { width: 200, height: 200 },
          attrs: {
            root: { magnetSelector: "body" },
            body: {
              fill: "white",
            },
          },
          value: {
            min: 50,
            max: 140,
          },
          angleArc: {
            start: 180,
            middle: 225,
          },
          numberPart: 3,
          numberSubPart: 3,
          showLabel: true,
        },
        joint.dia.Element.prototype.defaults
      );
    }
    initialize(): void {
      super.initialize(this.attributes);
    }
    initLabel() {}
  }
}

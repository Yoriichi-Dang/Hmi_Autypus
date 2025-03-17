import * as joint from "@joint/plus";
import { degreeToRadian } from "../utils/utils";

export namespace speedometer {
  export class SpeedometerArc extends joint.dia.Element {
    private animationId: number | null = null;
    private animationSpeed: number = 5;

    defaults(): Partial<joint.dia.Element.Attributes> {
      return joint.util.defaultsDeep(
        {
          type: "speedometer.SpeedometerArc",
          size: { width: 200, height: 200 },
          speed: 0,
          maxSpeed: 200,
          minAngle: 135,
          maxAngle: 405,
          currentAngle: 135,
          attrs: {
            root: { magnetSelector: "body" },
            label: {
              textAnchor: "middle",
              textVerticalAnchor: "top",
              x: "calc(0.5*w)",
              y: "calc(h+10)",
              fontSize: 14,
              fontFamily: "Arial",
              fill: "#350100",
            },
            lineSpeed: {
              d: "M calc(w/2) calc(w/2) L 10 calc(w/2)",
              stroke: "black",
              strokeWidth: 2,
              strokeLinecap: "round",
            },
            body: {
              strokeWidth: 2,
              stroke: "black",
              fill: "none",
            },
          },
        },
        joint.dia.Element.prototype.defaults
      );
    }

    preinitialize(): void {
      this.markup = joint.util.svg/* xml */ `
        <path @selector="body"/>
        <g @selector="speedGroup">
          <path @selector="lineSpeed"/>
        </g>
        <text @selector="label"/>
      `;
    }

    initialize(...args: any[]): void {
      super.initialize(...args);
      this.updateArcPath();
      this.on("change:size", this.onResize, this);
      this.on("change:currentAngle", this.updateNeedle, this);
      this.on("change:speed", this.onSpeedChange, this);
    }
    onSpeedChange() {
      const speed = this.get("speed");
      const minAngle = this.get("minAngle");
      const maxAngle = this.get("maxAngle");
      const maxSpeed = this.get("maxSpeed");

      // Calculate the target angle based on the speed
      const angleRange = maxAngle - minAngle;
      const targetAngle = minAngle + (angleRange * speed) / maxSpeed;

      // Stop any existing animation
      if (this.animationId !== null) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }

      // Animate to the target angle
      this.animateToAngle(targetAngle);
    }
    setSpeed(speed: number): void {
      const maxSpeed = this.get("maxSpeed") || 100;
      const normalizedSpeed = Math.min(Math.max(speed, 0), maxSpeed);
      this.set("speed", normalizedSpeed);

      const minAngle = this.get("minAngle");
      const maxAngle = this.get("maxAngle");
      const angleRange = maxAngle - minAngle;
      const speedRatio = normalizedSpeed / maxSpeed;
      const targetAngle = minAngle + angleRange * speedRatio;

      this.stopRotation();
      this.animateToAngle(targetAngle);
    }

    startRotation(): void {
      if (this.animationId !== null) return;

      const animate = () => {
        let currentAngle = this.get("currentAngle");
        const minAngle = this.get("minAngle");
        const maxAngle = this.get("maxAngle");

        currentAngle += this.animationSpeed;
        if (currentAngle > maxAngle) {
          currentAngle = minAngle;
        }

        this.set("currentAngle", currentAngle);
        this.animationId = requestAnimationFrame(animate);
      };

      this.animationId = requestAnimationFrame(animate);
    }

    stopRotation(): void {
      if (this.animationId !== null) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
    }

    updateArcPath(): void {
      const r = Math.max(this.get("size").width, this.get("size").height) / 2;
      const width = this.get("size").width;
      const height = this.get("size").height;
      const centerX = width / 2;
      const centerY = height / 2;

      const startAngle = degreeToRadian(135);
      const endAngle = degreeToRadian(405);
      const startX = centerX + r * Math.cos(startAngle);
      const startY = centerY + r * Math.sin(startAngle);
      const endX = centerX + r * Math.cos(endAngle);
      const endY = centerY + r * Math.sin(endAngle);

      const arcPath = `M ${startX} ${startY} A ${r} ${r} 0 1 1 ${endX} ${endY}`;
      this.attr("body/d", arcPath);
      this.attr("body/strokeWidth", 2);
      this.attr("body/stroke", "black");
      this.attr("body/fill", "none");

      this.updateNeedle();
    }

    onResize(
      element: joint.dia.Element,
      newSize: { width: number; height: number },
      opt: any
    ): void {
      if (opt && opt.syncResize) return;

      const size = Math.max(newSize.width, newSize.height);
      this.resize(size, size, { syncResize: true });
      this.updateArcPath();
    }

    updateNeedle(): void {
      const r = Math.max(this.get("size").width, this.get("size").height) / 2;
      const width = this.get("size").width;
      const height = this.get("size").height;
      const centerX = width / 2;
      const centerY = height / 2;

      const currentAngle = this.get("currentAngle");
      const radians = degreeToRadian(currentAngle);

      const needleLength = r * 0.9;
      const needleEndX = centerX + needleLength * Math.cos(radians);
      const needleEndY = centerY + needleLength * Math.sin(radians);

      const linePath = `M ${centerX} ${centerY} L ${needleEndX} ${needleEndY}`;
      this.attr("lineSpeed/d", linePath);
    }

    private animateToAngle(targetAngle: number): void {
      if (this.animationId !== null) {
        cancelAnimationFrame(this.animationId);
      }

      const animate = () => {
        const currentAngle = this.get("currentAngle");
        const diff = targetAngle - currentAngle;

        if (Math.abs(diff) < 1) {
          this.set("currentAngle", targetAngle);
          this.animationId = null;
          return;
        }

        const step = diff * 0.1;
        this.set("currentAngle", currentAngle + step);
        this.animationId = requestAnimationFrame(animate);
      };

      this.animationId = requestAnimationFrame(animate);
    }
  }
  export class SpeedometerArcWithoutLine extends joint.dia.Element {
    private animationId: number | null = null;

    defaults() {
      return joint.util.defaultsDeep(
        {
          type: "speedometer.SpeedometerArcWithoutLine",
          size: { width: 200, height: 200 },
          speed: 0,
          maxSpeed: 200,
          minAngle: 135,
          maxAngle: 405,
          currentAngle: 135,
          attrs: {
            root: { magnetSelector: "body" },
            label: {
              textAnchor: "middle",
              textVerticalAnchor: "top",
              x: "calc(0.5*w)",
              y: "calc(h+10)",
              fontSize: 14,
              fontFamily: "Arial",
              fill: "#350100",
            },
            body: {
              strokeWidth: 2,
              stroke: "black",
              fill: "none",
            },
            arcSpeed: {
              strokeWidth: 2, // Made thicker so it's visible over the body path
              stroke: "red",
              fill: "none",
            },
            speedValue: {
              text: "0",
              textAnchor: "middle",
              textVerticalAnchor: "middle",
              x: "calc(0.5*w)",
              y: "calc(0.5*h)",
              fontSize: 18,
              fontWeight: "bold",
              fontFamily: "Arial",
              fill: "#350100",
            },
          },
        },
        joint.dia.Element.prototype.defaults
      );
    }

    preinitialize(): void {
      this.markup = joint.util.svg/* xml */ `
        <g @selector="speedGroup">
          <path @selector="body"/>
          <path @selector="arcSpeed"/>
        </g>
        <text @selector="label"/>
        <text @selector="speedValue"/>
      `;
    }

    initialize(...args: any[]): void {
      super.initialize(...args);
      this.on("change:size", this.onResize, this);
      this.on("change:attrs", this.updateArcPath, this);
      this.on(
        "change:attrs",
        (element, attrs) => {
          if (attrs?.body?.strokeWidth !== undefined) {
            this.attributes.attrs.arcSpeed.strokeWidth = attrs.body.strokeWidth;
          }
        },
        this
      );
      this.on("change:speed", this.onSpeedChange, this);
      this.on("change:currentAngle", this.updateArcSpeed, this);

      this.updateArcPath("body", this.get("minAngle"), this.get("maxAngle"));
      this.updateArcSpeed();
    }

    updateArcPath(attr: string, startAngle: number, endAngle: number): void {
      const r = Math.max(this.get("size").width, this.get("size").height) / 2;
      const width = this.get("size").width;
      const height = this.get("size").height;
      const centerX = width / 2;
      const centerY = height / 2;

      const startAngleRadian = degreeToRadian(startAngle);
      const endAngleRadian = degreeToRadian(endAngle);
      const startX = centerX + r * Math.cos(startAngleRadian);
      const startY = centerY + r * Math.sin(startAngleRadian);
      const endX = centerX + r * Math.cos(endAngleRadian);
      const endY = centerY + r * Math.sin(endAngleRadian);

      // Use the large arc flag (1) for angles > 180 degrees
      const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

      const arcPath = `M ${startX} ${startY} A ${r} ${r} 0 ${largeArcFlag} 1 ${endX} ${endY}`;
      this.attr(`${attr}/d`, arcPath);
    }

    updateArcSpeed(): void {
      const minAngle = this.get("minAngle");
      const currentAngle = this.get("currentAngle");

      // Update the arcSpeed path to show just the portion representing current speed
      this.updateArcPath("arcSpeed", minAngle, currentAngle);

      // Update the displayed value
      const speed = this.get("speed");
      this.attr("speedValue/text", Math.round(speed).toString());
    }

    onSpeedChange(): void {
      const speed = this.get("speed");
      const minAngle = this.get("minAngle");
      const maxAngle = this.get("maxAngle");
      const maxSpeed = this.get("maxSpeed");

      // Calculate the target angle based on the speed
      const angleRange = maxAngle - minAngle;
      const targetAngle = minAngle + (angleRange * speed) / maxSpeed;

      // Stop any existing animation
      this.stopAnimation();

      // Animate to the target angle
      this.animateToAngle(targetAngle);
    }

    setSpeed(speed: number): void {
      const maxSpeed = this.get("maxSpeed");
      const normalizedSpeed = Math.min(Math.max(speed, 0), maxSpeed);
      this.set("speed", normalizedSpeed);
    }

    private animateToAngle(targetAngle: number): void {
      if (this.animationId !== null) {
        cancelAnimationFrame(this.animationId);
      }

      const animate = () => {
        const currentAngle = this.get("currentAngle");
        const diff = targetAngle - currentAngle;

        if (Math.abs(diff) < 1) {
          this.set("currentAngle", targetAngle);
          this.animationId = null;
          return;
        }

        const step = diff * 0.1; // Adjust for animation speed
        this.set("currentAngle", currentAngle + step);
        this.animationId = requestAnimationFrame(animate);
      };

      this.animationId = requestAnimationFrame(animate);
    }

    stopAnimation(): void {
      if (this.animationId !== null) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
    }

    onResize(
      element: joint.dia.Element,
      newSize: { width: number; height: number },
      opt: any
    ): void {
      if (opt && opt.syncResize) return;

      const size = Math.max(newSize.width, newSize.height);
      this.resize(size, size, { syncResize: true });
      this.updateArcPath("body", this.get("minAngle"), this.get("maxAngle"));
      this.updateArcSpeed();
    }
  }
  export class SpeedometerCircle extends joint.dia.Element {
    defaults() {
      return joint.util.defaultsDeep(
        {
          type: "speedometer.SpeedometerCircle",
        },
        joint.dia.Element.prototype.defaults
      );
    }
  }

  export class SpeedometerLabel extends joint.dia.Element {
    defaults() {
      return joint.util.defaultsDeep(
        {
          type: "speedometer.SpeedometerLabel",
        },
        joint.dia.Element.prototype.defaults
      );
    }
  }
}

export const standard = joint.shapes.standard;

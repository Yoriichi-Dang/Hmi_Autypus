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
          maxSpeed: 270,
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
              strokeWidth: 2,
              strokeLinecap: "round",
            },
            body: {
              strokeWidth: 2,
              stroke: "black",
            },
          },
        },
        joint.dia.Element.prototype.defaults
      );
    }
    onAttrsChange(element: SpeedometerArc, attrs: any) {
      const strokeColor = this.attr("body/stroke");

      // Nếu body/fill thay đổi và không phải "none"
      if (strokeColor && strokeColor !== "none") {
        // Cập nhật màu cho lineSpeed
        if (typeof strokeColor === "string") {
          // Nếu fill là một màu đơn giản
          this.attr("lineSpeed/stroke", strokeColor);
        } else if (strokeColor.stops) {
          // Nếu fill đã là gradient, giữ nguyên cấu trúc gradient nhưng thay đổi màu cuối
          const newGradient = {
            type: "linearGradient",
            stops: [
              { offset: "0%", color: strokeColor },
              { offset: "100%", color: strokeColor },
            ],
          };
          this.attr("lineSpeed/stroke", newGradient);
        }
      }
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
      this.on("change:attrs", this.onAttrsChange, this);
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
          maxSpeed: 270,
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
          size: { width: 200, height: 200 },
          speed: 0,
          maxSpeed: 270,
          minSpeed: 0,
          tickTextColor: "#350100",
          numberPartSpeed: 10,
          attrs: {
            root: { magnetSelector: "body" },

            body: {
              fill: "none",
              stroke: "black",
              strokeWidth: 2,
              r: "calc(0.5*w)",
              cx: "calc(0.5*w)",
              cy: "calc(0.5*h)",
            },
            // We'll add tick text elements dynamically
          },
        },
        joint.dia.Element.prototype.defaults
      );
    }

    preinitialize(
      attributes?: joint.dia.Element.Attributes,
      options?: any
    ): void {
      // Create dynamic markup with placeholders for tick texts
      const maxTicks = 10; // Support up to 30 ticks (can be adjusted)
      let tickTextMarkup = "";

      for (let i = 0; i < maxTicks; i++) {
        tickTextMarkup += `<text @selector="tick${i}"/>`;
      }

      this.markup = joint.util.svg/* xml */ `
        <g>
          <circle @selector="body"/>
          <circle @selector="inner"/>
          ${tickTextMarkup}
        </g>
      `;
    }

    initialize(...args: any[]): void {
      super.initialize(...args);
      this.on("change:size", this.onResize, this);
      this.on("change:tickTextColor", this.updateTickTexts, this);
      this.updateTickTexts();
    }

    updateTickTexts(): void {
      const minSpeed = this.get("minSpeed");
      const maxSpeed = this.get("maxSpeed");
      const numberPartSpeed = this.get("numberPartSpeed");
      const minAngle = 135;
      const maxAngle = 405;
      const numTicks = numberPartSpeed;
      const angleStep = (maxAngle - minAngle) / (numTicks - 1);
      const tickTextColor = this.get("tickTextColor");
      const width = this.get("size").width;
      const height = this.get("size").height;
      const r = Math.min(width, height) / 2;
      const centerX = width / 2;
      const centerY = height / 2;

      // Update attributes for each tick text
      const attrs: any = {};

      for (let i = 0; i < numTicks; i++) {
        const speed = minSpeed + (i * maxSpeed) / (numTicks - 1);
        const angle = minAngle + i * angleStep;
        const radians = degreeToRadian(angle);

        // Calculate position
        const textX = centerX + r * 0.98 * Math.cos(radians);
        const textY = centerY + r * 0.98 * Math.sin(radians);
        const rotationAngle = angle + 90;
        // Set attributes for this text element
        attrs[`tick${i}`] = {
          text: speed.toString(),
          x: textX,
          y: textY,
          textAnchor: angle <= 180 ? "start" : "end",
          transform: `rotate(${rotationAngle}, ${textX}, ${textY})`,
          fontSize: width * 0.05,
          fontFamily: "Arial",
          fill: tickTextColor, // Use the configurable color
          display: "block", // Make visible
        };
      }
      this.attr(attrs);
    }

    onResize(
      element: joint.dia.Element,
      newSize: { width: number; height: number },
      opt: any
    ): void {
      if (opt && opt.syncResize) return;

      const size = Math.max(newSize.width, newSize.height);
      this.resize(size, size, { syncResize: true });

      // Update text positions after resize
      this.updateTickTexts();
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

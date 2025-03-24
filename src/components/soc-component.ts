import * as joint from "@joint/plus";
import { calculateArc, degreeToRadian } from "../utils/utils";

export type Value = {
  min: number;
  max: number;
};

export type AngleArc = {
  start: number;
  end?: number;
  middle: number;
};
// Symmetrical Arc
export namespace SocComponent {
  export class ArcValue extends joint.dia.Element {
    private animationId: number | null = null;
    private animationSpeed: number = 5;
    initSvg() {
      const numberPart = this.get("numberPart");
      const numberSubPart = this.get("numberSubPart");
      let partTextMarkup = "";
      for (let i = 0; i < numberPart; i++) {
        partTextMarkup += `
            <g>
               <text @selector="part_${i}" />
               <path @selector="part_${i}_line" />`;

        // Only add subpart lines if this isn't the last part
        if (i < numberPart - 1) {
          for (let j = 1; j <= numberSubPart; j++) {
            partTextMarkup += `
               <path @selector="subpart_${i}_${j}_line" />`;
          }
        }

        partTextMarkup += `
            </g>`;
      }

      this.markup = joint.util.svg/* xml */ `
              <g @selector="body">
                  <path @selector="arc" />
                  <text @selector="label" />
                <g>
                  <path @selector="line" />
                  <circle @selector="center" />
                </g>
                  ${partTextMarkup}
              </g>
          `;
    }

    initialize(attributes?: joint.dia.Element.Attributes): void {
      attributes.angleArc["end"] =
        2 * attributes.angleArc["middle"] - attributes.angleArc["start"];
      this.initSvg();
      this.on("change:size", this.onResize, this);
      this.on("change:attrs", this.applyFilters, this);
      this.on(
        "change:value change:angleArc change:numberPart change:numberSubPart",
        this.initPartLabel,
        this
      );
      this.on("change:targetValue", this.onValueChange, this);
      this.initPartLabel();
      super.initialize(attributes);
    }
    onValueChange() {
      const targetValue = this.get("targetValue");
      this.setValue(targetValue);
    }
    applyFilters(): void {
      const filter = this.attr("arc/filter");
      console.log(filter);
    }
    onResize(
      element: joint.dia.Element,
      newSize: { width: number; height: number },
      opt: any
    ): void {
      if (opt && opt.syncResize) return;

      const size = Math.max(newSize.width, newSize.height);
      this.resize(size, size, { syncResize: true });
      this.initPartLabel();
    }

    initPartLabel(): void {
      const attrs: any = {};
      const width = this.get("size").width;
      const height = this.get("size").height;
      const r = Math.min(width, height) / 2;
      const centerX = width / 2;
      const centerY = height / 2;
      const value: Value = this.get("value");
      const angleArc: AngleArc = this.get("angleArc");
      if (
        value.max > value.min &&
        angleArc.end > angleArc.start &&
        angleArc.end - 360 < angleArc.start
      ) {
        const numberPart: number = this.get("numberPart");
        const numberSubPart: number = this.get("numberSubPart");
        const showLabel: boolean = this.get("showLabel");
        const label = this.get("label");
        const { partAngle, partValue, subPartAngle } = calculateArc(
          value,
          angleArc,
          numberPart,
          numberSubPart
        );
        attrs.arc = {
          d: this.generateArcPath(
            centerX,
            centerY,
            r,
            angleArc.start,
            angleArc.end
          ),
          fill: "white",
          stroke: "black",
          strokeWidth: 2,
        };

        // Set up indicator line

        const lineCirlceRadius = 4;
        attrs.center = {
          cx: centerX,
          cy: centerY,
          r: lineCirlceRadius,
          fill: "gray",
        };

        // Set up part marks and subpart marks
        for (let i = 0; i < numberPart; i++) {
          // Calculate angle and value for this part
          const partAngleValue = angleArc.start + partAngle * i;
          const partTextValue = value.min + partValue * i;
          const partRadians = degreeToRadian(partAngleValue);

          // Coordinates for part text and line
          const textX = centerX + r * 1.1 * Math.cos(partRadians);
          const textY = centerY + r * 1.1 * Math.sin(partRadians);
          const lineX1 = centerX + r * 0.9 * Math.cos(partRadians);
          const lineY1 = centerY + r * 0.9 * Math.sin(partRadians);
          const lineX2 = centerX + r * Math.cos(partRadians);
          const lineY2 = centerY + r * Math.sin(partRadians);

          // Set up part text (only show if showLabel = true)
          if (showLabel) {
            attrs[`part_${i}`] = {
              x: textX,
              y: textY,
              text: partTextValue.toFixed(0),
              textAnchor: "middle",
              alignmentBaseline: "middle",
              fontSize: width * 0.04,
              fontFamily: "Arial",
              fill: "#000",
            };
          } else {
            attrs[`part_${i}`] = { display: "none" };
          }

          // Set up part line (longer than subpart)
          attrs[`part_${i}_line`] = {
            d: `M ${lineX1} ${lineY1} L ${lineX2} ${lineY2}`,
            stroke: "#000",
            strokeWidth: 2,
            strokeLinecap: "round",
          };

          // Set up subpart lines between parts
          if (i < numberPart - 1) {
            for (let j = 1; j <= numberSubPart; j++) {
              // Calculate angle for subpart
              const subPartAngleValue = partAngleValue + subPartAngle * j;
              const subPartRadians = degreeToRadian(subPartAngleValue);

              // Coordinates for subpart line (shorter than part line)
              const subLineX1 = centerX + r * 0.95 * Math.cos(subPartRadians);
              const subLineY1 = centerY + r * 0.95 * Math.sin(subPartRadians);
              const subLineX2 = centerX + r * Math.cos(subPartRadians);
              const subLineY2 = centerY + r * Math.sin(subPartRadians);

              // Add the subpart line to the attrs object with a distinct selector
              attrs[`subpart_${i}_${j}_line`] = {
                d: `M ${subLineX1} ${subLineY1} L ${subLineX2} ${subLineY2}`,
                stroke: "#000",
                strokeWidth: 1,
              };
            }
          }
        }
        if (label) {
          attrs.label = {
            x: centerX,
            y: centerY * 0.7,
            text: label,
            textAnchor: "middle",
            alignmentBaseline: "middle",
            fontSize: width * 0.04,
            fontFamily: "Arial",
            fill: "gray",
          };
        }

        this.attr(attrs);
        this.drawLine();
      }
    }
    drawLine(): void {
      const width = this.get("size").width;
      const height = this.get("size").height;
      const r = Math.min(width, height) / 2;
      const centerX = width / 2;
      const centerY = height / 2;
      const angleArc: AngleArc = this.get("angleArc");
      const line = {
        d: `M ${centerX} ${centerY} L ${
          centerX + r * 0.8 * Math.cos(degreeToRadian(angleArc.start))
        } ${centerY + r * 0.8 * Math.sin(degreeToRadian(angleArc.start))}`,
        stroke: "black",
        strokeWidth: 3,
        strokeLinecap: "round",
      };
      this.attr("line", line);
    }
    stopRotation(): void {
      if (this.animationId !== null) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
    }
    updateLineValue(): void {}
    // Method to generate arc path
    private generateArcPath(
      cx: number,
      cy: number,
      r: number,
      startAngle: number,
      endAngle: number
    ): string {
      const start = this.polarToCartesian(cx, cy, r, endAngle);
      const end = this.polarToCartesian(cx, cy, r, startAngle);
      const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

      return [
        "M",
        start.x,
        start.y,
        "A",
        r,
        r,
        0,
        largeArcFlag,
        0,
        end.x,
        end.y,
      ].join(" ");
    }

    // Convert polar to Cartesian coordinates
    private polarToCartesian(
      centerX: number,
      centerY: number,
      radius: number,
      angleInDegrees: number
    ): { x: number; y: number } {
      const angleInRadians = degreeToRadian(angleInDegrees);
      return {
        x: centerX + radius * Math.cos(angleInRadians),
        y: centerY + radius * Math.sin(angleInRadians),
      };
    }
    private getCurrentAngle(): number {
      const value: Value = this.get("value");
      const targetValue = this.get("targetValue");
      const angleArc: AngleArc = this.get("angleArc");
      const valueRatio = (targetValue - value.min) / (value.max - value.min);
      return angleArc.start + valueRatio * (angleArc.end - angleArc.start);
    }
    private animateToAngle(targetAngle: number): void {
      if (this.animationId !== null) {
        cancelAnimationFrame(this.animationId);
      }

      const width = this.get("size").width;
      const height = this.get("size").height;
      const r = Math.min(width, height) / 2;
      const centerX = width / 2;
      const centerY = height / 2;

      let currentAngle = this.getCurrentAngle();

      const animate = () => {
        const diff = targetAngle - currentAngle;

        // Stop animation when we're close enough to target
        if (Math.abs(diff) < 0.5) {
          // Set final position exactly
          const finalRadians = degreeToRadian(targetAngle);
          this.attr(
            "line/d",
            `M ${centerX} ${centerY} L ${
              centerX + r * 0.8 * Math.cos(finalRadians)
            } ${centerY + r * 0.8 * Math.sin(finalRadians)}`
          );
          this.animationId = null;
          return;
        }

        // Calculate step based on distance and speed
        const step =
          Math.sign(diff) * Math.min(Math.abs(diff) * 0.1, this.animationSpeed);
        currentAngle += step;

        // Update line position based on current angle
        const radians = degreeToRadian(currentAngle);
        this.attr(
          "line/d",
          `M ${centerX} ${centerY} L ${centerX + r * 0.8 * Math.cos(radians)} ${
            centerY + r * 0.8 * Math.sin(radians)
          }`
        );

        // Continue animation
        this.animationId = requestAnimationFrame(animate);
      };

      this.animationId = requestAnimationFrame(animate);
    }

    // You may also want to update the setValue method to make sure it properly calls the animation:
    setValue(targetValue: number) {
      const value = this.get("value");
      const currentValue = Math.max(
        value.min,
        Math.min(value.max, targetValue)
      );
      this.set("targetValue", currentValue);

      // Calculate target angle based on the current value
      const valueRatio = (currentValue - value.min) / (value.max - value.min);
      const angleArc: AngleArc = this.get("angleArc");
      const targetAngle =
        angleArc.start + valueRatio * (angleArc.end - angleArc.start);

      // Stop any existing animation and start new one
      this.stopRotation();
      this.animateToAngle(targetAngle);
    }
  }
}

import * as joint from "@joint/plus";
import { degreeToRadian } from "../utils/utils";

type Value = {
  min: number;
  max: number;
};

type AngleArc = {
  start: number;
  end?: number;
  middle: number;
};

function calculateArc(
  value: Value,
  angleArc: AngleArc,
  numberPart: number,
  numberSubPart: number
) {
  const distanceAngle = angleArc.end - angleArc.start;
  const partAngle = distanceAngle / (numberPart - 1);
  const partValue = (value.max - value.min) / (numberPart - 1);
  const subPartAngle = partAngle / (numberSubPart + 1);
  const subPartValue = partValue / (numberSubPart + 1);
  return { distanceAngle, partAngle, partValue, subPartAngle, subPartValue };
}

// Symmetrical Arc
export namespace SocComponent {
  export class ArcValue extends joint.dia.Element {
    value: Value;
    angleArc: AngleArc;
    numberSubPart: number;
    numberPart: number;
    showLabel: boolean;
    name: string;
    label: string;
    icon?: string;

    constructor(
      name: string,
      label: string,
      value: Value,
      angleArc: AngleArc,
      numberPart: number,
      numberSubPart: number,
      showLabel: boolean,
      icon?: string,
      attributes?: joint.dia.Element.Attributes,
      options?: any
    ) {
      // Ensure angleArc.end is properly defined before passing to super
      const completeAngleArc = { ...angleArc };
      if (completeAngleArc.end === undefined) {
        const distanceAngle = completeAngleArc.middle - completeAngleArc.start;
        completeAngleArc.end = distanceAngle + completeAngleArc.middle;
      }

      // Store constructor parameters as instance properties
      const attrs = joint.util.defaultsDeep(
        {
          name: name,
          label: label,
          icon: icon,
          value: value,
          angleArc: completeAngleArc,
          numberPart: numberPart,
          numberSubPart: numberSubPart,
          currentAngle: completeAngleArc.start,
          showLabel: showLabel,
        },
        attributes || {}
      );

      super(attrs, options);

      this.value = value;
      this.angleArc = completeAngleArc;
      this.numberPart = numberPart;
      this.numberSubPart = numberSubPart;
      this.showLabel = showLabel;
      this.name = name;
      this.label = label;
      this.icon = icon;
    }

    preinitialize(attributes?: joint.dia.Element.Attributes): void {
      let partTextMarkup = "";
      for (let i = 0; i < attributes.numberPart; i++) {
        partTextMarkup += `
            <g>
               <text @selector="part_${i}" />
               <path @selector="part_${i}_line" />`;

        // Only add subpart lines if this isn't the last part
        if (i < attributes.numberPart - 1) {
          for (let j = 1; j <= attributes.numberSubPart; j++) {
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
                  <path @selector="line" />
                  ${partTextMarkup}
              </g>
          `;
    }

    initialize(attributes?: joint.dia.Element.Attributes): void {
      super.initialize(attributes);
      this.on("change:size", this.onResize, this);
      console.log("Init", attributes);
      this.initPartLabel();
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
      this.initPartLabel();
      this.setValue(this.getValue());
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
      const numberPart: number = this.get("numberPart");
      const numberSubPart: number = this.get("numberSubPart");
      const showLabel: boolean = this.get("showLabel");
      const label = this.get("label");
      console.log(value, angleArc, numberPart, numberSubPart, showLabel, label);
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
        stroke: "#000",
        strokeWidth: 2,
      };

      // Set up indicator line
      attrs.line = {
        d: `M ${centerX} ${centerY} L ${
          centerX + r * 0.8 * Math.cos(degreeToRadian(angleArc.start))
        } ${centerY + r * 0.8 * Math.sin(degreeToRadian(angleArc.start))}`,
        stroke: "red",
        strokeWidth: 2,
        strokeLinecap: "round",
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
      this.attr(attrs);
    }

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

    // Method to set current value and update indicator
    setValue(val: number): this {
      // use when init
      // Limit value to min-max range
      const currentValue = Math.max(
        this.value.min,
        Math.min(this.value.max, val)
      );

      // Calculate angle corresponding to value
      const valueRatio =
        (currentValue - this.value.min) / (this.value.max - this.value.min);
      const currentAngle =
        this.angleArc.start +
        valueRatio * (this.angleArc.end - this.angleArc.start);

      // Update angle and position of indicator
      this.set("currentAngle", currentAngle);

      const width = this.get("size").width;
      const height = this.get("size").height;
      const r = Math.min(width, height) / 2;
      const centerX = width / 2;
      const centerY = height / 2;
      const radians = degreeToRadian(currentAngle);

      this.attr(
        "line/d",
        `M ${centerX} ${centerY} L ${centerX + r * 0.85 * Math.cos(radians)} ${
          centerY + r * 0.8 * Math.sin(radians)
        }`
      );

      return this;
    }

    // Method to get current value
    getValue(): number {
      const currentAngle = this.get("currentAngle");
      const angleRatio =
        (currentAngle - this.angleArc.start) /
        (this.angleArc.end - this.angleArc.start);
      return this.value.min + angleRatio * (this.value.max - this.value.min);
    }

    // Override defaults method to set default properties
    defaults(): Partial<joint.dia.Element.Attributes> {
      console.log("Call default");
      return joint.util.defaultsDeep(
        {
          type: "arc.ArcValue",
          size: { width: 200, height: 200 },
          attrs: {
            root: { magnetSelector: "body" },
          },
        },
        joint.dia.Element.prototype.defaults
      );
    }
  }
}

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

// Đối tượng cấu hình animation
export type AnimationOptions = {
  duration: number; // Thời lượng animation (ms)
  easing: "linear" | "easeInOut" | "elastic"; // Kiểu easing
  fps: number; // Frames per second (mặc định: 60)
};

// Symmetrical Arc
export namespace SocComponent {
  export class ArcValue extends joint.dia.Element {
    private animationId: number | null = null;
    private animationStartTime: number = 0;
    private animationStartAngle: number = 0;
    private currentDisplayAngle: number | null = null; // Thêm biến theo dõi góc hiện tại
    private animationOptions: AnimationOptions = {
      duration: 500, // 500ms mặc định
      easing: "easeInOut",
      fps: 60,
    };

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
      this.on("change:animationOptions", this.updateAnimationOptions, this);

      // Thiết lập giá trị targetValue ban đầu nếu chưa có
      if (attributes.targetValue === undefined && attributes.value) {
        // Sử dụng giá trị trung bình của phạm vi làm giá trị mặc định
        const value = attributes.value;
        attributes.targetValue = (value.min + value.max) / 2;
      }

      // Khởi tạo giá trị góc hiện tại bằng góc tương ứng với targetValue ban đầu
      if (
        attributes.targetValue !== undefined &&
        attributes.value &&
        attributes.angleArc
      ) {
        const valueRatio =
          (attributes.targetValue - attributes.value.min) /
          (attributes.value.max - attributes.value.min);
        this.currentDisplayAngle =
          attributes.angleArc.start +
          valueRatio * (attributes.angleArc.end - attributes.angleArc.start);
      } else {
        this.currentDisplayAngle = attributes.angleArc?.start || 0;
      }

      this.initPartLabel();
      super.initialize(attributes);
    }

    // Phương thức cập nhật tùy chọn animation
    updateAnimationOptions(options?: Partial<AnimationOptions>): void {
      if (options) {
        this.animationOptions = {
          ...this.animationOptions,
          ...options,
        };
      }
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

      // Sử dụng góc hiện tại hoặc tính toán từ targetValue nếu chưa có
      let currentAngle = this.currentDisplayAngle;
      if (currentAngle === null) {
        const targetValue = this.get("targetValue");
        const value: Value = this.get("value");
        const angleArc: AngleArc = this.get("angleArc");

        // Tính toán góc dựa trên targetValue
        if (targetValue !== undefined) {
          const valueRatio =
            (targetValue - value.min) / (value.max - value.min);
          currentAngle =
            angleArc.start + valueRatio * (angleArc.end - angleArc.start);
        } else {
          currentAngle = angleArc.start;
        }

        // Cập nhật biến theo dõi góc hiện tại
        this.currentDisplayAngle = currentAngle;
      }

      // Vẽ line tại vị trí góc hiện tại
      const radians = degreeToRadian(currentAngle);
      const line = {
        d: `M ${centerX} ${centerY} L ${
          centerX + r * 0.8 * Math.cos(radians)
        } ${centerY + r * 0.8 * Math.sin(radians)}`,
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

    // Hàm easing để làm cho animation mượt mà hơn
    private easing(t: number, type: string = "easeInOut"): number {
      switch (type) {
        case "linear":
          return t;
        case "easeInOut":
          // Cubic easing in/out - acceleration until halfway, then deceleration
          return t < 0.5
            ? 4 * t * t * t
            : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        case "elastic":
          // Elastic bounce effect at the end
          const p = 0.3;
          return (
            Math.pow(2, -10 * t) * Math.sin(((t - p / 4) * (2 * Math.PI)) / p) +
            1
          );
        default:
          return t;
      }
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

    // Animation giống SpeedometerArc nhưng sử dụng góc hiện tại đã lưu
    private animateToAngle(targetAngle: number): void {
      // Dừng animation hiện tại nếu có
      this.stopRotation();

      // Sử dụng góc hiện tại đã được lưu
      const currentAngle =
        this.currentDisplayAngle !== null
          ? this.currentDisplayAngle
          : this.get("angleArc").start;

      // Lưu thời điểm bắt đầu animation và góc bắt đầu
      this.animationStartTime = performance.now();
      this.animationStartAngle = currentAngle;

      const animate = () => {
        const elapsed = performance.now() - this.animationStartTime;
        const duration = this.animationOptions.duration;

        // Tính tỉ lệ hoàn thành (0-1)
        let progress = Math.min(elapsed / duration, 1);

        // Áp dụng hàm easing để có chuyển động mượt mà
        progress = this.easing(progress, this.animationOptions.easing);

        // Tính chênh lệch góc, điều chỉnh cho trường hợp vượt qua 0/360 độ
        let angleDiff = targetAngle - this.animationStartAngle;

        // Điều chỉnh chênh lệch để đi đường ngắn nhất
        if (Math.abs(angleDiff) > 180) {
          if (angleDiff > 0) {
            angleDiff -= 360;
          } else {
            angleDiff += 360;
          }
        }

        const newAngle = this.animationStartAngle + angleDiff * progress;

        // Cập nhật vị trí của line và lưu góc hiện tại
        this.updateNeedlePosition(newAngle);
        this.currentDisplayAngle = newAngle;

        // Tiếp tục animation nếu chưa hoàn thành
        if (progress < 1) {
          this.animationId = requestAnimationFrame(animate);
        } else {
          // Đảm bảo kết thúc chính xác tại vị trí đích
          this.updateNeedlePosition(targetAngle);
          this.currentDisplayAngle = targetAngle;
          this.animationId = null;
        }
      };

      // Bắt đầu animation
      this.animationId = requestAnimationFrame(animate);
    }

    // Cập nhật vị trí needle (line)
    private updateNeedlePosition(angle: number): void {
      const width = this.get("size").width;
      const height = this.get("size").height;
      const r = Math.min(width, height) / 2;
      const centerX = width / 2;
      const centerY = height / 2;

      const radians = degreeToRadian(angle);
      const needleLength = r * 0.8;
      const needleEndX = centerX + needleLength * Math.cos(radians);
      const needleEndY = centerY + needleLength * Math.sin(radians);

      const linePath = `M ${centerX} ${centerY} L ${needleEndX} ${needleEndY}`;
      this.attr("line/d", linePath);
    }

    // Cập nhật setValue để sử dụng animation mượt mà
    setValue(targetValue: number) {
      const value = this.get("value");
      // Đảm bảo giá trị nằm trong phạm vi cho phép
      const clampedValue = Math.max(
        value.min,
        Math.min(value.max, targetValue)
      );

      // Cập nhật giá trị đích
      this.set("targetValue", clampedValue);

      // Tính toán góc mục tiêu dựa trên giá trị hiện tại
      const valueRatio = (clampedValue - value.min) / (value.max - value.min);
      const angleArc = this.get("angleArc");
      const targetAngle =
        angleArc.start + valueRatio * (angleArc.end - angleArc.start);

      // Dừng animation hiện tại và bắt đầu animation mới
      this.stopRotation();
      this.animateToAngle(targetAngle);
    }

    // Phương thức để tùy chỉnh animation
    setAnimationOptions(options: Partial<AnimationOptions>): void {
      this.animationOptions = {
        ...this.animationOptions,
        ...options,
      };
    }
  }
}

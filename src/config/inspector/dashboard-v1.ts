import { options } from "./options";
import { InspectorDefinition } from "./type";

const inspectorDefinitions: InspectorDefinition = {
  inputs: {
    value: {
      min: {
        type: "range",
        label: "Min value",
        min: 0,
        max: 300,
        group: "value",
      },
      max: {
        min: 0,
        max: 300,
        type: "range",
        label: "Max value",
        group: "value",
      },
    },
    targetValue: {
      type: "range",
      label: "Target value",
      min: 0,
      max: 300,
      group: "value",
    },
    angleArc: {
      start: {
        type: "range",
        label: "Start angle",
        min: 0,
        max: 360,
        group: "value",
      },
      middle: {
        type: "range",
        label: "Middle angle",
        min: 0,
        max: 360,
        group: "value",
      },
    },
    attrs: {
      arc: {
        fill: {
          type: "color-palette",
          options: options.colorPalette,
          label: "Color body",
          group: "outline",
        },
        strokeDasharray: {
          type: "select-box",
          options: options.strokeStyle,
          label: "Style",
          group: "outline",
          when: { ne: { "attrs/arc/strokeWidth": 0 } },
        },
        stroke: {
          type: "color-palette",
          options: options.colorPalette,
          label: "Color outline",
          group: "outline",
        },
        strokeWidth: {
          type: "range",
          min: 1,
          max: 20,
          step: 1,
          unit: "px",
          label: "Thickness",
          group: "outline",
        },
        strokeOpacity: {
          type: "range",
          label: "Opacity",
          group: "outline",
          min: 0,
          max: 1,
          step: 0.1,
        },
        filter: {
          type: "select",
          label: "Effect",
          group: "effects", // Chú ý: Thay đổi từ "Effects" sang "effects" để khớp với định nghĩa nhóm
          index: 1,
          options: [
            { value: "", content: "None" },
            { value: "highlight", content: "Highlight" },
            { value: "dropShadow", content: "Shadow" },
          ],
        },
      },
      // Di chuyển dropShadow thành thuộc tính riêng biệt
      dropShadow: {
        dx: {
          type: "range",
          min: 0,
          max: 20,
          step: 1,
          label: "Shadow X offset",
          group: "effects",
          when: { eq: { "attrs/arc/filter": "dropShadow" } },
        },
        dy: {
          type: "range",
          min: 0,
          max: 20,
          step: 1,
          label: "Shadow Y offset",
          group: "effects",
          when: { eq: { "attrs/arc/filter": "dropShadow" } },
        },
        blur: {
          type: "range",
          min: 0,
          max: 20,
          step: 1,
          label: "Shadow blur",
          group: "effects",
          when: { eq: { "attrs/arc/filter": "dropShadow" } },
        },
        color: {
          type: "color-palette",
          options: options.colorPalette,
          label: "Shadow color",
          group: "effects",
          when: { eq: { "attrs/arc/filter": "dropShadow" } },
        },
        opacity: {
          type: "range",
          min: 0,
          max: 1,
          step: 0.1,
          label: "Shadow opacity",
          group: "effects",
          when: { eq: { "attrs/arc/filter": "dropShadow" } },
        },
      },

      label: {
        fill: {
          type: "color-palette",
          options: options.colorPalette,
          label: "Color text",
          group: "line",
        },
        fontWeight: {
          type: "select-box",
          options: options.fontWeight,
          label: "Font thickness",
          group: "line",
          when: { ne: { "attrs/label/text": "" } },
        },
        fontSize: {
          type: "range",
          min: 5,
          max: 80,
          unit: "px",
          label: "Font size",
          group: "line",
        },
      },
      line: {
        stroke: {
          type: "color-palette",
          options: options.colorPalette,
          label: "Color line",
          group: "line",
        },
        strokeDasharray: {
          type: "select-box",
          options: options.strokeStyle,
          label: "Style",
          group: "line",
          when: { ne: { "attrs/line/strokeWidth": 0 } }, // Sửa từ "attrs/body/strokeWidth" thành "attrs/line/strokeWidth"
        },
        strokeWidth: {
          type: "range",
          min: 1,
          max: 20,
          step: 1,
          unit: "px",
          label: "Thickness",
          group: "line",
        },
      },
      center: {
        r: {
          type: "range",
          min: 0,
          max: 100,
          step: 1,
          label: "Radius",
          group: "center",
        },
        fill: {
          type: "color-palette",
          options: options.colorPalette,
          label: "Color center",
          group: "center",
        },
      },
    },
  },
  groups: {
    value: {
      label: "Value",
      closed: true,
    },
    outline: {
      label: "Outline",
      closed: true,
    },
    line: {
      label: "Line",
      closed: true,
    },
    center: {
      label: "Center",
      closed: true,
    },
    effects: {
      // Chú ý: Bảo đảm tên nhóm viết đúng và phù hợp
      label: "Effects",
      closed: true,
    },
  },
};

export const dashboardV1InspectorDefinitions: Record<
  string,
  { inputs: any; groups: any }
> = {
  "dashboardV1.Speedometer": inspectorDefinitions,
  "dashboardV1.Tachometer": inspectorDefinitions,
  "dashboardV1.FuelGauge": inspectorDefinitions,
  "dashboardV1.CoolantTemperature": inspectorDefinitions,
};

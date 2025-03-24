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
          group: "filters",
          index: 1,
          options: [
            { value: "", content: "None" },
            { value: "highlight", content: "Highlight" },
            { value: "dropShadow", content: "Drop Shadow" },
            { value: "blur", content: "Blur" },
            { value: "glow", content: "Glow" },
            { value: "grayscale", content: "Grayscale" },
            { value: "sepia", content: "Sepia" },
            { value: "invert", content: "Invert" },
            { value: "contrast", content: "Contrast" },
            { value: "brightness", content: "Brightness" },
            { value: "custom", content: "Custom Filter" },
          ],
        },
      },
      // Drop Shadow Filter
      dropShadow: {
        dx: {
          type: "range",
          min: 0,
          max: 20,
          step: 1,
          label: "Shadow X offset",
          group: "filter-settings",
          when: { eq: { "attrs/arc/filter": "dropShadow" } },
        },
        dy: {
          type: "range",
          min: 0,
          max: 20,
          step: 1,
          label: "Shadow Y offset",
          group: "filter-settings",
          when: { eq: { "attrs/arc/filter": "dropShadow" } },
        },
        blur: {
          type: "range",
          min: 0,
          max: 20,
          step: 1,
          label: "Shadow blur",
          group: "filter-settings",
          when: { eq: { "attrs/arc/filter": "dropShadow" } },
        },
        color: {
          type: "color-palette",
          options: options.colorPalette,
          label: "Shadow color",
          group: "filter-settings",
          when: { eq: { "attrs/arc/filter": "dropShadow" } },
        },
        opacity: {
          type: "range",
          min: 0,
          max: 1,
          step: 0.1,
          label: "Shadow opacity",
          group: "filter-settings",
          when: { eq: { "attrs/arc/filter": "dropShadow" } },
        },
      },

      // Blur Filter
      blur: {
        amount: {
          type: "range",
          min: 0,
          max: 20,
          step: 1,
          label: "Blur amount",
          group: "filter-settings",
          when: { eq: { "attrs/arc/filter": "blur" } },
        },
      },

      // Glow Filter
      glow: {
        radius: {
          type: "range",
          min: 0,
          max: 50,
          step: 1,
          label: "Glow radius",
          group: "filter-settings",
          when: { eq: { "attrs/arc/filter": "glow" } },
        },
        color: {
          type: "color-palette",
          options: options.colorPalette,
          label: "Glow color",
          group: "filter-settings",
          when: { eq: { "attrs/arc/filter": "glow" } },
        },
        strength: {
          type: "range",
          min: 0,
          max: 1,
          step: 0.1,
          label: "Glow strength",
          group: "filter-settings",
          when: { eq: { "attrs/arc/filter": "glow" } },
        },
      },

      // Grayscale Filter
      grayscale: {
        amount: {
          type: "range",
          min: 0,
          max: 1,
          step: 0.1,
          label: "Grayscale amount",
          group: "filter-settings",
          when: { eq: { "attrs/arc/filter": "grayscale" } },
        },
      },

      // Sepia Filter
      sepia: {
        amount: {
          type: "range",
          min: 0,
          max: 1,
          step: 0.1,
          label: "Sepia amount",
          group: "filter-settings",
          when: { eq: { "attrs/arc/filter": "sepia" } },
        },
      },

      // Invert Filter
      invert: {
        amount: {
          type: "range",
          min: 0,
          max: 1,
          step: 0.1,
          label: "Invert amount",
          group: "filter-settings",
          when: { eq: { "attrs/arc/filter": "invert" } },
        },
      },

      // Contrast Filter
      contrast: {
        amount: {
          type: "range",
          min: 0,
          max: 2,
          step: 0.1,
          label: "Contrast amount",
          group: "filter-settings",
          when: { eq: { "attrs/arc/filter": "contrast" } },
        },
      },

      // Brightness Filter
      brightness: {
        amount: {
          type: "range",
          min: 0,
          max: 2,
          step: 0.1,
          label: "Brightness amount",
          group: "filter-settings",
          when: { eq: { "attrs/arc/filter": "brightness" } },
        },
      },

      // Custom Filter (SVG filter)
      custom: {
        definition: {
          type: "text",
          label: "Custom SVG filter definition",
          group: "filter-settings",
          when: { eq: { "attrs/arc/filter": "custom" } },
        },
      },

      // Line properties and filter
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
          when: { ne: { "attrs/line/strokeWidth": 0 } },
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
        filter: {
          type: "select",
          label: "Line Effect",
          group: "filters",
          index: 2,
          options: [
            { value: "", content: "None" },
            { value: "highlight", content: "Highlight" },
            { value: "dropShadow", content: "Drop Shadow" },
            { value: "glow", content: "Glow" },
            { value: "contrast", content: "Contrast" },
            { value: "brightness", content: "Brightness" },
          ],
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
        filter: {
          type: "select",
          label: "Center Effect",
          group: "filters",
          index: 3,
          options: [
            { value: "", content: "None" },
            { value: "highlight", content: "Highlight" },
            { value: "dropShadow", content: "Drop Shadow" },
            { value: "glow", content: "Glow" },
          ],
        },
      },

      // Condition for Line filter settings
      lineDropShadow: {
        dx: {
          type: "range",
          min: 0,
          max: 20,
          step: 1,
          label: "Line Shadow X offset",
          group: "line-filter-settings",
          when: { eq: { "attrs/line/filter": "dropShadow" } },
        },
        dy: {
          type: "range",
          min: 0,
          max: 20,
          step: 1,
          label: "Line Shadow Y offset",
          group: "line-filter-settings",
          when: { eq: { "attrs/line/filter": "dropShadow" } },
        },
        blur: {
          type: "range",
          min: 0,
          max: 20,
          step: 1,
          label: "Line Shadow blur",
          group: "line-filter-settings",
          when: { eq: { "attrs/line/filter": "dropShadow" } },
        },
        color: {
          type: "color-palette",
          options: options.colorPalette,
          label: "Line Shadow color",
          group: "line-filter-settings",
          when: { eq: { "attrs/line/filter": "dropShadow" } },
        },
        opacity: {
          type: "range",
          min: 0,
          max: 1,
          step: 0.1,
          label: "Line Shadow opacity",
          group: "line-filter-settings",
          when: { eq: { "attrs/line/filter": "dropShadow" } },
        },
      },

      lineGlow: {
        radius: {
          type: "range",
          min: 0,
          max: 50,
          step: 1,
          label: "Line Glow radius",
          group: "line-filter-settings",
          when: { eq: { "attrs/line/filter": "glow" } },
        },
        color: {
          type: "color-palette",
          options: options.colorPalette,
          label: "Line Glow color",
          group: "line-filter-settings",
          when: { eq: { "attrs/line/filter": "glow" } },
        },
        strength: {
          type: "range",
          min: 0,
          max: 1,
          step: 0.1,
          label: "Line Glow strength",
          group: "line-filter-settings",
          when: { eq: { "attrs/line/filter": "glow" } },
        },
      },

      lineContrast: {
        amount: {
          type: "range",
          min: 0,
          max: 2,
          step: 0.1,
          label: "Line Contrast amount",
          group: "line-filter-settings",
          when: { eq: { "attrs/line/filter": "contrast" } },
        },
      },

      lineBrightness: {
        amount: {
          type: "range",
          min: 0,
          max: 2,
          step: 0.1,
          label: "Line Brightness amount",
          group: "line-filter-settings",
          when: { eq: { "attrs/line/filter": "brightness" } },
        },
      },

      // Center filter settings
      centerDropShadow: {
        dx: {
          type: "range",
          min: 0,
          max: 20,
          step: 1,
          label: "Center Shadow X offset",
          group: "center-filter-settings",
          when: { eq: { "attrs/center/filter": "dropShadow" } },
        },
        dy: {
          type: "range",
          min: 0,
          max: 20,
          step: 1,
          label: "Center Shadow Y offset",
          group: "center-filter-settings",
          when: { eq: { "attrs/center/filter": "dropShadow" } },
        },
        blur: {
          type: "range",
          min: 0,
          max: 20,
          step: 1,
          label: "Center Shadow blur",
          group: "center-filter-settings",
          when: { eq: { "attrs/center/filter": "dropShadow" } },
        },
        color: {
          type: "color-palette",
          options: options.colorPalette,
          label: "Center Shadow color",
          group: "center-filter-settings",
          when: { eq: { "attrs/center/filter": "dropShadow" } },
        },
        opacity: {
          type: "range",
          min: 0,
          max: 1,
          step: 0.1,
          label: "Center Shadow opacity",
          group: "center-filter-settings",
          when: { eq: { "attrs/center/filter": "dropShadow" } },
        },
      },

      centerGlow: {
        radius: {
          type: "range",
          min: 0,
          max: 50,
          step: 1,
          label: "Center Glow radius",
          group: "center-filter-settings",
          when: { eq: { "attrs/center/filter": "glow" } },
        },
        color: {
          type: "color-palette",
          options: options.colorPalette,
          label: "Center Glow color",
          group: "center-filter-settings",
          when: { eq: { "attrs/center/filter": "glow" } },
        },
        strength: {
          type: "range",
          min: 0,
          max: 1,
          step: 0.1,
          label: "Center Glow strength",
          group: "center-filter-settings",
          when: { eq: { "attrs/center/filter": "glow" } },
        },
      },
    },

    // Animation options
    animationOptions: {
      duration: {
        type: "range",
        min: 100,
        max: 2000,
        step: 100,
        label: "Animation Duration (ms)",
        group: "animation",
      },
      easing: {
        type: "select",
        label: "Easing Function",
        group: "animation",
        options: [
          { value: "linear", content: "Linear" },
          { value: "easeInOut", content: "Ease In/Out" },
          { value: "elastic", content: "Elastic" },
        ],
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
    filters: {
      label: "Filters & Effects",
      closed: true,
    },
    "filter-settings": {
      label: "Arc Filter Settings",
      closed: true,
    },
    "line-filter-settings": {
      label: "Line Filter Settings",
      closed: true,
    },
    "center-filter-settings": {
      label: "Center Filter Settings",
      closed: true,
    },
    animation: {
      label: "Animation",
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

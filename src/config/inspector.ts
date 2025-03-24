import { dashboardV1InspectorDefinitions } from "./inspector/dashboard-v1";
import {
  maxRoundedCorners,
  maxSpeed,
  options,
  strokeWidthMax,
} from "./inspector/options";

export const inspectorDefinitions: Record<
  string,
  { inputs: any; groups: any }
> = {
  ...dashboardV1InspectorDefinitions,
  "speedometer.SpeedometerArcWithoutLine": {
    inputs: {
      attrs: {
        arcSpeed: {
          stroke: {
            type: "color-palette",
            options: options.colorPalette,
            label: "Outline speed",
            group: "presentation",
            index: 3,
          },
        },
        speedValue: {
          fill: {
            type: "color-palette",
            options: options.colorPalette,
            label: "Color value",
            group: "presentation",
            index: 5,
          },
          fontSize: {
            type: "range",
            min: 5,
            max: 80,
            unit: "px",
            label: "Font size",
            group: "presentation",
            index: 6,
          },
        },
        body: {
          fill: {
            type: "color-palette",
            options: options.colorPalette,
            label: "Color",
            group: "presentation",
            index: 1,
          },
          stroke: {
            type: "color-palette",
            options: options.colorPalette,
            label: "Outline",
            group: "presentation",
            index: 2,
          },
          strokeWidth: {
            type: "range",
            min: 0,
            max: strokeWidthMax,
            step: 1,
            unit: "px",
            label: "Thickness",
            group: "presentation",
            index: 3,
          },
          strokeDasharray: {
            type: "select-box",
            options: options.strokeStyle,
            label: "Style",
            group: "presentation",
            when: { ne: { "attrs/body/strokeWidth": 0 } },
            index: 4,
          },
        },
      },
      speed: {
        type: "range",
        min: 0,
        max: maxSpeed,
        step: 1,
        label: "Speed",
        group: "action",
      },
    },
    groups: {
      presentation: {
        label: "Presentation",
        index: 1,
      },
      text: {
        label: "Text",
        index: 2,
      },
      action: {
        label: "Action",
        index: 3,
      },
    },
  },
  "speedometer.SpeedometerArc": {
    inputs: {
      attrs: {
        lineSpeed: {
          stroke: {
            type: "color-palette",
            options: options.colorPalette,
            label: "Outline speed",
            group: "presentation",
            index: 5,
          },
          strokeWidth: {
            type: "range",
            min: 0,
            max: strokeWidthMax,
            step: 1,
            unit: "px",
            label: "Line Speed Thickness",
            group: "presentation",
            index: 6,
          },
        },
        body: {
          fill: {
            type: "color-palette",
            options: options.colorPalette,
            label: "Color",
            group: "presentation",
            index: 1,
          },
          stroke: {
            type: "color-palette",
            options: options.colorPalette,
            label: "Outline",
            group: "presentation",
            index: 2,
          },
          strokeWidth: {
            type: "range",
            min: 0,
            max: strokeWidthMax,
            step: 1,
            unit: "px",
            label: "Thickness",
            group: "presentation",
            index: 3,
          },
          strokeDasharray: {
            type: "select-box",
            options: options.strokeStyle,
            label: "Style",
            group: "presentation",
            when: { ne: { "attrs/body/strokeWidth": 0 } },
            index: 4,
          },
        },
      },
      speed: {
        type: "range",
        min: 0,
        max: maxSpeed,
        step: 1,
        label: "Speed",
        group: "action",
      },
    },
    groups: {
      presentation: {
        label: "Presentation",
        index: 1,
      },
      text: {
        label: "Text",
        index: 2,
      },
      action: {
        label: "Action",
        index: 3,
      },
    },
  },
  "speedometer.SpeedometerCircle": {
    inputs: {
      tickTextColor: {
        type: "color-palette",
        options: options.colorPalette,
        label: "Text Color",
        group: "presentation",
        index: 5,
      },
      attrs: {
        body: {
          fill: {
            type: "color-palette",
            options: options.colorPalette,
            label: "Color",
            group: "presentation",
            index: 1,
          },
          stroke: {
            type: "color-palette",
            options: options.colorPalette,
            label: "Outline",
            group: "presentation",
            index: 2,
          },
          strokeWidth: {
            type: "range",
            min: 0,
            max: strokeWidthMax,
            step: 1,
            unit: "px",
            label: "Thickness",
            group: "presentation",
            index: 3,
          },
          strokeDasharray: {
            type: "select-box",
            options: options.strokeStyle,
            label: "Style",
            group: "presentation",
            when: { ne: { "attrs/body/strokeWidth": 0 } },
            index: 4,
          },
        },
      },
      speed: {
        type: "range",
        min: 0,
        max: maxSpeed,
        step: 1,
        label: "Speed",
        group: "action",
      },
    },
    groups: {
      presentation: {
        label: "Presentation",
        index: 1,
      },
      text: {
        label: "Text",
        index: 2,
      },
      action: {
        label: "Action",
        index: 3,
      },
    },
  },
  "app.Link": {
    inputs: {
      attrs: {
        line: {
          strokeWidth: {
            type: "select-button-group",
            options: options.strokeWidth,
            group: "connection",
            label: "Link thickness",
            when: { ne: { "attrs/line/stroke": "transparent" } },
            index: 5,
          },
          strokeDasharray: {
            type: "select-box",
            options: options.strokeStyle,
            group: "connection",
            label: "Link style",
            when: { ne: { "attrs/line/stroke": "transparent" } },
            index: 6,
          },
          stroke: {
            type: "color-palette",
            options: options.colorPalette,
            group: "connection",
            label: "Fill",
            index: 7,
          },
          sourceMarker: {
            d: {
              type: "select-box",
              options: options.arrowheadSize,
              group: "marker-source",
              label: "Source arrowhead",
              index: 1,
            },
            fill: {
              type: "color-palette",
              options: options.colorPaletteReset,
              group: "marker-source",
              label: "Fill",
              when: { ne: { "attrs/line/sourceMarker/d": "M 0 0 0 0" } },
              index: 2,
            },
          },
          targetMarker: {
            d: {
              type: "select-box",
              options: options.arrowheadSize,
              group: "marker-target",
              label: "Target arrowhead",
              index: 1,
            },
            fill: {
              type: "color-palette",
              options: options.colorPaletteReset,
              group: "marker-target",
              label: "Fill",
              when: { ne: { "attrs/line/targetMarker/d": "M 0 0 0 0" } },
              index: 2,
            },
          },
        },
      },
      router: {
        name: {
          type: "select-button-group",
          options: options.router,
          group: "connection",
          label: "Connection type",
          index: 1,
        },
        args: {
          sourceDirection: {
            type: "select-box",
            options: options.side,
            placeholder: "Pick a side",
            group: "connection",
            label: "Source anchor side",
            when: {
              eq: { "router/name": "rightAngle" },
              otherwise: { unset: true },
            },
            index: 2,
          },
          targetDirection: {
            type: "select-box",
            options: options.side,
            placeholder: "Pick a side",
            group: "connection",
            label: "Target anchor side",
            when: {
              eq: { "router/name": "rightAngle" },
              otherwise: { unset: true },
            },
            index: 3,
          },
        },
      },
      connector: {
        name: {
          type: "select-button-group",
          options: options.connector,
          group: "connection",
          label: "Connection style",
          index: 4,
        },
      },
      labels: {
        type: "list",
        group: "labels",
        label: "Labels",
        attrs: {
          label: {
            "data-tooltip": "Set (possibly multiple) labels for the link",
            "data-tooltip-position": "right",
            "data-tooltip-position-selector": ".joint-inspector",
          },
        },
        item: {
          type: "object",
          properties: {
            attrs: {
              text: {
                text: {
                  type: "content-editable",
                  label: "text",
                  defaultValue: "label",
                  index: 1,
                  attrs: {
                    label: {
                      "data-tooltip": "Set text of the label",
                      "data-tooltip-position": "right",
                      "data-tooltip-position-selector": ".joint-inspector",
                    },
                  },
                },
                fill: {
                  type: "color-palette",
                  options: options.colorPaletteReset,
                  defaultValue: "#353535",
                  label: "Text Color",
                  index: 5,
                },
              },
              rect: {
                fill: {
                  type: "color-palette",
                  options: options.colorPaletteReset,
                  defaultValue: "#FFFFFF",
                  label: "Fill",
                  index: 3,
                },
                stroke: {
                  type: "color-palette",
                  options: options.colorPaletteReset,
                  defaultValue: "#353535",
                  label: "Outline",
                  index: 4,
                },
              },
            },
            position: {
              type: "select-box",
              options: options.labelPosition || [],
              selectBoxOptionsClass: "list-select-box",
              defaultValue: 0.5,
              label: "Position",
              placeholder: "Custom",
              index: 2,
              attrs: {
                label: {
                  "data-tooltip":
                    "Position the label relative to the source of the link",
                  "data-tooltip-position": "right",
                  "data-tooltip-position-selector": ".joint-inspector",
                },
              },
            },
          },
        },
      },
    },
    groups: {
      connection: {
        label: "Connection",
        index: 1,
      },
      "marker-source": {
        label: "Source marker",
        index: 2,
      },
      "marker-target": {
        label: "Target marker",
        index: 3,
      },
      labels: {
        label: "Labels",
        index: 4,
      },
    },
  },
  "standard.Rectangle": {
    inputs: {
      attrs: {
        label: {
          text: {
            type: "content-editable",
            label: "Text",
            group: "text",
            index: 1,
          },
          fontSize: {
            type: "range",
            min: 5,
            max: 80,
            unit: "px",
            label: "Font size",
            group: "text",
            when: { ne: { "attrs/label/text": "" } },
            index: 2,
          },
          fontFamily: {
            type: "select-box",
            options: options.fontFamily,
            label: "Font family",
            group: "text",
            when: { ne: { "attrs/label/text": "" } },
            index: 3,
          },
          fontWeight: {
            type: "select-box",
            options: options.fontWeight,
            label: "Font thickness",
            group: "text",
            when: { ne: { "attrs/label/text": "" } },
            index: 4,
          },
          fill: {
            type: "color-palette",
            options: options.colorPalette,
            label: "Text Color",
            group: "text",
            when: { ne: { "attrs/label/text": "" } },
            index: 5,
          },
        },
        body: {
          fill: {
            type: "color-palette",
            options: options.colorPalette,
            label: "Fill",
            group: "presentation",
            index: 1,
          },
          stroke: {
            type: "color-palette",
            options: options.colorPalette,
            label: "Outline",
            group: "presentation",
            index: 2,
          },
          strokeWidth: {
            type: "range",
            min: 0,
            max: 30,
            step: 1,
            unit: "px",
            label: "Outline thickness",
            group: "presentation",
            when: { ne: { "attrs/body/stroke": "transparent" } },
            index: 3,
          },
          strokeDasharray: {
            type: "select-box",
            options: options.strokeStyle,
            label: "Outline style",
            group: "presentation",
            when: {
              and: [
                { ne: { "attrs/body/stroke": "transparent" } },
                { ne: { "attrs/body/strokeWidth": 0 } },
              ],
            },
            index: 4,
          },
          rx: {
            type: "range",
            min: 0,
            max: maxRoundedCorners,
            label: "Rounded corners Horizontal",
            group: "presentation",
            index: 5,
          },
          ry: {
            type: "range",
            min: 0,
            max: maxRoundedCorners,
            label: "Rounded corners Vertical",
            group: "presentation",
            index: 6,
          },
        },
      },
    },
    groups: {
      presentation: {
        label: "Presentation",
        index: 1,
      },
      text: {
        label: "Text",
        index: 2,
      },
    },
  },
  "app.Circle": {
    inputs: {
      attrs: {
        label: {
          text: {
            type: "content-editable",
            label: "Text",
            group: "text",
            index: 1,
          },
          fontSize: {
            type: "range",
            min: 5,
            max: 80,
            unit: "px",
            label: "Font size",
            group: "text",
            when: { ne: { "attrs/label/text": "" } },
            index: 2,
          },
          fontFamily: {
            type: "select-box",
            options: options.fontFamily,
            label: "Font family",
            group: "text",
            when: { ne: { "attrs/label/text": "" } },
            index: 3,
          },
          fontWeight: {
            type: "select-box",
            options: options.fontWeight,
            label: "Font thickness",
            group: "text",
            when: { ne: { "attrs/label/text": "" } },
            index: 4,
          },
          fill: {
            type: "color-palette",
            options: options.colorPalette,
            label: "Text Color",
            group: "text",
            when: { ne: { "attrs/label/text": "" } },
            index: 5,
          },
        },
        body: {
          fill: {
            type: "color-palette",
            options: options.colorPalette,
            label: "Fill",
            group: "presentation",
            index: 1,
          },
          stroke: {
            type: "color-palette",
            options: options.colorPalette,
            label: "Outline",
            group: "presentation",
            index: 2,
          },
          strokeWidth: {
            type: "range",
            min: 0,
            max: 30,
            step: 1,
            unit: "px",
            label: "Outline thickness",
            group: "presentation",
            when: { ne: { "attrs/body/stroke": "transparent" } },
            index: 3,
          },
          strokeDasharray: {
            type: "select-box",
            options: options.strokeStyle,
            label: "Outline style",
            group: "presentation",
            when: {
              and: [
                { ne: { "attrs/body/stroke": "transparent" } },
                { ne: { "attrs/body/stroke-width": 0 } },
              ],
            },
            index: 4,
          },
        },
      },
    },
    groups: {
      presentation: {
        label: "Presentation",
        index: 1,
      },
      text: {
        label: "Text",
        index: 2,
      },
    },
  },
  "standard.Ellipse": {
    inputs: {
      attrs: {
        label: {
          text: {
            type: "content-editable",
            label: "Text",
            group: "text",
            index: 1,
          },
          fontSize: {
            type: "range",
            min: 5,
            max: 80,
            unit: "px",
            label: "Font size",
            group: "text",
            when: { ne: { "attrs/label/text": "" } },
            index: 2,
          },
          fontFamily: {
            type: "select-box",
            options: options.fontFamily,
            label: "Font family",
            group: "text",
            when: { ne: { "attrs/label/text": "" } },
            index: 3,
          },
          fontWeight: {
            type: "select-box",
            options: options.fontWeight,
            label: "Font thickness",
            group: "text",
            when: { ne: { "attrs/label/text": "" } },
            index: 4,
          },
          fill: {
            type: "color-palette",
            options: options.colorPalette,
            label: "Text Color",
            group: "text",
            when: { ne: { "attrs/label/text": "" } },
            index: 5,
          },
        },
        body: {
          fill: {
            type: "color-palette",
            options: options.colorPalette,
            label: "Fill",
            group: "presentation",
            index: 1,
          },
          stroke: {
            type: "color-palette",
            options: options.colorPalette,
            label: "Outline",
            group: "presentation",
            index: 2,
          },
          strokeWidth: {
            type: "range",
            min: 0,
            max: 30,
            step: 1,
            unit: "px",
            label: "Outline thickness",
            group: "presentation",
            when: { ne: { "attrs/body/stroke": "transparent" } },
            index: 3,
          },
          strokeDasharray: {
            type: "select-box",
            options: options.strokeStyle,
            label: "Outline style",
            group: "presentation",
            when: {
              and: [
                { ne: { "attrs/body/stroke": "transparent" } },
                { ne: { "attrs/body/stroke-width": 0 } },
              ],
            },
            index: 4,
          },
        },
      },
    },
    groups: {
      presentation: {
        label: "Presentation",
        index: 1,
      },
      text: {
        label: "Text",
        index: 2,
      },
    },
  },
  "standard.Polygon": {
    inputs: {
      attrs: {
        label: {
          text: {
            type: "content-editable",
            label: "Text",
            group: "text",
            index: 1,
          },
          fontSize: {
            type: "range",
            min: 5,
            max: 80,
            unit: "px",
            label: "Font size",
            group: "text",
            when: { ne: { "attrs/label/text": "" } },
            index: 2,
          },
          fontFamily: {
            type: "select-box",
            options: options.fontFamily,
            label: "Font family",
            group: "text",
            when: { ne: { "attrs/label/text": "" } },
            index: 3,
          },
          fontWeight: {
            type: "select-box",
            options: options.fontWeight,
            label: "Font thickness",
            group: "text",
            when: { ne: { "attrs/label/text": "" } },
            index: 4,
          },
          fill: {
            type: "color-palette",
            options: options.colorPalette,
            label: "Text Color",
            group: "text",
            when: { ne: { "attrs/label/text": "" } },
            index: 5,
          },
        },
        body: {
          fill: {
            type: "color-palette",
            options: options.colorPalette,
            label: "Fill",
            group: "presentation",
            index: 1,
          },
          stroke: {
            type: "color-palette",
            options: options.colorPalette,
            label: "Outline",
            group: "presentation",
            index: 2,
          },
          strokeWidth: {
            type: "range",
            min: 0,
            max: 30,
            step: 1,
            unit: "px",
            label: "Outline thickness",
            group: "presentation",
            when: { ne: { "attrs/body/stroke": "transparent" } },
            index: 3,
          },
          strokeDasharray: {
            type: "select-box",
            options: options.strokeStyle,
            label: "Outline style",
            group: "presentation",
            when: {
              and: [
                { ne: { "attrs/body/stroke": "transparent" } },
                { ne: { "attrs/body/strokeWidth": 0 } },
              ],
            },
            index: 4,
          },
        },
      },
    },
    groups: {
      presentation: {
        label: "Presentation",
        index: 1,
      },
      text: {
        label: "Text",
        index: 2,
      },
    },
  },
  "standard.Polyline": {
    inputs: {
      attrs: {
        body: {
          fill: {
            type: "color-palette",
            options: options.colorPalette,
            label: "Fill",
            group: "presentation",
            index: 1,
          },
          stroke: {
            type: "color-palette",
            options: options.colorPalette,
            label: "Outline",
            group: "presentation",
            index: 2,
          },
          strokeWidth: {
            type: "range",
            min: 0,
            max: 30,
            step: 1,
            unit: "px",
            label: "Thickness",
            group: "presentation",
            index: 3,
          },
          strokeDasharray: {
            type: "select-box",
            options: options.strokeStyle,
            label: "Style",
            group: "presentation",
            when: { ne: { "attrs/line/strokeWidth": 0 } },
            index: 4,
          },
        },
        label: {
          text: {
            type: "content-editable",
            label: "Text",
            group: "text",
            index: 1,
          },
          fontSize: {
            type: "range",
            min: 5,
            max: 80,
            unit: "px",
            label: "Font size",
            group: "text",
            when: { ne: { "attrs/label/text": "" } },
            index: 2,
          },
          fontFamily: {
            type: "select-box",
            options: options.fontFamily,
            label: "Font family",
            group: "text",
            when: { ne: { "attrs/label/text": "" } },
            index: 3,
          },
          fontWeight: {
            type: "select-box",
            options: options.fontWeight,
            label: "Font thickness",
            group: "text",
            when: { ne: { "attrs/label/text": "" } },
            index: 4,
          },
          fill: {
            type: "color-palette",
            options: options.colorPalette,
            label: "Text Color",
            group: "text",
            when: { ne: { "attrs/label/text": "" } },
            index: 5,
          },
        },
      },
    },
    groups: {
      presentation: {
        label: "Presentation",
        index: 1,
      },
      text: {
        label: "Text",
        index: 2,
      },
    },
  },
  "standard.Path": {
    inputs: {
      attrs: {
        body: {
          fill: {
            type: "color-palette",
            options: options.colorPalette,
            label: "Color",
            group: "presentation",
            index: 1,
          },
          stroke: {
            type: "color-palette",
            options: options.colorPalette,
            label: "Outline",
            group: "presentation",
            index: 2,
          },
          strokeWidth: {
            type: "range",
            min: 0,
            max: 30,
            step: 1,
            unit: "px",
            label: "Thickness",
            group: "presentation",
            index: 3,
          },
          strokeDasharray: {
            type: "select-box",
            options: options.strokeStyle,
            label: "Style",
            group: "presentation",
            when: { ne: { "attrs/body/strokeWidth": 0 } },
            index: 4,
          },
        },
        label: {
          text: {
            type: "content-editable",
            label: "Text",
            group: "text",
            index: 1,
          },
          fontSize: {
            type: "range",
            min: 5,
            max: 80,
            unit: "px",
            label: "Font size",
            group: "text",
            when: { ne: { "attrs/label/text": "" } },
            index: 2,
          },
          fontFamily: {
            type: "select-box",
            options: options.fontFamily,
            label: "Font family",
            group: "text",
            when: { ne: { "attrs/label/text": "" } },
            index: 3,
          },
          fontWeight: {
            type: "select-box",
            options: options.fontWeight,
            label: "Font thickness",
            group: "text",
            when: { ne: { "attrs/label/text": "" } },
            index: 4,
          },
          fill: {
            type: "color-palette",
            options: options.colorPalette,
            label: "Text Color",
            group: "text",
            when: { ne: { "attrs/label/text": "" } },
            index: 5,
          },
        },
      },
    },
    groups: {
      presentation: {
        label: "Presentation",
        index: 1,
      },
      text: {
        label: "Text",
        index: 2,
      },
    },
  },
  "standard.Image": {
    inputs: {
      attrs: {
        label: {
          text: {
            type: "content-editable",
            label: "Text",
            group: "text",
            index: 1,
          },
          fontSize: {
            type: "range",
            min: 5,
            max: 80,
            unit: "px",
            label: "Font size",
            group: "text",
            when: { ne: { "attrs/label/text": "" } },
            index: 2,
          },
          fontFamily: {
            type: "select-box",
            options: options.fontFamily,
            label: "Font family",
            group: "text",
            when: { ne: { "attrs/label/text": "" } },
            index: 3,
          },
          fontWeight: {
            type: "select-box",
            options: options.fontWeight,
            label: "Font thickness",
            group: "text",
            when: { ne: { "attrs/label/text": "" } },
            index: 4,
          },
          fill: {
            type: "color-palette",
            options: options.colorPalette,
            label: "Text Color",
            group: "text",
            when: { ne: { "attrs/label/text": "" } },
            index: 5,
          },
        },
        image: {
          xlinkHref: {
            type: "image-picker",
            label: "Image",
            group: "presentation",
            index: 1,
          },
        },
      },
    },
    groups: {
      presentation: {
        label: "Presentation",
        index: 1,
      },
      text: {
        label: "Text",
        index: 2,
      },
    },
  },
  "standard.EmbeddedImage": {
    inputs: {
      attrs: {
        label: {
          text: {
            type: "content-editable",
            label: "Text",
            group: "text",
            index: 1,
          },
          fontSize: {
            type: "range",
            min: 5,
            max: 80,
            unit: "px",
            label: "Font size",
            group: "text",
            when: { ne: { "attrs/label/text": "" } },
            index: 2,
          },
          fontFamily: {
            type: "select-box",
            options: options.fontFamily,
            label: "Font family",
            group: "text",
            when: { ne: { "attrs/label/text": "" } },
            index: 3,
          },
          fontWeight: {
            type: "select-box",
            options: options.fontWeight,
            label: "Font thickness",
            group: "text",
            when: { ne: { "attrs/label/text": "" } },
            index: 4,
          },
          fill: {
            type: "color-palette",
            options: options.colorPalette,
            label: "Text Color",
            group: "text",
            when: { ne: { "attrs/label/text": "" } },
            index: 5,
          },
        },
        body: {
          fill: {
            type: "color-palette",
            options: options.colorPalette,
            label: "Color",
            group: "presentation",
            index: 1,
          },
          stroke: {
            type: "color-palette",
            options: options.colorPalette,
            label: "Outline",
            group: "presentation",
            index: 2,
          },
          strokeWidth: {
            type: "range",
            min: 0,
            max: 30,
            step: 1,
            unit: "px",
            label: "Outline thickness",
            group: "presentation",
            when: { ne: { "attrs/body/stroke": "transparent" } },
            index: 3,
          },
          strokeDasharray: {
            type: "select-box",
            options: options.strokeStyle,
            label: "Outline style",
            group: "presentation",
            when: {
              and: [
                { ne: { "attrs/body/stroke": "transparent" } },
                { ne: { "attrs/body/strokeWidth": 0 } },
              ],
            },
            index: 4,
          },
        },
        image: {
          xlinkHref: {
            type: "image-picker",
            label: "Image",
            group: "presentation",
            index: 5,
          },
        },
      },
    },
    groups: {
      presentation: {
        label: "Presentation",
        index: 2,
      },
      text: {
        label: "Text",
        index: 3,
      },
    },
  },
  "standard.HeaderedRectangle": {
    inputs: {
      attrs: {
        header: {
          fill: {
            type: "color-palette",
            options: options.colorPalette,
            label: "Color",
            group: "header",
            index: 1,
          },
          stroke: {
            type: "color-palette",
            options: options.colorPalette,
            label: "Outline",
            group: "header",
            index: 2,
          },
          strokeWidth: {
            type: "range",
            min: 0,
            max: 30,
            step: 1,
            unit: "px",
            label: "Outline thickness",
            group: "header",
            when: { ne: { "attrs/header/stroke": "transparent" } },
            index: 3,
          },
          strokeDasharray: {
            type: "select-box",
            options: options.strokeStyle,
            label: "Outline style",
            group: "header",
            when: {
              and: [
                { ne: { "attrs/header/stroke": "transparent" } },
                { ne: { "attrs/header/strokeWidth": 0 } },
              ],
            },
            index: 4,
          },
        },
        headerText: {
          text: {
            type: "content-editable",
            label: "Text",
            group: "headerText",
            index: 1,
          },
          fontSize: {
            type: "range",
            min: 5,
            max: 80,
            unit: "px",
            label: "Font size",
            group: "headerText",
            when: { ne: { "attrs/headerText/text": "" } },
            index: 2,
          },
          fontFamily: {
            type: "select-box",
            options: options.fontFamily,
            label: "Font family",
            group: "headerText",
            when: { ne: { "attrs/headerText/text": "" } },
            index: 3,
          },
          fontWeight: {
            type: "select-box",
            options: options.fontWeight,
            label: "Font thickness",
            group: "headerText",
            when: { ne: { "attrs/headerText/text": "" } },
            index: 4,
          },
          fill: {
            type: "color-palette",
            options: options.colorPalette,
            label: "Text Color",
            group: "headerText",
            when: { ne: { "attrs/headerText/text": "" } },
            index: 5,
          },
        },
        body: {
          fill: {
            type: "color-palette",
            options: options.colorPalette,
            label: "Color",
            group: "body",
            index: 1,
          },
          stroke: {
            type: "color-palette",
            options: options.colorPalette,
            label: "Outline",
            group: "body",
            index: 2,
          },
          strokeWidth: {
            type: "range",
            min: 0,
            max: 30,
            step: 1,
            unit: "px",
            label: "Outline thickness",
            group: "body",
            when: { ne: { "attrs/body/stroke": "transparent" } },
            index: 3,
          },
          strokeDasharray: {
            type: "select-box",
            options: options.strokeStyle,
            label: "Outline style",
            group: "body",
            when: {
              and: [
                { ne: { "attrs/body/stroke": "transparent" } },
                { ne: { "attrs/body/strokeWidth": 0 } },
              ],
            },
            index: 4,
          },
        },
        bodyText: {
          text: {
            type: "content-editable",
            label: "Text",
            group: "bodyText",
            index: 1,
          },
          fontSize: {
            type: "range",
            min: 5,
            max: 80,
            unit: "px",
            label: "Font size",
            group: "bodyText",
            when: { ne: { "attrs/bodyText/text": "" } },
            index: 2,
          },
          fontFamily: {
            type: "select-box",
            options: options.fontFamily,
            label: "Font family",
            group: "bodyText",
            when: { ne: { "attrs/bodyText/text": "" } },
            index: 3,
          },
          fontWeight: {
            type: "select-box",
            options: options.fontWeight,
            label: "Font thickness",
            group: "bodyText",
            when: { ne: { "attrs/bodyText/text": "" } },
            index: 4,
          },
          fill: {
            type: "color-palette",
            options: options.colorPalette,
            label: "Text Color",
            group: "bodyText",
            when: { ne: { "attrs/boduText/text": "" } },
            index: 5,
          },
        },
      },
    },
    groups: {
      header: {
        label: "Header Presentation",
        index: 1,
      },
      headerText: {
        label: "Header Text",
        index: 2,
      },
      body: {
        label: "Body Presentation",
        index: 3,
      },
      bodyText: {
        label: "Body Text",
        index: 4,
      },
    },
  },
  "standard.InscribedImage": {
    inputs: {
      attrs: {
        label: {
          text: {
            type: "content-editable",
            label: "Text",
            group: "text",
            index: 1,
          },
          fontSize: {
            type: "range",
            min: 5,
            max: 80,
            unit: "px",
            label: "Font size",
            group: "text",
            when: { ne: { "attrs/label/text": "" } },
            index: 2,
          },
          fontFamily: {
            type: "select-box",
            options: options.fontFamily,
            label: "Font family",
            group: "text",
            when: { ne: { "attrs/label/text": "" } },
            index: 3,
          },
          fontWeight: {
            type: "select-box",
            options: options.fontWeight,
            label: "Font thickness",
            group: "text",
            when: { ne: { "attrs/label/text": "" } },
            index: 4,
          },
          fill: {
            type: "color-palette",
            options: options.colorPalette,
            label: "Text Color",
            group: "text",
            when: { ne: { "attrs/label/text": "" } },
            index: 5,
          },
        },
        background: {
          fill: {
            type: "color-palette",
            options: options.colorPalette,
            label: "Color",
            group: "presentation",
            index: 2,
          },
        },
        border: {
          stroke: {
            type: "color-palette",
            options: options.colorPalette,
            label: "Outline",
            group: "presentation",
            index: 3,
          },
          strokeWidth: {
            type: "range",
            min: 0,
            max: 10,
            step: 1,
            unit: "px",
            label: "Outline thickness",
            group: "presentation",
            when: { ne: { "attrs/border/stroke": "transparent" } },
            index: 4,
          },
        },
        image: {
          xlinkHref: {
            type: "image-picker",
            label: "Image",
            group: "presentation",
            index: 5,
          },
        },
      },
    },
    groups: {
      presentation: {
        label: "Presentation",
        index: 1,
      },
      text: {
        label: "Text",
        index: 2,
      },
    },
  },
  "standard.Cylinder": {
    inputs: {
      attrs: {
        label: {
          text: {
            type: "content-editable",
            label: "Text",
            group: "text",
            index: 1,
          },
          fontSize: {
            type: "range",
            min: 5,
            max: 80,
            unit: "px",
            label: "Font size",
            group: "text",
            when: { ne: { "attrs/label/text": "" } },
            index: 2,
          },
          fontFamily: {
            type: "select-box",
            options: options.fontFamily,
            label: "Font family",
            group: "text",
            when: { ne: { "attrs/label/text": "" } },
            index: 3,
          },
          fontWeight: {
            type: "select-box",
            options: options.fontWeight,
            label: "Font thickness",
            group: "text",
            when: { ne: { "attrs/label/text": "" } },
            index: 4,
          },
          fill: {
            type: "color-palette",
            options: options.colorPalette,
            label: "Text Color",
            group: "text",
            when: { ne: { "attrs/label/text": "" } },
            index: 5,
          },
        },
        body: {
          fill: {
            type: "color-palette",
            options: options.colorPalette,
            label: "Color",
            group: "presentation",
            index: 1,
          },
          stroke: {
            type: "color-palette",
            options: options.colorPalette,
            label: "Outline",
            group: "presentation",
            index: 2,
          },
          strokeWidth: {
            type: "range",
            min: 0,
            max: 30,
            step: 1,
            unit: "px",
            label: "Outline thickness",
            group: "presentation",
            when: { ne: { "attrs/body/stroke": "transparent" } },
            index: 3,
          },
          strokeDasharray: {
            type: "select-box",
            options: options.strokeStyle,
            label: "Outline style",
            group: "presentation",
            when: {
              and: [
                { ne: { "attrs/body/stroke": "transparent" } },
                { ne: { "attrs/body/strokeWidth": 0 } },
              ],
            },
            index: 4,
          },
        },
        top: {
          fill: {
            type: "color-palette",
            options: options.colorPalette,
            label: "Fill",
            group: "top",
            index: 1,
          },
          stroke: {
            type: "color-palette",
            options: options.colorPalette,
            label: "Outline",
            group: "top",
            index: 2,
          },
          strokeWidth: {
            type: "range",
            min: 0,
            max: 30,
            step: 1,
            unit: "px",
            label: "Outline thickness",
            group: "top",
            when: { ne: { "attrs/body/stroke": "transparent" } },
            index: 3,
          },
          strokeDasharray: {
            type: "select-box",
            options: options.strokeStyle,
            label: "Outline style",
            group: "top",
            when: {
              and: [
                { ne: { "attrs/body/stroke": "transparent" } },
                { ne: { "attrs/body/strokeWidth": 0 } },
              ],
            },
            index: 4,
          },
        },
      },
    },
    groups: {
      presentation: {
        label: "Presentation",
        index: 1,
      },
      top: {
        label: "Top",
        index: 2,
      },
      text: {
        label: "Text",
        index: 3,
      },
    },
  },
};

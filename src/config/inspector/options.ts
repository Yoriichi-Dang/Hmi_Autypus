export const BORDER_COLOR = "#374151";
export const strokeWidthMax = 100;
export const maxRoundedCorners = 100;
export const maxSpeed = 270;
export const options = {
  colorPalette: [
    { content: "transparent", icon: "assets/transparent-icon.svg" },
    { content: "#000000" },
    { content: "#1B1B1B" },
    { content: "#353535" },
    { content: "#626262" },
    { content: "#D4D4D4" },
    { content: "#E4ECF7" },
    { content: "#FFFFFF" },
    { content: "#F5242C" },
    { content: "#7E4AD3" },
    { content: "#6EACDA" },
    { content: "#03346E" },
    { content: "#021526" },
    { content: "#433D8B" },
    { content: "#2E236C" },
    { content: "#17153B" },
    { content: "#23036a" },
    { content: "#30009c" },
    { content: "#3700b3" },
    { content: "#5600e8" },
    { content: "#6101ee" },
    { content: "#7f39fb" },
    { content: "#02002e" },
    { content: "#010048" },
    { content: "#010057" },
    { content: "#02006b" },
    { content: "#090088" },
    { content: "#01fff3" },
    { content: "#01bbd1" },
  ],

  colorPaletteReset: [
    { content: "transparent", icon: "assets/no-color-icon.svg" },
    { content: "#000000" },
    { content: "#1B1B1B" },
    { content: "#353535" },
    { content: "#626262" },
    { content: "#D4D4D4" },
    { content: "#E4ECF7" },
    { content: "#FFFFFF" },
    { content: "#F5242C" },
    { content: "#7E4AD3" },
    { content: "#FB54A9" },
    { content: "#33B6D1" },
    { content: "#2A3A4E" },
    { content: "#3771B8" },
    { content: "#F27F31" },
    { content: "#1CA25D" },
  ],

  fontWeight: [
    { value: "300", content: '<span style="font-weight: 300">Light</span>' },
    {
      value: "Normal",
      content: '<span style="font-weight: Normal">Normal</span>',
    },
    { value: "Bold", content: '<span style="font-weight: Bolder">Bold</span>' },
  ],

  fontFamily: [
    {
      value: "Open Sans",
      content: '<span style="font-family: Open Sans">Open Sans</span>',
    },
    {
      value: "DM Sans",
      content: '<span style="font-family: DM Sans">DM Sans</span>',
    },
    {
      value: "Roboto Flex",
      content: '<span style="font-family: Roboto Flex">Roboto Flex</span>',
    },
  ],

  strokeStyle: [
    { value: "0", content: "Solid" },
    { value: "2,5", content: "Dotted" },
    { value: "10,5", content: "Dashed" },
  ],

  side: [
    { value: "top", content: "Top Side" },
    { value: "right", content: "Right Side" },
    { value: "bottom", content: "Bottom Side" },
    { value: "left", content: "Left Side" },
  ],

  portLabelPositionRectangle: [
    { value: { name: "top", args: { y: -12 } }, content: "Above" },
    { value: { name: "right", args: { y: 0 } }, content: "On Right" },
    { value: { name: "bottom", args: { y: 12 } }, content: "Below" },
    { value: { name: "left", args: { y: 0 } }, content: "On Left" },
  ],

  portLabelPositionEllipse: [
    { value: "radial", content: "Horizontal" },
    { value: "radialOriented", content: "Angled" },
  ],

  imageIcons: [
    {
      value: "assets/image-icon1.svg",
      content: '<img height="42px" src="assets/image-icon1.svg"/>',
    },
    {
      value: "assets/image-icon2.svg",
      content: '<img height="80px" src="assets/image-icon2.svg"/>',
    },
    {
      value: "assets/image-icon3.svg",
      content: '<img height="80px" src="assets/image-icon3.svg"/>',
    },
    {
      value: "assets/image-icon4.svg",
      content: '<img height="80px" src="assets/image-icon4.svg"/>',
    },
  ],

  imageGender: [
    {
      value: "assets/member-male.png",
      content:
        '<img height="50px" src="assets/member-male.png" style="margin: 5px 0 0 2px;"/>',
    },
    {
      value: "assets/member-female.png",
      content:
        '<img height="50px" src="assets/member-female.png" style="margin: 5px 0 0 2px;"/>',
    },
  ],

  arrowheadSize: [
    { value: "M 0 0 0 0", content: "None" },
    { value: "M 0 -3 -6 0 0 3 z", content: "Small" },
    { value: "M 0 -5 -10 0 0 5 z", content: "Medium" },
    { value: "M 0 -10 -15 0 0 10 z", content: "Large" },
  ],

  strokeWidth: [
    {
      value: 1,
      content: `<div style="background:${BORDER_COLOR};width:2px;height:30px;margin:0 14px;border-radius: 2px;"/>`,
    },
    {
      value: 2,
      content: `<div style="background:${BORDER_COLOR};width:4px;height:30px;margin:0 13px;border-radius: 2px;"/>`,
    },
    {
      value: 4,
      content: `<div style="background:${BORDER_COLOR};width:8px;height:30px;margin:0 11px;border-radius: 2px;"/>`,
    },
    {
      value: 8,
      content: `<div style="background:${BORDER_COLOR};width:16px;height:30px;margin:0 8px;border-radius: 2px;"/>`,
    },
  ],

  router: [
    {
      value: "normal",
      content: `<p style="background:${BORDER_COLOR};width:2px;height:30px;margin:0 14px;border-radius: 2px;"/>`,
      attrs: {
        ".select-button-group-button": {
          "data-tooltip": "Normal",
          "data-tooltip-position": "right",
          "data-tooltip-position-selector": ".inspector-container",
        },
      },
    },
    {
      value: "orthogonal",
      content: `<p style="width:20px;height:30px;margin:0 5px;border-bottom: 2px solid ${BORDER_COLOR};border-left: 2px solid ${BORDER_COLOR};"/>`,
      attrs: {
        ".select-button-group-button": {
          "data-tooltip": "Orthogonal",
          "data-tooltip-position": "right",
          "data-tooltip-position-selector": ".inspector-container",
        },
      },
    },
    {
      value: "rightAngle",
      content: `<p style="width:20px;height:30px;margin:0 5px;border: 2px solid ${BORDER_COLOR};border-top: none;"/>`,
      attrs: {
        ".select-button-group-button": {
          "data-tooltip": "Right Angle",
          "data-tooltip-position": "right",
          "data-tooltip-position-selector": ".inspector-container",
        },
      },
    },
  ],

  connector: [
    {
      value: "normal",
      content: `<p style="width:20px;height:20px;margin:5px;border-top:2px solid ${BORDER_COLOR};border-left:2px solid ${BORDER_COLOR};"/>`,
      attrs: {
        ".select-button-group-button": {
          "data-tooltip": "Normal",
          "data-tooltip-position": "right",
          "data-tooltip-position-selector": ".inspector-container",
        },
      },
    },
    {
      value: "rounded",
      content: `<p style="width:20px;height:20px;margin:5px;border-top-left-radius:30%;border-top:2px solid ${BORDER_COLOR};border-left:2px solid ${BORDER_COLOR};"/>`,
      attrs: {
        ".select-button-group-button": {
          "data-tooltip": "Rounded",
          "data-tooltip-position": "right",
          "data-tooltip-position-selector": ".inspector-container",
        },
      },
    },
    {
      value: "smooth",
      content: `<p style="width:20px;height:20px;margin:5px;border-top-left-radius:100%;border-top:2px solid ${BORDER_COLOR};border-left:2px solid ${BORDER_COLOR};"/>`,
      attrs: {
        ".select-button-group-button": {
          "data-tooltip": "Smooth",
          "data-tooltip-position": "right",
          "data-tooltip-position-selector": ".inspector-container",
        },
      },
    },
  ],

  labelPosition: [
    { value: 30, content: "Close to source" },
    { value: 0.5, content: "In the middle" },
    { value: -30, content: "Close to target" },
  ],

  portMarkup: [
    {
      value: [
        {
          tagName: "rect",
          selector: "portBody",
          attributes: {
            width: 20,
            height: 20,
            x: -10,
            y: -10,
          },
        },
      ],
      content: "Rectangle",
    },
    {
      value: [
        {
          tagName: "circle",
          selector: "portBody",
          attributes: {
            r: 10,
          },
        },
      ],
      content: "Circle",
    },
    {
      value: [
        {
          tagName: "path",
          selector: "portBody",
          attributes: {
            d: "M -10 -10 10 -10 0 10 z",
          },
        },
      ],
      content: "Triangle",
    },
  ],
};

import * as joint from "@joint/plus";
import { stencilGroups, stencilShapes } from "../config/stencil";
import * as appShapes from "../shapes/app-shapes";
import * as speedometer from "../shapes/speedometer";
import * as dashboardV1 from "../components/dashboard-v1";
const HIGHLIGHT_COLOR = "#F4F7FB";

// Define a custom highlighter for the stencil hover effect
const StencilBackground = joint.dia.HighlighterView.extend({
  tagName: "rect",

  attributes: {
    stroke: "none",
    fill: "transparent",
    "pointer-events": "none",
    rx: 4,
    ry: 4,
  },

  style: {
    transition: "fill 400ms",
  },

  options: {
    padding: 0,
    color: "blue",
    width: null,
    height: null,
    layer: joint.dia.Paper.Layers.BACK,
  },

  // Method called to highlight a CellView
  highlight(cellView: joint.dia.CellView) {
    const { padding, width, height } = this.options;
    const bbox = cellView.model.getBBox();
    // Highlighter is always rendered relatively to the CellView origin
    bbox.x = bbox.y = 0;
    // Custom width and height can be set
    if (Number.isFinite(width)) {
      bbox.x = (bbox.width - width) / 2;
      bbox.width = width;
    }
    if (Number.isFinite(height)) {
      bbox.y = (bbox.height - height) / 2;
      bbox.height = height;
    }
    // Increase the size of the highlighter
    bbox.inflate(padding);
    this.vel.attr(bbox.toJSON());
    // Change the color of the highlighter (allow transition)
    joint.util.nextFrame(() => this.vel.attr("fill", this.options.color));
  },
});
export default class StencilService {
  stencil: joint.ui.Stencil;

  constructor(private readonly stencilContainer: HTMLDivElement) {
    this.stencilContainer = stencilContainer;
  }
  createStencil(
    paperScroller: joint.ui.PaperScroller,
    snaplines: joint.ui.Snaplines
  ) {
    const namespace = {
      ...appShapes,
      ...dashboardV1,
      ...speedometer,
    };
    console.log(namespace);
    this.stencil = new joint.ui.Stencil({
      paper: paperScroller,
      snaplines: snaplines,
      dropAnimation: true,
      groupsToggleButtons: true,
      width: 300,
      layout: {
        columns: 4,
        marginX: 10,
        marginY: 24,
        columnGap: 20,
        rowGap: 24,
        rowHeight: 24,
        columnWidth: 36,
        resizeToFit: true,
      },
      search: {
        "*": ["type", "name"],
      },
      paperOptions: function () {
        return {
          model: new joint.dia.Graph(
            {},
            {
              cellNamespace: namespace,
            }
          ),
          cellViewNamespace: namespace,
        };
      },
      groups: this.getStencilGroups(),
      dragStartClone: (cell: joint.dia.Cell) => {
        const clone = this.createFromStencilElement(cell);
        clone.attr({
          label: {
            text: cell.get("name"),
          },
        });
        clone.unset("name");
        return clone;
      },
      el: this.stencilContainer,
    });
    this.stencil.render();
    this.startHoverListener();
  }
  createFromStencilElement(el: joint.dia.Cell) {
    const clone = el.clone();

    clone.prop(clone.get("targetAttributes"));
    clone.removeProp("targetAttributes");

    return clone;
  }
  setShapes() {
    this.stencil.load(this.getStencilShapes());
  }

  getStencilGroups() {
    return stencilGroups;
  }

  getStencilShapes() {
    return stencilShapes;
  }
  startHoverListener() {
    this.stencil.on({
      "group:element:mouseenter": (_, elementView) => {
        StencilBackground.add(elementView, "root", "stencil-highlight", {
          padding: 4,
          width: 36,
          height: 36,
          color: HIGHLIGHT_COLOR,
        });
      },
      "group:element:mouseleave": (groupPaper) => {
        StencilBackground.removeAll(groupPaper);
      },
      // Remove all highlights when the user starts dragging an element
      "group:element:pointerdown": (groupPaper) => {
        StencilBackground.removeAll(groupPaper);
      },
    });
  }
}

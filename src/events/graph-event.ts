import * as joint from "@joint/plus";
import { defaultPaperSize, pageBreakSettings } from "../services/soc-service";

export default class GraphEvent {
  paperContainer: HTMLDivElement;
  graph: joint.dia.Graph;
  paper: joint.dia.Paper;
  snaplines: joint.ui.Snaplines;
  paperScroller: joint.ui.PaperScroller;
  selection: joint.ui.Selection;
  constructor(
    graph: joint.dia.Graph,
    paper: joint.dia.Paper,
    snapline: joint.ui.Snaplines,
    paperScroller: joint.ui.PaperScroller,
    paperContainer: HTMLDivElement,
    selection: joint.ui.Selection
  ) {
    this.graph = graph;
    this.paper = paper;
    this.snaplines = snapline;
    this.paperScroller = paperScroller;
    this.paperContainer = paperContainer;
    this.selection = selection;
  }
  createGraphEvent() {
    let removePageBreaks: () => void | null = null;
    this.graph.on("remove", (cell: joint.dia.Cell) => {
      // If element is removed from the graph, remove from the selection too.
      if (this.selection.collection.has(cell)) {
        this.selection.collection.reset(
          this.selection.collection.models.filter((c) => c !== cell)
        );
      }
    });
    this.graph.on({
      "change:paperColor": (_, color: string) =>
        this.paper.drawBackground({ color }),
      "change:infinitePaper": (_, borderless: boolean) => {
        const { options } = this.paperScroller;

        if (borderless) {
          options.borderless = true;
          options.baseWidth = 100;
          options.baseHeight = 100;

          if (removePageBreaks) removePageBreaks();

          this.paperContainer.classList.remove("bordered");
        } else {
          const { width: paperWidth, height: paperHeight } = defaultPaperSize;

          options.borderless = false;
          options.baseWidth = paperWidth;
          options.baseHeight = paperHeight;

          removePageBreaks = this.addPageBreaks();

          this.paperContainer.classList.add("bordered");
        }

        this.paperScroller.adjustPaper();
      },
      "change:dotGrid": (_, showDotGrid: boolean) =>
        this.paper.setGrid(showDotGrid),
      "change:snaplines": (_, allowSnaplines: boolean) =>
        this.changeSnapLines(allowSnaplines),
      "change:gridSize": (_, gridSize: number) =>
        this.paper.setGridSize(gridSize),
    });
  }
  changeSnapLines(checked: boolean) {
    if (checked) {
      this.snaplines.enable();
    } else {
      this.snaplines.disable();
    }
  }
  addPageBreaks() {
    const { paper } = this;
    const { color, width, height } = pageBreakSettings;

    const pageBreaksVEl = joint.V("path", {
      stroke: color,
      fill: "none",
      strokeDasharray: "5,5",
    });

    paper.layers.prepend(pageBreaksVEl.node);

    let lastArea: joint.g.Rect = null;

    function updatePageBreaks() {
      const area = paper.getArea();
      // Do not update if the area is the same
      if (area.equals(lastArea)) return;
      lastArea = area;
      let d = "";
      // Draw vertical lines
      // Do not draw the first and last lines
      for (let x = width; x < area.width; x += width) {
        d += `M ${area.x + x} ${area.y} v ${area.height}`;
      }
      // Draw horizontal lines
      // Do not draw the first and last lines
      for (let y = height; y < area.height; y += height) {
        d += ` M ${area.x} ${area.y + y} h ${area.width}`;
      }
      pageBreaksVEl.attr("d", d || null);
    }

    updatePageBreaks();

    paper.on("translate resize", updatePageBreaks);

    return () => {
      paper.off("translate resize", updatePageBreaks);
      pageBreaksVEl.remove();
    };
  }
}

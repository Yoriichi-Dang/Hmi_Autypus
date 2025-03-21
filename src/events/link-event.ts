import * as joint from "@joint/plus";

export class LinkEvent {
  paper: joint.dia.Paper;
  graph: joint.dia.Graph;
  constructor(paper: joint.dia.Paper, graph: joint.dia.Graph) {
    this.graph = graph;
    this.paper = paper;
  }
  createEventLink() {
    this.paper.on("link:mouseenter", (linkView: joint.dia.LinkView) => {
      // Open tool only if there is none yet
      if (linkView.hasTools()) {
        return;
      }

      const ns = joint.linkTools;
      const toolsView = new joint.dia.ToolsView({
        name: "link-hover",
        tools: [
          new ns.Vertices({ vertexAdding: false }),
          new ns.SourceArrowhead(),
          new ns.TargetArrowhead(),
        ],
      });
      linkView.addTools(toolsView);
    });

    this.paper.on("link:mouseleave", (linkView: joint.dia.LinkView) => {
      // Remove only the hover tool, not the pointerdown tool
      if (linkView.hasTools("link-hover")) {
        linkView.removeTools();
      }
    });
  }
}

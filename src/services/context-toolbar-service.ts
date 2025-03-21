import * as joint from "@joint/plus";

export default class ContextToolbarService {
  paper: joint.dia.Paper;
  selection: joint.ui.Selection;
  graph: joint.dia.Graph;
  clipboard: joint.ui.Clipboard;
  constructor(
    paper: joint.dia.Paper,
    selection: joint.ui.Selection,
    graph: joint.dia.Graph,
    clipboard: joint.ui.Clipboard
  ) {
    this.paper = paper;
    this.selection = selection;
    this.graph = graph;
    this.clipboard = clipboard;
  }
  renderContextToolbar(
    point: joint.dia.Point,
    selectedCells: joint.dia.Cell[] = []
  ) {
    this.selection.collection.reset(selectedCells);
    const isSelectionEmpty = selectedCells.length === 0;

    const contextToolbar = new joint.ui.ContextToolbar({
      target: point,
      root: this.paper.el,
      padding: 0,
      vertical: true,
      anchor: "top-left",
      tools: [
        {
          action: "delete",
          content: "Delete",
          attrs: {
            disabled: isSelectionEmpty,
          },
        },
        {
          action: "copy",
          content: "Copy",
          attrs: {
            disabled: isSelectionEmpty,
          },
        },
        {
          action: "paste",
          content: "Paste",
          attrs: {
            disabled: this.clipboard.isEmpty(),
          },
        },
        {
          action: "send-to-front",
          content: "Send to front",
          attrs: {
            disabled: isSelectionEmpty,
          },
        },
        {
          action: "send-to-back",
          content: "Send to back",
          attrs: {
            disabled: isSelectionEmpty,
          },
        },
      ],
    });

    contextToolbar.on("action:delete", () => {
      contextToolbar.remove();
      this.graph.removeCells(selectedCells);
    });

    contextToolbar.on("action:copy", () => {
      contextToolbar.remove();

      this.clipboard.copyElements(selectedCells, this.graph);
    });

    contextToolbar.on("action:paste", () => {
      contextToolbar.remove();
      const pastedCells = this.clipboard.pasteCellsAtPoint(
        this.graph,
        this.paper.clientToLocalPoint(point)
      );

      const elements = pastedCells.filter((cell) => cell.isElement());

      // Make sure pasted elements get selected immediately. This makes the UX better as
      // the user can immediately manipulate the pasted elements.
      this.selection.collection.reset(elements);
    });

    contextToolbar.on("action:send-to-front", () => {
      contextToolbar.remove();
      selectedCells.forEach((cell) => cell.toFront());
    });

    contextToolbar.on("action:send-to-back", () => {
      contextToolbar.remove();
      selectedCells.forEach((cell) => cell.toBack());
    });

    contextToolbar.render();
  }
}

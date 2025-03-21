import * as joint from "@joint/plus";
import ContextToolbarService from "../services/context-toolbar-service";

export default class PaperEvent {
  paper: joint.dia.Paper;
  selection: joint.ui.Selection;
  graph: joint.dia.Graph;
  keyboard: joint.ui.Keyboard;
  paperScroller: joint.ui.PaperScroller;
  constructor(
    paper: joint.dia.Paper,
    selection: joint.ui.Selection,
    graph: joint.dia.Graph,
    keyboard: joint.ui.Keyboard,
    paperScroller: joint.ui.PaperScroller
  ) {
    this.paper = paper;
    this.selection = selection;
    this.graph = graph;
    this.keyboard = keyboard;
    this.paperScroller = paperScroller;
  }
  createBlankEvent() {
    this.paper.on(
      "blank:pointerdown",
      (evt: joint.dia.Event, _x: number, _y: number) => {
        if (this.keyboard.isActive("shift", evt)) {
          this.selection.startSelecting(evt);
        } else {
          this.selection.collection.reset([]);
          this.paperScroller.startPanning(evt);
          this.paper.removeTools();
        }
      }
    );
  }
  createCellEvent() {
    this.paper.on("cell:pointerup", (cellView: joint.dia.CellView) => {
      const cell = cellView.model;
      const { collection } = this.selection;
      if (collection.includes(cell)) {
        return;
      }
      collection.reset([cell]);
    });
  }
  createContextToolBarEvent(contextToolBarService: ContextToolbarService) {
    this.paper.on("blank:contextmenu", ({ clientX, clientY }, x, y) => {
      const selectionBBox = this.graph.getCellsBBox(
        this.selection.collection.toArray()
      );

      const selectedCells = selectionBBox?.containsPoint({ x, y })
        ? this.selection.collection.toArray()
        : [];

      contextToolBarService.renderContextToolbar(
        { x: clientX, y: clientY },
        selectedCells
      );
    });

    this.paper.on("cell:contextmenu", (cellView, evt) => {
      contextToolBarService.renderContextToolbar(
        { x: evt.clientX, y: evt.clientY },
        [cellView.model]
      );
    });
  }
}

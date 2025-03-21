import * as joint from "@joint/plus";
export default class ElementEvent {
  paper: joint.dia.Paper;
  selection: joint.ui.Selection;
  constructor(paper: joint.dia.Paper, selection: joint.ui.Selection) {
    this.paper = paper;
    this.selection = selection;
  }
  createElementEvent() {
    this.paper.on(
      "element:pointerdown",
      (cellView: joint.dia.CellView, evt: joint.dia.Event) => {
        this.selection.collection.reset([cellView.model]);
      }
    );
  }
}

import * as joint from "@joint/plus";
import { SelectionService } from "../services";
export default class SelectionEvent {
  private selection: joint.ui.Selection;
  private selectionService: SelectionService;
  constructor(
    selection: joint.ui.Selection,
    selectionService: SelectionService
  ) {
    this.selection = selection;
    this.selectionService = selectionService;
  }
  createEvent() {
    this.selection.collection.on("reset add remove", () => {
      this.selectionService.onSelectionChange();
    });
  }
}

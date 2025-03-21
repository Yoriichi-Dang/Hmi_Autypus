import * as joint from "@joint/plus";
import InspectorService from "./inspector-service";
import HaloService from "./halo-service";

export default class SelectionService {
  paper: joint.dia.Paper;
  selection: joint.ui.Selection;
  inspectorService: InspectorService;
  haloService: HaloService;
  constructor(
    paper: joint.dia.Paper,
    selection: joint.ui.Selection,
    inspectorService: InspectorService,
    haloService: HaloService
  ) {
    this.paper = paper;
    this.selection = selection;
    this.inspectorService = inspectorService;
    this.haloService = haloService;
  }
  onSelectionChange() {
    const { collection } = this.selection;
    this.paper.removeTools();
    joint.ui.Halo.clear(this.paper);
    joint.ui.FreeTransform.clear(this.paper);
    joint.ui.Inspector.close();
    if (collection.length === 1) {
      const primaryCell: joint.dia.Cell = collection.first();
      const primaryCellView = this.paper.findViewByModel(primaryCell);
      this.selection.destroySelectionBox(primaryCell);
      this.selectPrimaryCell(primaryCellView);
    } else if (collection.length === 2) {
      collection.each((cell: joint.dia.Cell) => {
        this.selection.createSelectionBox(cell);
      });
    }
  }

  selectPrimaryCell(cellView: joint.dia.CellView) {
    const cell = cellView.model;
    if (cell.isElement()) {
      this.selectPrimaryElement(<joint.dia.ElementView>cellView);
    } else {
      this.selectPrimaryLink(<joint.dia.LinkView>cellView);
    }

    this.inspectorService.create(cell);
  }

  selectPrimaryElement(elementView: joint.dia.ElementView) {
    const element = elementView.model;

    new joint.ui.FreeTransform({
      cellView: elementView,
      allowRotation: false,
      preserveAspectRatio: !!element.get("preserveAspectRatio"),
      allowOrthogonalResize: element.get("allowOrthogonalResize") !== false,
      useBordersToResize: true,
    }).render();

    this.haloService.create(elementView);
  }
  selectPrimaryLink(linkView: joint.dia.LinkView) {
    console.log(linkView);
    const ns = joint.linkTools;
    const tools = [
      new ns.Vertices(),
      new ns.SourceAnchor(),
      new ns.TargetAnchor(),
      new ns.SourceArrowhead(),
      new ns.TargetArrowhead(),
      new ns.Boundary({ padding: 15 }),
      new ns.Remove({ offset: -20, distance: 40 }),
    ];

    const { name } = linkView.model.router();

    // Add segments tool for 'normal' router
    if (name === "normal") tools.push(new ns.Segments());

    const toolsView = new joint.dia.ToolsView({
      name: "link-pointerdown",
      tools,
    });

    linkView.addTools(toolsView);
  }
}

import { HaloService } from "./halo-service";
import { InspectorService } from "./inspector-service";
import { KeyboardService } from "./keyboard-service";
import { NavigatorService } from "./navigator-service";
import StencilService from "./stencil-service";
import * as joint from "@joint/plus";
type Service = {
  stencilService: StencilService;
  inspectorService: InspectorService;
  navigatorService: NavigatorService;
  haloService: HaloService;
  keyboardService: KeyboardService;
};
export default class SocService {
  graph: joint.dia.Graph;
  paper: joint.dia.Paper;
  snaplines: joint.ui.Snaplines;
  paperScroller: joint.ui.PaperScroller;
  defaultPaperSize: { width: number; height: number } = {
    width: 1400,
    height: 1200,
  };
  stencilService: StencilService;
  navigatorService: NavigatorService;
  haloService: HaloService;
  keyboardService: KeyboardService;
  clipboard: joint.ui.Clipboard;
  selection: joint.ui.Selection;
  inspectorService: InspectorService;

  commandManager: joint.dia.CommandManager;

  constructor(
    private readonly paperContainer: HTMLDivElement,
    {
      stencilService,
      navigatorService,
      haloService,
      keyboardService,
      inspectorService,
    }: Service
  ) {
    this.stencilService = stencilService;
    this.navigatorService = navigatorService;
    this.haloService = haloService;
    this.keyboardService = keyboardService;
    this.inspectorService = inspectorService;
    joint.setTheme("light");
  }
  startService() {
    this.initPaper();
    this.initStencil();
    this.initSelection();
    this.initNavigator();
    this.initKeyBoardShortcuts();
  }
  initPaper() {
    const graph = (this.graph = new joint.dia.Graph(
      {},
      {
        cellNamespace: joint.shapes,
      }
    ));
    this.commandManager = new joint.dia.CommandManager({
      graph: graph,
      cmdBeforeAdd: (
        cmdName: string,
        _cellView,
        _value,
        { ignoreUndoRedo } = { ignoreUndoRedo: false }
      ) => {
        const [, property] = cmdName.split(":");
        const ignoredChanges = [
          "infinitePaper",
          "dotGrid",
          "snaplines",
          "gridSize",
        ];
        return (
          !ignoreUndoRedo &&
          !ignoredChanges.some((change) => change === property)
        );
      },
    });

    const paper = (this.paper = new joint.dia.Paper({
      width: this.defaultPaperSize.width,
      height: this.defaultPaperSize.height,
      gridSize: 10,
      drawGrid: true,
      model: graph,
      cellViewNamespace: joint.shapes,
    }));
    this.snaplines = new joint.ui.Snaplines({ paper: paper });

    const paperScroller = (this.paperScroller = new joint.ui.PaperScroller({
      paper,
      autoResizePaper: true,
      scrollWhileDragging: true,
      borderless: true,
      cursor: "grab",
    }));
    this.paperContainer.appendChild(paperScroller.el);
    paperScroller.center();
  }
  initStencil() {
    const { stencilService, paperScroller, snaplines } = this;
    stencilService.createStencil(paperScroller, snaplines);
    stencilService.setShapes();
    this.stencilService.stencil.on({
      "element:drop": (elementView: joint.dia.ElementView) =>
        this.selection.collection.reset([elementView.model]),
    });
  }
  initNavigator() {
    this.navigatorService.create(this.paperScroller);
  }
  initSelection() {
    this.clipboard = new joint.ui.Clipboard();
    this.selection = new joint.ui.Selection({
      boxContent: null,
      paper: this.paperScroller,
      useModelGeometry: true,
      translateConnectedLinks:
        joint.ui.Selection.ConnectedLinksTranslation.SUBGRAPH,
      handles: [
        {
          ...joint.ui.Selection.getDefaultHandle("rotate"),
          position: joint.ui.Selection.HandlePosition.SW,
        },
        {
          ...joint.ui.Selection.getDefaultHandle("resize"),
          position: joint.ui.Selection.HandlePosition.SE,
        },
      ],
      frames: new joint.ui.HTMLSelectionFrameList({
        rotate: true,
      }),
    });
    const keyboard = this.keyboardService.keyboard;
    console.log(keyboard);
    this.paper.on(
      "element:pointerdown",
      (cellView: joint.dia.CellView, evt: joint.dia.Event) => {
        console.log(cellView);
      }
    );
    this.paper.on(
      "blank:pointerdown",
      (evt: joint.dia.Event, _x: number, _y: number) => {
        if (keyboard.isActive("shift", evt)) {
          this.selection.startSelecting(evt);
        } else {
          this.selection.collection.reset([]);
          this.paperScroller.startPanning(evt);
          this.paper.removeTools();
        }
      }
    );

    this.selection.collection.on("reset add remove", () =>
      this.onSelectionChange()
    );
  }
  onSelectionChange() {
    const { paper, selection } = this;
    const { collection } = selection;
    paper.removeTools();
    joint.ui.Halo.clear(paper);
    joint.ui.FreeTransform.clear(paper);
    joint.ui.Inspector.close();
    if (collection.length === 1) {
      const primaryCell: joint.dia.Cell = collection.first();
      const primaryCellView = paper.findViewByModel(primaryCell);
      selection.destroySelectionBox(primaryCell);
      this.selectPrimaryCell(primaryCellView);
    } else if (collection.length === 2) {
      collection.each(function (cell: joint.dia.Cell) {
        selection.createSelectionBox(cell);
      });
    }
  }

  selectPrimaryCell(cellView: joint.dia.CellView) {
    const cell = cellView.model;
    if (cell.isElement()) {
      this.selectPrimaryElement(<joint.dia.ElementView>cellView);
    } else {
      //   this.selectPrimaryLink(<joint.dia.LinkView>cellView);
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

  initKeyBoardShortcuts() {
    this.keyboardService.create(
      this.graph,
      this.clipboard,
      this.selection,
      this.paperScroller,
      this.commandManager
    );
  }
}

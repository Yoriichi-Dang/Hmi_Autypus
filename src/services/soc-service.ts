import { GraphElements, ServiceGroup, EventGroup } from "../../types/soc.one";
import { defaultPaperSize } from "../constants/paper";
import { GraphEvent, ElementEvent, LinkEvent, PaperEvent } from "../events";
import { ContextToolbarService, SelectionService } from "../services";
import * as appShapes from "../shapes/app-shapes";
import * as joint from "@joint/plus";
import { dashboardV1 } from "../components/dashboard-v1";
import { SocketService } from "./socker-service";
export default class SocService {
  graphElements: GraphElements;
  services: ServiceGroup;
  events: EventGroup;

  constructor(
    private readonly paperContainer: HTMLDivElement,
    {
      socketService,
      stencilService,
      navigatorService,
      haloService,
      keyboardService,
      inspectorService,
    }: ServiceGroup
  ) {
    this.services = {
      socketService,
      stencilService,
      navigatorService,
      haloService,
      keyboardService,
      inspectorService,
    };
    this.graphElements = {
      paper: null,
      paperScroller: null,
      snaplines: null,
      graph: null,
      selection: null,
      clipboard: null,
      commandManager: null,
    };
    joint.setTheme("light");
  }
  startService() {
    this.initPaper();
    this.initStencil();
    this.initSelection();
    this.initNavigator();
    this.initKeyBoardShortcuts();
    this.initContextToolbar();
    this.initSocket();
    this.startEvent();
  }

  startEvent() {
    this.events = {
      linkEvent: new LinkEvent(
        this.graphElements.paper,
        this.graphElements.graph
      ),
      elementEvent: new ElementEvent(
        this.graphElements.paper,
        this.graphElements.selection
      ),
      graphEvent: new GraphEvent(
        this.graphElements.graph,
        this.graphElements.paper,
        this.graphElements.snaplines,
        this.graphElements.paperScroller,
        this.paperContainer,
        this.graphElements.selection
      ),
      paperEvent: new PaperEvent(
        this.graphElements.paper,
        this.graphElements.selection,
        this.graphElements.graph,
        this.services.keyboardService.keyboard,
        this.graphElements.paperScroller
      ),
    };
    this.events.linkEvent.createEventLink();
    this.events.elementEvent.createElementEvent();
    this.events.graphEvent.createGraphEvent();
    this.events.paperEvent.createCellEvent();
    this.events.paperEvent.createContextToolBarEvent(
      this.services.contextToolbarService
    );
    this.events.paperEvent.createBlankEvent();
  }
  initSocket() {
    this.services.socketService = new SocketService(
      this.graphElements.paper,
      this.graphElements.graph
    );
    this.services.socketService.initializeAddListener();
    this.services.socketService.initializeServerConnect();
  }
  initPaper() {
    const namespace = {
      ...joint.shapes,
      ...dashboardV1,
    };
    const graph = (this.graphElements.graph = new joint.dia.Graph(
      {},
      {
        cellNamespace: namespace,
      }
    ));
    this.graphElements.commandManager = new joint.dia.CommandManager({
      graph: this.graphElements.graph,
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

    const paper = (this.graphElements.paper = new joint.dia.Paper({
      width: defaultPaperSize.width,
      height: defaultPaperSize.height,
      gridSize: 10,
      drawGrid: true,
      model: graph,
      defaultLink: <joint.dia.Link>new appShapes.app.Link(),
      defaultConnectionPoint: appShapes.app.Link.connectionPoint,
      routerNamespace: {
        normal: joint.routers.normal,
        orthogonal: joint.routers.orthogonal,
        // Redefine the rightAngle router to use vertices.
        rightAngle: function (
          vertices: joint.g.Point[],
          opt: Record<string, any>,
          linkView: joint.dia.LinkView
        ) {
          opt.useVertices = true;
          return joint.routers.rightAngle.call(this, vertices, opt, linkView);
        },
      },
      cellViewNamespace: namespace,
    }));
    this.graphElements.snaplines = new joint.ui.Snaplines({ paper: paper });

    const paperScroller = (this.graphElements.paperScroller =
      new joint.ui.PaperScroller({
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
    this.services.stencilService.createStencil(
      this.graphElements.paperScroller,
      this.graphElements.snaplines
    );
    this.services.stencilService.setShapes();
    this.services.stencilService.stencil.on({
      "element:drop": (elementView: joint.dia.ElementView) =>
        this.graphElements.selection.collection.reset([elementView.model]),
    });
  }

  initNavigator() {
    this.services.navigatorService.create(this.graphElements.paperScroller);
  }
  initSelection() {
    this.graphElements.clipboard = new joint.ui.Clipboard();
    this.graphElements.selection = new joint.ui.Selection({
      boxContent: null,
      paper: this.graphElements.paperScroller,
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

    this.graphElements.selection.collection.on("reset add remove", () => {
      this.services.selectionService.onSelectionChange();
    });

    this.services.selectionService = new SelectionService(
      this.graphElements.graph,
      this.graphElements.paper,
      this.graphElements.selection,
      this.services.inspectorService,
      this.services.haloService
    );
  }

  initContextToolbar() {
    this.services.contextToolbarService = new ContextToolbarService(
      this.graphElements.paper,
      this.graphElements.selection,
      this.graphElements.graph,
      this.graphElements.clipboard
    );
  }
  initKeyBoardShortcuts() {
    this.services.keyboardService.create(
      this.graphElements.graph,
      this.graphElements.clipboard,
      this.graphElements.selection,
      this.graphElements.paperScroller,
      this.graphElements.commandManager
    );
  }
}

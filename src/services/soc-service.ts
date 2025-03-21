import { HaloService } from "./halo-service";
import { NavigatorService } from "./navigator-service";
import StencilService from "./stencil-service";
import * as joint from "@joint/plus";
type Service = {
  stencilService: StencilService;
  navigatorService: NavigatorService;
  haloService: HaloService;
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
  constructor(
    private readonly paperContainer: HTMLDivElement,
    { stencilService, navigatorService, haloService }: Service
  ) {
    this.stencilService = stencilService;
    this.navigatorService = navigatorService;
    this.haloService = haloService;
    joint.setTheme("light");
  }
  startService() {
    this.initPaper();
    this.initStencil();
    this.initNavigator();
  }
  initPaper() {
    const graph = (this.graph = new joint.dia.Graph(
      {},
      {
        cellNamespace: joint.shapes,
      }
    ));
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
  }
  initNavigator() {
    this.navigatorService.create(this.paperScroller);
  }
}

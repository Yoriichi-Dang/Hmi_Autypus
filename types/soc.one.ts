import * as joint from "@joint/plus";
import { LinkEvent, ElementEvent, GraphEvent, PaperEvent } from "../src/events";
import {
  StencilService,
  InspectorService,
  NavigatorService,
  HaloService,
  KeyboardService,
  ContextToolbarService,
  SelectionService,
} from "../src/services";
type EventGroup = {
  linkEvent: LinkEvent;
  elementEvent: ElementEvent;
  graphEvent: GraphEvent;
  paperEvent: PaperEvent;
};

type ServiceGroup = {
  stencilService: StencilService;
  inspectorService: InspectorService;
  navigatorService: NavigatorService;
  haloService: HaloService;
  selectionService?: SelectionService;
  keyboardService: KeyboardService;
  contextToolbarService?: ContextToolbarService;
};
type GraphElements = {
  graph: joint.dia.Graph;
  paper: joint.dia.Paper;
  snaplines: joint.ui.Snaplines;
  paperScroller: joint.ui.PaperScroller;
  commandManager: joint.dia.CommandManager;
  clipboard: joint.ui.Clipboard;
  selection: joint.ui.Selection;
};

export type { EventGroup, ServiceGroup, GraphElements };

import { useRef, useEffect } from "react";
import socOneIcon from "/assets/images/socone_1.png";
import SocService from "./services/soc-service";
import StencilService from "./services/stencil-service";
import { NavigatorService } from "./services/navigator-service";
import { HaloService } from "./services/halo-service";

function Rappid() {
  const socService = useRef<SocService>(null);
  // Containers
  const paperContainer = useRef<HTMLDivElement>(null);
  const stencilContainer = useRef<HTMLDivElement>(null);
  const toolbarContainer = useRef<HTMLDivElement>(null);
  const inspectorContainer = useRef<HTMLDivElement>(null);
  const navigatorContainer = useRef<HTMLDivElement>(null);

  // Additional inspector elements
  const openGroupsButton = useRef<HTMLButtonElement>(null);
  const closeGroupsButton = useRef<HTMLButtonElement>(null);
  const inspectorHeader = useRef<HTMLDivElement>(null);
  const inspectorContent = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const service = {
      stencilService: new StencilService(stencilContainer.current),
      navigatorService: new NavigatorService(navigatorContainer.current),
      haloService: new HaloService(),
    };
    socService.current = new SocService(paperContainer.current, service);
    socService.current.startService();
  }, []);

  return (
    <div id="app" className="joint-app">
      <div className="app-header">
        <img
          src={socOneIcon}
          style={{
            height: "60px",
            width: "60px",
          }}
          alt="JointJS"
        />
      </div>
      {/* <div ref={toolbarContainer} className="toolbar-container"></div> */}
      <div className="app-body">
        <div ref={stencilContainer} className="stencil-container"></div>
        <div ref={paperContainer} className="paper-container"></div>
        <div ref={inspectorContainer} className="inspector-container">
          <div ref={inspectorHeader} className="inspector-header hidden">
            <button ref={openGroupsButton} className="open-groups-btn"></button>
            <button
              ref={closeGroupsButton}
              className="close-groups-btn"
            ></button>
            <span className="inspector-header-text">Properties</span>
          </div>
          <div ref={inspectorContent} className="inspector-content"></div>
        </div>
        <div ref={navigatorContainer} className="navigator-container"></div>
      </div>
    </div>
  );
}

export default Rappid;

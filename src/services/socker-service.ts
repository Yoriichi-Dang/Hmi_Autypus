import { ConnectionServer } from "../config/connection-server";
import * as joint from "@joint/plus";

// Interface for component handlers
interface ComponentHandler {
  handleData(element: joint.dia.Cell, data: any): void;
  disconnectHandler(element: joint.dia.Cell): void;
}

// Component handler registry
class ComponentHandlerRegistry {
  private handlers: Record<string, ComponentHandler> = {};

  register(componentType: string, handler: ComponentHandler): void {
    this.handlers[componentType] = handler;
  }

  getHandler(componentType: string): ComponentHandler | undefined {
    return this.handlers[componentType];
  }

  hasHandler(componentType: string): boolean {
    return !!this.handlers[componentType];
  }
}

// Specific component handlers
class SpeedometerHandler implements ComponentHandler {
  handleData(element: joint.dia.Cell, data: any): void {
    if (!isNaN(data)) {
      element.set("targetValue", data);
    }
  }

  disconnectHandler(element: joint.dia.Cell): void {
    if (element.has("targetValue")) {
      element.set("targetValue", 0);
    }
  }
}

class TachometerHandler implements ComponentHandler {
  handleData(element: joint.dia.Cell, data: any): void {
    if (!isNaN(data)) {
      element.set("targetValue", data);
    }
  }

  disconnectHandler(element: joint.dia.Cell): void {
    if (element.has("targetValue")) {
      element.set("targetValue", 0);
    }
  }
}

class FuelGaugeHandler implements ComponentHandler {
  handleData(element: joint.dia.Cell, data: any): void {
    if (!isNaN(data)) {
      element.set("targetValue", data);
    }
  }

  disconnectHandler(element: joint.dia.Cell): void {
    if (element.has("targetValue")) {
      element.set("targetValue", 0);
    }
  }
}

class CoolantTemperatureHandler implements ComponentHandler {
  handleData(element: joint.dia.Cell, data: any): void {
    if (!isNaN(data)) {
      element.set("targetValue", data);
    }
  }

  disconnectHandler(element: joint.dia.Cell): void {
    if (element.has("targetValue")) {
      element.set("targetValue", 0);
    }
  }
}

// Default handler for unknown components
class DefaultComponentHandler implements ComponentHandler {
  handleData(element: joint.dia.Cell, data: any): void {
    console.log(`Received data for ${element.attr("label/text")}:`, data);
  }

  disconnectHandler(element: joint.dia.Cell): void {
    // Default disconnect behavior
  }
}

export class SocketService {
  private connectionServer: ConnectionServer;
  private paper: joint.dia.Paper;
  private graph: joint.dia.Graph;
  private handlerRegistry: ComponentHandlerRegistry;

  constructor(paper: joint.dia.Paper, graph: joint.dia.Graph) {
    this.paper = paper;
    this.graph = graph;
    this.connectionServer = new ConnectionServer();
    this.handlerRegistry = new ComponentHandlerRegistry();

    // Register component handlers
    this.registerComponentHandlers();
  }

  private registerComponentHandlers(): void {
    this.handlerRegistry.register(
      "dashboardV1.Speedometer",
      new SpeedometerHandler()
    );
    this.handlerRegistry.register(
      "dashboardV1.Tachometer",
      new TachometerHandler()
    );
    this.handlerRegistry.register(
      "dashboardV1.FuelGauge",
      new FuelGaugeHandler()
    );
    this.handlerRegistry.register(
      "dashboardV1.CoolantTemperature",
      new CoolantTemperatureHandler()
    );
  }

  initializeAddListener(): void {
    this.graph.on("change:attrs", (cell, attrs, options) => {
      if (attrs.label && attrs.label.text !== undefined) {
        if (attrs.label.text.toLowerCase() === "server") {
          this.connectionServer = new ConnectionServer();
          this.connectionServer
            .connect("ws://localhost:8080/ws")
            .then(() => {
              this.updateElementStyle(cell, "green", 2);
              console.log("Connect success to server");
            })
            .catch((error) => {
              this.updateElementStyle(cell, "red", 2);
              console.error("Failed to connect:", error);
            });
        }
      }
    });
  }

  initializeServerConnect(): void {
    this.paper.on(
      "link:connect",
      (linkView, evt, elementViewConnected, magnet) => {
        const link = linkView.model;
        const sourceId = link.get("source").id;
        const targetId = link.get("target").id;

        const sourceElement = this.graph.getCell(sourceId);
        const targetElement = this.graph.getCell(targetId);

        if (sourceElement.attr("label/text")?.toLowerCase() === "server") {
          const targetName = targetElement.attr("label/text") || "unknown";
          this.setupTargetMessageHandler(
            targetElement,
            targetName.toLowerCase()
          );
        }
      }
    );

    this.paper.on("link:remove", (linkView, evt, options) => {
      const link = linkView.model;
      const sourceId = link.get("source").id;
      const targetId = link.get("target").id;

      if (!sourceId || !targetId) return;

      const sourceElement = this.graph.getCell(sourceId);
      const targetElement = this.graph.getCell(targetId);

      if (sourceElement?.attr("label/text")?.toLowerCase() === "server") {
        const targetName = targetElement.attr("label/text") || "unknown";
        this.removeTargetMessageHandler(targetElement, targetName);
      }
    });
  }

  private removeTargetMessageHandler(
    targetElement: joint.dia.Cell,
    targetName: string
  ): void {
    const elementType = targetElement.get("type");

    // Get the appropriate handler or use default
    const handler =
      this.handlerRegistry.getHandler(elementType) ||
      new DefaultComponentHandler();

    // Call the disconnect handler
    handler.disconnectHandler(targetElement);

    // Update visual indicators
    const incomingLinks = this.graph.getConnectedLinks(targetElement, {
      inbound: true,
    });

    if (incomingLinks.length === 0) {
      this.updateElementStyle(targetElement, "#000", 1);
    }
  }

  private setupTargetMessageHandler(
    targetElement: joint.dia.Cell,
    targetName: string
  ): void {
    const elementType = targetElement.get("type");
    console.log(elementType);
    // Get the appropriate handler or use default
    const handler =
      this.handlerRegistry.getHandler(elementType) ||
      new DefaultComponentHandler();

    // Set up message listener based on component type
    this.connectionServer.on(
      this.handlerRegistry.hasHandler(elementType)
        ? elementType.split(".")[1].toLowerCase()
        : targetName,
      (data) => {
        console.log(`Received data for ${targetName}:`, data);

        // Use the handler to process data
        handler.handleData(targetElement, data);

        // Update link visuals
        this.updateConnectionLinks(targetElement);
      }
    );
  }

  private updateConnectionLinks(element: joint.dia.Cell): void {
    const incomingLinks = this.graph.getConnectedLinks(element, {
      inbound: true,
    });

    incomingLinks.forEach((link) => {
      const sourceId = link.get("source").id;
      const sourceElement = this.graph.getCell(sourceId);

      if (sourceElement.attr("label/text")?.toLowerCase() === "server") {
        link.attr({
          line: {
            stroke: "green",
            strokeWidth: 2,
          },
        });
      }
    });
  }

  private updateElementStyle(
    element: joint.dia.Cell,
    strokeColor: string,
    strokeWidth: number
  ): void {
    element.attr("body/stroke", strokeColor);
    element.attr("body/strokeWidth", strokeWidth);
    this.paper.findViewByModel(element).update();
  }
}

import { ConnectionServer } from "../config/connection-server";
import * as joint from "@joint/plus";

export class ConnectionService {
  connectionServer: ConnectionServer;
  paper: joint.dia.Paper;
  graph: joint.dia.Graph;
  constructor(paper: joint.dia.Paper, graph: joint.dia.Graph) {
    this.paper = paper;
    this.graph = graph;
    this.connectionServer = new ConnectionServer();
    console.log("ConnectionService initialized");
  }
  initializeAddListener() {
    this.graph.on("change:attrs", (cell, attrs, options) => {
      if (attrs.label && attrs.label.text !== undefined) {
        switch (attrs.label.text.toLowerCase()) {
          case "server":
            this.connectionServer = new ConnectionServer();
            this.connectionServer
              .connect("ws://localhost:8080")
              .then(() => {
                console.log("Connected to server");
                cell.attr("body/stroke", "green");
                cell.attr("body/strokeWidth", 2);
                this.paper.findViewByModel(cell).update();
                // Send a message to the server
                console.log("Connect success to server");
              })
              .catch((error) => {
                cell.attr("body/stroke", "red");
                cell.attr("body/strokeWidth", 2);
                this.paper.findViewByModel(cell).update();
                console.error("Failed to connect:", error);
              });
            break;
          default:
            break;
        }
      }
    });
  }

  initializeServerConnect() {
    this.paper.on(
      "link:connect",
      (linkView, evt, elementViewConnected, magnet) => {
        const link = linkView.model;
        const sourceId = link.get("source").id;
        const targetId = link.get("target").id;

        // Get the source and target elements
        const sourceElement = this.graph.getCell(sourceId);
        const targetElement = this.graph.getCell(targetId);

        // Check if source is a server element
        if (sourceElement.attr("label/text")?.toLowerCase() === "server") {
          // Get the target element's label/name
          const targetName = targetElement.attr("label/text") || "unknown";
          // Create connection to the server with target info
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

      // Only proceed if we have both source and target IDs
      if (!sourceId || !targetId) return;

      // Get the source and target elements
      const sourceElement = this.graph.getCell(sourceId);
      const targetElement = this.graph.getCell(targetId);

      // If source was a server element, handle disconnection
      if (sourceElement?.attr("label/text")?.toLowerCase() === "server") {
        const targetName = targetElement.attr("label/text") || "unknown";

        // Remove the message handler for this target
        this.removeTargetMessageHandler(targetElement, targetName);
      }
    });
  }
  removeTargetMessageHandler(
    targetElement: joint.dia.Cell,
    targetName: string
  ) {
    const elementType = targetElement.get("type");

    // If the target is a speedometer
    if (elementType.includes("speedometer")) {
      // Remove the event listener
      targetElement.set("speed", 0);
      // Reset the speedometer if needed
      if (targetElement.has("speed")) {
        targetElement.set("speed", 0);
      }

      // Update any visual indicators of connection status
      const incomingLinks = this.graph.getConnectedLinks(targetElement, {
        inbound: true,
      });

      // If there are no more connections, update the appearance
      if (incomingLinks.length === 0) {
        targetElement.attr("body/stroke", "#000");
        targetElement.attr("body/strokeWidth", 1);
      }
    }
  }
  setupTargetMessageHandler(targetElement: joint.dia.Cell, targetName: string) {
    const elementType = targetElement.get("type");

    // If the target is a speedometer
    if (elementType.includes("speedometer")) {
      this.connectionServer.on(targetName, (data) => {
        console.log(`Received speedometer data for ${targetName}:`, data);
        // Update the speedometer with the received data
        if (data !== undefined) {
          // Get the speedometer element and update its speed
          if (!isNaN(data)) {
            targetElement.set("speed", data);
            const incomingLinks = this.graph.getConnectedLinks(targetElement, {
              inbound: true,
            });

            // Update color of all links from servers to this element
            incomingLinks.forEach((link) => {
              const sourceId = link.get("source").id;
              const sourceElement = this.graph.getCell(sourceId);

              // Check if source is a server
              if (
                sourceElement.attr("label/text")?.toLowerCase() === "server"
              ) {
                // Set link color to green
                link.attr({
                  line: {
                    stroke: "green",
                    strokeWidth: 2,
                  },
                });
              }
            });
          }
        }
      });
    }
    // Add handlers for other element types as needed
    else {
      this.connectionServer.on(targetName, (data) => {
        console.log(`Received data for ${targetName}:`, data);
      });
    }
  }
}

// connection-server.ts
export class ConnectionServer {
  private socket: WebSocket | null = null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectTimeout: number = 1000;
  private messageHandlers: Map<string, ((data: any) => void)[]> = new Map();

  /**
   * Connect to the WebSocket server
   * @param url The WebSocket server URL
   * @param protocols Optional WebSocket protocols
   */
  connect(url: string, protocols?: string | string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = new WebSocket(url, protocols);

        this.socket.onopen = () => {
          console.log("WebSocket connection established");
          this.reconnectAttempts = 0;
          resolve();
        };

        this.socket.onmessage = (event) => {
          this.handleMessage(event);
        };

        this.socket.onerror = (error) => {
          console.error("WebSocket error:", error);
          reject(error);
        };

        this.socket.onclose = (event) => {
          console.log("WebSocket connection closed", event.code, event.reason);
          if (this.reconnectAttempts < this.maxReconnectAttempts) {
            setTimeout(() => {
              this.reconnectAttempts++;
              this.connect(url, protocols);
            }, this.reconnectTimeout * this.reconnectAttempts);
          }
        };
      } catch (error) {
        console.error("Failed to create WebSocket connection:", error);
        reject(error);
      }
    });
  }

  /**
   * Send data to the server
   * @param type Message type
   * @param data Message data
   */
  send(type: string, data: any): boolean {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error("Cannot send message, socket is not connected");
      return false;
    }

    try {
      const message = JSON.stringify({ type, data });
      this.socket.send(message);
      return true;
    } catch (error) {
      console.error("Failed to send message:", error);
      return false;
    }
  }

  /**
   * Register a handler for a specific message type
   * @param type Message type to listen for
   * @param handler Function to handle the message
   */
  on(type: string, handler: (data: any) => void): void {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, []);
    }

    this.messageHandlers.get(type)?.push(handler);
  }

  /**
   * Remove a message handler
   * @param type Message type
   * @param handler Handler to remove
   */
  off(type: string, handler: (data: any) => void): void {
    if (!this.messageHandlers.has(type)) return;

    const handlers = this.messageHandlers.get(type);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
    }
  }

  /**
   * Close the WebSocket connection
   * @param code Close code
   * @param reason Close reason
   */
  disconnect(code?: number, reason?: string): void {
    if (this.socket) {
      this.socket.close(code, reason);
      this.socket = null;
    }
  }

  /**
   * Check if the connection is currently open
   */
  isConnected(): boolean {
    return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
  }

  /**
   * Handle incoming WebSocket messages
   */
  private handleMessage(event: MessageEvent): void {
    try {
      const message = JSON.parse(event.data);
      const { type, data } = message;

      const handlers = this.messageHandlers.get(type);
      if (handlers) {
        handlers.forEach((handler) => handler(data));
      }
    } catch (error) {
      console.error("Error handling message:", error, event.data);
    }
  }
}

// Export a singleton instance
export const connectionServer = new ConnectionServer();

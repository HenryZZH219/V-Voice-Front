// src/service/websocketManager.ts
type MessageHandler = (event: MessageEvent) => void;
type ErrorHandler = (error: Event) => void;
type CloseHandler = (event: CloseEvent) => void;

class WebSocketManager {
  private static instance: WebSocketManager;
  private socket: WebSocket | null = null;
  private messageHandlers: MessageHandler[] = [];
  private errorHandlers: ErrorHandler[] = [];
  private closeHandlers: CloseHandler[] = [];

  private constructor() {}

  public static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }

  

  public async connect(url: string): Promise<void> {
    if (this.socket) {
      await this.disconnect(); // 等待旧的 WebSocket 关闭
    }

    this.messageHandlers = [];
    this.errorHandlers = [];
    this.closeHandlers = [];

    this.socket = new WebSocket(url);

    this.socket.addEventListener('message', (event) => {
      this.messageHandlers.forEach((handler) => handler(event));
    });

    this.socket.addEventListener('error', (error) => {
      this.errorHandlers.forEach((handler) => handler(error));
    });

    this.socket.addEventListener('close', (event) => {
      this.closeHandlers.forEach((handler) => handler(event));
      this.socket = null;
    });
  }

  public disconnect(): Promise<void> {
    return new Promise((resolve) => {
      if (this.socket) {
        this.socket.addEventListener('close', () => { 
          resolve();
        });
        this.socket.close();
        this.socket = null;
        // console.log("disconnect")
      } else {
        resolve();
      }
    });
  }

  public sendMessage(message: any): void {
    if (this.socket) {
      this.socket.send(JSON.stringify(message));
    }
    else {
      console.log("sendMessage Error");
    }
  }

  public addMessageHandler(handler: MessageHandler): void {
    this.messageHandlers.push(handler);
  }

  public removeMessageHandler(handler: MessageHandler): void {
    this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
  }

  public addErrorHandler(handler: ErrorHandler): void {
    this.errorHandlers.push(handler);
  }

  public removeErrorHandler(handler: ErrorHandler): void {
    this.errorHandlers = this.errorHandlers.filter(h => h !== handler);
  }

  public addCloseHandler(handler: CloseHandler): void {
    this.closeHandlers.push(handler);
  }

  public removeCloseHandler(handler: CloseHandler): void {
    this.closeHandlers = this.closeHandlers.filter(h => h !== handler);
  }

  public isWebSocketConnected() {
    return this.socket.readyState === WebSocket.OPEN;
  }

}

export default WebSocketManager;

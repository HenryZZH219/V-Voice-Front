// src/services/websocketFactory.ts
type MessageHandler = (event: MessageEvent) => void;
type ErrorHandler = (event: Event) => void;
type CloseHandler = (event: CloseEvent) => void;

export function createWebSocket(
  url: string,
  onMessage: MessageHandler,
  onError?: ErrorHandler,
  onClose?: CloseHandler
): WebSocket {
  const socket = new WebSocket(url);

  socket.onopen = () => {
    console.log('WebSocket connection opened');
  };

  socket.onmessage = onMessage;

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
    if (onError) {
      onError(error);
    }
  };

  socket.onclose = (event) => {
    console.log('WebSocket connection closed');
    if (onClose) {
      onClose(event);
    }
  };

  return socket;
}

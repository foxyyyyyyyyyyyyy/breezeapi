export function open(ws) {
  ws.send('Welcome to the WebSocket demo!');
}
export function message(ws, msg) {
  ws.send('Echo: ' + msg);
}

export function open(ws: any) {
  ws.send('Welcome!');
}

export function message(ws: any, msg: string) {
  ws.publish('chat', msg);
} 
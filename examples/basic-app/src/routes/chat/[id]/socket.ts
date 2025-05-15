export function open(wsCtx) {
  wsCtx.send(`Welcome to chatroom ${wsCtx.params.id}!`);
}

export function message(wsCtx, msg) {
  wsCtx.send(`[${wsCtx.params.id}] You said: ${msg}`);
} 
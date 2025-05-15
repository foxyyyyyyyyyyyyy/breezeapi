export function data(socket: any, data: Uint8Array) {
  socket.write(data); // echo
} 
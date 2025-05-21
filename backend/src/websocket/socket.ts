import { Server } from 'socket.io';

let io: Server;

export function setupWebSocket(server: Server) {
  io = server;

  io.on('connection', socket => {
    console.log('🧠 Cliente conectado ao WebSocket');

    socket.on('disconnect', () => {
      console.log('❌ Cliente desconectado');
    });
  });
}

export function emitBotResponse(message: string) {
  if (io) {
    io.emit('bot-message', message);
  }
}

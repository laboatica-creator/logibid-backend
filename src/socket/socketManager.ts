import { Server as SocketServer, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { socketAuth } from '../middlewares/auth.middleware';

let io: SocketServer;

export const initializeSocket = (server: HttpServer) => {
  io = new SocketServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // Middleware de autenticación para Socket.io
  io.use(socketAuth);

  io.on('connection', (socket: Socket) => {
    console.log(`Socket connected: ${socket.id} - User: ${socket.userId}`);

    // Unirse a sala personal
    socket.join(`user-${socket.userId}`);

    // Si es transportista, unirse a sala de requests
    if (socket.userRole === 'driver') {
      socket.join('requests');
      console.log(`Driver ${socket.userId} joined requests room`);
    }

    // Evento para unirse a sala específica
    socket.on('join-room', (room: string) => {
      socket.join(room);
      console.log(`User ${socket.userId} joined room: ${room}`);
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

// Emisores de eventos
export const emitNewRequest = (request: any) => {
  const ioInstance = getIO();
  ioInstance.to('requests').emit('new-request', { request });
  console.log(`Emitted new-request for request ${request.id}`);
};

export const emitNewBid = (bid: any, requestId: string, clientId: string) => {
  const ioInstance = getIO();
  ioInstance.to(`user-${clientId}`).emit('new-bid', { bid, requestId });
  console.log(`Emitted new-bid for request ${requestId} to client ${clientId}`);
};

export const emitBidAccepted = (bid: any, request: any, driverId: string) => {
  const ioInstance = getIO();
  ioInstance.to(`user-${driverId}`).emit('bid-accepted', { bid, request });
  console.log(`Emitted bid-accepted to driver ${driverId}`);
};
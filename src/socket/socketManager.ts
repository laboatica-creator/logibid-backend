import { Server as SocketServer, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';

let io: SocketServer;

export const initializeSocket = (server: HttpServer) => {
  io = new SocketServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // NO usar socketAuth — permitir conexiones anónimas para que el frontend
  // pueda recibir eventos sin necesitar token en el handshake.
  // La autenticación de datos sensibles se maneja via REST con Bearer token.

  io.on('connection', (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Permitir que un usuario se una a su sala personal
    socket.on('join-user', (userId: string) => {
      socket.join(`user-${userId}`);
      console.log(`Socket ${socket.id} joined user-${userId}`);
    });

    // Permitir unirse a la sala de requests (para transportistas)
    socket.on('join-requests', () => {
      socket.join('requests');
      console.log(`Socket ${socket.id} joined requests room`);
    });

    socket.on('join-room', (room: string) => {
      socket.join(room);
      console.log(`Socket ${socket.id} joined room: ${room}`);
    });

    // Driver location update — rebroadcast a todos los conectados
    socket.on('driver-location-update', (data: any) => {
      // Reemitir a TODOS los clientes conectados para que el admin y el cliente lo vean
      io.emit('driver-location-update', data);
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

export const emitNewRequest = (request: any) => {
  const ioInstance = getIO();
  // Emit to 'requests' room (drivers) AND broadcast globally
  ioInstance.emit('new_request', { request, request_id: request.id });
  console.log(`Emitted new_request for request ${request.id}`);
};

export const emitNewBid = (bid: any, requestId: string, clientId: string) => {
  const ioInstance = getIO();
  // Emit to the client who owns this request AND broadcast to the request room
  ioInstance.emit('new_bid', { bid, request_id: requestId });
  console.log(`Emitted new_bid for request ${requestId}`);
};

export const emitBidAccepted = (bid: any, request: any, driverId: string) => {
  const ioInstance = getIO();
  // Emit globally so both the driver and client see changes immediately
  ioInstance.emit('bid_accepted', { bid, request, request_id: request.id });
  console.log(`Emitted bid_accepted for request ${request.id} to driver ${driverId}`);
};
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Importar rutas existentes
import authRoutes from './routes/authRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import offerRoutes from './routes/offerRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Importar nuevas rutas
import driverRoutes from './routes/driverRoutes.js';
import trackingRoutes from './routes/trackingRoutes.js';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true
  }
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Endpoint para configuración del frontend (Google Maps API Key)
app.get('/system-config', (req, res) => {
  res.json({ 
    googleMapsApiKey: 'AIzaSyC_TnKKwLJ_ZzK393l50FE__X8PcawYQhg' 
  });
});

// Rutas existentes
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

// Nuevas rutas
app.use('/api/drivers', driverRoutes);
app.use('/api/tracking', trackingRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// WebSockets para tiempo real
io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);
  
  socket.on('join-request', (requestId) => {
    socket.join(`request-${requestId}`);
    console.log(`Socket ${socket.id} unido a request-${requestId}`);
  });
  
  socket.on('new-offer', (data) => {
    io.to(`request-${data.requestId}`).emit('offer-received', data);
  });
  
  socket.on('update-location', (data) => {
    io.to(`request-${data.requestId}`).emit('driver-location', data);
  });
  
  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
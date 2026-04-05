import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './src/middlewares/errorHandler.js';
import healthRoutes from './src/routes/health.routes.js';
import authRoutes from './src/routes/auth.routes.js';
import requestRoutes from './src/routes/request.routes.js';
import bidRoutes from './src/routes/bid.routes.js';
import paymentRoutes from './src/routes/payment.routes.js';
import { initializeSocket } from './src/socket/socketManager.js';

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const PORT = process.env.PORT || 3000;

  // Inicializar Socket.io
  const io = initializeSocket(server);

  // Middlewares
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cors());
  app.use(morgan('dev'));
  app.use(express.json());

  // API Routes
  app.use('/health', healthRoutes);
  app.use('/auth', authRoutes);
  app.use('/requests', requestRoutes);
  app.use('/bids', bidRoutes);
  app.use('/payments', paymentRoutes);

  // Ruta básica para probar
  app.get('/', (req, res) => {
    res.json({ message: 'LogiBid API is running' });
  });

  // Error handler
  app.use(errorHandler);

  server.listen(PORT, () => {
    console.log(`🚀 LogiBid Server running on http://localhost:${PORT}`);
    console.log(`🔌 Socket.io ready for real-time events`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { errorHandler } from './src/middlewares/errorHandler';
import healthRoutes from './src/routes/health.routes';

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const PORT = 3000;

  // Socket.io
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // Middlewares básicos
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cors());
  app.use(morgan('dev'));
  app.use(express.json());

  // 🔥 RUTAS API (ANTES DE VITE)
  app.use('/health', healthRoutes);

  // 🔥 VITE SOLO DESPUÉS DE API
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));

    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Error handler al final
  app.use(errorHandler);

  server.listen(PORT, () => {
    console.log(`🚀 LogiBid Server running on http://localhost:${PORT}`);
  });

  // Socket logs
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
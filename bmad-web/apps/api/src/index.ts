import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import { authRouter } from './routes/auth.js';
import { projectsRouter } from './routes/projects.js';
import { agentsRouter } from './routes/agents.js';
import { workflowsRouter } from './routes/workflows.js';
import { artifactsRouter } from './routes/artifacts.js';
import { setupWebSocket } from './websocket/index.js';
import { errorHandler } from './middleware/error-handler.js';
import { authenticate } from './middleware/auth.js';

const app = express();
const httpServer = createServer(app);

// Socket.io setup
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
});
app.use('/api', limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Public routes
app.use('/api/auth', authRouter);

// Protected routes
app.use('/api/projects', authenticate, projectsRouter);
app.use('/api/agents', authenticate, agentsRouter);
app.use('/api/workflows', authenticate, workflowsRouter);
app.use('/api/artifacts', authenticate, artifactsRouter);

// WebSocket setup
setupWebSocket(io);

// Error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`BMAD API Server running on port ${PORT}`);
  console.log(`WebSocket server ready`);
});

export { app, io };

import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { BMADAdapter } from '../bmad/adapter.js';

const JWT_SECRET = process.env.JWT_SECRET || 'bmad-secret-key-change-in-production';
const bmadAdapter = new BMADAdapter();

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

export function setupWebSocket(io: Server) {
  // Authentication middleware
  io.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return next(new Error('Authentication required'));
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      socket.userId = decoded.userId;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`Client connected: ${socket.id} (User: ${socket.userId})`);

    // Join user-specific room
    if (socket.userId) {
      socket.join(`user:${socket.userId}`);
    }

    // Join project room
    socket.on('project:join', (projectId: string) => {
      socket.join(`project:${projectId}`);
      console.log(`Socket ${socket.id} joined project:${projectId}`);
    });

    // Leave project room
    socket.on('project:leave', (projectId: string) => {
      socket.leave(`project:${projectId}`);
      console.log(`Socket ${socket.id} left project:${projectId}`);
    });

    // Handle chat message to agent
    socket.on('agent:message', async (data: {
      agentId: string;
      message: string;
      conversationId?: string;
      projectId?: string;
    }) => {
      const { agentId, message, conversationId, projectId } = data;

      // Emit typing indicator
      socket.emit('agent:typing', { agentId, isTyping: true });

      try {
        const response = await bmadAdapter.processMessage(agentId, message, {
          conversationId,
          projectId,
          userId: socket.userId,
        });

        // Emit response
        socket.emit('agent:message', {
          agentId,
          message: response.content,
          metadata: response.metadata,
          timestamp: new Date().toISOString(),
        });

        // Check for artifacts created
        if (response.metadata?.artifacts) {
          for (const artifactId of response.metadata.artifacts) {
            socket.emit('artifact:created', { artifactId, projectId });
          }
        }
      } catch (error) {
        socket.emit('error', {
          code: 'AGENT_ERROR',
          message: 'Erro ao processar mensagem do agente',
        });
      } finally {
        socket.emit('agent:typing', { agentId, isTyping: false });
      }
    });

    // Handle workflow advancement
    socket.on('workflow:advance', async (data: {
      instanceId: string;
      stepOutput?: unknown;
    }) => {
      const { instanceId, stepOutput } = data;

      try {
        // TODO: Implement actual workflow advancement
        socket.emit('workflow:progress', {
          instanceId,
          currentStep: 2, // Example
          completed: false,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        socket.emit('error', {
          code: 'WORKFLOW_ERROR',
          message: 'Erro ao avancar workflow',
        });
      }
    });

    // Handle artifact updates
    socket.on('artifact:update', async (data: {
      artifactId: string;
      content: string;
      projectId?: string;
    }) => {
      const { artifactId, content, projectId } = data;

      // Broadcast update to other clients in the project
      if (projectId) {
        socket.to(`project:${projectId}`).emit('artifact:updated', {
          artifactId,
          updatedBy: socket.userId,
          timestamp: new Date().toISOString(),
        });
      }
    });

    // Handle disconnect
    socket.on('disconnect', (reason) => {
      console.log(`Client disconnected: ${socket.id} (Reason: ${reason})`);
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error(`Socket error for ${socket.id}:`, error);
    });
  });

  console.log('WebSocket handlers configured');
}

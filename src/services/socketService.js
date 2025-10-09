import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Middleware de autenticação para Socket.io
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.userId}`);

    // Adicionar usuário à sua sala pessoal
    socket.join(socket.userId);

    // Event: Usuário online
    socket.on('user:online', () => {
      socket.broadcast.emit('user:status', {
        userId: socket.userId,
        status: 'online'
      });
    });

    // Event: Usuário digitando
    socket.on('typing:start', (data) => {
      socket.to(data.recipientId).emit('typing:user', {
        userId: socket.userId,
        isTyping: true
      });
    });

    socket.on('typing:stop', (data) => {
      socket.to(data.recipientId).emit('typing:user', {
        userId: socket.userId,
        isTyping: false
      });
    });

    // Desconexão
    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.userId}`);
      socket.broadcast.emit('user:status', {
        userId: socket.userId,
        status: 'offline'
      });
    });
  });

  console.log('✅ Socket.io initialized');
  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

// Função helper para enviar notificação
export const sendNotification = (userId, notification) => {
  if (io) {
    io.to(userId.toString()).emit('notification', notification);
  }
};

// Função helper para enviar mensagem
export const sendMessage = (userId, message) => {
  if (io) {
    io.to(userId.toString()).emit('message', message);
  }
};

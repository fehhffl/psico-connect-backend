import express from 'express';
import { createServer } from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import connectDB from './src/config/database.js';
import { initSocket } from './src/services/socketService.js';
import errorHandler from './src/middleware/errorHandler.js';

// Rotas
import authRoutes from './src/routes/auth.js';
import userRoutes from './src/routes/users.js';
import notificationRoutes from './src/routes/notifications.js';

// Carregar variáveis de ambiente
dotenv.config();

// Inicializar express
const app = express();
const server = createServer(app);

// Conectar ao banco de dados
connectDB();

// Inicializar Socket.io
initSocket(server);

// Middlewares de segurança
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite de 100 requisições por IP
  message: 'Muitas requisições deste IP, tente novamente em 15 minutos'
});

app.use('/api/', limiter);

// Rotas
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'PsicoConnect API is running',
    version: '1.0.0'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  });
});

// Error handler (deve ser o último middleware)
app.use(errorHandler);

// Iniciar servidor
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════╗
║     PsicoConnect API Server          ║
║                                       ║
║  🚀 Server running on port ${PORT}     ║
║  🌍 Environment: ${process.env.NODE_ENV || 'development'}         ║
║  📡 Socket.io: Enabled                ║
╚═══════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

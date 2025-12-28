import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { pool } from './database.js';
import authRouter from './routes/auth.js';
import usersRouter from './routes/users.js';
import { authenticate } from './middleware/auth.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/users', authenticate, usersRouter);

// WebSocket
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication failed'));
  }
  // Token verification i think
  next();
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  socket.on('disconnect', () => {
    console.log("User disconnected:", socket.id);
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    connectedUsers: io.engine.clientsCount
  });
});


app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({error: 'Internal server error'});
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log('Server running on port', PORT);
});

export { io };

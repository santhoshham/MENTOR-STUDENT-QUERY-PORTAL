import express, { json, urlencoded } from 'express';
import http from 'http';  // Import HTTP for Socket.IO
import { Server } from 'socket.io';
import cors from 'cors';
import connectDB from './config/db.js';
import errorHandler from './utils/errorHandler.js';
import authRoutes from './routes/auth.js';
import studentRoutes from './routes/student.js';
import adminRoutes from './routes/admin.js';
import departmentRoutes from './routes/department.js';

// Init express app
const app = express();
const server = http.createServer(app); // Create HTTP server instance for Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',  // Adjust this for production with appropriate frontend URL
    methods: ['GET', 'POST']
  }
});

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/department', departmentRoutes);

// Socket.IO logic
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room ${room}`);
  });

  socket.on('sendMessage', ({ room, message }) => {
    io.to(room).emit('receiveMessage', message);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Error handler middleware
app.use(errorHandler);

// Define port
const PORT = process.env.PORT || 5000;

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;

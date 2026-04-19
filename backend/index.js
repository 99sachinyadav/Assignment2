import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectMongo from './config/mongo.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

import { setServers } from "node:dns/promises";

setServers(["1.1.1.1", "8.8.8.8"]);// for resolving the Ip conflict with mongodb

const app = express();
dotenv.config();
// Basic middleware setup
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON request body
// app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Basic health-check route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Task Management API!' });
});

// 404 Route Handler - catches all routes not defined above
app.use(notFound);

// Always place global error handling middleware last
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect to Databases and then start server
const startServer = async () => {
  try {
    // 1. Connect to MongoDB
    await connectMongo();

    // 2. Start Express server
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

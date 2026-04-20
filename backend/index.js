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
 
app.use(cors()); 
app.use(express.json());  
 

 
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

 
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Task Management server' });
});

 
app.use(notFound);

 
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

 
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

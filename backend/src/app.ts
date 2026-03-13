import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

import userRoutes from './routes/userRoutes';
import taskRoutes from './routes/taskRoutes';

const app: Application = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to Task Manager API' });
});

export default app;

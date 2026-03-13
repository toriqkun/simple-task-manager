import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import userRoutes from './routes/user.routes';

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use('/users', userRoutes);

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to Task Manager API' });
});

export default app;

import { Request, Response } from 'express';
import taskService from '../services/taskService';
import { AuthRequest } from '../middleware/authMiddleware';

export class TaskController {
  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const task = await taskService.createTask(userId, req.body);
      res.status(201).json(task);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const tasks = await taskService.getAllTasks();
      res.json(tasks);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getByUserId(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      const tasks = await taskService.getTasksByUserId(userId);
      res.json(tasks);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const task = await taskService.getTaskById(Number(req.params.id));
      res.json(task);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const task = await taskService.updateTask(Number(req.params.id), req.body);
      res.json(task);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      await taskService.deleteTask(Number(req.params.id));
      res.json({ message: 'Task deleted successfully' });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default new TaskController();

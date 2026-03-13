import { Request, Response } from 'express';
import taskService from '../services/taskService';

export class TaskController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      // Note: userId will eventually come from auth middleware
      // For now, we expect it in the body for testing purposes in Step 4
      const { userId, ...taskData } = req.body;
      if (!userId) {
        res.status(400).json({ message: 'userId is required' });
        return;
      }

      const task = await taskService.createTask(Number(userId), taskData);
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

  async getByUserId(req: Request, res: Response): Promise<void> {
    try {
      const tasks = await taskService.getTasksByUserId(Number(req.params.userId));
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

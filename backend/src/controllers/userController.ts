import { Request, Response } from 'express';
import userService from '../services/userService';
import { AuthRequest } from '../middleware/authMiddleware';
import { formatTaskDates } from '../utils/date';

export class UserController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const user = await userService.register(req.body);
      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { token, user } = await userService.login(req.body);
      
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      res.json({ user });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const users = await userService.getAllUsers();
      const safeUsers = users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
      }));
      res.json(safeUsers);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const user = await userService.getUserById(Number(req.params.id));
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const targetId = Number(req.params.id);
      const currentUserId = req.user?.id;

      if (targetId !== currentUserId) {
        res.status(403).json({ message: 'You can only update your own profile' });
        return;
      }

      const user = await userService.updateUser(targetId, req.body);
      res.json({
        message: 'User updated successfully',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      const targetId = Number(req.params.id);
      const currentUserId = req.user?.id;

      if (targetId !== currentUserId) {
        res.status(403).json({ message: 'You can only delete your own account' });
        return;
      }

      await userService.deleteUser(targetId);
      res.clearCookie('token');
      res.json({ message: 'User deleted successfully' });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getUserTasks(req: Request, res: Response): Promise<void> {
    try {
      const tasks = await userService.getTasksByUserId(Number(req.params.id));
      res.json(tasks.map(formatTaskDates));
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default new UserController();

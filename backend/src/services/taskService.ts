import taskRepository from '../repositories/taskRepository';
import { CreateTaskDTO } from '../dto/task';
import { Task } from '../types/task';

export class TaskService {
  async createTask(userId: number, data: CreateTaskDTO): Promise<Task> {
    return taskRepository.create(userId, data);
  }

  async getAllTasks(): Promise<Task[]> {
    return taskRepository.findAll();
  }

  async getTasksByUserId(userId: number): Promise<Task[]> {
    return taskRepository.findByUserId(userId);
  }

  async getTaskById(id: number): Promise<Task> {
    const task = await taskRepository.findById(id);
    if (!task) {
      throw new Error('Task not found');
    }
    return task;
  }

  async updateTask(id: number, data: Partial<CreateTaskDTO>): Promise<Task> {
    const task = await taskRepository.findById(id);
    if (!task) {
      throw new Error('Task not found');
    }
    return taskRepository.update(id, data);
  }

  async deleteTask(id: number): Promise<Task> {
    const task = await taskRepository.findById(id);
    if (!task) {
      throw new Error('Task not found');
    }
    return taskRepository.delete(id);
  }
}

export default new TaskService();

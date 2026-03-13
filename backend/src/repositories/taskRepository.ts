import prisma from '../config/prisma';
import { Task } from '../types/task';
import { CreateTaskDTO } from '../dto/task';

export class TaskRepository {
  async create(userId: number, data: CreateTaskDTO): Promise<Task> {
    return prisma.task.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async findAll(): Promise<Task[]> {
    return prisma.task.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findByUserId(userId: number): Promise<Task[]> {
    return prisma.task.findMany({
      where: { userId },
    });
  }

  async findById(id: number): Promise<Task | null> {
    return prisma.task.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async update(id: number, data: Partial<CreateTaskDTO>): Promise<Task> {
    return prisma.task.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Task> {
    return prisma.task.delete({
      where: { id },
    });
  }
}

export default new TaskRepository();

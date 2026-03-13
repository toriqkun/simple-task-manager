import prisma from '../config/prisma';
import { User } from '../types/user';
import { Task } from '../types/task';
import { CreateUserDTO } from '../dto/user';

export class UserRepository {
  async create(data: CreateUserDTO): Promise<User> {
    return prisma.user.create({
      data,
    });
  }

  async findAll(): Promise<User[]> {
    return prisma.user.findMany();
  }

  async findById(id: number): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: number, data: Partial<CreateUserDTO>): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<User> {
    return prisma.user.delete({
      where: { id },
    });
  }

  async findTasksByUserId(userId: number): Promise<Task[]> {
    return prisma.task.findMany({
      where: {
        userId: userId,
      },
    });
  }
}

export default new UserRepository();

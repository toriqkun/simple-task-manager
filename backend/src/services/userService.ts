import userRepository from '../repositories/userRepository';
import { CreateUserDTO, LoginDTO } from '../dto/user';
import { User } from '../types/user';
import { Task } from '../types/task';
import { PasswordUtils } from '../utils/password';
import { JWTUtils } from '../utils/jwt';

export class UserService {
  async register(data: CreateUserDTO): Promise<User> {
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const hashedPassword = await PasswordUtils.hash(data.password);
    
    return userRepository.create({
      ...data,
      password: hashedPassword,
    });
  }

  async login(data: LoginDTO): Promise<{ token: string; user: Partial<User> }> {
    const user = await userRepository.findByEmail(data.email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await PasswordUtils.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const token = JWTUtils.generateToken({ id: user.id, email: user.email });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  async getAllUsers(): Promise<User[]> {
    return userRepository.findAll();
  }

  async getUserById(id: number): Promise<User | null> {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return userRepository.findByEmail(email);
  }

  async updateUser(id: number, data: Partial<CreateUserDTO>): Promise<User> {
    if (data.password) {
      data.password = await PasswordUtils.hash(data.password);
    }
    return userRepository.update(id, data);
  }

  async deleteUser(id: number): Promise<User> {
    return userRepository.delete(id);
  }

  async getTasksByUserId(userId: number): Promise<Task[]> {
    return userRepository.findTasksByUserId(userId);
  }
}

export default new UserService();

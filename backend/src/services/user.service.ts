import userRepository from '../repositories/user.repository';
import { CreateUserDTO } from '../dto/user.dto';
import { User } from '../types/user.types';
import { PasswordUtils } from '../utils/password';

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
}

export default new UserService();

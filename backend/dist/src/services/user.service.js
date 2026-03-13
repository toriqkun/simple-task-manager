"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_repository_1 = __importDefault(require("../repositories/user.repository"));
const password_1 = require("../utils/password");
class UserService {
    async register(data) {
        const existingUser = await user_repository_1.default.findByEmail(data.email);
        if (existingUser) {
            throw new Error('Email already registered');
        }
        const hashedPassword = await password_1.PasswordUtils.hash(data.password);
        return user_repository_1.default.create({
            ...data,
            password: hashedPassword,
        });
    }
    async getAllUsers() {
        return user_repository_1.default.findAll();
    }
    async getUserById(id) {
        const user = await user_repository_1.default.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
    async getUserByEmail(email) {
        return user_repository_1.default.findByEmail(email);
    }
    async updateUser(id, data) {
        if (data.password) {
            data.password = await password_1.PasswordUtils.hash(data.password);
        }
        return user_repository_1.default.update(id, data);
    }
    async deleteUser(id) {
        return user_repository_1.default.delete(id);
    }
}
exports.UserService = UserService;
exports.default = new UserService();

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const userRepository_1 = __importDefault(require("../repositories/userRepository"));
const password_1 = require("../utils/password");
const jwt_1 = require("../utils/jwt");
class UserService {
    async register(data) {
        const existingUser = await userRepository_1.default.findByEmail(data.email);
        if (existingUser) {
            throw new Error('Email already registered');
        }
        const hashedPassword = await password_1.PasswordUtils.hash(data.password);
        return userRepository_1.default.create({
            ...data,
            password: hashedPassword,
        });
    }
    async login(data) {
        const user = await userRepository_1.default.findByEmail(data.email);
        if (!user) {
            throw new Error('Invalid email or password');
        }
        const isPasswordValid = await password_1.PasswordUtils.compare(data.password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }
        const token = jwt_1.JWTUtils.generateToken({ id: user.id, email: user.email });
        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        };
    }
    async getAllUsers() {
        return userRepository_1.default.findAll();
    }
    async getUserById(id) {
        const user = await userRepository_1.default.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
    async getUserByEmail(email) {
        return userRepository_1.default.findByEmail(email);
    }
    async updateUser(id, data) {
        if (data.password) {
            data.password = await password_1.PasswordUtils.hash(data.password);
        }
        return userRepository_1.default.update(id, data);
    }
    async deleteUser(id) {
        return userRepository_1.default.delete(id);
    }
}
exports.UserService = UserService;
exports.default = new UserService();

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const userService_1 = __importDefault(require("../services/userService"));
const date_1 = require("../utils/date");
class UserController {
    async register(req, res) {
        try {
            const user = await userService_1.default.register(req.body);
            res.status(201).json({
                message: 'User registered successfully',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
            });
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async login(req, res) {
        try {
            const { token, user } = await userService_1.default.login(req.body);
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                maxAge: 24 * 60 * 60 * 1000,
            });
            res.json({ user });
        }
        catch (error) {
            res.status(401).json({ message: error.message });
        }
    }
    async logout(req, res) {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        });
        res.json({ message: 'Logged out successfully' });
    }
    async getAll(req, res) {
        try {
            const users = await userService_1.default.getAllUsers();
            const safeUsers = users.map((user) => ({
                id: user.id,
                name: user.name,
                email: user.email,
            }));
            res.json(safeUsers);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    async getById(req, res) {
        try {
            const user = await userService_1.default.getUserById(Number(req.params.id));
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
            });
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async update(req, res) {
        try {
            const targetId = Number(req.params.id);
            const currentUserId = req.user?.id;
            if (targetId !== currentUserId) {
                res.status(403).json({ message: 'You can only update your own profile' });
                return;
            }
            const user = await userService_1.default.updateUser(targetId, req.body);
            res.json({
                message: 'User updated successfully',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
            });
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async delete(req, res) {
        try {
            const targetId = Number(req.params.id);
            const currentUserId = req.user?.id;
            if (targetId !== currentUserId) {
                res.status(403).json({ message: 'You can only delete your own account' });
                return;
            }
            await userService_1.default.deleteUser(targetId);
            res.clearCookie('token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            });
            res.json({ message: 'User deleted successfully' });
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async getUserTasks(req, res) {
        try {
            const tasks = await userService_1.default.getTasksByUserId(Number(req.params.id));
            res.json(tasks.map(date_1.formatTaskDates));
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}
exports.UserController = UserController;
exports.default = new UserController();

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = __importDefault(require("../services/user.service"));
class UserController {
    async register(req, res) {
        try {
            const user = await user_service_1.default.register(req.body);
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
    async getAll(req, res) {
        try {
            const users = await user_service_1.default.getAllUsers();
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
            const user = await user_service_1.default.getUserById(Number(req.params.id));
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
            const user = await user_service_1.default.updateUser(Number(req.params.id), req.body);
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
            await user_service_1.default.deleteUser(Number(req.params.id));
            res.json({ message: 'User deleted successfully' });
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}
exports.UserController = UserController;
exports.default = new UserController();

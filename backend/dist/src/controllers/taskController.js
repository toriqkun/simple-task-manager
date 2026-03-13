"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const taskService_1 = __importDefault(require("../services/taskService"));
class TaskController {
    async create(req, res) {
        try {
            // Note: userId will eventually come from auth middleware
            // For now, we expect it in the body for testing purposes in Step 4
            const { userId, ...taskData } = req.body;
            if (!userId) {
                res.status(400).json({ message: 'userId is required' });
                return;
            }
            const task = await taskService_1.default.createTask(Number(userId), taskData);
            res.status(201).json(task);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async getAll(req, res) {
        try {
            const tasks = await taskService_1.default.getAllTasks();
            res.json(tasks);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    async getByUserId(req, res) {
        try {
            const tasks = await taskService_1.default.getTasksByUserId(Number(req.params.userId));
            res.json(tasks);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async getById(req, res) {
        try {
            const task = await taskService_1.default.getTaskById(Number(req.params.id));
            res.json(task);
        }
        catch (error) {
            res.status(404).json({ message: error.message });
        }
    }
    async update(req, res) {
        try {
            const task = await taskService_1.default.updateTask(Number(req.params.id), req.body);
            res.json(task);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async delete(req, res) {
        try {
            await taskService_1.default.deleteTask(Number(req.params.id));
            res.json({ message: 'Task deleted successfully' });
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}
exports.TaskController = TaskController;
exports.default = new TaskController();

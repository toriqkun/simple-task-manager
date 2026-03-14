"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const taskService_1 = __importDefault(require("../services/taskService"));
const date_1 = require("../utils/date");
class TaskController {
    async create(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }
            const task = await taskService_1.default.createTask(userId, req.body);
            res.status(201).json((0, date_1.formatTaskDates)(task));
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async getAll(req, res) {
        try {
            const tasks = await taskService_1.default.getAllTasks();
            res.json(tasks.map(date_1.formatTaskDates));
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    async getByUserId(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }
            const tasks = await taskService_1.default.getTasksByUserId(userId);
            res.json(tasks.map(date_1.formatTaskDates));
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async getById(req, res) {
        try {
            const task = await taskService_1.default.getTaskById(Number(req.params.id));
            res.json((0, date_1.formatTaskDates)(task));
        }
        catch (error) {
            res.status(404).json({ message: error.message });
        }
    }
    async update(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }
            const task = await taskService_1.default.updateTask(Number(req.params.id), userId, req.body);
            res.json((0, date_1.formatTaskDates)(task));
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async delete(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }
            await taskService_1.default.deleteTask(Number(req.params.id), userId);
            res.json({ message: 'Task deleted successfully' });
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}
exports.TaskController = TaskController;
exports.default = new TaskController();

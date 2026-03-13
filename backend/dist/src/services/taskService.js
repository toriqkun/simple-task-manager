"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const taskRepository_1 = __importDefault(require("../repositories/taskRepository"));
class TaskService {
    async createTask(userId, data) {
        return taskRepository_1.default.create(userId, data);
    }
    async getAllTasks() {
        return taskRepository_1.default.findAll();
    }
    async getTasksByUserId(userId) {
        return taskRepository_1.default.findByUserId(userId);
    }
    async getTaskById(id) {
        const task = await taskRepository_1.default.findById(id);
        if (!task) {
            throw new Error('Task not found');
        }
        return task;
    }
    async updateTask(id, data) {
        const task = await taskRepository_1.default.findById(id);
        if (!task) {
            throw new Error('Task not found');
        }
        return taskRepository_1.default.update(id, data);
    }
    async deleteTask(id) {
        const task = await taskRepository_1.default.findById(id);
        if (!task) {
            throw new Error('Task not found');
        }
        return taskRepository_1.default.delete(id);
    }
}
exports.TaskService = TaskService;
exports.default = new TaskService();

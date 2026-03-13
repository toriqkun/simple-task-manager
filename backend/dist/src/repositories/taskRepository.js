"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskRepository = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
class TaskRepository {
    async create(userId, data) {
        return prisma_1.default.task.create({
            data: {
                ...data,
                userId,
            },
        });
    }
    async findAll() {
        return prisma_1.default.task.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }
    async findByUserId(userId) {
        return prisma_1.default.task.findMany({
            where: { userId },
        });
    }
    async findById(id) {
        return prisma_1.default.task.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }
    async update(id, data) {
        return prisma_1.default.task.update({
            where: { id },
            data,
        });
    }
    async delete(id) {
        return prisma_1.default.task.delete({
            where: { id },
        });
    }
}
exports.TaskRepository = TaskRepository;
exports.default = new TaskRepository();

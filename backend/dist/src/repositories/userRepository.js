"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
class UserRepository {
    async create(data) {
        return prisma_1.default.user.create({
            data,
        });
    }
    async findAll() {
        return prisma_1.default.user.findMany();
    }
    async findById(id) {
        return prisma_1.default.user.findUnique({
            where: { id },
        });
    }
    async findByEmail(email) {
        return prisma_1.default.user.findUnique({
            where: { email },
        });
    }
    async update(id, data) {
        return prisma_1.default.user.update({
            where: { id },
            data,
        });
    }
    async delete(id) {
        return prisma_1.default.user.delete({
            where: { id },
        });
    }
    async findTasksByUserId(userId) {
        return prisma_1.default.task.findMany({
            where: {
                userId: userId,
            },
        });
    }
}
exports.UserRepository = UserRepository;
exports.default = new UserRepository();

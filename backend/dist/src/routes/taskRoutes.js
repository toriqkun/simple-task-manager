"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const taskController_1 = __importDefault(require("../controllers/taskController"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.get('/', taskController_1.default.getAll);
router.get('/my-tasks', authMiddleware_1.authMiddleware, taskController_1.default.getByUserId);
router.get('/:id', taskController_1.default.getById);
router.post('/', authMiddleware_1.authMiddleware, taskController_1.default.create);
router.put('/:id', authMiddleware_1.authMiddleware, taskController_1.default.update);
router.delete('/:id', authMiddleware_1.authMiddleware, taskController_1.default.delete);
exports.default = router;

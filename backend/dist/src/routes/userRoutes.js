"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = __importDefault(require("../controllers/userController"));
const router = (0, express_1.Router)();
router.post('/', userController_1.default.register);
router.post('/login', userController_1.default.login);
router.get('/', userController_1.default.getAll);
router.get('/:id', userController_1.default.getById);
router.get('/:id/tasks', userController_1.default.getUserTasks);
router.put('/:id', userController_1.default.update);
router.delete('/:id', userController_1.default.delete);
exports.default = router;

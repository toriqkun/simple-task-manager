"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const taskController_1 = __importDefault(require("../controllers/taskController"));
const router = (0, express_1.Router)();
router.post('/', taskController_1.default.create);
router.get('/', taskController_1.default.getAll);
router.get('/user/:userId', taskController_1.default.getByUserId);
router.get('/:id', taskController_1.default.getById);
router.put('/:id', taskController_1.default.update);
router.delete('/:id', taskController_1.default.delete);
exports.default = router;

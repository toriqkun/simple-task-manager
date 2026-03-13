"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const router = (0, express_1.Router)();
router.post('/', user_controller_1.default.register);
router.get('/', user_controller_1.default.getAll);
router.get('/:id', user_controller_1.default.getById);
router.put('/:id', user_controller_1.default.update);
router.delete('/:id', user_controller_1.default.delete);
exports.default = router;

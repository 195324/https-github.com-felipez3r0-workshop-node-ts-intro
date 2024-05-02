"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const task_controller_1 = __importDefault(require("../../controllers/task/task.controller"));
const auth_middleware_1 = __importDefault(require("../../middlewares/auth.middleware"));
const taskRoutes = (0, express_1.Router)();
taskRoutes.post('/', auth_middleware_1.default, task_controller_1.default.store);
taskRoutes.get('/', auth_middleware_1.default, task_controller_1.default.index);
taskRoutes.get('/:id', auth_middleware_1.default, task_controller_1.default.show);
taskRoutes.delete('/:id', auth_middleware_1.default, task_controller_1.default.delete);
taskRoutes.put('/:id', auth_middleware_1.default, task_controller_1.default.update);
exports.default = taskRoutes;

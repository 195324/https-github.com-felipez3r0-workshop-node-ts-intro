"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../../controllers/auth/auth.controller"));
const authRoutes = (0, express_1.Router)();
authRoutes.post('/register', auth_controller_1.default.store);
authRoutes.post('/login', auth_controller_1.default.login);
authRoutes.post('/refresh', auth_controller_1.default.refresh);
authRoutes.post('/logout', auth_controller_1.default.logout);
exports.default = authRoutes;

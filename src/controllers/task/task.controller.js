"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const task_entity_1 = __importDefault(require("../../models/task.entity"));
class TaskController {
    static store(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, completed } = req.body;
            const { userId } = req.headers;
            if (!userId)
                return res.status(401).json({ error: 'Usuário não autenticado' });
            if (!title) {
                return res.status(400).json({ error: 'O título é obrigatório' });
            }
            const task = new task_entity_1.default();
            task.title = title;
            task.completed = completed !== null && completed !== void 0 ? completed : false;
            task.userId = Number(userId);
            yield task.save();
            return res.status(201).json(task);
        });
    }
    static index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.headers;
            if (!userId)
                return res.status(401).json({ error: 'Usuário não autenticado' });
            const tasks = yield task_entity_1.default.find({ where: { userId: Number(userId) } });
            return res.json(tasks);
        });
    }
    static show(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { userId } = req.headers;
            if (!id || isNaN(Number(id))) {
                return res.status(400).json({ error: 'O id é obrigatório' });
            }
            if (!userId)
                return res.status(401).json({ error: 'Usuário não autenticado' });
            const task = yield task_entity_1.default.findOneBy({ id: Number(id), userId: Number(userId) });
            return res.json(task);
        });
    }
    static delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { userId } = req.headers;
            if (!id || isNaN(Number(id))) {
                return res.status(400).json({ error: 'O id é obrigatório' });
            }
            if (!userId)
                return res.status(401).json({ error: 'Usuário não autenticado' });
            const task = yield task_entity_1.default.findOneBy({ id: Number(id), userId: Number(userId) });
            if (!task) {
                return res.status(404).json({ error: 'Task não encontrada' });
            }
            yield task.remove();
            return res.status(204).json();
        });
    }
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { title, completed } = req.body;
            const { userId } = req.headers;
            if (!id || isNaN(Number(id))) {
                return res.status(400).json({ error: 'O id é obrigatório' });
            }
            if (!userId)
                return res.status(401).json({ error: 'Usuário não autenticado' });
            const task = yield task_entity_1.default.findOneBy({ id: Number(id), userId: Number(userId) });
            if (!task) {
                return res.status(404).json({ error: 'Task não encontrada' });
            }
            task.title = title !== null && title !== void 0 ? title : task.title;
            task.completed = (completed === undefined) ? task.completed : completed;
            yield task.save();
            return res.json(task);
        });
    }
}
exports.default = TaskController;

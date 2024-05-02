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
const user_entity_1 = __importDefault(require("../../models/user.entity"));
const token_entity_1 = __importDefault(require("../../models/token.entity"));
const bcrypt_1 = __importDefault(require("bcrypt"));
class AuthController {
    static store(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, password } = req.body;
            if (!name)
                return res.status(400).json({ error: 'O nome é obrigatório' });
            if (!email)
                return res.status(400).json({ error: 'O email é obrigatório' });
            if (!password)
                return res.status(400).json({ error: 'A senha é obrigatória' });
            // Verifica se o email já está cadastrado
            const userCheck = yield user_entity_1.default.findOneBy({ email });
            if (userCheck)
                return res.status(400).json({ error: 'Email já cadastrado' });
            const user = new user_entity_1.default();
            user.name = name;
            user.email = email;
            // Gera a hash da senha com bcrypt - para não salvar a senha em texto puro
            user.password = bcrypt_1.default.hashSync(password, 10);
            yield user.save();
            // Não vamos retornar a hash da senha
            return res.status(201).json({
                id: user.id,
                name: user.name,
                email: user.email
            });
        });
    }
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            if (!email)
                return res.status(400).json({ error: 'O email é obrigatório' });
            if (!password)
                return res.status(400).json({ error: 'A senha é obrigatória' });
            const user = yield user_entity_1.default.findOneBy({ email });
            if (!user)
                return res.status(401).json({ error: 'Usuário não encontrado' });
            const passwordMatch = bcrypt_1.default.compareSync(password, user.password);
            if (!passwordMatch)
                return res.status(401).json({ error: 'Senha inválida' });
            // Remove todos os tokens antigos do usuário
            yield token_entity_1.default.delete({ user: { id: user.id } });
            const token = new token_entity_1.default();
            // Gera um token aleatório
            token.token = bcrypt_1.default.hashSync(Math.random().toString(36), 1).slice(-20);
            // Define a data de expiração do token para 1 hora
            token.expiresAt = new Date(Date.now() + 60 * 60 * 1000);
            // Gera um refresh token aleatório
            token.refreshToken = bcrypt_1.default.hashSync(Math.random().toString(36), 1).slice(-20);
            token.user = user;
            yield token.save();
            return res.json({
                token: token.token,
                expiresAt: token.expiresAt,
                refreshToken: token.refreshToken
            });
        });
    }
    static refresh(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { authorization } = req.headers;
            if (!authorization)
                return res.status(400).json({ error: 'O refresh token é obrigatório' });
            const token = yield token_entity_1.default.findOneBy({ refreshToken: authorization });
            if (!token)
                return res.status(401).json({ error: 'Refresh token inválido' });
            // Verifica se o refresh token ainda é válido
            if (token.expiresAt < new Date()) {
                yield token.remove();
                return res.status(401).json({ error: 'Refresh token expirado' });
            }
            // Atualiza os tokens
            token.token = bcrypt_1.default.hashSync(Math.random().toString(36), 1).slice(-20);
            token.refreshToken = bcrypt_1.default.hashSync(Math.random().toString(36), 1).slice(-20);
            token.expiresAt = new Date(Date.now() + 60 * 60 * 1000);
            yield token.save();
            return res.json({
                token: token.token,
                expiresAt: token.expiresAt,
                refreshToken: token.refreshToken
            });
        });
    }
    static logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { authorization } = req.headers;
            if (!authorization)
                return res.status(400).json({ error: 'O token é obrigatório' });
            // Verifica se o token existe
            const userToken = yield token_entity_1.default.findOneBy({ token: authorization });
            if (!userToken)
                return res.status(401).json({ error: 'Token inválido' });
            // Remove o token
            yield userToken.remove();
            // Retorna uma resposta vazia
            return res.status(204).json();
        });
    }
}
exports.default = AuthController;

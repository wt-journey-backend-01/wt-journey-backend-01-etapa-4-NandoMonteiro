const express = require('express');
const { register, login, logout } = require('../controllers/authController');
const router = express.Router();
const { 
    newUsuarioValidation, 
    loginValidation 
} = require('../utils/usuariosValidations');  

/**
 * @swagger
 * tags:
 *   name: Autenticação
 *   description: Endpoints para registro, login e logout de usuários
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserRegister:
 *       type: object
 *       required:
 *         - nome
 *         - email
 *         - senha
 *       properties:
 *         nome:
 *           type: string
 *           description: Nome de usuário para registro (mínimo 3 caracteres)
 *           minLength: 3
 *           example: "novo_usuario"
 *         email:
 *           type: string
 *           format: email
 *           description: Email do usuário para registro (formato de email válido, único)
 *           example: "novo_usuario@example.com"
 *         senha:
 *           type: string
 *           format: password
 *           description: Senha para registro (mínimo 8 caracteres, pelo menos uma maiúscula, uma minúscula, um número e um caractere especial)
 *           minLength: 8
 *           pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\\W_]).+$"
 *           example: "Senha@123"
 *
 *     UserLogin:
 *       type: object
 *       required:
 *         - senha
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email do usuário para login (opcional se nome for fornecido)
 *           example: "usuario_existente@example.com"
 *         nome:
 *           type: string
 *           description: Nome de usuário para login (opcional se email for fornecido, mínimo 3 caracteres)
 *           minLength: 3
 *           example: "usuario_existente"
 *         senha:
 *           type: string
 *           format: password
 *           description: Senha para login (mínimo 8 caracteres, pelo menos uma maiúscula, uma minúscula, um número e um caractere especial)
 *           minLength: 8
 *           pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\\W_]).+$"
 *           example: "Senha@123"
 *       oneOf:
 *         - required: [email]
 *         - required: [nome]
 *
 *     AuthResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: Token de autenticação JWT
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Mensagem de erro
 *           example: "Usuário ou senha inválidos"
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Registra um novo usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UserRegister"
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthResponse"
 *       400:
 *         description: Dados inválidos ou usuário já existente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Realiza o login de um usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UserLogin"
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthResponse"
 *       401:
 *         description: Credenciais inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Realiza o logout do usuário
 *     tags: [Autenticação]
 *     responses:
 *       200:
 *         description: Logout bem-sucedido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logout realizado com sucesso"
 *       401:
 *         description: Não autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */

router.post('/register', newUsuarioValidation, register);
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;

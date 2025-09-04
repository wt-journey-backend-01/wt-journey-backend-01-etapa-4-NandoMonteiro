const bcrypt = require('bcryptjs');
const { createUsuario, findByEmail, findByNome } = require('../repositories/usuariosRepository');
const { generateToken } = require('../utils/generate-token');
const { AppError } = require('../utils/errorHandler');


async function register(req, res, next) {
  try {
    const parsed = req.body;
    const emailExists = await findByEmail(parsed.email);

    if (emailExists) {
      throw new AppError(400, 'Email já cadastrado');
    }

    const usernameExists = await findByNome(parsed.nome);

    if (usernameExists) {
      throw new AppError(400, 'Nome de usuário já cadastrado');
    }

    const hashed = await bcrypt.hash(parsed.senha, 10);

    const usuarioToInsert = {
      nome: parsed.nome,
      email: parsed.email,
      senha: hashed,
    };

    const newUsuario = await createUsuario(usuarioToInsert);

    const token = generateToken({ id: newUsuario.id, nome: newUsuario.nome });

    return res.status(201).json({
      access_token: token,
    });
    
  } catch (err) {
    if (err instanceof AppError) {
      return next(err);
    }

    return next(new AppError(500, 'Erro ao registrar usuário'));
  }
}

async function login(req, res, next) {
  try {
    const parsed = req.body;
    let usuario = null;

    if (parsed.email) {
      usuario = await findByEmail(parsed.email);
    }

    if (!usuario && parsed.nome) {
      usuario = await findByNome(parsed.nome);
    }

    if (!usuario) {
      throw new AppError(401, 'Credenciais inválidas.');
    }

    const ok = await bcrypt.compare(parsed.senha, usuario.senha);

    if (!ok) {
      throw new AppError(401, 'Credenciais inválidas.');
    }

    const token = generateToken({ id: usuario.id, nome: usuario.nome });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000,
      path: '/',
    });

    return res.status(200).json({
      access_token: token,
    });

  } catch (err) {
    if (err instanceof AppError) {
      return next(err);
    }

    return next(new AppError(500, 'Erro ao realizar login'));
  }
}

function logout(req, res) {
  res.clearCookie('token', { path: '/' });
  return res.status(200).json({
    status: 200,
    message: 'Logout realizado com sucesso.',
  });
}

module.exports = {
  register,
  login,
  logout,
};
const jwt = require('jsonwebtoken');
const { AppError } = require('../utils/errorHandler');

function authenticateToken(req, res, next) {
  const cookieToken = req.cookies?.token;
  const authHeader = req.headers['authorization'];
  const headerToken = authHeader && authHeader.split(' ')[1];
  const token = cookieToken || headerToken;

  if (!token) {
    return next(new AppError(401, 'Token de autenticação não fornecido'));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(new AppError(401, 'Token de autenticação inválido'));
    }
    req.user = user;
    next();
  });
}

module.exports = { authenticateToken };

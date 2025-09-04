class AppError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

const validate = (schema, req) => {
    const result = schema.safeParse(req);

    if (!result.success) {
        const errors = JSON.parse(result.error).map((err) => err.message);
        throw new AppError(400, 'Parâmetros inválidos', errors || []);
    }
};

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erro interno do servidor.';

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
  });
};

module.exports = { AppError, errorHandler, validate, };
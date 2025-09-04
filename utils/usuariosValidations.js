const { z } = require('zod');
const { validate } = require('./errorHandler');


const newUsuarioValidation = (req, res, next) => {
    const newUser = z.strictObject({
        nome: z.string().min(1, 'Nome é obrigatório'),
        email: z.email('Email inválido'),
        senha: z
            .string()
            .min(8, 'Senha deve ter ao menos 8 caracteres')
            .regex(/[a-z]/, 'Senha deve conter letra minúscula')
            .regex(/[A-Z]/, 'Senha deve conter letra maiúscula')
            .regex(/[0-9]/, 'Senha deve conter número')
            .regex(/[\W_]/, 'Senha deve conter caractere especial'),
    });

    validate(newUser, req.body);
    next();
};

const loginValidation = z
  .object({
    email: z.email('Email inválido').optional(),
    nome: z.string().min(3, 'Nome de usuário deve ter pelo menos 3 caracteres').optional(),
    senha: z
      .string()
      .min(8, 'Senha deve ter pelo menos 8 caracteres')
      .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
      .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
      .regex(/[0-9]/, 'Senha deve conter pelo menos um número')
      .regex(/[\W_]/, 'Senha deve conter pelo menos um caractere especial'),
  })
  .refine((data) => data.email || data.nome, {
    message: 'Email ou nome de usuário é obrigatório',
    path: ['email'],
  });

module.exports = { 
  newUsuarioValidation, 
};
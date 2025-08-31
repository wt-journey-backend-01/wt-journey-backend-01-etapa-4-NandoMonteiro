const { z, email } = require('zod');

const newUsuarioValidation = z.object({
  nome: z
    .string({ required_error: 'Nome é obrigatório' })
    .min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z
    .string({ required_error: 'Email é obrigatório' })
    .email("Email inválido"),
  senha: z
    .string({ required_error: 'Senha é obrigatória' })
    .min(8, 'Senha deve ter pelo menos 6 caracteres')
    .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'Senha deve conter pelo menos um número')
    .regex(/[\W_]/, 'Senha deve conter pelo menos um caractere especial'),
});
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

module.exports = { newUsuarioValidation, loginValidation };
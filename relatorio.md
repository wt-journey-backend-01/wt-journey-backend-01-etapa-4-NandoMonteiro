<sup>Esse é um feedback gerado por IA, ele pode conter erros.</sup>

Você tem 9 créditos restantes para usar o sistema de feedback AI.

# Feedback para NandoMonteiro:

Nota final: **29.3/100**

Olá, NandoMonteiro! 👋🚀

Primeiramente, parabéns pelo empenho e pela entrega do seu projeto! 🎉 Você conseguiu implementar várias funcionalidades importantes, como o cadastro, login e logout de usuários com JWT, além da proteção das rotas de agentes e casos, o que já é um grande passo para uma API segura e profissional.

Também quero destacar que você alcançou com sucesso alguns bônus importantes, como a proteção das rotas com middleware de autenticação, o logout invalidando o token e a geração do JWT com expiração válida. Isso mostra que você está no caminho certo para dominar autenticação em APIs Node.js! 👏

---

### Agora, vamos juntos analisar os pontos que precisam de ajustes para você destravar a nota e deixar sua aplicação tinindo! 🕵️‍♂️🔍

---

## 1. Estrutura do Projeto

Sua estrutura de pastas está muito próxima da esperada, o que é ótimo! Porém, percebi que no arquivo **INSTRUCTIONS.md** seu conteúdo está incompleto e não contempla as informações de autenticação, JWT e fluxos de segurança que o desafio pede. Isso é importante para a documentação e para os testes automáticos reconhecerem sua implementação.

**Dica:** Atualize o `INSTRUCTIONS.md` para incluir:

- Como registrar e logar usuários (`POST /auth/register` e `POST /auth/login`).
- Exemplos de envio do token JWT no header `Authorization`.
- Explicação do fluxo de autenticação esperado.

---

## 2. Falhas nos Testes de Usuários (USERS)

Você teve várias falhas relacionadas à criação de usuários com dados inválidos, como nomes ou emails vazios/nulos, senhas que não respeitam a política de segurança (mínimo 8 caracteres, contendo letras maiúsculas, minúsculas, números e caracteres especiais), e também erro 400 ao tentar criar usuário com email já em uso.

### Causa raiz:

- No seu `authController.js`, o erro principal está no trecho abaixo:

```js
return res.status(201).json({
  status: 201,
  message: 'Usuário registrado com sucesso',
  user: created,
});
```

Aqui você está retornando `created`, mas essa variável não existe no escopo da função. O valor correto é `newUsuario`, que é o resultado do `createUsuario`.

Além disso, a validação da senha e dos campos do usuário está delegada ao `newUsuarioValidation` (provavelmente um esquema Zod), mas não temos o código dele aqui. Se essa validação não está cobrindo todos os critérios de senha (mínimo 8 caracteres, letras maiúsculas, minúsculas, números e caractere especial), os testes vão falhar.

### Como corrigir:

- Corrija o retorno para usar a variável certa:

```js
return res.status(201).json({
  status: 201,
  message: 'Usuário registrado com sucesso',
  user: newUsuario,
});
```

- Assegure que o esquema `newUsuarioValidation` no arquivo `utils/usuariosValidations.js` valida rigorosamente todos os requisitos de senha e campos obrigatórios. Exemplo básico para senha usando Zod:

```js
const newUsuarioValidation = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  senha: z.string()
    .min(8, "Senha deve ter pelo menos 8 caracteres")
    .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
    .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula")
    .regex(/[0-9]/, "Senha deve conter pelo menos um número")
    .regex(/[\W_]/, "Senha deve conter pelo menos um caractere especial"),
});
```

- Garanta que o middleware de validação está sendo chamado corretamente na rota de registro.

---

## 3. Repositórios com Erros de Variáveis e Nomes

Nos seus arquivos `agentesRepository.js` e `casosRepository.js` há vários erros de referência a variáveis incorretas, que causam exceções e falhas silenciosas.

Exemplos em `agentesRepository.js`:

```js
return result.map(formatAgenteData); // OK

//...

return result; // OK

// Mas depois:
throw new AppError(500, 'Erro ao buscar agente.', [error_message]); // error_message não existe, deveria ser error.message

//...

throw new AppError(500, 'Erro ao criar agente.', [error_message]);

//...

return format_agenteData(agente); // função com nome errado, deveria ser formatAgenteData

//...

throw new AppError(500, 'Erro ao atualizar agente.', [error_message]);

//...

throw new AppError(500, 'Erro ao excluir agente.', [error_message]);
```

O mesmo padrão aparece em `casosRepository.js`:

```js
catch (error_message) { // deveria ser catch(error)
  throw new AppError(500, 'Erro ao buscar caso.', [error_message]);
}

//...

const [caso] = await db('casos').update(partial_caso).where({ id }).returning('*'); // partial_caso não está definido, deveria ser partialCaso

//...

throw new_AppError(500, 'Erro ao atualizar caso.', [error_message]); // erro de sintaxe: new_AppError não existe
```

### Causa raiz:

Você está usando variáveis não declaradas (ex: `error_message`, `partial_caso`, `new_AppError`) e nomes de funções incorretos (`format_agenteData` vs `formatAgenteData`). Isso gera erros que quebram a aplicação e impedem o funcionamento correto dos endpoints.

### Como corrigir:

- Use sempre o nome correto do parâmetro do catch, geralmente `error`:

```js
catch (error) {
  throw new AppError(500, 'Mensagem de erro', [error.message]);
}
```

- Corrija os nomes dos parâmetros nas funções (ex: `partialCaso` em vez de `partial_caso`).

- Corrija os nomes das funções chamadas (ex: `formatAgenteData`).

- Corrija a sintaxe de criação de erros (ex: `new AppError`, não `new_AppError`).

---

## 4. Middleware de Autenticação

Seu middleware `authenticateToken` tenta usar o token tanto do cookie quanto do header `Authorization`. Isso é legal, mas repare que no seu `server.js` você não está usando nenhum middleware para cookies (ex: `cookie-parser`), logo o `req.cookies` provavelmente está indefinido.

```js
const cookieToken = req.cookies?.token;
```

Isso pode causar problemas se você espera receber o token via cookie.

### Como corrigir:

- Instale e configure o middleware `cookie-parser` no `server.js`:

```js
const cookieParser = require('cookie-parser');

app.use(cookieParser());
```

Assim, o `req.cookies` estará disponível e seu middleware funcionará corretamente.

---

## 5. Documentação e Rotas

No seu `routes/authRoutes.js`, os endpoints estão definidos corretamente, mas o Swagger no `INSTRUCTIONS.md` está incompleto e não documenta os endpoints de autenticação, o que pode afetar a validação automática.

Além disso, no seu arquivo `INSTRUCTIONS.md` está faltando a pasta `authRoutes.js`, `authController.js` e `usuariosRepository.js` na listagem, que são obrigatórios para o desafio.

---

## 6. Mensagens de Erro e Tratamento

Você está usando o `AppError` para lançar erros personalizados, o que é ótimo! Porém, em alguns casos, você lança erros dentro de callbacks (ex: no `jwt.verify` do middleware), e isso pode não ser capturado corretamente pelo Express.

Para garantir o fluxo correto de erros, prefira usar `return next(new AppError(...))` em vez de `throw` dentro de callbacks assíncronos.

---

## 7. Recomendações para os Bônus

Você tentou implementar alguns endpoints bônus, como filtragem avançada e `/usuarios/me`, mas eles não passaram nos testes. Isso pode estar ligado aos problemas estruturais e de validação que vimos.

---

# 📚 Recursos recomendados para você:

- Para entender melhor autenticação JWT e bcrypt, recomendo muito este vídeo, feito pelos meus criadores, que fala muito bem sobre conceitos básicos e aplicação prática:  
https://www.youtube.com/watch?v=Q4LQOfYwujk  
https://www.youtube.com/watch?v=L04Ln97AwoY

- Para corrigir os erros com o Knex e a configuração do banco, veja este tutorial sobre Docker, Knex e PostgreSQL:  
https://www.youtube.com/watch?v=uEABDBQV-Ek&t=1s  
https://www.youtube.com/watch?v=dXWy_aGCW1E

- Para entender melhor o padrão MVC e organização do projeto Node.js:  
https://www.youtube.com/watch?v=bGN_xNc4A1k&t=3s

---

# 📋 Resumo rápido dos principais pontos para você focar:

- Corrigir variáveis incorretas e erros de sintaxe nos repositórios (`error_message` → `error.message`, nomes de funções e parâmetros).
- Ajustar o retorno correto do usuário criado no `authController` (usar `newUsuario`).
- Garantir que o esquema de validação do usuário (`newUsuarioValidation`) cobre todos os requisitos de senha e campos obrigatórios.
- Configurar `cookie-parser` para que o middleware de autenticação funcione corretamente com cookies.
- Completar a documentação no `INSTRUCTIONS.md`, incluindo rotas de autenticação e exemplos de uso do token JWT.
- Usar `next()` para passar erros no middleware, evitando `throw` em callbacks assíncronos.
- Revisar e corrigir os endpoints bônus após os ajustes acima para garantir funcionamento.

---

Nando, você está muito perto de entregar uma API completa, segura e profissional! 💪 Com esses ajustes seu código vai ficar bem mais robusto e alinhado com os requisitos do desafio. Continue firme, revise com calma os pontos que te mostrei e não hesite em consultar os vídeos que compartilhei para fortalecer seu conhecimento. Estou aqui torcendo pelo seu sucesso! 🚀✨

Se precisar de mais ajuda, só chamar! 😉

Abraços e bons códigos! 👨‍💻🔥

> Caso queira tirar uma dúvida específica, entre em contato com o Chapter no nosso [discord](https://discord.gg/DryuHVnz).



---
<sup>Made By the Autograder Team.</sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Arthur Carvalho](https://github.com/ArthurCRodrigues)</sup></sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Arthur Drumond](https://github.com/drumondpucminas)</sup></sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Gabriel Resende](https://github.com/gnvr29)</sup></sup>
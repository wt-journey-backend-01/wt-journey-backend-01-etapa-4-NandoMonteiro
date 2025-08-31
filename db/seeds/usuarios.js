const { id } = require("zod/locales");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('usuarios').del()
  await knex('usuarios').insert([
      { 
        id: 1,  
        nome: 'admin',
        email: 'admin@dp.br',
        senha: 'senha123'
      },
      { 
        id: 2,
        nome: 'teste',
        email: 'teste@dp.br',
        senha: 'teste123'
        },
  ]);
};

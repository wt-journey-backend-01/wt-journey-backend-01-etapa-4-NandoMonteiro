/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('casos').del()
  await knex('casos').insert([
      { 
        id: 1,
        titulo: "Roubo de Joias",
        descricao: "Roubo de joias valiosas em uma residência de luxo.",
        status: "aberto",
        agente_id: 1
      },
      { 
        id: 2,
        titulo: "Fraude Financeira",
        descricao: "Esquema de fraude financeira envolvendo várias contas bancárias.",
        status: "aberto",
        agente_id: 2
      }
  ]);
};
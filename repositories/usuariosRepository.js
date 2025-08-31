const db = require('../db/db');

async function createUsuario(usuario) {
  const [created] = await db('usuarios').insert(usuario).returning('*');
  return created;
}

async function findById(id) {
  return db('usuarios').where({ id }).first();
}

async function findByEmail(email) {
  return db('usuarios').where({ email }).first();
}

async function findByNome(nome) {
  return db('usuarios').where({ nome }).first();
}

module.exports = {
  createUsuario,
  findById,
  findByEmail,
  findByNome,
};

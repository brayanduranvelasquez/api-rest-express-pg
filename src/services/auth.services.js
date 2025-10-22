const db = require("../db/db");

// 1. Busca si un usuario ya existe (para el registro)
const findByEmail = async (email) => {
  const query = "SELECT * FROM users WHERE email = $1";
  const { rows } = await db.query(query, [email]);
  return rows[0];
};

// 2. Crea un nuevo usuario en la DB (recibe el hash de bcrypt)
const createAnalyst = async (email, passwordHash) => {
  const query =
    "INSERT INTO users (email, password, role_id) VALUES ($1, $2, $3) RETURNING id, email, created_at, role_id";
  const { rows } = await db.query(query, [email, passwordHash, 2]);
  return rows[0];
};

module.exports = {
  findByEmail,
  createAnalyst,
};

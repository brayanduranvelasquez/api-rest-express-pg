// src/db/db.js

// 1. Cargar las variables del archivo .env
require("dotenv").config();
const { Pool } = require("pg");

// 2. Crear una nueva instancia de Pool con la configuración del .env
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// 3. Exportar una función que permite ejecutar queries SQL
module.exports = {
  // La función query() toma el texto SQL y los parámetros (ej. valores)
  query: (text, params) => pool.query(text, params),
};

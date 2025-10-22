const db = require("../db/db");

const getMembers = async () => {
  const query = `
        SELECT 
            c.id, 
            c.first_name, 
            c.last_name, 
            c.phone, 
            c.created_at,
            u.email AS creator_email
        FROM 
            clients c
        JOIN 
            users u ON c.creator_id = u.id
        ORDER BY 
            c.last_name;
    `;

  const { rows } = await db.query(query);
  return rows;
};

const createClient = async (firstName, lastName, phone, creatorId) => {
  const query = `
        INSERT INTO clients (first_name, last_name, phone, creator_id) 
        VALUES ($1, $2, $3, $4) 
        RETURNING *; 
    `;

  const { rows } = await db.query(query, [firstName, lastName, phone, creatorId]);
  return rows[0];
};

module.exports = {
  getMembers,
  createClient,
};

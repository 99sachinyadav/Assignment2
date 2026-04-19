import { pool } from '../config/postgres.js';

const createUser = async (name, email, hashedPassword) => {
  //  I have already standrized the table  by making the function like this to easly use in controllers
  const query = `
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING id, name, email, created_at;
  `;
  const values = [name, email, hashedPassword];
  // directly inserting into the database by taking a instance of pool
  const result = await pool.query(query, values);
  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const query = `
    SELECT * FROM users WHERE email = $1;
  `;
  const values = [email];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const findUserById = async (id) => {
  const query = `
    SELECT id, name, email, created_at FROM users WHERE id = $1;
  `;
  const values = [id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export {
  createUser,
  findUserByEmail,
  findUserById,
};

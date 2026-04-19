import pg from 'pg';
const { Pool } = pg;
import dotenv from 'dotenv';
dotenv.config();

// Initializing PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.POSTGRES_URI,
});

export { pool };
export const query = (text, params) => pool.query(text, params);

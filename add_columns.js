import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

async function addColumns() {
  const pool = new Pool({ connectionString: process.env.DIRECT_URL });
  try {
    await pool.query(`
      ALTER TABLE pedido 
      ADD COLUMN IF NOT EXISTS tempo_preparo INT,
      ADD COLUMN IF NOT EXISTS tempo_espera INT;
    `);
    console.log('Columns added successfully');
  } catch (error) {
    console.error('Error adding columns:', error);
  } finally {
    await pool.end();
  }
}

addColumns();

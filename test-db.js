import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

async function testConnection() {
  const pool = new Pool({ connectionString: process.env.DIRECT_URL });
  try {
    const result = await pool.query('SELECT table_name FROM information_schema.tables WHERE table_schema = $1', ['public']);
    console.log('Tables in database:', result.rows.map(r => r.table_name));
    console.log('Connection successful!');
  } catch (err) {
    console.error('Database connection failed:', err);
  } finally {
    await pool.end();
  }
}

testConnection();

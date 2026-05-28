import pkg from "pg";
import dotenv from "dotenv";

const { Pool } = pkg;
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  await pool.connect();
  const res = await pool.query("SELECT $1::text as message", ["Hello world!"]);
  console.log(res.rows[0].message);
  await pool.end();
}
run();

export default pool;

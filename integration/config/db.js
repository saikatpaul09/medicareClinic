import pkg from "pg";
import dotenv from "dotenv";

const { Pool } = pkg;
dotenv.config();

const pool = new Pool({
  connectionString: process.env.connectionString,
});

pool.on("connect", () => {
  console.log("Connected to the database");
});

export default pool;

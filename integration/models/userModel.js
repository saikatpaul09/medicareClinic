import pool from "../config/db";
import bcrypt from "bcrypt";

export const createUserService = async (name, username, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const query =
    "INSERT INTO users (name, username, password) VALUES ($1, $2, $3) RETURNING id";
  const values = [name, username, hashedPassword];
  const result = await pool.query(query, values);
  return result.rows[0].id;
};

export const authenticateUserService = async (email, password) => {
  const query = "SELECT * FROM users WHERE email = $1";
  const values = [email];
  const result = await pool.query(query, values);
  if (result.rows.length === 0) {
    throw new Error("User not found");
  }
  const user = result.rows[0];
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }
  return user.id;
};

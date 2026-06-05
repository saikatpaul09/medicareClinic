import pool from "../config/db.js";
import bcrypt from "bcrypt";

export const createUserService = async (
  firstName,
  lastName,
  email,
  password,
  role,
  phone,
) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const query =
    'INSERT INTO users ("firstName", "lastName", "email", "password", "role", "phone") VALUES ($1, $2, $3, $4, $5, $6) RETURNING id';
  const values = [firstName, lastName, email, hashedPassword, role, phone];
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
  return user;
};

export const getUserByIdService = async (userId) => {
  const query =
    'SELECT id, "firstName", "lastName", "email", "role" FROM users WHERE id = $1';
  const values = [userId];
  const result = await pool.query(query, values);
  return result.rows[0];
};

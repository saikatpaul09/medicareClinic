import pool from "../config/db.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
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

export const refreshTokenService = async (refreshToken) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");
  const query =
    "SELECT * FROM users_refresh_tokens WHERE token_hash = $1 AND is_revoked = FALSE AND expires_at > NOW()";
  const values = [hashedToken];
  const result = await pool.query(query, values);
  const tokenRecord = result.rows[0];
  return tokenRecord;
};

export const saveTokenUserService = async (user, hashToken) => {
  const expiryDate = new Date(
    Date.now() + parseInt(process.env.JWT_REFRESH_SECRET_EXPIRY),
  );
  const query =
    "INSERT INTO users_refresh_tokens (user_id, token_hash, expires_at) values ($1, $2, $3)";
  const values = [user.id, hashToken, expiryDate];
  const result = await pool.query(query, values);
  if (!result) {
    throw new Error("Token not saved");
  }
};

export const getUserByIdService = async (userId) => {
  const query =
    'SELECT id, "firstName", "lastName", "email", "role" FROM users WHERE id = $1';
  const values = [userId];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const tokenLogoutService = async (refreshToken, userId) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");
  const result = await pool.query(
    "DELETE FROM users_refresh_tokens WHERE user_id = $1 AND is_revoked = false AND token_hash = $2 RETURNING *",
    [userId, hashedToken],
  );
  if (!result) {
    throw new Error("invalid refresh token or user Id");
  }
  return result.rows;
};

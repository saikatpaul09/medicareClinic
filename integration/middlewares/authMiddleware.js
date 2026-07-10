import jwt from "jsonwebtoken";
import crypto from "crypto";
import pool from "../config/db.js";

//Protected routes
export const authenticateJWT = async (req, res, next) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({
      error: "Session expired. Please log in again.",
    });
  }
  const hashedToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");
  // Verify the cookie still exists as a valid active session in PostgreSQL
  const tokenCheck = await pool.query(
    "SELECT * FROM users_refresh_tokens WHERE token_hash = $1 AND expires_at > NOW()",
    [hashedToken],
  );
  if (tokenCheck.rows.length === 0) {
    return res.status(401).json({
      error: "Invalid or expired refresh session.",
    });
  }
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication token missing" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token signature" });
    }
    // Attach user identifier and role to request object
    req.user = {
      id: decoded.userId,
      role: decoded.role,
    };
    next();
  });
};

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: "Access denied: No data found" });
    }
    // Check if user's role matches one of the permitted route roles
    const hasRole = allowedRoles.includes(req.user.role);
    if (!hasRole) {
      return res
        .status(403)
        .json({ message: "Access denied: Insufficient privileges" });
    }
    next();
  };
};

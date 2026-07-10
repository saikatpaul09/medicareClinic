import jwt from "jsonwebtoken";
import crypto from "crypto";

const generateToken = (user) => {
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_SECRET_EXPIRY,
    },
  );
  return token;
};

const generateRefreshToken = (user) => {
  const rawRefreshToken = crypto.randomBytes(40).toString("hex");
  const tokenHash = crypto
    .createHash("sha256")
    .update(rawRefreshToken)
    .digest("hex");

  return { rawRefreshToken, tokenHash };
};

export { generateToken, generateRefreshToken };

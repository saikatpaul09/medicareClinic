import jwt from "jsonwebtoken";

const generateToken = (user) => {
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_SECRET_EXPIRY,
  });
  return token;
};

const generateRefreshToken = (user) => {
  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_SECRET_EXPIRY,
    },
  );
  return refreshToken;
};

export { generateToken, generateRefreshToken };

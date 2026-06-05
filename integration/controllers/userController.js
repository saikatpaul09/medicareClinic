import asyncHandler from "../middlewares/asyncHandler.js";
import jwt from "jsonwebtoken";
import {
  authenticateUserService,
  createUserService,
  getUserByIdService,
} from "../models/userModel.js";
import { generateToken, generateRefreshToken } from "../utils/generateToken.js";

let refreshTokens = [];
const handleResponse = (res, status, message, data) => {
  res.status(status).json({
    status,
    message,
    data,
  });
};

export const registerUserController = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, role, phone } = req.body;
  try {
    const user = await createUserService(
      firstName,
      lastName,
      email,
      password,
      role,
      phone,
    );
    handleResponse(res, 201, "User registered successfully", {
      userId: user.id,
    });
  } catch (error) {
    handleResponse(res, 500, error.message);
  }
});

export const authenticateUserController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await authenticateUserService(email, password);
    if (user) {
      const token = generateToken(user);
      const refreshToken = generateRefreshToken(user);
      refreshTokens.push(refreshToken);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: process.env.JWT_REFRESH_SECRET_EXPIRY, // Convert to milliseconds
      });
      handleResponse(res, 200, "Authentication successful", {
        token,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      handleResponse(res, 401, "Invalid credentials");
    }
  } catch (error) {
    handleResponse(res, 401, error.message);
  }
});

export const refreshTokenController = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken || !refreshTokens.includes(refreshToken)) {
    return handleResponse(res, 403, "Forbidden");
  }
  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET,
    async (err, user) => {
      if (err) {
        return handleResponse(res, 403, "Forbidden");
      }
      const userData = await getUserByIdService(user.userId);
      const newAccessToken = generateToken(user);
      handleResponse(res, 200, "Token refreshed successfully", {
        token: newAccessToken,
        user: {
          id: userData.id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          role: userData.role,
        },
      });
    },
  );
});

export const logoutUserController = asyncHandler(async (req, res) => {
  try {
    res.clearCookie("refreshToken", { httpOnly: true });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    handleResponse(res, 500, error.message);
  }
});

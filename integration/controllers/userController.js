import asyncHandler from "../middlewares/asyncHandler.js";
import jwt from "jsonwebtoken";
import {
  authenticateUserService,
  createUserService,
  getUserByIdService,
  saveTokenUserService,
  tokenLogoutService,
  refreshTokenService,
} from "../models/userModel.js";
import { generateToken, generateRefreshToken } from "../utils/generateToken.js";

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
      const { rawRefreshToken, tokenHash } = generateRefreshToken();
      res.cookie("refreshToken", rawRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: process.env.JWT_REFRESH_SECRET_EXPIRY, // Convert to milliseconds
      });
      await saveTokenUserService(user, tokenHash);
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
  if (!refreshToken) {
    return handleResponse(res, 403, "Forbidden");
  }
  try {
    const result = await refreshTokenService(refreshToken);
    if (!result) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
      });
      handleResponse(
        res,
        400,
        "Bad request, session expired, please login again",
      );
    }
    if (result) {
      const newAccessToken = jwt.sign(
        { userId: result.user_id },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_SECRET_EXPIRY,
        },
      );
      const userData = await getUserByIdService(result.user_id);
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
    }
  } catch (error) {
    handleResponse(res, 401, error.message);
  }
});

export const logoutUserController = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  const { userId } = req.body;
  if (!userId || !refreshToken) {
    handleResponse(res, 400, "User Id or refresh token not provided");
  }
  try {
    const result = await tokenLogoutService(refreshToken, userId);
    res.clearCookie("refreshToken", {
      httpOnly: true,
    });
    if (result.length == 0) {
      handleResponse(res, 200, "Logged out successfully");
    }
  } catch (error) {
    handleResponse(res, 500, error.message);
  }
});

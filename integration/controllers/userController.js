import asyncHandler from "../middlewares/asyncHandler.js";
import jwt from "jsonwebtoken";
import {
  authenticateUserService,
  createUserService,
  saveTokenUserService,
  tokenLogoutService,
  refreshTokenService,
  getPatientDataService,
  updatePatientProfileDetails,
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
  const payload = req.body;
  const REQUIRED_FIELDS = [
    "firstName",
    "lastName",
    "email",
    "phone",
    "password",
  ];
  const ALLOWED_FIELDS = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "email",
    "phone",
    "role",
    "gender",
    "password",
  ];
  const hasAllKeys = REQUIRED_FIELDS.every((key) =>
    Object.hasOwn(payload, key),
  );
  if (!hasAllKeys) {
    handleResponse(res, 400, "Missing Fields");
  }
  const filteredUpdates = {};
  Object.keys(payload).forEach((key) => {
    if (ALLOWED_FIELDS.includes(key)) {
      filteredUpdates[key] = req.body[key];
    }
  });
  try {
    const user = await createUserService(payload, filteredUpdates);
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
        { userId: result.user_id, role: result.role },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_SECRET_EXPIRY,
        },
      );
      handleResponse(res, 200, "Token refreshed successfully", {
        token: newAccessToken,
        user: {
          id: result.user_id,
          firstName: result.firstName,
          lastName: result.lastName,
          email: result.email,
          role: result.role,
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
    if (result) {
      handleResponse(res, 200, "Logged out successfully");
    }
  } catch (error) {
    handleResponse(res, 500, error.message);
  }
});

export const fetchPatientDetailsController = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await getPatientDataService(userId);
    if (!result) {
      handleResponse(res, 400, "User details not able to fetch");
    }
    if (result) {
      handleResponse(res, 200, "User details fetched", {
        user: {
          firstName: result.firstName,
          lastName: result.lastName,
          email: result.email,
          role: result.role,
          gender: result.gender,
          phone: result.phone,
          age: result.age,
        },
      });
    }
  } catch (error) {
    handleResponse(res, 500, error.message);
  }
});

export const updatePatientDetailsController = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const updates = req.body;
  const ALLOWED_UPDATES = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "email",
    "phone",
  ];
  const filteredValues = {};
  Object.keys(updates).forEach((key) => {
    if (ALLOWED_UPDATES.includes(key)) {
      filteredValues[key] = req.body[key];
    }
  });
  try {
    const result = await updatePatientProfileDetails(userId, filteredValues);
    if (!result) {
      handleResponse(res, 400, "User update not done");
    }
    if (result) {
      handleResponse(res, 200, "User details updated", {
        user: {
          firstName: result.firstName,
          lastName: result.lastName,
          email: result.email,
          role: result.role,
          gender: result.gender,
          phone: result.phone,
          age: result.age,
        },
      });
    }
  } catch (error) {
    handleResponse(res, 500, error.message);
  }
});

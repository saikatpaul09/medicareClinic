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
  getFilteredDoctorsListService,
} from "../models/userModel.js";
import { generateToken, generateRefreshToken } from "../utils/generateToken.js";
import { handleResponse } from "../utils/helpers.js";

export const registerUserController = asyncHandler(async (req, res) => {
  const payload = req.body;
  const REQUIRED_FIELDS = ["firstName", "lastName", "email", "password"];
  const ALLOWED_FIELDS = [
    "firstName",
    "lastName",
    "date_of_birth",
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
    return;
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
    const secureCookie = process.env.COOKIE_SECURE === "true";
    const user = await authenticateUserService(email, password);
    if (user) {
      const token = generateToken(user);
      const { rawRefreshToken, tokenHash } = generateRefreshToken();
      res.cookie("refreshToken", rawRefreshToken, {
        httpOnly: true,
        secure: secureCookie,
        sameSite: secureCookie ? "none" : "lax",
        maxAge: Number(process.env.JWT_REFRESH_SECRET_EXPIRY),
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
          date_of_birth: result.date_of_birth,
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
    "date_of_birth",
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
          date_of_birth: result.date_of_birth,
        },
      });
    }
  } catch (error) {
    handleResponse(res, 500, error.message);
  }
});

export const fetchFilteredDoctorsController = asyncHandler(async (req, res) => {
  const {
    name,
    specialization,
    hospital_id,
    gender,
    consultation_fee,
    experience,
    nextCursor,
    limit,
  } = req.query || {};

  const filters = {
    name,
    specialization,
    hospital_id,
    gender,
    consultation_fee,
    experience,
  };

  try {
    const doctorsListObj = await getFilteredDoctorsListService({
      filters,
      nextCursor,
      limit,
    });
    if (!doctorsListObj || doctorsListObj.data.length === 0) {
      return handleResponse(res, 200, "doctor list fetched", {
        doctors: [],
        hasMore: false,
        nextCursor: null,
      });
    }
    if (doctorsListObj.data.length > 0) {
      return handleResponse(res, 200, "doctor list fetched", {
        doctors: doctorsListObj.data,
        hasMore: doctorsListObj.hasMore,
        nextCursor: doctorsListObj.nextCursor,
        totalCount: doctorsListObj.totalCount,
      });
    }
  } catch (error) {
    handleResponse(res, 500, error.message);
  }
});

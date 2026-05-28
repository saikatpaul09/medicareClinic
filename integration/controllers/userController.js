import asyncHandler from "../middlewares/asyncHandler.js";
import {
  authenticateUserService,
  createUserService,
} from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

const handleResponse = (res, status, message, data) => {
  res.status(status).json({
    status,
    message,
    data,
  });
};

export const registerUserController = asyncHandler(async (req, res) => {
  const { userName, email, password } = req.body;
  try {
    const user = await createUserService(userName, email, password);
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
    generateToken(res, user.id);
    handleResponse(res, 200, "User authenticated successfully", {
      userId: user.id,
    });
  } catch (error) {
    handleResponse(res, 401, error.message);
  }
});

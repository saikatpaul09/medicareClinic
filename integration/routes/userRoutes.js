import express from "express";
import {
  registerUserController,
  authenticateUserController,
  logoutUserController,
  refreshTokenController,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUserController);
router.post("/login", authenticateUserController);
router.post("/logout", logoutUserController);
router.post("/refresh-token", refreshTokenController);
export default router;

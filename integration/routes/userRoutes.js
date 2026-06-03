import express from "express";
import {
  registerUserController,
  authenticateUserController,
  logoutUserController,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUserController);
router.post("/login", authenticateUserController);
router.post("/logout", logoutUserController);
export default router;

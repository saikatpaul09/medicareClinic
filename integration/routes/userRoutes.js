import express from "express";
import {
  registerUserController,
  authenticateUserController,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUserController);
router.post("/login", authenticateUserController);

export default router;

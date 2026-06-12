import express from "express";
import {
  authenticateJWT,
  authorizeRoles,
} from "../middlewares/authMiddleware.js";
import {
  registerUserController,
  authenticateUserController,
  logoutUserController,
  refreshTokenController,
  fetchPatientDetailsController,
  updatePatientDetailsController,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUserController);
router.post("/login", authenticateUserController);
router.post("/logout", logoutUserController);
router.post("/refresh-token", refreshTokenController);
router.get(
  "/patient",
  authenticateJWT,
  authorizeRoles("PATIENT", "ADMIN", "DOCTOR"),
  fetchPatientDetailsController,
);
router.post(
  "/patient",
  authenticateJWT,
  authorizeRoles("PATIENT", "ADMIN"),
  updatePatientDetailsController,
);
router.post(
  "/patient",
  authenticateJWT,
  authorizeRoles("PATIENT", "ADMIN"),
  updatePatientDetailsController,
);

export default router;

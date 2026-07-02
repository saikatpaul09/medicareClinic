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
import { fetchAllDoctorsController } from "../controllers/adminController.js";
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

router.post(
  "/doctors",
  authenticateJWT,
  authorizeRoles("ADMIN"),
  fetchAllDoctorsController,
);

export default router;

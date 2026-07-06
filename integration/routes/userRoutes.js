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
import {
  createDoctorController,
  fetchAllDoctorsController,
  updateDoctorController,
  fetchAllPatientController,
  updateAdminPatientController,
  createAdminPatientController,
  deleteAdminPatientController,
  deleteDoctorController,
} from "../controllers/adminController.js";
import {
  createHospital,
  getAllHospitals,
} from "../controllers/hospitalControllers.js";
import { updateHospitalService } from "../models/hospitalModel.js";

const router = express.Router();

router.post("/register", registerUserController);
router.post("/login", authenticateUserController);
router.post("/logout", logoutUserController);
router.post("/refresh-token", refreshTokenController);
router.get(
  "/profile",
  authenticateJWT,
  authorizeRoles("PATIENT", "ADMIN"),
  fetchPatientDetailsController,
);
router.post(
  "/profile",
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

router.post(
  "/doctor",
  authenticateJWT,
  authorizeRoles("ADMIN"),
  createDoctorController,
);
router.put(
  "/doctor",
  authenticateJWT,
  authorizeRoles("ADMIN"),
  updateDoctorController,
);
router.put(
  "/doctor",
  authenticateJWT,
  authorizeRoles("ADMIN"),
  updateDoctorController,
);
router.delete(
  "/doctor",
  authenticateJWT,
  authorizeRoles("ADMIN"),
  deleteDoctorController,
);
router.post(
  "/patients",
  authenticateJWT,
  authorizeRoles("ADMIN"),
  fetchAllPatientController,
);
router.put(
  "/patient",
  authenticateJWT,
  authorizeRoles("ADMIN"),
  updateAdminPatientController,
);
router.post(
  "/patient",
  authenticateJWT,
  authorizeRoles("ADMIN"),
  createAdminPatientController,
);
router.delete(
  "/patient",
  authenticateJWT,
  authorizeRoles("ADMIN"),
  deleteAdminPatientController,
);
router.post(
  "/hospitals",
  authenticateJWT,
  authorizeRoles("ADMIN"),
  createHospital,
);

router.put(
  "/:hospitals",
  authenticateJWT,
  authorizeRoles("ADMIN"),
  updateHospitalService,
);

router.get("/hospitals", getAllHospitals);

export default router;

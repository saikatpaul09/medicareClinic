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
  fetchFilteredDoctorsController,
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
  getDashboardOverviewController,
  updateDoctorSchedulesController,
  getDoctorSchedulesController,
  fetchDoctorByIdController,
} from "../controllers/adminController.js";
import {
  updateHospitalController,
  deleteHospitalController,
  getAllHospitals,
  createHospitalController,
} from "../controllers/hospitalControllers.js";

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
router.post("/doctors", fetchAllDoctorsController);
router.post("/doctors", fetchAllDoctorsController);
router.post(
  "/doctors-list",
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
  "/hospital",
  authenticateJWT,
  authorizeRoles("ADMIN"),
  createHospitalController,
);

router.put(
  "/hospital",
  authenticateJWT,
  authorizeRoles("ADMIN"),
  updateHospitalController,
);

router.delete(
  "/hospital",
  authenticateJWT,
  authorizeRoles("ADMIN"),
  deleteHospitalController,
);

router.post("/hospitals", getAllHospitals);
router.get(
  "/overview",
  authenticateJWT,
  authorizeRoles("ADMIN"),
  getDashboardOverviewController,
);

router.get("/doctor-slots/:doctorId", getDoctorSchedulesController);
router.put(
  "/doctor-slots/:doctorId",
  authenticateJWT,
  authorizeRoles("ADMIN", "DOCTOR"),
  updateDoctorSchedulesController,
);
router.get("/doctor/:doctorId", fetchDoctorByIdController);
router.get("/doctors", fetchFilteredDoctorsController);
export default router;

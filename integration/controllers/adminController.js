import asyncHandler from "../middlewares/asyncHandler.js";
import {
  createAdminPatientService,
  createDoctorService,
  deleteAdminPatientService,
  deleteDoctorService,
  getAllDoctorsListService,
  getAllPatientListService,
  updateAdminPatientService,
  updateDoctorService,
} from "../models/adminModel.js";
import { handleResponse } from "../utils/helpers.js";
export const fetchAllDoctorsController = asyncHandler(async (req, res) => {
  const { filters, limit, nextCursor } = req.body || {};
  try {
    const doctorsListObj = await getAllDoctorsListService({
      filters,
      limit,
      nextCursor,
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

export const createDoctorController = asyncHandler(async (req, res) => {
  try {
    const result = await createDoctorService(req.body);
    return handleResponse(res, 201, "Doctor created successfully", result);
  } catch (error) {
    handleResponse(res, 500, error.message);
  }
});

export const updateDoctorController = asyncHandler(async (req, res) => {
  try {
    const result = await updateDoctorService(req.body);
    return handleResponse(res, 200, "Doctor updated successfully", result);
  } catch (error) {
    handleResponse(res, 500, error.message);
  }
});

export const deleteDoctorController = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return handleResponse(res, 400, "userId is required");
    }
    await deleteDoctorService(userId);
    return handleResponse(res, 200, "Doctor deleted successfully");
  } catch (error) {
    return handleResponse(res, 500, error.message);
  }
});

export const fetchAllPatientController = asyncHandler(async (req, res) => {
  const { filters, limit, nextCursor } = req.body || {};
  try {
    const patientListObj = await getAllPatientListService({
      filters,
      limit,
      nextCursor,
    });
    if (!patientListObj || patientListObj.data.length === 0) {
      return handleResponse(res, 200, "patient list fetched", {
        patients: [],
        hasMore: false,
        nextCursor: null,
      });
    }
    if (patientListObj.data.length > 0) {
      return handleResponse(res, 200, "patient list fetched", {
        patients: patientListObj.data,
        hasMore: patientListObj.hasMore,
        nextCursor: patientListObj.nextCursor,
        totalCount: patientListObj.totalCount,
      });
    }
  } catch (error) {
    handleResponse(res, 500, error.message);
  }
});

export const createAdminPatientController = asyncHandler(async (req, res) => {
  try {
    const patient = await createAdminPatientService(req.body);
    return handleResponse(res, 201, "Patient created successfully", patient);
  } catch (error) {
    return handleResponse(res, 500, error.message);
  }
});

export const updateAdminPatientController = asyncHandler(async (req, res) => {
  try {
    const patient = await updateAdminPatientService(req.body);
    return handleResponse(res, 200, "Patient updated successfully", patient);
  } catch (error) {
    return handleResponse(res, 500, error.message);
  }
});

export const deleteAdminPatientController = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.body;
    await deleteAdminPatientService(userId);
    return handleResponse(res, 200, "Patient deleted successfully");
  } catch (error) {
    return handleResponse(res, 500, error.message);
  }
});

import asyncHandler from "../middlewares/asyncHandler.js";
import {
  createHospitalService,
  updateHospitalService,
  getAllHospitalsService,
} from "../models/hospitalModel.js";
import { handleResponse } from "../utils/helpers.js";

export const createHospital = asyncHandler(async (req, res) => {
  const { name, address, contactNumber, state, pin } = req.body;
  const hospital = await createHospitalService({
    name,
    address,
    contactNumber,
    state,
    pin,
  });

  return handleResponse(res, 201, "Hospital created successfully", {
    hospital,
  });
});

export const updateHospital = asyncHandler(async (req, res) => {
  const { hospitalId } = req.params;

  const { name, address, contactNumber, state, pin } = req.body;

  const hospital = await updateHospitalService({
    hospitalId,
    name,
    address,
    contactNumber,
    state,
    pin,
  });

  if (!hospital) {
    return handleResponse(res, 404, "Hospital not found");
  }

  return handleResponse(res, 200, "Hospital updated successfully", {
    hospital,
  });
});

export const getAllHospitals = asyncHandler(async (req, res) => {
  const { search, state, limit = 10, nextCursor } = req.query;
  const result = await getAllHospitalsService({
    search,
    state,
    limit: Number(limit),
    nextCursor,
  });
  if (!result) {
    return handleResponse(res, 404, "Hospitals not found");
  }
  return handleResponse(res, 200, "Hospitals fetched successfully", result);
});

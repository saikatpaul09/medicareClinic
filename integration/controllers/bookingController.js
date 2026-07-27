// controllers/appointment.controller.js
import asyncHandler from "../middlewares/asyncHandler.js";
import { handleResponse } from "../utils/helpers.js";
import {
  confirmBookingService,
  getAppointmentByPatientIdDetailsService,
} from "../models/confirmBookingModel.js";

export const confirmBookingController = asyncHandler(async (req, res) => {
  const {
    paymentIntentId,
    doctorId,
    patientId,
    appointmentDatetime,
    amount,
    paymentMethod,
  } = req.body;
  const user = req.user;
  if (user.role === "PATIENT" && user.id !== patientId) {
    return handleResponse(res, 400, "Patient Id mismatch");
  }
  if (
    !paymentIntentId ||
    !doctorId ||
    !patientId ||
    !appointmentDatetime ||
    !amount
  ) {
    return handleResponse(res, 400, "Missing required fields");
  }

  const result = await confirmBookingService({
    paymentIntentId,
    doctorId,
    patientId,
    appointmentDatetime,
    amount,
    paymentMethod,
  });

  return handleResponse(res, 200, "Appointment booked successfully", {
    ...result,
  });
});

export const getAppointmentByPatientIdDetailsController = asyncHandler(
  async (req, res) => {
    const user = req.user;
    let userId;
    if (user.role === "PATIENT") {
      userId = user.id;
    } else {
      const { id } = req.params;
      userId = id;
    }
    if (user.role === "PATIENT" && user.id !== userId) {
      return handleResponse(res, 400, "Patient Id mismatch");
    }
    const appointments = await getAppointmentByPatientIdDetailsService(userId);

    if (!appointments) {
      return handleResponse(res, 404, "Appointment not found");
    }
    return handleResponse(
      res,
      200,
      "Appointment details fetched successfully",
      {
        appointments,
      },
    );
  },
);

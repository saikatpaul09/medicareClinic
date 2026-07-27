import asyncHandler from "../middlewares/asyncHandler.js";
import { createPaymentIntentService } from "../models/paymentModel.js";
import { handleResponse } from "../utils/helpers.js";

export const createPaymentIntentController = asyncHandler(async (req, res) => {
  const { doctorId, patientId, amount } = req.body;
  console.log(doctorId, patientId, amount, "---");
  const user = req.user;
  if (user.role === "PATIENT" && patientId !== user.id) {
    return handleResponse(res, 400, "Irrelevent patient id sent");
  }
  if (!doctorId || !patientId || !amount) {
    return handleResponse(res, 400, "Missing required fields");
  }
  const paymentIntentData = await createPaymentIntentService();
  return handleResponse(res, 200, "Payment intent created successfully", {
    ...paymentIntentData,
  });
});

import asyncHandler from "../middlewares/asyncHandler.js";
import { getAllDoctorsListService } from "../models/adminModel.js";
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

import asyncHandler from "../middlewares/asyncHandler.js";
import { generateReply } from "./aiService.js";

export const chatWithAssistant = asyncHandler(async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message) {
    return res.status(400).json({
      message: "Message is required",
    });
  }

  const response = await generateReply({
    message,
    history,
    user: req.user || null,
  });

  if (!response.success) {
    return res.status(500).json({
      message: response.error,
    });
  }

  return res.status(200).json({
    reply: response.reply,
    data: response.toolResults,
  });
});

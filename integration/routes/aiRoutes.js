import express from "express";
import { chatWithAssistant } from "../ai/aiController.js";

const router = express.Router();

router.post("/chat", chatWithAssistant);

export default router;

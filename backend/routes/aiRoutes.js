import express from "express";
import auth from "../middleware/auth.middleware.js";
import { generateAIInvoice } from "../controllers/aiController.js";
import { aiLimiter } from "../middleware/rateLimit.middleware.js";

const router = express.Router();

/**
 * @route   POST /api/ai/generate
 * @desc    Generate invoice using AI
 * @access  Protected (with rate limit)
 */
router.post("/generate", auth, aiLimiter, generateAIInvoice);

export default router;
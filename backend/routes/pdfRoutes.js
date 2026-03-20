import express from "express";
import auth from "../middleware/auth.middleware.js";
import { createPDF } from "../controllers/pdfController.js";

const router = express.Router();

/**
 * @route   POST /api/pdf/generate
 * @desc    Generate invoice PDF
 * @access  Protected
 */
router.post("/generate", auth, createPDF);

export default router;
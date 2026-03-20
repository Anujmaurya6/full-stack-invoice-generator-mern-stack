import express from "express";
import auth from "../middleware/auth.middleware.js";
import { getAnalytics } from "../controllers/analyticsController.js";

const router = express.Router();

/**
 * @route   GET /api/analytics
 * @desc    Get dashboard analytics
 * @access  Protected
 */
router.get("/", auth, getAnalytics);

export default router;
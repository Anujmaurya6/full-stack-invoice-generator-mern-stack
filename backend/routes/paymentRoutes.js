import express from "express";
import auth from "../middleware/auth.middleware.js";
import {
  createOrder,
  verifyPayment,
  webhookHandler
} from "../controllers/paymentController.js";
import User from "../models/User.js";
import Payment from "../models/Payment.js";

const router = express.Router();

router.post("/create-order", auth, createOrder);
router.post("/verify-payment", auth, verifyPayment);

// ✅ NEW: Get current plan status
router.get("/plan-status", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user).select('-password');
    
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Get latest payment
    const latestPayment = await Payment.findOne({ 
      userId: user._id, 
      status: "paid" 
    }).sort({ createdAt: -1 });

    res.json({
      plan: user.plan,
      planDetails: latestPayment ? {
        startDate: latestPayment.planStartDate,
        endDate: latestPayment.planEndDate,
        daysRemaining: latestPayment.planEndDate 
          ? Math.ceil((new Date(latestPayment.planEndDate) - new Date()) / (1000 * 60 * 60 * 24))
          : null
      } : null
    });

  } catch (err) {
    res.status(500).json({ msg: "Failed to get plan status" });
  }
});

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  webhookHandler
);

export default router;

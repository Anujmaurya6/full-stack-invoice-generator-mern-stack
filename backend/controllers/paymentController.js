import crypto from "crypto";
import Payment from "../models/Payment.js";
import User from "../models/User.js";
import { createRazorpayOrder } from "../services/razorpayService.js";

// 🔥 CREATE ORDER
export const createOrder = async (req, res) => {
  try {
    const { plan } = req.body;

    let amount = 200; // BASIC
    if (plan === "PRO") amount = 500;

    const order = await createRazorpayOrder(amount);

    await Payment.create({
      userId: req.user,
      razorpay_order_id: order.id,
      amount,
      plan,
      status: "created"
    });

    res.json(order);

  } catch (err) {
    console.log("CREATE ORDER ERROR:", err.message);
    res.status(500).json({ msg: "Order creation failed" });
  }
};

// 🔥 VERIFY PAYMENT (frontend)
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature
    } = req.body;

    // ✅ VERIFY SIGNATURE
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (razorpay_signature !== expectedSignature) {
      return res.status(400).json({ msg: "Invalid payment signature" });
    }

    const payment = await Payment.findOne({
      razorpay_order_id
    });

    if (!payment) {
      return res.status(404).json({ msg: "Payment not found" });
    }

    payment.razorpay_payment_id = razorpay_payment_id;
    payment.razorpay_signature = razorpay_signature;
    payment.status = "paid";
    await payment.save();

    // ✅ UPDATE USER PLAN
    await User.findByIdAndUpdate(payment.userId, {
      plan: payment.plan
    });

    res.json({ 
      msg: `✅ ${payment.plan} plan activated`,
      plan: payment.plan 
    });

  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: "Payment failed" });
  }
};

// 🔥 WEBHOOK (secure)
export const webhookHandler = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    const signature = req.headers["x-razorpay-signature"];

    // ✅ FIXED: Properly stringify the body
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (signature !== expectedSignature) {
      return res.status(400).json({ msg: "Invalid signature" });
    }

    const event = req.body;

    if (event.event === "payment.captured") {
      const paymentId = event.payload.payment.entity.id;
      const orderId = event.payload.payment.entity.order_id;

      const payment = await Payment.findOne({
        razorpay_order_id: orderId
      });

      if (!payment) {
        return res.json({ status: "ok" });
      }

      payment.status = "paid";
      payment.razorpay_payment_id = paymentId;
      await payment.save();

      await User.findByIdAndUpdate(payment.userId, {
        plan: payment.plan
      });
    }

    res.json({ status: "ok" });

  } catch (err) {
    console.log("Webhook error:", err.message);
    res.status(500).json({ msg: "Webhook failed" });
  }
};

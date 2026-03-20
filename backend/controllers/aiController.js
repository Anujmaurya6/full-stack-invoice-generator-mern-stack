import User from "../models/User.js";
import Invoice from "../models/Invoice.js";
import Usage from "../models/Usage.js";
import { generateInvoiceAI } from "../services/geminiService.js";

export const generateAIInvoice = async (req, res) => {
  try {
    // ✅ FIXED: Use req.user directly (it's already the ID from middleware)
    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // ❌ FREE BLOCK
    if (user.plan === "FREE") {
      return res.status(403).json({ msg: "Upgrade to use AI" });
    }

    // 🔒 BASIC LIMIT (5/day)
    if (user.plan === "BASIC") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const count = await Usage.countDocuments({
        userId: user._id,
        action: "AI_GENERATE",
        createdAt: { $gte: today }
      });

      if (count >= 5) {
        return res.status(403).json({ 
          msg: "Daily limit reached (5/day)",
          remaining: 0 
        });
      }
    }

    const { prompt } = req.body;

    if (!prompt || prompt.trim().length === 0) {
      return res.status(400).json({ msg: "Prompt is required" });
    }

    // 🔥 PASS PLAN TO AI
    let aiData = await generateInvoiceAI(prompt, user.plan);

    if (!aiData || typeof aiData !== "object") {
      return res.status(400).json({ msg: "Invalid AI response" });
    }

    // ✅ DEFAULT SAFE VALUES
    const amount = aiData.amount || 0;

    let gst = 0;
    let finalAmount = amount;
    let items = aiData.items?.length
      ? aiData.items.map(item => ({
          ...item,
          amount: (item.quantity && item.rate) ? (item.quantity * item.rate) : (item.quantity * (item.price || 0))
        }))
      : [{ description: "Service", quantity: 1, rate: amount, amount: amount }];

    let theme = "black";
    let layout = "simple";

    // ⚡ PLAN BASED LOGIC
    if (user.plan === "PRO") {
      gst = amount * 0.18;
      finalAmount = amount + gst;

      theme = "color";
      layout = "modern";
    }

    // 🔥 CREATE INVOICE
    const invoice = await Invoice.create({
      userId: user._id,
      clientName: aiData.clientName || "Client",
      items,
      amount,
      gst,
      finalAmount,
      status: aiData.status || "Paid",
      mode: "AI",
      theme,
      layout
    });

    // 🔥 TRACK USAGE
    await Usage.create({
      userId: user._id,
      action: "AI_GENERATE",
      invoiceId: invoice._id
    });

    // Calculate remaining prompts for BASIC
    let remaining = null;
    if (user.plan === "BASIC") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayCount = await Usage.countDocuments({
        userId: user._id,
        action: "AI_GENERATE",
        createdAt: { $gte: today }
      });
      remaining = 5 - todayCount;
    }

    // 🔥 RETURN WITH USER ASSETS
    res.json({
      message: "AI Invoice Generated",
      invoice,
      assets: {
        logo: user.logo,
        signature: user.signature
      },
      remaining: remaining
    });

  } catch (err) {
    console.log("AI ERROR:", err.message);
    res.status(500).json({ msg: "AI failed" });
  }
};

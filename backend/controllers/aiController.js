import User from "../models/User.js";
import Invoice from "../models/Invoice.js";
import Usage from "../models/Usage.js";
import { generateInvoiceAI } from "../services/geminiService.js";

export const generateAIInvoice = async (req, res) => {
  try {
    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // ❌ FREE BLOCK
    if (user.plan === "FREE") {
      return res.status(403).json({ msg: "Upgrade to use AI Assistant" });
    }

    const { prompt } = req.body;

    if (!prompt || prompt.trim().length === 0) {
      return res.status(400).json({ 
        status: "error",
        message: "Prompt is required",
        missing_fields: ["prompt"]
      });
    }

    // 🔥 GENERATE VIA SERVICE
    let aiResponse = await generateInvoiceAI(prompt, user.plan);

    if (!aiResponse || typeof aiResponse !== "object") {
      throw new Error("Invalid AI response");
    }

    // 🔒 IF NEED MORE INFO
    if (aiResponse.status === "need_more_info") {
      return res.json(aiResponse);
    }

    // ✅ SUCCESS PATH - CREATE IN DB
    if (aiResponse.status === "success") {
      const { client, items, subtotal, gst, total } = aiResponse.invoice;

      const invoice = await Invoice.create({
        userId: user._id,
        clientName: client || "Client",
        items: items.map(i => ({ 
          description: i.name, 
          quantity: i.qty, 
          rate: i.price,
          amount: i.price * i.qty
        })),
        amount: subtotal,
        gst: gst,
        finalAmount: total,
        status: "Paid", // Default as per prompt example
        mode: "AI",
        theme: user.plan === "PRO" ? "color" : "black",
        layout: user.plan === "PRO" ? "modern" : "simple"
      });

      // 🔥 TRACK USAGE
      await Usage.create({
        userId: user._id,
        action: "AI_GENERATE",
        invoiceId: invoice._id
      });

      return res.json({
        ...aiResponse,
        invoiceId: invoice._id,
        assets: {
          logo: user.logo,
          signature: user.signature
        }
      });
    }

    res.status(400).json(aiResponse);

  } catch (err) {
    console.log("AI ASSISTANT ERROR:", err.message);
    res.status(500).json({ 
      status: "error",
      message: "AI Assistant failed to process request",
      error: err.message 
    });
  }
};

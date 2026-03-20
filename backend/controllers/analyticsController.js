import Usage from "../models/Usage.js";
import Invoice from "../models/Invoice.js";

// 📊 GET DASHBOARD ANALYTICS
export const getAnalytics = async (req, res) => {
  try {
    const userId = req.user;

    // 🔥 TOTAL INVOICES
    const totalInvoices = await Invoice.countDocuments({ userId });

    // 🤖 AI INVOICES
    const aiInvoices = await Invoice.countDocuments({
      userId,
      mode: "AI"
    });

    // ✍️ MANUAL INVOICES
    const manualInvoices = await Invoice.countDocuments({
      userId,
      mode: "MANUAL"
    });

    // 💰 TOTAL REVENUE
    const invoices = await Invoice.find({ userId });

    const totalRevenue = invoices.reduce(
      (sum, inv) => sum + (inv.finalAmount || inv.amount || 0),
      0
    );

    // 📅 LAST INVOICE
    const lastInvoice = await Invoice.findOne({ userId })
      .sort({ createdAt: -1 });

    // 🔥 TODAY AI USAGE
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayAIUsage = await Usage.countDocuments({
      userId,
      action: "AI_GENERATE",
      createdAt: { $gte: today }
    });

    // 📈 RESPONSE
    res.json({
      totalInvoices,
      aiInvoices,
      manualInvoices,
      totalRevenue,
      todayAIUsage,
      lastInvoiceDate: lastInvoice?.createdAt || null
    });

  } catch (err) {
    console.log("ANALYTICS ERROR:", err.message);
    res.status(500).json({ msg: "Analytics failed" });
  }
};
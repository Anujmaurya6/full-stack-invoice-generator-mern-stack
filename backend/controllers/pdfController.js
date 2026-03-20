import fs from "fs";
import path from "path";
import User from "../models/User.js";
import Invoice from "../models/Invoice.js";
import { generatePDF } from "../services/pdfService.js";

export const createPDF = async (req, res) => {
  try {
    const user = await User.findById(req.user);

    const invoice = await Invoice.findOne({
      _id: req.params.id || req.body.invoiceId,
      userId: req.user
    });

    if (!invoice) {
      return res.status(404).json({ msg: "Invoice not found" });
    }

    const uploadDir = path.join("uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    const filePath = await generatePDF(invoice, user);

    res.download(filePath);

  } catch (err) {
    console.log("PDF ERROR:", err.message);
    res.status(500).json({ msg: "PDF failed" });
  }
};
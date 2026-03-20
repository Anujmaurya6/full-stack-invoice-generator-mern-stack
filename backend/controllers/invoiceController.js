import Invoice from "../models/Invoice.js";
import Usage from "../models/Usage.js";

// ➕ CREATE INVOICE (MANUAL)
export const createInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.create({
      ...req.body,
      userId: req.user,
      mode: "MANUAL"
    });

    // track usage
    await Usage.create({
      userId: req.user,
      action: "MANUAL_CREATE",
      invoiceId: invoice._id
    });

    res.json(invoice);

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 📥 GET ALL INVOICES
export const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ userId: req.user })
      .sort({ createdAt: -1 });

    res.json(invoices);

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✏️ UPDATE INVOICE
export const updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      userId: req.user
    });

    if (!invoice) {
      return res.status(404).json({ msg: "Invoice not found" });
    }

    Object.assign(invoice, req.body);
    await invoice.save();

    res.json(invoice);

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ❌ DELETE INVOICE
export const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndDelete({
      _id: req.params.id,
      userId: req.user
    });

    if (!invoice) {
      return res.status(404).json({ msg: "Invoice not found" });
    }

    res.json({ msg: "Invoice deleted successfully" });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
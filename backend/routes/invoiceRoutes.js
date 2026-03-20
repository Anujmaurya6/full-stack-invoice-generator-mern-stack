import express from "express";
import auth from "../middleware/auth.middleware.js";
import {
  createInvoice,
  getInvoices,
  updateInvoice,
  deleteInvoice
} from "../controllers/invoiceController.js";

const router = express.Router();

/**
 * @route   POST /api/invoices
 * @desc    Create invoice (manual)
 * @access  Protected
 */
router.post("/", auth, createInvoice);

/**
 * @route   GET /api/invoices
 * @desc    Get all invoices of logged-in user
 * @access  Protected
 */
router.get("/", auth, getInvoices);

/**
 * @route   PUT /api/invoices/:id
 * @desc    Update invoice
 * @access  Protected (owner only)
 */
router.put("/:id", auth, updateInvoice);

/**
 * @route   DELETE /api/invoices/:id
 * @desc    Delete invoice
 * @access  Protected (owner only)
 */
router.delete("/:id", auth, deleteInvoice);

export default router;
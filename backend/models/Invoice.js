import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    invoiceNumber: { type: String },
    issueDate: { type: Date },
    dueDate: { type: Date },

    // Business Info
    businessName: { type: String },
    businessEmail: { type: String },
    address: { type: String },
    phone: { type: String },
    gst: { type: String },

    // Client Info
    clientName: { type: String, required: true, trim: true },
    clientEmail: { type: String },
    clientPhone: { type: String },
    clientAddress: { type: String },

    // Items
    items: [
      {
        description: { type: String, required: true },
        quantity: { type: Number, default: 1 },
        rate: { type: Number, default: 0 },
        amount: { type: Number, default: 0 }
      }
    ],

    // Totals
    subtotal: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, default: 0 },

    // Legacy totals for backward compatibility
    amount: { type: Number, default: 0 },
    finalAmount: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["Draft", "Paid", "Unpaid"],
      default: "Draft"
    },

    mode: {
      type: String,
      enum: ["AI", "MANUAL"],
      required: true
    },

    notes: { type: String },
    terms: { type: String },
    logo: { type: String },
    signature: { type: String },

    theme: { type: String, default: "black" },
    layout: { type: String, default: "simple" }
  },
  { timestamps: true }
);

export default mongoose.model("Invoice", invoiceSchema);
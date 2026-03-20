import mongoose from "mongoose";

const usageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    action: {
      type: String,
      enum: ["AI_GENERATE", "MANUAL_CREATE"]
    },

    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Usage", usageSchema);
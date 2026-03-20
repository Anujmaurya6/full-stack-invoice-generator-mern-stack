import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    razorpay_order_id: String,
    razorpay_payment_id: String,
    razorpay_signature: String, // ✅ ADDED

    amount: Number,

    plan: {
      type: String,
      enum: ["BASIC", "PRO"]
    },

    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created"
    },

    // ✅ ADDED: Plan expiry tracking
    planStartDate: {
      type: Date
    },

    planEndDate: {
      type: Date
    }
  },
  { timestamps: true }
);

// ✅ MIDDLEWARE: Auto-set plan dates on payment success
paymentSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'paid' && !this.planStartDate) {
    this.planStartDate = new Date();
    
    // Set expiry to 30 days from now
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);
    this.planEndDate = endDate;
  }
  next();
});

export default mongoose.model("Payment", paymentSchema);

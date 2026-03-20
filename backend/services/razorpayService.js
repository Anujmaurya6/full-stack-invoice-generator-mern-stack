import Razorpay from "razorpay";

export const createRazorpayOrder = async (amount) => {
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });

  return await razorpay.orders.create({
    amount: amount * 100,
    currency: "INR"
  });
};
import { createOrder, verifyPayment } from "../../services/paymentService";

export default function Pricing() {

  const handlePayment = async () => {
    const { data } = await createOrder();

    const options = {
      key: "YOUR_RAZORPAY_KEY",
      amount: data.amount,
      currency: "INR",
      order_id: data.id,

      handler: async function (response) {
        await verifyPayment(response);
        alert("Payment Success 🚀 AI Unlocked!");
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">

      <div className="bg-white p-10 rounded-2xl shadow text-center">

        <h2 className="text-2xl font-bold mb-4">Upgrade to Pro</h2>

        <p className="text-gray-500 mb-6">
          Unlock AI Invoice Generation
        </p>

        <button
          onClick={handlePayment}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl"
        >
          Pay ₹499
        </button>

      </div>

    </div>
  );
}

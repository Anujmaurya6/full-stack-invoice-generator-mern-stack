import { Check } from "lucide-react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

export default function Pricing() {

  const navigate = useNavigate()

  const [billing, setBilling] = useState("monthly")
  const [loadingPlan, setLoadingPlan] = useState(null)

  const handlePayment = async (planType) => {

    try {

      const token = localStorage.getItem("token")

      if (!token) {
        alert("Please login first")
        navigate("/login")
        return
      }

      setLoadingPlan(planType)

      const { data: order } = await API.post(
        "/payment/create-order",
        { plan: planType }
      )

      const options = {

        key: "rzp_test_SI0lsWNFQzxE6A",
        amount: order.amount,
        currency: "INR",
        order_id: order.id,

        name: "InvoiceAI",
        description: `${planType} Plan Subscription`,

        // 🔥 PAYMENT SUCCESS HANDLER
        handler: async function (response) {

          const res = await API.post(
            "/payment/verify-payment",
            response
          )

          // 🔥 UPDATE USER PLAN IN LOCAL STORAGE
          const storedUser = JSON.parse(localStorage.getItem("user")) || {}

          const updatedUser = {
            ...storedUser,
            plan: res.data.plan
          }

          localStorage.setItem("user", JSON.stringify(updatedUser))

          alert(`🔥 ${res.data.plan} Plan Activated`)

          window.location.reload()

        }

      }

      const rzp = new window.Razorpay(options)
      rzp.open()

    } catch (err) {

      console.log(err)
      alert("Payment failed")

    } finally {

      setLoadingPlan(null)

    }

  }

  const plans = [

    {
      name: "Free",
      price: "₹0",
      desc: "Starter plan",
      features: [
        "Manual invoices",
        "Basic dashboard",
        "Community support"
      ],
      button: "Get Started",
      action: () => navigate("/signup")
    },

    {
      name: "Basic",
      price: billing === "monthly" ? "₹199" : "₹1,999",
      plan: "BASIC",
      desc: "Simple AI (Limited)",
      features: [
        "5 AI invoices/day",
        "Basic invoice design",
        "Black & White PDF"
      ]
    },

    {
      name: "Pro",
      price: billing === "monthly" ? "₹499" : "₹4,999",
      plan: "PRO",
      highlight: true,
      desc: "Advanced AI (Full Power)",
      features: [
        "Unlimited AI invoices",
        "GST auto calculation",
        "Logo + Signature support",
        "Color invoice + premium PDF",
        "Priority support"
      ]
    }

  ]

  return (

    <section
      id="pricing"
      className="py-28 px-6 bg-gradient-to-b from-white to-indigo-50"
    >

      <div className="max-w-6xl mx-auto text-center">

        <h2 className="text-4xl font-bold mb-4">
          Choose Your Power
        </h2>

        <p className="text-gray-600 mb-10">
          Start simple… rise powerful ⚡
        </p>

        {/* TOGGLE */}

        <div className="flex justify-center mb-16">

          <div className="bg-gray-100 p-1 rounded-xl flex">

            <button
              onClick={() => setBilling("monthly")}
              className={`px-6 py-2 rounded-lg text-sm ${
                billing === "monthly"
                  ? "bg-white shadow"
                  : "text-gray-500"
              }`}
            >
              Monthly
            </button>

            <button
              onClick={() => setBilling("yearly")}
              className={`px-6 py-2 rounded-lg text-sm ${
                billing === "yearly"
                  ? "bg-white shadow"
                  : "text-gray-500"
              }`}
            >
              Yearly
            </button>

          </div>

        </div>

        {/* PRICING CARDS */}

        <div className="grid md:grid-cols-3 gap-10">

          {plans.map((plan, i) => (

            <div
              key={i}
              className={`relative rounded-3xl p-10 border shadow-xl transition duration-300 hover:-translate-y-4 hover:shadow-2xl ${
                plan.highlight
                  ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white scale-105 animate-pulse"
                  : "bg-white"
              }`}
            >

              {plan.highlight && (

                <div className="absolute -top-4 right-6 bg-white text-indigo-600 text-xs px-4 py-1 rounded-full font-semibold shadow">
                  MOST POPULAR
                </div>

              )}

              <h3 className="text-2xl font-semibold mb-2">
                {plan.name}
              </h3>

              <p
                className={`mb-6 ${
                  plan.highlight
                    ? "text-white/80"
                    : "text-gray-500"
                }`}
              >
                {plan.desc}
              </p>

              <p className="text-4xl font-bold mb-8">
                {plan.price}
              </p>

              <ul className="space-y-4 mb-10 text-sm">

                {plan.features.map((f, index) => (

                  <li
                    key={index}
                    className="flex items-center gap-3"
                  >

                    <div
                      className={`p-1 rounded-full ${
                        plan.highlight
                          ? "bg-white text-indigo-600"
                          : "bg-indigo-100 text-indigo-600"
                      }`}
                    >
                      <Check size={16} />
                    </div>

                    <span
                      className={
                        plan.highlight
                          ? "text-white"
                          : "text-gray-700"
                      }
                    >
                      {f}
                    </span>

                  </li>

                ))}

              </ul>

              {plan.name === "Free" ? (

                <button
                  onClick={plan.action}
                  className="w-full py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  {plan.button}
                </button>

              ) : (

                <button
                  onClick={() => handlePayment(plan.plan)}
                  disabled={loadingPlan === plan.plan}
                  className={`w-full py-3 rounded-xl font-semibold transition ${
                    plan.highlight
                      ? "bg-white text-indigo-600 hover:scale-105"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >

                  {loadingPlan === plan.plan
                    ? "Processing..."
                    : `Buy ${plan.name}`}

                </button>

              )}

            </div>

          ))}

        </div>

      </div>

    </section>

  )

}
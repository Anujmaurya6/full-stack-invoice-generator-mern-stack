import { useNavigate } from "react-router-dom"
import { Sparkles, ShieldCheck, Zap } from "lucide-react"

export default function CTA() {
  const navigate = useNavigate()

  return (
    <section className="relative py-32 px-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">

      <div className="max-w-4xl mx-auto text-center">

        <h2 className="text-5xl font-bold mb-6">
          Ready to Automate Your Invoices?
        </h2>

        <p className="text-lg opacity-90 mb-10">
          Join thousands of professionals saving hours every week using AI-powered billing.
        </p>

        <button
          onClick={() => navigate("/signup")}
          className="bg-white text-indigo-600 px-10 py-4 rounded-xl font-semibold shadow-lg hover:scale-105 transition"
        >
          Get Started Free →
        </button>

        <p className="mt-6 text-sm opacity-80">
          No credit card required • Setup in 30 seconds
        </p>

        <div className="flex justify-center gap-10 mt-12 text-sm">
          <div className="flex items-center gap-2"><Zap size={16}/> Lightning Fast</div>
          <div className="flex items-center gap-2"><ShieldCheck size={16}/> Secure Cloud</div>
          <div className="flex items-center gap-2"><Sparkles size={16}/> AI Accuracy</div>
        </div>

      </div>
    </section>
  )
}
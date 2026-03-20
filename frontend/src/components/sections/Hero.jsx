import { useNavigate } from "react-router-dom"

export default function Hero() {
  const navigate = useNavigate()

  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative pt-32 pb-24 px-6 bg-gradient-to-br from-white via-blue-50 to-indigo-100 overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-300 opacity-20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-300 opacity-20 blur-3xl rounded-full"></div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">

        {/* LEFT */}
        <div>
          <span className="inline-block mb-6 px-4 py-1 bg-white/80 backdrop-blur border shadow-sm rounded-full text-sm text-indigo-600 font-medium">
            AI-Powered Invoicing Platform
          </span>

          <h1 className="text-6xl font-extrabold leading-tight text-gray-900">
            Professional <br/>
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Invoices
            </span><br/>
            in Seconds
          </h1>

          <p className="mt-6 text-gray-600 text-lg max-w-xl">
            Transform conversations into professional invoices with AI.
            <span className="font-semibold text-gray-900"> Paste any text</span> and watch AI extract items,
            calculate totals, and generate ready-to-send invoices instantly.
          </p>

          {/* BUTTONS */}
          <div className="mt-10 flex gap-6">
            <button
              onClick={() => navigate("/login")}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl shadow-lg hover:scale-105 transition"
            >
              Start Creating Free →
            </button>

            <button
              onClick={scrollToFeatures}
              className="bg-white px-8 py-3 rounded-xl shadow border hover:bg-indigo-50 transition"
            >
              Explore Features ↓
            </button>
          </div>

          {/* MINI FEATURES */}
          <div className="flex gap-12 mt-14 text-sm">
            {[
              { title: "AI-Powered", desc: "Smart text parsing" },
              { title: "Lightning Fast", desc: "Generate in seconds" },
              { title: "Professional", desc: "Branded templates" }
            ].map((f,i)=>(
              <div key={i}>
                <p className="font-semibold">{f.title}</p>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
  </div>
</div>

{/* RIGHT SIDE INVOICE CARD */}
<div className="relative group">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border w-full transform transition duration-500 group-hover:-translate-y-3 group-hover:rotate-1 hover:shadow-indigo-300/50">

            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-600 text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold group-hover:scale-110 transition">
                  AI
                </div>
                <div>
                  <h3 className="font-semibold">Acme Corporation</h3>
                  <p className="text-sm text-gray-500">GST: 27AAAPL1234C1ZV</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">INVOICE</p>
                <p className="font-semibold"># INV-1024</p>
                <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs">Paid</span>
              </div>
            </div>

            <div className="space-y-4 text-sm">
              {[
                ["Website Design & Development", "₹15,000"],
                ["Consultation (2 hours)", "₹3,000"],
                ["Premium Hosting Setup", "₹2,500"]
              ].map((item, i) => (
                <div key={i} className="flex justify-between hover:text-indigo-600 transition cursor-pointer">
                  <span>{item[0]}</span>
                  <span>{item[1]}</span>
                </div>
              ))}
            </div>

            <div className="border-t mt-6 pt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>₹20,500</span></div>
              <div className="flex justify-between"><span>GST (18%)</span><span>₹3,240</span></div>
              <div className="flex justify-between font-bold text-lg text-indigo-600">
                <span>Total Amount</span><span>₹23,740</span>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button className="flex-1 border rounded-lg py-2 hover:bg-gray-50 transition">Preview</button>
              <button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg py-2 hover:scale-105 transition">
                Send Invoice
              </button>
            </div>

            <div className="absolute -bottom-6 left-10 bg-white shadow-lg border rounded-xl p-4 text-sm animate-bounce">
              <p className="text-xs text-gray-500">AI parsed from:</p>
              <p className="font-medium">"Invoice for web design — ₹15,000…"</p>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}

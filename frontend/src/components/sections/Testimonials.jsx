import { Star } from "lucide-react"

export default function Testimonials() {
  const users = [
    {
      name: "Aarav Mehta",
      role: "Startup Founder",
      text: "InvoiceAI saved us 10+ hours every week. AI extraction is insanely accurate.",
    },
    {
      name: "Priya Sharma",
      role: "Freelancer",
      text: "Clients love the professional invoice look. Payment process became smoother.",
    },
    {
      name: "Rohit Verma",
      role: "Agency Owner",
      text: "The automation and reminders feature improved our cash flow drastically.",
    }
  ]

  return (
    <section className="py-28 px-6 bg-gradient-to-b from-white to-indigo-50">
      <div className="max-w-6xl mx-auto text-center">

        <h2 className="text-4xl font-bold mb-4">What Users Say</h2>
        <p className="text-gray-600 mb-16">
          Businesses are saving time and getting paid faster with InvoiceAI.
        </p>

        <div className="grid md:grid-cols-3 gap-10">
          {users.map((u, i) => (
            <div
              key={i}
              className="group bg-white/70 backdrop-blur border p-8 rounded-3xl shadow-lg hover:shadow-indigo-200 hover:-translate-y-3 transition"
            >
              {/* Stars */}
              <div className="flex justify-center gap-1 text-yellow-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-700 italic mb-6">
                “{u.text}”
              </p>

              {/* Avatar */}
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold">
                  {u.name[0]}
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm">{u.name}</p>
                  <p className="text-xs text-gray-500">{u.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

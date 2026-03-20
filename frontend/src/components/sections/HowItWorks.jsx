import { ClipboardPaste, BrainCircuit, Send } from "lucide-react"

export default function HowItWorks() {
  const steps = [
    {
      icon: ClipboardPaste,
      title: "Paste Your Details",
      desc: "Add service details or chat conversation."
    },
    {
      icon: BrainCircuit,
      title: "AI Understands",
      desc: "Extracts items, pricing and tax automatically."
    },
    {
      icon: Send,
      title: "Send Invoice",
      desc: "Preview, download or send instantly."
    }
  ]

  return (
    <section className="py-28 px-6 bg-gradient-to-b from-white to-indigo-50">
      <div className="max-w-6xl mx-auto text-center">

        <h2 className="text-4xl font-bold mb-4">How It Works</h2>
        <p className="text-gray-600 mb-16">AI makes invoicing effortless</p>

        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step, i) => (
            <div
              key={i}
              className="group bg-white p-10 rounded-2xl shadow-md border hover:-translate-y-3 hover:shadow-xl transition"
            >
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl group-hover:scale-110 transition">
                <step.icon size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-gray-600 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

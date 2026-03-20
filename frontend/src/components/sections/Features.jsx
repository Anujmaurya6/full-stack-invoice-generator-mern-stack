import { FileText, Mail, FileDown } from "lucide-react"

export default function Features() {

  const scrollToPricing = () => {
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })
  }

  const features = [
    {
      icon: FileText,
      title: "AI Invoice Parsing",
      desc: "Paste freeform text and let AI extract line items, totals and taxes."
    },
    {
      icon: Mail,
      title: "Smart Email Reminders",
      desc: "Generate professional reminders with one click."
    },
    {
      icon: FileDown,
      title: "Professional PDF Export",
      desc: "Generate branded PDF invoices with reliable delivery."
    }
  ]

  return (
    <section id="features" className="py-28 px-6 bg-white">
      <div className="max-w-6xl mx-auto text-center">

        <span className="inline-block px-4 py-1 text-sm rounded-full bg-blue-100 text-blue-600 font-medium mb-6">
          Powerful Features
        </span>

        <h2 className="text-5xl font-bold mb-6">
          Built for <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
            Speed & Clarity
          </span>
        </h2>

        <p className="text-gray-600 max-w-2xl mx-auto mb-16">
          A minimal, intelligent interface focused on what truly matters.
        </p>

        <div className="grid md:grid-cols-3 gap-10">
          {features.map((f,i)=>(
            <div key={i} className="text-left p-8 rounded-2xl shadow-sm border hover:-translate-y-2 hover:shadow-lg transition">
              <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-xl mb-6">
                <f.icon size={22}/>
              </div>

              <h3 className="font-semibold text-lg mb-3">{f.title}</h3>
              <p className="text-gray-600 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>

        <button
          onClick={scrollToPricing}
          className="mt-16 bg-gradient-to-r from-blue-600 to-green-500 text-white px-8 py-3 rounded-xl shadow-lg hover:scale-105 transition"
        >
          Explore All Features →
        </button>

      </div>
    </section>
  )
}
import { useState } from "react"
import { Link } from "react-router-dom"
import { Menu, X } from "lucide-react"

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-gray-200 shadow-sm">
      
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

        {/* LOGO */}
        <Link
          to="/"
          className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
        >
          InvoiceAI
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex gap-10 text-gray-700 font-medium">
          <a href="#features" className="hover:text-indigo-600 transition">
            Features
          </a>
          <a href="#pricing" className="hover:text-indigo-600 transition">
            Pricing
          </a>
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden md:flex items-center gap-4">

          <Link
            to="/login"
            className="text-gray-700 font-medium hover:text-indigo-600 transition"
          >
            Sign in
          </Link>

          <Link
            to="/signup"
            className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg shadow-lg hover:scale-105 transition overflow-hidden group"
          >
            <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition"></span>
            <span className="relative z-10">Get Started →</span>
          </Link>

        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-gray-700"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>

      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden px-6 pb-6 bg-white/90 backdrop-blur border-t border-gray-200">
          
          <div className="flex flex-col gap-4 mt-4 text-gray-700 font-medium">
            <a href="#features" onClick={() => setOpen(false)}>
              Features
            </a>
            <a href="#pricing" onClick={() => setOpen(false)}>
              Pricing
            </a>

            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="hover:text-indigo-600"
            >
              Sign in
            </Link>

            <Link
              to="/signup"
              onClick={() => setOpen(false)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-lg text-center"
            >
              Get Started →
            </Link>
          </div>

        </div>
      )}
    </nav>
  )
}

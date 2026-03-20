import { useEffect, useState } from "react"
import { getInvoices } from "../../services/api"
import { useNavigate } from "react-router-dom"
import { FileText, IndianRupee, Clock, Plus } from "lucide-react"

export default function DashboardHome() {
  const [invoices, setInvoices] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const data = await getInvoices()
    setInvoices(data)
  }

  const total = invoices.length
  const paid = invoices.filter(i => i.status === "Paid")
  const unpaid = invoices.filter(i => i.status === "Unpaid")

  const totalPaidAmount = paid.reduce((sum, i) => sum + i.amount, 0)
  const totalUnpaidAmount = unpaid.reduce((sum, i) => sum + i.amount, 0)

  return (
    <div className="space-y-8">

      {/* 🔥 TOP BAR */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Dashboard Overview
          </h1>
          <p className="text-gray-500 text-sm">
            Track your invoicing performance
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard/create-invoice")}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-lg shadow hover:scale-105 transition"
        >
          <Plus size={18} /> Create
        </button>
      </div>

      {/* 🔥 STATS */}
      <div className="grid md:grid-cols-3 gap-6">

        <StatCard icon={<FileText />} title="TOTAL INVOICES" value={total} color="purple" />
        <StatCard icon={<IndianRupee />} title="TOTAL PAID" value={`₹${totalPaidAmount}`} color="green" />
        <StatCard icon={<Clock />} title="TOTAL UNPAID" value={`₹${totalUnpaidAmount}`} color="orange" />

      </div>

      {/* 🔥 MAIN GRID */}
      <div className="grid md:grid-cols-3 gap-6">

        {/* 🔥 LEFT SIDE */}
        <div className="space-y-6">

          {/* QUICK STATS */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-2xl shadow space-y-3">

            <h3 className="font-semibold text-lg">Quick Stats</h3>

            <div className="flex justify-between text-sm">
              <span>Paid Rate</span>
              <span>
                {total === 0 ? 0 : ((paid.length / total) * 100).toFixed(1)} %
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span>Avg. Invoice</span>
              <span>
                ₹{total === 0 ? 0 : Math.round((totalPaidAmount + totalUnpaidAmount) / total)}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span>Collection Eff.</span>
              <span>
                {total === 0 ? 0 : ((paid.length / total) * 100).toFixed(1)} %
              </span>
            </div>

          </div>

          {/* QUICK ACTIONS */}
          <div className="bg-white p-6 rounded-2xl shadow border space-y-4">

            <h3 className="font-semibold text-gray-800">Quick Actions</h3>

            <button
              onClick={() => navigate("/dashboard/create-invoice")}
              className="w-full text-left bg-blue-50 hover:bg-blue-100 p-3 rounded-lg text-blue-700 font-medium"
            >
              + Create Invoice
            </button>

            <button
              onClick={() => navigate("/dashboard/invoices")}
              className="w-full text-left bg-gray-50 hover:bg-gray-100 p-3 rounded-lg text-gray-700 font-medium"
            >
              View All Invoices
            </button>

          </div>

        </div>

        {/* 🔥 RIGHT SIDE (TABLE) */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow border">

          <div className="flex justify-between mb-4">
            <div>
              <h2 className="font-semibold text-gray-800 text-lg">
                Recent Invoices
              </h2>
              <p className="text-xs text-gray-400">
                Latest 5 invoices
              </p>
            </div>

            <button
              onClick={() => navigate("/dashboard/invoices")}
              className="text-blue-600 text-sm font-medium"
            >
              View All →
            </button>
          </div>

          <div className="space-y-3">

            {invoices.slice(0, 5).map((inv, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50"
              >
                <div>
                  <p className="font-medium">{inv.clientName}</p>
                  <p className="text-xs text-gray-400">
                    INV-{inv._id?.slice(-5)}
                  </p>
                </div>

                <p className="font-semibold">₹{inv.amount}</p>

                <span
                  className={`px-3 py-1 text-xs rounded-full ${
                    inv.status === "Paid"
                      ? "bg-green-100 text-green-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {inv.status}
                </span>

                <button
                  onClick={() => navigate(`/dashboard/preview/${inv._id}`)}
                  className="text-sm text-blue-600"
                >
                  View
                </button>
              </div>
            ))}

          </div>

        </div>

      </div>

    </div>
  )
}

/* 🔹 CARD */
function StatCard({ icon, title, value, color }) {

  const colors = {
    purple: "bg-purple-100 text-purple-600",
    green: "bg-green-100 text-green-600",
    orange: "bg-orange-100 text-orange-600"
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow border flex items-center gap-4">

      <div className={`p-3 rounded-xl ${colors[color]}`}>
        {icon}
      </div>

      <div>
        <p className="text-xs text-gray-500">{title}</p>
        <h2 className="text-xl font-bold">{value}</h2>
      </div>

    </div>
  )
}
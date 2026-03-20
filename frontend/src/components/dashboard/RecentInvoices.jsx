import { useNavigate } from "react-router-dom";
import StatusBadge from "./StatusBadge";

export default function RecentInvoices({ data = [], limit = 5 }) {
  const navigate = useNavigate();

  const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toLocaleString('en-IN')}`;
  };

  const recentInvoices = data.slice(0, limit);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">

      <div className="flex justify-between items-center mb-5">
        <div>
          <h3 className="font-semibold text-lg text-gray-800">
            📄 Recent Invoices
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Latest {limit} invoices
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard/invoices")}
          className="text-blue-600 text-sm font-medium hover:text-blue-700 hover:underline transition-all"
        >
          View All →
        </button>
      </div>

      {recentInvoices.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">No invoices yet</p>
          <button
            onClick={() => navigate("/dashboard/create-invoice")}
            className="mt-3 text-blue-600 text-sm font-medium hover:underline"
          >
            Create your first invoice
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {recentInvoices.map((inv) => (
            <div
              key={inv._id}
              onClick={() => navigate(`/dashboard/preview/${inv._id}`)}
              className="flex justify-between items-center p-4 hover:bg-gray-50 rounded-xl border border-transparent hover:border-gray-200 transition-all cursor-pointer group"
            >

              <div className="flex-1">
                <p className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                  {inv.clientName || "Unknown Client"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {inv.invoiceNumber || `INV-${inv._id?.slice(-8)}`}
                </p>
              </div>

              <div className="text-right flex items-center gap-3">
                <div>
                  <p className="font-semibold text-gray-800">
                    {formatCurrency(inv.total || inv.finalAmount || inv.amount)}
                  </p>
                  <StatusBadge status={inv.status || "Draft"} />
                </div>

                <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}

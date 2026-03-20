export default function QuickStats({ invoices = [] }) {
  const total = invoices.length;
  const paid = invoices.filter(i => i.status === "Paid");
  const unpaid = invoices.filter(i => i.status === "Unpaid");

  // Calculate paid rate
  const paidRate = total === 0 ? 0 : ((paid.length / total) * 100).toFixed(1);

  // Calculate average invoice amount
  const totalAmount = invoices.reduce((sum, i) => sum + (i.total || i.amount || 0), 0);
  const avgInvoice = total === 0 ? 0 : Math.round(totalAmount / total);

  // Calculate collection efficiency (paid amount vs total amount)
  const paidAmount = paid.reduce((sum, i) => sum + (i.total || i.amount || 0), 0);
  const collectionEff = totalAmount === 0 ? 0 : ((paidAmount / totalAmount) * 100).toFixed(1);

  return (
    <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all">

      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">📊 Quick Stats</h3>
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
          <span className="text-xs font-bold">{total}</span>
        </div>
      </div>

      <div className="space-y-3 text-sm">
        
        <div className="flex justify-between items-center p-2 bg-white/10 rounded-lg">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            Paid Rate
          </span>
          <span className="font-bold">{paidRate}%</span>
        </div>

        <div className="flex justify-between items-center p-2 bg-white/10 rounded-lg">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
            Avg. Invoice
          </span>
          <span className="font-bold">₹{avgInvoice.toLocaleString('en-IN')}</span>
        </div>

        <div className="flex justify-between items-center p-2 bg-white/10 rounded-lg">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
            Collection Eff.
          </span>
          <span className="font-bold">{collectionEff}%</span>
        </div>

      </div>

      {/* Summary Footer */}
      <div className="mt-4 pt-4 border-t border-white/20">
        <div className="flex justify-between text-xs opacity-90">
          <span>{paid.length} Paid</span>
          <span>{unpaid.length} Pending</span>
        </div>
      </div>

    </div>
  );
}

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getInvoices } from "../../services/api";

export default function InvoicePreview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      const data = await getInvoices();
      const found = data.find((i) => i._id === id);

      if (found) {
        setInvoice(found);
      } else {
        alert("Invoice not found");
        navigate("/dashboard/invoices");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to load invoice");
      navigate("/dashboard/invoices");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert("Download PDF feature will be implemented soon!");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Invoice - ${invoice.clientName}`,
        text: `Invoice for ₹${invoice.amount}`,
        url: window.location.href
      }).catch(err => console.log('Error sharing:', err));
    } else {
      // Fallback - copy link
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Invoice not found</p>
        <button
          onClick={() => navigate("/dashboard/invoices")}
          className="mt-4 text-blue-600 hover:underline"
        >
          ← Back to Invoices
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">

      {/* ACTION BAR (Hide on print) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Invoice Preview</h1>
          <p className="text-sm text-gray-500">
            Preview and manage invoice #{invoice._id?.slice(-8)}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate("/dashboard/invoices")}
            className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
          >
            ← Back
          </button>

          <button
            onClick={() => navigate(`/dashboard/edit/${invoice._id}`)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
          >
            ✏️ Edit
          </button>

          <button
            onClick={handleShare}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all"
          >
            🔗 Share
          </button>

          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all"
          >
            📥 Download
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all"
          >
            🖨️ Print
          </button>
        </div>
      </div>

      {/* INVOICE CARD */}
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-xl shadow-lg border border-gray-200 space-y-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 pb-6 border-b-2 border-gray-200">
          
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">INVOICE</h2>
            <p className="text-sm text-gray-500">
              Invoice ID: <span className="font-mono font-medium">#{invoice._id?.slice(-12)}</span>
            </p>
            <p className="text-sm text-gray-500">
              Date: {new Date(invoice.createdAt || Date.now()).toLocaleDateString('en-IN')}
            </p>
          </div>

          <div className="flex flex-col items-end gap-3">
            {/* LOGO */}
            {invoice.logo && (
              <img
                src={invoice.logo.startsWith('http') ? invoice.logo : `http://localhost:5000/${invoice.logo}`}
                alt="Company Logo"
                className="h-16 object-contain"
              />
            )}

            {/* STATUS BADGE */}
            <span
              className={`px-4 py-2 text-sm font-semibold rounded-full ${
                invoice.status === "Paid"
                  ? "bg-green-100 text-green-700 border-2 border-green-300"
                  : invoice.status === "Unpaid"
                  ? "bg-yellow-100 text-yellow-700 border-2 border-yellow-300"
                  : "bg-blue-100 text-blue-700 border-2 border-blue-300"
              }`}
            >
              {invoice.status?.toUpperCase()}
            </span>
          </div>
        </div>

        {/* BUSINESS & CLIENT INFO */}
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* FROM */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 mb-3">FROM</h3>
            <div className="space-y-1">
              <p className="font-semibold text-gray-800">
                {invoice.businessName || "Your Business"}
              </p>
              {invoice.businessEmail && (
                <p className="text-sm text-gray-600">{invoice.businessEmail}</p>
              )}
              {invoice.address && (
                <p className="text-sm text-gray-600">{invoice.address}</p>
              )}
              {invoice.phone && (
                <p className="text-sm text-gray-600">{invoice.phone}</p>
              )}
              {invoice.gst && (
                <p className="text-sm text-gray-600">GST: {invoice.gst}</p>
              )}
            </div>
          </div>

          {/* TO */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 mb-3">BILL TO</h3>
            <div className="space-y-1">
              <p className="font-semibold text-gray-800 text-lg">
                {invoice.clientName}
              </p>
              {invoice.clientEmail && (
                <p className="text-sm text-gray-600">{invoice.clientEmail}</p>
              )}
              {invoice.clientPhone && (
                <p className="text-sm text-gray-600">{invoice.clientPhone}</p>
              )}
              {invoice.clientAddress && (
                <p className="text-sm text-gray-600">{invoice.clientAddress}</p>
              )}
            </div>
          </div>
        </div>

        {/* LINE ITEMS */}
        {invoice.items && invoice.items.length > 0 ? (
          <div className="border-t-2 border-b-2 border-gray-200 py-6">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 text-sm font-semibold text-gray-600">DESCRIPTION</th>
                  <th className="text-center py-3 text-sm font-semibold text-gray-600">QTY</th>
                  <th className="text-right py-3 text-sm font-semibold text-gray-600">RATE</th>
                  <th className="text-right py-3 text-sm font-semibold text-gray-600">AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 text-gray-800">{item.description}</td>
                    <td className="py-3 text-center text-gray-600">{item.quantity}</td>
                    <td className="py-3 text-right text-gray-600">₹{item.rate?.toLocaleString('en-IN')}</td>
                    <td className="py-3 text-right font-semibold text-gray-800">
                      ₹{item.amount?.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="border-t-2 border-b-2 border-gray-200 py-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Service/Product</span>
              <span className="font-semibold text-gray-800">
                ₹{invoice.amount?.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        )}

        {/* TOTALS */}
        <div className="flex justify-end">
          <div className="w-full md:w-1/2 space-y-3">
            
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>₹{(invoice.subtotal || invoice.amount)?.toLocaleString('en-IN')}</span>
            </div>

            {invoice.discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount</span>
                <span>- ₹{invoice.discount?.toLocaleString('en-IN')}</span>
              </div>
            )}

            {invoice.tax > 0 && (
              <div className="flex justify-between text-sm text-blue-600">
                <span>Tax</span>
                <span>+ ₹{invoice.tax?.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="flex justify-between pt-3 border-t-2 border-gray-300">
              <span className="text-lg font-bold text-gray-800">TOTAL</span>
              <span className="text-2xl font-bold text-indigo-600">
                ₹{(invoice.total || invoice.finalAmount || invoice.amount)?.toLocaleString('en-IN')}
              </span>
            </div>

          </div>
        </div>

        {/* NOTES & TERMS */}
        {(invoice.notes || invoice.terms) && (
          <div className="space-y-4 pt-6 border-t border-gray-200">
            {invoice.notes && (
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">NOTES</h3>
                <p className="text-sm text-gray-600">{invoice.notes}</p>
              </div>
            )}

            {invoice.terms && (
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">TERMS & CONDITIONS</h3>
                <p className="text-sm text-gray-600">{invoice.terms}</p>
              </div>
            )}
          </div>
        )}

        {/* SIGNATURE */}
        {invoice.signature && (
          <div className="flex justify-end pt-6 border-t border-gray-200">
            <div className="text-center">
              <img
                src={invoice.signature.startsWith('http') ? invoice.signature : `http://localhost:5000/${invoice.signature}`}
                alt="Signature"
                className="h-16 object-contain mb-2"
              />
              <p className="text-sm text-gray-500 border-t border-gray-300 pt-2">
                Authorized Signature
              </p>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div className="text-center pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-400">
            Thank you for your business!
          </p>
        </div>

      </div>

    </div>
  );
}

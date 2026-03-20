import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getInvoices, updateInvoice } from "../../services/api";

export default function EditInvoice() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    clientName: "",
    amount: "",
    status: "Unpaid"
  });

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
        setForm({
          clientName: found.clientName || "",
          amount: found.amount || "",
          status: found.status || "Unpaid"
        });
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.clientName.trim()) {
      newErrors.clientName = "Client name is required";
    }

    if (!form.amount || form.amount <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Please fix the errors before updating");
      return;
    }

    try {
      setSaving(true);

      await updateInvoice(id, {
        clientName: form.clientName,
        amount: Number(form.amount),
        status: form.status
      });

      alert("✅ Invoice updated successfully!");
      navigate("/dashboard/invoices");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Failed to update invoice");
    } finally {
      setSaving(false);
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
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-10">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            ✏️ Edit Invoice
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Update invoice details for {invoice.clientName}
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard/invoices")}
          className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
        >
          ← Back
        </button>
      </div>

      {/* FORM */}
      <form onSubmit={handleUpdate} className="bg-white p-8 rounded-xl shadow-md border border-gray-100 space-y-6">

        <div className="space-y-4">

          {/* Client Name */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Client Name <span className="text-red-500">*</span>
            </label>
            <input
              name="clientName"
              value={form.clientName}
              onChange={handleChange}
              placeholder="Enter client name"
              className={`w-full border-2 p-3 rounded-lg focus:outline-none transition-all ${
                errors.clientName 
                  ? "border-red-300 focus:border-red-400" 
                  : "border-gray-200 focus:border-blue-400"
              }`}
            />
            {errors.clientName && (
              <p className="text-red-500 text-xs mt-1">⚠️ {errors.clientName}</p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Amount (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              min="0"
              className={`w-full border-2 p-3 rounded-lg focus:outline-none transition-all ${
                errors.amount 
                  ? "border-red-300 focus:border-red-400" 
                  : "border-gray-200 focus:border-blue-400"
              }`}
            />
            {errors.amount && (
              <p className="text-red-500 text-xs mt-1">⚠️ {errors.amount}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Status
            </label>
            <div className="flex gap-3">
              {["Draft", "Unpaid", "Paid"].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setForm({ ...form, status })}
                  className={`flex-1 px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                    form.status === status
                      ? status === "Paid"
                        ? "bg-green-50 border-green-500 text-green-600"
                        : status === "Unpaid"
                        ? "bg-yellow-50 border-yellow-500 text-yellow-600"
                        : "bg-blue-50 border-blue-500 text-blue-600"
                      : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Original Info */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 mb-2">
            <strong>Original Invoice ID:</strong> {invoice._id}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Created:</strong> {new Date(invoice.createdAt || Date.now()).toLocaleDateString()}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => navigate("/dashboard/invoices")}
            className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className={`flex-1 px-6 py-3 rounded-lg font-medium shadow-lg transition-all ${
              saving
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-xl hover:scale-105"
            }`}
          >
            {saving ? "💾 Updating..." : "💾 Update Invoice"}
          </button>
        </div>

      </form>

    </div>
  );
}

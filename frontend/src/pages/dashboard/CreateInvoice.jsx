import { useState, useEffect } from "react";
import { createInvoice } from "../../services/api";
import { generateAIInvoice } from "../../services/aiService";
import AIGeneratorModal from "../../components/invoice/AIGeneratorModal";
import { useNavigate } from "react-router-dom";

export default function CreateInvoice() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};

  // Form State
  const [form, setForm] = useState({
    invoiceNumber: `INV-${Date.now()}`,
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: "",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    clientAddress: "",
    businessName: user?.name || "",
    businessEmail: user?.email || "",
    address: user?.address || "",
    phone: user?.phone || "",
    gst: "",
    status: "Draft",
    notes: "",
    terms: "Payment due within 30 days"
  });

  // Line Items
  const [items, setItems] = useState([
    { id: 1, description: "", quantity: 1, rate: 0, amount: 0 }
  ]);

  // Branding State
  const [logoOption, setLogoOption] = useState("profile");
  const [signatureOption, setSignatureOption] = useState("profile");
  const [customLogo, setCustomLogo] = useState(null);
  const [customSignature, setCustomSignature] = useState(null);
  const [previewLogo, setPreviewLogo] = useState(null);
  const [previewSignature, setPreviewSignature] = useState(null);

  // Tax & Discount
  const [taxRate, setTaxRate] = useState(18);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState("percentage");

  // UI State
  const [errors, setErrors] = useState({});
  const [showAIModal, setShowAIModal] = useState(false);

  // Load user data on mount
  useEffect(() => {
    setForm(prev => ({
      ...prev,
      businessName: user?.name || "",
      businessEmail: user?.email || "",
      address: user?.address || "",
      phone: user?.phone || ""
    }));
  }, []);

  // Calculate totals
  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.amount, 0);
  };

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    if (discountType === "percentage") {
      return (subtotal * discount) / 100;
    }
    return discount;
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    const discountAmount = calculateDiscount();
    return ((subtotal - discountAmount) * taxRate) / 100;
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount() + calculateTax();
  };

  const handleGenerateAI = async (prompt) => {
    if (user?.plan === "FREE") {
      alert("AI feature available only for Pro/Basic users");
      navigate("/#pricing");
      return;
    }
    try {
      const res = await generateAIInvoice(prompt);
      alert("✅ AI Invoice Created!");
      setShowAIModal(false);
      navigate(`/dashboard/preview/${res.invoice._id}`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "AI generation failed");
    }
  };

  // Handlers
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleItemChange = (id, field, value) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        updated.amount = updated.quantity * updated.rate;
        return updated;
      }
      return item;
    }));
  };

  const addItem = () => {
    setItems([...items, {
      id: items.length + 1,
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0
    }]);
  };

  const removeItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("File size should be less than 2MB");
      return;
    }

    setCustomLogo(file);
    setPreviewLogo(URL.createObjectURL(file));
  };

  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("File size should be less than 2MB");
      return;
    }

    setCustomSignature(file);
    setPreviewSignature(URL.createObjectURL(file));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.clientName.trim()) newErrors.clientName = "Client name is required";
    if (!form.clientEmail.trim()) newErrors.clientEmail = "Client email is required";
    if (form.clientEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.clientEmail)) {
      newErrors.clientEmail = "Invalid email format";
    }
    if (!form.dueDate) newErrors.dueDate = "Due date is required";
    if (new Date(form.dueDate) < new Date(form.issueDate)) {
      newErrors.dueDate = "Due date cannot be before issue date";
    }

    const hasValidItem = items.some(item => 
      item.description.trim() && item.quantity > 0 && item.rate > 0
    );
    if (!hasValidItem) newErrors.items = "Add at least one valid line item";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      alert("Please fix the errors before creating invoice");
      return;
    }

    const invoiceData = {
      ...form,
      items: items.filter(item => item.description.trim()),
      subtotal: calculateSubtotal(),
      discount: calculateDiscount(),
      tax: calculateTax(),
      total: calculateTotal(),
      logo: logoOption === "profile" ? user?.logo : previewLogo,
      signature: signatureOption === "profile" ? user?.signature : previewSignature
    };

    await createInvoice(invoiceData);
    navigate("/dashboard/invoices");
  };

  const handleSaveAsDraft = () => {
    setForm({ ...form, status: "Draft" });
    handleSubmit();
  };

  return (
    <div className="space-y-6 pb-10">

      {/* AI MODAL */}
      <AIGeneratorModal
        open={showAIModal}
        onClose={() => setShowAIModal(false)}
        onGenerate={handleGenerateAI}
      />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            📄 Create New Invoice
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Fill in invoice details, add line items, and configure branding
          </p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <button 
            onClick={() => setShowAIModal(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            🤖 Create with AI
          </button>

          <button
            onClick={handleSaveAsDraft}
            className="border-2 border-blue-300 text-blue-600 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-50 transition-all"
          >
            💾 Save Draft
          </button>

          <button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium shadow-lg hover:shadow-xl transition-all"
          >
            ✅ Create Invoice
          </button>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* LEFT SIDE - 2/3 */}
        <div className="lg:col-span-2 space-y-6">

          {/* INVOICE DETAILS */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 space-y-4">
            <h2 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
              📋 Invoice Details
            </h2>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">
                  Invoice Number
                </label>
                <input
                  name="invoiceNumber"
                  value={form.invoiceNumber}
                  onChange={handleChange}
                  className="border-2 border-gray-200 p-3 rounded-lg w-full focus:border-indigo-400 focus:outline-none"
                  readOnly
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">
                  Issue Date
                </label>
                <input
                  type="date"
                  name="issueDate"
                  value={form.issueDate}
                  onChange={handleChange}
                  className="border-2 border-gray-200 p-3 rounded-lg w-full focus:border-indigo-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">
                  Due Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={form.dueDate}
                  onChange={handleChange}
                  className={`border-2 p-3 rounded-lg w-full focus:outline-none ${
                    errors.dueDate ? "border-red-300" : "border-gray-200 focus:border-indigo-400"
                  }`}
                />
                {errors.dueDate && (
                  <p className="text-red-500 text-xs mt-1">⚠️ {errors.dueDate}</p>
                )}
              </div>
            </div>

            {/* STATUS */}
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">
                Status
              </label>
              <div className="flex gap-3 flex-wrap">
                {[
                  { name: "Draft", color: "blue", bg: "bg-blue-50", border: "border-blue-500", text: "text-blue-600", dot: "bg-blue-500" },
                  { name: "Unpaid", color: "yellow", bg: "bg-yellow-50", border: "border-yellow-500", text: "text-yellow-600", dot: "bg-yellow-500" },
                  { name: "Paid", color: "green", bg: "bg-green-50", border: "border-green-500", text: "text-green-600", dot: "bg-green-500" }
                ].map((s) => (
                  <button
                    key={s.name}
                    onClick={() => setForm({ ...form, status: s.name })}
                    className={`px-5 py-2 rounded-full text-sm font-medium border-2 transition-all flex items-center gap-2 ${
                      form.status === s.name
                        ? `${s.border} ${s.text} ${s.bg}`
                        : "border-gray-200 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <span className={`inline-block w-2 h-2 rounded-full ${
                      form.status === s.name ? s.dot : "bg-gray-300"
                    }`}></span>
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* BILL FROM */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 space-y-4">
            <h2 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
              🏢 Bill From (Your Business)
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">
                  Business Name
                </label>
                <input
                  name="businessName"
                  value={form.businessName}
                  onChange={handleChange}
                  placeholder="Your Business Name"
                  className="border-2 border-gray-200 p-3 rounded-lg w-full focus:border-indigo-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">
                  Email
                </label>
                <input
                  name="businessEmail"
                  value={form.businessEmail}
                  onChange={handleChange}
                  placeholder="business@example.com"
                  className="border-2 border-gray-200 p-3 rounded-lg w-full focus:border-indigo-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">
                Address
              </label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Business Address"
                rows="2"
                className="border-2 border-gray-200 p-3 rounded-lg w-full focus:border-indigo-400 focus:outline-none resize-none"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">
                  Phone
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="border-2 border-gray-200 p-3 rounded-lg w-full focus:border-indigo-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">
                  GST Number
                </label>
                <input
                  name="gst"
                  value={form.gst}
                  onChange={handleChange}
                  placeholder="GST Number (Optional)"
                  className="border-2 border-gray-200 p-3 rounded-lg w-full focus:border-indigo-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* BILL TO */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 space-y-4">
            <h2 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
              👤 Bill To (Client)
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">
                  Client Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="clientName"
                  value={form.clientName}
                  onChange={handleChange}
                  placeholder="Client Full Name"
                  className={`border-2 p-3 rounded-lg w-full focus:outline-none ${
                    errors.clientName ? "border-red-300" : "border-gray-200 focus:border-indigo-400"
                  }`}
                />
                {errors.clientName && (
                  <p className="text-red-500 text-xs mt-1">⚠️ {errors.clientName}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">
                  Client Email <span className="text-red-500">*</span>
                </label>
                <input
                  name="clientEmail"
                  type="email"
                  value={form.clientEmail}
                  onChange={handleChange}
                  placeholder="client@example.com"
                  className={`border-2 p-3 rounded-lg w-full focus:outline-none ${
                    errors.clientEmail ? "border-red-300" : "border-gray-200 focus:border-indigo-400"
                  }`}
                />
                {errors.clientEmail && (
                  <p className="text-red-500 text-xs mt-1">⚠️ {errors.clientEmail}</p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">
                  Client Phone
                </label>
                <input
                  name="clientPhone"
                  value={form.clientPhone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="border-2 border-gray-200 p-3 rounded-lg w-full focus:border-indigo-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">
                  Client Address
                </label>
                <input
                  name="clientAddress"
                  value={form.clientAddress}
                  onChange={handleChange}
                  placeholder="Client Address"
                  className="border-2 border-gray-200 p-3 rounded-lg w-full focus:border-indigo-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* LINE ITEMS */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                📦 Line Items
              </h2>
              <button
                onClick={addItem}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
              >
                + Add Item
              </button>
            </div>

            {errors.items && (
              <p className="text-red-500 text-sm">⚠️ {errors.items}</p>
            )}

            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={item.id} className="border-2 border-gray-200 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">
                      Item #{index + 1}
                    </span>
                    {items.length > 1 && (
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        🗑️ Remove
                      </button>
                    )}
                  </div>

                  <div className="grid md:grid-cols-4 gap-3">
                    <div className="md:col-span-2">
                      <input
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                        className="border-2 border-gray-200 p-3 rounded-lg w-full focus:border-indigo-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <input
                        type="number"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(item.id, "quantity", Number(e.target.value))}
                        className="border-2 border-gray-200 p-3 rounded-lg w-full focus:border-indigo-400 focus:outline-none"
                        min="1"
                      />
                    </div>

                    <div>
                      <input
                        type="number"
                        placeholder="Rate (₹)"
                        value={item.rate}
                        onChange={(e) => handleItemChange(item.id, "rate", Number(e.target.value))}
                        className="border-2 border-gray-200 p-3 rounded-lg w-full focus:border-indigo-400 focus:outline-none"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Amount</span>
                      <span className="font-semibold text-gray-800">
                        ₹{item.amount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* NOTES & TERMS */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 space-y-4">
            <h2 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
              📝 Additional Information
            </h2>

            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">
                Notes
              </label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Any additional notes for the client..."
                rows="3"
                className="border-2 border-gray-200 p-3 rounded-lg w-full focus:border-indigo-400 focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">
                Terms & Conditions
              </label>
              <textarea
                name="terms"
                value={form.terms}
                onChange={handleChange}
                placeholder="Payment terms and conditions..."
                rows="3"
                className="border-2 border-gray-200 p-3 rounded-lg w-full focus:border-indigo-400 focus:outline-none resize-none"
              />
            </div>
          </div>

        </div>

        {/* RIGHT SIDE - 1/3 */}
        <div className="space-y-6">

          {/* BRANDING */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 space-y-4">
            <h2 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
              🎨 Branding
            </h2>

            {/* LOGO */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-600 block">
                Company Logo
              </label>

              <select
                value={logoOption}
                onChange={(e) => setLogoOption(e.target.value)}
                className="border-2 border-gray-200 p-3 rounded-lg w-full focus:border-indigo-400 focus:outline-none"
              >
                <option value="profile">📁 Use Profile Logo</option>
                <option value="upload">📤 Upload New Logo</option>
              </select>

              {logoOption === "profile" && user?.logo && (
                <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg">
                  <img 
                    src={user.logo} 
                    alt="Profile Logo"
                    className="h-20 mx-auto object-contain"
                  />
                </div>
              )}

              {logoOption === "upload" && (
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="text-sm w-full"
                  />
                  {previewLogo && (
                    <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg">
                      <img 
                        src={previewLogo} 
                        alt="Custom Logo"
                        className="h-20 mx-auto object-contain"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="border-t pt-4"></div>

            {/* SIGNATURE */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-600 block">
                Signature
              </label>

              <select
                value={signatureOption}
                onChange={(e) => setSignatureOption(e.target.value)}
                className="border-2 border-gray-200 p-3 rounded-lg w-full focus:border-indigo-400 focus:outline-none"
              >
                <option value="profile">📁 Use Profile Signature</option>
                <option value="upload">📤 Upload New Signature</option>
              </select>

              {signatureOption === "profile" && user?.signature && (
                <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg">
                  <img 
                    src={user.signature} 
                    alt="Profile Signature"
                    className="h-16 mx-auto object-contain"
                  />
                </div>
              )}

              {signatureOption === "upload" && (
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSignatureUpload}
                    className="text-sm w-full"
                  />
                  {previewSignature && (
                    <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg">
                      <img 
                        src={previewSignature} 
                        alt="Custom Signature"
                        className="h-16 mx-auto object-contain"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* CALCULATIONS */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 space-y-4">
            <h2 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
              💰 Pricing & Tax
            </h2>

            {/* Discount */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 block">
                Discount
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="border-2 border-gray-200 p-3 rounded-lg flex-1 focus:border-indigo-400 focus:outline-none"
                  min="0"
                />
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value)}
                  className="border-2 border-gray-200 p-3 rounded-lg focus:border-indigo-400 focus:outline-none"
                >
                  <option value="percentage">%</option>
                  <option value="fixed">₹</option>
                </select>
              </div>
            </div>

            {/* Tax */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 block">
                Tax Rate (%)
              </label>
              <input
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className="border-2 border-gray-200 p-3 rounded-lg w-full focus:border-indigo-400 focus:outline-none"
                min="0"
                max="100"
              />
            </div>
          </div>

          {/* SUMMARY */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-xl shadow-lg border-2 border-indigo-200 space-y-3">
            <h2 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
              📊 Summary
            </h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{calculateSubtotal().toLocaleString('en-IN')}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Tax ({taxRate}%)</span>
                  <span className="font-medium">+ ₹{calculateTax().toLocaleString('en-IN')}</span>
                </div>
              )}

              {taxRate > 0 && (
                <div className="flex justify-between text-blue-600">
                  <span>Tax ({taxRate}%)</span>
                  <span className="font-medium">+ ₹{calculateTax().toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="border-t-2 border-indigo-300 pt-2"></div>

              <div className="flex justify-between text-lg font-bold text-gray-800">
                <span>Total</span>
                <span className="text-indigo-600">₹{calculateTotal().toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 space-y-3">
            <h2 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
              ⚡ Quick Actions
            </h2>

            <button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2">
              <span>📧</span> Email to Client
            </button>

            <button className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2">
              <span>📥</span> Download PDF
            </button>

            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2">
              <span>🔗</span> Copy Link
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}

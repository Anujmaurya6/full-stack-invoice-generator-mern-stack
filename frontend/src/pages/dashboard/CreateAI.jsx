import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { generateAIInvoice } from "../../services/aiService";
import InvoicePreviewCard from "../../components/invoice/InvoicePreviewCard";

export default function CreateAI() {

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    clientName: "",
    amount: "",
    status: "paid",
    description: "",
  });

  const [theme, setTheme] = useState("color");
  const [loading, setLoading] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);

  useEffect(() => {
    if (!user?.plan) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGenerate = async () => {

    try {

      setLoading(true);

      const prompt = `
Client: ${form.clientName}
Amount: ${form.amount}
Status: ${form.status}
Description: ${form.description}
`;

      const res = await generateAIInvoice(prompt);

      setInvoiceData(res.invoice);

    } catch (err) {

      alert(err.response?.data?.msg || "AI Failed");

    } finally {

      setLoading(false);

    }

  };

    <div className="min-h-screen bg-slate-900 text-white p-6 md:p-12 font-sans overflow-hidden relative">
      {/* Background Blobs for Atmosphere */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-12 relative z-10">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-2xl shadow-lg shadow-purple-500/20">
            <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">⚡ AI Genesis</span>
            </h1>
          </div>
          <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 text-purple-300 rounded-full text-xs font-bold uppercase tracking-widest">
            {user?.plan || "FREE"} Plan
          </span>
        </div>
        <p className="text-gray-400 text-lg ml-1">
          Architecting professional invoices with artificial intelligence.
        </p>
      </div>

      {/* GRID */}
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 relative z-10">
        
        {/* LEFT FORM - Glassmorphic */}
        <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl transition-all hover:border-white/20">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm">01</span>
            Parameters
          </h2>

          <div className="space-y-6">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Client Details</label>
              <input
                type="text"
                name="clientName"
                placeholder="Who is this for?"
                className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-gray-600"
                value={form.clientName}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Valuation</label>
                <div className="relative">
                   <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                   <input
                    type="number"
                    name="amount"
                    placeholder="0.00"
                    className="w-full bg-black/40 border border-white/10 p-4 pl-8 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                    value={form.amount}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Status</label>
                <select
                  name="status"
                  className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all appearance-none cursor-pointer"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="paid" className="bg-slate-900">Settled</option>
                  <option value="unpaid" className="bg-slate-900">Pending</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Scope of Work</label>
              <textarea
                name="description"
                placeholder="Describe the services rendered..."
                className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl h-32 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-gray-600"
                value={form.description}
                onChange={handleChange}
              />
            </div>

            {/* THEME SELECTOR */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Aesthetic Profile</label>
              <div className="flex gap-4">
                <button
                  onClick={() => setTheme("color")}
                  className={`flex-1 py-4 rounded-2xl font-bold transition-all border ${
                    theme === "color"
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 border-transparent shadow-lg shadow-blue-500/20 scale-[1.02]"
                      : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  Vibrant Modern
                </button>

                <button
                  onClick={() => setTheme("bw")}
                  className={`flex-1 py-4 rounded-2xl font-bold transition-all border ${
                    theme === "bw"
                      ? "bg-white text-black border-transparent shadow-lg shadow-white/20 scale-[1.02]"
                      : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  Minimalist Noir
                </button>
              </div>
            </div>

            {/* GENERATE BUTTON */}
            <button
              onClick={handleGenerate}
              disabled={loading}
              className={`w-full mt-8 relative group overflow-hidden py-4 rounded-2xl font-black text-lg transition-all ${
                loading ? "cursor-wait opacity-80" : "hover:scale-[1.02] active:scale-95"
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500"></div>
              <span className="relative z-10 flex items-center justify-center gap-3">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Synthesizing...
                  </>
                ) : (
                  <>
                    🚀 Initiate Generation
                  </>
                )}
              </span>
            </button>
          </div>
        </div>

        {/* RIGHT PREVIEW */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
          <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl h-full relative z-10">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm">02</span>
                Real-time Preview
              </h2>
              {invoiceData && (
                <div className="flex gap-2">
                  <span className="animate-pulse w-2 h-2 rounded-full bg-green-500"></span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-green-500">Live Render</span>
                </div>
              )}
            </div>

            <div className="rounded-2xl overflow-hidden bg-slate-100 p-0.5 shadow-inner min-h-[400px]">
               <InvoicePreviewCard
                data={invoiceData}
                user={user}
                theme={theme}
              />
            </div>

            {!invoiceData && !loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-12 text-center opacity-40">
                <div className="w-16 h-16 rounded-full border border-dashed border-white/30 flex items-center justify-center mb-4">
                   <span className="text-2xl">✨</span>
                </div>
                <p className="text-gray-400 font-medium">Input parameters and initiate generation to see your magic invoice.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
}
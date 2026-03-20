import { useState } from "react";

export default function AIGeneratorModal({ open, onClose, onGenerate }) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      alert("Please enter invoice details");
      return;
    }

    setLoading(true);
    try {
      await onGenerate(prompt);
      setPrompt("");
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 space-y-6">
        
        {/* HEADER */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              🤖 AI Invoice Generator
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Describe your invoice in natural language
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
          >
            ×
          </button>
        </div>

        {/* INPUT */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 block">
            Invoice Details
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Example: Website design for Rahul ₹15000 with GST

Try describing your invoice like:
• Web development for Tech Corp ₹50000 paid
• Logo design for StartupXYZ ₹10000 unpaid with tax
• Consultation for John Doe ₹25000"
            rows="8"
            className="w-full border-2 border-gray-300 rounded-xl p-4 focus:border-indigo-500 focus:outline-none resize-none text-gray-700"
          />
        </div>

        {/* TIP */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-indigo-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">
            💡 <strong>Tip:</strong> Include client name, amount, service description, and payment status for best results
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-3 border-2 border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading || !prompt.trim()}
            className={`px-8 py-3 rounded-lg font-medium transition-all ${
              loading || !prompt.trim()
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl"
            }`}
          >
            {loading ? "🔄 Generating..." : "✨ Generate Invoice"}
          </button>
        </div>

      </div>
    </div>
  );
}

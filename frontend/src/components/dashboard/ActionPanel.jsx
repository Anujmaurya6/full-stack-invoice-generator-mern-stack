import { Sparkles, Plus } from "lucide-react";

export default function ActionPanel({ onCreateAI, onCreate, disabled = false }) {
  return (
    <div className="flex flex-wrap gap-3">

      <button
        onClick={onCreateAI}
        disabled={disabled}
        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-lg hover:from-purple-200 hover:to-pink-200 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Sparkles size={18} />
        <span className="font-medium">Create with AI</span>
      </button>

      <button
        onClick={onCreate}
        disabled={disabled}
        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus size={18} />
        <span className="font-medium">Create Invoice</span>
      </button>

    </div>
  );
}

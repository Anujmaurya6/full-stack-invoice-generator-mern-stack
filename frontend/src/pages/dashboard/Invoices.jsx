import { useEffect, useState, useContext } from "react";
import { getInvoices } from "../../services/api";
import { generateAIInvoice } from "../../services/aiService";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

import AIGeneratorModal from "../../components/invoice/AIGeneratorModal";

export default function Invoices() {

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [perPage, setPerPage] = useState(6);
  const [loading, setLoading] = useState(true);

  const [aiOpen, setAiOpen] = useState(false);

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getInvoices();
      setData(res || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch invoices");
    } finally {
      setLoading(false);
    }
  };

  /* 🔥 AI BUTTON CLICK */
 const handleAIClick = () => {

  if (user?.plan !== "PRO") {

    alert("AI feature available only for Pro users")

    navigate("/#pricing")

    return

  }

  setAiOpen(true)

};

  /* 🔥 AI GENERATION */
  const handleGenerateAI = async (prompt) => {

    try {

      setLoading(true);

      await generateAIInvoice(prompt);

      await fetchData();

      alert("✅ AI Invoice Created");

    } catch (err) {

      console.error(err);

      alert(err.response?.data?.msg || "AI generation failed");

    } finally {

      setLoading(false);

    }

  };

  /* 🔥 FILTER LOGIC */

  const filtered = data.filter((inv) => {

    const matchSearch = inv.clientName
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchStatus =
      status === "All" || inv.status === status;

    return matchSearch && matchStatus;

  });

  return (

    <div className="space-y-8">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

        <div>

          <h1 className="text-2xl font-bold text-gray-800">
            Invoice Management
          </h1>

          <p className="text-gray-500 text-sm">
            Search, filter and manage your invoices with powerful AI tools
          </p>

        </div>

        <div className="flex flex-wrap gap-3">

          <button
            onClick={handleAIClick}
            className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200"
          >
            ✨ Create with AI
          </button>

          <button
            onClick={() => navigate("/dashboard/create-invoice")}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-lg shadow hover:scale-105 transition"
          >
            + Create Invoice
          </button>

        </div>

      </div>

      {/* STATS */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <Stat title="Total Invoices" value={data.length} />

        <Stat
          title="Paid"
          value={data.filter((i) => i.status === "Paid").length}
        />

        <Stat
          title="Unpaid"
          value={data.filter((i) => i.status === "Unpaid").length}
        />

        <Stat title="Drafts" value="0" />

      </div>

      {/* FILTER BOX */}

      <div className="bg-white p-6 rounded-2xl shadow border space-y-6">

        <div className="flex justify-between items-center">

          <h2 className="font-semibold text-gray-800">
            Filters & Search
          </h2>

          <span className="text-sm text-gray-400">
            Showing {filtered.length} invoices
          </span>

        </div>

        <div className="grid md:grid-cols-4 gap-4">

          <input
            placeholder="Search by client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-3 rounded-lg w-full"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border p-3 rounded-lg"
          >
            <option value="All">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid</option>
          </select>



        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">

          <div className="flex items-center gap-2 text-sm">

            <span>Show</span>

            <select
              value={perPage}
              onChange={(e) => setPerPage(Number(e.target.value))}
              className="border px-2 py-1 rounded"
            >

              <option value={6}>6</option>
              <option value={10}>10</option>
              <option value={20}>20</option>

            </select>

            <span>per page</span>

          </div>

          <div className="flex gap-2">

            <button
              onClick={() => {
                setSearch("");
                setStatus("All");
              }}
              className="px-4 py-2 border rounded-lg text-gray-600"
            >
              Reset Filters
            </button>

            <button
              onClick={fetchData}
              className="px-4 py-2 border rounded-lg text-gray-600"
            >
              Refresh
            </button>

          </div>

        </div>

      </div>

      {/* TABLE */}

      <div className="bg-white rounded-2xl shadow border overflow-x-auto">

        <div className="p-6 border-b">

          <h2 className="font-semibold text-gray-800">
            All Invoices
          </h2>

          <p className="text-xs text-gray-400">
            Sorted by latest
          </p>

        </div>

        <table className="w-full text-sm min-w-[600px]">

          <thead className="bg-gray-50 text-gray-600">

            <tr>

              <th className="px-6 py-3 text-left">CLIENT</th>
              <th className="px-6 py-3 text-left">AMOUNT</th>
              <th className="px-6 py-3 text-left">STATUS</th>
              <th className="px-6 py-3 text-left">ACTIONS</th>

            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>

                <td colSpan="4" className="text-center py-6 text-gray-400">
                  Loading invoices...
                </td>

              </tr>

            ) : filtered.length === 0 ? (

              <tr>

                <td colSpan="4" className="text-center py-6 text-gray-400">
                  No invoices found
                </td>

              </tr>

            ) : (

              filtered.slice(0, perPage).map((inv) => (

                <tr key={inv._id} className="border-t hover:bg-gray-50">

                  <td className="px-6 py-4 font-medium">
                    {inv.clientName}
                  </td>

                  <td className="px-6 py-4 font-semibold">
                    ₹{inv.finalAmount || inv.amount}
                  </td>

                  <td className="px-6 py-4">

                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        inv.status === "Paid"
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >

                      {inv.status}

                    </span>

                  </td>

                  <td className="px-6 py-4 flex gap-3 text-sm">

                    <button
                      onClick={() =>
                        navigate(`/dashboard/preview/${inv._id}`)
                      }
                      className="text-blue-600"
                    >
                      View
                    </button>

                    <button
                      onClick={() =>
                        navigate(`/dashboard/edit/${inv._id}`)
                      }
                      className="text-indigo-600"
                    >
                      Edit
                    </button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

      {/* AI MODAL */}

      <AIGeneratorModal
        open={aiOpen}
        onClose={() => setAiOpen(false)}
        onGenerate={handleGenerateAI}
      />

    </div>

  );

}

/* STAT CARD */

function Stat({ title, value }) {

  return (

    <div className="bg-white p-5 rounded-xl border shadow text-center">

      <p className="text-xs text-gray-500">{title}</p>

      <h2 className="text-xl font-bold">{value}</h2>

    </div>

  );

}
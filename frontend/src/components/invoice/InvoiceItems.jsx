import Input from "../common/Input";
import Button from "../common/Button";
import { useState } from "react";
import InvoiceItems from "./InvoiceItems";
import { calculateTotals } from "../../utils/calculateTotals";

export default function InvoiceForm({ onSubmit, initialData = {} }) {
  const [clientName, setClientName] = useState(initialData.clientName || "");
  const [items, setItems] = useState(initialData.items || []);

  const totals = calculateTotals(items);

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      clientName,
      items,
      ...totals,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      <Input
        label="Client Name"
        value={clientName}
        onChange={(e) => setClientName(e.target.value)}
        placeholder="Enter client name"
      />

      {/* ITEMS */}
      <InvoiceItems items={items} setItems={setItems} />

      {/* TOTALS */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
        <p>Subtotal: ₹{totals.subtotal}</p>
        <p>GST (18%): ₹{totals.gst}</p>
        <p className="font-semibold text-lg">
          Total: ₹{totals.total}
        </p>
      </div>

      <Button type="submit" full>
        Save Invoice
      </Button>

    </form>
  );
}

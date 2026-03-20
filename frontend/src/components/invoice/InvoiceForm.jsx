import Input from "../common/Input"
import Button from "../common/Button"
import { useState } from "react"
import InvoiceItems from "./InvoiceItems"
import { calculateTotals } from "../../utils/calculateTotals"

export default function InvoiceForm({ onSubmit, initialData = {} }) {

  const [clientName, setClientName] = useState(initialData.clientName || "")
  const [items, setItems] = useState(initialData.items || [])

  const totals = calculateTotals(items)

  const handleSubmit = (e) => {

    e.preventDefault()

    onSubmit({
      clientName,
      items,
      ...totals
    })

  }

  return (

    <form onSubmit={handleSubmit} className="space-y-6">

      {/* CLIENT */}

      <Input
        label="Client Name"
        value={clientName}
        onChange={(e)=>setClientName(e.target.value)}
        placeholder="Enter client name"
      />

      {/* ITEMS */}

      <InvoiceItems
        items={items}
        setItems={setItems}
      />

      {/* TOTAL CARD */}

      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-xl border text-sm space-y-1">

        <p>Subtotal: ₹{totals.subtotal}</p>

        <p>GST (18%): ₹{totals.gst}</p>

        <p className="font-bold text-lg text-indigo-700">
          Total: ₹{totals.total}
        </p>

      </div>

      {/* SUBMIT */}

      <Button type="submit" full>
        Save Invoice
      </Button>

    </form>

  )

}
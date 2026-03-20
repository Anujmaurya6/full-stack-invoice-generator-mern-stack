import InvoiceForm from "./InvoiceForm";

export default function InvoiceEdit({ invoice, onUpdate }) {

  return (

    <div className="bg-white p-6 rounded-2xl shadow-lg border">

      <h2 className="text-xl font-semibold mb-6">
        Edit Invoice
      </h2>

      <InvoiceForm
        initialData={invoice}
        onSubmit={onUpdate}
      />

    </div>

  )

}
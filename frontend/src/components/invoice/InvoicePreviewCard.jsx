export default function InvoicePreviewCard({ data, user, theme }) {

  if(!data){

    return (
      <div className="text-center text-gray-400 py-10">
        AI preview will appear here
      </div>
    )

  }

  return (

    <div className={`rounded-xl border shadow-lg p-6
    ${theme === "color" ? "bg-gradient-to-br from-indigo-50 to-blue-50" : "bg-white"}
    `}>

      {/* COMPANY */}

      <div className="flex justify-between mb-4">

        <div>

          <h3 className="text-xl font-bold">
            {user?.name}
          </h3>

          <p className="text-sm text-gray-500">
            {user?.email}
          </p>

        </div>

        <span className="text-xs bg-indigo-600 text-white px-2 py-1 rounded-full">
          AI Generated
        </span>

      </div>


      {/* CLIENT */}

      <div className="mb-3">

        <p className="text-sm text-gray-500">
          Bill To
        </p>

        <p className="font-semibold">
          {data.clientName}
        </p>

      </div>


      {/* ITEMS */}

      <div className="border rounded-lg overflow-hidden">

        {data.items?.map((item,i)=>(

          <div
            key={i}
            className="flex justify-between px-3 py-2 border-b text-sm"
          >

            <span>{item.name}</span>

            <span>
              {item.quantity} × ₹{item.price}
            </span>

          </div>

        ))}

      </div>


      {/* TOTAL */}

      <div className="mt-4 space-y-1 text-sm">

        <p>
          Subtotal: ₹ {data.amount}
        </p>

        {data.gst && (

          <p>
            GST: ₹ {data.gst}
          </p>

        )}

        {data.finalAmount && (

          <p className="font-bold text-lg text-indigo-700">
            Final: ₹ {data.finalAmount}
          </p>

        )}

      </div>


      {/* STATUS */}

      <div className="mt-3">

        <span className="text-xs px-2 py-1 bg-gray-200 rounded-full">

          {data.status}

        </span>

      </div>

    </div>

  )

}
import StatusBadge from "../dashboard/StatusBadge"
import { formatCurrency } from "../../utils/formatCurrency"

export default function InvoiceTable({ data, onEdit }) {

  return (

    <div className="bg-white p-6 rounded-2xl shadow border">

      <h3 className="mb-4 font-semibold text-lg">
        All Invoices
      </h3>

      <table className="w-full text-sm">

        <thead className="text-gray-500 border-b">

          <tr>

            <th className="text-left py-2">
              Client
            </th>

            <th>
              Amount
            </th>

            <th>
              Status
            </th>

            <th>
              Action
            </th>

          </tr>

        </thead>

        <tbody>

          {data.map(inv=>(

            <tr key={inv._id} className="border-b hover:bg-gray-50">

              <td className="py-3">
                {inv.clientName}
              </td>

              <td>
                {formatCurrency(inv.total)}
              </td>

              <td>
                <StatusBadge status={inv.status}/>
              </td>

              <td>

                <button
                  onClick={()=>onEdit(inv._id)}
                  className="text-indigo-600 hover:underline"
                >
                  Edit
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  )

}
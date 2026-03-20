export default function CurrencySelector({ value, onChange }) {

  return (

    <div className="flex items-center gap-2">

      <span className="text-sm text-gray-500">
        Currency
      </span>

      <select
        value={value}
        onChange={onChange}
        className="border border-gray-300 p-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
      >

        <option value="INR">₹ INR</option>
        <option value="USD">$ USD</option>

      </select>

    </div>

  )

}
export default function StatCard({ title, value, icon, color, trend, trendValue }) {
  const colorClasses = {
    purple: "bg-purple-100 text-purple-600",
    green: "bg-green-100 text-green-600",
    orange: "bg-orange-100 text-orange-600",
    blue: "bg-blue-100 text-blue-600",
    red: "bg-red-100 text-red-600",
    indigo: "bg-indigo-100 text-indigo-600",
  };

  const selectedColor = colorClasses[color] || colorClasses.blue;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg hover:scale-105 transition-all duration-300">

      <div className="flex justify-between items-start mb-4">
        
        <div className={`w-12 h-12 flex items-center justify-center rounded-xl ${selectedColor} shadow-sm`}>
          {icon}
        </div>

        {(trend || trendValue) && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
            trend === 'up' 
              ? 'bg-green-100 text-green-600' 
              : trend === 'down'
              ? 'bg-red-100 text-red-600'
              : 'bg-gray-100 text-gray-600'
          }`}>
            {trend === 'up' && '↗'} 
            {trend === 'down' && '↘'}
            {trendValue || '+8.5%'}
          </span>
        )}

      </div>

      <div>
        <p className="text-gray-500 text-sm font-medium mb-1">
          {title}
        </p>
        <h2 className="text-3xl font-bold text-gray-800">
          {value}
        </h2>
      </div>

    </div>
  );
}

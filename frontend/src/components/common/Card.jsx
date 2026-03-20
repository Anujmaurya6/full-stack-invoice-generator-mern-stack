export default function Card({
  children,
  className = "",
  title,
}) {
  return (
    <div className={`bg-white rounded-2xl shadow border p-6 ${className}`}>

      {title && (
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {title}
        </h3>
      )}

      {children}

    </div>
  );
}

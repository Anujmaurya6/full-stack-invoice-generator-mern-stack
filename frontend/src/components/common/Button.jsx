export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  full = false,
  className = "",
}) {
  const base = "px-4 py-2 rounded-xl font-medium transition";

  const variants = {
    primary:
      "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:scale-105 shadow",
    secondary:
      "bg-gray-100 text-gray-700 hover:bg-gray-200",
    danger:
      "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${
        full ? "w-full" : ""
      } ${className}`}
    >
      {children}
    </button>
  );
}

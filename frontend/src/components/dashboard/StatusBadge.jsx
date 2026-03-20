export default function StatusBadge({ status, size = "md" }) {
  const styles = {
    Paid: {
      bg: "bg-green-100",
      text: "text-green-700",
      border: "border-green-200",
      dot: "bg-green-500",
    },
    Unpaid: {
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      border: "border-yellow-200",
      dot: "bg-yellow-500",
    },
    Draft: {
      bg: "bg-gray-100",
      text: "text-gray-700",
      border: "border-gray-200",
      dot: "bg-gray-500",
    },
    Overdue: {
      bg: "bg-red-100",
      text: "text-red-700",
      border: "border-red-200",
      dot: "bg-red-500",
    },
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-xs",
    lg: "px-4 py-1.5 text-sm",
  };

  const style = styles[status] || styles.Draft;
  const sizeClass = sizeClasses[size] || sizeClasses.md;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${style.bg} ${style.text} ${style.border} ${sizeClass} transition-all`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${style.dot} ${
          status === "Unpaid" ? "animate-pulse" : ""
        }`}
      ></span>
      {status}
    </span>
  );
}

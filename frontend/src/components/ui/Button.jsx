export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
  disabled = false,
}) {
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",

    secondary: "bg-gray-600 text-white hover:bg-gray-700",

    success: "bg-green-600 text-white hover:bg-green-700",

    danger: "bg-red-600 text-white hover:bg-red-700",

    warning: "bg-yellow-500 text-white hover:bg-yellow-600",

    outline:
      "border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white",

    custom: "",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-6
        py-3
        rounded-lg
        font-semibold
        transition-all
        duration-300
        shadow-md
        hover:shadow-lg
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
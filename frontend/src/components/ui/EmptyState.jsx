export default function EmptyState({
  title = "Nothing Found",
  message = "No data available.",
}) {
  return (
    <div className="text-center py-20">

      <div className="text-7xl mb-4">
        📭
      </div>

      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
        {title}
      </h2>

      <p className="text-gray-600 dark:text-gray-300 mt-3">
        {message}
      </p>

    </div>
  );
}
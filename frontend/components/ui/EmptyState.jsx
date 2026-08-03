export default function EmptyState({
  title = "Nothing Found",
  message = "There is no data available."
}) {
  return (
    <div className="text-center py-20">

      <div className="text-7xl">
        📭
      </div>

      <h2 className="text-3xl font-bold mt-6">
        {title}
      </h2>

      <p className="text-gray-600 mt-4">
        {message}
      </p>

    </div>
  );
}
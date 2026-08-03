export default function SectionTitle({
  title,
  subtitle,
}) {
  return (
    <div className="text-center mb-12">

      <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
        {title}
      </h2>

      {subtitle && (
        <p className="text-gray-600 dark:text-gray-300 mt-4 text-lg">
          {subtitle}
        </p>
      )}

    </div>
  );
}
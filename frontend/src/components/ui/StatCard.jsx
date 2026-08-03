import { motion } from "framer-motion";

export default function StatCard({
  icon,
  title,
  value,
}) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="
        bg-white
        dark:bg-slate-800
        rounded-2xl
        shadow-lg
        p-6
        text-center
        transition-colors
      "
    >
      <div className="text-5xl text-blue-600 mb-4">
        {icon}
      </div>

      <h3 className="text-4xl font-bold text-gray-900 dark:text-white">
        {value}
      </h3>

      <p className="text-gray-600 dark:text-gray-300 mt-2">
        {title}
      </p>
    </motion.div>
  );
}
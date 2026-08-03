import { motion } from "framer-motion";

export default function StatCard({
  icon,
  title,
  value,
}) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl shadow-lg p-6 text-center"
    >
      <div className="text-5xl text-blue-600 mb-4">
        {icon}
      </div>

      <h3 className="text-4xl font-bold">
        {value}
      </h3>

      <p className="text-gray-600 mt-2">
        {title}
      </p>
    </motion.div>
  );
}
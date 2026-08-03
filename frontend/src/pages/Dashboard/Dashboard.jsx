import { useEffect, useState } from "react";

import AdminLayout from "../../components/Layout/AdminLayout";
import { getDashboardStats } from "../../services/dashboard.service";

export default function Dashboard() {
  const [stats, setStats] = useState({
    modules: 0,
    lessons: 0,
    expressions: 0,
    videos: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <AdminLayout>

      <h1 className="text-4xl font-bold mb-2">
        Dashboard
      </h1>

      <p className="text-gray-600 mb-8">
        Welcome to Guru Siap Ngajar Admin Panel.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <div className="bg-blue-600 text-white rounded-xl shadow-lg p-6 hover:scale-105 transition">

          <h2 className="text-lg font-semibold">
            📚 Modules
          </h2>

          <p className="text-5xl font-bold mt-4">
            {stats.modules}
          </p>

        </div>

        <div className="bg-green-600 text-white rounded-xl shadow-lg p-6 hover:scale-105 transition">

          <h2 className="text-lg font-semibold">
            📖 Lessons
          </h2>

          <p className="text-5xl font-bold mt-4">
            {stats.lessons}
          </p>

        </div>

        <div className="bg-yellow-500 text-white rounded-xl shadow-lg p-6 hover:scale-105 transition">

          <h2 className="text-lg font-semibold">
            💬 Expressions
          </h2>

          <p className="text-5xl font-bold mt-4">
            {stats.expressions}
          </p>

        </div>

        <div className="bg-red-600 text-white rounded-xl shadow-lg p-6 hover:scale-105 transition">

          <h2 className="text-lg font-semibold">
            🎥 Videos
          </h2>

          <p className="text-5xl font-bold mt-4">
            {stats.videos}
          </p>

        </div>

      </div>

    </AdminLayout>
  );
}
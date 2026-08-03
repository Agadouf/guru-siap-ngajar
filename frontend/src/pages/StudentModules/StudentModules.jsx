import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import StudentLayout from "../../components/Layout/StudentLayout/StudentLayout";
import { getModules } from "../../services/module.service";

export default function StudentModules() {
  const [modules, setModules] = useState([]);

  useEffect(() => {
    loadModules();
  }, []);

  async function loadModules() {
    try {
      const data = await getModules();
      setModules(data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <StudentLayout>

      <div className="mb-10">

        <h1 className="text-5xl font-bold text-center">
          Learning Modules
        </h1>

        <p className="text-center text-gray-600 mt-4">
          Select a module to start learning English.
        </p>

      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

        {modules.map((module) => (

          <Link
            key={module.id}
            to={`/modules/${module.id}/lessons`}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl hover:-translate-y-2 transition duration-300"
          >

            <div className="text-5xl mb-4">
              📚
            </div>

            <h2 className="text-2xl font-bold text-blue-600">
              {module.title}
            </h2>

            <p className="text-gray-600 mt-3">
              {module.description}
            </p>

            <button
              className="mt-6 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
            >
              Open Module →
            </button>

          </Link>

        ))}

      </div>

    </StudentLayout>
  );
}
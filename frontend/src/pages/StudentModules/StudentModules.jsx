
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import StudentLayout from "../../components/Layout/StudentLayout/StudentLayout";
import { getModules } from "../../services/module.service";

export default function StudentModules() console.log("STUDENT MODULES VERSION TEST 123");{
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadModules() {
      try {
        const data = await getModules();

        if (!cancelled) {
          setModules(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to load modules:", err);

        if (!cancelled) {
          setError("Unable to load modules. Please refresh the page.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadModules();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <StudentLayout>
      <div className="mb-8 border-b border-gray-300 pb-5">
        <h1 className="text-3xl font-normal text-gray-900 md:text-4xl">
          English Learning
        </h1>

        <p className="mt-3 leading-7 text-gray-600">
          Browse the modules and choose a lesson to begin learning English.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[260px_minmax(0,1fr)]">
        <aside>
          <h2 className="border-b-2 border-blue-800 pb-3 text-lg font-bold text-gray-900">
            Learning Modules
          </h2>

          {loading && (
            <p className="py-4 text-sm text-gray-500">
              Loading modules...
            </p>
          )}

          {error && (
            <p className="py-4 text-sm text-red-600">{error}</p>
          )}

          {!loading && !error && modules.length === 0 && (
            <p className="py-4 text-sm text-gray-500">
              No modules available.
            </p>
          )}

          <ul>
            {modules.map((module) => (
              <li key={module.id} className="border-b border-gray-300">
                <Link
                  to={`/modules/${module.id}/lessons`}
                  className="flex items-center justify-between gap-3 px-3 py-4 text-sm text-gray-800 transition-colors hover:bg-blue-50 hover:text-blue-900"
                >
                  <span>{module.title}</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <main className="min-w-0">
          <h2 className="border-b border-gray-300 pb-4 text-2xl font-normal text-gray-900 md:text-3xl">
            Welcome to English Learning
          </h2>

          <p className="mt-5 leading-7 text-gray-700">
            Select a module from the left to view its lessons.
          </p>
        </main>
      </div>
    </StudentLayout>
  );
}

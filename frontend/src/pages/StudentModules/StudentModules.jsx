import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import StudentLayout from "../../components/Layout/StudentLayout/StudentLayout";
import { getModules } from "../../services/module.service";
import { getLessons } from "../../services/lesson.service";

export default function StudentModules() {
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [expandedModule, setExpandedModule] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function loadModules() {
      try {
        const data = await getModules();
        setModules(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load modules:", error);
        setError("Unable to load modules. Please refresh the page.");
      }
    }

    loadModules();
  }, []);

  async function handleModuleClick(module) {
    if (expandedModule === module.id) {
      setExpandedModule(null);
      setLessons([]);
      setSelectedLesson(null);
      return;
    }

    setExpandedModule(module.id);
    setLessons([]);
    setSelectedLesson(null);
    setLoadingLessons(true);
    setError("");

    try {
      const data = await getLessons(module.id);
      setLessons(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load lessons:", error);
      setError("Unable to load lessons for this module.");
    } finally {
      setLoadingLessons(false);
    }
  }

  return (
    <StudentLayout>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">
          English Learning
        </h1>
        <p className="text-gray-600 mt-2">
          Select a module to explore its lessons and start learning English.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[280px_minmax(0,1fr)] gap-6">
        <aside className="bg-white border border-gray-200 rounded-lg p-4 h-fit shadow-sm">
          <h2 className="text-lg font-bold mb-4">Learning Modules</h2>

          {modules.length === 0 && !error && (
            <p className="text-gray-500 text-sm">
              No modules available yet.
            </p>
          )}

          <div className="space-y-2">
            {modules.map((module) => {
              const isExpanded = expandedModule === module.id;

              return (
                <div
                  key={module.id}
                  className="border-b border-gray-100 pb-2"
                >
                  <button
                    type="button"
                    onClick={() => handleModuleClick(module)}
                    aria-expanded={isExpanded}
                    className={`w-full flex items-start justify-between gap-3 text-left p-3 rounded-md transition ${
                      isExpanded
                        ? "bg-blue-50 text-blue-800"
                        : "hover:bg-gray-50 text-gray-800"
                    }`}
                  >
                    <span className="font-semibold">
                      📚 {module.title}
                    </span>
                    <span aria-hidden="true">
                      {isExpanded ? "−" : "+"}
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="mt-2 ml-3 pl-3 border-l-2 border-blue-200">
                      {loadingLessons ? (
                        <p className="text-sm text-gray-500 py-2">
                          Loading lessons...
                        </p>
                      ) : lessons.length > 0 ? (
                        <ul className="space-y-1">
                          {lessons.map((lesson) => (
                            <li key={lesson.id}>
                              <button
                                type="button"
                                onClick={() => setSelectedLesson(lesson)}
                                className={`w-full text-left text-sm rounded-md px-3 py-2 transition ${
                                  selectedLesson?.id === lesson.id
                                    ? "bg-blue-100 text-blue-800 font-semibold"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-blue-700"
                                }`}
                              >
                                {lesson.title}
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500 py-2">
                          No lessons found in this module.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        <main className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-sm min-h-[300px]">
          {error ? (
            <p className="text-red-600">{error}</p>
          ) : selectedLesson ? (
            <>
              <p className="text-sm text-blue-600 font-semibold mb-2">
                SELECTED LESSON
              </p>

              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                {selectedLesson.title}
              </h2>

              {selectedLesson.description && (
                <p className="text-gray-600 mt-4 leading-7">
                  {selectedLesson.description}
                </p>
              )}

              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/modules/${expandedModule}/lessons`
                  )
                }
                className="mt-6 inline-flex items-center bg-blue-600 text-white px-5 py-3 rounded-md hover:bg-blue-700 transition"
              >
                Open Lesson Content →
              </button>
            </>
          ) : (
            <div className="flex flex-col justify-center min-h-[250px]">
              <h2 className="text-2xl font-bold text-gray-800">
                Welcome to English Learning
              </h2>
              <p className="text-gray-600 mt-3 leading-7">
                Choose a module from the sidebar. Its lessons will appear
                directly underneath it. Select a lesson to see its details.
              </p>
            </div>
          )}
        </main>
      </div>
    </StudentLayout>
  );
}

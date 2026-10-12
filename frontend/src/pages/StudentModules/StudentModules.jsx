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
  const [loadingModules, setLoadingModules] = useState(true);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

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
          setLoadingModules(false);
        }
      }
    }

    loadModules();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleModuleClick(module) {
    if (expandedModule === module.id) {
      setExpandedModule(null);
      setLessons([]);
      setSelectedLesson(null);
      setError("");
      return;
    }

    // Close the previous module and open only the clicked module.
    setExpandedModule(module.id);
    setLessons([]);
    setSelectedLesson(null);
    setLoadingLessons(true);
    setError("");

    try {
      const data = await getLessons(module.id);

      // Ignore results if the user has already opened another module.
      setLessons(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error("Failed to load lessons:", err);
      setError("Unable to load lessons. Please try again.");
    } finally {
      setLoadingLessons(false);
    }
  }

  function openLesson(lesson) {
    setSelectedLesson(lesson);
  }

  return (
    <StudentLayout>
      <div className="mb-8 border-b border-gray-300 pb-5">
        <h1 className="text-3xl md:text-4xl font-normal text-gray-900">
          English Learning
        </h1>

        <p className="mt-3 text-gray-600 leading-7">
          Explore the learning modules and select a lesson to begin.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[260px_minmax(0,1fr)] gap-8">
        {/* LEFT SIDEBAR */}
        <aside className="min-w-0">
          <h2 className="text-lg font-bold text-gray-900 pb-3 border-b-2 border-blue-800">
            Learning Modules
          </h2>

          {loadingModules && (
            <p className="py-4 text-sm text-gray-500">
              Loading modules...
            </p>
          )}

          {!loadingModules && modules.length === 0 && !error && (
            <p className="py-4 text-sm text-gray-500">
              No modules are available yet.
            </p>
          )}

          <div>
            {modules.map((module) => {
              const isExpanded = expandedModule === module.id;

              return (
                <section
                  key={module.id}
                  className="border-b border-gray-300"
                >
                  <button
                    type="button"
                    onClick={() => handleModuleClick(module)}
                    aria-expanded={isExpanded}
                    className={`w-full flex items-start justify-between gap-3 py-3 px-2 text-left text-sm transition-colors ${
                      isExpanded
                        ? "bg-blue-50 text-blue-900 font-semibold"
                        : "text-gray-800 hover:bg-gray-100"
                    }`}
                  >
                    <span>{module.title}</span>

                    <span
                      aria-hidden="true"
                      className="text-lg leading-4"
                    >
                      {isExpanded ? "−" : "+"}
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="pb-3 pl-4 pr-2">
                      {loadingLessons ? (
                        <p className="py-2 text-sm text-gray-500">
                          Loading lessons...
                        </p>
                      ) : error ? (
                        <p className="py-2 text-sm text-red-600">
                          {error}
                        </p>
                      ) : lessons.length > 0 ? (
                        <ul className="border-l-2 border-blue-200">
                          {lessons.map((lesson) => (
                            <li key={lesson.id}>
                              <button
                                type="button"
                                onClick={() => openLesson(lesson)}
                                className={`block w-full text-left py-2 px-3 text-sm transition-colors ${
                                  selectedLesson?.id === lesson.id
                                    ? "bg-blue-100 text-blue-900 font-semibold"
                                    : "text-gray-700 hover:text-blue-800 hover:bg-gray-50"
                                }`}
                              >
                                {lesson.title}
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="py-2 text-sm text-gray-500">
                          No lessons found in this module.
                        </p>
                      )}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="min-w-0">
          {selectedLesson ? (
            <article>
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-800 mb-3">
                Selected Lesson
              </p>

              <h2 className="text-2xl md:text-3xl font-normal text-gray-900 border-b border-gray-300 pb-4">
                {selectedLesson.title}
              </h2>

              {selectedLesson.description && (
                <p className="mt-5 text-gray-700 leading-7">
                  {selectedLesson.description}
                </p>
              )}

              <p className="mt-5 text-gray-600 leading-7">
                Select Open Lesson Content to access the lesson and its
                learning materials.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate(`/modules/${expandedModule}/lessons`)
                }
                className="mt-5 inline-block bg-blue-800 text-white px-5 py-3 text-sm hover:bg-blue-900 transition-colors"
              >
                Open Lesson Content →
              </button>
            </article>
          ) : (
            <article>
              <h2 className="text-2xl md:text-3xl font-normal text-gray-900 border-b border-gray-300 pb-4">
                Welcome to English Learning
              </h2>

              <p className="mt-5 text-gray-700 leading-7">
                Choose a module from the menu on the left. Only the lessons
                belonging to the selected module will appear underneath it.
              </p>

              <p className="mt-3 text-gray-700 leading-7">
                Select a lesson to view its details and continue learning.
              </p>
            </article>
          )}
        </main>
      </div>
    </StudentLayout>
  );
}

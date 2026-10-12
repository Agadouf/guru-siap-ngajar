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
    // Close the currently open module if it is clicked again.
    if (expandedModule === module.id) {
      setExpandedModule(null);
      setLessons([]);
      setSelectedLesson(null);
      setError("");
      return;
    }

    // Open only the clicked module.
    setExpandedModule(module.id);
    setLessons([]);
    setSelectedLesson(null);
    setLoadingLessons(true);
    setError("");

    try {
      const data = await getLessons(module.id);

      // Keep only lessons belonging to the selected module.
      const allLessons = Array.isArray(data) ? data : [];

      const filteredLessons = allLessons.filter((lesson) => {
        const lessonModuleId =
          lesson.moduleId ??
          lesson.module_id ??
          lesson.module?.id;

        // If the API does not return a module ID, keep the lesson
        // only when the service has already filtered by module.
        if (lessonModuleId == null) {
          return false;
        }

        return String(lessonModuleId) === String(module.id);
      });

      // Ignore outdated results if another module was selected.
      setLessons((current) =>
        expandedModule === module.id ? filteredLessons : current
      );
    } catch (err) {
      console.error("Failed to load lessons:", err);
      setError("Unable to load lessons. Please try again.");
    } finally {
      setLoadingLessons(false);
    }
  }

  function handleLessonClick(lesson) {
    setSelectedLesson(lesson);
  }

  return (
    <StudentLayout>
      <div className="mb-8 border-b border-gray-300 pb-5">
        <h1 className="text-3xl md:text-4xl font-normal text-gray-900">
          English Learning
        </h1>

        <p className="mt-3 text-gray-600 leading-7">
          Browse the modules and choose a lesson to begin learning English.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[260px_minmax(0,1fr)] gap-8">
        {/* LEFT NAVIGATION */}
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
              No modules available.
            </p>
          )}

          {error && (
            <p className="py-3 text-sm text-red-600">{error}</p>
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
                    aria-expanded={isExpanded}
                    onClick={() => handleModuleClick(module)}
                    className={`flex w-full items-start justify-between gap-3 px-2 py-3 text-left text-sm transition-colors ${
                      isExpanded
                        ? "bg-blue-50 text-blue-900 font-semibold"
                        : "text-gray-800 hover:bg-gray-100"
                    }`}
                  >
                    <span>{module.title}</span>
                    <span aria-hidden="true">
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
                                onClick={() => handleLessonClick(lesson)}
                                className={`block w-full px-3 py-2 text-left text-sm transition-colors ${
                                  selectedLesson?.id === lesson.id
                                    ? "bg-blue-100 text-blue-900 font-semibold"
                                    : "text-gray-700 hover:bg-gray-50 hover:text-blue-800"
                                }`}
                              >
                                {lesson.title}
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="py-2 text-sm text-gray-500">
                          No lessons found for this module.
                        </p>
                      )}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        </aside>

        {/* MAIN READING AREA */}
        <main className="min-w-0">
          {selectedLesson ? (
            <article>
              <h2 className="border-b border-gray-300 pb-4 text-2xl md:text-3xl font-normal text-gray-900">
                {selectedLesson.title}
              </h2>

              {selectedLesson.description && (
                <p className="mt-5 leading-7 text-gray-700">
                  {selectedLesson.description}
                </p>
              )}

              <p className="mt-5 leading-7 text-gray-600">
                Open the lesson to view its learning materials, expressions,
                translations, explanations, and videos.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate(`/modules/${expandedModule}/lessons`)
                }
                className="mt-5 bg-blue-800 px-5 py-3 text-sm text-white transition-colors hover:bg-blue-900"
              >
                Open Lesson Content →
              </button>
            </article>
          ) : (
            <article>
              <h2 className="border-b border-gray-300 pb-4 text-2xl md:text-3xl font-normal text-gray-900">
                Welcome to English Learning
              </h2>

              <p className="mt-5 leading-7 text-gray-700">
                Select a module from the left navigation. Only that module's
                lessons will be displayed underneath it.
              </p>

              <p className="mt-3 leading-7 text-gray-700">
                Select a lesson to view its details and continue learning.
              </p>
            </article>
          )}
        </main>
      </div>
    </StudentLayout>
  );
}

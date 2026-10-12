
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import StudentLayout from "../../components/Layout/StudentLayout/StudentLayout";
import { getModules } from "../../services/module.service";
import { getLessons } from "../../services/lesson.service";

function getLessonModuleId(lesson) {
  return (
    lesson.moduleId ??
    lesson.module_id ??
    lesson.module?.id ??
    ""
  );
}

export default function StudentModules() {
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [expandedModule, setExpandedModule] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loadingModules, setLoadingModules] = useState(true);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [error, setError] = useState("");

  const requestId = useRef(0);
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
    const moduleId = String(module.id);

    if (String(expandedModule) === moduleId) {
      requestId.current += 1;
      setExpandedModule(null);
      setLessons([]);
      setSelectedLesson(null);
      setLoadingLessons(false);
      setError("");
      return;
    }

    const currentRequestId = ++requestId.current;

    setExpandedModule(module.id);
    setLessons([]);
    setSelectedLesson(null);
    setLoadingLessons(true);
    setError("");

    try {
      // Use the same module-specific route as the Home page.
      // This verifies that the selected module has lessons.
      const data = await getLessons();
      const allLessons = Array.isArray(data) ? data : [];

      const matchingLessons = allLessons.filter((lesson) => {
        const lessonModuleId = getLessonModuleId(lesson);

        return (
          lessonModuleId !== "" &&
          String(lessonModuleId) === moduleId
        );
      });

      if (currentRequestId !== requestId.current) {
        return;
      }

      setLessons(matchingLessons);
    } catch (err) {
      console.error("Failed to load lessons:", err);

      if (currentRequestId === requestId.current) {
        setError("Unable to load lessons. Please try again.");
      }
    } finally {
      if (currentRequestId === requestId.current) {
        setLoadingLessons(false);
      }
    }
  }

  function handleLessonClick(lesson) {
    setSelectedLesson(lesson);
  }

  const visibleLessons = lessons.filter(
    (lesson) =>
      String(getLessonModuleId(lesson)) === String(expandedModule)
  );

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
        <aside className="min-w-0">
          <h2 className="border-b-2 border-blue-800 pb-3 text-lg font-bold text-gray-900">
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

          <div>
            {modules.map((module) => {
              const isExpanded =
                String(expandedModule) === String(module.id);

              return (
                <section
                  key={module.id}
                  className="border-b border-gray-300"
                >
                <button
  type="button"
  onClick={() => navigate(`/modules/${module.id}/lessons`)}
  className="flex w-full items-start justify-between gap-3 px-2 py-3 text-left text-sm text-gray-800 transition-colors hover:bg-gray-100"
>
  <span>{module.title}</span>
  <span aria-hidden="true">→</span>
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
                      ) : visibleLessons.length > 0 ? (
                        <ul className="border-l-2 border-blue-200">
                          {visibleLessons.map((lesson) => (
                            <li key={lesson.id}>
                              <button
                                type="button"
                                onClick={() => handleLessonClick(lesson)}
                                className={`block w-full px-3 py-2 text-left text-sm transition-colors ${
                                  String(selectedLesson?.id) ===
                                  String(lesson.id)
                                    ? "bg-blue-100 font-semibold text-blue-900"
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

        <main className="min-w-0">
          {selectedLesson ? (
            <article>
              <h2 className="border-b border-gray-300 pb-4 text-2xl font-normal text-gray-900 md:text-3xl">
                {selectedLesson.title}
              </h2>

              {selectedLesson.description && (
                <p className="mt-5 leading-7 text-gray-700">
                  {selectedLesson.description}
                </p>
              )}

              <p className="mt-5 leading-7 text-gray-600">
                Open this lesson to view its expressions, translations,
                explanations, and learning videos.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate(`/lessons/${selectedLesson.id}/expressions`)
                }
                className="mt-5 bg-blue-800 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-900"
              >
                Open Lesson Content →
              </button>
            </article>
          ) : (
            <article>
              <h2 className="border-b border-gray-300 pb-4 text-2xl font-normal text-gray-900 md:text-3xl">
                Welcome to English Learning
              </h2>

              <p className="mt-5 leading-7 text-gray-700">
                Select a module from the left navigation to view its lessons.
              </p>

              <p className="mt-3 leading-7 text-gray-700">
                Then select a lesson to see its details and learning materials.
              </p>
            </article>
          )}
        </main>
      </div>
    </StudentLayout>
  );
}

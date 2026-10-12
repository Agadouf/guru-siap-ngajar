
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import StudentLayout from "../../components/Layout/StudentLayout/StudentLayout";
import { getLessons } from "../../services/lesson.service";

export default function StudentLessons() {
  const { moduleId } = useParams();

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadLessons() {
      setLoading(true);
      setError("");

      try {
        const data = await getLessons(moduleId);

        if (!cancelled) {
          setLessons(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to load lessons:", err);

        if (!cancelled) {
          setError("Unable to load lessons. Please refresh the page.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadLessons();

    return () => {
      cancelled = true;
    };
  }, [moduleId]);

  return (
    <StudentLayout>
      <div className="mb-10">
        <Link
          to="/modules"
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-900"
        >
          ← Back to Modules
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Lessons
        </h1>

        <p className="mt-2 text-gray-600">
          Select a lesson to explore its English expressions and learning videos.
        </p>
      </div>

      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-gray-500">
          Loading lessons...
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
          <p>{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-white hover:bg-red-800"
          >
            Try Again
          </button>
        </div>
      ) : lessons.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
          <div className="mb-3 text-4xl">📚</div>
          <h2 className="text-xl font-semibold text-gray-900">
            No lessons yet
          </h2>
          <p className="mt-2 text-gray-600">
            There are no lessons available in this module yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {lessons.map((lesson) => (
            <Link
              key={lesson.id}
              to={`/lessons/${lesson.id}/expressions`}
              className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-2xl">
                📖
              </div>

              <h2 className="text-xl font-bold text-gray-900 transition group-hover:text-blue-700">
                {lesson.title}
              </h2>

              <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
                {lesson.description || "Explore the expressions in this lesson."}
              </p>

              <div className="mt-6 font-semibold text-blue-700">
                Open Lesson →
              </div>
            </Link>
          ))}
        </div>
      )}
    </StudentLayout>
  );
}

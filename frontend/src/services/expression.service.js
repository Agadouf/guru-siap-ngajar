
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

import AdminLayout from "../../components/Layout/AdminLayout";
import {
  getExpressions,
  createExpression,
  updateExpression,
  deleteExpression,
} from "../../services/expression.service";
import { getLessons } from "../../services/lesson.service";
import { getModules } from "../../services/module.service";
import { uploadVideo } from "../../services/upload.service";

const getLessonId = (expression) =>
  expression.lessonId ??
  expression.lesson_id ??
  expression.lesson?.id ??
  "";

const getModuleId = (lesson) =>
  lesson.moduleId ??
  lesson.module_id ??
  lesson.module?.id ??
  "";

export default function Expressions() {
  const navigate = useNavigate();
  const { lessonId } = useParams();

  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [expressions, setExpressions] = useState([]);

  const [selectedModule, setSelectedModule] = useState("");
  const [selectedLesson, setSelectedLesson] = useState(lessonId || "");
  const [search, setSearch] = useState("");

  const [english, setEnglish] = useState("");
  const [indonesian, setIndonesian] = useState("");
  const [explanation, setExplanation] = useState("");
  const [video, setVideo] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewVideo, setPreviewVideo] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);

    try {
      const [moduleData, lessonData, expressionData] =
        await Promise.all([
          getModules(),
          getLessons(),
          getExpressions(),
        ]);

      setModules(Array.isArray(moduleData) ? moduleData : []);
      setLessons(Array.isArray(lessonData) ? lessonData : []);
      setExpressions(
        Array.isArray(expressionData) ? expressionData : []
      );
    } catch (error) {
      console.error("Failed to load expressions:", error);
      toast.error("Failed to load expression data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (lessonId) {
      setSelectedLesson(String(lessonId));
    }
  }, [lessonId]);

  const filteredLessons = useMemo(
    () =>
      lessons.filter(
        (lesson) =>
          !selectedModule ||
          String(getModuleId(lesson)) === String(selectedModule)
      ),
    [lessons, selectedModule]
  );

  const filteredExpressions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return expressions.filter((expression) => {
      const expressionLessonId = String(getLessonId(expression));

      if (
        selectedLesson &&
        expressionLessonId !== String(selectedLesson)
      ) {
        return false;
      }

      if (selectedModule) {
        const lesson = lessons.find(
          (item) => String(item.id) === expressionLessonId
        );

        if (
          !lesson ||
          String(getModuleId(lesson)) !== String(selectedModule)
        ) {
          return false;
        }
      }

      if (query) {
        const searchableText = [
          expression.english,
          expression.indonesian,
          expression.explanation,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (!searchableText.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [expressions, lessons, selectedModule, selectedLesson, search]);

  function resetForm() {
    setEditingId(null);
    setEnglish("");
    setIndonesian("");
    setExplanation("");
    setVideo(null);

    if (!lessonId) {
      setSelectedLesson("");
      setSelectedModule("");
    }
  }

  function handleModuleChange(value) {
    setSelectedModule(value);
    setSelectedLesson("");
    setEditingId(null);
    setEnglish("");
    setIndonesian("");
    setExplanation("");
    setVideo(null);
  }

  function handleLessonChange(value) {
    setSelectedLesson(value);
    setEditingId(null);
    setEnglish("");
    setIndonesian("");
    setExplanation("");
    setVideo(null);
  }

  async function handleSave(event) {
    event.preventDefault();

    if (!selectedLesson) {
      toast.error("Please select a lesson.");
      return;
    }

    if (!english.trim()) {
      toast.error("English expression is required.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        english: english.trim(),
        indonesian: indonesian.trim(),
        explanation: explanation.trim(),
        lessonId: selectedLesson,
      };

      let savedExpression;

      if (editingId !== null) {
        savedExpression = await updateExpression(editingId, payload);
      } else {
        savedExpression = await createExpression(payload);
      }

      if (video) {
        if (!savedExpression?.id) {
          throw new Error(
            "Expression saved, but its ID was not returned for video upload."
          );
        }

        await uploadVideo(savedExpression.id, video);
      }

      toast.success(
        editingId !== null
          ? "Expression updated successfully."
          : "Expression added successfully."
      );

      resetForm();
      await loadData();
    } catch (error) {
      console.error("Failed to save expression:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to save expression."
      );
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(expression) {
    const expressionLessonId = String(getLessonId(expression));
    const lesson = lessons.find(
      (item) => String(item.id) === expressionLessonId
    );

    setEditingId(expression.id);
    setEnglish(expression.english || "");
    setIndonesian(expression.indonesian || "");
    setExplanation(expression.explanation || "");
    setSelectedLesson(expressionLessonId);
    setVideo(null);

    if (lesson) {
      setSelectedModule(String(getModuleId(lesson)));
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(expression) {
    const result = await Swal.fire({
      title: "Delete Expression?",
      text: `Are you sure you want to delete "${expression.english}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteExpression(expression.id);

      if (String(editingId) === String(expression.id)) {
        resetForm();
      }

      toast.success("Expression deleted successfully.");
      await loadData();
    } catch (error) {
      console.error("Failed to delete expression:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete expression."
      );
    }
  }

  function closePreview() {
    setShowPreview(false);
    setPreviewVideo(null);
  }

  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl space-y-6 pb-10">
        <header className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
          <button
            type="button"
            onClick={() =>
              lessonId ? navigate(-1) : navigate("/admin/modules")
            }
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"
          >
            <span aria-hidden="true">←</span>
            {lessonId ? "Back to Lessons" : "Back to Modules"}
          </button>

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Manage Expressions
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-gray-600 sm:text-base">
                Organize English expressions, Indonesian translations,
                explanations, and learning videos by lesson.
              </p>
            </div>

            <div className="rounded-lg bg-blue-50 px-5 py-3">
              <p className="text-sm text-blue-700">Matching expressions</p>
              <p className="mt-1 text-2xl font-bold text-blue-900">
                {filteredExpressions.length}
              </p>
            </div>
          </div>
        </header>

        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="mb-5 text-lg font-semibold text-gray-900">
            {editingId !== null ? "Edit Expression" : "Add New Expression"}
          </h2>

          <form onSubmit={handleSave} className="space-y-4">
            {!lessonId && (
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="expression-module"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Filter by module
                  </label>
                  <select
                    id="expression-module"
                    value={selectedModule}
                    disabled={editingId !== null}
                    onChange={(event) =>
                      handleModuleChange(event.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 disabled:bg-gray-100"
                  >
                    <option value="">All modules</option>
                    {modules.map((module) => (
                      <option key={module.id} value={module.id}>
                        {module.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="expression-lesson"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Lesson <span className="text-red-600">*</span>
                  </label>
                  <select
                    id="expression-lesson"
                    required
                    value={selectedLesson}
                    disabled={editingId !== null}
                    onChange={(event) =>
                      handleLessonChange(event.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 disabled:bg-gray-100"
                  >
                    <option value="">All lessons / choose a lesson</option>
                    {filteredLessons.map((lesson) => (
                      <option key={lesson.id} value={lesson.id}>
                        {lesson.title}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    Choose a lesson before adding an expression.
                  </p>
                </div>
              </div>
            )}

            {lessonId && (
              <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
                This expression belongs to the selected lesson.
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="expression-english"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  English expression <span className="text-red-600">*</span>
                </label>
                <input
                  id="expression-english"
                  required
                  maxLength={1000}
                  value={english}
                  onChange={(event) => setEnglish(event.target.value)}
                  placeholder="e.g. How are you?"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="expression-indonesian"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Indonesian translation
                </label>
                <input
                  id="expression-indonesian"
                  maxLength={1000}
                  value={indonesian}
                  onChange={(event) => setIndonesian(event.target.value)}
                  placeholder="e.g. Apa kabar?"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="expression-explanation"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Explanation
              </label>
              <textarea
                id="expression-explanation"
                rows={3}
                maxLength={5000}
                value={explanation}
                onChange={(event) => setExplanation(event.target.value)}
                placeholder="Explain how and when to use this expression."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="expression-video"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Learning video
              </label>
              <input
                id="expression-video"
                type="file"
                accept="video/*"
                onChange={(event) =>
                  setVideo(event.target.files?.[0] || null)
                }
                className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:font-medium file:text-blue-700 hover:file:bg-blue-100"
              />
              {video && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected video: {video.name}
                </p>
              )}
              {editingId !== null && !video && (
                <p className="mt-2 text-xs text-gray-500">
                  Leave this empty to keep the existing video.
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingId !== null
                    ? "Save Changes"
                    : "Add Expression"}
              </button>

              {editingId !== null && (
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={saving}
                  className="rounded-lg border border-gray-300 px-5 py-3 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                >
                  Cancel Editing
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Existing Expressions
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Search and manage your learning content.
              </p>
            </div>

            <div className="w-full sm:max-w-sm">
              <label htmlFor="expression-search" className="sr-only">
                Search expressions
              </label>
              <input
                id="expression-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search English or Indonesian..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-600">
                <tr>
                  <th className="px-4 py-4 font-semibold">Module</th>
                  <th className="px-4 py-4 font-semibold">Lesson</th>
                  <th className="px-4 py-4 font-semibold">English</th>
                  <th className="px-4 py-4 font-semibold">Indonesian</th>
                  <th className="px-4 py-4 font-semibold">Video</th>
                  <th className="px-4 py-4 font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-12 text-center text-gray-500"
                    >
                      Loading expressions...
                    </td>
                  </tr>
                ) : filteredExpressions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-12 text-center text-gray-500"
                    >
                      No expressions match your filters.
                    </td>
                  </tr>
                ) : (
                  filteredExpressions.map((expression) => {
                    const expressionLessonId = String(getLessonId(expression));
                    const lesson = lessons.find(
                      (item) => String(item.id) === expressionLessonId
                    );
                    const module = modules.find(
                      (item) =>
                        String(item.id) === String(getModuleId(lesson || {}))
                    );

                    return (
                      <tr
                        key={expression.id}
                        className="align-top transition-colors hover:bg-gray-50"
                      >
                        <td className="max-w-[160px] px-4 py-4 text-sm text-gray-600">
                          {module?.title || "—"}
                        </td>
                        <td className="max-w-[180px] px-4 py-4 text-sm text-gray-600">
                          {lesson?.title || "—"}
                        </td>
                        <td className="max-w-[220px] whitespace-normal break-words px-4 py-4 text-sm font-semibold text-gray-900">
                          {expression.english}
                        </td>
                        <td className="max-w-[220px] whitespace-normal break-words px-4 py-4 text-sm text-gray-700">
                          {expression.indonesian || "—"}
                        </td>
                        <td className="px-4 py-4">
                          {expression.videoUrl ? (
                            <button
                              type="button"
                              onClick={() => {
                                setPreviewVideo(expression.videoUrl);
                                setShowPreview(true);
                              }}
                              className="rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
                            >
                              Preview
                            </button>
                          ) : (
                            <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                              No video
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => handleEdit(expression)}
                              className="rounded-lg bg-amber-500 px-3 py-2 text-sm font-medium text-white hover:bg-amber-600"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(expression)}
                              className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {showPreview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
          onClick={closePreview}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="video-preview-title"
            className="w-full max-w-4xl rounded-xl bg-white p-4 shadow-2xl sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2
                id="video-preview-title"
                className="text-lg font-semibold text-gray-900"
              >
                Video Preview
              </h2>
              <button
                type="button"
                onClick={closePreview}
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Close
              </button>
            </div>

            <video
              src={previewVideo}
              controls
              autoPlay
              className="max-h-[70vh] w-full rounded-lg bg-black"
            />
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

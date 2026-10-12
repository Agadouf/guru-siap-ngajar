import { useCallback, useEffect, useState } from "react";
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

export default function Expressions() {
  const navigate = useNavigate();
  const { lessonId } = useParams();

  const [expressions, setExpressions] = useState([]);
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);

  const [selectedModule, setSelectedModule] = useState("");
  const [selectedLesson, setSelectedLesson] = useState(lessonId || "");

  const [english, setEnglish] = useState("");
  const [indonesian, setIndonesian] = useState("");
  const [explanation, setExplanation] = useState("");
  const [video, setVideo] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [previewVideo, setPreviewVideo] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const loadModules = useCallback(async () => {
    try {
      const data = await getModules();
      setModules(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load modules:", error);
      toast.error("Failed to load modules.");
    }
  }, []);

  const loadLessons = useCallback(async () => {
    try {
      const data = await getLessons();
      setLessons(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load lessons:", error);
      toast.error("Failed to load lessons.");
    }
  }, []);

  const loadExpressions = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getExpressions();
      const allExpressions = Array.isArray(data) ? data : [];

      const filtered = allExpressions.filter((expression) => {
        if (selectedLesson) {
          return (
            String(expression.lessonId ?? expression.lesson_id) ===
            String(selectedLesson)
          );
        }

        if (selectedModule) {
          const lessonIds = lessons
            .filter(
              (lesson) =>
                String(lesson.moduleId ?? lesson.module_id ?? lesson.module?.id) ===
                String(selectedModule)
            )
            .map((lesson) => String(lesson.id));

          return lessonIds.includes(
            String(expression.lessonId ?? expression.lesson_id)
          );
        }

        return true;
      });

      setExpressions(filtered);
    } catch (error) {
      console.error("Failed to load expressions:", error);
      toast.error("Failed to load expressions.");
      setExpressions([]);
    } finally {
      setLoading(false);
    }
  }, [selectedLesson, selectedModule, lessons]);

  useEffect(() => {
    loadModules();
    loadLessons();
  }, [loadModules, loadLessons]);

  useEffect(() => {
    if (lessonId) {
      setSelectedLesson(lessonId);
    }
  }, [lessonId]);

  useEffect(() => {
    loadExpressions();
  }, [loadExpressions]);

  function handleCancel() {
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

    try {
      setSaving(true);

      const payload = {
        english: english.trim(),
        indonesian: indonesian.trim(),
        explanation: explanation.trim(),
        lessonId: selectedLesson,
      };

      let savedExpression;

      if (editingId !== null) {
        savedExpression = await updateExpression(editingId, payload);
        toast.success("Expression updated successfully.");
      } else {
        savedExpression = await createExpression(payload);
        toast.success("Expression added successfully.");
      }

      if (video) {
        if (!savedExpression?.id) {
          throw new Error(
            "The saved expression ID was not returned, so the video could not be uploaded."
          );
        }

        await uploadVideo(savedExpression.id, video);
        toast.success("Video uploaded successfully.");
      }

      handleCancel();
      await loadExpressions();
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
    setEditingId(expression.id);
    setEnglish(expression.english || "");
    setIndonesian(expression.indonesian || "");
    setExplanation(expression.explanation || "");
    setSelectedLesson(String(expression.lessonId ?? expression.lesson_id ?? ""));
    setVideo(null);

    const lesson = lessons.find(
      (item) =>
        String(item.id) ===
        String(expression.lessonId ?? expression.lesson_id)
    );

    if (lesson) {
      setSelectedModule(
        String(lesson.moduleId ?? lesson.module_id ?? lesson.module?.id ?? "")
      );
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
      toast.success("Expression deleted successfully.");

      if (editingId === expression.id) {
        handleCancel();
      }

      await loadExpressions();
    } catch (error) {
      console.error("Failed to delete expression:", error);
      toast.error("Failed to delete expression.");
    }
  }

  const filteredLessons = lessons.filter(
    (lesson) =>
      !selectedModule ||
      String(lesson.moduleId ?? lesson.module_id ?? lesson.module?.id) ===
        String(selectedModule)
  );

  return (
    <AdminLayout>
      <div className="mb-6">
        <button
          type="button"
          onClick={() =>
            lessonId
              ? navigate(-1)
              : navigate("/admin/modules")
          }
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-900"
        >
          <span aria-hidden="true">←</span>
          {lessonId ? "Back to Lessons" : "Back to Modules"}
        </button>

        <h1 className="text-3xl font-bold text-gray-900">
          Manage Expressions
        </h1>

        <p className="mt-2 text-gray-600">
          Add English expressions, Indonesian translations, explanations, and
          learning videos to each lesson.
        </p>
      </div>

      <section className="mb-8 rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="mb-5 text-xl font-semibold text-gray-900">
          {editingId !== null ? "Edit Expression" : "Add New Expression"}
        </h2>

        <form onSubmit={handleSave}>
          {!lessonId && (
            <>
              <label
                htmlFor="expression-module"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Module
              </label>

              <select
                id="expression-module"
                value={selectedModule}
                onChange={(event) => {
                  setSelectedModule(event.target.value);
                  setSelectedLesson("");
                }}
                className="mb-4 w-full rounded-md border border-gray-300 px-4 py-3"
              >
                <option value="">All Modules</option>
                {modules.map((module) => (
                  <option key={module.id} value={module.id}>
                    {module.title}
                  </option>
                ))}
              </select>

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
                onChange={(event) => setSelectedLesson(event.target.value)}
                className="mb-4 w-full rounded-md border border-gray-300 px-4 py-3"
              >
                <option value="">Select a lesson</option>
                {filteredLessons.map((lesson) => (
                  <option key={lesson.id} value={lesson.id}>
                    {lesson.title}
                  </option>
                ))}
              </select>
            </>
          )}

          {lessonId && (
            <div className="mb-4 rounded-md bg-blue-50 p-3 text-sm text-blue-800">
              This expression will belong to the selected lesson.
            </div>
          )}

          <label
            htmlFor="expression-english"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            English Expression <span className="text-red-600">*</span>
          </label>

          <input
            id="expression-english"
            required
            maxLength={1000}
            value={english}
            onChange={(event) => setEnglish(event.target.value)}
            placeholder="Enter the English expression"
            className="mb-4 w-full rounded-md border border-gray-300 px-4 py-3"
          />

          <label
            htmlFor="expression-indonesian"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Indonesian Translation
          </label>

          <input
            id="expression-indonesian"
            maxLength={1000}
            value={indonesian}
            onChange={(event) => setIndonesian(event.target.value)}
            placeholder="Enter the Indonesian translation"
            className="mb-4 w-full rounded-md border border-gray-300 px-4 py-3"
          />

          <label
            htmlFor="expression-explanation"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Explanation
          </label>

          <textarea
            id="expression-explanation"
            rows={4}
            maxLength={5000}
            value={explanation}
            onChange={(event) => setExplanation(event.target.value)}
            placeholder="Explain how and when to use this expression"
            className="mb-4 w-full rounded-md border border-gray-300 px-4 py-3"
          />

          <label
            htmlFor="expression-video"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Video
          </label>

          <input
            id="expression-video"
            type="file"
            accept="video/*"
            onChange={(event) => setVideo(event.target.files?.[0] || null)}
            className="mb-5 block w-full text-sm text-gray-700"
          />

          {video && (
            <p className="mb-4 text-sm text-gray-600">
              Selected video: {video.name}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-blue-700 px-5 py-3 font-medium text-white hover:bg-blue-800 disabled:opacity-60"
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
                onClick={handleCancel}
                disabled={saving}
                className="rounded-md border border-gray-300 px-5 py-3 font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel Editing
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-5 py-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Existing Expressions
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Review, preview, edit, or delete expressions.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead className="bg-gray-50 text-sm text-gray-700">
              <tr>
                <th className="px-4 py-3">Module</th>
                <th className="px-4 py-3">Lesson</th>
                <th className="px-4 py-3">English</th>
                <th className="px-4 py-3">Indonesian</th>
                <th className="px-4 py-3">Video</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-gray-500">
                    Loading expressions...
                  </td>
                </tr>
              ) : expressions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-gray-500">
                    No expressions found for this selection.
                  </td>
                </tr>
              ) : (
                expressions.map((expression) => {
                  const expressionLessonId =
                    expression.lessonId ?? expression.lesson_id;

                  const lesson = lessons.find(
                    (item) => String(item.id) === String(expressionLessonId)
                  );

                  const module = modules.find(
                    (item) =>
                      String(item.id) ===
                      String(
                        lesson?.moduleId ??
                          lesson?.module_id ??
                          lesson?.module?.id
                      )
                  );

                  return (
                    <tr key={expression.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm">
                        {module?.title || "—"}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        {lesson?.title || "—"}
                      </td>
                      <td className="px-4 py-4 text-sm font-medium">
                        {expression.english}
                      </td>
                      <td className="px-4 py-4 text-sm">
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
                            className="rounded-md bg-indigo-700 px-3 py-2 text-sm text-white hover:bg-indigo-800"
                          >
                            Preview
                          </button>
                        ) : (
                          <span className="text-sm text-gray-500">
                            No video
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(expression)}
                            className="rounded-md bg-amber-500 px-3 py-2 text-sm text-white hover:bg-amber-600"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(expression)}
                            className="rounded-md bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
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

      {showPreview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => {
            setShowPreview(false);
            setPreviewVideo(null);
          }}
        >
          <div
            className="w-full max-w-4xl rounded-xl bg-white p-5 sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="mb-4 text-lg font-semibold">Video Preview</h2>

            <video
              src={previewVideo}
              controls
              autoPlay
              className="max-h-[70vh] w-full rounded bg-black"
            />

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowPreview(false);
                  setPreviewVideo(null);
                }}
                className="rounded-md bg-gray-800 px-5 py-2 text-white hover:bg-gray-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

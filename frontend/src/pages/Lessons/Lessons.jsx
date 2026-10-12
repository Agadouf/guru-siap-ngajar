import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

import AdminLayout from "../../components/Layout/AdminLayout";

import {
  getLessons,
  createLesson,
  updateLesson,
  deleteLesson,
} from "../../services/lesson.service";

export default function Lessons() {
  const navigate = useNavigate();
  const { moduleId } = useParams();

  const [lessons, setLessons] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadLessons = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getLessons();
      const allLessons = Array.isArray(data) ? data : [];

      if (moduleId) {
        const filteredLessons = allLessons.filter(
          (lesson) =>
            String(lesson.moduleId ?? lesson.module_id ?? lesson.module?.id) ===
            String(moduleId)
        );

        setLessons(filteredLessons);
      } else {
        setLessons(allLessons);
      }
    } catch (error) {
      console.error("Failed to load lessons:", error);
      toast.error("Failed to load lessons.");
      setLessons([]);
    } finally {
      setLoading(false);
    }
  }, [moduleId]);

  useEffect(() => {
    loadLessons();
  }, [loadLessons]);

  function handleCancel() {
    setEditingId(null);
    setTitle("");
    setDescription("");
  }

  async function handleSave(event) {
    event.preventDefault();

    if (!moduleId) {
      toast.error("Please open a module before managing its lessons.");
      return;
    }

    const cleanTitle = title.trim();
    const cleanDescription = description.trim();

    if (!cleanTitle) {
      toast.error("Lesson title is required.");
      return;
    }

    try {
      setSaving(true);

      const lessonData = {
        title: cleanTitle,
        description: cleanDescription,
        moduleId,
      };

      if (editingId !== null) {
        await updateLesson(editingId, lessonData);
        toast.success("Lesson updated successfully.");
      } else {
        await createLesson(lessonData);
        toast.success("Lesson added successfully.");
      }

      handleCancel();
      await loadLessons();
    } catch (error) {
      console.error("Failed to save lesson:", error);

      toast.error(
        error.response?.data?.message || "Failed to save lesson."
      );
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(lesson) {
    setEditingId(lesson.id);
    setTitle(lesson.title || "");
    setDescription(lesson.description || "");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleDelete(lesson) {
    const result = await Swal.fire({
      title: "Delete Lesson?",
      text: `Are you sure you want to delete "${lesson.title}"? Associated expressions may also be affected.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteLesson(lesson.id);

      toast.success("Lesson deleted successfully.");

      if (editingId === lesson.id) {
        handleCancel();
      }

      await loadLessons();
    } catch (error) {
      console.error("Failed to delete lesson:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to delete lesson. Check whether it contains expressions."
      );
    }
  }

  return (
    <AdminLayout>
      {/* Page heading and navigation */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate("/admin/modules")}
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-900"
        >
          <span aria-hidden="true">←</span>
          Back to Modules
        </button>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {moduleId ? "Manage Module Lessons" : "All Lessons"}
            </h1>

            <p className="mt-2 text-gray-600">
              {moduleId
                ? "Create and manage the lessons belonging to this module."
                : "Choose a module to add or edit its lessons."}
            </p>
          </div>

          <div className="rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-800">
            Total lessons: <strong>{lessons.length}</strong>
          </div>
        </div>
      </div>

      {/* Lesson form */}
      {moduleId ? (
        <section className="mb-8 rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="mb-5 text-xl font-semibold text-gray-900">
            {editingId !== null ? "Edit Lesson" : "Add New Lesson"}
          </h2>

          <form onSubmit={handleSave}>
            <div className="mb-4">
              <label
                htmlFor="lesson-title"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Lesson Title <span className="text-red-600">*</span>
              </label>

              <input
                id="lesson-title"
                type="text"
                maxLength={150}
                required
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Enter lesson title"
                className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="mb-5">
              <label
                htmlFor="lesson-description"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Description
              </label>

              <textarea
                id="lesson-description"
                rows={4}
                maxLength={2000}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Describe what students will learn in this lesson"
                className="w-full resize-y rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />

              <p className="mt-1 text-right text-xs text-gray-500">
                {description.length}/2000 characters
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-md bg-blue-700 px-5 py-3 font-medium text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingId !== null
                    ? "Save Changes"
                    : "Add Lesson"}
              </button>

              {editingId !== null && (
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="rounded-md border border-gray-300 px-5 py-3 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                >
                  Cancel Editing
                </button>
              )}
            </div>
          </form>
        </section>
      ) : (
        <div className="mb-8 rounded-lg border border-blue-200 bg-blue-50 p-5 text-blue-900">
          <h2 className="font-semibold">Select a module first</h2>
          <p className="mt-2 text-sm leading-6">
            Open Modules and click View Lessons next to the module you want
            to manage. This ensures each new lesson belongs to the correct
            module.
          </p>

          <button
            type="button"
            onClick={() => navigate("/admin/modules")}
            className="mt-4 rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
          >
            Go to Modules
          </button>
        </div>
      )}

      {/* Lessons table */}
      <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-5 py-4 sm:px-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {moduleId ? "Lessons in This Module" : "All Lessons"}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Open a lesson to manage its expressions.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left">
            <thead className="bg-gray-50 text-sm text-gray-700">
              <tr>
                <th className="px-5 py-4 font-semibold">Lesson Title</th>
                <th className="px-5 py-4 font-semibold">Description</th>
                <th className="px-5 py-4 text-center font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-5 py-10 text-center text-gray-500"
                  >
                    Loading lessons...
                  </td>
                </tr>
              ) : lessons.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-5 py-10 text-center text-gray-500"
                  >
                    No lessons found for this module. Add your first lesson
                    using the form above.
                  </td>
                </tr>
              ) : (
                lessons.map((lesson) => (
                  <tr key={lesson.id} className="transition hover:bg-gray-50">
                    <td className="px-5 py-4 font-medium text-gray-900">
                      {lesson.title}
                    </td>

                    <td className="max-w-sm whitespace-pre-wrap break-words px-5 py-4 text-sm text-gray-600">
                      {lesson.description || "—"}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex flex-wrap justify-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/lessons/${lesson.id}/expressions`)
                          }
                          className="rounded-md bg-green-700 px-3 py-2 text-sm font-medium text-white hover:bg-green-800"
                        >
                          View Expressions
                        </button>

                        {moduleId && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleEdit(lesson)}
                              className="rounded-md bg-amber-500 px-3 py-2 text-sm font-medium text-white hover:bg-amber-600"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(lesson)}
                              className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  );
}

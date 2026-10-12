import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

import AdminLayout from "../../components/Layout/AdminLayout";

import {
  getModules,
  createModule,
  updateModule,
  deleteModule,
} from "../../services/module.service";

export default function Modules() {
  const navigate = useNavigate();

  const [modules, setModules] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadModules = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getModules();
      setModules(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load modules:", error);
      toast.error("Failed to load modules.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadModules();
  }, [loadModules]);

  function handleCancel() {
    setEditingId(null);
    setTitle("");
    setDescription("");
  }

  async function handleSave(event) {
    event.preventDefault();

    const cleanTitle = title.trim();
    const cleanDescription = description.trim();

    if (!cleanTitle) {
      toast.error("Module title is required.");
      return;
    }

    try {
      setSaving(true);

      if (editingId !== null) {
        await updateModule(editingId, {
          title: cleanTitle,
          description: cleanDescription,
        });

        toast.success("Module updated successfully.");
      } else {
        await createModule({
          title: cleanTitle,
          description: cleanDescription,
        });

        toast.success("Module added successfully.");
      }

      handleCancel();
      await loadModules();
    } catch (error) {
      console.error("Failed to save module:", error);
      toast.error(
        error.response?.data?.message || "Failed to save module."
      );
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(module) {
    setEditingId(module.id);
    setTitle(module.title || "");
    setDescription(module.description || "");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleDelete(module) {
    const result = await Swal.fire({
      title: "Delete Module?",
      text: `Are you sure you want to delete "${module.title}"? Associated content may also be affected.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteModule(module.id);

      toast.success("Module deleted successfully.");

      if (editingId === module.id) {
        handleCancel();
      }

      await loadModules();
    } catch (error) {
      console.error("Failed to delete module:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to delete module. It may contain lessons."
      );
    }
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate("/admin")}
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-900"
        >
          <span aria-hidden="true">←</span>
          Back to Dashboard
        </button>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Manage Modules
            </h1>
            <p className="mt-2 text-gray-600">
              Create and organize modules for your English learning platform.
            </p>
          </div>

          <div className="rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-800">
            Total modules: <strong>{modules.length}</strong>
          </div>
        </div>
      </div>

      <section className="mb-8 rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="mb-5 text-xl font-semibold text-gray-900">
          {editingId !== null ? "Edit Module" : "Add New Module"}
        </h2>

        <form onSubmit={handleSave}>
          <div className="mb-4">
            <label
              htmlFor="module-title"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Module Title <span className="text-red-600">*</span>
            </label>

            <input
              id="module-title"
              type="text"
              maxLength={150}
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Enter module title"
              className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="module-description"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Description
            </label>

            <textarea
              id="module-description"
              rows={4}
              maxLength={2000}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe what students will learn in this module"
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
                  : "Add Module"}
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

      <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-5 py-4 sm:px-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Existing Modules
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Open a module to manage its lessons.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left">
            <thead className="bg-gray-50 text-sm text-gray-700">
              <tr>
                <th className="px-5 py-4 font-semibold">Module Title</th>
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
                    Loading modules...
                  </td>
                </tr>
              ) : modules.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-5 py-10 text-center text-gray-500"
                  >
                    No modules found. Add your first module above.
                  </td>
                </tr>
              ) : (
                modules.map((module) => (
                  <tr
                    key={module.id}
                    className="transition hover:bg-gray-50"
                  >
                    <td className="px-5 py-4 font-medium text-gray-900">
                      {module.title}
                    </td>

                    <td className="max-w-sm whitespace-pre-wrap break-words px-5 py-4 text-sm text-gray-600">
                      {module.description || "—"}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex flex-wrap justify-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/admin/modules/${module.id}/lessons`)
                          }
                          className="rounded-md bg-green-700 px-3 py-2 text-sm font-medium text-white hover:bg-green-800"
                        >
                          View Lessons
                        </button>

                        <button
                          type="button"
                          onClick={() => handleEdit(module)}
                          className="rounded-md bg-amber-500 px-3 py-2 text-sm font-medium text-white hover:bg-amber-600"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(module)}
                          className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                        >
                          Delete
                        </button>
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

import { useEffect, useState } from "react";
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

  async function loadModules() {
    try {
      const data = await getModules();
      setModules(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load modules.");
    }
  }

  useEffect(() => {
    loadModules();
  }, []);

  async function handleSave() {
    if (!title.trim()) {
      toast.error("Module title is required.");
      return;
    }

    try {
      if (editingId) {
        await updateModule(editingId, {
          title,
          description,
        });

        toast.success("Module updated successfully.");
      } else {
        await createModule({
          title,
          description,
        });

        toast.success("Module added successfully.");
      }

      handleCancel();
      loadModules();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    }
  }

  function handleEdit(module) {
    setEditingId(module.id);
    setTitle(module.title);
    setDescription(module.description);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleCancel() {
    setEditingId(null);
    setTitle("");
    setDescription("");
  }

  async function handleDelete(id) {
    const result = await Swal.fire({
      title: "Delete Module?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteModule(id);

      toast.success("Module deleted successfully.");

      if (editingId === id) {
        handleCancel();
      }

      loadModules();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete module.");
    }
  }

  return (
  <AdminLayout>

    <div className="flex justify-between items-center mb-6">

      <h1 className="text-3xl font-bold">
        Modules
      </h1>

    </div>

    <div className="bg-white rounded-lg shadow p-6 mb-6">

      <input
        className="border p-3 rounded w-full mb-3"
        placeholder="Module Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="border p-3 rounded w-full mb-4"
        placeholder="Description"
        rows="4"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="flex gap-3">

        <button
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded transition"
        >
          {editingId ? "Update Module" : "Add Module"}
        </button>

        {editingId && (

          <button
            onClick={handleCancel}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded transition"
          >
            Cancel
          </button>

        )}

      </div>

    </div>

    <div className="overflow-x-auto bg-white rounded-lg shadow">

      <table className="w-full">

        <thead>

          <tr className="bg-gray-100">

            <th className="p-4 text-left">
              Title
            </th>

            <th className="p-4 text-left">
              Description
            </th>

            <th className="p-4 text-center">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {modules.length === 0 ? (

            <tr>

              <td
                colSpan="3"
                className="text-center p-6 text-gray-500"
              >
                No modules found.
              </td>

            </tr>

          ) : (

            modules.map((module) => (

              <tr
                key={module.id}
                className="border-t hover:bg-gray-50"
              >

                <td className="p-4 font-medium">
                  {module.title}
                </td>

                <td className="p-4">
                  {module.description}
                </td>

                <td className="p-4">

                  <div className="flex justify-center gap-2 flex-wrap">

                    <button
                      onClick={() =>
                        navigate(`/admin/modules/${module.id}/lessons`)
                      }
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
                    >
                      View Lessons
                    </button>

                    <button
                      onClick={() => handleEdit(module)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(module.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
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

  </AdminLayout>
);
}
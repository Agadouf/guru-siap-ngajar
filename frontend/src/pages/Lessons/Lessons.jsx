import { useEffect, useState } from "react";
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

  async function loadLessons() {
    try {
      const data = await getLessons();

      if (moduleId) {
        setLessons(
          data.filter(
            (lesson) => lesson.moduleId === moduleId
          )
        );
      } else {
        setLessons(data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load lessons.");
    }
  }

  useEffect(() => {
    loadLessons();
  }, [moduleId]);

  async function handleSave() {
    if (!moduleId) {
      toast.error("Please open a module first.");
      return;
    }

    if (!title.trim()) {
      toast.error("Lesson title is required.");
      return;
    }

    try {
      if (editingId) {
        await updateLesson(editingId, {
          title,
          description,
          moduleId,
        });

        toast.success("Lesson updated successfully.");
      } else {
        await createLesson({
          title,
          description,
          moduleId,
        });

        toast.success("Lesson added successfully.");
      }

      handleCancel();
      loadLessons();

    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    }
  }

  function handleEdit(lesson) {
    setEditingId(lesson.id);
    setTitle(lesson.title);
    setDescription(lesson.description);

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
      title: "Delete Lesson?",
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
      await deleteLesson(id);

      toast.success("Lesson deleted successfully.");

      if (editingId === id) {
        handleCancel();
      }

      loadLessons();

    } catch (error) {
      console.error(error);
      toast.error("Failed to delete lesson.");
    }
  }

return (
  <AdminLayout>

    <h1 className="text-3xl font-bold mb-6">
      {moduleId ? "Module Lessons" : "All Lessons"}
    </h1>

    {moduleId && (

      <div className="bg-white rounded-lg shadow p-6 mb-6">

        <input
          className="border p-3 rounded w-full mb-3"
          placeholder="Lesson Title"
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
            {editingId ? "Update Lesson" : "Add Lesson"}
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

    )}

    {!moduleId && (

      <div className="bg-blue-100 text-blue-800 rounded-lg p-4 mb-6">

        Select a module from
        <strong> Modules → View Lessons </strong>
        to create or edit lessons.

      </div>

    )}

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

          {lessons.length === 0 ? (

            <tr>

              <td
                colSpan="3"
                className="text-center p-6 text-gray-500"
              >
                No lessons found.
              </td>

            </tr>

          ) : (

            lessons.map((lesson) => (

              <tr
                key={lesson.id}
                className="border-t hover:bg-gray-50"
              >

                <td className="p-4 font-medium">
                  {lesson.title}
                </td>

                <td className="p-4">
                  {lesson.description}
                </td>

                <td className="p-4">

                  <div className="flex justify-center gap-2 flex-wrap">

                    <button
                      onClick={() =>
                        navigate(`/lessons/${lesson.id}/expressions`)
                      }
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
                    >
                      View Expressions
                    </button>

                    {moduleId && (
                      <button
                        onClick={() => handleEdit(lesson)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded transition"
                      >
                        Edit
                      </button>
                    )}

                    {moduleId && (
                      <button
                        onClick={() => handleDelete(lesson.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
                      >
                        Delete
                      </button>
                    )}

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
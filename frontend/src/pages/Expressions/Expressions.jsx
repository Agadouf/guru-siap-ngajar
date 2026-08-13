import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

  const [previewVideo, setPreviewVideo] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  async function loadModules() {
    try {
      const data = await getModules();
      setModules(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load modules.");
    }
  }

  async function loadLessons() {
    try {
      const data = await getLessons();
      setLessons(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load lessons.");
    }
  }

  async function loadExpressions() {
    try {
      const data = await getExpressions();

      let filtered = data;

      if (selectedLesson) {
        filtered = filtered.filter(
          (expression) =>
            expression.lessonId === selectedLesson
        );
      } else if (selectedModule) {
        const lessonIds = lessons
          .filter(
            (lesson) =>
              lesson.moduleId === selectedModule
          )
          .map((lesson) => lesson.id);

        filtered = filtered.filter((expression) =>
          lessonIds.includes(expression.lessonId)
        );
      }

      setExpressions(filtered);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load expressions.");
    }
  }

  useEffect(() => {
    loadModules();
    loadLessons();
  }, []);

  useEffect(() => {
    if (lessonId) {
      setSelectedLesson(lessonId);
    }
  }, [lessonId]);

  useEffect(() => {
    if (lessons.length) {
      loadExpressions();
    }
  }, [selectedModule, selectedLesson, lessons]);

  async function handleSave() {
    if (!selectedLesson) {
      toast.error("Please select a lesson.");
      return;
    }

    if (!english.trim()) {
      toast.error("English expression is required.");
      return;
    }

    try {
      const payload = {
        english,
        indonesian,
        explanation,
        lessonId: selectedLesson,
        videoUrl: null,
      };

      let expression;

      if (editingId) {
        expression = await updateExpression(
          editingId,
          payload
        );

        toast.success(
          "Expression updated successfully."
        );
      } else {
        expression = await createExpression(
          payload
        );

        toast.success(
          "Expression added successfully."
        );
      }

      if (video) {
        await uploadVideo(expression.id, video);
      }

      handleCancel();
      loadExpressions();

    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    }
  }

  function handleEdit(expression) {
    setEditingId(expression.id);

    setEnglish(expression.english);
    setIndonesian(expression.indonesian);
    setExplanation(expression.explanation);

    setSelectedLesson(expression.lessonId);

    const lesson = lessons.find(
      (l) => l.id === expression.lessonId
    );

    if (lesson) {
      setSelectedModule(lesson.moduleId);
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

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

  async function handleDelete(id) {

    const result = await Swal.fire({
      title: "Delete Expression?",
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
      await deleteExpression(id);

      toast.success(
        "Expression deleted successfully."
      );

      if (editingId === id) {
        handleCancel();
      }

      loadExpressions();

    } catch (error) {
      console.error(error);
      toast.error("Failed to delete expression.");
    }
  }
return (
  <AdminLayout>

    <h1 className="text-3xl font-bold mb-6">
      Expressions
    </h1>

    <div className="bg-white rounded-lg shadow p-6 mb-6">

      <label className="font-semibold block mb-2">
        Module
      </label>

      <select
        className="border p-3 rounded w-full mb-4"
        value={selectedModule}
        onChange={(e) => {
          setSelectedModule(e.target.value);
          setSelectedLesson("");
        }}
      >
        <option value="">
          All Modules
        </option>

        {modules.map((module) => (

          <option
            key={module.id}
            value={module.id}
          >
            {module.title}
          </option>

        ))}

      </select>

      <label className="font-semibold block mb-2">
        Lesson
      </label>

      <select
        className="border p-3 rounded w-full mb-4"
        value={selectedLesson}
        onChange={(e) =>
          setSelectedLesson(e.target.value)
        }
      >

        <option value="">
          Select Lesson
        </option>

        {lessons
          .filter(
            (lesson) =>
              !selectedModule ||
              lesson.moduleId === selectedModule
          )
          .map((lesson) => (

            <option
              key={lesson.id}
              value={lesson.id}
            >
              {lesson.title}
            </option>

          ))}

      </select>

      <input
        className="border p-3 rounded w-full mb-3"
        placeholder="English"
        value={english}
        onChange={(e) =>
          setEnglish(e.target.value)
        }
      />

      <input
        className="border p-3 rounded w-full mb-3"
        placeholder="Indonesian"
        value={indonesian}
        onChange={(e) =>
          setIndonesian(e.target.value)
        }
      />

      <textarea
        className="border p-3 rounded w-full mb-3"
        rows="4"
        placeholder="Explanation"
        value={explanation}
        onChange={(e) =>
          setExplanation(e.target.value)
        }
      />

      <div className="mb-4">

        <label className="font-semibold block mb-2">
          Video
        </label>

        <input
          type="file"
          accept="video/*"
          onChange={(e) =>
            setVideo(e.target.files[0])
          }
        />

      </div>

      <div className="flex gap-3">

        <button
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded transition"
        >
          {editingId
            ? "Update Expression"
            : "Add Expression"}
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

            <th className="p-4">
              Module
            </th>

            <th className="p-4">
              Lesson
            </th>

            <th className="p-4">
              English
            </th>

            <th className="p-4">
              Indonesian
            </th>

            <th className="p-4">
              Video
            </th>

            <th className="p-4">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {expressions.length === 0 ? (

            <tr>

              <td
                colSpan="6"
                className="text-center p-6 text-gray-500"
              >
                No expressions found.
              </td>

            </tr>

          ) : (

            expressions.map((expression) => {

              const lesson = lessons.find(
                (l) => l.id === expression.lessonId
              );

              const module = modules.find(
                (m) => m.id === lesson?.moduleId
              );

              return (

                <tr
                  key={expression.id}
                  className="border-t hover:bg-gray-50"
                >

                  <td className="p-4">
                    {module?.title || "-"}
                  </td>

                  <td className="p-4">
                    {lesson?.title || "-"}
                  </td>

                  <td className="p-4">
                    {expression.english}
                  </td>

                  <td className="p-4">
                    {expression.indonesian}
                  </td>

                  <td className="p-4">

                    {expression.videoUrl ? (

                      <button
                        onClick={() => {
                          setPreviewVideo(expression.videoUrl);
                          setShowPreview(true);
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded"
                      >
                        Preview
                      </button>

                    ) : (

                      <span className="text-gray-500">
                        No Video
                      </span>

                    )}

                  </td>

                  <td className="p-4">

                    <div className="flex gap-2">

                      <button
                        onClick={() =>
                          handleEdit(expression)
                        }
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(expression.id)
                        }
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded"
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

    {showPreview && (

      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

        <div className="bg-white rounded-xl p-6 w-[900px] max-w-[95%]">

          <video
            src={previewVideo}
            controls
            autoPlay
            className="w-full rounded"
          />

          <div className="flex justify-end mt-4">

            <button
              onClick={() => {
                setShowPreview(false);
                setPreviewVideo(null);
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded"
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
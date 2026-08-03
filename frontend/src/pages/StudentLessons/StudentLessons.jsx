import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import StudentLayout from "../../components/Layout/StudentLayout/StudentLayout";
import { getLessons } from "../../services/lesson.service";

export default function StudentLessons() {
  const { moduleId } = useParams();

  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    loadLessons();
  }, []);

  async function loadLessons() {
    try {
      const data = await getLessons();

      setLessons(
        data.filter(
          (lesson) => lesson.moduleId === moduleId
        )
      );
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <StudentLayout>

      <h1 className="text-5xl font-bold text-center mb-10">
        Lessons
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

        {lessons.map((lesson) => (

          <Link
            key={lesson.id}
            to={`/lessons/${lesson.id}/expressions`}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl hover:-translate-y-2 transition"
          >

            <div className="text-5xl mb-4">
              📖
            </div>

            <h2 className="text-2xl font-bold text-green-600">
              {lesson.title}
            </h2>

            <p className="text-gray-600 mt-3">
              {lesson.description}
            </p>

            <button className="mt-6 bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700">
              Open Lesson →
            </button>

          </Link>

        ))}

      </div>

    </StudentLayout>
  );
}
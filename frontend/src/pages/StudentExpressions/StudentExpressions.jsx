import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import StudentLayout from "../../components/Layout/StudentLayout/StudentLayout";
import { getExpressions } from "../../services/expression.service";

export default function StudentExpressions() {
  const { lessonId } = useParams();

  const [expressions, setExpressions] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    loadExpressions();
  }, []);

  async function loadExpressions() {
    try {
      const data = await getExpressions();

      setExpressions(
        data.filter(
          (expression) => expression.lessonId === lessonId
        )
      );
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <StudentLayout>

      <h1 className="text-5xl font-bold text-center mb-10">
        Expressions
      </h1>

      <div className="space-y-8">

        {expressions.map((expression) => (

          <div
            key={expression.id}
            className="bg-white rounded-xl shadow-lg p-8"
          >

            <h2 className="text-3xl font-bold text-blue-600 mb-4">
              {expression.english}
            </h2>

            <div className="space-y-4">

              <div>
                <p className="font-semibold text-gray-700">
                  Indonesian
                </p>

                <p className="text-lg">
                  {expression.indonesian}
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-700">
                  Explanation
                </p>

                <p>
                  {expression.explanation || "-"}
                </p>
              </div>

            </div>

            {expression.videoUrl && (

              <button
                onClick={() =>
                  setSelectedVideo(
                    expression.videoUrl
                  )
                }
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
              >
                ▶ Watch Video
              </button>

            )}

          </div>

        ))}

      </div>

      {selectedVideo && (

        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">

          <div className="bg-white rounded-xl p-6 w-[900px] max-w-[95%]">

            <video
              src={selectedVideo}
              controls
              autoPlay
              className="w-full rounded-lg"
            />

            <div className="flex justify-end mt-5">

              <button
                onClick={() => setSelectedVideo(null)}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </StudentLayout>
  );
}
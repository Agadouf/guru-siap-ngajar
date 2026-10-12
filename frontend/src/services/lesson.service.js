import api from "./api";

export const getLessons = async (moduleId) => {
  const response = await api.get("/lessons");
  const lessons = response.data.data;

  if (!Array.isArray(lessons)) {
    return [];
  }

  // Without a module ID, return all lessons (existing behavior).
  if (moduleId === undefined || moduleId === null) {
    return lessons;
  }

  // When a module is selected, return only its lessons.
  return lessons.filter((lesson) => {
    const lessonModuleId =
      lesson.moduleId ??
      lesson.module_id ??
      lesson.module?.id;

    return (
      lessonModuleId !== undefined &&
      lessonModuleId !== null &&
      String(lessonModuleId) === String(moduleId)
    );
  });
};

export const createLesson = async (data) => {
  const response = await api.post("/lessons", data);
  return response.data.data;
};

export const updateLesson = async (id, data) => {
  const response = await api.put(`/lessons/${id}`, data);
  return response.data.data;
};

export const deleteLesson = async (id) => {
  await api.delete(`/lessons/${id}`);
};

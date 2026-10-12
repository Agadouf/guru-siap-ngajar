
async function handleModuleClick(module) {
  if (String(expandedModule) === String(module.id)) {
    setExpandedModule(null);
    setLessons([]);
    setSelectedLesson(null);
    setError("");
    return;
  }

  setExpandedModule(module.id);
  setLessons([]);
  setSelectedLesson(null);
  setLoadingLessons(true);
  setError("");

  try {
    // Fetch all lessons directly.
    const data = await getLessons();
    const allLessons = Array.isArray(data) ? data : [];

    // Keep only lessons belonging to the selected module.
    const filteredLessons = allLessons.filter((lesson) => {
      const lessonModuleId =
        lesson.moduleId ??
        lesson.module_id ??
        lesson.module?.id;

      return (
        lessonModuleId != null &&
        String(lessonModuleId) === String(module.id)
      );
    });

    setLessons(filteredLessons);
  } catch (err) {
    console.error("Failed to load lessons:", err);
    setError("Unable to load lessons. Please try again.");
  } finally {
    setLoadingLessons(false);
  }
}

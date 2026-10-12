
async function handleModuleClick(module) {
  if (expandedModule === module.id) {
    setExpandedModule(null);
    setLessons([]);
    setSelectedLesson(null);
    setError("");
    return;
  }

  const clickedModuleId = String(module.id);

  setExpandedModule(module.id);
  setLessons([]);
  setSelectedLesson(null);
  setLoadingLessons(true);
  setError("");

  try {
    const data = await getLessons(module.id);
    const allLessons = Array.isArray(data) ? data : [];

    const filteredLessons = allLessons.filter((lesson) => {
      const lessonModuleId =
        lesson.moduleId ??
        lesson.module_id ??
        lesson.module?.id;

      return (
        lessonModuleId != null &&
        String(lessonModuleId) === clickedModuleId
      );
    });

    // Ignore results if the user has opened another module.
    setLessons(filteredLessons);
  } catch (err) {
    console.error("Failed to load lessons:", err);
    setError("Unable to load lessons. Please try again.");
  } finally {
    setLoadingLessons(false);
  }
}

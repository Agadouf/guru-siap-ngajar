import * as lessonService from "./lesson.service.js";

export const getAllLessons = async (req, res) => {
  try {
    const lessons = await lessonService.getAllLessons();

    res.json({
      success: true,
      message: "Lessons retrieved successfully.",
      data: lessons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getLessonById = async (req, res) => {
  try {
    const lesson = await lessonService.getLessonById(req.params.id);

    res.json({
      success: true,
      message: "Lesson retrieved successfully.",
      data: lesson,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const createLesson = async (req, res) => {
  try {
    const lesson = await lessonService.createLesson(req.body);

    res.status(201).json({
      success: true,
      message: "Lesson created successfully.",
      data: lesson,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateLesson = async (req, res) => {
  try {
    const lesson = await lessonService.updateLesson(
      req.params.id,
      req.body
    );

    res.json({
      success: true,
      message: "Lesson updated successfully.",
      data: lesson,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteLesson = async (req, res) => {
  try {
    await lessonService.deleteLesson(req.params.id);

    res.json({
      success: true,
      message: "Lesson deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
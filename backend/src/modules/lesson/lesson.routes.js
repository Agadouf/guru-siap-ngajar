import { Router } from "express";

import {
  getAllLessons,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
} from "./lesson.controller.js";

const router = Router();

router.get("/", getAllLessons);

router.get("/:id", getLessonById);

router.post("/", createLesson);

router.put("/:id", updateLesson);

router.delete("/:id", deleteLesson);

export default router;
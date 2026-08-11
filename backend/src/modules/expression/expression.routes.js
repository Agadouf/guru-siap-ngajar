import express, { Router } from "express";

import { uploadVideo } from "./expression.upload.controller.js";

import {
  getAllExpressions,
  getExpressionById,
  createExpression,
  updateExpression,
  deleteExpression,
} from "./expression.controller.js";

const router = Router();

router.use(express.json());

router.get("/", getAllExpressions);
router.get("/:id", getExpressionById);

router.post("/", createExpression);
router.put("/:id", updateExpression);

router.delete("/:id", deleteExpression);

router.post("/:id/video", uploadVideo);

export default router;
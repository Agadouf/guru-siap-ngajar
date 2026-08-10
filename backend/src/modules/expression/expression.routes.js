import { Router } from "express";
import express from "express";

import { uploadVideo } from "./expression.upload.controller.js";

import {
  getAllExpressions,
  getExpressionById,
  createExpression,
  updateExpression,
  deleteExpression,
} from "./expression.controller.js";

const router = Router();

router.get("/", getAllExpressions);
router.get("/:id", getExpressionById);

router.post("/", express.json(), createExpression);
router.put("/:id", express.json(), updateExpression);

router.delete("/:id", deleteExpression);

// Vercel Blob client-token request
router.post(
  "/:id/video",
  express.json(),
  uploadVideo
);

export default router;
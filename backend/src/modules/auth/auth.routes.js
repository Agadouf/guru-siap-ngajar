import express from "express";
import { Router } from "express";

import {
  login,
  changePassword,
} from "./auth.controller.js";

import { authenticate } from "../../middleware/auth.middleware.js";

const router = Router();

router.use(express.json());

router.post("/login", login);

router.put(
  "/change-password",
  authenticate,
  changePassword
);

export default router;
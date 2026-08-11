import { Router } from "express";

import {
  login,
  changePassword,
} from "./auth.controller.js";

import { authenticate } from "../../middleware/auth.middleware.js";

const router = Router();

// Parse JSON specifically for auth requests
router.use(express.json());

router.post("/login", login);

router.put(
  "/change-password",
  authenticate,
  changePassword
);

export default router;
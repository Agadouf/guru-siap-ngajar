import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes.js";
import moduleRoutes from "../modules/module/module.routes.js";
import lessonRoutes from "../modules/lesson/lesson.routes.js";
import expressionRoutes from "../modules/expression/expression.routes.js";
import dashboardRoutes from "../modules/dashboard/dashboard.routes.js";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Guru Siap Ngajar API is running.",
  });
});

router.use("/auth", authRoutes);

router.use("/modules", moduleRoutes);

router.use("/lessons", lessonRoutes);

router.use("/expressions", expressionRoutes);

router.use("/dashboard", dashboardRoutes);

export default router;
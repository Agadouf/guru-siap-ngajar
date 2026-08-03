import { Router } from "express";

import {
  getAllModules,
  getModuleById,
  createModule,
  updateModule,
  deleteModule,
} from "./module.controller.js";

const router = Router();

router.get("/", getAllModules);

router.get("/:id", getModuleById);

router.post("/", createModule);

router.put("/:id", updateModule);

router.delete("/:id", deleteModule);

export default router;
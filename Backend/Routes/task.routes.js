import express from "express";
import {
  createTask,
  getTasksByProject,
  updateTask,
  deleteTask,
  getDashboardStats
} from "../controllers/task.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/dashboard", protect, getDashboardStats);
router.get("/project/:id", protect, getTasksByProject);
router.post("/", protect, createTask);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, deleteTask);

export default router;

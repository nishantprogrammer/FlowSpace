import express from "express";
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember
} from "../controllers/project.controller.js";
import { protect, adminGuard } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/")
  .get(protect, getAllProjects)
  .post(protect, adminGuard, createProject);

router.route("/:id")
  .get(protect, getProjectById)
  .put(protect, adminGuard, updateProject)
  .delete(protect, adminGuard, deleteProject);

router.post("/:id/members", protect, adminGuard, addMember);
router.delete("/:id/members", protect, adminGuard, removeMember);

export default router;

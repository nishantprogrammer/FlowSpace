import express from "express";
import { register, login, getMe, logout, getAllUsers } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.get("/users", protect, getAllUsers);
router.post("/logout", logout);

export default router;

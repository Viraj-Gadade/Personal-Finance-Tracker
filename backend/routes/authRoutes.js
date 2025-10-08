import express from "express";
const router = express.Router();
import { authMiddleware } from "../middleware/authMiddleware.js";
import { register, login, getProfile, updateEmail, updatePassword } from "../controllers/authController.js";

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authMiddleware, getProfile);
router.put("/update-email", authMiddleware, updateEmail);
router.put("/update-password", authMiddleware, updatePassword);

export default router;

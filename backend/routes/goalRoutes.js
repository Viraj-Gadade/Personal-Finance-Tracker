import express from "express";
import { getGoals, updateGoals } from "../controllers/goalController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(authMiddleware, getGoals)
  .put(authMiddleware, updateGoals);

export default router;

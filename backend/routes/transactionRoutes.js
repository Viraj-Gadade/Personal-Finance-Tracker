import express from "express";
import {
  createTransaction,
  getTransactions,
  getTransactionById,
  deleteTransaction,
} from "../controllers/transactionController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes are protected
router.post("/", authMiddleware, createTransaction);
router.get("/", authMiddleware, getTransactions);
router.get("/:id", authMiddleware, getTransactionById);
router.delete("/:id", authMiddleware, deleteTransaction);

export default router;

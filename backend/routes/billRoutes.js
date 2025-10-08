import express from "express";
import {
  getBills,
  createBill,
  payBill,
  deleteBill,
} from "../controllers/billsController.js";
import {authMiddleware} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getBills);
router.post("/", authMiddleware, createBill);
router.put("/:id/pay", authMiddleware, payBill);
router.delete("/:id", authMiddleware, deleteBill);

export default router;

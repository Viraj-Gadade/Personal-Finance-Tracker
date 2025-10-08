import express from "express";
import Balance from "../models/Balance.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get balances for logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const balance = await Balance.findOne({ userId: req.user.id });
    res.json(balance || { totalBalance: 0, accounts: [] });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Add new account
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { type, name, balance, currency, accountNumber, provider, isPrimary } = req.body;

    let userBalance = await Balance.findOne({ userId: req.user.id });
    if (!userBalance) {
      userBalance = new Balance({ userId: req.user.id, totalBalance: 0, accounts: [] });
    }

    const newAccount = { type, name, balance, currency, accountNumber, provider, isPrimary };
    userBalance.accounts.push(newAccount);

    // update total balance
    userBalance.totalBalance = userBalance.accounts.reduce((sum, acc) => sum + acc.balance, 0);

    await userBalance.save();
    res.status(201).json(userBalance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Remove account
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const balance = await Balance.findOne({ userId: req.user.id });
    if (!balance) return res.status(404).json({ msg: "No balance record found" });

    balance.accounts = balance.accounts.filter((acc) => acc._id.toString() !== id);

    balance.totalBalance = balance.accounts.reduce((sum, acc) => sum + acc.balance, 0);

    await balance.save();
    res.json(balance);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Get all accounts of logged-in user
router.get("/accounts", authMiddleware, async (req, res) => {
  try {
    const balance = await Balance.findOne({ userId: req.user.id });
    if (!balance) return res.json({ accounts: [] });

    res.json({ accounts: balance.accounts });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});



export default router;

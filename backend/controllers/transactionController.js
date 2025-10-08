import Transaction from "../models/Transaction.js";
import Balance from "../models/Balance.js";
import Bill from "../models/Bills.js";

// 📌 Create a new transaction
export const createTransaction = async (req, res) => {
  try {
    const { accountId, billId, type, category, description, amount, currency, paymentMethod } = req.body;
    const userId = req.user._id;

    // Ensure balance doc exists
    const balanceDoc = await Balance.findOne({ userId });
    if (!balanceDoc) {
      return res.status(404).json({ msg: "Balance document not found for user" });
    }

    // Find account
    const account = balanceDoc.accounts.id(accountId);
    if (!account) {
      return res.status(404).json({ msg: "Account not found" });
    }

    // Adjust balance based on type
    if (type === "income") {
      account.balance += amount;
      balanceDoc.totalBalance += amount;
    } else if (type === "expense" || type === "bills") {
      if (account.balance < amount) {
        return res.status(400).json({ msg: "Insufficient balance" });
      }
      account.balance -= amount;
      balanceDoc.totalBalance -= amount;
    } else if (type === "transfer") {
      // Optional: extend schema with toAccountId
      return res.status(400).json({ msg: "Transfers not implemented yet" });
    }

    // Save balance changes
    await balanceDoc.save();

    // If linked to a bill → mark as paid
    if (billId) {
      await Bill.findByIdAndUpdate(billId, { status: "paid" });
    }

    // Create transaction
    const transaction = await Transaction.create({
      userId,
      accountId,
      billId: billId || null,
      type,
      category,
      description,
      amount,
      currency,
      paymentMethod,
    });

    res.status(201).json(transaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// 📌 Get all transactions for logged-in user
export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .lean();
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// 📌 Get single transaction by ID
export const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!transaction) {
      return res.status(404).json({ msg: "Transaction not found" });
    }
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// 📌 Delete transaction
export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!transaction) {
      return res.status(404).json({ msg: "Transaction not found" });
    }

    // Reverse the balance update
    const balanceDoc = await Balance.findOne({ userId: req.user._id });
    if (!balanceDoc) return res.status(404).json({ msg: "Balance not found" });

    const account = balanceDoc.accounts.id(transaction.accountId);
    if (account) {
      if (transaction.type === "income") {
        account.balance -= transaction.amount;
        balanceDoc.totalBalance -= transaction.amount;
      } else if (transaction.type === "expense" || transaction.type === "bills") {
        account.balance += transaction.amount;
        balanceDoc.totalBalance += transaction.amount;
      }
      await balanceDoc.save();
    }

    await transaction.deleteOne();

    res.json({ msg: "Transaction deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

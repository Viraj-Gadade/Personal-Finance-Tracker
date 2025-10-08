import Bill from "../models/Bills.js";
import Transaction from "../models/Transaction.js";
import Balance from "../models/Balance.js";

// 📌 Get all bills for a user
export const getBills = async (req, res) => {
  try {
    const bills = await Bill.find({ userId: req.user.id }).sort({ dueDate: 1 });
    res.status(200).json(bills);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bills" });
  }
};

// 📌 Create a new bill
export const createBill = async (req, res) => {
  try {
    const newBill = new Bill({ ...req.body, userId: req.user.id });
    await newBill.save();
    res.status(201).json(newBill);
  } catch (err) {
    res.status(500).json({ error: "Failed to create bill" });
  }
};

// 📌 Mark bill as paid → update transaction + balance
export const payBill = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) return res.status(404).json({ msg: "Bill not found" });

    if (bill.paid) return res.status(400).json({ msg: "Bill already paid" });


    // Optional: Update account balance if needed
    const balanceDoc = await Balance.findOne({ userId: bill.userId });
    if (!balanceDoc) return res.status(404).json({ msg: "Balance not found" });
    
     // Find account
    const account = balanceDoc.accounts.id(bill.accountId);
    if (!account) return res.status(404).json({ msg: "Account not found" });

    // Deduct bill amount from account balance
     if (account.balance < bill.amount) {
      return res.status(400).json({ msg: "Insufficient balance to pay this bill" });
    }
    account.balance -= bill.amount;
    balanceDoc.totalBalance -= bill.amount;
    await balanceDoc.save();

     // Create transaction
    const transaction = new Transaction({
      userId: bill.userId,          // who paid
      accountId: bill.accountId,    // which account was used
      billId: bill._id,
      type: "expense",
      category: "bills",
      description: `${bill.title}`,
      amount: bill.amount,
      currency: "USD",              // optional: use bill.currency if you store it
      status: "completed",
      paymentMethod: bill.paymentMethod || "cash", // if you store method in bill
      transactionDate: new Date(),
    });

    await transaction.save();


    // Mark bill as paid
    bill.paid = true;
    bill.status = "paid";
    bill.paidAt = new Date();
    await bill.save();

    

    res.json({ msg: "Bill paid and transaction recorded", bill, transaction });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// 📌 Delete bill
export const deleteBill = async (req, res) => {
  try {
    await Bill.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Bill deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete bill" });
  }
};

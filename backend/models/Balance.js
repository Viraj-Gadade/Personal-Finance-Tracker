import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["bank", "credit_card", "wallet", "cash", "other"],
      required: true,
    },
    name: {
      type: String,
      required: true, // Example: "HDFC Savings", "Visa Credit Card"
      trim: true,
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
    },
    currency: {
      type: String,
      default: "USD",
    },
    accountNumber: {
      type: String,
      trim: true, // Masked or full (e.g. ****2598)
    },
    provider: {
      type: String, // Example: "HDFC Bank", "PayPal"
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true }
);

const balanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    totalBalance: {
      type: Number,
      default: 0,
    },
    accounts: [accountSchema], // Array of different account/card balances
  },
  { timestamps: true }
);

const Balance = mongoose.model("Balance", balanceSchema);

export default Balance;

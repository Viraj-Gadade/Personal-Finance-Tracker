import mongoose from "mongoose";

const billSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Link each bill to a user
      required: true,
    },
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Balance.accounts", // The account used to pay
      required: true,
    },
    title: {
      type: String,
      required: true, // Example: "Figma Monthly"
      trim: true,
    },
    amount: {
      type: Number,
      required: true, // Example: 150
      min: 0,
    },
    dueDate: {
      type: Date,
      required: true, // Example: "2023-05-15"
    },
    category: {
      type: String,
      enum: ["Utilities", "Subscription", "Rent", "Loan-EMI", "Other"],
      default: "Other",
    },
    status: {
      type: String,
      enum: ["pay", "paid"],
      default: "pay",
    },
    notes: {
      type: String,
      trim: true,
    },
    recurring: {
      type: Boolean,
      default: false, // true if this bill repeats
    },
    frequency: {
      type: String,
      enum: ["monthly", "yearly", "weekly", "none"],
      default: "none", // only relevant if recurring = true
    },
  },
  { timestamps: true },
  { _id: true }
);

const Bill = mongoose.model("Bill", billSchema);

export default Bill;

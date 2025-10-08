import React, { useEffect, useState } from "react";
import API from "../api";

const TransactionCard = ({ onSuccess, onCancel }) => {
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState({
    type: "expense",
    category: "",
    description: "",
    amount: "",
    accountId: "",
    paymentMethod: "",
  });

  // Fetch accounts
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await API.get("/balances/accounts");
        // Ensure it's always an array
        setAccounts(res.data.accounts || res.data || []);
      } catch (err) {
        console.error("Error fetching accounts", err);
        setAccounts([]);
      }
    };
    fetchAccounts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/transactions", {
        ...form,
        amount: Number(form.amount),
      });
      setForm({
        type: "expense",
        category: "",
        description: "",
        amount: "",
        accountId: "",
        paymentMethod: "",
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      alert(err.response?.data?.msg || "Error adding transaction");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow p-6 rounded-lg mb-6"
    >
      <div className="grid grid-cols-2 gap-4">
        {/* Type */}
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="border rounded px-3 py-2"
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
          <option value="transfer">Transfer</option>
        </select>

        {/* Category */}
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="border rounded px-3 py-2"
        >
          <option value="">Select Category</option>
          <option value="bills">Bills</option>
          <option value="food">Food</option>
          <option value="shopping">Shopping</option>
          <option value="rent">Rent</option>
          <option value="salary">Salary</option>
          <option value="entertainment">Entertainment</option>
          <option value="transport">Transport</option>
          <option value="healthcare">Healthcare</option>
          <option value="investment">Investment</option>
          <option value="other">Other</option>
        </select>

        {/* Description */}
        <input
          type="text"
          placeholder="Description / Payee"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border rounded px-3 py-2"
        />

        {/* Amount */}
        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          className="border rounded px-3 py-2"
        />

        {/* Account */}
        <select
          value={form.accountId}
          onChange={(e) => setForm({ ...form, accountId: e.target.value })}
          className="border rounded px-3 py-2"
        >
          <option value="">Select Account</option>
          {Array.isArray(accounts) &&
            accounts.map((acc) => (
              <option key={acc._id} value={acc._id}>
                {acc.name} ({acc.type}-{acc.provider})
              </option>
            ))}
        </select>

        {/* Payment Method */}
        <select
          value={form.paymentMethod}
          onChange={(e) =>
            setForm({ ...form, paymentMethod: e.target.value })
          }
          className="border rounded px-3 py-2"
        >
          <option value="">Select Payment Method</option>
          <option value="cash">Cash</option>
          <option value="bank_transfer">Bank Transfer</option>
          <option value="credit_card">Credit Card</option>
          <option value="debit_card">Debit Card</option>
          <option value="wallet">Wallet</option>
        </select>
      </div>

      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
        >
          Back
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Save Transaction
        </button>
      </div>
    </form>
  );
};

export default TransactionCard;

import React, { useEffect, useState } from "react";
import API from "../api";

const BillForm = ({ onSuccess, onCancel }) => {
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    dueDate: "",
    category: "Other",
    accountId: "",
    notes: "",
    recurring: false,
    frequency: "none",
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await API.get("/balances/accounts");
      setAccounts(res.data.accounts || []);
    } catch (err) {
      console.error("Error fetching accounts", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/bills", form);
      if (onSuccess) onSuccess();
      setForm({
        title: "",
        amount: "",
        dueDate: "",
        category: "Other",
        accountId: "",
        notes: "",
        recurring: false,
        frequency: "none",
      });
    } catch (err) {
      console.error("Error creating bill", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-lg shadow mb-6 space-y-4"
    >
      <div>
        <label className="block text-sm font-medium">Title</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Amount</label>
        <input
          type="number"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Due Date</label>
        <input
          type="date"
          value={form.dueDate}
          onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Category</label>
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="w-full p-2 border rounded"
        >
          <option>Utilities</option>
          <option>Subscription</option>
          <option>Rent</option>
          <option>Loan-EMI</option>
          <option>Other</option>
        </select>
      </div>

      {/* Account Dropdown */}
      <div>
        <label className="block text-sm font-medium">Account</label>
        <select
          value={form.accountId}
          onChange={(e) => setForm({ ...form, accountId: e.target.value })}
          required
          className="w-full p-2 border rounded"
        >
          <option value="">Select Account</option>
          {accounts.map((acc) => (
            <option key={acc._id} value={acc._id}>
              {acc.name} ({acc.type}) - ${acc.balance}
            </option>
          ))}
        </select>
      </div>

      {/* Recurring & Frequency */}
      <div className="flex items-center space-x-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={form.recurring}
            onChange={(e) =>
              setForm({ ...form, recurring: e.target.checked })
            }
            className="mr-2"
          />
          Recurring
        </label>
        {form.recurring && (
          <select
            value={form.frequency}
            onChange={(e) => setForm({ ...form, frequency: e.target.value })}
            className="p-2 border rounded"
          >
            <option value="none">None</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Notes</label>
        <textarea
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Save Bill
        </button>
      </div>
    </form>
  );
};

export default BillForm;

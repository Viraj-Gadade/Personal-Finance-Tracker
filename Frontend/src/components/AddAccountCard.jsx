import React, { useState } from "react";
import API from "../api";

const AddAccountCard = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    type: "",
    name: "",
    balance: "",
    currency: "",
    accountNumber: "",
    provider: "",
    isPrimary: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/balances", formData);
      onSave(res.data);
      onClose();
    } catch (err) {
      alert(err?.response?.data?.msg || "Failed to add account");
    }
  };

  return (
    <div className="absolute top-20 right-10 z-50 w-full max-w-md">
      <div className="bg-white shadow-lg rounded-xl p-6 border">
        <h2 className="text-lg font-semibold mb-4">Add New Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">Select Type</option>
            <option value="bank">Bank</option>
            <option value="credit_card">Credit Card</option>
            <option value="wallet">Wallet</option>
            <option value="cash">Cash</option>
            <option value="other">Other</option>
          </select>

          <input
            type="text"
            name="name"
            placeholder="Account Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />

          <input
            type="number"
            name="balance"
            placeholder="Balance"
            value={formData.balance}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />

          <select
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="USD">USD - US Dollar</option>
            <option value="INR">INR - Indian Rupee</option>
            <option value="EUR">EUR - Euro</option>
          </select>

          <input
            type="text"
            name="accountNumber"
            placeholder="Account Number"
            value={formData.accountNumber}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />

          <input
            type="text"
            name="provider"
            placeholder="Provider (HDFC, PayPal, etc.)"
            value={formData.provider}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isPrimary"
              checked={formData.isPrimary}
              onChange={handleChange}
            />
            Primary Account
          </label>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-green-600 text-white"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAccountCard;

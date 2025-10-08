import React, { useEffect, useState } from "react";
import { Tab } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import API from "../api";
import TransactionCard from "../components/TransactionCard";

// ✅ Separate table component
const TransactionTable = ({ transactions }) => (
  <div className="bg-white rounded-lg shadow overflow-x-auto">
    <table className="w-full text-left">
      <thead className="bg-gray-100 text-gray-600">
        <tr>
          <th className="p-3">Category</th>
          <th className="p-3">Description</th>
          <th className="p-3">Date</th>
          <th className="p-3">Payment Method</th>
          <th className="p-3">Amount</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((t) => (
          <tr key={t._id} className="border-b">
            <td className="p-3">{t.category}</td>
            <td className="p-3">{t.description}</td>
            <td className="p-3">{new Date(t.createdAt).toLocaleDateString()}</td>
            <td className="p-3">{t.paymentMethod}</td>
            <td
              className={clsx(
                "p-3 font-semibold",
                t.type === "income" ? "text-green-600" : "text-red-600"
              )}
            >
              {t.type === "income" ? "+" : "-"}${t.amount}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await API.get("/transactions");
      setTransactions(res.data);
    } catch (err) {
      console.error("Error fetching transactions", err);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Recent Transactions</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Transaction
        </button>
      </div>

      {/* Add Transaction Form */}
      {showForm && (
        <TransactionCard
          onSuccess={() => {
            setShowForm(false);
            fetchTransactions();
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Tabs */}
      <Tab.Group>
        <Tab.List className="flex space-x-4 mb-4">
          {["All", "Income", "Expenses"].map((tab) => (
            <Tab
              key={tab}
              className={({ selected }) =>
                clsx(
                  "px-4 py-2 rounded-lg",
                  selected
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-600"
                )
              }
            >
              {tab}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels>
          {/* All Transactions */}
          <Tab.Panel>
            <TransactionTable transactions={transactions} />
          </Tab.Panel>

          {/* Income Transactions */}
          <Tab.Panel>
            <TransactionTable
              transactions={transactions.filter((t) => t.type === "income")}
            />
          </Tab.Panel>

          {/* Expense Transactions (includes bills) */}
          <Tab.Panel>
            <TransactionTable
              transactions={transactions.filter((t) => t.type === "expense")}
            />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default Transactions;

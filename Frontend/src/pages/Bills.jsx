import React, { useEffect, useState } from "react";
import API from "../api";
import BillCard from "../components/BillCard";
import BillForm from "../components/BillForm";

const Bills = () => {
  const [bills, setBills] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const res = await API.get("/bills");
      setBills(res.data);
    } catch (err) {
      console.error("Error fetching bills", err);
    }
  };
const handlePay = async (id) => {
  try {
    const res = await API.put(
      `/bills/${id}/pay`,
      {},
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );

    // Optional: you can use the transaction data if needed
    console.log("Transaction added:", res.data.transaction);

    fetchBills(); // refresh bills
    // You might also refresh transactions if you have a transaction list
    // fetchTransactions();
  } catch (err) {
    console.error("Error paying bill", err);
  }
};


  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this bill?")) return;
    try {
      await API.delete(`/bills/${id}`);
      fetchBills();
    } catch (err) {
      console.error("Error deleting bill", err);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Upcoming Bills</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          {showForm ? "Cancel" : "Add Bill"}
        </button>
      </div>

      {showForm && (
        <BillForm
          onSuccess={() => {
            setShowForm(false);
            fetchBills();
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="bg-white rounded-lg shadow divide-y">
        {bills.map((bill) => (
          <BillCard
            key={bill._id}
            bill={bill}
            onPay={handlePay}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default Bills;

import React from "react";
import { TrashIcon } from "@heroicons/react/24/outline";

const BillCard = ({ bill, onPay, onDelete }) => {
  return (
    <div
      key={bill._id}
      className="flex justify-between items-center p-4 hover:bg-gray-50 border-b"
    >
      {/* Left: Due Date + Details */}
      <div className="flex items-center space-x-4">
        <div className="text-center">
          <p className="font-bold text-gray-700">
            {new Date(bill.dueDate).toLocaleString("default", {
              month: "short",
            })}
          </p>
          <p className="text-xl font-semibold">
            {new Date(bill.dueDate).getDate()}
          </p>
        </div>
        <div>
          <p className="font-semibold">{bill.title}</p>
          <p className="text-gray-500 text-sm">{bill.category}</p>
        </div>
      </div>

      {/* Right: Amount + Actions */}
      <div className="flex items-center space-x-3">
        <p className="font-bold text-gray-800">${bill.amount}</p>

        <button
          onClick={() => onPay(bill._id)}
          disabled={bill.status === "paid"}
          className={`px-4 py-2 rounded ${
            bill.status === "paid"
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 text-white"
          }`}
        >
          {bill.status === "paid" ? "Paid" : "Pay"}
        </button>

        {/* Delete Button */}
        <button
          onClick={() => onDelete(bill._id)}
          className="p-2 rounded hover:bg-red-100"
          title="Delete Bill"
        >
          <TrashIcon className="h-5 w-5 text-red-600" />
        </button>
      </div>
    </div>
  );
};

export default BillCard;

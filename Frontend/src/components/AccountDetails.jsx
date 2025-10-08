import React from "react";

const AccountDetails = ({ account, transactions, onBack }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 flex-1 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Account Details</h2>
        <button
          onClick={onBack}
          className="text-sm text-blue-500 hover:underline"
        >
          ← Back
        </button>
      </div>

      {/* Account Info */}
      <div className="mb-6">
        <p>
          <span className="font-medium">Bank Name:</span> {account.provider}
        </p>
        <p>
          <span className="font-medium">Account Type:</span>{" "}
          {account.type}
        </p>
        <p>
          <span className="font-medium">Account Number:</span>{" "}
          {account.accountNumber}
        </p>
        <p>
          <span className="font-medium">Balance:</span> ${account.balance}
        </p>
      </div>

      {/* Transactions */}
      <h3 className="font-semibold text-lg mb-4">Transactions History</h3>
      <div className="overflow-y-auto flex-1">
        {transactions.length === 0 ? (
          <p className="text-gray-500">No transactions available.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b">
              <tr>
                <th className="p-2">Date</th>
                <th className="p-2">Status</th>
                <th className="p-2">Type</th>
                <th className="p-2">Receipt</th>
                <th className="p-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, idx) => (
                <tr key={idx} className="border-b">
                  <td className="p-2">{new Date(t.createdAt).toLocaleDateString()}</td>
                  <td className="p-2">{t.status}</td>
                  <td className="p-2">{t.category}</td>
                  <td className="p-2">{t.paymentMethod}</td>
                  <td className="p-2 font-medium">${t.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <button className="mt-4 bg-green-600 text-white py-2 px-4 rounded">
        Load More
      </button>
    </div>
  );
};

export default AccountDetails;

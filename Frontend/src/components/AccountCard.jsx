import React from "react";

const AccountCard = ({ account, onShowDetails, onRemove }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 flex flex-col justify-between">
      <div>
        <h3 className="text-gray-700 font-semibold">{account.accountType}</h3>
        <p className="text-sm text-gray-500">{account.bankName}</p>
        <p className="mt-2 font-mono text-gray-600">
          {account.accountNumber.replace(/\d(?=\d{4})/g, "*")}
        </p>
        <p className="mt-3 text-lg font-bold">${account.balance} ({account.type} - {account.provider})</p>
      </div>

      <div className="flex justify-between mt-4">
        <button
          onClick={() => onRemove(account._id)}
          className="text-red-500 text-sm hover:underline"
        >
          Remove
        </button>
        <button
          onClick={() => onShowDetails(account)}
          className="text-green-600 text-sm font-medium hover:underline"
        >
          Show Details →
        </button>
      </div>
    </div>
  );
};

export default AccountCard;

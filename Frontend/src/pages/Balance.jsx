import React, { useEffect, useState } from "react";
import AccountCard from "../components/AccountCard";
import AccountDetails from "../components/AccountDetails";
import AddAccountModal from "../components/AddAccountCard";
import API from "../api";

const BalancePage = () => {
  const [balanceData, setBalanceData] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [allTransactions, setAllTransactions] = useState([]); // store all transactions
  const [transactions, setTransactions] = useState([]); // filtered for selected account
  const [showModal, setShowModal] = useState(false);

  // Fetch all accounts
  const fetchBalances = async () => {
    try {
      const res = await API.get("/balances");
      setBalanceData(res.data);
    } catch (err) {
      console.error("Failed to fetch balances:", err);
    }
  };

  // Fetch all transactions once
  const fetchAllTransactions = async () => {
    try {
      const res = await API.get("/transactions"); // your getTransactions route
      setAllTransactions(res.data);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
      setAllTransactions([]);
    }
  };

  useEffect(() => {
    fetchBalances();
    fetchAllTransactions();
  }, []);

  // Filter transactions for the selected account
  useEffect(() => {
    if (!selectedAccount) {
      setTransactions([]);
      return;
    }

    const filtered = allTransactions.filter(
      (txn) => txn.accountId === selectedAccount._id
    );
    setTransactions(filtered);
  }, [selectedAccount, allTransactions]);

  const handleAddAccount = (updatedBalance) => {
    setBalanceData(updatedBalance);
  };

  const handleRemoveAccount = async (id) => {
    try {
      const res = await API.delete(`/balances/${id}`);
      setBalanceData(res.data);
    } catch (err) {
      alert("Failed to remove account");
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Balances</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + Add Account
        </button>
      </div>

      {/* Either show list of accounts OR account details */}
      {selectedAccount ? (
        <AccountDetails
          account={selectedAccount}
          transactions={transactions}
          onBack={() => {
            setSelectedAccount(null);
            setTransactions([]);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {balanceData?.accounts?.map((account) => (
            <AccountCard
              key={account._id}
              account={account}
              onShowDetails={setSelectedAccount}
              onRemove={handleRemoveAccount}
            />
          ))}
        </div>
      )}

      {/* Add Account Modal */}
      {showModal && (
        <AddAccountModal
          onClose={() => setShowModal(false)}
          onSave={handleAddAccount}
        />
      )}
    </div>
  );
};

export default BalancePage;

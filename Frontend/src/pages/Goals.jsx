import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { IoChevronBack, IoChevronForward, IoClose, IoPencil, IoAddCircleOutline } from "react-icons/io5";
import API from "../api";
import ExpenseGoalCard from "../components/ExpenseGoalCard";

const ALL_EXPENSE_CATEGORIES = [
  "bills", "food", "shopping", "rent", "entertainment", "transport", "healthcare", "other",
];

// --- Modal Wrapper ---
const ModalWrapper = ({ children, isOpen }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/30 p-4 z-50">
      <div className="bg-white p-6 rounded-lg shadow w-full max-w-md border">{children}</div>
    </div>
  );
};

// --- Savings Goal Modal ---
const SavingsGoalModal = ({ isOpen, onClose, currentTarget, onSave }) => {
  const [newTarget, setNewTarget] = useState(currentTarget);
  useEffect(() => setNewTarget(currentTarget), [currentTarget]);
  const handleSave = () => {
    onSave(Number(newTarget));
    onClose();
  };

  return (
    <ModalWrapper isOpen={isOpen}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Adjust Savings Goal</h3>
        <button onClick={onClose}><IoClose size={24} /></button>
      </div>
      <label htmlFor="savingsTarget" className="block mb-1 text-sm">Monthly Savings Target ($)</label>
      <input
        type="number"
        id="savingsTarget"
        value={newTarget}
        onChange={(e) => setNewTarget(e.target.value)}
        className="w-full px-3 py-2 border rounded-md"
      />
      <div className="mt-4 flex justify-end gap-2">
        <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
        <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
      </div>
    </ModalWrapper>
  );
};

// --- Expense Goals Modal ---
const ExpenseGoalModal = ({ isOpen, onClose, goals, onSave }) => {
  const [editableGoals, setEditableGoals] = useState(goals);
  const [newCategory, setNewCategory] = useState("");
  const [newAmount, setNewAmount] = useState("");

  useEffect(() => setEditableGoals(goals), [goals]);

  const handleAmountChange = (category, amount) =>
    setEditableGoals((g) => ({ ...g, [category]: Number(amount) }));

  const handleAddNewGoal = () => {
    if (newCategory && newAmount > 0) {
      handleAmountChange(newCategory, newAmount);
      setNewCategory("");
      setNewAmount("");
    }
  };

  const availableCategories = ALL_EXPENSE_CATEGORIES.filter(
    (cat) => !editableGoals.hasOwnProperty(cat)
  );

  const handleSave = () => {
    onSave(editableGoals);
    onClose();
  };

  return (
    <ModalWrapper isOpen={isOpen}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Adjust Expense Goals</h3>
        <button onClick={onClose}><IoClose size={24} /></button>
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
        {Object.keys(editableGoals).length > 0 ? (
          Object.entries(editableGoals).map(([category, amount]) => (
            <div key={category} className="flex justify-between items-center">
              <label className="capitalize">{category}</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => handleAmountChange(category, e.target.value)}
                className="w-24 px-2 py-1 border rounded"
              />
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No expense goals set yet. Add one below!</p>
        )}
      </div>

      <div className="space-y-2">
        <h4 className="font-semibold">Add New Goal</h4>
        <div className="flex gap-2">
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="flex-grow border rounded capitalize"
          >
            <option value="">Select Category...</option>
            {availableCategories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Amount"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
            className="w-24 border rounded"
          />
          <button
            onClick={handleAddNewGoal}
            className="bg-blue-500 text-white p-2 rounded"
            disabled={!newCategory || !newAmount}
          >
            <IoAddCircleOutline size={20} />
          </button>
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
        <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded">Save Changes</button>
      </div>
    </ModalWrapper>
  );
};

// --- Main Goals Page ---
const GoalsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [savingsGoal, setSavingsGoal] = useState({ target: 0, achieved: 0 });
  const [expenseGoals, setExpenseGoals] = useState({});
  const [chartData, setChartData] = useState([]);
  const [displayExpenseGoals, setDisplayExpenseGoals] = useState([]);
  const [isSavingsModalOpen, setSavingsModalOpen] = useState(false);
  const [isExpenseModalOpen, setExpenseModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [txRes, goalsRes] = await Promise.all([API.get("/transactions"), API.get("/goals")]);
        setTransactions(txRes.data || []);
        setSavingsGoal((prev) => ({ ...prev, target: goalsRes.data.savingsGoal || 0 }));
        setExpenseGoals(goalsRes.data.expenseGoals || {});
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => { processDataForMonth(currentDate); }, [transactions, currentDate, expenseGoals, savingsGoal.target]);

  const processDataForMonth = (date) => {
    const month = date.getMonth();
    const year = date.getFullYear();
    const monthlyTx = transactions.filter(
      (t) => new Date(t.createdAt).getMonth() === month && new Date(t.createdAt).getFullYear() === year
    );

    const totalIncome = monthlyTx.filter(t => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
    const totalExpenses = monthlyTx.filter(t => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);
    setSavingsGoal((prev) => ({ ...prev, achieved: Math.max(0, totalIncome - totalExpenses) }));

    const firstHalf = monthlyTx.filter(t => new Date(t.createdAt).getDate() <= 15)
      .reduce((net, t) => t.type === "income" ? net + Number(t.amount) : net - Number(t.amount), 0);
    const secondHalf = monthlyTx.filter(t => new Date(t.createdAt).getDate() > 15)
      .reduce((net, t) => t.type === "income" ? net + Number(t.amount) : net - Number(t.amount), 0);

    setChartData([{ name: "Savings", "First Half": firstHalf, "Second Half": secondHalf }]);

    const expensesByCat = monthlyTx.filter(t => t.type === "expense" && t.category)
      .reduce((acc, t) => { acc[t.category] = (acc[t.category] || 0) + Number(t.amount); return acc; }, {});

    const allCategories = [...new Set([...Object.keys(expensesByCat), ...Object.keys(expenseGoals)])];
    setDisplayExpenseGoals(allCategories.map(cat => ({ category: cat, spent: expensesByCat[cat] || 0, amount: expenseGoals[cat] || 0 })));
  };

  const handleUpdateGoals = async (newGoals) => {
    try {
      setSavingsGoal((p) => ({ ...p, target: newGoals.savingsGoal }));
      setExpenseGoals(newGoals.expenseGoals);
      await API.put("/goals", newGoals);
    } catch (err) { console.error(err); }
  };

  const handleMonthChange = (direction) => {
    setCurrentDate(prev => { const d = new Date(prev); d.setMonth(prev.getMonth() + direction); return d; });
  };

  const percentage = savingsGoal.target > 0 ? (savingsGoal.achieved / savingsGoal.target) * 100 : 0;
  const monthStr = currentDate.toLocaleString("default", { month: "long", year: "numeric" });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <SavingsGoalModal
        isOpen={isSavingsModalOpen}
        onClose={() => setSavingsModalOpen(false)}
        currentTarget={savingsGoal.target}
        onSave={(newTarget) => handleUpdateGoals({ savingsGoal: newTarget, expenseGoals })}
      />
      <ExpenseGoalModal
        isOpen={isExpenseModalOpen}
        onClose={() => setExpenseModalOpen(false)}
        goals={expenseGoals}
        onSave={(newGoals) => handleUpdateGoals({ savingsGoal: savingsGoal.target, expenseGoals: newGoals })}
      />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Goals</h1>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded shadow">
          <button onClick={() => handleMonthChange(-1)}><IoChevronBack size={20} /></button>
          <span className="font-semibold">{monthStr}</span>
          <button onClick={() => handleMonthChange(1)}><IoChevronForward size={20} /></button>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white p-6 rounded shadow text-center">
          <h3 className="text-lg font-semibold mb-4">Savings Goal</h3>
          <div style={{ width: 180, height: 180 }} className="mx-auto my-4">
            <CircularProgressbar
              value={percentage}
              text={`$${Math.round(savingsGoal.achieved).toLocaleString()}`}
              styles={buildStyles({ textColor: "#1f2937", pathColor: "#3B82F6", trailColor: "#E5E7EB" })}
            />
          </div>
          <p className="text-sm">Target: ${savingsGoal.target.toLocaleString()}</p>
          <button onClick={() => setSavingsModalOpen(true)} className="mt-4 px-4 py-2 bg-gray-200 rounded">Adjust Goal</button>
        </div>

        <div className="lg:col-span-3 bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">Monthly Savings Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(v) => `$${v}`} />
              <Legend />
              <Bar dataKey="First Half" fill="#8884d8" />
              <Bar dataKey="Second Half" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Expenses Goals by Category</h3>
          <button onClick={() => setExpenseModalOpen(true)} className="flex items-center gap-2 text-blue-600 bg-blue-100 px-3 py-2 rounded">
            Adjust Goals <IoPencil />
          </button>
        </div>

        {displayExpenseGoals.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayExpenseGoals.map((goal) => (
              <ExpenseGoalCard
                key={goal.category}
                goal={goal}
                onSetGoal={(category, amount) =>
                  handleUpdateGoals({ savingsGoal: savingsGoal.target, expenseGoals: { ...expenseGoals, [category]: amount } })
                }
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-white rounded shadow">
            <p className="text-gray-500">No expenses recorded this month. Add a goal to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalsPage;

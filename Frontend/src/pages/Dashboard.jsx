import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import API from "../api"; // your API instance
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";


const Dashboard = () => {
  const [balance, setBalance] = useState(null);
  const [goal, setGoal] = useState(null);
  const [bills, setBills] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [weeklyData, setWeeklyData] = useState({
    week1: 0,
    week2: 0,
    week3: 0,
    week4: 0,
  });
  const [achievedSavings, setAchievedSavings] = useState(0);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const balanceRes = await API.get("/balances");
      const goalRes = await API.get("/goals");
      const billsRes = await API.get("/bills");
      const transRes = await API.get("/transactions");

      setBalance(balanceRes.data);
      setGoal(goalRes.data);
      setBills(billsRes.data);
      setTransactions(transRes.data); // still update state

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      // Current month income
      const monthlyIncome = transRes.data
        .filter(
          (tx) =>
            tx.type === "income" &&
            new Date(tx.createdAt).getMonth() === currentMonth &&
            new Date(tx.createdAt).getFullYear() === currentYear
        )
        .reduce((sum, tx) => sum + tx.amount, 0);

      // Current month expenses
      const totalExpenses = transRes.data
        .filter(
          (tx) =>
            tx.type === "expense" &&
            new Date(tx.createdAt).getMonth() === currentMonth &&
            new Date(tx.createdAt).getFullYear() === currentYear
        )
        .reduce((sum, tx) => sum + tx.amount, 0);

      setAchievedSavings(parseFloat((monthlyIncome - totalExpenses).toFixed(2)));

      // Weekly calculation (optional, same as before)
      let weekTotals = [0, 0, 0, 0];
      transRes.data.forEach((tx) => {
        const txDate = new Date(tx.createdAt);
        if (
          txDate.getMonth() === currentMonth &&
          txDate.getFullYear() === currentYear
        ) {
          const day = txDate.getDate();
          if (day <= 7) weekTotals[0] += tx.amount;
          else if (day <= 14) weekTotals[1] += tx.amount;
          else if (day <= 21) weekTotals[2] += tx.amount;
          else weekTotals[3] += tx.amount;
        }
      });

      setWeeklyData({
        week1: parseFloat(weekTotals[0].toFixed(2)),
        week2: parseFloat(weekTotals[1].toFixed(2)),
        week3: parseFloat(weekTotals[2].toFixed(2)),
        week4: parseFloat(weekTotals[3].toFixed(2)),
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  fetchData();
}, []);


const SimpleBarChart = ({ weeklyData }) => {
  // Convert weeklyData object into Recharts-friendly array
  const chartData = Object.entries(weeklyData || {}).map(([week, value], idx) => ({
    week: `W${idx + 1}`,
    amount: value,
  }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} barGap={15}>
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="amount" fill="#3d74c5ff" name="Weekly Total" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-50 f-screen">
      {/* Top Cards */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Balance (Bank Accounts Only) */}
        <div className="bg-white p-4 rounded-xl shadow flex flex-col items-center justify-center">
          <span className="text-gray-500 text-sm">Total Balance</span>
          <span className="text-3xl font-bold text-gray-800">
            $
            {balance?.accounts
              ? balance.accounts
                  .filter((acc) => acc.type === "Bank") // only bank accounts
                  .reduce((sum, acc) => sum + acc.balance, 0)
                  .toFixed(2)
              : "..."}
          </span>
        </div>

        {/* Monthly Savings */}
        <div className="bg-white p-4 rounded-xl shadow">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-500 text-sm">Monthly Savings</span>
            <NavLink
              to="/goals"
              className="text-teal-500 text-xs hover:underline"
            >
              View All
            </NavLink>
          </div>
          <div className="text-2xl font-bold text-green-600">
            ${achievedSavings}
          </div>
          <div className="text-l text-gray-500 mt-1">
            Target:{" "}
            <span className="text-gray-800 font-semibold">
              ${goal?.savingsGoal ?? "..."}
            </span>
          </div>
          <div className="mt-2 h-2 w-full bg-gray-200 rounded-full">
            <div
              className="h-2 bg-green-500 rounded-full transition-all"
              style={{
                width: goal
                  ? `${Math.min(
                      (achievedSavings / goal?.savingsGoal) * 100,
                      100
                    )}%`
                  : "0%",
              }}
            ></div>
          </div>
        </div>

        {/* Upcoming Bills */}
        <div className="bg-white p-4 rounded-xl shadow">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-500 text-sm">Upcoming Bills</span>
            <NavLink
              to="/bills"
              className="text-teal-500 text-xs hover:underline"
            >
              View All
            </NavLink>
          </div>
          {bills.slice(0, 3).map((bill, i) => (
            <div
              key={i}
              className="flex justify-between items-center p-2 bg-gray-50 rounded mb-1"
            >
              <div>
                <div className="text-gray-700 font-semibold">{bill.title}</div>
                <div className="text-xs text-gray-400">
                  {new Date(bill.createdAt).toLocaleDateString()}
                </div>
              </div>
              <span className="text-red-500 font-bold">${bill.amount}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 flex-3">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white p-4 rounded-xl shadow flex flex-col">
          <div className="flex justify-between mb-2">
            <span className="text-gray-500 text-sm">Recent Transactions</span>
            <NavLink
              to="/transactions"
              className="text-teal-500 text-xs hover:underline"
            >
              View All
            </NavLink>
          </div>
          <ul className="flex flex-col justify-between flex-1">
            {transactions.slice(0, 5).map((tx, i) => (
              <li
                key={i}
                className="flex justify-between items-center p-2 hover:bg-gray-50 rounded transition"
              >
                <div>
                  <div className="text-gray-700 font-medium text-sm">
                    {tx.description}
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <span className="text-gray-600 font-semibold text-sm">
                  ${tx.amount.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weekly Spending Chart */}
        <div className="lg:col-span-3 bg-white p-4 rounded-xl shadow flex flex-col justify-between">
          <span className="text-gray-500 text-sm mb-2">Weekly Transactions</span>
          <SimpleBarChart weeklyData={weeklyData} />
        </div>

      </div>
    </div>
  );
};

export default Dashboard;

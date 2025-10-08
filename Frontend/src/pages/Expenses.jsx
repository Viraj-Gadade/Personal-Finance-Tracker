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
import API from "../api";
import clsx from "clsx";

const Expenses = () => {
  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [breakdown, setBreakdown] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await API.get("/transactions");
      const allTx = res.data || [];

      // Filter only expense transactions
      const expenses = allTx.filter((t) => t.type === "expense");

      generateBreakdown(expenses);
      generateChart(expenses);
      setTransactions(expenses);
    } catch (err) {
      console.error("Error fetching transactions", err);
    }
  };

  // ✅ Compute category-wise breakdown with exact month comparison
  const generateBreakdown = (expenses) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const currentYear = now.getFullYear();
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    // Group by category
    const grouped = expenses.reduce((acc, curr) => {
      const cat = curr.category || "Others";
      const date = new Date(curr.createdAt);
      const month = date.getMonth();
      const year = date.getFullYear();

      if (!acc[cat]) acc[cat] = { current: [], last: [] };

      if (month === currentMonth && year === currentYear) {
        acc[cat].current.push(curr);
      } else if (month === lastMonth && year === lastMonthYear) {
        acc[cat].last.push(curr);
      }

      return acc;
    }, {});

    const formatted = Object.entries(grouped).map(([category, data]) => {
      const currentTotal = data.current.reduce((s, t) => s + Number(t.amount), 0);
      const lastTotal = data.last.reduce((s, t) => s + Number(t.amount), 0);

      const change = lastTotal > 0 ? ((currentTotal - lastTotal) / lastTotal) * 100 : currentTotal;

      const details = [...data.current, ...data.last]
        .slice(-3)
        .map((t) => ({
          name: t.description || "Expense",
          amount: t.amount,
        }));

      return { category, total: currentTotal, change, details };
    });

    setBreakdown(formatted);
  };

  // ✅ Compute monthly chart (last 2 weeks vs first 2 weeks)
  const generateChart = (expenses) => {
    const groupedByMonth = {};

    expenses.forEach((t) => {
      const date = new Date(t.createdAt);
      const month = date.toLocaleString("default", { month: "short" });
      const day = date.getDate();

      if (!groupedByMonth[month]) groupedByMonth[month] = { thisWeek: 0, lastWeek: 0 };

      // For recent months, split by weeks
      if (day > 15) {
        groupedByMonth[month].thisWeek += Number(t.amount);
      } else {
        groupedByMonth[month].lastWeek += Number(t.amount);
      }
    });

    // Convert to array for chart
    const data = Object.entries(groupedByMonth).map(([month, totals]) => ({
      month,
      ...totals,
    }));

    setChartData(data);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen rounded-lg shadow">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Expenses Overview</h2>
        <p className="text-black-500">{new Date().toLocaleDateString()}</p>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Monthly Comparison</h3>
          <span className="text-sm text-gray-500">Current vs Last 2 Weeks</span>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="thisWeek" fill="#3d74c5ff" name="Last 2 Weeks" />
            <Bar dataKey="lastWeek" fill="#efd7b4ff" name="First 2 Weeks" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Breakdown */}
      <h3 className="text-lg font-semibold mb-4">Expenses Breakdown</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {breakdown.map((item) => (
          <div key={item.category} className="bg-white p-5 rounded-lg shadow">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium">{item.category}</h4>
              <span
                className={clsx(
                  "text-sm font-semibold",
                  item.change > 0 ? "text-red-500" : "text-green-600"
                )}
              >
                {item.change > 0
                  ? `↑ ${item.change.toFixed(1)}%`
                  : `↓ ${Math.abs(item.change).toFixed(1)}%`}
              </span>
            </div>
            <p className="text-xl font-semibold mb-3">
              ${item.total.toFixed(2)}
            </p>

            <ul className="text-sm text-gray-600 space-y-1">
              {item.details.map((d, idx) => (
                <li key={idx} className="flex justify-between">
                  <span>{d.name}</span>
                  <span>${d.amount}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Expenses;

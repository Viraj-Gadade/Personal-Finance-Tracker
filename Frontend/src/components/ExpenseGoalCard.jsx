import React from "react";

const ExpenseGoalCard = ({ goal, onSetGoal }) => {
  const spentPercentage = goal.amount > 0 ? (goal.spent / goal.amount) * 100 : 0;
  const progressBarColor =
    spentPercentage > 100 ? "bg-red-500" : "bg-blue-500";

  return (
    <div className="bg-white p-5 rounded-lg shadow">
      <h4 className="font-semibold text-gray-800 capitalize mb-3">
        {goal.category}
      </h4>
      {goal.amount > 0 ? (
        <>
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-xl font-bold text-gray-800">
              ${goal.spent.toFixed(2)}
            </span>
            <span className="text-sm text-gray-500">
              / ${goal.amount.toFixed(2)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`${progressBarColor} h-2.5 rounded-full`}
              style={{ width: `${Math.min(spentPercentage, 100)}%` }}
            ></div>
          </div>
        </>
      ) : (
        <>
          <p className="text-lg font-semibold text-gray-700">
            ${goal.spent.toFixed(2)}{" "}
            <span className="text-sm font-normal text-gray-500">Spent</span>
          </p>
          <button
            onClick={() => {
              const newGoal = prompt(`Set a goal for ${goal.category}:`, "0");
              if (newGoal) onSetGoal(goal.category, Number(newGoal));
            }}
            className="mt-2 w-full text-center bg-blue-50 text-blue-700 font-semibold py-2 rounded-lg hover:bg-blue-100"
          >
            Set Goal
          </button>
        </>
      )}
    </div>
  );
};

export default ExpenseGoalCard;

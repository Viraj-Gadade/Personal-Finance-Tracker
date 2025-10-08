import React from "react";

const Card = ({ title, action, children }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-gray-500">{title}</h3>
        {action && <div>{action}</div>}
      </div>
      {children}
    </div>
  );
};

export default Card;

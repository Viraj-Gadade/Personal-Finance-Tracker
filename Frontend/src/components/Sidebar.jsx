import React, { useEffect, useState } from "react";
import {
  HomeIcon,
  CreditCardIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api";

const Sidebar = () => {
  const { logout } = useAuth(); // get logout from context
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  
  // Fetch current user profile
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/auth/profile");
        setEmail(res.data.email);
        setUsername(res.data.email.split("@")[0]);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchUser();
  }, []);// Placeholder username

  const handleLogout = () => {
    logout(); // clear user (from context )
    navigate("/login"); // redirect to login page
  };

  const menuItems = [
    { name: "Overview", icon: HomeIcon, path: "/dashboard" },
    { name: "Balances", icon: CreditCardIcon, path: "/balance" },
    { name: "Transactions", icon: ArrowPathIcon, path: "/transactions" },
    { name: "Bills", icon: DocumentTextIcon, path: "/bills" },
    { name: "Expenses", icon: CurrencyDollarIcon, path: "/expenses" },
    { name: "Goals", icon: ChartBarIcon, path: "/goals" },
    { name: "Settings", icon: Cog6ToothIcon, path: "/settings" },
  ];

  return (
    <aside className="w-64 bg-black text-white p-6 flex flex-col">
      {/* Logo */}
      <div className="flex items-center space-x-3 mb-8">
        <BanknotesIcon className="h-8 w-8 text-green-400" />
        <h1 className="text-2xl font-bold">MyFinance</h1>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col space-y-2">
        {menuItems.map(({ name, icon: Icon, path }) => (
          <NavLink
            key={name}
            to={path}
            className={({ isActive }) =>
              `flex items-center space-x-3 p-3 rounded cursor-pointer transition 
              ${
                isActive
                  ? "bg-green-600 text-white"
                  : "hover:bg-gray-700 text-gray-300"
              }`
            }
          >
            <Icon className="h-5 w-5" />
            <span>{name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 w-full text-left p-3 rounded hover:bg-gray-700 cursor-pointer"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          <span>Logout</span>
        </button>

        <div className="flex items-center mt-6">
          <UserCircleIcon className="h-10 w-10 rounded-full bg-gray-600 text-white p-1" />
          <div className="ml-3">
            <p className="font-semibold text-white">{username}</p>
            <button
              onClick={() => navigate("/settings")} // redirect to Settings
              className="mt-1 text-sm text-gray-400 hover:underline focus:outline-none cursor-pointer"
            >
              View Profile
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

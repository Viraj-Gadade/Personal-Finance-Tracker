import React, { useEffect, useState } from "react";
import { MagnifyingGlassIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import API from "../api";

const Header = () => {
  const navigate = useNavigate(); // Must be inside the component
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

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white shadow">
      {/* Left: Greeting */}
      <h1 className="text-xl font-semibold">Hello, {username}</h1>

      {/* Middle: Search */}
      <div className="relative w-1/3">
        <input
          type="text"
          placeholder="Search here"
          className="w-full border rounded pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 cursor-pointer" />
      </div>

      {/* Right: User Profile */}
      <div className="flex items-center space-x-3">
        <UserCircleIcon
          className="h-10 w-10 rounded-full bg-gray-600 text-white p-1 cursor-pointer"
        />
        <div>
          <p className="font-semibold text-gray-700">{username}</p>
          <button
            onClick={() => navigate("/settings")} // redirect to Settings
            className="mt-1 text-sm text-gray-400 hover:underline focus:outline-none cursor-pointer"
          >
            View Profile
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

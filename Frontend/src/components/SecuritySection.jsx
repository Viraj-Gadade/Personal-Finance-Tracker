import React, { useState } from "react";
import API from "../api";
import { useAuth } from "../context/AuthContext";

const SecuritySection = () => {
  const { user, login } = useAuth();
  const [showUpdatePassword, setShowUpdatePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("All fields are required!");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await API.put("/auth/update-password", {
        currentPassword,
        newPassword,
      });

      alert("Password updated successfully!");
      setShowUpdatePassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error updating password:", error);
      alert(error?.response?.data?.msg || "Failed to update password");
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Security</h2>

      {!showUpdatePassword ? (
        <>
          <div>
            <label className="block font-medium">Password</label>
            <input
              type="password"
              value="********"
              disabled
              className="border w-full rounded-lg px-3 py-2 mt-1 bg-gray-100 text-gray-600"
            />
          </div>
          <button
            onClick={() => setShowUpdatePassword(true)}
            className="bg-emerald-600 text-white px-4 py-2 mt-3 rounded-lg hover:bg-emerald-700"
          >
            Update Password
          </button>
        </>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block font-medium">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="border w-full rounded-lg px-3 py-2 mt-1"
            />
          </div>
          <div>
            <label className="block font-medium">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border w-full rounded-lg px-3 py-2 mt-1"
            />
          </div>
          <div>
            <label className="block font-medium">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border w-full rounded-lg px-3 py-2 mt-1"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleUpdatePassword}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
            >
              Save
            </button>
            <button
              onClick={() => {
                setShowUpdatePassword(false);
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
              }}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecuritySection;

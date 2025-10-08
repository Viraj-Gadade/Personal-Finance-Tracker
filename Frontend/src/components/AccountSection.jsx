import React, { useState, useEffect } from "react";
import API from "../api";
import { useAuth } from "../context/AuthContext";

const AccountSection = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [showUpdateEmail, setShowUpdateEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [passwordForEmail, setPasswordForEmail] = useState("");

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
  }, []);

  const handleUpdateEmail = async () => {
    try {
      await API.put("/auth/update-email", {
        newEmail,
        password: passwordForEmail,
      });
      alert("Email updated successfully!");
      setEmail(newEmail);
      setUsername(newEmail.split("@")[0]);
      setShowUpdateEmail(false);
      setNewEmail("");
      setPasswordForEmail("");
    } catch (error) {
      console.error("Error updating email:", error);
      alert(error?.response?.data?.msg || "Failed to update email");
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
      <h2 className="text-xl font-semibold mb-4">Account</h2>
      <div className="space-y-4">
        <div>
          <label className="block font-medium">Username</label>
          <input
            type="text"
            value={username}
            disabled
            className="border w-full rounded-lg px-3 py-2 mt-1 bg-gray-100 text-gray-600"
          />
        </div>
        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            value={email}
            disabled
            className="border w-full rounded-lg px-3 py-2 mt-1 bg-gray-100 text-gray-600"
          />
        </div>

        {!showUpdateEmail ? (
          <button
            onClick={() => setShowUpdateEmail(true)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
          >
            Update Email
          </button>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block font-medium">New Email</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="border w-full rounded-lg px-3 py-2 mt-1"
              />
            </div>
            <div>
              <label className="block font-medium">Current Password</label>
              <input
                type="password"
                value={passwordForEmail}
                onChange={(e) => setPasswordForEmail(e.target.value)}
                className="border w-full rounded-lg px-3 py-2 mt-1"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleUpdateEmail}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
              >
                Save
              </button>
              <button
                onClick={() => setShowUpdateEmail(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountSection;

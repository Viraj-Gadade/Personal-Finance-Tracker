import React from "react";
import AccountSection from "../components/AccountSection";
import SecuritySection from "../components/SecuritySection";

const SettingsPage = () => {
  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-8">
      <AccountSection />
      <SecuritySection />
    </div>
  );
};

export default SettingsPage;

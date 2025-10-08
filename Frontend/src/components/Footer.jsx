import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white shadow mt-auto px-6 py-4 text-center text-gray-500 text-sm">
      <p>© {new Date().getFullYear()} MyFinance. All rights reserved.</p>
    </footer>
  );
};

export default Footer;

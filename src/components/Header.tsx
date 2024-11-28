// src/components/Header.tsx

import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="top-0 left-0 w-full flex items-center justify-between p-4 bg-gray-800 text-white shadow-lg">
      <h1 className="text-2xl font-bold">Legacy Family Tree</h1>
      <nav>
        <Link to="/your-trees">
          <button className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 cursor-pointer">
            Your Trees
          </button>
        </Link>
      </nav>
    </header>
  );
};

export default Header;

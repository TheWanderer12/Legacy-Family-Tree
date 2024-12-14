import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="top-0 left-0 w-full flex items-center justify-between p-2 bg-gray-800 text-white shadow-lg z-30">
      <Link to="/" className="h-full">
        <h1 className="text-xl font-bold font-sans">Legacy</h1>
      </Link>
      <nav>
        <Link to="/your-trees">
          <button className="text-base font-sans px-4 py-2 bg-blue-600 rounded-full hover:bg-blue-800 cursor-pointer border border-amber-300">
            Your Trees
          </button>
        </Link>
      </nav>
    </header>
  );
};

export default Header;

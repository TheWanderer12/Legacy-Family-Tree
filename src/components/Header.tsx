// Header component which appears on every page

import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 w-full flex items-center justify-between p-2 bg-gray-800 text-white shadow-lg z-30">
      <Link to="/" className="h-full">
        <h1 className="font-youngSerif text-xl font-bold">Legacy</h1>
      </Link>
      <nav>
        <Link to="/your-trees">
          <button className="text-base font-sans px-4 py-2 bg-blue-600 rounded-xl hover:bg-blue-800 cursor-pointer border border-white transition duration-200 flex items-center">
            <span className="material-symbols-outlined text-base mr-1">
              forest
            </span>
            Your Trees
          </button>
        </Link>
      </nav>
    </header>
  );
};

export default Header;

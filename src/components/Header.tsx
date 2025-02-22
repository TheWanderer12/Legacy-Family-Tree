// Header component which appears on every page
import { Link, useLocation } from "react-router-dom";
import { useDownload } from "context/DownloadContext";

const Header = ({ onDownload }: { onDownload?: () => void }) => {
  const location = useLocation();
  const { handleDownload } = useDownload();
  const isTreePage = location.pathname.startsWith("/tree");

  return (
    <header className="fixed top-0 left-0 w-full flex items-center justify-between p-2 bg-gray-800 text-white shadow-lg z-30">
      <Link to="/" className="h-full">
        <h1 className="font-youngSerif text-xl font-bold">Legacy</h1>
      </Link>
      <nav className="flex space-x-2">
        {isTreePage && handleDownload && (
          <button
            className="text-base font-bold font-sans px-3 py-1 bg-black rounded-xl hover:bg-white hover:text-black cursor-pointer border border-white transition duration-500 flex items-center"
            onClick={handleDownload}
          >
            <span className="material-symbols-outlined text-xl mr-1 font-bold">
              download
            </span>
            Download
          </button>
        )}
        <Link to="/your-trees">
          <button className="text-base font-bold font-sans px-3 py-1 bg-blue-600 rounded-xl hover:bg-blue-800 cursor-pointer border border-white transition duration-200 flex items-center">
            <span className="material-symbols-outlined text-xl mr-1 font-bold">
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

import React from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

export default function Home() {
  const navigate = useNavigate();

  const handleItemClick = (id:Number) => {
    navigate(`/home/item/${id}`); // Include `/home` in the path
  };

  const handleEdit = (e:any, id:Number) => {
    e.stopPropagation(); // Prevent navigation
    console.log(`Edit item ${id}`);
  };

  const handleDelete = (e:any, id:Number) => {
    e.stopPropagation(); // Prevent navigation
    console.log(`Delete item ${id}`);
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-blue-500 text-white text-center p-4 shadow-md">
        <h1 className="text-2xl font-bold">Welcome to Family Tree Creator</h1>
      </div>

      <div className="flex-grow flex justify-center items-center bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-6 w-96">
          <div className="flex justify-end">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600">
              Create New Tree
            </button>
          </div>

          <ul className="mt-4 space-y-4">
            {[1, 2, 3].map((item) => (
              <li
                key={item}
                className="flex justify-between items-center bg-gray-50 hover:bg-gray-100 p-4 rounded-md shadow-sm cursor-pointer"
                onClick={() => handleItemClick(item)}
              >
                <div>
                  <span className="font-semibold">Item {item}</span>
                  <p className="text-sm text-gray-500">Number of people: {item * 5}</p>
                </div>

                <div className="flex space-x-2">
                  <button
                    className="bg-yellow-500 text-white p-2 rounded-full shadow hover:bg-yellow-600"
                    aria-label="Edit"
                    onClick={(e) => handleEdit(e, item)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="bg-red-500 text-white p-2 rounded-full shadow hover:bg-red-600"
                    aria-label="Delete"
                    onClick={(e) => handleDelete(e, item)}
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

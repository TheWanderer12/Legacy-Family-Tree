import React from "react";
import backgroundImage from "../assets/pictures/treepic.webp";

export default function Home() {
  return (
    <div
      className="flex items-center justify-center h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="text-center p-8 rounded">
        <h1 className="text-3xl font-bold mb-8 text-blue-500 bg-white bg-opacity-90 p-3 rounded">
          Welcome to The Legacy Family Tree Creator
        </h1>
        <button className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 cursor-pointer">
          Create new Family Tree
        </button>
      </div>
    </div>
  );
}

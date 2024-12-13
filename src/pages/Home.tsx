import React, { useState } from "react";
import backgroundImage from "../assets/pictures/treepic.webp";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type Node = {
  id: string;
  name: string;
  surname: string;
  gender: string;
  dateOfBirth: string;
  description: string;
  parents: any[];
  siblings: any[];
  spouses: any[];
  children: any[];
};

type Tree = {
  id: string;
  name: string;
  members: Node[];
};

export default function Home() {
  const [showAddTreeModal, setShowAddTreeModal] = useState(false);
  const [newTreeNameInput, setNewTreeNameInput] = useState("");
  const navigate = useNavigate();

  const addTree = async () => {
    if (!newTreeNameInput.trim()) {
      alert("Please enter a valid tree name.");
      return;
    }

    try {
      // Create the new tree
      const newTreeData = {
        name: newTreeNameInput,
        members: [],
      };
      const response = await axios.post<Tree>(
        "http://localhost:5001/api/family-trees",
        newTreeData
      );
      const createdTree = response.data;

      console.log("Created tree:", createdTree);

      // Add the first member named "New Member"
      const newMemberData = {
        name: "New Member",
        surname: "",
        gender: "male",
        dateOfBirth: "",
        description: "",
        parents: [],
        siblings: [],
        spouses: [],
        children: [],
      };
      const memberResponse = await axios.post<Node>(
        `http://localhost:5001/api/family-trees/${createdTree.id}/members`,
        newMemberData
      );
      const createdMember = memberResponse.data;

      console.log("Created member:", createdMember);

      // Update the tree's members with the new member
      createdTree.members = [createdMember];

      // Close the modal and reset input
      setShowAddTreeModal(false);
      setNewTreeNameInput("");

      // Navigate to App.tsx with the new tree and flag to open the sidebar
      navigate(`/tree/${createdTree.id}`, {
        state: {
          tree: createdTree,
          openSidebarForFirstMember: true,
        },
      });
    } catch (error) {
      console.error("Error adding tree:", error);
      alert(`Error adding tree: ${(error as Error).message}`);
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="text-center p-8 rounded">
        <h1 className="text-3xl font-bold mb-8 text-blue-600 bg-red-100 bg-opacity-90 p-3 rounded-3xl">
          Welcome to The Legacy Family Tree Creator
        </h1>
        <button
          className="text-base px-6 py-3 bg-blue-600 text-white rounded-full shadow hover:bg-blue-800 cursor-pointer font-sans border border-amber-300"
          onClick={() => setShowAddTreeModal(true)}
        >
          Create new Family Tree
        </button>
      </div>

      {/* Add Tree Modal */}
      {showAddTreeModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Add New Tree</h2>
            <input
              type="text"
              value={newTreeNameInput}
              onChange={(e) => setNewTreeNameInput(e.target.value)}
              placeholder="Enter tree name"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
            />
            <div className="flex justify-end space-x-2 mt-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 focus:outline-none"
                onClick={() => {
                  setShowAddTreeModal(false);
                  setNewTreeNameInput("");
                }}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none"
                onClick={addTree}
              >
                Create Tree
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

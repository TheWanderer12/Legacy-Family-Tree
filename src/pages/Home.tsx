import React, { useState } from "react";
import backgroundImage from "../assets/pictures/treepic.webp";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AddTreeModal from "components/AddTreeModal/AddTreeModal";
import css from "./Home.module.css";

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

  const addTree = async (newTreeName: string) => {
    if (!newTreeName.trim()) {
      alert("Please enter a valid tree name.");
      return;
    }

    try {
      const newTreeData = {
        name: newTreeName,
        members: [],
      };
      const response = await axios.post<Tree>(
        "http://localhost:5001/api/family-trees",
        newTreeData
      );
      const createdTree = response.data;

      console.log("Created tree:", createdTree);

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

      createdTree.members = [createdMember];

      setShowAddTreeModal(false);
      setNewTreeNameInput("");

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
    <div className="relative flex items-center justify-center h-screen bg-cover bg-center backdrop-filter">
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-sm"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>
      <div className="relative text-center p-8 rounded">
        <h1
          className={`${css.fontYoungSerif} text-5xl mb-8 text-blue-600  bg-opacity-90 p-3 rounded-2xl`}
          style={{ WebkitTextStroke: "1.5px #ffffff" }}
        >
          Welcome to 'Legacy' Family Tree Creator
        </h1>
        <button
          className={`${css.createButton} text-base px-6 py-3 bg-blue-600 text-white rounded-2xl shadow-2xl scale-100 hover:bg-blue-500 hover:scale-125 cursor-pointer font-sans border border-white transition-all duration-300`}
          onClick={() => setShowAddTreeModal(true)}
        >
          Create new Family Tree
        </button>
      </div>

      {/* Add Tree Modal */}
      <AddTreeModal
        isOpen={showAddTreeModal}
        onClose={() => {
          setShowAddTreeModal(false);
          setNewTreeNameInput("");
        }}
        onAddTree={addTree}
      />
    </div>
  );
}

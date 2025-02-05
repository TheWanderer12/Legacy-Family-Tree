import React, { useState, useEffect } from "react";
import axios from "axios";
import { Node } from "../components/Types/types";
import { useNavigate } from "react-router-dom";

type Tree = {
  id: string;
  name: string;
  members: Node[];
};

export default function YourTrees() {
  const [trees, setTrees] = useState<Tree[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingTreeId, setEditingTreeId] = useState<string | null>(null);
  const [newTreeName, setNewTreeName] = useState<string>("");
  const [showAddTreeModal, setShowAddTreeModal] = useState(false);
  const [newTreeNameInput, setNewTreeNameInput] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchTrees();
  }, []);

  const fetchTrees = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<Tree[]>(
        "http://localhost:5001/api/family-trees"
      );
      setTrees(response.data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const openTree = (tree: Tree) => {
    navigate(`/tree/${tree.id}`, { state: { tree } });
  };

  const deleteTree = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this tree?")) {
      return;
    }
    try {
      await axios.delete(`http://localhost:5001/api/family-trees/${id}`);
      setTrees(trees.filter((tree) => tree.id !== id));
    } catch (error) {
      console.error("Error deleting tree:", (error as Error).message);
    }
  };

  const renameTree = async (id: string, newName: string) => {
    console.log(`renameTree called with id: ${id}, newName: ${newName}`);
    try {
      const response = await axios.put<Tree>(
        `http://localhost:5001/api/family-trees/${id}`,
        { name: newName }
      );
      setTrees(
        trees.map((tree) =>
          tree.id === id ? { ...tree, name: response.data.name } : tree
        )
      );
      setEditingTreeId(null);
    } catch (error) {
      console.error("Error renaming tree:", error);
    }
  };

  const handleRename = (id: string) => {
    const treeToRename = trees.find((tree) => tree.id === id);
    if (treeToRename) {
      setNewTreeName(treeToRename.name);
      setEditingTreeId(id);
    }
  };

  const addTree = async () => {
    if (!newTreeNameInput.trim()) {
      alert("Please enter a valid tree name.");
      return;
    }

    try {
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
    <div className="w-full mx-auto pt-8 pb-16 bg-amber-50 min-h-screen">
      <div className="flex flex-col items-center">
        <div className="flex items-center w-full max-w-md justify-between mb-8">
          <h1 className="font-sans text-3xl font-bold">Your Trees</h1>
          <button
            className="font-sans bg-blue-500 text-white px-6 py-2 rounded-2xl hover:bg-blue-700 hover:cursor-pointer focus:outline-none transition duration-200"
            onClick={() => setShowAddTreeModal(true)}
          >
            Add a Tree
          </button>
        </div>

        {loading && (
          <p className="font-sans text-center text-gray-600">
            Loading trees...
          </p>
        )}
        {error && <p className="text-center text-red-500">Error: {error}</p>}
        {trees.length === 0 && !loading && (
          <p className="font-sans text-center text-gray-600">
            No trees available. Add a tree to get started.
          </p>
        )}
        {trees.map((tree) => (
          <div
            key={tree.id}
            className="w-full max-w-md bg-blue-200 shadow-md rounded-xl p-6 mb-4 cursor-pointer hover:shadow-2xl transition-shadow"
            role="button"
            tabIndex={0}
            onClick={() => openTree(tree)}
            onKeyDown={(e) => e.key === "Enter" && openTree(tree)}
          >
            <div className="flex justify-between items-center">
              {editingTreeId === tree.id ? (
                <input
                  type="text"
                  value={newTreeName}
                  onChange={(e) => setNewTreeName(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="border border-gray-300 bg-amber-50 rounded-xl px-2 py-1 focus:outline-none focus:border-blue-500"
                />
              ) : (
                <h2 className="text-xl font-semibold">{tree.name}</h2>
              )}
              <div className="flex space-x-2">
                {editingTreeId === tree.id ? (
                  <button
                    className="font-sans bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-700 focus:outline-none transition duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      renameTree(tree.id, newTreeName);
                    }}
                    aria-label={`Save name for tree ${tree.name}`}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-700 focus:outline-none transition duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRename(tree.id);
                    }}
                    aria-label={`Rename tree ${tree.name}`}
                  >
                    Rename
                  </button>
                )}
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-700 focus:outline-none transition duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTree(tree.id);
                  }}
                  aria-label={`Delete tree ${tree.name}`}
                >
                  Delete
                </button>
              </div>
            </div>
            <p className="font-sans text-gray-600 mt-2">
              Members: {tree.members.length}
            </p>
          </div>
        ))}
      </div>

      {/* Add Tree Modal */}
      {showAddTreeModal && (
        <div className=" fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
            <h2 className="font-sans text-xl font-semibold mb-4">
              Add New Tree
            </h2>
            <input
              type="text"
              value={newTreeNameInput}
              onChange={(e) => setNewTreeNameInput(e.target.value)}
              placeholder="Enter tree name"
              className="font-sans w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
            />
            <div className="flex justify-end space-x-2 mt-4">
              <button
                className="font-sans bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-700 focus:outline-none transition duration-200"
                onClick={() => {
                  setShowAddTreeModal(false);
                  setNewTreeNameInput("");
                }}
              >
                Cancel
              </button>
              <button
                className="font-sans bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 focus:outline-none transition duration-200"
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

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Node } from "../components/Types/types";
import { useNavigate } from "react-router-dom";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/20/solid";
import AddTreeModal from "components/AddTreeModal/AddTreeModal";
import { saveAs } from "file-saver";
import css from "./YourTrees.module.css";

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
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (editingTreeId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingTreeId]);

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

  const downloadTree = async (treeId: string, treeName: string) => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/family-trees/${treeId}`
      );
      const treeData = response.data;

      const jsonString = JSON.stringify(treeData, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });

      saveAs(blob, `${treeName}.json`);
    } catch (error) {
      console.error("Error downloading tree:", error);
      alert("Failed to download tree data.");
    }
  };

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
    <div className="w-full mx-auto pt-8 pb-16 bg-amber-50 min-h-screen px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center">
        <div className="flex items-center w-full max-w-2xl justify-between mb-8">
          <h1 className={`font-youngSerif text-3xl font-bold`}>Your Trees</h1>
          <button
            className="font-sans font-bold bg-blue-500 text-white pl-3 pr-4 py-2 rounded-xl shadow-md hover:bg-blue-700 hover:cursor-pointer focus:outline-none transition duration-200"
            onClick={() => setShowAddTreeModal(true)}
          >
            <PlusIcon className="w-6 h-6 mr-1 inline font-bold" />
            Add a Tree
          </button>
        </div>

        {loading && (
          <p className="font-sans text-center text-gray-600">
            Loading trees from database...
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
            className={`w-full max-w-2xl bg-blue-200 shadow-md rounded-xl p-4 mb-4 cursor-pointer hover:shadow-2xl transition-shadow ${
              editingTreeId === tree.id ? "pt-3" : "pt-4"
            }`}
            role="button"
            tabIndex={0}
            onClick={() => openTree(tree)}
            onKeyDown={(e) => e.key === "Enter" && openTree(tree)}
          >
            <div className="flex justify-between items-center gap-4">
              {editingTreeId === tree.id ? (
                <input
                  ref={inputRef}
                  type="text"
                  value={newTreeName}
                  onChange={(e) => setNewTreeName(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.stopPropagation();
                      renameTree(tree.id, newTreeName);
                    }
                    if (e.key === "Escape") {
                      e.stopPropagation();
                      setEditingTreeId(null);
                    }
                  }}
                  className={`${css.smallScreenInput} min-w-[150px] max-w-full border-2 border-gray-300 bg-amber-50 rounded-xl px-2 py-1 focus:outline-none focus:border-gray-700 text-lg`}
                />
              ) : (
                <h2
                  className={`${css.smallScreenTitle} text-xl font-semibold break-words`}
                >
                  {tree.name}
                </h2>
              )}
              <p
                className={`${css.smallScreenMembers} font-sans text-gray-600 font-semibold whitespace-nowrap`}
              >
                Members:{" "}
                <p
                  className={`${css.smallScreenMemberCount} font-bold inline text-black text-base`}
                >
                  {tree.members.length}
                </p>
              </p>
            </div>

            <div
              className={`flex w-full sm:w-auto justify-center sm:justify-start gap-2 ${
                editingTreeId === tree.id ? "mt-2" : "mt-3"
              }`}
            >
              {editingTreeId === tree.id ? (
                <>
                  <button
                    className={`${css.smallScreenButtons} w-full sm:w-[120px] h-[32px] flex items-center justify-center font-sans font-bold bg-gray-100 text-black px-8 py-1 rounded-full shadow-md hover:bg-gray-800 hover:text-white focus:outline-none transition duration-200`}
                    onClick={(e) => {
                      e.stopPropagation();
                      renameTree(tree.id, newTreeName);
                    }}
                    aria-label={`Save name for tree ${tree.name}`}
                  >
                    Save
                  </button>
                  <button
                    className={`${css.smallScreenButtons} w-full sm:w-[120px] h-[32px] flex items-center justify-center font-sans font-bold bg-gray-500 text-white px-5 py-1 rounded-full shadow-md hover:bg-gray-800 focus:outline-none transition duration-200`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingTreeId(null);
                    }}
                    aria-label={`Cancel renaming tree ${tree.name}`}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    className={`${css.smallScreenButtons} w-full sm:w-[120px] flex items-center justify-center font-sans font-bold bg-gray-100 text-black px-3 py-1 rounded-full shadow-md hover:bg-gray-800 hover:text-white focus:outline-none transition duration-200`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRename(tree.id);
                    }}
                    aria-label={`Rename tree ${tree.name}`}
                  >
                    <PencilIcon className="w-4 h-4 inline mr-1" />
                    Rename
                  </button>
                  <button
                    className={`${css.smallScreenButtons} w-full sm:w-[120px] flex items-center justify-center font-sans font-bold bg-gray-100 text-black px-3 py-1 rounded-full shadow-md hover:bg-gray-800 hover:text-white focus:outline-none transition duration-200`}
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadTree(tree.id, tree.name);
                    }}
                    aria-label={`Download tree ${tree.name}`}
                  >
                    <span className="material-symbols-outlined">download</span>
                    Download
                  </button>
                  <button
                    className={`${css.smallScreenButtons} w-full sm:w-[120px] flex items-center justify-center font-sans font-bold bg-red-500 text-white px-3 py-1 rounded-full shadow-md hover:bg-red-700 focus:outline-none transition duration-200`}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTree(tree.id);
                    }}
                    aria-label={`Delete tree ${tree.name}`}
                  >
                    <TrashIcon className="w-4 h-4 inline mr-1" />
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Add Tree Modal */}
      <AddTreeModal
        isOpen={showAddTreeModal}
        onClose={() => setShowAddTreeModal(false)}
        onAddTree={addTree}
      />
    </div>
  );
}

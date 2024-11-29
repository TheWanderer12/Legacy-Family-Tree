import React, { useState, useEffect } from "react";
import axios from "axios";
import { RelData, Node } from "types";
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
    navigate(`/tree/${tree.id}`, { state: { tree } }); // Pass the tree data
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

  const addTree = async () => {
    const newTree = {
      name: `Tree ${trees.length + 1}`,
      members: [],
    };
    try {
      const response = await axios.post<Tree>(
        "http://localhost:5001/api/family-trees",
        newTree
      );
      setTrees([...trees, response.data]);
    } catch (error) {
      console.error("Error adding tree:", (error as Error).message);
    }
  };

  return (
    <div>
      <h1 className="mt-32">Your Trees:</h1>
      {loading && <p>Loading trees...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {trees.length === 0 && !loading && (
        <p>No trees available. Add a tree to get started.</p>
      )}
      <div className="flex flex-wrap mt-8">
        {trees.map((tree) => (
          <div
            key={tree.id}
            className="border rounded-lg p-4 m-2 cursor-pointer"
            role="button"
            tabIndex={0}
            onClick={() => openTree(tree)}
            onKeyDown={(e) => e.key === "Enter" && openTree(tree)}
          >
            <h2>{tree.name}</h2>
            <button
              className="bg-red-500 text-white p-2 rounded mt-2"
              onClick={(e) => {
                e.stopPropagation();
                deleteTree(tree.id);
              }}
              aria-label={`Delete tree ${tree.name}`}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      <button
        className="bg-blue-500 text-white p-2 rounded mt-4"
        onClick={addTree}
      >
        Add Tree
      </button>
    </div>
  );
}

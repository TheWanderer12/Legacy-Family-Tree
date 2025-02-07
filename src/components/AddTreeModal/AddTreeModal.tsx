import { useState } from "react";

interface AddTreeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTree: (treeName: string) => void;
}

export default function AddTreeModal({
  isOpen,
  onClose,
  onAddTree,
}: AddTreeModalProps) {
  const [newTreeNameInput, setNewTreeNameInput] = useState("");

  return (
    <div
      onClick={() => {
        setNewTreeNameInput("");
        onClose();
      }}
      className={`fixed inset-0 flex items-center justify-center transition-colors ${
        isOpen ? "visible bg-black/40" : "invisible"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white p-6 rounded-2xl shadow-lg text-center transition-all ${
          isOpen ? "scale-100 opacity-100" : "scale-125 opacity-0"
        }`}
      >
        <h2 className="font-sans text-xl font-semibold mb-4">Add New Tree</h2>
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
              setNewTreeNameInput("");
              onClose();
            }}
          >
            Cancel
          </button>
          <button
            className="font-sans bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 focus:outline-none transition duration-200"
            onClick={() => onAddTree(newTreeNameInput)}
          >
            Create Tree
          </button>
        </div>
      </div>
    </div>
  );
}

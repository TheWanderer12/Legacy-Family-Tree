import { useState, useRef, useEffect } from "react";

interface AddTreeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTree: (treeName: string) => void;
  existingTreeNames: string[];
}

export default function AddTreeModal({
  isOpen,
  onClose,
  onAddTree,
  existingTreeNames,
}: AddTreeModalProps) {
  const [newTreeNameInput, setNewTreeNameInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);

  // Focus the input when the modal is opened. Wait for the transition to end first.
  useEffect(() => {
    if (isOpen) {
      const defaultName = "New Family Tree";
      const uniqueName = generateUniqueTreeName(defaultName, existingTreeNames);
      setNewTreeNameInput(uniqueName);

      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 100);
    }
  }, [isOpen, existingTreeNames]);

  const generateUniqueTreeName = (
    baseName: string,
    existingNames: string[]
  ) => {
    let count = 1;
    let newName = baseName;

    while (existingNames.includes(newName)) {
      count++;
      newName = `${baseName} ${count}`;
    }

    return newName;
  };

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
        ref={modalContentRef}
        onClick={(e) => e.stopPropagation()}
        className={`bg-white p-6 rounded-2xl shadow-lg text-center transition-all ${
          isOpen ? "scale-100 opacity-100" : "scale-125 opacity-0"
        }`}
      >
        <h2 className="font-sans text-xl font-semibold mb-4">Add New Tree</h2>
        <input
          ref={inputRef}
          type="text"
          value={newTreeNameInput}
          onChange={(e) => setNewTreeNameInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onAddTree(newTreeNameInput);
            }
          }}
          placeholder="Enter tree name"
          className="font-sans w-full border-2 border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-gray-700"
        />
        <div className="flex justify-end space-x-2 mt-4">
          <button
            className="font-sans font-bold bg-red-500 text-white px-4 py-2 rounded-xl shadow-lg  hover:bg-red-700 focus:outline-none transition duration-200"
            onClick={() => {
              setNewTreeNameInput("");
              onClose();
            }}
          >
            Cancel
          </button>
          <button
            className="font-sans font-bold bg-blue-600 text-white px-4 py-2 rounded-xl shadow-lg hover:bg-blue-700 focus:outline-none transition duration-200"
            onClick={() => onAddTree(newTreeNameInput)}
          >
            Create Tree
          </button>
        </div>
      </div>
    </div>
  );
}

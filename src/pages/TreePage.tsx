import React, { useState } from "react";

// Define TypeScript types
type Relationship = {
  id: string;
  type: "blood" | "adoptive" | "marriage" | ""; // Add more types as needed
};

interface Person {
  id: string;
  gender: "male" | "female" | "other";
  name: string;
  parents: Relationship[];
  siblings: Relationship[];
  spouses: Relationship[];
  children: Relationship[];
}

const TreePage: React.FC = () => {
  // Example data
  const [person, setPerson] = useState<Person>({
    id: "HkqEDLvxE",
    gender: "male",
    name: "Ravil",
    parents: [
      { id: "011jVS4rb", type: "blood" },
      { id: "PXACjDxmR", type: "blood" },
    ],
    siblings: [
      { id: "kuVISwh7w", type: "blood" },
      { id: "UIEjvLJMd", type: "blood" },
      { id: "ZVi8fWDBx", type: "blood" },
    ],
    spouses: [],
    children: [],
  });

  // Handlers
  const handleInputChange = (field: keyof Person, value: string | Relationship[]) => {
    setPerson({ ...person, [field]: value });
  };

  const handleListChange = (
    field: keyof Omit<Person, "id" | "gender" | "name">,
    index: number,
    subField: keyof Relationship,
    value: string
  ) => {
    const updatedList = [...person[field]];
    updatedList[index] = { ...updatedList[index], [subField]: value };
    setPerson({ ...person, [field]: updatedList });
  };

  const handleAddToList = (field: keyof Omit<Person, "id" | "gender" | "name">) => {
    const newItem: Relationship = { id: "", type: "" }; // Default new item
    setPerson({ ...person, [field]: [...person[field], newItem] });
  };

  const handleRemoveFromList = (field: keyof Omit<Person, "id" | "gender" | "name">, index: number) => {
    const updatedList = person[field].filter((_, i) => i !== index);
    setPerson({ ...person, [field]: updatedList });
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-100 p-4 shadow-md flex flex-col h-full">
        {/* Title stays on top */}
        <h2 className="text-lg font-bold mb-4">Edit Family Member</h2>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto">
          {/* Name */}
          <label className="block mb-2 font-semibold">Name:</label>
          <input
            type="text"
            value={person.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="w-full mb-4 p-2 border rounded"
          />

          {/* Gender */}
          <label className="block mb-2 font-semibold">Gender:</label>
          <select
            value={person.gender}
            onChange={(e) => handleInputChange("gender", e.target.value as Person["gender"])}
            className="w-full mb-4 p-2 border rounded"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          {/* Relationships */}
          {["parents", "siblings", "spouses", "children"].map((relation) => (
            <div key={relation} className="mb-6">
              <h3 className="font-semibold capitalize">{relation}:</h3>
              {(person[relation as keyof Omit<Person, "id" | "gender" | "name">] as Relationship[]).map((rel, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  {/* ID */}
                  <input
                    type="text"
                    placeholder="ID"
                    value={rel.id}
                    onChange={(e) =>
                      handleListChange(
                        relation as keyof Omit<Person, "id" | "gender" | "name">,
                        index,
                        "id",
                        e.target.value
                      )
                    }
                    className="flex-1 p-2 border rounded"
                  />
                  {/* Type */}
                  <select
                    value={rel.type}
                    onChange={(e) =>
                      handleListChange(
                        relation as keyof Omit<Person, "id" | "gender" | "name">,
                        index,
                        "type",
                        e.target.value as Relationship["type"]
                      )
                    }
                    className="p-2 border rounded"
                  >
                    <option value="">Select Type</option>
                    <option value="blood">Blood</option>
                    <option value="adoptive">Adoptive</option>
                    <option value="marriage">Marriage</option>
                  </select>
                  {/* Remove Button */}
                  <button
                    onClick={() =>
                      handleRemoveFromList(
                        relation as keyof Omit<Person, "id" | "gender" | "name">,
                        index
                      )
                    }
                    className="text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}
              {/* Add Button */}
              <button
                onClick={() =>
                    handleAddToList(relation as keyof Omit<Person, "id" | "gender" | "name">)
                }
                className="text-blue-500 hover:underline"
                >
                Add {relation === "children" ? "children" : relation.slice(0, -1)}
                </button>
            </div>
          ))}
        </div>

        {/* Save Button at the Bottom */}
        <div className="mt-4">
          <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Save Changes
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center bg-white overflow-auto">
        <h1 className="text-2xl font-bold">TreePage: {person.name}</h1>
      </div>
    </div>
  );
};

export default TreePage;

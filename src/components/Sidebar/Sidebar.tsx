import { Node, RelType } from "types";
// import { Node, RelType } from "./type_bu";

import React, { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import styles from "./Sidebar.module.css";
interface SidebarProps {
  member: Node;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedData: Partial<Node>) => void;
  treeId: string;
  allMembers: Node[]; // Pass the full list of members in the tree
}

const Sidebar: React.FC<SidebarProps> = ({
  member,
  isOpen,
  onClose,
  onSave,
  treeId,
  allMembers,
}) => {
  const [formData, setFormData] = useState<Partial<Node>>(member);
  const [relationType, setRelationType] = useState<RelType>(RelType.blood);
  const [relationMode, setRelationMode] = useState<
    "parent" | "sibling" | "spouse" | "child" | null
  >(null); // Manage active relation mode
  const [relatedMemberId, setRelatedMemberId] = useState("");

  useEffect(() => {
    // Sync form data with the current member when it changes
    setFormData(member);
  }, [member]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    if (!formData.name || formData.name.length < 1) {
      alert("Name is required");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5001/api/family-trees/${treeId}/members/${member.id}`,
        formData
      );
      onSave(formData);
      alert("Member updated successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to save member");
    }
  };

  const handleAddRelation = async () => {
    if (!relatedMemberId) {
      alert("Please select a related member");
      return;
    }

    try {
      await axios.post(
        `http://localhost:5001/api/family-trees/${treeId}/members/${member.id}/relation`,
        { relatedMemberId, type: relationType }
      );
      alert("Relation added successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to add relation");
    }
  };

  const handleRelationMode = (
    mode: "parent" | "sibling" | "spouse" | "child"
  ) => {
    setRelationMode(mode);
    setRelationType(mode === "sibling" ? RelType.blood : RelType.blood); // Default relation type
    setRelatedMemberId(""); // Reset selected member
  };

  const relatedMembers = allMembers.filter((m) => m.id !== member.id);

  return (
    <>
      <div
        className={`${styles.overlay} ${isOpen ? styles.open : ""}`}
        onClick={onClose}
      ></div>
      <div className={`${styles.container} ${isOpen ? styles.open : ""}`}>
        <h3>Edit Family Member</h3>
        <input
          type="text"
          name="name"
          value={formData.name || ""}
          onChange={handleChange}
          placeholder="Name"
        />
        <input
          type="text"
          name="surname"
          value={formData.surname || ""}
          onChange={handleChange}
          placeholder="Surname"
        />
        <select
          name="gender"
          value={formData.gender || "male"}
          onChange={handleChange}
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth?.toString().slice(0, 10) || ""}
          onChange={handleChange}
        />
        <textarea
          name="description"
          value={formData.description || ""}
          onChange={handleChange}
          placeholder="Description"
        />
        <button onClick={handleSave}>Save</button>

        <h3>Relationships</h3>
        <button onClick={() => handleRelationMode("parent")}>Add Parent</button>
        <button onClick={() => handleRelationMode("sibling")}>
          Add Sibling
        </button>
        <button onClick={() => handleRelationMode("spouse")}>Add Spouse</button>
        <button onClick={() => handleRelationMode("child")}>Add Child</button>

        {relationMode && (
          <>
            <h4>
              Add {relationMode.charAt(0).toUpperCase() + relationMode.slice(1)}
            </h4>
            <select
              name="relatedMemberId"
              value={relatedMemberId}
              onChange={(e) => setRelatedMemberId(e.target.value)}
            >
              <option value="">Select a member</option>
              {relatedMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} {m.surname} ({m.gender})
                </option>
              ))}
            </select>
            <button onClick={handleAddRelation}>Save Relation</button>
          </>
        )}
      </div>
    </>
  );
};

export default Sidebar;

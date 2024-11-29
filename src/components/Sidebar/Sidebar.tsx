import React, { useState, ChangeEvent } from "react";
import type { Node } from "types";
import { MongoClient } from "mongodb";
import styles from "./Sidebar.module.css";

interface SidebarProps {
  member: Node;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedData: Partial<Node>) => {};
  onAddRelation: (relationType: keyof Node, memberId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  member,
  isOpen,
  onClose,
  onSave,
  onAddRelation,
}) => {
  const [formData, setFormData] = useState<Partial<Node>>(member);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    onSave(formData);
  };

  // const handleAddRelation = (relationType: keyof IMember) => {
  //   onAddRelation(relationType, member.id.toString());
  // };

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
        {/* <button onClick={() => handleAddRelation("parents")}>Add Parent</button>
      <button onClick={() => handleAddRelation("siblings")}>Add Sibling</button>
      <button onClick={() => handleAddRelation("spouses")}>Add Spouse</button>
      <button onClick={() => handleAddRelation("children")}>Add Child</button> */}
      </div>
    </>
  );
};

export default Sidebar;

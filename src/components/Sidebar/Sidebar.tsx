import React, { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import { Node, RelType, Gender, Relation } from "../Types/types";
import styles from "./Sidebar.module.css";

interface SidebarProps {
  member: Node;
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    updatedData: Node,
    relationMode?: "parent" | "sibling" | "spouse" | "child",
    relationType?: RelType,
    triggerMemberId?: string
  ) => void;
  treeId: string;
  allMembers: Node[];
}

const Sidebar: React.FC<SidebarProps> = ({
  member,
  isOpen,
  onClose,
  onSave,
  treeId,
  allMembers,
}) => {
  const [formData, setFormData] = useState<Node>(member);
  const [relationType, setRelationType] = useState<RelType>(RelType.blood);
  const [relationMode, setRelationMode] = useState<
    "parent" | "sibling" | "spouse" | "child" | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [relationOptions, setRelationOptions] = useState<RelType[]>([]);
  const [spouseIdForChild, setSpouseIdForChild] = useState<string>("none");
  const [childrenForSpouse, setChildrenForSpouse] = useState<string[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setFormData(member);
  }, [member]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollContainer = document.querySelector(".scroll-container");
      if (scrollContainer) {
        const scrollTop = scrollContainer.scrollTop;
        setIsScrolled(scrollTop > 0);
      }
    };

    const scrollContainer = document.querySelector(".scroll-container");
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    if (!formData.name || formData.name.length < 1) {
      console.log("Name is required");
      return;
    }

    try {
      setIsLoading(true);
      await axios.put(
        `http://localhost:5001/api/family-trees/${treeId}/members/${member.id}`,
        formData
      );
      onSave(formData);
      console.log("Member updated successfully");
    } catch (error) {
      console.error(error);
      console.log("Failed to save member");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRelationMode = (
    mode: "parent" | "sibling" | "spouse" | "child"
  ) => {
    setRelationMode(mode);
    setSpouseIdForChild("none");
    setChildrenForSpouse([]);

    let options: RelType[] = [];
    if (mode === "parent") {
      const bloodParents = member.parents.filter(
        (rel) => rel.type === RelType.blood
      ).length;
      options =
        bloodParents < 2 ? [RelType.blood, RelType.adopted] : [RelType.adopted];
    } else if (mode === "sibling") {
      options = [RelType.blood, RelType.half];
    } else if (mode === "spouse") {
      options = [RelType.married, RelType.divorced];
    } else if (mode === "child") {
      options = [RelType.blood, RelType.adopted];
    }

    setRelationOptions(options);
    if (options.length > 0) {
      setRelationType(options[0]);
    }
  };

  const handleAddRelation = async () => {
    if (!relationMode) return;

    try {
      setIsLoading(true);
      let newMemberData: Partial<Node> = {
        id: "",
        name: "",
        surname: "",
        gender: Gender.male,
        dateOfBirth: "",
        parents: [],
        children: [],
        siblings: [],
        spouses: [],
      };

      if (relationMode === "parent") {
        const firstParent = member.parents[0]
          ? allMembers.find((m) => m.id === member.parents[0].id)
          : null;
        if (firstParent) {
          newMemberData.gender =
            firstParent.gender === Gender.male ? Gender.female : Gender.male;
        } else {
          newMemberData.gender = Gender.male;
        }
        newMemberData.name = `${member.name}'s parent`;

        const response = await axios.post<Node>(
          `http://localhost:5001/api/family-trees/${treeId}/members`,
          newMemberData
        );
        const newParent: Node = response.data;

        await axios.post(
          `http://localhost:5001/api/family-trees/${treeId}/members/${member.id}/relation`,
          {
            relatedMemberId: newParent.id,
            type: relationType,
            mode: "parent",
          }
        );

        if (firstParent) {
          await axios.post(
            `http://localhost:5001/api/family-trees/${treeId}/members/${firstParent.id}/relation`,
            {
              relatedMemberId: newParent.id,
              type: RelType.married,
              mode: "spouse",
            }
          );
        }

        onSave(newParent, relationMode, relationType, member.id);
        console.log("Parent added successfully");
      } else if (relationMode === "sibling") {
        newMemberData.name = `${member.name}'s sibling`;
        newMemberData.gender = Gender.male;

        const response = await axios.post<Node>(
          `http://localhost:5001/api/family-trees/${treeId}/members`,
          newMemberData
        );
        const newSibling: Node = response.data;

        await axios.post(
          `http://localhost:5001/api/family-trees/${treeId}/members/${member.id}/relation`,
          {
            relatedMemberId: newSibling.id,
            type: relationType,
            mode: "sibling",
          }
        );

        onSave(newSibling, relationMode, relationType, member.id);
        console.log("Sibling added successfully");
      } else if (relationMode === "spouse") {
        newMemberData.name = `${member.name}'s spouse`;
        newMemberData.gender =
          member.gender === Gender.male ? Gender.female : Gender.male;

        const response = await axios.post<Node>(
          `http://localhost:5001/api/family-trees/${treeId}/members`,
          newMemberData
        );
        const newSpouse: Node = response.data;

        await axios.post(
          `http://localhost:5001/api/family-trees/${treeId}/members/${member.id}/relation`,
          {
            relatedMemberId: newSpouse.id,
            type: relationType,
            mode: "spouse",
            childrenForSpouse,
          }
        );

        onSave(newSpouse, relationMode, relationType, member.id);
        console.log("Spouse added successfully");
      } else if (relationMode === "child") {
        newMemberData.name = `${member.name}'s child`;
        newMemberData.gender = Gender.male;

        const response = await axios.post<Node>(
          `http://localhost:5001/api/family-trees/${treeId}/members`,
          newMemberData
        );
        const newChild: Node = response.data;

        await axios.post(
          `http://localhost:5001/api/family-trees/${treeId}/members/${member.id}/relation`,
          {
            relatedMemberId: newChild.id,
            type: relationType,
            mode: "child",
            spouseIdForChild,
          }
        );

        onSave(newChild, relationMode, relationType, member.id);
        console.log("Child added successfully");
      }

      setRelationMode(null);
      onClose();
    } catch (error) {
      console.error(error);
      console.log("Failed to add relation");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 h-full w-full max-w-xs bg-gray-200 z-50 transform transition-transform duration-300 ease-in-out shadow-lg ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ boxShadow: "2px 0 5px rgba(0, 0, 0, 0.3)" }}
      >
        <div
          className="scroll-container overflow-y-auto h-full"
          onWheel={(e) => e.stopPropagation()}
        >
          <div
            className={`sticky top-0 bg-gray-200 flex items-center justify-between ${
              isScrolled ? "shadow-md" : ""
            }`}
          >
            <h3 className="text-2xl font-semibold py-3 px-6">
              Edit Family Member
            </h3>
            <button
              onClick={onClose}
              className="absolute right-4 text-2xl text-red-500 hover:text-red-700 focus:outline-none bg-white rounded-full w-8 h-8 flex items-center justify-center shadow hover:shadow-xl border border-red-500"
            >
              &times;
            </button>
          </div>
          <div className="px-6 pb-20 font-sans space-y-4">
            <div>
              <label className="block text-black">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                placeholder="Enter name"
                className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-black">Surname</label>
              <input
                type="text"
                name="surname"
                value={formData.surname || ""}
                onChange={handleChange}
                placeholder="Enter surname"
                className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-black">Gender</label>
              <select
                name="gender"
                value={formData.gender || "male"}
                onChange={handleChange}
                className={`w-full p-2 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-1 focus:border-blue-400`}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-black">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth?.toString().slice(0, 10) || ""}
                onChange={handleChange}
                className={`w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:border-blue-400 ${styles.dateInput}`}
              />
            </div>

            <div>
              <label className="block text-black">Description</label>
              <textarea
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                placeholder="Enter description"
                className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:border-blue-400"
                rows={4}
              ></textarea>
            </div>

            <button
              onClick={handleSave}
              className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition duration-200"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
            </button>

            <h3 className="text-2xl font-semibold py-2">Relationships</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleRelationMode("parent")}
                className={`text-white py-2 px-3 rounded-xl transition duration-200 ${
                  relationMode === "parent"
                    ? "bg-green-900 ring-2 ring-black"
                    : "bg-green-700 hover:bg-green-800"
                } text-white`}
              >
                Add Parent
              </button>
              <button
                onClick={() => handleRelationMode("sibling")}
                className={`text-white py-2 px-3 rounded-xl transition duration-200 ${
                  relationMode === "sibling"
                    ? "bg-green-900 ring-2 ring-black"
                    : "bg-green-700 hover:bg-green-800"
                } text-white`}
              >
                Add Sibling
              </button>
              <button
                onClick={() => handleRelationMode("spouse")}
                className={`text-white py-2 px-3 rounded-xl transition duration-200 ${
                  relationMode === "spouse"
                    ? "bg-green-900 ring-2 ring-black"
                    : "bg-green-700 hover:bg-green-800"
                } text-white`}
              >
                Add Spouse
              </button>
              <button
                onClick={() => handleRelationMode("child")}
                className={`text-white py-2 px-3 rounded-xl transition duration-200 ${
                  relationMode === "child"
                    ? "bg-green-900 ring-2 ring-black"
                    : "bg-green-700 hover:bg-green-800"
                } text-white`}
              >
                Add Child
              </button>
            </div>

            {relationMode && (
              <div className="mt-4">
                <h4 className="text-xl font-semibold mb-2">
                  Add{" "}
                  {relationMode.charAt(0).toUpperCase() + relationMode.slice(1)}
                </h4>

                {relationOptions.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-black">
                      Relationship Type
                    </label>
                    <select
                      name="relationType"
                      value={relationType}
                      onChange={(e) =>
                        setRelationType(e.target.value as RelType)
                      }
                      className="w-full p-2 border border-gray-300 rounded-xl bg-white hover:cursor-pointer focus:outline-none focus:ring-1 focus:border-blue-400"
                    >
                      {relationOptions.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {relationMode === "spouse" && (
                  <div className="mb-4">
                    <label className="block text-black">
                      Select Children with New Spouse
                    </label>
                    {member.children.length > 0 ? (
                      member.children.map((childRel) => {
                        const child = allMembers.find(
                          (m) => m.id === childRel.id
                        );
                        if (!child) return null;
                        return (
                          <div key={child.id} className="flex items-center">
                            <input
                              type="checkbox"
                              value={child.id}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setChildrenForSpouse((prev) => [
                                    ...prev,
                                    child.id,
                                  ]);
                                } else {
                                  setChildrenForSpouse((prev) =>
                                    prev.filter((id) => id !== child.id)
                                  );
                                }
                              }}
                            />
                            <span className="ml-2">
                              {child.name} {child.surname}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <p>No children to select.</p>
                    )}
                  </div>
                )}

                {relationMode === "child" && (
                  <div className="mb-4">
                    <label className="block text-black">
                      Select Spouse (if any)
                    </label>
                    <select
                      name="spouseIdForChild"
                      value={spouseIdForChild}
                      onChange={(e) => setSpouseIdForChild(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-xl bg-white hover:cursor-pointer focus:outline-none focus:ring-1 focus:border-blue-400"
                    >
                      <option value="none">None</option>
                      {member.spouses.map((spouseRel) => {
                        const spouse = allMembers.find(
                          (m) => m.id === spouseRel.id
                        );
                        if (!spouse) return null;
                        return (
                          <option key={spouse.id} value={spouse.id}>
                            {spouse.name} {spouse.surname}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                )}

                <button
                  onClick={handleAddRelation}
                  className="mt-2 w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? "Adding..." : "Confirm"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

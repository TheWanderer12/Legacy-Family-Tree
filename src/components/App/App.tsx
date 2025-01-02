import React, { useMemo, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Node, ExtNode, RelType } from "../Types/types";
import ReactFamilyTree from "react-family-tree";
import { PinchZoomPan } from "../PinchZoomPan/PinchZoomPan";
import { FamilyNode } from "../FamilyNode/FamilyNode";
import { NODE_WIDTH, NODE_HEIGHT } from "../const";
import { getNodeStyle } from "./utils";
import Sidebar from "../Sidebar/Sidebar";
import css from "./App.module.css";
import { useLocation, useNavigate } from "react-router-dom";

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const [nodes, setNodes] = useState<Node[]>([]);
  const [rootId, setRootId] = useState<string>("");
  const [selectId, setSelectId] = useState<string>();
  const [hoverId, setHoverId] = useState<string>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const tree = location.state?.tree as {
    id: string;
    name: string;
    members: Node[];
  } | null;

  useEffect(() => {
    if (!tree) {
      console.error(
        "No tree data found in location.state. Redirecting to YourTrees."
      );
      navigate("/your-trees");
    }
  }, [tree, navigate]);

  // Fetch tree data
  useEffect(() => {
    if (tree) {
      const fetchTree = async () => {
        try {
          const response = await axios.get<{
            id: string;
            name: string;
            members: Node[];
          }>(`http://localhost:5001/api/family-trees/${tree.id}`);

          setNodes(response.data.members);
          if (response.data.members.length > 0) {
            setRootId(response.data.members[0].id);
          }
        } catch (error) {
          console.error("Error fetching tree data:", (error as Error).message);
        }
      };

      fetchTree();
    }
  }, [tree]);

  const firstNodeId = useMemo(
    () => (nodes.length > 0 ? nodes[0].id : ""),
    [nodes]
  );

  const resetRootHandler = useCallback(
    () => setRootId(firstNodeId),
    [firstNodeId]
  );

  const selected = useMemo(
    () => nodes.find((item) => item.id === selectId),
    [nodes, selectId]
  );

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectId(undefined);
  };

  function integrateNewMember(
    prevNodes: Node[],
    newMember: Node,
    relationMode?: "parent" | "sibling" | "spouse" | "child",
    relationType?: RelType,
    triggerMemberId?: string,
    childrenForSpouse?: string[]
  ): Node[] {
    // if no new member, update details of focused member
    if (!relationMode || !relationType || !triggerMemberId) {
      return prevNodes.map((node) =>
        node.id === newMember.id ? { ...node, ...newMember } : node
      );
    }

    let updatedNodes = [...prevNodes, newMember];

    const triggerIndex = updatedNodes.findIndex(
      (n) => n.id === triggerMemberId
    );
    const newIndex = updatedNodes.findIndex((n) => n.id === newMember.id);
    if (triggerIndex === -1 || newIndex === -1) {
      return updatedNodes;
    }

    const triggerMember = { ...updatedNodes[triggerIndex] };
    const createdMember = { ...updatedNodes[newIndex] };

    if (relationMode === "parent") {
      triggerMember.parents = [
        ...triggerMember.parents,
        { id: createdMember.id, type: relationType },
      ];
      createdMember.children = [
        ...createdMember.children,
        { id: triggerMember.id, type: relationType },
      ];

      // handle siblings of triggerMember
      for (const siblingRel of triggerMember.siblings) {
        const siblingIndex = updatedNodes.findIndex(
          (m) => m.id === siblingRel.id
        );
        if (siblingIndex === -1) continue;
        const sibling = { ...updatedNodes[siblingIndex] };

        let parentChildType: RelType;

        if (siblingRel.type === RelType.blood) {
          parentChildType =
            relationType === RelType.blood ? RelType.blood : RelType.adopted;
        } else if (siblingRel.type === RelType.half) {
          if (relationType === RelType.blood) {
            parentChildType = RelType.adopted;
          } else {
            parentChildType = RelType.blood;
          }
        } else {
          parentChildType = RelType.adopted;
        }

        // Add the sibling as child to the createdMember if not present already
        if (!createdMember.children.some((c) => c.id === sibling.id)) {
          createdMember.children = [
            ...createdMember.children,
            { id: sibling.id, type: parentChildType },
          ];
        }

        // Add the parent to the sibling's parents if not present already
        if (!sibling.parents.some((p) => p.id === createdMember.id)) {
          sibling.parents = [
            ...sibling.parents,
            { id: createdMember.id, type: parentChildType },
          ];
        }

        updatedNodes[siblingIndex] = sibling;
      }
    } else if (relationMode === "sibling") {
      triggerMember.siblings = [
        ...triggerMember.siblings,
        { id: createdMember.id, type: relationType },
      ];
      createdMember.siblings = [
        ...createdMember.siblings,
        { id: triggerMember.id, type: relationType },
      ];

      // Replicate parents: for each parent of triggerMember, add the new sibling
      for (const parentRel of triggerMember.parents) {
        const parentIndex = updatedNodes.findIndex(
          (m) => m.id === parentRel.id
        );
        if (parentIndex !== -1) {
          const parentNode = { ...updatedNodes[parentIndex] };
          if (!parentNode.children.some((c) => c.id === createdMember.id)) {
            parentNode.children = [
              ...parentNode.children,
              { id: createdMember.id, type: parentRel.type },
            ];
          }

          if (!createdMember.parents.some((p) => p.id === parentRel.id)) {
            createdMember.parents = [
              ...createdMember.parents,
              { id: parentRel.id, type: parentRel.type },
            ];
          }
          updatedNodes[parentIndex] = parentNode;
        }
      }

      // Add new sibling to all other siblings
      for (const otherSiblingRel of triggerMember.siblings) {
        if (otherSiblingRel.id !== createdMember.id) {
          const otherSiblingIndex = updatedNodes.findIndex(
            (m) => m.id === otherSiblingRel.id
          );
          if (otherSiblingIndex !== -1) {
            const otherSibling = { ...updatedNodes[otherSiblingIndex] };

            if (!otherSibling.siblings.some((s) => s.id === createdMember.id)) {
              otherSibling.siblings = [
                ...otherSibling.siblings,
                { id: createdMember.id, type: relationType },
              ];
            }

            if (!createdMember.siblings.some((s) => s.id === otherSibling.id)) {
              createdMember.siblings = [
                ...createdMember.siblings,
                { id: otherSibling.id, type: relationType },
              ];
            }

            updatedNodes[otherSiblingIndex] = otherSibling;
          }
        }
      }
    } else if (relationMode === "spouse") {
      triggerMember.spouses = [
        ...triggerMember.spouses,
        { id: createdMember.id, type: relationType },
      ];
      createdMember.spouses = [
        ...createdMember.spouses,
        { id: triggerMember.id, type: relationType },
      ];

      // Handle selected children ONLY if childrenForSpouse was provided (Adding parent implicitly adds spouse too. children will be added based on sibling relationships instead)
      console.log("going in if");
      if (childrenForSpouse) {
        console.log("entered if");
        // Add selected children as blood
        for (const childId of childrenForSpouse) {
          const childIndex = updatedNodes.findIndex((m) => m.id === childId);
          if (childIndex !== -1) {
            const child = { ...updatedNodes[childIndex] };
            if (!child.parents.some((p) => p.id === createdMember.id)) {
              child.parents = [
                ...child.parents,
                { id: createdMember.id, type: RelType.blood },
              ];
            }
            if (!createdMember.children.some((c) => c.id === child.id)) {
              createdMember.children = [
                ...createdMember.children,
                { id: child.id, type: RelType.blood },
              ];
            }
            updatedNodes[childIndex] = child;
          }
        }

        // Add the rest as adopted
        const otherChildren = triggerMember.children
          .filter((c) => !childrenForSpouse.includes(c.id))
          .map((c) => c.id);

        for (const childId of otherChildren) {
          const childIndex = updatedNodes.findIndex((m) => m.id === childId);
          if (childIndex !== -1) {
            const child = { ...updatedNodes[childIndex] };
            if (!child.parents.some((p) => p.id === createdMember.id)) {
              child.parents = [
                ...child.parents,
                { id: createdMember.id, type: RelType.adopted },
              ];
            }
            if (!createdMember.children.some((c) => c.id === child.id)) {
              createdMember.children = [
                ...createdMember.children,
                { id: child.id, type: RelType.adopted },
              ];
            }
            updatedNodes[childIndex] = child;
          }
        }
      }
    } else if (relationMode === "child") {
      triggerMember.children = [
        ...triggerMember.children,
        { id: createdMember.id, type: relationType },
      ];
      createdMember.parents = [
        ...createdMember.parents,
        { id: triggerMember.id, type: relationType },
      ];
    }

    updatedNodes[triggerIndex] = triggerMember;
    updatedNodes[newIndex] = createdMember;
    console.log("Updated nodes:", updatedNodes);
    return updatedNodes;
  }

  function integrateExistingRelationship(
    prevNodes: Node[],
    memberAId: string,
    memberBId: string,
    relType: RelType,
    mode: "spouse"
  ): Node[] {
    console.log("integrateExistingRelationship called");
    const updatedNodes = [...prevNodes];
    const aIndex = updatedNodes.findIndex((n) => n.id === memberAId);
    const bIndex = updatedNodes.findIndex((n) => n.id === memberBId);
    console.log("gonna find indexes");
    console.log("aIndex:", aIndex);
    console.log("bIndex:", bIndex);
    if (aIndex === -1 || bIndex === -1) return updatedNodes;
    console.log("found indexes");
    const a = { ...updatedNodes[aIndex] };
    const b = { ...updatedNodes[bIndex] };

    if (mode === "spouse") {
      if (!a.spouses.some((s) => s.id === b.id)) {
        a.spouses = [...a.spouses, { id: b.id, type: relType }];
      }
      if (!b.spouses.some((s) => s.id === a.id)) {
        b.spouses = [...b.spouses, { id: a.id, type: relType }];
      }
    }
    console.log("a:", a);
    console.log("b", b);
    updatedNodes[aIndex] = a;
    updatedNodes[bIndex] = b;
    return updatedNodes;
  }

  function handleSaveSpouseRelationship(
    memberAId: string,
    memberBId: string,
    relType: RelType
  ) {
    console.log("entered handleSaveSpouseRelationship");
    setNodes((prevNodes) =>
      integrateExistingRelationship(
        prevNodes,
        memberAId,
        memberBId,
        relType,
        "spouse"
      )
    );
  }

  return (
    <div className={css.root}>
      {nodes.length > 0 && rootId && (
        <PinchZoomPan min={0.5} max={2.5} captureWheel className={css.wrapper}>
          <ReactFamilyTree
            key={`${rootId}-${nodes.length}`}
            nodes={nodes}
            rootId={rootId}
            width={NODE_WIDTH}
            height={NODE_HEIGHT}
            className={css.tree}
            renderNode={(node: Readonly<ExtNode>) => (
              <FamilyNode
                key={node.id}
                node={node}
                isRoot={node.id === rootId}
                isHover={node.id === hoverId}
                isSelected={node.id === selectId}
                onClick={(id) => {
                  setSelectId(id);
                  const found = nodes.find((n) => n.id === id);
                  setSelectedNode(found || null);
                  setIsSidebarOpen(true);
                }}
                onSubClick={setRootId}
                style={getNodeStyle(node)}
              />
            )}
          />
        </PinchZoomPan>
      )}
      {rootId && rootId !== firstNodeId && (
        <button className={css.reset} onClick={resetRootHandler}>
          Reset
        </button>
      )}
      {isSidebarOpen && selectedNode && (
        <Sidebar
          member={selectedNode}
          isOpen={isSidebarOpen}
          onClose={handleCloseSidebar}
          treeId={tree?.id ?? ""}
          allMembers={nodes}
          onSave={(
            updatedData: Node,
            relationMode?: "parent" | "sibling" | "spouse" | "child",
            relationType?: RelType,
            triggerMemberId?: string,
            childrenForSpouse?: string[]
          ) => {
            setNodes((prevNodes) =>
              integrateNewMember(
                prevNodes,
                updatedData,
                relationMode,
                relationType,
                triggerMemberId,
                childrenForSpouse
              )
            );
            handleCloseSidebar();
          }}
          onSaveSpouseRelationship={handleSaveSpouseRelationship}
        />
      )}
    </div>
  );
}

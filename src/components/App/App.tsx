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

  function integrateNewMember(
    prevNodes: Node[],
    newMember: Node,
    relationMode?: "parent" | "sibling" | "spouse" | "child",
    relationType?: RelType,
    triggerMemberId?: string
  ): Node[] {
    if (!relationMode || !relationType || !triggerMemberId) {
      // Just updating an existing member
      return prevNodes.map((node) =>
        node.id === newMember.id ? { ...node, ...newMember } : node
      );
    }

    // Adding a new member
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
      // Adding a parent
      triggerMember.parents = [
        ...triggerMember.parents,
        { id: createdMember.id, type: relationType },
      ];
      createdMember.children = [
        ...createdMember.children,
        { id: triggerMember.id, type: relationType },
      ];

      // Handle siblings of triggerMember
      for (const siblingRel of triggerMember.siblings) {
        const siblingIndex = updatedNodes.findIndex(
          (m) => m.id === siblingRel.id
        );
        if (siblingIndex === -1) continue;
        const sibling = { ...updatedNodes[siblingIndex] };

        let parentChildType: RelType;

        if (siblingRel.type === RelType.blood) {
          // sibling = blood
          // parent-member = blood => parent-sibling = blood
          // parent-member = adopted => parent-sibling = adopted
          parentChildType =
            relationType === RelType.blood ? RelType.blood : RelType.adopted;
        } else if (siblingRel.type === RelType.half) {
          // sibling = half
          // parent-member = blood => parent-sibling = adopted
          // parent-member = adopted => parent-sibling = blood
          if (relationType === RelType.blood) {
            parentChildType = RelType.adopted;
          } else {
            // relationType = adopted
            parentChildType = RelType.blood;
          }
        } else {
          // Other cases default to adopted
          parentChildType = RelType.adopted;
        }

        // Add the sibling as child to the createdMember if not present
        if (!createdMember.children.some((c) => c.id === sibling.id)) {
          createdMember.children = [
            ...createdMember.children,
            { id: sibling.id, type: parentChildType },
          ];
        }

        // Add the parent to the sibling's parents if not present
        if (!sibling.parents.some((p) => p.id === createdMember.id)) {
          sibling.parents = [
            ...sibling.parents,
            { id: createdMember.id, type: parentChildType },
          ];
        }

        // Update sibling in updatedNodes
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
          // Also add this parent's id to newMember's parents if not present
          if (!createdMember.parents.some((p) => p.id === parentRel.id)) {
            createdMember.parents = [
              ...createdMember.parents,
              { id: parentRel.id, type: parentRel.type },
            ];
          }
          updatedNodes[parentIndex] = parentNode;
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
      // ChildrenForSpouse logic would have been handled on the server.
      // If you want to mirror that logic locally, you'd need the childrenForSpouse array
      // passed down similarly to how the server handles it. Then replicate the spouse-children logic.
    } else if (relationMode === "child") {
      triggerMember.children = [
        ...triggerMember.children,
        { id: createdMember.id, type: relationType },
      ];
      createdMember.parents = [
        ...createdMember.parents,
        { id: triggerMember.id, type: relationType },
      ];
      // If spouseIdForChild was chosen, you would similarly find that spouse and add relations here.
    }

    // Update both the trigger and created member in updatedNodes
    updatedNodes[triggerIndex] = triggerMember;
    updatedNodes[newIndex] = createdMember;

    return updatedNodes;
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
          onClose={() => setIsSidebarOpen(false)}
          treeId={tree?.id ?? ""}
          allMembers={nodes}
          // Updated onSave to handle new members with relationships
          onSave={(
            updatedData: Node,
            relationMode?: "parent" | "sibling" | "spouse" | "child",
            relationType?: RelType,
            triggerMemberId?: string
          ) => {
            setNodes((prevNodes) =>
              integrateNewMember(
                prevNodes,
                updatedData,
                relationMode,
                relationType,
                triggerMemberId
              )
            );
            setIsSidebarOpen(false);
          }}
        />
      )}
    </div>
  );
}

import React, { useMemo, useState, useEffect, useCallback } from "react";
import axios from "axios";
import type { Node, ExtNode } from "../Types/types";
import ReactFamilyTree from "react-family-tree";
import { PinchZoomPan } from "../PinchZoomPan/PinchZoomPan";
import { FamilyNode } from "../FamilyNode/FamilyNode";
import { NODE_WIDTH, NODE_HEIGHT } from "../const";
import { getNodeStyle } from "./utils";
import Sidebar from "../Sidebar/Sidebar";
import css from "./App.module.css";
import { useLocation, useNavigate } from "react-router-dom";

export default React.memo(function App() {
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

  // handle redirection if 'tree' is null
  useEffect(() => {
    if (!tree) {
      console.error(
        "No tree data found in location.state. Redirecting to YourTrees."
      );
      navigate("/your-trees");
    }
  }, [tree, navigate]);

  // Fetch tree data when 'tree' is available
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

          // Set rootId after fetching nodes
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

  // Memoize firstNodeId
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

  // If 'tree' is null, render nothing
  if (!tree) {
    return null;
  }

  return (
    <div className={css.root}>
      {/* Tree */}
      {nodes.length > 0 && rootId && (
        <PinchZoomPan min={0.5} max={2.5} captureWheel className={css.wrapper}>
          <ReactFamilyTree
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
                  setSelectedNode(node as Node);
                  setIsSidebarOpen(true);
                }}
                onSubClick={setRootId}
                style={getNodeStyle(node)}
              />
            )}
          />
        </PinchZoomPan>
      )}
      {/* Reset button */}
      {rootId && rootId !== firstNodeId && (
        <button className={css.reset} onClick={resetRootHandler}>
          Reset
        </button>
      )}
      {/* Sidebar */}
      {isSidebarOpen && selectedNode && (
        <Sidebar
          member={selectedNode}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onSave={(updatedData) => {
            // Update the node details in the local state
            setNodes((prevNodes) =>
              prevNodes.map((node) =>
                node.id === updatedData.id ? { ...node, ...updatedData } : node
              )
            );
            setIsSidebarOpen(false);
          }}
          treeId={tree.id}
          allMembers={nodes}
        />
      )}
    </div>
  );
});

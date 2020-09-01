import React, { useState, useCallback, useRef, useEffect } from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

import Node, { NodeProps } from "./Node";
import Edge, { EdgeProps } from "./Edge";
import GhostEdge, { GhostEdgeProps } from "./GhostEdge";

const StyledDiv = styled.div`
  flex: 9;
  background: #16213e;
  position: relative;
`;

const Canvas: React.FC = () => {
  const [nodes, setNodes] = useState<Array<NodeProps>>([]);
  const [edges, setEdges] = useState<Array<EdgeProps>>([]);
  const [ghostEdge, setGhostEdge] = useState<GhostEdgeProps | null>(null);
  const mouseDownNode = useRef<NodeProps | null>(null);

  const addNode = (event: React.MouseEvent<HTMLDivElement>): void => {
    if (mouseDownNode.current !== null) {
      setMouseDownNode(null);
      return;
    }
    let target = event.target as HTMLElement;
    let bounds = target.getBoundingClientRect();
    let x = event.clientX - bounds.left;
    let y = event.clientY - bounds.top;

    const id: string = uuidv4();
    const node: NodeProps = { id: id, x: x, y: y };
    setNodes((prevNodes) => [...prevNodes, node]);
  };

  const deleteNode = useCallback(
    (nodeID: string): void => {
      setNodes((prevNodes) => {
        return prevNodes.filter((prevNode) => {
          return prevNode.id !== nodeID;
        });
      });
    },
    [setNodes]
  );

  const setMouseDownNode = useCallback(
    (nodeID: string | null): void => {
      if (nodeID === null) {
        mouseDownNode.current = null;
        setGhostEdge((prev) => null);
        return;
      }

      const node = nodes.find((n) => nodeID === n.id);
      if (node !== undefined) mouseDownNode.current = node;
    },
    [nodes, mouseDownNode]
  );

  const updateGhostEdge = useCallback(
    (event: React.MouseEvent<HTMLDivElement>): void => {
      if (mouseDownNode.current === null) return;

      let target = event.currentTarget as HTMLElement;
      let bounds = target.getBoundingClientRect();
      const tail = {
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      };
      const newGhostEdge = {
        headNode: mouseDownNode.current,
        tailPosition: tail,
      };
      setGhostEdge((prev) => newGhostEdge);
    },
    [mouseDownNode, setGhostEdge]
  );

  const addEdge = useCallback(
    (nodeID: string): void => {
      if (
        mouseDownNode.current === null ||
        mouseDownNode.current.id === nodeID
      ) {
        mouseDownNode.current = null;
        return;
      }

      const head = mouseDownNode.current;
      const tail = nodes.find((n) => n.id === nodeID);
      if (tail === undefined) return;
      const edge = { id: uuidv4(), headNode: head, tailNode: tail };
      setEdges((prevEdges) => [...prevEdges, edge]);
    },
    [mouseDownNode, nodes, setEdges]
  );

  return (
    <StyledDiv
      onClick={(e) => {
        addNode(e);
      }}
      onMouseMove={(e) => updateGhostEdge(e)}
    >
      {nodes.map((node) => {
        return (
          <Node
            key={node.id}
            id={node.id}
            x={node.x}
            y={node.y}
            handleClick={deleteNode}
            handleMouseDown={setMouseDownNode}
            handleMouseUp={addEdge}
          />
        );
      })}
      {edges.map((edge) => {
        return (
          <Edge
            id={edge.id}
            headNode={edge.headNode}
            tailNode={edge.tailNode}
          />
        );
      })}
      {ghostEdge !== null && (
        <GhostEdge
          headNode={ghostEdge.headNode}
          tailPosition={ghostEdge.tailPosition}
        />
      )}
    </StyledDiv>
  );
};

export default Canvas;

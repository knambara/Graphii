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
    const node: NodeProps = {
      id: id,
      x: x,
      y: y,
      outEdgeIDs: [],
      inEdgeIDs: [],
    };
    setNodes((prevNodes) => [...prevNodes, node]);
  };

  const deleteNode = useCallback(
    (nodeID: string): void => {
      const node = nodes.find((n) => n.id === nodeID);
      if (node === undefined) return;

      setNodes((prevNodes) => {
        return prevNodes.filter((prevNode) => {
          return prevNode.id !== nodeID;
        });
      });
      deleteIncidentEdges(node);
    },
    [nodes, setNodes]
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
      for (let e of edges) {
        if (e.headNode === head && e.tailNode === tail) return;
      }

      const edge = { id: uuidv4(), headNode: head, tailNode: tail };
      setEdges((prevEdges) => [...prevEdges, edge]);
      setNodes((prevNodes) => {
        return prevNodes.map((node) => {
          if (node === head) {
            node.outEdgeIDs!.push(edge.id);
          } else if (node === tail) {
            node.inEdgeIDs!.push(edge.id);
          }
          return node;
        });
      });
    },
    [mouseDownNode, nodes, edges, setEdges]
  );

  const deleteEdge = useCallback(
    (edgeID: string): void => {
      setEdges((prevEdges) => {
        return prevEdges.filter((e) => e.id !== edgeID);
      });
    },
    [setEdges]
  );

  const deleteIncidentEdges = useCallback(
    (node: NodeProps): void => {
      const incidentEdgeIDs = [...node.inEdgeIDs!, ...node.outEdgeIDs!];
      setEdges((prevEdges) => {
        return prevEdges.filter(
          (prevEdge) => !incidentEdgeIDs.includes(prevEdge.id)
        );
      });
    },
    [setEdges]
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
            key={edge.id}
            id={edge.id}
            headNode={edge.headNode}
            tailNode={edge.tailNode}
            handleClick={deleteEdge}
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

import React, { useState, useCallback, useRef } from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

import Node, { NodeProps } from "./Node";
import Edge, { EdgeProps } from "./Edge";
import GhostEdge, { GhostEdgeProps } from "./GhostEdge";

import { useTransformation } from "Hooks/useTransformation";

// TODO: Fix
const MENUBAR_OFFSET = 88.81;

const StyledDiv = styled.div`
  flex: 9;
  background: #16213e;
  position: relative;
  z-index: 1;
  height: 100%;
  width: 100%;
`;

// Configuration for scaling
const scaleProps = {
  minScale: 1,
  maxScale: 20,
  scaleSensitivity: 10,
};

const Canvas: React.FC = () => {
  const [nodes, setNodes] = useState<Array<NodeProps>>([]);
  const [edges, setEdges] = useState<Array<EdgeProps>>([]);
  const [ghostEdge, setGhostEdge] = useState<GhostEdgeProps | null>(null);

  const { transformState, pan, zoom } = useTransformation(scaleProps);
  const mouseDownNode = useRef<NodeProps | null>(null);

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

  const addNode = useCallback(
    (event: React.MouseEvent<HTMLDivElement>): void => {
      // Prevents new node to be created on mouseUp
      console.log(event.pageY);
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
    },
    [mouseDownNode.current, setMouseDownNode, nodes, setNodes]
  );

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

  const updateGhostEdge = useCallback(
    (event: React.MouseEvent<HTMLDivElement>): void => {
      if (mouseDownNode.current === null) return;

      let target = event.currentTarget as HTMLElement;
      let bounds = target.getBoundingClientRect();
      const tail = {
        x: event.clientX - bounds.left, //- state.translateX,
        y: event.clientY - bounds.top, //- state.translateY,
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
        setGhostEdge((prev) => null);
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

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.shiftKey) {
        pan({ movementX: event.movementX, movementY: event.movementY });
        return;
      } else {
        updateGhostEdge(event);
      }
    },
    [updateGhostEdge]
  );

  const handleWheel = useCallback((event: React.WheelEvent<HTMLDivElement>) => {
    let delta = event.deltaY > 0 ? -1 : 1;
    zoom({
      pageX: event.pageX,
      pageY: event.pageY - MENUBAR_OFFSET,
      delta: delta,
    });
  }, []);

  return (
    <StyledDiv
      onClick={addNode}
      onMouseMove={handleMouseMove}
      onWheel={handleWheel}
      style={{
        transformOrigin: `top left`,
        transform: `scale(${transformState.scale}, ${transformState.scale}) translate(${transformState.offsetX}px, ${transformState.offsetY}px)`,
      }}
    >
      {nodes.map((node) => {
        return (
          <Node
            key={node.id}
            id={node.id}
            className={"node"}
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
            className={"edge"}
            headNode={edge.headNode}
            tailNode={edge.tailNode}
            handleClick={deleteEdge}
          />
        );
      })}
      {ghostEdge !== null && (
        <GhostEdge
          className={"ghostedge"}
          headNode={ghostEdge.headNode}
          tailPosition={ghostEdge.tailPosition}
        />
      )}
    </StyledDiv>
  );
};

export default Canvas;

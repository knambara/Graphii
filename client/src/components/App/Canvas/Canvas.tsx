import React, { useState, useCallback, useRef } from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

import Node, { NodeProps } from "./Node";
import Edge, { EdgeProps } from "./Edge";
import GhostEdge, { GhostEdgeProps } from "./GhostEdge";

import { useTransformation } from "Hooks/useTransformation";
import { screenToWorld } from "helper";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullseye, faChevronRight } from "@fortawesome/free-solid-svg-icons";

// TODO: Fix
const MENUBAR_OFFSET = 97;

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
  const isMovingNode = useRef<boolean>(false);

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
    (coor: { screenX: number; screenY: number }): void => {
      let [x, y] = screenToWorld({
        offsetX: transformState.offsetX,
        offsetY: transformState.offsetY,
        iScreenX: coor.screenX,
        iScreenY: coor.screenY,
        scale: transformState.scale,
      });

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
    [mouseDownNode.current, setMouseDownNode, nodes, setNodes, transformState]
  );

  const deleteNode = (nodeID: string) => {
    const node = nodes.find((n) => n.id === nodeID);
    if (node === undefined) return;

    setNodes((prevNodes) => {
      return prevNodes.filter((prevNode) => {
        return prevNode.id !== nodeID;
      });
    });
    deleteIncidentEdges(node);
  };

  const updateIncidentEdges = (
    head: NodeProps,
    tail: NodeProps,
    edge: EdgeProps
  ) => {
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
  };

  const updateNodeCoordinate = (node: NodeProps, x: number, y: number) => {
    setNodes((prevNodes) => {
      return prevNodes.map((node) => {
        if (node === mouseDownNode.current) {
          node.x = x;
          node.y = y;
        }
        return node;
      });
    });
  };

  const updateGhostEdge = useCallback(
    (event: React.MouseEvent<HTMLDivElement>): void => {
      if (mouseDownNode.current === null) return;

      let [x, y] = screenToWorld({
        offsetX: transformState.offsetX,
        offsetY: transformState.offsetY,
        iScreenX: event.clientX,
        iScreenY: event.clientY - MENUBAR_OFFSET,
        scale: transformState.scale,
      });
      const tail = {
        x: x,
        y: y,
      };
      const newGhostEdge = {
        headNode: mouseDownNode.current,
        tailPosition: tail,
      };
      setGhostEdge((prev) => newGhostEdge);
    },
    [mouseDownNode, setGhostEdge, transformState]
  );

  const addEdge = (headNode: NodeProps, tailNode: NodeProps) => {
    if (edges.find((e) => e.headNode === headNode && e.tailNode === tailNode))
      return;

    const newEdge = { id: uuidv4(), headNode: headNode, tailNode: tailNode };
    updateIncidentEdges(headNode, tailNode, newEdge);
    setEdges((prevEdges) => [...prevEdges, newEdge]);
  };

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

  /****** Event Handlers ******/

  const handleMouseUpOnNode = (nodeID: string) => {
    if (mouseDownNode.current === null) return;
    if (isMovingNode.current === true) {
      isMovingNode.current = false;
      return;
    }
    if (mouseDownNode.current.id === nodeID) {
      mouseDownNode.current = null;
      deleteNode(nodeID);
      setGhostEdge((prev) => null);
      return;
    }

    // Else, addEdge if possible
    const head = mouseDownNode.current;
    const tail = nodes.find((n) => n.id === nodeID);
    if (tail !== undefined) addEdge(head, tail);
  };

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (mouseDownNode.current !== null) {
        setMouseDownNode(null);
        return;
      }
      if (mouseDownNode.current === null) {
        addNode({
          screenX: event.clientX,
          screenY: event.clientY - MENUBAR_OFFSET,
        });
      }
    },
    [mouseDownNode.current, addNode, setMouseDownNode]
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.shiftKey && mouseDownNode.current !== null) {
        isMovingNode.current = true;
        let [currX, currY] = screenToWorld({
          offsetX: transformState.offsetX,
          offsetY: transformState.offsetY,
          iScreenX: event.clientX,
          iScreenY: event.clientY - MENUBAR_OFFSET,
          scale: transformState.scale,
        });
        updateNodeCoordinate(mouseDownNode.current, currX, currY);
      } else if (event.shiftKey) {
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
      onClick={handleClick}
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
            handleMouseDown={setMouseDownNode}
            handleMouseUp={handleMouseUpOnNode}
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

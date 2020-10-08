import React, { useState, useCallback, useRef, useEffect } from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

import GraphNode from "./GraphNode";
import GraphEdge from "./GraphEdge";
import GhostEdge, { GhostEdgeProps } from "./GhostEdge";

import { useTransformation } from "Hooks/useTransformation";
import { useAlgorithms } from "Hooks/useAlgorithms";
import { useAlgoState, useAlgoDispatch } from "Contexts/AlgorithmContext";
import { screenToWorld } from "helper";

import { VertexInterface } from "Interfaces/VertexInterface";
import { EdgeInterface } from "Interfaces/EdgeInterface";

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

export interface Node extends VertexInterface {
  id: string;
  x: number;
  y: number;
  outEdgeIDs: string[];
  inEdgeIDs: string[];
}

export interface Edge extends EdgeInterface {
  id: string;
  headNode: Node;
  tailNode: Node;
  animate: boolean;
  special: boolean;
}

const Canvas: React.FC = () => {
  const [nodes, setNodes] = useState<Array<Node>>([]);
  const [edges, setEdges] = useState<Array<Edge>>([]);
  const [ghostEdge, setGhostEdge] = useState<GhostEdgeProps | null>(null);

  const mouseDownNode = useRef<Node | null>(null);
  const isMovingNode = useRef<boolean>(false);
  const dKeyPressed = useRef<boolean>(false); //TODO: only works when canvas is clicked

  const algoState = useAlgoState();
  const algoDispatch = useAlgoDispatch();
  const { transformState, pan, zoom } = useTransformation(scaleProps);
  const {
    source,
    target,
    setSourceNode,
    setTargetNode,
    runAlgorithm,
  } = useAlgorithms();

  const timer = useRef<number | null>(null);
  const index = useRef<number>(0);
  const [interval, setInterval] = useState<number>(1000);

  function animateEdge(edge: EdgeInterface): void {
    setEdges((prevEdges) => {
      return prevEdges.map((prevEdge) => {
        if (prevEdge === edge) {
          prevEdge.animate = true;
        }
        return prevEdge;
      });
    });
    return;
  }

  function addSpecialEffect(edge: EdgeInterface): void {
    setEdges((prevEdges) => {
      return prevEdges.map((prevEdge) => {
        if (prevEdge === edge) {
          prevEdge.animate = false;
          prevEdge.special = true;
        }
        return prevEdge;
      });
    });
    return;
  }

  function resetEdges(): void {
    setEdges((prevEdges) => {
      return prevEdges.map((prevEdge) => {
        prevEdge.animate = false;
        prevEdge.special = false;
        return prevEdge;
      });
    });
  }

  function visualize(
    array: EdgeInterface[],
    targetPath: EdgeInterface[]
  ): void {
    console.log("t");
    timer.current = setTimeout(() => {
      let edge = array[index.current];
      animateEdge(edge);
      index.current = index.current + 1;

      if (index.current < array.length) {
        console.log(index.current);
        visualize(array, targetPath);
      } else {
        console.log("complete");
        algoDispatch({ type: "complete" });
        clearTimeout(timer.current!);
        targetPath.forEach((edge) => {
          addSpecialEffect(edge);
        });
        index.current = 0;
      }
    }, interval);
  }

  function updateInterval(newInterval: number) {
    setInterval(newInterval);
  }

  useEffect(() => {
    switch (algoState.status) {
      case "running":
        const [traversed, shortestPath] = runAlgorithm(
          algoState.name!,
          nodes,
          edges
        );
        if (shortestPath === null) {
          return;
        }
        resetEdges();
        console.log("visualize");
        visualize(traversed!, shortestPath);
        return;
      case "paused":
        clearTimeout(timer.current!);
        return;
      case null:
        resetEdges();
        return;
    }
  }, [algoState.status]);

  const setMouseDownNode = (nodeID: string | null): void => {
    if (nodeID === null) {
      mouseDownNode.current = null;
      setGhostEdge((prev) => null);
      return;
    }

    const node = nodes.find((n) => nodeID === n.id);
    if (node !== undefined) mouseDownNode.current = node;
  };

  const addNode = (coor: { screenX: number; screenY: number }): void => {
    let [x, y] = screenToWorld({
      offsetX: transformState.offsetX,
      offsetY: transformState.offsetY,
      iScreenX: coor.screenX,
      iScreenY: coor.screenY,
      scale: transformState.scale,
    });

    const id: string = uuidv4();
    const node = {
      id: id,
      x: x,
      y: y,
      outEdgeIDs: [],
      inEdgeIDs: [],
      dist: Infinity,
      prev: null,
    };
    setNodes((prevNodes) => [...prevNodes, node]);
  };

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

  const updateIncidentEdges = (head: Node, tail: Node, edge: Edge) => {
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

  const updateNodeCoordinate = (node: Node, x: number, y: number) => {
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

  const updateGhostEdge = (event: React.MouseEvent<HTMLDivElement>): void => {
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
  };

  const addEdge = (headNode: Node, tailNode: Node) => {
    if (edges.find((e) => e.headNode === headNode && e.tailNode === tailNode))
      return;

    const newEdge: Edge = {
      id: uuidv4(),
      headNode: headNode,
      tailNode: tailNode,
      weight: 0,
      animate: false,
      special: false,
    };
    updateIncidentEdges(headNode, tailNode, newEdge);
    setEdges((prevEdges) => [...prevEdges, newEdge]);
  };

  const deleteEdge = (edgeID: string): void => {
    setEdges((prevEdges) => {
      return prevEdges.filter((e) => e.id !== edgeID);
    });
  };

  const deleteIncidentEdges = (node: Node): void => {
    const incidentEdgeIDs = [...node.inEdgeIDs!, ...node.outEdgeIDs!];
    setEdges((prevEdges) => {
      return prevEdges.filter(
        (prevEdge) => !incidentEdgeIDs.includes(prevEdge.id)
      );
    });
  };

  /****** Event Handlers ******/

  const handleMouseUpOnNode = (nodeID: string) => {
    if (mouseDownNode.current === null) return;
    if (isMovingNode.current === true) {
      isMovingNode.current = false;
      mouseDownNode.current = null;
      return;
    }

    if (mouseDownNode.current.id === nodeID) {
      // Handle delete node
      if (dKeyPressed.current) {
        deleteNode(nodeID);
        setGhostEdge((prev) => null);
        mouseDownNode.current = null;
        return;
      }

      // Handle setting source and target
      if (algoState.status === "setSource") {
        setSourceNode(mouseDownNode.current);
        algoDispatch({
          type: "setStatus",
          newStatus: "setTarget",
          ready: false,
        });
        mouseDownNode.current = null;
        return;
      } else if (algoState.status === "setTarget") {
        if (mouseDownNode.current === source) {
          // Reset Source
          setSourceNode(mouseDownNode.current);
          algoDispatch({
            type: "setStatus",
            newStatus: "setSource",
            ready: false,
          });
          mouseDownNode.current = null;
          return;
        }
        setTargetNode(mouseDownNode.current);
        algoDispatch({ type: "setStatus", newStatus: "ready", ready: true });
        mouseDownNode.current = null;
        return;
      }
      mouseDownNode.current = null;
      return;
    } else {
      // Handle add edge
      const head = mouseDownNode.current;
      const tail = nodes.find((n) => n.id === nodeID);
      if (tail !== undefined) addEdge(head!, tail);
      mouseDownNode.current = null;
      setGhostEdge((prev) => null);
    }
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
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
  };

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
        return;
      }

      if (event.shiftKey) {
        pan({ movementX: event.movementX, movementY: event.movementY });
        return;
      }

      if (mouseDownNode.current !== null) {
        updateGhostEdge(event);
        return;
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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "d") {
      dKeyPressed.current = true;
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "d") {
      dKeyPressed.current = false;
    }
  };

  return (
    <StyledDiv
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onWheel={handleWheel}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      tabIndex={0}
      style={{
        transformOrigin: `top left`,
        transform: `scale(${transformState.scale}, ${transformState.scale}) translate(${transformState.offsetX}px, ${transformState.offsetY}px)`,
      }}
    >
      {nodes.map((node) => {
        return (
          <GraphNode
            key={node.id}
            id={node.id}
            className={"node"}
            x={node.x}
            y={node.y}
            handleMouseDown={setMouseDownNode}
            handleMouseUp={handleMouseUpOnNode}
            isSource={source === node}
            isTarget={target === node}
          />
        );
      })}
      {edges.map((edge) => {
        return (
          <GraphEdge
            key={edge.id}
            id={edge.id}
            className={"edge"}
            headNode={edge.headNode}
            tailNode={edge.tailNode}
            handleClick={deleteEdge}
            animate={edge.animate}
            special={edge.special}
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

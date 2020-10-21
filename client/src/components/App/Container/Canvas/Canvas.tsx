import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

import GraphNode from "./GraphNode";
import GraphEdge from "./GraphEdge";
import GhostEdge, { GhostEdgeProps } from "./GhostEdge";

import { useTransformation } from "Hooks/useTransformation";
import { useAlgorithms } from "Hooks/useAlgorithms";
import { useAlgoState, useAlgoDispatch } from "Contexts/AlgorithmContext";
import { useKeyState } from "Contexts/KeyContext";
import { screenToWorld, getDistance } from "helper";

import { VertexInterface } from "Interfaces/VertexInterface";
import { EdgeInterface } from "Interfaces/EdgeInterface";

import { Tuple, PathOutput, MaxFlowOutput } from "algorithms";

interface CanvasProps {
  clearGraphs: boolean;
  offClear: () => void;
  speed: number;
}

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
  animation: string | null;
  optionalValue: number;
}

const Canvas: React.FC<CanvasProps> = ({ clearGraphs, offClear, speed }) => {
  const [nodes, setNodes] = useState<Array<Node>>([]);
  const [edges, setEdges] = useState<Array<Edge>>([]);
  const [ghostEdge, setGhostEdge] = useState<GhostEdgeProps | null>(null);

  const mouseIsHeld = useRef<boolean>(false);
  const mouseMoved = useRef<boolean>(false);

  const mouseDownNode = useRef<Node | null>(null);
  const isMovingNode = useRef<boolean>(false);
  const dKeyPressed = useRef<boolean>(false); //TODO: only works when canvas is clicked

  const keyState = useKeyState();
  const [showLabel, setShowLabel] = useState<boolean>(false);

  useEffect(() => {
    if (keyState.key === "w" && keyState.isPressed) {
      setShowLabel((show) => !show);
    }
  }, [keyState, setShowLabel]);

  const algoState = useAlgoState();
  const algoDispatch = useAlgoDispatch();
  const { transformState, pan, zoom } = useTransformation(scaleProps);
  const {
    source,
    target,
    setSourceNode,
    setTargetNode,
    runPathAlgorithm,
    runTreeAlgorithm,
    runFlowAlgorithm,
    checkConnectedComponents,
  } = useAlgorithms();

  useEffect(() => {
    for (let i = 0; i < 20; i++) {
      zoom({
        pageX: window.innerWidth / 2,
        pageY: (window.innerHeight - MENUBAR_OFFSET) / 2,
        delta: 1,
      });
    }
    return;
  }, []);

  const timer = useRef<number | null>(null);
  const index = useRef<number>(0);
  const interval = useRef<number>(1000);
  const algoOutput = useRef<
    EdgeInterface[] | Tuple<EdgeInterface, number>[] | null
  >(null);
  const algoPath = useRef<EdgeInterface[] | null>(null);
  const maxFlowOutput = useRef<number>(0);
  const prevFlow = useRef<number>(0);

  function setEdgeAnimation(
    animation: string | null,
    edge: EdgeInterface,
    optional: number = 0
  ) {
    setEdges((E) =>
      E.map((e) => {
        if (e === edge) {
          e.animation = animation;
          if (algoState.category === "flow") e.optionalValue = optional;
        }
        return e;
      })
    );
  }

  function resetAllEdgeAnimation() {
    setEdges((E) =>
      E.map((e) => {
        e.animation = null;
        e.optionalValue = 0;
        return e;
      })
    );
  }

  useEffect(() => {
    interval.current = 1000 / speed;
    // async function test() {
    //   await algoDispatch({ type: "pause" });
    //   algoDispatch({ type: "continue" });
    // }
    if (algoState.status === "running") {
      algoDispatch({ type: "pause" });
      algoDispatch({ type: "continue" });
    }
  }, [speed]);

  function visualizePath(
    array: EdgeInterface[],
    targetPath: EdgeInterface[]
  ): void {
    timer.current = setTimeout(() => {
      if (index.current < array.length) {
        let edge = array[index.current];
        setEdgeAnimation("regular", edge);
        index.current = index.current + 1;
        visualizePath(array, targetPath);
      } else {
        let length = 0;
        targetPath.forEach((edge) => {
          setEdgeAnimation("special", edge);
          length += edge.weight;
        });
        algoDispatch({ type: "complete", newValue: `Length: ${length}` });
        clearTimeout(timer.current!);
        index.current = 0;
      }
    }, interval.current);
  }

  function visualizeMST(array: EdgeInterface[], targetPath: EdgeInterface[]) {
    timer.current = setTimeout(() => {
      if (index.current < array.length) {
        let edge = array[index.current];
        if (targetPath.includes(edge)) {
          setEdgeAnimation("special", edge);
        } else {
          setEdgeAnimation("regular", edge);
        }
        index.current = index.current + 1;
        visualizeMST(array, targetPath);
      } else {
        let weight = 0;
        targetPath.forEach((edge) => (weight += edge.weight));
        algoDispatch({ type: "complete", newValue: `Weight: ${weight}` });
        clearTimeout(timer.current!);
        index.current = 0;
      }
    }, interval.current);
  }

  function visualizeMaxFlow(
    traversed: Tuple<EdgeInterface, number>[],
    maxFlow: number
  ) {
    timer.current = setTimeout(() => {
      if (index.current < traversed.length) {
        let [edge, flow] = traversed[index.current];
        const curr = edges.find((e) => e === edge)!;
        prevFlow.current = curr.optionalValue;

        setEdgeAnimation("regular", edge, flow);
        index.current = index.current + 1;
        visualizeMaxFlow(traversed, maxFlow);
      } else {
        algoDispatch({ type: "complete", newValue: `Max-Flow: ${maxFlow}` });
        clearTimeout(timer.current!);
        index.current = 0;
      }
    }, interval.current);
  }

  function stepAlgorithmForward() {
    if (index.current < algoOutput.current!.length) {
      // Simply step forward if algorithm has not completed
      //let edge: EdgeInterface | Tuple<EdgeInterface, number> | null;
      if (algoState.category === "path") {
        let edge = algoOutput.current![index.current] as EdgeInterface;
        setEdgeAnimation("regular", edge);
      }
      if (algoState.category === "tree") {
        let edge = algoOutput.current![index.current] as EdgeInterface;
        if (algoPath.current!.includes(edge)) {
          setEdgeAnimation("special", edge);
        } else {
          setEdgeAnimation("regular", edge);
        }
      }
      if (algoState.category === "flow") {
        let output = algoOutput.current![index.current];
        let [edge, flow] = output as Tuple<EdgeInterface, number>;
        const curr = edges.find((e) => e === edge)!;
        prevFlow.current = curr.optionalValue;
        setEdgeAnimation("regular", edge, flow);
      }
      index.current = index.current + 1;
      algoDispatch({ type: "pause" });
    } else {
      // Otherwise, dispatch complete
      if (algoState.category === "path") {
        let length = 0;
        algoPath.current!.forEach((edge) => {
          length += edge.weight;
          setEdgeAnimation("special", edge);
        });

        algoDispatch({ type: "complete", newValue: `Distance: ${length}` });
      }
      if (algoState.category === "tree") {
        let weight = 0;
        algoPath.current!.forEach((edge) => (weight += edge.weight));
        algoDispatch({ type: "complete", newValue: `Weight: ${weight}` });
      }
      if (algoState.category === "flow") {
        algoDispatch({
          type: "complete",
          newValue: `Max-Flow: ${maxFlowOutput.current}`,
        });
      }
      clearTimeout(timer.current!);
      index.current = 0;
    }
  }

  function stepAlgorithmBackward() {
    if (index.current === 0) {
      algoDispatch({
        type: "setStatus",
        newStatus: "ready",
        ready: true,
      });
      return;
    }

    if (algoState.status !== "completed") {
      // Simply step back if algorithm has not completed
      if (algoOutput.current !== null) {
        if (algoState.category === "path" || algoState.category === "tree") {
          let edge = algoOutput.current[index.current - 1] as EdgeInterface;
          setEdgeAnimation(null, edge);
        }
        if (algoState.category === "flow") {
          let output = algoOutput.current[index.current - 1];
          let [edge, flow] = output as Tuple<EdgeInterface, number>;

          let oldFlow = 0;
          for (let i = 0; i < index.current - 1; i++) {
            let [tempEdge, tempFlow] = algoOutput.current[i] as Tuple<
              EdgeInterface,
              number
            >;
            if (tempEdge === edge) oldFlow = tempFlow;
          }
          prevFlow.current = oldFlow;
          setEdgeAnimation(null, edge, prevFlow.current); //first instance before current one
        }
        algoDispatch({ type: "pause" });
      }
    }

    if (index.current === 0) {
      algoDispatch({
        type: "setStatus",
        newStatus: "ready",
        ready: true,
      });
    } else {
      index.current = index.current - 1;
    }
    //else {
    //   // Otherwise get rid of the special animation for completed edges
    //   if (algoState.category === "path" || algoState.category === "tree") {
    //     algoPath.current!.forEach((edge) => setEdgeAnimation("regular", edge));
    //     index.current = algoOutput.current!.length;
    //   }
    //   if (algoState.category === "flow") {
    //     //bc no special effect for flow
    //     let output = algoOutput.current![index.current];
    //     let [edge, saturation] = output as Tuple<EdgeInterface, number>;
    //     setEdgeAnimation(null, edge, saturation);
    //     index.current = index.current - 1;
    //   }
    //   algoDispatch({ type: "pause" });
    // }
  }

  useEffect(() => {
    switch (algoState.status) {
      case "setSource":
        setSourceNode(null);
        setTargetNode(null);
        resetAllEdgeAnimation();
        return;
      case "running":
        if (index.current === 0) resetAllEdgeAnimation();
        if (
          target !== null &&
          !checkConnectedComponents(nodes, edges, source!, target!)
        ) {
          algoDispatch({
            type: "error",
            newStatus: "Error: Nodes must be connected.",
          });
          return;
        }

        if (algoState.category === "path") {
          const [traversed, shortestPath] = runPathAlgorithm(
            algoState.name!,
            nodes,
            edges
          );
          if (!traversed.length || !shortestPath.length) {
            algoDispatch({ type: "error", newStatus: "Error: No path found" });
            return;
          }
          algoOutput.current = traversed;
          algoPath.current = shortestPath;
          visualizePath(algoOutput.current!, algoPath.current);
        } else if (algoState.category === "tree") {
          const [traversed, shortestPath] = runTreeAlgorithm(
            algoState.name!,
            nodes,
            edges
          );
          if (!traversed.length || !shortestPath.length) {
            algoDispatch({ type: "error", newStatus: "Error: No path found" });
            return;
          }
          algoOutput.current = traversed;
          algoPath.current = shortestPath;
          visualizeMST(algoOutput.current!, algoPath.current);
        } else if (algoState.category === "flow") {
          const [traversed, maxFlow] = runFlowAlgorithm(
            algoState.name!,
            nodes,
            edges
          );
          if (!traversed.length) {
            algoDispatch({ type: "error", newStatus: "Error: No path found" });
            return;
          }
          algoOutput.current = traversed;
          maxFlowOutput.current = maxFlow;
          console.log(maxFlow);
          visualizeMaxFlow(algoOutput.current!, maxFlow);
        }
        return;

      case "paused":
        clearTimeout(timer.current!);
        return;
      case "ready":
        clearTimeout(timer.current!);
        return;
      case "stepF":
        stepAlgorithmForward();
        return;
      case "stepB":
        stepAlgorithmBackward();
        return;
      case null:
        clearTimeout(timer.current!);
        resetAllEdgeAnimation();
        return;
    }
  }, [algoState.status]);

  useEffect(() => {
    if (clearGraphs) {
      nodes.forEach((node) => deleteNode(node.id));
      offClear();
    }
  }, [clearGraphs]);

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
    if (algoState.ready) return;

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
          node.x = Math.round(x);
          node.y = Math.round(y);
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
    const edgeLength = Math.round(
      getDistance(headNode.x, headNode.y, tailNode.x, tailNode.y)
    );

    const newEdge: Edge = {
      id: uuidv4(),
      headNode: headNode,
      tailNode: tailNode,
      weight: edgeLength,
      animation: null,
      optionalValue: 0,
    };
    updateIncidentEdges(headNode, tailNode, newEdge);
    setEdges((prevEdges) => [...prevEdges, newEdge]);
  };

  const deleteEdge = (edgeID: string): void => {
    if (algoState.ready) return;
    if (dKeyPressed.current) {
      setEdges((prevEdges) => {
        return prevEdges.filter((e) => e.id !== edgeID);
      });
    }
  };

  const deleteIncidentEdges = (node: Node): void => {
    const incidentEdgeIDs = [...node.inEdgeIDs!, ...node.outEdgeIDs!];
    setEdges((prevEdges) => {
      return prevEdges.filter(
        (prevEdge) => !incidentEdgeIDs.includes(prevEdge.id)
      );
    });
  };

  const updateEdgeWeight = (edgeID: string, newWeight: number) => {
    setEdges((prevEdges) => {
      return prevEdges.map((edge) => {
        if (edgeID === edge.id) {
          edge.weight = newWeight;
        }
        return edge;
      });
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
        const currStatus =
          algoState.category === "tree" ? "ready" : "setTarget";
        const isReady = algoState.category === "tree" ? true : false;
        algoDispatch({
          type: "setStatus",
          newStatus: currStatus,
          ready: isReady,
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
      mouseIsHeld.current = false;
      return;
    }
    if (mouseIsHeld.current && mouseMoved.current) {
      mouseIsHeld.current = false;
      mouseMoved.current = false;
      return;
    }
    if (mouseDownNode.current === null) {
      addNode({
        screenX: event.clientX,
        screenY: event.clientY - MENUBAR_OFFSET,
      });
      mouseIsHeld.current = false;
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (
      event.shiftKey &&
      mouseDownNode.current !== null &&
      ghostEdge === null
    ) {
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

    if (mouseIsHeld.current) {
      mouseMoved.current = true;
      pan({ movementX: event.movementX, movementY: event.movementY });
      return;
    }

    if (mouseDownNode.current !== null) {
      updateGhostEdge(event);
      return;
    }
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    let delta = event.deltaY > 0 ? -1 : 1;
    zoom({
      pageX: event.pageX,
      pageY: event.pageY - MENUBAR_OFFSET,
      delta: delta,
    });
  };

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

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    mouseIsHeld.current = true;
  };

  return (
    <StyledDiv
      onMouseDown={handleMouseDown}
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
            weight={edge.weight}
            handleClick={deleteEdge}
            showLabel={showLabel}
            animation={edge.animation}
            optionalValue={edge.optionalValue}
            interval={interval.current}
            updateEdgeWeight={updateEdgeWeight}
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

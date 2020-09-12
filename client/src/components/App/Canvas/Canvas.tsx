import React, { useState, useCallback, useRef, useEffect } from "react";
import styled, { ThemeProvider } from "styled-components";
import { v4 as uuidv4 } from "uuid";

import CanvasThemeProvider from "./CanvasThemeProvider";
import Node, { NodeProps } from "./Node";
import Edge, { EdgeProps } from "./Edge";
import GhostEdge, { GhostEdgeProps } from "./GhostEdge";

import { getScale, getTranslate, getMatrix } from "helper";

const StyledDiv = styled.div`
  flex: 9;
  background: #16213e;
  position: relative;
  z-index: 1;
  height: 100%;
  width: 100%;

  /* transform-origin: ${(props) => {
    return props.theme.transformOrigin;
  }}; */
`;

interface CanvasProps {
  minScale: number;
  maxScale: number;
  scaleSensitivity: number;
}

interface CanvasState {
  originX: number;
  originY: number;
  translateX: number;
  translateY: number;
  scale: number;
}

const Canvas: React.FC<CanvasProps> = ({
  minScale,
  maxScale,
  scaleSensitivity,
}) => {
  const [nodes, setNodes] = useState<Array<NodeProps>>([]);
  const [edges, setEdges] = useState<Array<EdgeProps>>([]);
  const [ghostEdge, setGhostEdge] = useState<GhostEdgeProps | null>(null);
  const [state, setState] = useState<CanvasState>({
    originX: 0,
    originY: 0,
    translateX: 0,
    translateY: 0,
    scale: 1,
  });
  const [theme, setTheme] = useState<{
    transform: string;
    transformOrigin: string;
  }>({
    transform: "",
    transformOrigin: "",
  });

  const mouseDownNode = useRef<NodeProps | null>(null);
  const rightMouseDown = useRef<boolean>(false);
  const canvasRef = useRef<HTMLDivElement>(null);

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
      x: x - state.translateX,
      y: y - state.translateY,
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
        x: event.clientX - bounds.left - state.translateX,
        y: event.clientY - bounds.top - state.translateY,
      };
      const newGhostEdge = {
        headNode: mouseDownNode.current,
        tailPosition: tail,
      };
      setGhostEdge((prev) => newGhostEdge);
    },
    [mouseDownNode, setGhostEdge, state]
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

  const panBy = useCallback(
    (event: React.MouseEvent<HTMLDivElement>): void => {
      const originX = event.movementX;
      const originY = event.movementY;

      setState((prevState) => {
        return {
          ...prevState,
          translateX: prevState.translateX + originX,
          translateY: prevState.translateY + originY,
        };
      });
    },
    [setState]
  );

  useEffect(() => {
    setTheme((prevTheme) => {
      return {
        ...prevTheme,
        transform: getMatrix({
          scale: state.scale,
          translateX: state.translateX,
          translateY: state.translateY,
        }),
      };
    });
  }, [state.scale, state.translateX, state.translateY, setTheme]);

  useEffect(() => {
    setTheme((prevTheme) => {
      return {
        ...prevTheme,
        transformOrigin: `${state.originX}px ${state.originY}px`,
      };
    });
  }, [state.originX, state.originY, setTheme]);

  const zoom = useCallback(
    (x: number, y: number, deltaScale: number): void => {
      if (canvasRef.current === null) return;

      const { left, top } = canvasRef.current.getBoundingClientRect();
      const [scale, newScale] = getScale({
        scale: state.scale,
        minScale: minScale,
        maxScale: maxScale,
        scaleSensitivity: scaleSensitivity,
        deltaScale: deltaScale,
      });

      const originX = x - left;
      const originY = y - top;
      const newOriginX = originX / scale;
      const newOriginY = originY / scale;
      const translate = getTranslate(scale, minScale, maxScale);
      const translateX = translate({
        pos: originX,
        prevPos: state.originX,
        translate: state.translateX,
      });
      const translateY = translate({
        pos: originY,
        prevPos: state.originY,
        translate: state.translateY,
      });

      //correct element positions during zoom in and zoom out.
      setState((prevState) => {
        return {
          ...prevState,
          originX: newOriginX,
          originY: newOriginY,
          translateX: translateX,
          translateY: translateY,
          scale: newScale,
        };
      });
    },
    [canvasRef, state, setState, maxScale, minScale, scaleSensitivity]
  );

  return (
    <ThemeProvider theme={theme}>
      <StyledDiv
        ref={canvasRef}
        onClick={(e) => {
          addNode(e);
        }}
        onMouseDown={(e) => {
          if (e.shiftKey) {
            e.preventDefault();
            rightMouseDown.current = true;
          }
        }}
        onMouseMove={(e) => {
          if (e.shiftKey) panBy(e);
          else updateGhostEdge(e);
        }}
        onWheel={(e) => {
          zoom(e.pageX, e.pageY, Math.sign(e.deltaY) > 0 ? -1 : 1);
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
    </ThemeProvider>
  );
};

export default Canvas;

import React, { useState, useEffect, CSSProperties } from "react";
import styled from "styled-components";

import { getAngleRad, getDistance } from "helper";
import { GraphNodeProps } from "Components/App/Canvas/GraphNode";

export interface Coordinate {
  x: number;
  y: number;
}

export interface GhostEdgeProps {
  className?: string;
  headNode: GraphNodeProps;
  tailPosition: Coordinate;
}

const EDGE_HEIGHT = 1;

const StyledGhostEdge = styled("div")<{
  left: number;
  top: number;
  width: number;
  degree: number;
}>`
  position: absolute;
  left: ${(props) => props.left}px;
  top: ${(props) => props.top}px;
  height: ${EDGE_HEIGHT}px;
  width: ${(props) => props.width}px;
  height: ${EDGE_HEIGHT}px;
  background: #ffffff;
  opacity: 0.5;
  transform-origin: 0%;
  transform: rotate(${(props) => props.degree}rad);
`;

const GhostEdge: React.FC<GhostEdgeProps> = ({
  className,
  headNode,
  tailPosition,
}) => {
  const left = headNode.x;
  const top = headNode.y - EDGE_HEIGHT / 2;
  const width = getDistance(
    headNode.x,
    headNode.y,
    tailPosition.x,
    tailPosition.y
  );
  const degree = getAngleRad(
    headNode.x,
    headNode.y,
    tailPosition.x,
    tailPosition.y
  );

  return (
    <StyledGhostEdge left={left} top={top} width={width} degree={degree} />
  );
};

export default GhostEdge;

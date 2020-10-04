import React, { useState, useEffect } from "react";
import styled from "styled-components";

import { NodeProps } from "../Node";
import { getAngleRad, getDistance } from "helper";

export interface EdgeProps {
  id: string;
  headNode: NodeProps;
  tailNode: NodeProps;
  className?: string;
  handleClick?: (id: string) => void;
}

const EDGE_HEIGHT = 1;

const StyledEdge = styled("div")<{
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
  background: #ffffff;
  transform-origin: 0%;
  transform: rotate(${(props) => props.degree}rad);
  cursor: pointer;
`;

const Edge: React.FC<EdgeProps> = ({
  id,
  className,
  headNode,
  tailNode,
  handleClick,
}) => {
  const width = getDistance(headNode.x, headNode.y, tailNode.x, tailNode.y);
  const degree = getAngleRad(headNode.x, headNode.y, tailNode.x, tailNode.y);
  const left = headNode.x;
  const top = headNode.y - EDGE_HEIGHT / 2; /* places center of edge on node */

  return (
    <StyledEdge
      width={width}
      degree={degree}
      left={left}
      top={top}
      onClick={(e) => {
        e.stopPropagation();
        handleClick!(id);
      }}
    />
  );
};

export default Edge;

import React, { useState, useEffect, useRef, CSSProperties } from "react";
import styled, { keyframes } from "styled-components";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullseye, faDotCircle } from "@fortawesome/free-solid-svg-icons";

export interface GraphNodeProps extends React.HTMLAttributes<HTMLElement> {
  id: string;
  x: number;
  y: number;
  className?: string;
  outEdgeIDs?: Array<string>;
  inEdgeIDs?: Array<string>;
  handleMouseDown?: (id: string) => void;
  handleMouseUp?: (id: string) => void;
  isSource?: boolean;
  isTarget?: boolean;
}

const StyledNode = styled("div")`
  position: absolute;
  z-index: 2;

  height: 6px;
  width: 6px;
  border-radius: 50%;
  background: #ffffff;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const grow = keyframes`
  from {
    transform: scale(0.5);
  }
  to {
    transform: scale(1);
  }
`;

const DotCircle = styled(FontAwesomeIcon)`
  color: #21e6c1;
  position: absolute;
  height: 6px;
  width: 6px;
  animation: ${grow} 1s linear infinite;
  animation-direction: alternate;
  display: inline-block;
`;

const BullsEye = styled(FontAwesomeIcon)`
  color: #ff4b5c;
  position: absolute;
  height: 6px;
  width: 6px;
  animation: ${grow} 1s linear infinite;
  animation-direction: alternate;
`;

const GraphNode: React.FC<GraphNodeProps> = ({
  id,
  x,
  y,
  handleMouseDown,
  handleMouseUp,
  isSource,
  isTarget,
}) => {
  return (
    <StyledNode
      style={{ left: x - 3, top: y - 3 }}
      onMouseDown={(e) => {
        e.stopPropagation();
        e.preventDefault();
        handleMouseDown!(id);
      }}
      onMouseUp={(e) => {
        e.stopPropagation();
        handleMouseUp!(id);
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        return false;
      }}
    >
      {isSource && <DotCircle icon={faDotCircle} size="10x" />}
      {isTarget && <BullsEye icon={faBullseye} />}
    </StyledNode>
  );
};

export default GraphNode;

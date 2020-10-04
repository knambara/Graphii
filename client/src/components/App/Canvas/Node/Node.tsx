import React, { useState, useEffect, useRef, CSSProperties } from "react";
import styled, { keyframes } from "styled-components";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullseye, faChevronRight } from "@fortawesome/free-solid-svg-icons";

export interface NodeProps extends React.HTMLAttributes<HTMLElement> {
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

const StyledNode = styled("div")<{ left: number; top: number }>`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  left: ${(props) => props.left}px;
  top: ${(props) => props.top}px;
  height: 5px;
  width: 5px;
  border-radius: 50%;
  background: #ffffff;
  cursor: pointer;
`;

const grow = keyframes`
  from {
    transform: scale(0.5);
  }
  to {
    transform: scale(1);
  }
`;

const ChevronRight = styled(FontAwesomeIcon)`
  color: #21e6c1;
  position: absolute;
  height: 3px;
  width: 3px;
  transform: translateX(-3px);
  animation: ${grow} 1s linear infinite;
  animation-direction: alternate;
`;

const BullsEye = styled(FontAwesomeIcon)`
  color: #ff4b5c;
  position: absolute;
  height: 3px;
  width: 3px;
  animation: ${grow} 1s linear infinite;
  animation-direction: alternate;
`;

const Node: React.FC<NodeProps> = ({
  id,
  x,
  y,
  handleMouseDown,
  handleMouseUp,
  className,
  isSource,
  isTarget,
}) => {
  const nodeRef = useRef<React.RefObject<HTMLDivElement>>(null);

  const left = x - 2.5;
  const top = y - 2.5;

  return (
    <StyledNode
      left={left}
      top={top}
      onMouseDown={(e) => {
        e.stopPropagation();
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
      {isSource && <ChevronRight icon={faChevronRight} />}
      {isTarget && <BullsEye icon={faBullseye} />}
    </StyledNode>
  );
};

export default Node;

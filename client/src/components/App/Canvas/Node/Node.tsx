import React, { useState, useEffect, useRef, CSSProperties } from "react";
import styled from "styled-components";

export interface NodeProps extends React.HTMLAttributes<HTMLElement> {
  id: string;
  x: number;
  y: number;
  className?: string;
  outEdgeIDs?: Array<string>;
  inEdgeIDs?: Array<string>;
  handleMouseDown?: (id: string) => void;
  handleMouseUp?: (id: string) => void;
}

const StyledNode = styled("div")<{ left: number; top: number }>`
  position: absolute;
  display: inline-block;
  z-index: 2;
  left: ${(props) => props.left}px;
  top: ${(props) => props.top}px;
  height: 5px;
  width: 5px;
  border-radius: 50%;
  background: #ffffff;
  cursor: pointer;
`;

const Node: React.FC<NodeProps> = ({
  id,
  x,
  y,
  handleMouseDown,
  handleMouseUp,
  className,
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
    />
  );
};

export default Node;

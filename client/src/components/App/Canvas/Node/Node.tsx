import React, { useState, useEffect, useRef, CSSProperties } from "react";
import styled from "styled-components";

export interface NodeProps extends React.HTMLAttributes<HTMLElement> {
  id: string;
  x: number;
  y: number;
  className?: string;
  outEdgeIDs?: Array<string>;
  inEdgeIDs?: Array<string>;
  handleClick?: (id: string) => void;
  handleMouseDown?: (id: string) => void;
  handleMouseUp?: (id: string) => void;
}

const NodeSize = 5;

const Node: React.FC<NodeProps> = ({
  id,
  x,
  y,
  handleClick,
  handleMouseDown,
  handleMouseUp,
  className,
}) => {
  const nodeRef = useRef<React.RefObject<HTMLDivElement>>(null);
  const [position, setPosition] = useState<CSSProperties>();

  useEffect(() => {
    const nodeStyle = {
      left: x - 2.5,
      top: y - 2.5,
    } as CSSProperties;
    setPosition((prev) => nodeStyle);
  }, [x, y]);

  return (
    <div
      id={id}
      className={className}
      style={position}
      onClick={(e) => {
        e.stopPropagation();
        handleClick!(id);
      }}
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

const StyledNode = styled(Node)`
  height: ${NodeSize}px;
  width: ${NodeSize}px;
  border-radius: 50%;
  background: #ffffff;
  display: inline-block;
  position: absolute;
  z-index: 2;
  cursor: pointer;
  /* transform: ${(props) => {
    return props.theme.transform;
  }}; */
`;

export default React.memo(StyledNode);

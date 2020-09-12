import React, { useState, useEffect, CSSProperties } from "react";
import styled from "styled-components";

import { useCountRenders } from "Hooks/useCountRenders";

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

const Node: React.FC<NodeProps> = ({
  id,
  x,
  y,
  handleClick,
  handleMouseDown,
  handleMouseUp,
  className,
}) => {
  const [position, setPosition] = useState<CSSProperties>();
  const [rightClickDown, setRightClickDown] = useState<boolean>(false);

  useCountRenders();

  useEffect(() => {
    const nodeStyle = { left: x - 25, top: y - 25 } as CSSProperties;
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
        if (e.button === 2) {
          setRightClickDown((prev) => true);
        } else {
          handleMouseDown!(id);
        }
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
  height: 50px;
  width: 50px;
  border-radius: 50%;
  background: #ffffff;
  display: inline-block;
  position: absolute;
  z-index: 2;
  cursor: pointer;

  transform: ${(props) => {
    return props.theme.transform;
  }};
`;

export default React.memo(StyledNode);

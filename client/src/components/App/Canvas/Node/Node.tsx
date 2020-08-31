import React, { useState, useEffect, CSSProperties } from "react";
import styled from "styled-components";

import { useCountRenders } from "Hooks/useCountRenders";

export interface NodeProps extends React.HTMLAttributes<HTMLElement> {
  id: string;
  x: number;
  y: number;
  outEdgeIDs?: Array<string>;
  inEdgeIDs?: Array<string>;
  handleClick?: (id: string) => void;
  handleMouseDown?: (id: string) => void;
}

const StyledNode = styled.div`
  height: 50px;
  width: 50px;
  border-radius: 50%;
  background: #ffffff;
  display: inline-block;
  position: absolute;
  z-index: 2;
`;

const Node: React.FC<NodeProps> = ({
  id,
  x,
  y,
  handleClick,
  handleMouseDown,
}) => {
  const [position, setPosition] = useState<CSSProperties>();
  useCountRenders();

  useEffect(() => {
    const nodeStyle = { left: x - 25, top: y - 25 } as CSSProperties;
    setPosition((prev) => nodeStyle);
  }, [x, y]);

  return (
    <StyledNode
      id={id}
      style={position}
      onClick={(e) => {
        e.stopPropagation();
        handleClick!(id);
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        handleMouseDown!(id);
      }}
    />
  );
};

export default React.memo(Node);

import React, { useState, useEffect, CSSProperties } from "react";
import styled from "styled-components";

export interface NodeProps {
  id: string;
  x: number;
  y: number;
  outEdgeIDs?: Array<string>;
  inEdgeIDs?: Array<string>;
}

const StyledNode = styled.div`
  border-radius: 50%;
  background: #ffffff;
  display: inline-block;
  position: absolute;
`;

const Node: React.FC<NodeProps> = (props) => {
  const [position, setPosition] = useState<CSSProperties>();

  useEffect(() => {
    const nodeStyle = { left: props.x, top: props.y } as CSSProperties;
    setPosition((prev) => nodeStyle);
  }, []);

  return <StyledNode id={props.id} style={position} />;
};

export default Node;

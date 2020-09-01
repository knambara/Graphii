import React, { useState, useEffect, CSSProperties } from "react";
import styled from "styled-components";

import { NodeProps } from "../Node";
import { getAngleRad, getDistance } from "helper";

export interface EdgeProps {
  id: string;
  headNode: NodeProps;
  tailNode: NodeProps;
  handleClick?: (id: string) => void;
}

const EdgeWidth: number = 10;

const StyledEdge = styled.div`
  height: 10px;
  background: #ffffff;
  position: absolute;
  transform-origin: 0%; /* make pivot point to the left side of edge */
  cursor: pointer;
`;

const Edge: React.FC<EdgeProps> = ({ id, headNode, tailNode, handleClick }) => {
  const [position, setPosition] = useState<CSSProperties>();

  useEffect(() => {
    const length = getDistance(headNode.x, headNode.y, tailNode.x, tailNode.y);
    const degree = getAngleRad(headNode.x, headNode.y, tailNode.x, tailNode.y);
    const edgeStyle = {
      left: headNode.x,
      top: headNode.y - EdgeWidth / 2 /* places center of edge on node */,
      width: `${length}px`,
      transform: `rotate(${degree}rad)`,
    } as CSSProperties;
    setPosition((prev) => edgeStyle);
  }, [headNode, tailNode]);

  return (
    <StyledEdge
      key={id}
      id={id}
      style={position}
      onClick={(e) => {
        e.stopPropagation();
        handleClick!(id);
      }}
    />
  );
};

export default React.memo(Edge);

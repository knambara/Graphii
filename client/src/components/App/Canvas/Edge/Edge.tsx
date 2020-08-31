import React, { useState, useEffect, CSSProperties } from "react";
import styled from "styled-components";

import { NodeProps } from "../Node";
import { getAngleRad, getDistance } from "helper";

export interface EdgeProps {
  id: string;
  headNode: NodeProps;
  tailNode: NodeProps;
}

const StyledEdge = styled.div`
  height: 10px;
  background: #ffffff;
  position: absolute;
  transform-origin: 0%; /* make pivot point to the left side of edge */
`;

const Edge: React.FC<EdgeProps> = ({ id, headNode, tailNode }) => {
  const [position, setPosition] = useState<CSSProperties>();

  useEffect(() => {
    const length = getDistance(headNode.x, headNode.y, tailNode.x, tailNode.y);
    const degree = getAngleRad(headNode.x, headNode.y, tailNode.x, tailNode.y);
    const edgeStyle = {
      width: `${length}px`,
      transform: `rotate(${degree}rad)`,
    } as CSSProperties;
    setPosition((prev) => edgeStyle);
  }, [headNode, tailNode]);

  return <StyledEdge id={id} style={position} />;
};

export default React.memo(Edge);

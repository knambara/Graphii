import React, { useState, useEffect, CSSProperties } from "react";
import styled from "styled-components";

import { getAngleRad, getDistance } from "helper";
import { NodeProps } from "Components/App/Canvas/Node";

export interface Coordinate {
  x: number;
  y: number;
}

export interface GhostEdgeProps {
  headNode: NodeProps;
  tailPosition: Coordinate;
}

const EdgeWidth: number = 10;

const StyledGhostEdge = styled.div`
  height: ${EdgeWidth}px;
  background: #ffffff;
  opacity: 0.5;
  position: absolute;
  transform-origin: 0%; /* make pivot point to the left side of edge */
`;

const GhostEdge: React.FC<GhostEdgeProps> = ({ headNode, tailPosition }) => {
  const [position, setPosition] = useState<CSSProperties>();

  useEffect(() => {
    const length = getDistance(
      headNode.x,
      headNode.y,
      tailPosition.x,
      tailPosition.y
    );
    const degree = getAngleRad(
      headNode.x,
      headNode.y,
      tailPosition.x,
      tailPosition.y
    );
    const edgeStyle = {
      left: headNode.x,
      top: headNode.y - EdgeWidth / 2 /* places center of edge on node */,
      width: `${length}px`,
      transform: `rotate(${degree}rad)`,
    } as CSSProperties;

    setPosition((prev) => edgeStyle);
  }, [headNode, tailPosition]);

  return <StyledGhostEdge style={position} />;
};

export default React.memo(GhostEdge);

import React, { useState, useEffect, CSSProperties } from "react";
import styled from "styled-components";

import { getAngleRad, getDistance } from "helper";
import { NodeProps } from "Components/App/Canvas/Node";

export interface Coordinate {
  x: number;
  y: number;
}

export interface GhostEdgeProps {
  className?: string;
  headNode: NodeProps;
  tailPosition: Coordinate;
}

const EdgeWidth = 10;

const GhostEdge: React.FC<GhostEdgeProps> = ({
  className,
  headNode,
  tailPosition,
}) => {
  const [position, setPosition] = useState<CSSProperties>();

  useEffect(() => {
    const length = getDistance(
      headNode.x,
      headNode.y,
      tailPosition.x,
      tailPosition.y
    );
    const edgeStyle = {
      left: headNode.x,
      top: headNode.y - EdgeWidth / 2 /* places center of edge on node */,
      width: `${length}px`,
    } as CSSProperties;

    setPosition((prev) => edgeStyle);
  }, [headNode, tailPosition]);

  return <div className={className} style={position} />;
};

const StyledGhostEdge = styled(GhostEdge).attrs((props) => ({
  degree: getAngleRad(
    props.headNode.x,
    props.headNode.y,
    props.tailPosition.x,
    props.tailPosition.y
  ),
}))`
  height: ${EdgeWidth}px;
  background: #ffffff;
  opacity: 0.5;
  position: absolute;
  transform-origin: 0%; /* make pivot point to the left side of edge */
  transform: ${(props) => props.theme.transform}
    rotate(${(props) => props.degree}rad);
`;

export default React.memo(StyledGhostEdge);

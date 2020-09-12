import React, { useState, useEffect, CSSProperties } from "react";
import styled from "styled-components";

import { NodeProps } from "../Node";
import { getAngleRad, getDistance } from "helper";

export interface EdgeProps {
  id: string;
  headNode: NodeProps;
  tailNode: NodeProps;
  className?: string;
  handleClick?: (id: string) => void;
}

const EdgeWidth = 10;

let length: number;
let degree: number;
let edgeStyle: {} = {};

const Edge: React.FC<EdgeProps> = ({
  id,
  className,
  headNode,
  tailNode,
  handleClick,
}) => {
  const [position, setPosition] = useState<CSSProperties>();

  useEffect(() => {
    length = getDistance(headNode.x, headNode.y, tailNode.x, tailNode.y);
    degree = getAngleRad(headNode.x, headNode.y, tailNode.x, tailNode.y);
    edgeStyle = {
      left: headNode.x,
      top: headNode.y - EdgeWidth / 2 /* places center of edge on node */,
      width: `${length}px`,
    } as CSSProperties;
    setPosition((prev) => edgeStyle);
  }, [headNode, tailNode]);

  return (
    <div
      id={id}
      className={className}
      style={position}
      onClick={(e) => {
        e.stopPropagation();
        handleClick!(id);
      }}
    />
  );
};

const StyledEdge = styled(Edge).attrs((props) => ({
  degree: getAngleRad(
    props.headNode.x,
    props.headNode.y,
    props.tailNode.x,
    props.tailNode.y
  ),
}))`
  height: 10px;
  background: #ffffff;
  position: absolute;
  transform-origin: 0%; /* make pivot point to the left side of edge */
  cursor: pointer;

  transform: ${(props) => props.theme.transform}
    rotate(${(props) => props.degree}rad);
`;

export default React.memo(StyledEdge);

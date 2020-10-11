import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";

import { Node } from "Components/App/Container/Canvas";
import { getAngleRad, getDistance } from "helper";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

export interface GraphEdgeProps {
  id: string;
  headNode: Node;
  tailNode: Node;
  weight: number;
  className?: string;
  handleClick?: (id: string) => void;
  animate: boolean;
  special: boolean;
  showLabel: boolean;
}

const EDGE_HEIGHT = 1.2;

const StyledEdge = styled("div")<{
  animate: boolean;
  special: boolean;
}>`
  position: absolute;
  background: ${(props) =>
    props.animate ? "#19d3da" : props.special ? "#f1fa3c" : "#ffffff"};
  transform-origin: 0%;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background 0.7s;
`;

const ArrowHead = styled(FontAwesomeIcon)<{
  animate: boolean;
  special: boolean;
}>`
  position: absolute;
  right: 2.5px;
  color: ${(props) =>
    props.animate ? "#19d3da" : props.special ? "#f1fa3c" : "#ffffff"};
  height: 5px;
  width: 5px !important;
  transition: background 0.7s;
`;

const traverse = keyframes`
  from {
    left: calc(0% - 3px);
  }
  to {
    left: calc(100% - 3px);
  }
`;

const ChevronRight = styled(FontAwesomeIcon)`
  position: absolute;
  left: calc(0% - 3px);
  height: 5px;
  width: 5px !important;
  color: #19d3da;
  animation: ${traverse} 0.5s linear;
`;

const Label = styled.input`
  position: absolute;
  display: block;
  font-size: 5px;
  background: transparent;
  border: none;
  color: white;
  top: 2px;
  display: inline-block;
  text-align: center;
  width: 100%;
`;

const GraphEdge: React.FC<GraphEdgeProps> = ({
  id,
  className,
  headNode,
  tailNode,
  handleClick,
  animate,
  special,
  weight,
  showLabel,
}) => {
  const width = getDistance(headNode.x, headNode.y, tailNode.x, tailNode.y);
  const degree = getAngleRad(headNode.x, headNode.y, tailNode.x, tailNode.y);
  const left = headNode.x;
  const top = headNode.y - EDGE_HEIGHT / 2; /* places center of edge on node */

  return (
    <StyledEdge
      style={{
        left: left,
        top: top,
        height: EDGE_HEIGHT,
        width: width,
        transform: `rotate(${degree}rad)`,
      }}
      onClick={(e) => {
        e.stopPropagation();
        handleClick!(id);
      }}
      animate={animate}
      special={special}
    >
      {animate && <ChevronRight icon={faChevronRight} size="1x" />}
      <ArrowHead
        icon={faArrowRight}
        animate={animate}
        size="1x"
        special={special}
      />
      {showLabel && <Label type={"text"} value={weight} />}
    </StyledEdge>
  );
};

export default GraphEdge;

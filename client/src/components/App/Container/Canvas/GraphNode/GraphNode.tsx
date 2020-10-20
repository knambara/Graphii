import React, { useState, useEffect, useRef, CSSProperties } from "react";
import styled, { keyframes } from "styled-components";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBullseye,
  faDotCircle,
  faSeedling,
  faFaucet,
  faSink,
} from "@fortawesome/free-solid-svg-icons";

import { useAlgoState } from "Contexts/AlgorithmContext";

export interface GraphNodeProps extends React.HTMLAttributes<HTMLElement> {
  id: string;
  x: number;
  y: number;
  className?: string;
  outEdgeIDs?: Array<string>;
  inEdgeIDs?: Array<string>;
  handleMouseDown?: (id: string) => void;
  handleMouseUp?: (id: string) => void;
  isSource?: boolean;
  isTarget?: boolean;
}

const grow = keyframes`
  from {
    transform: scale(0.5);
  }
  to {
    transform: scale(1);
  }
`;

const pop = keyframes`
  0% {
    transform: scale(0);
  }
  75% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
`;

const StyledNode = styled("div")`
  position: absolute;
  z-index: 2;

  height: 6px;
  width: 6px;
  border-radius: 50%;
  background: #ffffff;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  animation: ${pop} 0.2s ease-out forwards;
`;

const Icon = styled(FontAwesomeIcon)`
  position: absolute;
  height: 6px;
  width: 6px;
  animation: ${grow} 1s linear infinite;
  animation-direction: alternate;
`;

const DotCircle = styled(Icon)`
  color: #21e6c1;
`;

const BullsEye = styled(Icon)`
  color: #ff4b5c;
`;

const Seedling = styled(Icon)`
  color: #b8de6f;
`;

const Faucet = styled(Icon)`
  color: #4c6ef5;
`;

const Sink = styled(Icon)`
  color: #4c6ef5;
`;

const GraphNode: React.FC<GraphNodeProps> = ({
  id,
  x,
  y,
  handleMouseDown,
  handleMouseUp,
  isSource,
  isTarget,
}) => {
  const algoState = useAlgoState();

  return (
    <StyledNode
      style={{ left: x - 3, top: y - 3 }}
      onMouseDown={(e) => {
        e.stopPropagation();
        e.preventDefault();
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
    >
      {isSource && algoState.category === "path" && (
        <DotCircle icon={faDotCircle} />
      )}
      {isSource && algoState.category === "tree" && (
        <Seedling icon={faSeedling} />
      )}
      {isSource && algoState.category === "flow" && <Faucet icon={faFaucet} />}
      {isTarget && algoState.category === "path" && (
        <BullsEye icon={faBullseye} />
      )}
      {isTarget && algoState.category === "flow" && <Sink icon={faSink} />}
    </StyledNode>
  );
};

export default GraphNode;

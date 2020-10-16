import React, { useEffect, useRef } from "react";
import styled, {
  css,
  keyframes,
  Keyframes,
  FlattenSimpleInterpolation,
} from "styled-components";

import { useAlgoState } from "Contexts/AlgorithmContext";
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
  showLabel: boolean;
  animation: string | null;
}

const EDGE_HEIGHT = 1.2;

/********** KEYFRAMES **********/

const pathRegular = () => keyframes`
  100% {
    background: #19d3da;
  }
`;

const pathSpecial = () => keyframes`
  100% {
    background: #f1fa3c;
  }
`;

const mstRegularAnimation = () => keyframes`
  50% {
    background: #ff414d;
  }
  100% {
    background: none;
  }
`;

const mstSpecialAnimation = () => keyframes`
  100% {
    background: #b8de6f;
  }
`;

/********** STYLED-COMPONENTS **********/

const StyledEdge = styled("div")<{
  animation: (() => Keyframes) | null;
}>`
  position: absolute;
  background: #ffffff;
  transform-origin: 0%;
  cursor: pointer;
  display: flex;
  align-items: center;
  animation: ${(props) =>
      props.animation === null ? "none" : props.animation()}
    0.5s linear forwards;
`;

const ArrowHead = styled(FontAwesomeIcon)<{
  show: boolean;
  animation: (() => Keyframes) | null;
}>`
  visibility: ${(props) => (props.show ? "visible" : "hidden")};
  position: absolute;
  right: 2.5px;
  color: #ffffff;
  height: 5px;
  width: 5px !important;
  animation: ${(props) =>
      props.animation === null ? "none" : props.animation()}
    0.5s linear forwards;
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
  weight,
  showLabel,
  animation,
}) => {
  const width = getDistance(headNode.x, headNode.y, tailNode.x, tailNode.y);
  const degree = getAngleRad(headNode.x, headNode.y, tailNode.x, tailNode.y);
  const left = headNode.x;
  const top = headNode.y - EDGE_HEIGHT / 2; /* places center of edge on node */

  const algoState = useAlgoState();
  const animationRef = useRef<(() => Keyframes) | null>(null);
  console.log(animation);
  console.log(algoState.category);
  console.log(animationRef.current);

  useEffect(() => {
    if (animation === null) {
      animationRef.current = null;
      return;
    }

    switch (algoState.category) {
      case "path":
        animationRef.current =
          animation === "regular" ? pathRegular : pathSpecial;
        return;
      case "tree":
        animationRef.current =
          animation === "regular" ? mstRegularAnimation : mstSpecialAnimation;
        return;
      case "flow":
        return;
      default:
        animationRef.current = null;
        return;
    }
  }, [animation]);

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
      animation={!animation ? null : animationRef.current}
    >
      {animationRef.current && algoState.category === "path" && (
        <ChevronRight icon={faChevronRight} size="1x" />
      )}
      <ArrowHead
        icon={faArrowRight}
        size="1x"
        show={algoState.category !== "tree"}
        animation={!animation ? null : animationRef.current}
      />
      {showLabel && <Label type={"text"} value={weight} />}
    </StyledEdge>
  );
};

export default GraphEdge;

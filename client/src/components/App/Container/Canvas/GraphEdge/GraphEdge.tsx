import React, { useEffect, useState, useRef } from "react";
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
  optionalValue: number;
  interval: number;
  updateEdgeWeight: (edgeID: string, newWeight: number) => void;
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

const arrowRegular = () => keyframes`
  100% {
    color: #19d3da;
  }
`;

const arrowSpecial = () => keyframes`
  100% {
    color: #f1fa3c;
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

const flowAnimation = (saturation: number) => keyframes`
  0% {
    width: 0%;
  }
  100% {
    width: 100%;
    opacity: ${saturation};
  }
`;

const traverse = keyframes`
  from {
    left: calc(0% - 3px);
  }
  to {
    left: calc(100% - 3px);
  }
`;

/********** STYLED-COMPONENTS **********/

const StyledEdge = styled("div")<{
  animation: (() => Keyframes) | null;
  interval: number;
}>`
  position: absolute;
  background: #ffffff;
  transform-origin: 0%;
  cursor: pointer;
  display: flex;
  align-items: center;
  animation: ${(props) =>
      props.animation === null ? "none" : props.animation()}
    ${(props) => props.interval}s linear forwards;
`;

const ArrowHead = styled(FontAwesomeIcon)<{
  show: boolean;
  animation: string | null;
  interval: number;
}>`
  visibility: ${(props) => (props.show ? "visible" : "hidden")};
  position: absolute;
  right: 2.5px;
  color: #ffffff;
  height: 5px;
  width: 5px !important;
  animation: ${(props) =>
      props.animation === null
        ? "none"
        : props.animation === "regular"
        ? arrowRegular
        : arrowSpecial}
    ${(props) => props.interval}s linear forwards;
`;

const ChevronRight = styled(FontAwesomeIcon)<{ interval: number }>`
  position: absolute;
  left: calc(0% - 3px);
  height: 5px;
  width: 5px !important;
  color: #19d3da;
  animation: ${traverse} ${(props) => props.interval}s linear;
`;

const Flow = styled("div")<{ saturation: number; interval: number }>`
  position: absolute;
  height: 100%;
  width: 50%;
  background-color: #4c6ef5;
  opacity: 1;
  animation: ${(props) => flowAnimation(props.saturation)}
    ${(props) => props.interval}s linear forwards;
`;

const Label = styled.div`
  position: absolute;
  display: block;
  font-size: 4px;
  background: transparent;
  border: none;
  color: white;
  top: 1px;
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
  optionalValue,
  interval,
  updateEdgeWeight,
}) => {
  const width = getDistance(headNode.x, headNode.y, tailNode.x, tailNode.y);
  const degree = getAngleRad(headNode.x, headNode.y, tailNode.x, tailNode.y);
  const left = headNode.x;
  const top = headNode.y - EDGE_HEIGHT / 2; /* places center of edge on node */

  const algoState = useAlgoState();
  const animationRef = useRef<(() => Keyframes) | null>(null);

  const [saturation, setSaturation] = useState<number>(0);

  useEffect(() => {
    if (algoState.category === "flow") {
      setSaturation((prev) => Math.round((optionalValue / weight) * 100));
    }
  }, [weight, optionalValue]);

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
        animationRef.current = null;
        return;
      default:
        animationRef.current = null;
        return;
    }
  }, [animation]);

  const labelRef = useRef<HTMLDivElement | null>(null);

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
      animation={
        animation === null
          ? null
          : algoState.category === "path" && animation === "special"
          ? pathSpecial
          : animationRef.current
      }
      interval={interval / 1000}
    >
      {animationRef.current && algoState.category === "path" && (
        <ChevronRight
          icon={faChevronRight}
          size="1x"
          interval={interval / 1000}
        />
      )}
      <ArrowHead
        icon={faArrowRight}
        size="1x"
        show={algoState.category !== "tree"}
        animation={!animation ? null : animation}
        interval={interval / 1000}
      />
      {animation === "regular" && algoState.category === "flow" && (
        <Flow saturation={saturation} interval={interval / 1000} />
      )}
      {showLabel && (
        <Label
          contentEditable={!algoState.name}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          onMouseUp={(e) => e.stopPropagation()}
          onInput={(e) => {
            let input = e.currentTarget.innerHTML;
            let isNum = /^\d+$/.test(input);
            if (isNum) updateEdgeWeight(id, parseInt(input, 10));
            else labelRef.current!.innerHTML = `${weight}`;
          }}
          ref={labelRef}
        >
          {algoState.category === "flow"
            ? `${optionalValue} / ${weight}`
            : weight}
        </Label>
      )}
    </StyledEdge>
  );
};

export default GraphEdge;

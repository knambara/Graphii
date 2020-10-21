import React from "react";
import styled from "styled-components";

import { useAlgoState, useAlgoDispatch } from "Contexts/AlgorithmContext";

interface TitleProps {}

const StyledTitle = styled.h1`
  color: #ffffff;
  font-family: "Montserrat", sans-serif;
  margin-top: 1em;
  margin-bottom: 1em;
  margin-right: 50px;
  font-size: 1.5em;
  cursor: pointer;
`;

const Title: React.FC<TitleProps> = (props) => {
  const algoState = useAlgoState();
  const algoDispatch = useAlgoDispatch();

  const handleClick = (
    event: React.MouseEvent<HTMLHeadingElement, MouseEvent>
  ) => {
    if (
      algoState.status === "setSource" ||
      algoState.status === "setTarget" ||
      algoState.status === "ready" ||
      algoState.status === "completed" ||
      (algoState.status !== null && algoState.status.includes("Error"))
    ) {
      algoDispatch({ type: "reset" });
    }
  };

  return <StyledTitle onClick={handleClick}>{props.children}</StyledTitle>;
};

export default Title;

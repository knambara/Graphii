import React from "react";
import styled from "styled-components";
import { useKeyDispatch } from "Contexts/KeyContext";

import Canvas from "./Canvas";
import Navbar from "./Navbar";
import AlgorithmBar from "./AlgorithmBar";

interface ContainerProps {
  children?: React.ReactNode;
}

const StyledDiv = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #16213e;
`;

const Container: React.FC<ContainerProps> = () => {
  const keyDispatch = useKeyDispatch();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    keyDispatch({ type: "press", key: event.key });
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLDivElement>) => {
    keyDispatch({ type: "unpress", key: event.key });
  };

  return (
    <StyledDiv onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}>
      <Navbar />
      <AlgorithmBar />
      <Canvas />
    </StyledDiv>
  );
};

export default Container;

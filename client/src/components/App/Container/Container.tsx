import React, { useState } from "react";
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
  const [clear, setClear] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);

  const keyDispatch = useKeyDispatch();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    keyDispatch({ type: "press", key: event.key });
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLDivElement>) => {
    keyDispatch({ type: "unpress", key: event.key });
  };

  const setClearTrue = () => {
    setClear((prev) => true);
  };

  const setClearFalse = () => {
    setClear((prev) => false);
  };

  const handleChangeSpeed = (newValue: number) => {
    setSpeed((prev) => newValue);
  };

  return (
    <StyledDiv onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}>
      <Navbar onClear={setClearTrue} />
      <AlgorithmBar changeSpeed={handleChangeSpeed} />
      <Canvas clearGraphs={clear} offClear={setClearFalse} speed={speed} />
    </StyledDiv>
  );
};

export default Container;

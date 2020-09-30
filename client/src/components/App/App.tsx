import React from "react";
import { AlgoProvider } from "Contexts/AlgorithmContext";

import Canvas from "./Canvas";
import Navbar from "./Navbar";
import styled from "styled-components";
import AlgorithmBar from "./Canvas/AlgorithmBar";

const StyledDiv = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const App: React.FC = () => {
  return (
    <StyledDiv>
      <AlgoProvider>
        <Navbar />
        <AlgorithmBar />
        <Canvas />
      </AlgoProvider>
    </StyledDiv>
  );
};

export default App;

import React from "react";
import { AlgoProvider } from "Contexts/AlgorithmContext";

import Canvas from "./Canvas";
import Navbar from "./Navbar";
import styled from "styled-components";

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
        <Canvas />
      </AlgoProvider>
    </StyledDiv>
  );
};

export default App;

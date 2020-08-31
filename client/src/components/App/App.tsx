import React from "react";
import AlgorithmContext from "Contexts/AlgorithmContext";
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
      <AlgorithmContext.Provider value={null}>
        <Navbar />
        <Canvas />
      </AlgorithmContext.Provider>
    </StyledDiv>
  );
};

export default App;

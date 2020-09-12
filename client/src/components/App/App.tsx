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
    <StyledDiv onClick={(e) => console.log("clicked")}>
      <AlgorithmContext.Provider value={null}>
        <Navbar />
        <Canvas minScale={0.1} maxScale={5} scaleSensitivity={25} />
      </AlgorithmContext.Provider>
    </StyledDiv>
  );
};

export default App;

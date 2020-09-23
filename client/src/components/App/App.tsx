import React from "react";
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
      <Navbar />
      <Canvas />
    </StyledDiv>
  );
};

export default App;

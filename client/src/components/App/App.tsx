import React from "react";
import { AlgoProvider } from "Contexts/AlgorithmContext";
import { KeyProvider } from "Contexts/KeyContext";

import Container from "./Container";

const App: React.FC = () => {
  return (
    <KeyProvider>
      <AlgoProvider>
        <Container />
      </AlgoProvider>
    </KeyProvider>
  );
};

export default App;

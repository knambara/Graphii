import React, { useState } from "react";
import styled from "styled-components";
import Node, { NodeProps } from "./Node";
import Edge, { EdgeProps } from "./Edge";

const StyledDiv = styled.div`
  flex: 9;
  background: #16213e;
  position: relative;
`;

const Canvas: React.FC = () => {
  const [nodes, setNodes] = useState<Array<NodeProps>>([]);
  const [edges, setEdges] = useState<Array<EdgeProps>>([]);

  return <StyledDiv></StyledDiv>;
};

export default Canvas;

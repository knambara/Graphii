import React, { useState, useRef, useCallback } from "react";
import styled from "styled-components";
import Title from "./Title";
import NavTab from "./NavTab";
import PopOver, { PopOverState } from "./PopOver";
import { useAlgoState } from "Contexts/AlgorithmContext";

interface NavbarProps {}

const StyledNav = styled("nav")<{ show: boolean }>`
  flex: 1;
  top: -200px;
  background: #e94560;
  padding: 10px 25px;
  display: flex;
  align-items: center;
  position: relative;
  transform: translateY(${(props) => (props.show ? 200 : -200)}px);
  transition: transform 0.5s;
  z-index: 2;
`;

const popOverContent: { [string: string]: string[] } = {
  path: ["dsf", "bfs", "dijkstra", "bellman-ford", "a*"],
  mst: ["prim", "kruskal"],
  flow: ["fulkerson", "karp", "dinic"],
};

const initialPopOver = {
  name: "",
  content: [],
  tabRef: null,
  show: false,
};

const Navbar: React.FC<NavbarProps> = (props) => {
  const [popOver, setPopOver] = useState<PopOverState>(initialPopOver);
  const algorithmState = useAlgoState();
  console.log(algorithmState);

  const showPopOver = useCallback(
    (name: string, tabRef: HTMLDivElement | null): void => {
      setPopOver((prev) => {
        return {
          name: name,
          content: popOverContent[name],
          tabRef: tabRef,
          show: true,
        };
      });
    },
    [setPopOver]
  );

  const hidePopOver = useCallback(() => {
    setPopOver((prev) => {
      return {
        ...prev,
        show: false,
      };
    });
  }, [setPopOver]);

  return (
    <StyledNav onMouseLeave={hidePopOver} show={algorithmState.name === null}>
      <Title>Graphii</Title>
      <NavTab name={"path"} onMouseOver={showPopOver}>
        Path Finding
      </NavTab>
      <NavTab name={"mst"} onMouseOver={showPopOver}>
        Spanning Trees
      </NavTab>
      <NavTab name={"flow"} onMouseOver={showPopOver}>
        Max-Flow
      </NavTab>
      <PopOver state={popOver} />
    </StyledNav>
  );
};

export default Navbar;

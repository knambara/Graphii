import React, { useState, useRef, useCallback } from "react";
import styled from "styled-components";
import Title from "./Title";
import NavTab from "./NavTab";
import PopOver, { PopOverState } from "./PopOver";
import { useAlgoState } from "Contexts/AlgorithmContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";

interface NavbarProps {
  onClear: () => void;
  onQuestionClick: () => void;
}

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

const ClearButton = styled("button")`
  background-color: white;
  border: none;
  border-radius: 1rem;
  color: #e94560;
  padding: 16px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  font-family: "Open sans", sans-serif;
  font-weight: 600;
  transition-duration: 0.4s;
  cursor: pointer;
  position: absolute;
  right: 50px;

  &:hover {
    background-color: #f1fa3c;
    color: #16213e;
  }
`;

const QuestionCircle = styled(FontAwesomeIcon)`
  font-size: 20px;
  cursor: pointer;
  transition: opacity 0.5s;
  position: absolute;
  right: 250px;

  &:hover {
    opacity: 0.5;
  }
`;

const popOverContent: { [string: string]: string[] } = {
  path: ["dfs", "bfs", "dijkstra", "a*"],
  tree: ["prim", "kruskal"],
  flow: ["fulkerson"],
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
      <NavTab name={"tree"} onMouseOver={showPopOver}>
        Spanning Trees
      </NavTab>
      <NavTab name={"flow"} onMouseOver={showPopOver}>
        Max-Flow
      </NavTab>
      <PopOver state={popOver} />
      <QuestionCircle
        icon={faQuestionCircle}
        color="white"
        onClick={() => props.onQuestionClick()}
      />
      <ClearButton onClick={() => props.onClear()}>Clear Canvas</ClearButton>
    </StyledNav>
  );
};

export default Navbar;

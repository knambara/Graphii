import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";

export interface PopOverState {
  name: string;
  content: string[];
  tabRef: HTMLDivElement | null;
  show: boolean;
}

interface PopOverProps {
  state: PopOverState;
}

const StyledContainer = styled("div")<{ show: boolean }>`
  position: absolute;
  opacity: ${(props) => (props.show ? 1 : 0)};
  transform-origin: center -20px;
  transform: ${(props) => (props.show ? `rotateX(0deg)` : `rotateX(-15deg)`)};
  transition: transform 0.3s, opacity 0.3s;
`;

const Content = styled("ul")<{ xCoor: number; yCoor: number }>`
  position: absolute;
  /* left: ${(props) => props.xCoor}px; */
  top: ${(props) => props.yCoor}px;
  z-index: 1;

  padding-inline-start: 0px;
  margin-block-start: 0px;
  margin-block-end: 0px;
  padding: 32px 0px;

  transform: translateX(${(props) => props.xCoor}px);
  transition: transform 0.3s, opacity 0.3s;
`;

const ContentItem = styled("li")<{}>`
  list-style-type: none;
  font-family: "Open sans", sans-serif;
  font-size: 20px;
  letter-spacing: 0.025em;
  text-transform: uppercase;
  font-weight: 600;
  padding: 8px 16px;
  color: #00b8a9;
  cursor: pointer;

  &:hover {
    background-color: #f1f1f1;
  }
`;

interface IBackGround {
  xCoor: number;
  yCoor: number;
  contentHeight: number;
  contentWidth: number;
}

const Background = styled("div")<IBackGround>`
  position: absolute;
  /* left: ${(props) => props.xCoor - 25}px; */
  top: ${(props) => props.yCoor}px;
  width: ${(props) => props.contentWidth + 100}px;
  height: ${(props) => props.contentHeight}px;

  background: white;
  border-radius: 6px;
  box-shadow: 0 50px 100px -20px rgba(50, 50, 93, 0.25),
    0 30px 60px -30px rgba(0, 0, 0, 0.3);
  transform-origin: 0 0;
  transform: translateX(${(props) => props.xCoor - 25}px);
  transition: transform 0.3s, opacity 0.3s;
`;

const Arrow = styled("div")<{ xCoor: number; yCoor: number }>`
  width: 12px;
  height: 12px;
  background: white;
  box-shadow: -3px -3px 5px rgba(80, 90, 120, 0.05);
  border-radius: 4px 0 0 0;
  transform: rotate(45deg) translateX(${(props) => props.xCoor - 25}px);
  transition: transform 0.3s, opacity 0.3s;
  will-change: transform;
`;

const PopOver: React.FC<PopOverProps> = ({ state }) => {
  const [contentRef, setContentRef] = useState<HTMLUListElement | null>(null);
  const [contentSize, setContentSize] = useState<number[]>([0, 0]);
  const [contentPos, setContentPos] = useState<number[]>([0, 0]);

  const onRefChange = useCallback(
    (node: HTMLUListElement | null): void => {
      setContentRef((prev) => node);
    },
    [setContentRef]
  );

  useEffect(() => {
    if (contentRef !== null) {
      setContentSize((prev) => [
        contentRef.offsetHeight,
        contentRef.offsetWidth,
      ]);
    }
  }, [state.tabRef, setContentSize]);

  const x = state.tabRef?.getBoundingClientRect().left;
  const y = state.tabRef?.getBoundingClientRect().top;

  return (
    <StyledContainer show={state.show} onClick={() => console.log("click")}>
      <Content ref={onRefChange} xCoor={x!} yCoor={y!}>
        {state.content.map((item, index) => (
          <ContentItem key={index}>{item}</ContentItem>
        ))}
      </Content>

      {contentRef !== null && (
        <Background
          xCoor={x!}
          yCoor={y!}
          contentHeight={contentSize[0]}
          contentWidth={contentSize[1]}
        />
      )}
    </StyledContainer>
  );
};

export default PopOver;

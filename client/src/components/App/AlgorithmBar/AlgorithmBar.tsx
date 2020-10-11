import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import Title from "Components/App/Navbar/Title";
import { useAlgoState, useAlgoDispatch } from "Contexts/AlgorithmContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStepForward,
  faStepBackward,
  faPlay,
  faPause,
  faRedo,
} from "@fortawesome/free-solid-svg-icons";

const Container = styled("div")<{ show: boolean }>`
  top: -200px;
  transform: translateY(${(props) => (props.show ? 200 : -200)}px);
  transition: transform 0.5s;
  display: flex;
  background: #00b8a9;
  padding: 10px 25px;
  align-items: center;
  width: 100%;
  position: absolute;
  z-index: 2;
`;

const TitleContainer = styled("div")`
  flex: 1;
`;

const AlgorithmTitle = styled("h2")`
  color: white;
`;

const ConfigContainer = styled("div")`
  display: flex;
  flex: 2;
  justify-content: center;
`;

const StyledIcon = styled(FontAwesomeIcon)<{ clickable: boolean }>`
  font-size: 24px;
  padding: 0px 25px;
  cursor: ${(props) => (props.clickable ? "pointer" : "cursor")};
  opacity: ${(props) => (props.clickable ? 1 : 0.5)};
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.5;
  }
`;

const Slider = styled("input")`
  -webkit-appearance: none;
  width: 150px;
  height: 15px;
  margin-left: 50px;
  border-radius: 100px;
  background: white;
  outline: none;
  -webkit-transition: 0.2s;
  transition: opacity 0.2s;

  ::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: #21e6c1;
    cursor: pointer;
  }

  ::-moz-range-thumb {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: #21e6c1;
    cursor: pointer;
  }
`;

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const MessageContainer = styled("div")<{}>`
  flex: 2;
  display: flex;
  justify-content: center;
  color: white;
  font-size: 20px;
  font-family: "Open sans", sans-serif;
  font-weight: 900;
  animation: 2s ${fadeIn};
`;

const RightContainer = styled("div")`
  flex: 1;
`;

const CancelButton = styled("button")`
  background-color: white;
  border: none;
  border-radius: 1rem;
  color: #00b8a9;
  padding: 16px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  font-family: "Open sans", sans-serif;
  font-weight: 600;
  margin: 4px 2px;
  transition-duration: 0.4s;
  cursor: pointer;

  &:hover {
    background-color: #e94560;
    color: white;
  }
`;

const AlgorithmBar: React.FC<{}> = () => {
  const algoState = useAlgoState();
  const algoDispatch = useAlgoDispatch();

  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    switch (algoState.status) {
      case "setSource": {
        setMessage((prev) => "Set source node.");
        return;
      }
      case "setTarget": {
        setMessage((prev) => "Set target node.");
        return;
      }
      case "ready": {
        setMessage((prev) => "Visualize!");
        return;
      }
    }
  }, [algoState]);

  return (
    <Container show={algoState.name !== null}>
      <TitleContainer>
        <Title>{algoState.name}</Title>
      </TitleContainer>

      <ConfigContainer>
        <StyledIcon
          icon={faStepBackward}
          color="white"
          clickable={algoState.ready && algoState.status !== "ready"}
          onClick={() => {
            if (!algoState.ready || algoState.status === "ready") return;
            algoState.status === "paused" && algoDispatch({ type: "stepB" });
          }}
        />
        <StyledIcon
          icon={
            algoState.status === "completed"
              ? faRedo
              : algoState.status === "running"
              ? faPause
              : faPlay
          }
          color="white"
          onClick={() => {
            if (!algoState.ready) return;
            algoState.status === "completed"
              ? algoDispatch({ type: "start" })
              : algoState.status === "running"
              ? algoDispatch({ type: "pause" })
              : algoDispatch({ type: "start" });
          }}
          clickable={algoState.ready}
        />
        <StyledIcon
          icon={faStepForward}
          color="white"
          clickable={algoState.ready && algoState.status !== "completed"}
          onClick={() => {
            if (!algoState.ready || algoState.status === "completed") return;
            algoState.status === "paused" && algoDispatch({ type: "stepF" });
          }}
        />
        <Slider type="range" />
      </ConfigContainer>

      <MessageContainer>{message}</MessageContainer>

      <RightContainer>
        <CancelButton onClick={() => algoDispatch({ type: "cancel" })}>
          Cancel
        </CancelButton>
      </RightContainer>
    </Container>
  );
};

export default AlgorithmBar;

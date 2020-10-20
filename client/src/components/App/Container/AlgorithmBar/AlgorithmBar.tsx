import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import Title from "Components/App/Container/Navbar/Title";
import { useAlgoState, useAlgoDispatch } from "Contexts/AlgorithmContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStepForward,
  faStepBackward,
  faPlay,
  faPause,
  faRedo,
} from "@fortawesome/free-solid-svg-icons";

const Container = styled("div")<{
  show: boolean;
  color: string;
  category: string | null;
}>`
  top: -200px;
  transform: translateY(${(props) => (props.show ? 200 : -200)}px);
  transition: transform 0.5s;
  display: flex;
  background: ${(props) => props.color};
  padding: 10px 25px;
  align-items: center;
  width: 100%;
  position: absolute;
  z-index: 2;
`;

const TitleContainer = styled("div")`
  flex: 1;
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

const MessageContainer = styled("div")`
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

const CancelButton = styled("button")<{ color: string }>`
  background-color: white;
  border: none;
  border-radius: 1rem;
  color: ${(props) => props.color};
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

const AlgorithmBar: React.FC<{ changeSpeed: (value: number) => void }> = ({
  changeSpeed,
}) => {
  const algoState = useAlgoState();
  const algoDispatch = useAlgoDispatch();

  const [message, setMessage] = useState<string>("");
  const [color, setColor] = useState<string>("");

  useEffect(() => {
    switch (algoState.status) {
      case "setSource": {
        let msg =
          algoState.category === "path"
            ? "Select start node."
            : algoState.category === "tree"
            ? "Select root node."
            : "Select source node.";
        setMessage((prev) => msg);
        return;
      }
      case "setTarget": {
        let msg =
          algoState.category === "path"
            ? "Select destination node."
            : "Select sink node.";
        setMessage((prev) => msg);
        return;
      }
      case "ready":
        setMessage((prev) => "Visualize!");
        return;
      case "running":
        setMessage("Visualize!");
        return;
      case "completed":
        setMessage(`Completed; ${algoState.value}`);
        return;
      default:
        setMessage(algoState.status!);
        return;
    }
  }, [algoState.status]);

  useEffect(() => {
    switch (algoState.category) {
      case "path":
        setColor((prev) => "#00b8a9");
        return;
      case "tree":
        setColor((prev) => "#b8de6f");
        return;
      case "flow":
        setColor((prev) => "#4c6ef5");
        return;
    }
  }, [algoState.category]);

  return (
    <Container
      show={algoState.name !== null}
      color={color}
      category={algoState.category}
    >
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
              : algoState.status === "running" ||
                algoState.status === "continuing"
              ? faPause
              : faPlay
          }
          color="white"
          onClick={() => {
            if (!algoState.ready) return;
            algoState.status === "ready" || algoState.status === "completed"
              ? algoDispatch({ type: "start" })
              : algoState.status === "running" ||
                algoState.status === "continuing"
              ? algoDispatch({ type: "pause" })
              : algoState.status === "paused" &&
                algoDispatch({ type: "continue" });
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
        <Slider
          type="range"
          min={0.5}
          max={3}
          defaultValue={1}
          step={0.01}
          onChange={(e) => changeSpeed(parseFloat(e.target.value))}
        />
      </ConfigContainer>

      <MessageContainer>{message}</MessageContainer>

      <RightContainer>
        <CancelButton
          color={color}
          onClick={() => algoDispatch({ type: "cancel" })}
        >
          Cancel
        </CancelButton>
      </RightContainer>
    </Container>
  );
};

export default AlgorithmBar;

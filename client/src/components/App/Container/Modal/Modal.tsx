import React, { useState } from "react";
import styled, { keyframes } from "styled-components";

interface ModalProps {
  isOpen: boolean;
  toggle: () => void;
}

const slideIn = keyframes`
  from {top:-700px; opacity:0} 
  to {top:125px; opacity:1}
`;

const Overlay = styled.div<{ show: boolean }>`
  display: ${(props) => (props.show ? "block" : "none")};
  position: fixed;
  z-index: 2;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
`;

const StyledModal = styled.div<{ show: boolean }>`
  display: ${(props) => (props.show ? "block" : "none")};
  position: fixed;
  left: 12.5%;
  width: 75%;
  height: 530px;
  overflow: auto;
  background-color: #f6f9fc;
  color: #16213e;
  z-index: 2;
  border-radius: 4px;
  text-align: center;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  animation: ${slideIn} 0.5s ease-out forwards;
`;

const ModalTitle = styled.h2`
  font-family: "Montserrat", sans-serif;
  font-size: 3em;
  line-height: 3em;
  height: 3em;
  margin: 0px auto;
  text-align: center;
`;

const ModalSubTitle = styled.h4`
  font-family: "Open sans", sans-serif;
  font-size: 1em;
  line-height: 1em;
  height: 1em;
  margin: 0px auto;
  text-align: center;
`;

const InstructionList = styled.ul`
  display: inline-block;
  width: 75%;
  text-align: left;
`;

const InstructionItem = styled.li`
  list-style-type: none;
  font-family: "Open sans", sans-serif;
  font-size: 1rem;
  padding: 10px 0;
`;

const Bold = styled.i`
  font-weight: bold;
`;

const Modal: React.FC<ModalProps> = ({ isOpen, toggle }) => {
  return (
    <>
      <Overlay onClick={() => toggle()} show={isOpen} />
      <StyledModal show={isOpen}>
        <ModalTitle>Welcome To Graphii</ModalTitle>
        <ModalSubTitle>
          Before you get started, here is a list of instructions on how to use
          this application.
        </ModalSubTitle>
        <InstructionList>
          <InstructionItem>
            <Bold>Add/Delete a Node</Bold>: Left click on the canvas to create a
            node. Press 'd' as you click on a node to delete.
          </InstructionItem>
          <InstructionItem>
            <Bold>Move a Node</Bold>: Hold the shift key and simply drag the
            node.
          </InstructionItem>
          <InstructionItem>
            <Bold>Add/Delete an Edge</Bold>: Press left mouse down onto a node
            and drag onto another node.
          </InstructionItem>
          <InstructionItem>
            <Bold>Edit Edge Weight</Bold>: Press 'w' to display weights. By
            default they are set as edge lengths. Click to edit.
          </InstructionItem>
          <InstructionItem>
            <Bold>Zoom the Canvas</Bold>: Scroll up and scroll down.
          </InstructionItem>
          <InstructionItem>
            <Bold>Pan the Canvas</Bold>: Drag the canvas.
          </InstructionItem>
          <InstructionItem>
            <Bold>Visualize an Algorithm</Bold>: Select an algorithm from the
            popover and follow instructions. You are able to play, pause, step,
            and change speed of an algorithm being visualized.
          </InstructionItem>
          <InstructionItem>
            <Bold>Reset Source and Targets</Bold>: Click on the algorithm title.
          </InstructionItem>
        </InstructionList>
      </StyledModal>
    </>
  );
};

export default Modal;

import React, { useRef } from "react";
import styled from "styled-components";

const StyledTab = styled.div`
  font-family: "Montserrat", sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: white;
  padding: 0 10px;
  background: none;
  transition: opacity 0.2s;
  -webkit-font-smoothing: antialiased;
  cursor: pointer;

  &:hover {
    opacity: 0.5;
  }
`;

interface NavTabProps {
  name: string;
  onMouseOver: (id: string, tabRef: HTMLDivElement | null) => void;
}

const NavTab: React.FC<NavTabProps> = (props) => {
  const navTabRef = useRef<HTMLDivElement | null>(null);

  return (
    <StyledTab
      ref={navTabRef}
      onMouseOver={() => props.onMouseOver(props.name, navTabRef.current)}
      //onMouseOut={() => props.onMouseOut()}
    >
      {props.children}
    </StyledTab>
  );
};

export default NavTab;

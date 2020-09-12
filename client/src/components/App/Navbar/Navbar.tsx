import React from "react";
import styled from "styled-components";
import Title from "./Title";

interface NavbarProps {}

const StyledNav = styled.nav`
  flex: 1;
  background: #e94560;
  padding: 10px 25px;
  display: flex;
  position: relative;
  z-index: 2;
`;

const Navbar: React.FC<NavbarProps> = (props) => {
  return (
    <StyledNav>
      <Title>Graphii</Title>
    </StyledNav>
  );
};

export default Navbar;

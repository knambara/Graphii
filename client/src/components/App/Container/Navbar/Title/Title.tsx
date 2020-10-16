import React from "react";
import styled from "styled-components";

interface TitleProps {}

const StyledTitle = styled.h1`
  color: #ffffff;
  font-family: "Montserrat", sans-serif;
  margin-top: 1em;
  margin-bottom: 1em;
  margin-right: 50px;
  font-size: 1.5em;
`;

const Title: React.FC<TitleProps> = (props) => {
  return <StyledTitle>{props.children}</StyledTitle>;
};

export default Title;

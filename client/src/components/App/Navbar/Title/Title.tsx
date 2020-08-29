import React from "react";
import styled from "styled-components";

interface TitleProps {}

const StyledTitle = styled.h1`
  color: #f6f9fc;
  font-family: "Montserrat", sans-serif;
`;

const Title: React.FC<TitleProps> = (props) => {
  return <StyledTitle>{props.children}</StyledTitle>;
};

export default Title;

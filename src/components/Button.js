import styled from "styled-components";

export default styled.button`
  border: none;
  font-family: inherit;
  font-size: inherit;
  cursor: pointer;
  padding: ${props => (props.small ? "0.5rem 1rem" : "1em 2em")};
  display: inline-block;
  text-transform: uppercase;
  letter-spacing: 1px;
  border: 4px solid ${props => props.theme.colors.buttonBg};
  color: ${props => props.theme.colors.buttonColor};
  background: ${props => props.theme.colors.buttonBg};
  transition: none;
  text-decoration: none;
  :hover {
    background: ${props => props.theme.colors.buttonBgHover};
    color: ${props => props.theme.colors.buttonColorHover};
  }
  :active {
    transform: translateY(2px);
  }
  :disabled {
    border-style: dashed;
  }
`;

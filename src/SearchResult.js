import React from "react";
import styled from "styled-components";
import { GitHubLogo } from "./components/Icons";

export function getAutofillText(result = {}, inputValue = "") {
  const normalizedInputValue = inputValue.trim().toLowerCase();
  if (!normalizedInputValue && !result) {
    return ["Type to ", "search..."];
  }
  if (!result) {
    return ["", ""];
  }
  if (!normalizedInputValue && result.name) {
    const parts = result.name.split(" ");
    return [parts[0] + " ", parts.slice(1).join(" ")];
  }
  const name = result.name || "";
  const login = result.login || "";
  const positionInName = name.toLowerCase().indexOf(normalizedInputValue);
  const positionInLogin = login.toLowerCase().indexOf(normalizedInputValue);
  const matchedProp = positionInName > -1 ? "name" : "login";
  const matchedString = result[matchedProp] || "";
  const position = positionInName > -1 ? positionInName : positionInLogin;
  const parts = matchedString.toLowerCase().split(normalizedInputValue);

  if (parts.length > 2) {
    return [parts[0], parts.slice(1).join(inputValue), matchedProp];
  } else if (position !== -1 && parts.length === 2) {
    return [parts[0], parts[1], matchedProp];
  } else if (position === 0 && parts.length === 1) {
    return [parts[0], "", matchedProp];
  } else if (position !== -1 && parts.length === 1) {
    return ["", parts[0], matchedProp];
  }
  return ["", ""];
}

const SearchInputWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SearchInputAutofill = styled.div`
  display: inline-block;
  position: absolute;
  font-size: 3em;
  font-weight: bold;
  white-space: pre;
  color: #ccc;
  left: ${props => (props.isAfter ? "100%" : undefined)};
  right: ${props => (props.isBefore ? "100%" : undefined)};
`;

const SearchInputContainer = styled.div`
  display: inline-flex;
  position: relative;
`;

const SearchResultAlt = styled.div`
  font-size: 2em;
  font-weight: bold;
  color: ${props => props.theme.colors.mutedTextColor};
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 0.5em;
`;

const SearchResultWrapper = styled.div`
  display: block;
  font-size: ${props => (props.small ? "0.8em" : "1em")};
  padding: ${props => (props.small ? "1em" : "0")};
  &:hover {
    background: ${props => props.theme.colors.secondaryBackground};
  }
`;

export const SearchResultInput = styled.div`
  display: inline-block;
  font-size: 3em;
  font-weight: bold;
  outline: 0;
  min-height: 1em;
  color: ${props => props.theme.colors.lightBlue};

  @keyframes flash {
    from,
    50%,
    to {
      opacity: 1;
    }
    25%,
    75% {
      opacity: 0;
    }
  }
  &::selection {
    background: #f6ff6d;
  }
  &:empty:focus::after {
    content: " ";
    position: absolute;
    right: 2px;
    height: 100%;
    border-right: 5px solid ${props => props.theme.colors.lightBlue};
    animation-duration: 2s;
    animation-fill-mode: both;
    animation-name: flash;
    animation-iteration-count: infinite;
  }
  &:empty {
    color: transparent;
  }
`;

const SearchResult = ({
  result,
  inputValue,
  children,
  showDetails,
  ...rest
}) => {
  const [beforeText, afterText] = getAutofillText(result, inputValue);
  return (
    <SearchResultWrapper {...rest}>
      <SearchInputWrapper>
        <SearchInputContainer>
          <SearchInputAutofill isBefore>
            {beforeText.replace(/ /g, "\u00a0")}
          </SearchInputAutofill>
          {children}
          <SearchInputAutofill isAfter>
            {afterText.replace(/ /g, "\u00a0")}
          </SearchInputAutofill>
        </SearchInputContainer>
      </SearchInputWrapper>
      {result &&
        showDetails && (
          <SearchResultAlt>
            <GitHubLogo width="24" height="24" />
            <code>/{result.login}</code>{" "}
            {result.name ? `\u00a0· ${result.name}` : ""}
          </SearchResultAlt>
        )}
    </SearchResultWrapper>
  );
};

export default SearchResult;

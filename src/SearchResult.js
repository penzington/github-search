import React from "react";
import styled from "styled-components";

const SEARCH_COLOR = `#2196f3`;

function getAutofillText(result = "", inputValue = "") {
  const normalizedInputValue = inputValue.trim().toLowerCase();
  if (!normalizedInputValue) {
    return ["", "Type to search..."];
  }
  if (!result) {
    return ["", ""];
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
  color: #ccc;
  white-space: nowrap;
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
  color: #ccc;
  text-align: center;
`;
const SearchResultWrapper = styled.div`
  display: block;
  margin-bottom: 2em;
  font-size: ${props => (props.small ? "0.8em" : "1em")};
`;

export const SearchResultInput = styled.div`
  display: inline-block;
  font-size: 3em;
  font-weight: bold;
  outline: 0;
  color: ${SEARCH_COLOR};

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

  &:empty:focus::after {
    content: " ";
    position: absolute;
    right: 2px;
    height: 100%;
    border-right: 5px solid ${SEARCH_COLOR};
    animation-duration: 2s;
    animation-fill-mode: both;
    animation-name: flash;
    animation-iteration-count: infinite;
  }
  &:empty {
    color: transparent;
  }
`;

const SearchResult = ({ result, inputValue, children, ...rest }) => {
  const [beforeText, afterText] = getAutofillText(result, inputValue);
  return (
    <SearchResultWrapper {...rest}>
      <SearchInputWrapper>
        <SearchInputContainer>
          <SearchInputAutofill isBefore>{beforeText}</SearchInputAutofill>
          {children}
          <SearchInputAutofill isAfter>{afterText}</SearchInputAutofill>
        </SearchInputContainer>
      </SearchInputWrapper>
      {result && (
        <SearchResultAlt>
          <code>github.com/{result.login}</code>{" "}
          {result.name ? `· ${result.name}` : ""}
        </SearchResultAlt>
      )}
    </SearchResultWrapper>
  );
};

export default SearchResult;

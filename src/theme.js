import { mediaQuery } from "styled-media-queries";

export default {
  colors: {
    darkBlue: "#005bea",
    lightBlue: "#00c6fb",
    secondaryBackground: "#eee",
    mutedTextColor: "#bbb",
    buttonBg: "#005bea",
    buttonBgHover: "transparent",
    buttonColor: "#fff",
    buttonColorHover: "#fff"
  }
};

const breakpoint = {
  medium: 666,
  large: 888,
  wide: 999,
  extraWide: 1111
};

export const media = {
  smallOnly: mediaQuery`(max-width: ${(breakpoint.medium - 1) / 16}em)`,
  medium: mediaQuery`(min-width: ${breakpoint.medium / 16}em)`,
  large: mediaQuery`(min-width: ${breakpoint.large / 16}em)`,
  wide: mediaQuery`(min-width: ${breakpoint.wide / 16}em)`,
  extraWide: mediaQuery`(min-width: ${breakpoint.extraWide / 16}em)`,
  tall: mediaQuery`(min-height: 900px)`
};

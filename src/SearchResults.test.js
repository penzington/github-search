import { getAutofillText } from "./SearchResult";

const r = (name, login) => ({ name, login });

describe("Extracting the autofill info for a result and search query", () => {
  it("empty state returns a placeholder", () => {
    expect(getAutofillText(null, "")).toEqual(["Type to ", "search..."]);
  });

  it("works for value matched on name", () => {
    expect(getAutofillText(r("Hello", "helloworld"), "hell")).toEqual([
      "",
      "o",
      "name"
    ]);
  });

  it("works for value matched on login", () => {
    expect(getAutofillText(r("Some guy", "helloworld"), "hell")).toEqual([
      "",
      "oworld",
      "login"
    ]);
  });

  it("works for value matched on name, in the middle", () => {
    expect(getAutofillText(r("Some guy", "justauser"), "me")).toEqual([
      "so",
      " guy",
      "name"
    ]);
  });

  it("works for value matched on login, at the end", () => {
    expect(getAutofillText(r("Some guy", "justauser"), "user")).toEqual([
      "justa",
      "",
      "login"
    ]);
  });

  it("works for value with non-trimmed whitespace", () => {
    expect(getAutofillText(r("Some guy", "justauser"), "  user  ")).toEqual([
      "justa",
      "",
      "login"
    ]);
  });

  it("works for value with different casing", () => {
    expect(getAutofillText(r("Some guy", "justauser"), "GUY")).toEqual([
      "some ",
      "",
      "name"
    ]);
  });

  it("works for multiple matches, splitting on first match", () => {
    expect(
      getAutofillText(r("Some guy guy guy just a guy", "justauser"), "guy")
    ).toEqual(["some ", " guy guy just a guy", "name"]);
  });

  it("works for a response, but no search query (splits on the first space)", () => {
    expect(getAutofillText(r("John Doe", "johndoe"), "")).toEqual([
      "John ",
      "Doe"
    ]);
  });
});

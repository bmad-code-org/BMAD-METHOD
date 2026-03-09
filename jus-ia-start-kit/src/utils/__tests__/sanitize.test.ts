import { describe, it, expect } from "vitest";
import { sanitizeText, validateSelect } from "../sanitize.js";

describe("sanitizeText", () => {
  it("strips HTML tags", () => {
    expect(sanitizeText("<b>bold</b> text")).toBe("bold text");
  });
  it("trims whitespace", () => {
    expect(sanitizeText("  hello  ")).toBe("hello");
  });
  it("caps at MAX_INPUT_LENGTH", () => {
    const long = "a".repeat(600);
    expect(sanitizeText(long).length).toBe(500);
  });
  it("handles empty string", () => {
    expect(sanitizeText("")).toBe("");
  });
  it("passes through clean text", () => {
    expect(sanitizeText("Texto limpo")).toBe("Texto limpo");
  });
  it("strips nested HTML", () => {
    expect(sanitizeText("<div><p>test</p></div>")).toBe("test");
  });
});

describe("validateSelect", () => {
  const options = ["CLT", "PJ", "Autônomo"];
  it("returns true for valid option", () => {
    expect(validateSelect("CLT", options)).toBe(true);
  });
  it("returns false for invalid option", () => {
    expect(validateSelect("Outro", options)).toBe(false);
  });
  it("returns false for empty string", () => {
    expect(validateSelect("", options)).toBe(false);
  });
});

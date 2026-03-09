import { describe, it, expect } from "vitest";
import { buildRedirectUrl, getJusIaDirectUrl } from "../url-builder.js";

describe("buildRedirectUrl", () => {
  it("builds correct URL with encoded prompt", () => {
    const url = buildRedirectUrl("teste prompt");
    expect(url).toContain("https://ia.jusbrasil.com.br/conversa?q=");
    expect(url).toContain("teste%20prompt");
    expect(url.endsWith("&send")).toBe(true);
  });

  it("encodes special characters", () => {
    const url = buildRedirectUrl("art. 59 da CLT (limite)");
    expect(url).toContain(encodeURIComponent("art. 59 da CLT (limite)"));
  });
});

describe("getJusIaDirectUrl", () => {
  it("returns base Jus IA URL", () => {
    expect(getJusIaDirectUrl()).toBe("https://ia.jusbrasil.com.br/conversa");
  });
});

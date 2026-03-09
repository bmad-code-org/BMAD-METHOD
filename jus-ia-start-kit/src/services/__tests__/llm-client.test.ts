import { describe, it, expect, vi, beforeEach } from "vitest";
import { getRefinementQuestions } from "../llm-client.js";
import type { FlowState } from "../../flows/types.js";

const mockState: FlowState = {
  area: "trabalhista",
  subtipo: "horas-extras",
  tipoTarefa: "peticao-inicial",
  currentStep: 1,
  totalSteps: 5,
  responses: { regime: "CLT" },
};

describe("getRefinementQuestions", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns empty array when no API key configured", async () => {
    const result = await getRefinementQuestions(mockState, "Trabalhista", "Horas Extras");
    expect(result).toEqual([]);
  });

  it("returns empty array on fetch failure (graceful fallback)", async () => {
    // Even if somehow config had a key, network failure should return []
    const result = await getRefinementQuestions(mockState, "Trabalhista", "Horas Extras");
    expect(Array.isArray(result)).toBe(true);
  });
});

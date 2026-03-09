import { describe, it, expect } from "vitest";
import { buildPrompt } from "../prompt-builder.js";
import type { FlowConfig, FlowState } from "../../flows/types.js";

const mockFlow: FlowConfig = {
  area: "trabalhista",
  areaLabel: "Trabalhista",
  subtipo: "horas-extras",
  subtipoLabel: "Horas Extras",
  tipoTarefa: "peticao-inicial",
  steps: [],
  promptTemplate: "Regime: {{regime}}, Jornada: {{jornada_contratual}}, Extra: {{horas_extras_semana}}",
  legalReferences: ["art. 59 CLT"],
};

const mockState: FlowState = {
  area: "trabalhista",
  subtipo: "horas-extras",
  tipoTarefa: "peticao-inicial",
  currentStep: 2,
  totalSteps: 5,
  responses: {
    regime: "CLT",
    jornada_contratual: "44h semanais",
    horas_extras_semana: "5 a 10 horas",
  },
};

describe("buildPrompt", () => {
  it("interpolates template variables", () => {
    const result = buildPrompt(mockFlow, mockState);
    expect(result.text).toContain("CLT");
    expect(result.text).toContain("44h semanais");
    expect(result.text).toContain("5 a 10 horas");
    expect(result.text).not.toContain("{{");
  });

  it("returns legal references", () => {
    const result = buildPrompt(mockFlow, mockState);
    expect(result.legalReferences).toEqual(["art. 59 CLT"]);
  });

  it("calculates char count", () => {
    const result = buildPrompt(mockFlow, mockState);
    expect(result.charCount).toBe(result.text.length);
  });

  it("determines fitsInUrl correctly for short prompt", () => {
    const result = buildPrompt(mockFlow, mockState);
    expect(result.fitsInUrl).toBe(true);
    expect(result.encodedUrl).toBeDefined();
  });

  it("determines fitsInUrl correctly for long prompt", () => {
    const longFlow = {
      ...mockFlow,
      promptTemplate: "A".repeat(2000),
    };
    const result = buildPrompt(longFlow, mockState);
    expect(result.fitsInUrl).toBe(false);
    expect(result.encodedUrl).toBeUndefined();
  });

  it("removes unreplaced variables", () => {
    const flowWithExtra = {
      ...mockFlow,
      promptTemplate: "{{regime}} - {{campo_inexistente}}",
    };
    const result = buildPrompt(flowWithExtra, mockState);
    expect(result.text).not.toContain("{{campo_inexistente}}");
    expect(result.text).toContain("CLT");
  });

  it("handles array responses by joining with comma", () => {
    const stateWithArray = {
      ...mockState,
      responses: { ...mockState.responses, provas: ["Doc1", "Doc2"] },
    };
    const flowWithArray = {
      ...mockFlow,
      promptTemplate: "Provas: {{provas}}",
    };
    const result = buildPrompt(flowWithArray, stateWithArray);
    expect(result.text).toContain("Doc1, Doc2");
  });
});

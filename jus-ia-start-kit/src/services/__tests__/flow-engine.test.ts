import { describe, it, expect } from "vitest";
import { calculateTotalSteps, getVisualStep, isStepComplete } from "../flow-engine.js";
import type { FlowConfig, FlowStep } from "../../flows/types.js";

const mockFlow: FlowConfig = {
  area: "trabalhista",
  areaLabel: "Trabalhista",
  subtipo: "horas-extras",
  subtipoLabel: "Horas Extras",
  tipoTarefa: "peticao-inicial",
  steps: [
    { stepNumber: 1, title: "Step 1", groups: [], requiresLlm: false },
    { stepNumber: 2, title: "Step 2", groups: [], requiresLlm: true },
  ],
  promptTemplate: "",
  legalReferences: [],
};

describe("calculateTotalSteps", () => {
  it("includes selection screens when no deep link", () => {
    expect(calculateTotalSteps(mockFlow, false)).toBe(5); // 2 selection + 2 flow + 1 preview
  });

  it("excludes selection screens with deep link", () => {
    expect(calculateTotalSteps(mockFlow, true)).toBe(3); // 0 selection + 2 flow + 1 preview
  });
});

describe("getVisualStep", () => {
  it("adds offset for non-deep-link", () => {
    expect(getVisualStep(mockFlow, 1, false)).toBe(3); // offset 2 + step 1
  });

  it("no offset for deep link", () => {
    expect(getVisualStep(mockFlow, 1, true)).toBe(1);
  });
});

describe("isStepComplete", () => {
  const step: FlowStep = {
    stepNumber: 1,
    title: "Test",
    requiresLlm: false,
    groups: [
      {
        title: "Group 1",
        questions: [
          { id: "q1", text: "Question 1", type: "select", options: ["A", "B"], required: true },
          { id: "q2", text: "Question 2", type: "text", required: false },
        ],
      },
    ],
  };

  it("returns true when all required questions answered", () => {
    expect(isStepComplete(step, { q1: "A" })).toBe(true);
  });

  it("returns false when required question missing", () => {
    expect(isStepComplete(step, {})).toBe(false);
  });

  it("returns false when required answer is empty", () => {
    expect(isStepComplete(step, { q1: "" })).toBe(false);
  });

  it("returns true when optional question missing", () => {
    expect(isStepComplete(step, { q1: "A" })).toBe(true);
  });
});

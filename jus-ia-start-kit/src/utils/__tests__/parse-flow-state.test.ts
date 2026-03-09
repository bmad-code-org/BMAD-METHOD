import { describe, it, expect } from "vitest";
import { parseFlowState, serializeFlowState } from "../parse-flow-state.js";

describe("parseFlowState", () => {
  it("parses basic form body", () => {
    const state = parseFlowState({
      _area: "trabalhista",
      _subtipo: "horas-extras",
      _tipo_tarefa: "peticao-inicial",
      _step: "1",
      _total_steps: "5",
      _responses: "{}",
      regime: "CLT",
    });
    expect(state.area).toBe("trabalhista");
    expect(state.subtipo).toBe("horas-extras");
    expect(state.currentStep).toBe(1);
    expect(state.responses.regime).toBe("CLT");
  });

  it("merges existing responses with new ones", () => {
    const state = parseFlowState({
      _area: "trabalhista",
      _subtipo: "horas-extras",
      _step: "2",
      _total_steps: "5",
      _responses: JSON.stringify({ regime: "CLT", jornada: "44h" }),
      testemunhas: "Sim",
    });
    expect(state.responses.regime).toBe("CLT");
    expect(state.responses.jornada).toBe("44h");
    expect(state.responses.testemunhas).toBe("Sim");
  });

  it("handles invalid JSON in _responses", () => {
    const state = parseFlowState({
      _area: "civel",
      _subtipo: "cobranca",
      _step: "1",
      _total_steps: "4",
      _responses: "invalid-json",
      campo: "valor",
    });
    expect(state.responses.campo).toBe("valor");
  });

  it("handles empty body gracefully", () => {
    const state = parseFlowState({});
    expect(state.area).toBe("");
    expect(state.currentStep).toBe(1);
    expect(Object.keys(state.responses)).toHaveLength(0);
  });

  it("sanitizes input values", () => {
    const state = parseFlowState({
      _area: "trabalhista",
      _subtipo: "test",
      _step: "1",
      _total_steps: "3",
      _responses: "{}",
      campo: "<script>alert('xss')</script>Hello",
    });
    expect(state.responses.campo).toBe("alert('xss')Hello");
  });

  it("handles array values", () => {
    const state = parseFlowState({
      _area: "trabalhista",
      _subtipo: "test",
      _step: "1",
      _total_steps: "3",
      _responses: "{}",
      provas: ["Doc1", "Doc2"],
    });
    expect(state.responses.provas).toEqual(["Doc1", "Doc2"]);
  });
});

describe("serializeFlowState", () => {
  it("serializes responses to JSON", () => {
    const json = serializeFlowState({
      area: "trabalhista",
      subtipo: "horas-extras",
      tipoTarefa: "peticao-inicial",
      currentStep: 1,
      totalSteps: 5,
      responses: { regime: "CLT", jornada: "44h" },
    });
    const parsed = JSON.parse(json);
    expect(parsed.regime).toBe("CLT");
    expect(parsed.jornada).toBe("44h");
  });
});

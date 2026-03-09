import type { FlowState } from "../flows/types.js";
import { sanitizeText } from "./sanitize.js";

/** Parse FlowState from form body hidden fields */
export function parseFlowState(body: Record<string, unknown>): FlowState {
  const responses: Record<string, string | string[]> = {};

  // Parse _responses JSON from hidden field
  if (typeof body._responses === "string" && body._responses) {
    try {
      const parsed = JSON.parse(body._responses);
      if (typeof parsed === "object" && parsed !== null) {
        for (const [key, value] of Object.entries(parsed)) {
          if (typeof value === "string") {
            responses[key] = sanitizeText(value);
          } else if (Array.isArray(value)) {
            responses[key] = value.map((v) => sanitizeText(String(v)));
          }
        }
      }
    } catch {
      // Invalid JSON, skip
    }
  }

  // Merge current step's new responses
  for (const [key, value] of Object.entries(body)) {
    if (key.startsWith("_")) continue; // Skip internal fields
    if (typeof value === "string") {
      responses[key] = sanitizeText(value);
    } else if (Array.isArray(value)) {
      responses[key] = value.map((v) => sanitizeText(String(v)));
    }
  }

  return {
    area: sanitizeText(String(body._area || "")),
    subtipo: sanitizeText(String(body._subtipo || "")),
    tipoTarefa: sanitizeText(String(body._tipo_tarefa || "")),
    currentStep: parseInt(String(body._step || "1"), 10),
    totalSteps: parseInt(String(body._total_steps || "5"), 10),
    responses,
  };
}

/** Serialize FlowState to hidden form fields */
export function serializeFlowState(state: FlowState): string {
  return JSON.stringify(state.responses);
}

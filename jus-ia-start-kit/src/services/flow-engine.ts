import type { FlowConfig, FlowState, FlowStep } from "../flows/types.js";
import { getFlow } from "../config/flows.js";

/** Get the current step configuration for a flow state */
export function getCurrentStep(state: FlowState): FlowStep | null {
  const flow = getFlow(state.area, state.subtipo);
  if (!flow) return null;

  const step = flow.steps.find((s) => s.stepNumber === state.currentStep);
  return step ?? null;
}

/** Get the full flow config */
export function getFlowConfig(area: string, subtipo: string): FlowConfig | null {
  return getFlow(area, subtipo) ?? null;
}

/** Calculate total steps: selection screens + flow steps + preview */
export function calculateTotalSteps(flow: FlowConfig, hasDeepLink: boolean): number {
  const selectionSteps = hasDeepLink ? 0 : 2; // tipo+area, subtipo
  const flowSteps = flow.steps.length;
  const previewStep = 1;
  return selectionSteps + flowSteps + previewStep;
}

/** Determine the visual step number for the progress indicator */
export function getVisualStep(
  flow: FlowConfig,
  currentFlowStep: number,
  hasDeepLink: boolean,
): number {
  const offset = hasDeepLink ? 0 : 2;
  return offset + currentFlowStep;
}

/** Check if all required questions in a step are answered */
export function isStepComplete(step: FlowStep, responses: Record<string, string | string[]>): boolean {
  for (const group of step.groups) {
    for (const question of group.questions) {
      if (question.required) {
        const answer = responses[question.id];
        if (!answer || (typeof answer === "string" && !answer.trim())) {
          return false;
        }
      }
    }
  }
  return true;
}

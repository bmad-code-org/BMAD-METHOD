import type { FastifyInstance } from "fastify";
import { getFlow, flowExists, getAllFlows } from "../config/flows.js";
import { getCurrentStep, calculateTotalSteps, getVisualStep } from "../services/flow-engine.js";
import { buildPrompt } from "../services/prompt-builder.js";
import { getJusIaDirectUrl } from "../services/url-builder.js";
import { getRefinementQuestions } from "../services/llm-client.js";
import { parseFlowState, serializeFlowState } from "../utils/parse-flow-state.js";
import type { FlowState, QuestionGroup } from "../flows/types.js";

export async function flowRoutes(app: FastifyInstance): Promise<void> {
  // POST /:area/iniciar — Start a flow after subtipo selection
  app.post<{ Params: { area: string }; Body: Record<string, string> }>(
    "/:area/iniciar",
    async (request, reply) => {
      const { area } = request.params;
      const subtipo = request.body.subtipo;
      const tipoTarefa = request.body._tipo_tarefa || "peticao-inicial";

      if (!flowExists(area, subtipo)) {
        return reply.view("pages/not-available.njk", {
          availableFlows: getAllFlows(),
        });
      }

      const flow = getFlow(area, subtipo)!;
      const totalSteps = calculateTotalSteps(flow, false);

      const flowState: FlowState = {
        area,
        subtipo,
        tipoTarefa,
        currentStep: 1,
        totalSteps,
        responses: {},
      };

      const step = flow.steps[0];
      if (!step) {
        return reply.view("pages/error.njk", {
          errorMessage: "Fluxo sem perguntas configuradas.",
          retryable: true,
          retryUrl: "/",
        });
      }

      return reply.view("pages/flow-step.njk", {
        stepTitle: step.title,
        flowLabel: `${flow.areaLabel} — ${flow.subtipoLabel}`,
        groups: step.groups,
        flowState,
        serializedResponses: serializeFlowState(flowState),
        formAction: `/${area}/${subtipo}/step/1`,
        backHref: "/",
        isLastStep: flow.steps.length === 1,
        currentVisualStep: getVisualStep(flow, 1, false),
        totalSteps,
      });
    },
  );

  // GET /:area/:subtipo — Deep link entry (skip selection)
  app.get<{ Params: { area: string; subtipo: string } }>(
    "/:area/:subtipo",
    async (request, reply) => {
      const { area, subtipo } = request.params;

      if (!flowExists(area, subtipo)) {
        return reply.view("pages/not-available.njk", {
          availableFlows: getAllFlows(),
        });
      }

      const flow = getFlow(area, subtipo)!;
      const totalSteps = calculateTotalSteps(flow, true);

      const flowState: FlowState = {
        area,
        subtipo,
        tipoTarefa: flow.tipoTarefa,
        currentStep: 1,
        totalSteps,
        responses: {},
      };

      const step = flow.steps[0]!;

      return reply.view("pages/flow-step.njk", {
        stepTitle: step.title,
        flowLabel: `${flow.areaLabel} — ${flow.subtipoLabel}`,
        groups: step.groups,
        flowState,
        serializedResponses: serializeFlowState(flowState),
        formAction: `/${area}/${subtipo}/step/1`,
        backHref: "/",
        isLastStep: flow.steps.length === 1,
        currentVisualStep: getVisualStep(flow, 1, true),
        totalSteps,
      });
    },
  );

  // POST /:area/:subtipo/step/:stepNumber — Handle step submission
  app.post<{ Params: { area: string; subtipo: string; stepNumber: string }; Body: Record<string, unknown> }>(
    "/:area/:subtipo/step/:stepNumber",
    async (request, reply) => {
      const { area, subtipo, stepNumber } = request.params;
      const currentStepNum = parseInt(stepNumber, 10);

      const flow = getFlow(area, subtipo);
      if (!flow) {
        return reply.view("pages/not-available.njk", {
          availableFlows: getAllFlows(),
        });
      }

      // Parse accumulated state + new responses
      const flowState = parseFlowState(request.body as Record<string, unknown>);
      flowState.area = area;
      flowState.subtipo = subtipo;

      const hasDeepLink = flowState.totalSteps < 5; // Heuristic: deep link has fewer total steps
      const nextStepNum = currentStepNum + 1;
      const nextStep = flow.steps.find((s) => s.stepNumber === nextStepNum);

      // If there's a next step, render it
      if (nextStep) {
        flowState.currentStep = nextStepNum;

        // If next step requires LLM, get refinement questions
        let groups: QuestionGroup[] = nextStep.groups;
        if (nextStep.requiresLlm) {
          const refinementQuestions = await getRefinementQuestions(
            flowState,
            flow.areaLabel,
            flow.subtipoLabel,
          );
          if (refinementQuestions.length > 0) {
            // Add LLM questions to the existing groups
            groups = [
              ...nextStep.groups,
              {
                title: "Perguntas específicas do seu caso",
                questions: refinementQuestions.map((q) => ({
                  ...q,
                  required: true,
                })),
              },
            ];
          }
        }

        return reply.view("pages/flow-step.njk", {
          stepTitle: nextStep.title,
          flowLabel: `${flow.areaLabel} — ${flow.subtipoLabel}`,
          groups,
          flowState,
          serializedResponses: serializeFlowState(flowState),
          formAction: `/${area}/${subtipo}/step/${nextStepNum}`,
          backHref: `/${area}/${subtipo}/step/${currentStepNum - 1}`,
          isLastStep: !flow.steps.find((s) => s.stepNumber === nextStepNum + 1),
          currentVisualStep: getVisualStep(flow, nextStepNum, hasDeepLink),
          totalSteps: flowState.totalSteps,
        });
      }

      // No more steps — build prompt and show preview
      const prompt = buildPrompt(flow, flowState);

      return reply.view("pages/preview.njk", {
        flowLabel: `uma ${flow.subtipoLabel.toLowerCase()} ${flow.areaLabel.toLowerCase()}`,
        promptText: prompt.text,
        legalReferences: prompt.legalReferences,
        fitsInUrl: prompt.fitsInUrl,
        encodedUrl: prompt.encodedUrl,
        jusIaUrl: getJusIaDirectUrl(),
        currentVisualStep: flowState.totalSteps,
        totalSteps: flowState.totalSteps,
      });
    },
  );

  // GET /health — Health check
  app.get("/health", async () => {
    return { status: "ok" };
  });
}

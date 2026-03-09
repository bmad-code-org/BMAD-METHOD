import type { FlowConfig } from "../flows/types.js";
import { horasExtrasFlow } from "../flows/trabalhista/horas-extras.js";

/** Registry of all available flows */
const flowRegistry: Map<string, FlowConfig> = new Map();

function registerFlow(flow: FlowConfig): void {
  const key = `${flow.area}/${flow.subtipo}`;
  flowRegistry.set(key, flow);
}

// Register all flows
registerFlow(horasExtrasFlow);
// TODO: Register remaining 9 flows as they are built

/** Get a flow by area/subtipo */
export function getFlow(area: string, subtipo: string): FlowConfig | undefined {
  return flowRegistry.get(`${area}/${subtipo}`);
}

/** Get all flows for an area */
export function getFlowsByArea(area: string): FlowConfig[] {
  const flows: FlowConfig[] = [];
  for (const [key, flow] of flowRegistry) {
    if (key.startsWith(`${area}/`)) {
      flows.push(flow);
    }
  }
  return flows;
}

/** Get all available areas */
export function getAreas(): Array<{ value: string; label: string }> {
  const areas = new Map<string, string>();
  for (const flow of flowRegistry.values()) {
    areas.set(flow.area, flow.areaLabel);
  }
  return Array.from(areas, ([value, label]) => ({ value, label }));
}

/** Get all available task types */
export function getTiposTarefa(): Array<{ value: string; label: string }> {
  return [
    { value: "peticao-inicial", label: "Petição Inicial" },
    { value: "contestacao", label: "Contestação" },
    { value: "pesquisa-jurisprudencia", label: "Pesquisa de Jurisprudência" },
    { value: "parecer", label: "Parecer Jurídico" },
    { value: "contrato", label: "Contrato" },
  ];
}

/** Check if a flow exists */
export function flowExists(area: string, subtipo: string): boolean {
  return flowRegistry.has(`${area}/${subtipo}`);
}

/** Get all registered flows */
export function getAllFlows(): FlowConfig[] {
  return Array.from(flowRegistry.values());
}

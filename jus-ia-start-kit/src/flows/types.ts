/** A single question in a flow step */
export interface FlowQuestion {
  id: string;
  text: string;
  type: "select" | "multiselect" | "text" | "date";
  options?: string[];
  placeholder?: string;
  required: boolean;
}

/** A group of questions displayed together (mental moment) */
export interface QuestionGroup {
  title: string;
  questions: FlowQuestion[];
}

/** A single step in a flow */
export interface FlowStep {
  stepNumber: number;
  title: string;
  groups: QuestionGroup[];
  requiresLlm: boolean;
}

/** Complete flow configuration for a legal subtype */
export interface FlowConfig {
  area: string;
  areaLabel: string;
  subtipo: string;
  subtipoLabel: string;
  tipoTarefa: string;
  steps: FlowStep[];
  promptTemplate: string;
  legalReferences: string[];
}

/** Accumulated state across MPA pages */
export interface FlowState {
  area: string;
  subtipo: string;
  tipoTarefa: string;
  currentStep: number;
  totalSteps: number;
  responses: Record<string, string | string[]>;
}

/** Parsed LLM refinement response */
export interface RefinementQuestion {
  id: string;
  text: string;
  type: "select" | "multiselect" | "text";
  options?: string[];
  placeholder?: string;
}

/** Assembled prompt ready for delivery */
export interface AssembledPrompt {
  text: string;
  legalReferences: string[];
  charCount: number;
  fitsInUrl: boolean;
  encodedUrl?: string;
}

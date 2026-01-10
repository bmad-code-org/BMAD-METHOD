/**
 * BMAD Core Types
 */

// Agent Types
export interface AgentMetadata {
  id: string;
  name: string;
  title: string;
  icon?: string;
  module: string;
  version?: string;
}

export interface AgentPersona {
  role: string;
  identity?: string;
  communicationStyle: string;
  principles?: string[];
  expertise?: string[];
}

export interface AgentMenuItem {
  trigger: string;
  exec?: string;
  description: string;
  requiresContext?: string[];
  fuzzyMatch?: boolean;
}

export interface AgentDefinition {
  metadata: AgentMetadata;
  persona: AgentPersona;
  menu: AgentMenuItem[];
  prompts: Record<string, string>;
  sidecars?: string[];
}

// Workflow Types
export interface WorkflowMetadata {
  id: string;
  name: string;
  description: string;
  module: string;
  phase: WorkflowPhase;
  estimatedTime?: string;
  complexity?: number[];
}

export type WorkflowPhase =
  | 'analysis'
  | 'planning'
  | 'solutioning'
  | 'implementation';

export interface WorkflowStep {
  id: string;
  number: number;
  name: string;
  description: string;
  instruction: string;
  expectedOutput?: string;
  validation?: WorkflowStepValidation;
}

export interface WorkflowStepValidation {
  required?: string[];
  format?: string;
  minLength?: number;
}

export interface WorkflowDefinition {
  metadata: WorkflowMetadata;
  steps: WorkflowStep[];
  outputs?: WorkflowOutput[];
}

export interface WorkflowOutput {
  name: string;
  type: ArtifactType;
  template?: string;
}

// Module Types
export interface ModuleDefinition {
  id: string;
  name: string;
  description: string;
  version?: string;
  agents: string[];
  workflows: string[];
  dependencies?: string[];
}

// Artifact Types
export type ArtifactType =
  | 'prd'
  | 'architecture'
  | 'epic'
  | 'story'
  | 'spec'
  | 'diagram'
  | 'tech-spec'
  | 'test-plan'
  | 'retrospective'
  | 'custom';

export interface Artifact {
  id: string;
  projectId: string;
  type: ArtifactType;
  name: string;
  content: string;
  version: number;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

// Project Types
export type ComplexityLevel = 0 | 1 | 2 | 3 | 4;

export type ProjectStatus =
  | 'draft'
  | 'analysis'
  | 'planning'
  | 'solutioning'
  | 'implementation'
  | 'completed'
  | 'archived';

export interface Project {
  id: string;
  name: string;
  description?: string;
  complexityLevel: ComplexityLevel;
  selectedModules: string[];
  status: ProjectStatus;
  config?: ProjectConfig;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectConfig {
  communicationLanguage?: string;
  outputFolder?: string;
  userSkillLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  customSettings?: Record<string, unknown>;
}

// Conversation Types
export interface Message {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  agentId?: string;
  metadata?: MessageMetadata;
  timestamp: Date;
}

export interface MessageMetadata {
  workflowStep?: string;
  action?: string;
  artifacts?: string[];
  suggestedActions?: SuggestedAction[];
  context?: Record<string, unknown>;
}

export interface SuggestedAction {
  label: string;
  action: string;
  primary?: boolean;
  disabled?: boolean;
}

export interface Conversation {
  id: string;
  projectId: string;
  agentId: string;
  messages: Message[];
  context: ConversationContext;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConversationContext {
  workflowId?: string;
  workflowStep?: number;
  artifacts?: string[];
  variables?: Record<string, unknown>;
}

// Workflow Instance Types
export type WorkflowInstanceStatus =
  | 'pending'
  | 'active'
  | 'paused'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface WorkflowInstance {
  id: string;
  projectId: string;
  workflowId: string;
  currentStep: number;
  totalSteps: number;
  status: WorkflowInstanceStatus;
  stepOutputs: Record<string, unknown>;
  conversationId?: string;
  startedAt: Date;
  completedAt?: Date;
  error?: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences: UserPreferences;
  createdAt: Date;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  communicationStyle: 'technical' | 'simple' | 'balanced';
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  notifications?: NotificationPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  workflowUpdates: boolean;
  agentMessages: boolean;
}

// API Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ApiMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ApiMeta {
  page?: number;
  pageSize?: number;
  total?: number;
  hasMore?: boolean;
}

// Event Types
export type WebSocketEventType =
  | 'agent:message'
  | 'agent:typing'
  | 'workflow:progress'
  | 'workflow:completed'
  | 'artifact:created'
  | 'artifact:updated'
  | 'project:updated'
  | 'error';

export interface WebSocketEvent<T = unknown> {
  type: WebSocketEventType;
  payload: T;
  timestamp: string;
}

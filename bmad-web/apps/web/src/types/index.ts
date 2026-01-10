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
}

// Project Types
export interface Project {
  id: string;
  name: string;
  description?: string;
  complexityLevel: ComplexityLevel;
  selectedModules: string[];
  activeWorkflow?: string;
  artifacts: Artifact[];
  status: ProjectStatus;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export type ComplexityLevel = 0 | 1 | 2 | 3 | 4;

export type ProjectStatus =
  | 'draft'
  | 'analysis'
  | 'planning'
  | 'solutioning'
  | 'implementation'
  | 'completed';

// Agent Types
export interface Agent {
  id: string;
  name: string;
  title: string;
  icon: string;
  module: string;
  persona: AgentPersona;
  menu: AgentMenuItem[];
  prompts: Record<string, string>;
}

export interface AgentPersona {
  role: string;
  identity?: string;
  communicationStyle: string;
  principles?: string[];
}

export interface AgentMenuItem {
  trigger: string;
  exec?: string;
  description: string;
  requiresContext?: string[];
}

// Conversation Types
export interface Conversation {
  id: string;
  projectId: string;
  agentId: string;
  messages: Message[];
  context: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  metadata?: MessageMetadata;
  timestamp: Date;
}

export interface MessageMetadata {
  workflowStep?: string;
  action?: string;
  artifacts?: string[];
  suggestedActions?: SuggestedAction[];
}

export interface SuggestedAction {
  label: string;
  action: string;
  primary?: boolean;
}

// Workflow Types
export interface Workflow {
  id: string;
  name: string;
  description: string;
  module: string;
  phase: WorkflowPhase;
  steps: WorkflowStep[];
  estimatedTime?: string;
}

export type WorkflowPhase =
  | 'analysis'
  | 'planning'
  | 'solutioning'
  | 'implementation';

export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  instruction: string;
  expectedOutput?: string;
}

export interface WorkflowInstance {
  id: string;
  projectId: string;
  workflowId: string;
  currentStep: number;
  totalSteps: number;
  status: WorkflowInstanceStatus;
  stepOutputs: Record<string, unknown>;
  startedAt: Date;
  completedAt?: Date;
}

export type WorkflowInstanceStatus =
  | 'active'
  | 'paused'
  | 'completed'
  | 'failed';

// Artifact Types
export interface Artifact {
  id: string;
  projectId: string;
  type: ArtifactType;
  name: string;
  content: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

export type ArtifactType =
  | 'prd'
  | 'architecture'
  | 'epic'
  | 'story'
  | 'spec'
  | 'diagram'
  | 'tech-spec'
  | 'test-plan';

// Module Types
export interface Module {
  id: string;
  name: string;
  description: string;
  agents: string[];
  workflows: string[];
  icon?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// Pagination
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// WebSocket Event Types
export type WebSocketEvent =
  | { type: 'agent:message'; payload: { agentId: string; message: string; metadata?: MessageMetadata } }
  | { type: 'agent:typing'; payload: { agentId: string; isTyping: boolean } }
  | { type: 'workflow:progress'; payload: { instanceId: string; currentStep: number; completed: boolean } }
  | { type: 'artifact:updated'; payload: { artifactId: string; version: number } }
  | { type: 'error'; payload: { code: string; message: string } };

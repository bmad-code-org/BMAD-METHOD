import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Project, Agent, Conversation, Message, WorkflowInstance, User } from '@/types';

interface AppState {
  // User
  user: User | null;
  setUser: (user: User | null) => void;

  // Current Project
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;

  // Projects List
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  removeProject: (id: string) => void;

  // Current Agent
  currentAgent: Agent | null;
  setCurrentAgent: (agent: Agent | null) => void;

  // Available Agents
  agents: Agent[];
  setAgents: (agents: Agent[]) => void;

  // Current Conversation
  currentConversation: Conversation | null;
  setCurrentConversation: (conversation: Conversation | null) => void;
  addMessage: (message: Message) => void;

  // Active Workflow
  activeWorkflow: WorkflowInstance | null;
  setActiveWorkflow: (workflow: WorkflowInstance | null) => void;
  updateWorkflowStep: (step: number) => void;

  // UI State
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Agent Typing State
  agentTyping: boolean;
  setAgentTyping: (typing: boolean) => void;

  // Reset
  reset: () => void;
}

const initialState = {
  user: null,
  currentProject: null,
  projects: [],
  currentAgent: null,
  agents: [],
  currentConversation: null,
  activeWorkflow: null,
  sidebarOpen: true,
  agentTyping: false,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // User
      setUser: (user) => set({ user }),

      // Current Project
      setCurrentProject: (project) => set({ currentProject: project }),

      // Projects
      setProjects: (projects) => set({ projects }),
      addProject: (project) =>
        set((state) => ({ projects: [...state.projects, project] })),
      updateProject: (id, updates) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
          currentProject:
            state.currentProject?.id === id
              ? { ...state.currentProject, ...updates }
              : state.currentProject,
        })),
      removeProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          currentProject:
            state.currentProject?.id === id ? null : state.currentProject,
        })),

      // Agent
      setCurrentAgent: (agent) => set({ currentAgent: agent }),
      setAgents: (agents) => set({ agents }),

      // Conversation
      setCurrentConversation: (conversation) =>
        set({ currentConversation: conversation }),
      addMessage: (message) =>
        set((state) => {
          if (!state.currentConversation) return state;
          return {
            currentConversation: {
              ...state.currentConversation,
              messages: [...state.currentConversation.messages, message],
            },
          };
        }),

      // Workflow
      setActiveWorkflow: (workflow) => set({ activeWorkflow: workflow }),
      updateWorkflowStep: (step) =>
        set((state) => {
          if (!state.activeWorkflow) return state;
          return {
            activeWorkflow: {
              ...state.activeWorkflow,
              currentStep: step,
              status: step >= state.activeWorkflow.totalSteps ? 'completed' : 'active',
            },
          };
        }),

      // UI
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      // Agent Typing
      setAgentTyping: (typing) => set({ agentTyping: typing }),

      // Reset
      reset: () => set(initialState),
    }),
    {
      name: 'bmad-app-storage',
      partialize: (state) => ({
        user: state.user,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);

/**
 * BMAD Core Package
 *
 * This package provides the core functionality for BMAD Method:
 * - Agent definitions and parsing
 * - Workflow definitions and execution
 * - Module system
 * - Shared types
 */

// Export types
export * from './types/index.js';

// Export utilities
export * from './utils/yaml-parser.js';
export * from './utils/agent-loader.js';
export * from './utils/workflow-loader.js';

// Export constants
export const BMAD_VERSION = '6.0.0';

export const COMPLEXITY_LEVELS = {
  0: { name: 'Bug Fix', description: 'Simple bug fixes' },
  1: { name: 'Small Feature', description: 'Small features and enhancements' },
  2: { name: 'Standard Product', description: 'Standard products and platforms' },
  3: { name: 'Complex Platform', description: 'Complex platforms with multiple integrations' },
  4: { name: 'Enterprise System', description: 'Enterprise systems with compliance requirements' },
} as const;

export const MODULES = {
  bmm: {
    id: 'bmm',
    name: 'BMAD Method Module',
    description: 'Core agile development framework',
  },
  cis: {
    id: 'cis',
    name: 'Creative Intelligence Suite',
    description: 'Innovation and brainstorming tools',
  },
  bmb: {
    id: 'bmb',
    name: 'BMAD Builder',
    description: 'Custom agent and module creation',
  },
  bmgd: {
    id: 'bmgd',
    name: 'BMAD Game Dev',
    description: 'Game development specialization',
  },
} as const;

export const WORKFLOW_PHASES = [
  'analysis',
  'planning',
  'solutioning',
  'implementation',
] as const;

/**
 * Crowdsource Module - Shared infrastructure for PRD and Epic crowdsourcing
 *
 * This module provides generic feedback collection, LLM synthesis,
 * and sign-off management that works for both PRDs and Epics.
 */

const { FeedbackManager, FEEDBACK_TYPES, FEEDBACK_STATUS, PRIORITY_LEVELS } = require('./feedback-manager');
const { SynthesisEngine, SYNTHESIS_PROMPTS } = require('./synthesis-engine');
const { SignoffManager, SIGNOFF_STATUS, THRESHOLD_TYPES, DEFAULT_CONFIG } = require('./signoff-manager');

module.exports = {
  // Feedback Management
  FeedbackManager,
  FEEDBACK_TYPES,
  FEEDBACK_STATUS,
  PRIORITY_LEVELS,

  // Synthesis Engine
  SynthesisEngine,
  SYNTHESIS_PROMPTS,

  // Sign-off Management
  SignoffManager,
  SIGNOFF_STATUS,
  THRESHOLD_TYPES,
  DEFAULT_CONFIG,
};

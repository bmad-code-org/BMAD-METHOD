/**
 * Scope Management Module
 *
 * Provides multi-scope parallel artifact system functionality
 * for isolated development workflows.
 *
 * @module scope
 */

const { ScopeValidator } = require('./scope-validator');
const { ScopeManager } = require('./scope-manager');
const { ScopeInitializer } = require('./scope-initializer');
const { ScopeMigrator } = require('./scope-migrator');
const { ScopeContext } = require('./scope-context');
const { ArtifactResolver } = require('./artifact-resolver');
const { StateLock } = require('./state-lock');
const { ScopeSync } = require('./scope-sync');
const { EventLogger } = require('./event-logger');

module.exports = {
  ScopeValidator,
  ScopeManager,
  ScopeInitializer,
  ScopeMigrator,
  ScopeContext,
  ArtifactResolver,
  StateLock,
  ScopeSync,
  EventLogger,
};

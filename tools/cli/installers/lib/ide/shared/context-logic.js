/**
 * Monorepo Context Logic XML Block
 *
 * robust, secure, and centralized logic for handling:
 * 1. Inline project overrides (#p:NAME)
 * 2. .current_project file fallback
 * 3. Path variable overrides
 */
const MONOREPO_CONTEXT_LOGIC = `
<monorepo-context-check CRITICAL="TRUE" priority="before-config">
  <!-- Step 1: Check for inline project override in user invocation -->
  <!-- Supported syntax: #project:NAME (full) or #p:NAME (short alias) -->
  <action>Scan user's invocation message for pattern #project:NAME or #p:NAME (case-insensitive)</action>
  <check if="inline override found">
    <action>Set project_suffix = extracted NAME</action>
    <output>🎯 Inline project override: {project_suffix}</output>
  </check>

  <!-- Step 2: Fall back to .current_project file -->
  <check if="project_suffix not yet set AND {project-root}/{{bmadFolderName}}/.current_project exists">
    <action>Read {project-root}/{{bmadFolderName}}/.current_project as project_suffix</action>
  </check>

  <!-- Step 3: Validate -->
  <check if="project_suffix is set">
    <action>Trim whitespace and newlines from project_suffix</action>
    <!-- Security: Reject traversal, absolute paths, and invalid patterns -->
    <check if="project_suffix is empty OR project_suffix contains '..' OR starts with '/' OR starts with '\\\\'">
      <output>🚫 Security Error: Invalid project context — path traversal or absolute path detected.</output>
      <action>HALT</action>
    </check>
    
    <!-- Whitelist: Alphanumeric, dots, dashes, underscores, AND slashes (for nested segments) -->
    <check if="project_suffix matches regex '[^a-zA-Z0-9._-/]|^\\\\s*$'">
      <output>🚫 Error: project_suffix must only contain alphanumeric characters, dots, dashes, underscores, or slashes.</output>
      <action>HALT</action>
    </check>

    <!-- Step 4: Override path variables -->
    <action>Override output_folder = {project-root}/_bmad-output/{project_suffix}</action>
    <action>Override planning_artifacts = {output_folder}/planning-artifacts</action>
    <action>Override implementation_artifacts = {output_folder}/implementation-artifacts</action>
    <action>Override project_knowledge = {output_folder}/knowledge</action>
    <action>Override sprint_status_file = {output_folder}/sprint-status.yaml</action>
    <output>🗂️ Monorepo context: {project_suffix} → outputs to {output_folder}</output>
  </check>
</monorepo-context-check>
`;

module.exports = { MONOREPO_CONTEXT_LOGIC };

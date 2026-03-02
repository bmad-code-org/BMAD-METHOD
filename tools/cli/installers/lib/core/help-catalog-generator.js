const fs = require('fs-extra');
const path = require('node:path');
const yaml = require('yaml');
const { getSourcePath, getProjectRoot } = require('../../../lib/project-root');
const { normalizeAndResolveExemplarAlias } = require('./help-alias-normalizer');

const EXEMPLAR_HELP_CATALOG_CANONICAL_ID = 'bmad-help';
const EXEMPLAR_HELP_CATALOG_AUTHORITY_SOURCE_PATH = 'bmad-fork/src/core/tasks/help.artifact.yaml';
const EXEMPLAR_HELP_CATALOG_SOURCE_MARKDOWN_SOURCE_PATH = 'bmad-fork/src/core/tasks/help.md';
const EXEMPLAR_HELP_CATALOG_ISSUING_COMPONENT =
  'bmad-fork/tools/cli/installers/lib/core/help-catalog-generator.js::buildSidecarAwareExemplarHelpRow()';
const INSTALLER_HELP_CATALOG_MERGE_COMPONENT = 'bmad-fork/tools/cli/installers/lib/core/installer.js::mergeModuleHelpCatalogs()';

const HELP_CATALOG_GENERATION_ERROR_CODES = Object.freeze({
  SIDECAR_FILE_NOT_FOUND: 'ERR_HELP_CATALOG_SIDECAR_FILE_NOT_FOUND',
  SIDECAR_PARSE_FAILED: 'ERR_HELP_CATALOG_SIDECAR_PARSE_FAILED',
  SIDECAR_INVALID_METADATA: 'ERR_HELP_CATALOG_SIDECAR_INVALID_METADATA',
  CANONICAL_ID_MISMATCH: 'ERR_HELP_CATALOG_CANONICAL_ID_MISMATCH',
  COMMAND_LABEL_CONTRACT_FAILED: 'ERR_HELP_COMMAND_LABEL_CONTRACT_FAILED',
});

class HelpCatalogGenerationError extends Error {
  constructor({ code, detail, fieldPath, sourcePath, observedValue, expectedValue }) {
    const message = `${code}: ${detail} (fieldPath=${fieldPath}, sourcePath=${sourcePath})`;
    super(message);
    this.name = 'HelpCatalogGenerationError';
    this.code = code;
    this.detail = detail;
    this.fieldPath = fieldPath;
    this.sourcePath = sourcePath;
    this.observedValue = observedValue;
    this.expectedValue = expectedValue;
    this.fullMessage = message;
  }
}

function normalizeSourcePath(value) {
  if (!value) return '';
  return String(value).replaceAll('\\', '/');
}

function toProjectRelativePath(filePath) {
  const projectRoot = getProjectRoot();
  const relative = path.relative(projectRoot, filePath);

  if (!relative || relative.startsWith('..')) {
    return normalizeSourcePath(path.resolve(filePath));
  }

  return normalizeSourcePath(relative);
}

function frontmatterMatchValue(value) {
  if (typeof value === 'string') {
    return value.trim();
  }
  if (value === null || value === undefined) {
    return '';
  }
  return String(value).trim();
}

function createGenerationError(code, fieldPath, sourcePath, detail, observedValue, expectedValue) {
  throw new HelpCatalogGenerationError({
    code,
    detail,
    fieldPath,
    sourcePath,
    observedValue,
    expectedValue,
  });
}

async function loadExemplarHelpSidecar(sidecarPath = getSourcePath('core', 'tasks', 'help.artifact.yaml')) {
  const sourcePath = normalizeSourcePath(toProjectRelativePath(sidecarPath));
  if (!(await fs.pathExists(sidecarPath))) {
    createGenerationError(
      HELP_CATALOG_GENERATION_ERROR_CODES.SIDECAR_FILE_NOT_FOUND,
      '<file>',
      sourcePath,
      'Expected sidecar metadata file was not found',
    );
  }

  let sidecarData;
  try {
    sidecarData = yaml.parse(await fs.readFile(sidecarPath, 'utf8'));
  } catch (error) {
    createGenerationError(
      HELP_CATALOG_GENERATION_ERROR_CODES.SIDECAR_PARSE_FAILED,
      '<document>',
      sourcePath,
      `YAML parse failure: ${error.message}`,
    );
  }

  if (!sidecarData || typeof sidecarData !== 'object' || Array.isArray(sidecarData)) {
    createGenerationError(
      HELP_CATALOG_GENERATION_ERROR_CODES.SIDECAR_INVALID_METADATA,
      '<document>',
      sourcePath,
      'Sidecar root must be a YAML mapping object',
    );
  }

  const canonicalId = frontmatterMatchValue(sidecarData.canonicalId);
  const displayName = frontmatterMatchValue(sidecarData.displayName);
  const description = frontmatterMatchValue(sidecarData.description);
  const missingStringField =
    canonicalId.length === 0 ? 'canonicalId' : displayName.length === 0 ? 'displayName' : description.length === 0 ? 'description' : '';
  if (missingStringField.length > 0) {
    const observedValues = {
      canonicalId,
      displayName,
      description,
    };
    createGenerationError(
      HELP_CATALOG_GENERATION_ERROR_CODES.SIDECAR_INVALID_METADATA,
      missingStringField,
      sourcePath,
      'Sidecar canonicalId, displayName, and description must be non-empty strings',
      observedValues[missingStringField],
    );
  }

  return {
    canonicalId,
    displayName,
    description,
    sourcePath,
  };
}

function normalizeDisplayedCommandLabel(label) {
  const trimmed = frontmatterMatchValue(label);
  if (!trimmed) return '';

  const hasLeadingSlash = trimmed.startsWith('/');
  const withoutLeadingSlash = trimmed.replace(/^\/+/, '').trim();
  const normalizedBody = withoutLeadingSlash.toLowerCase().replaceAll(/\s+/g, ' ');
  if (!normalizedBody) return hasLeadingSlash ? '/' : '';

  return hasLeadingSlash ? `/${normalizedBody}` : normalizedBody;
}

function renderDisplayedCommandLabel(rawCommandValue) {
  const normalizedRaw = frontmatterMatchValue(rawCommandValue).replace(/^\/+/, '');
  if (!normalizedRaw) {
    return '/';
  }
  return `/${normalizedRaw}`;
}

function resolveCanonicalIdFromAuthorityRecords(helpAuthorityRecords = []) {
  if (!Array.isArray(helpAuthorityRecords)) return '';

  const sidecarRecord = helpAuthorityRecords.find(
    (record) =>
      record &&
      typeof record === 'object' &&
      record.authoritySourceType === 'sidecar' &&
      frontmatterMatchValue(record.authoritySourcePath) === EXEMPLAR_HELP_CATALOG_AUTHORITY_SOURCE_PATH &&
      frontmatterMatchValue(record.canonicalId).length > 0,
  );

  return sidecarRecord ? frontmatterMatchValue(sidecarRecord.canonicalId) : '';
}

function evaluateExemplarCommandLabelReportRows(rows, options = {}) {
  const expectedCanonicalId = frontmatterMatchValue(options.canonicalId || EXEMPLAR_HELP_CATALOG_CANONICAL_ID);
  const expectedDisplayedLabel = frontmatterMatchValue(options.displayedCommandLabel || `/${expectedCanonicalId}`);
  const normalizedExpectedDisplayedLabel = normalizeDisplayedCommandLabel(expectedDisplayedLabel);

  const targetRows = (Array.isArray(rows) ? rows : []).filter(
    (row) => frontmatterMatchValue(row && row.canonicalId) === expectedCanonicalId,
  );

  if (targetRows.length !== 1) {
    return { valid: false, reason: `row-count:${targetRows.length}` };
  }

  const row = targetRows[0];
  const rawCommandValue = frontmatterMatchValue(row.rawCommandValue);
  if (rawCommandValue !== expectedCanonicalId) {
    return { valid: false, reason: `invalid-raw-command-value:${rawCommandValue || '<empty>'}` };
  }

  const displayedCommandLabel = frontmatterMatchValue(row.displayedCommandLabel);
  if (displayedCommandLabel !== expectedDisplayedLabel) {
    return { valid: false, reason: `invalid-displayed-label:${displayedCommandLabel || '<empty>'}` };
  }

  const normalizedDisplayedLabel = normalizeDisplayedCommandLabel(row.normalizedDisplayedLabel || row.displayedCommandLabel);
  if (normalizedDisplayedLabel !== normalizedExpectedDisplayedLabel) {
    return { valid: false, reason: `invalid-normalized-displayed-label:${normalizedDisplayedLabel || '<empty>'}` };
  }

  const rowCountForCanonicalId = Number.parseInt(String(row.rowCountForCanonicalId ?? ''), 10);
  if (!Number.isFinite(rowCountForCanonicalId) || rowCountForCanonicalId !== 1) {
    return { valid: false, reason: `invalid-row-count-for-canonical-id:${String(row.rowCountForCanonicalId ?? '<empty>')}` };
  }

  if (frontmatterMatchValue(row.authoritySourceType) !== 'sidecar') {
    return { valid: false, reason: `invalid-authority-source-type:${frontmatterMatchValue(row.authoritySourceType) || '<empty>'}` };
  }

  if (frontmatterMatchValue(row.authoritySourcePath) !== EXEMPLAR_HELP_CATALOG_AUTHORITY_SOURCE_PATH) {
    return {
      valid: false,
      reason: `invalid-authority-source-path:${frontmatterMatchValue(row.authoritySourcePath) || '<empty>'}`,
    };
  }

  return { valid: true, reason: 'ok' };
}

function buildExemplarHelpCatalogRow({ canonicalId, description }) {
  return {
    module: 'core',
    phase: 'anytime',
    name: 'bmad-help',
    code: 'BH',
    sequence: '',
    'workflow-file': '_bmad/core/tasks/help.md',
    command: canonicalId,
    required: 'false',
    'agent-name': '',
    'agent-command': '',
    'agent-display-name': '',
    'agent-title': '',
    options: '',
    description,
    'output-location': '',
    outputs: '',
  };
}

function buildPipelineStageRows({ bmadFolderName, canonicalId, commandValue, descriptionValue, authoritySourcePath, sourcePath }) {
  const runtimeFolder = frontmatterMatchValue(bmadFolderName) || '_bmad';
  const bindingEvidence = `authority:${authoritySourcePath}|source:${sourcePath}|canonical:${canonicalId}|command:${commandValue}`;

  return [
    {
      stage: 'installed-compatibility-row',
      artifactPath: `${runtimeFolder}/core/module-help.csv`,
      rowIdentity: 'module-help-row:bmad-help',
      canonicalId,
      sourcePath,
      rowCountForStageCanonicalId: 1,
      commandValue,
      expectedCommandValue: canonicalId,
      descriptionValue,
      expectedDescriptionValue: descriptionValue,
      descriptionAuthoritySourceType: 'sidecar',
      descriptionAuthoritySourcePath: authoritySourcePath,
      commandAuthoritySourceType: 'sidecar',
      commandAuthoritySourcePath: authoritySourcePath,
      issuerOwnerClass: 'installer',
      issuingComponent: EXEMPLAR_HELP_CATALOG_ISSUING_COMPONENT,
      issuingComponentBindingEvidence: `${EXEMPLAR_HELP_CATALOG_ISSUING_COMPONENT}|${bindingEvidence}`,
      stageStatus: 'PASS',
      status: 'PASS',
    },
    {
      stage: 'merged-config-row',
      artifactPath: `${runtimeFolder}/_config/bmad-help.csv`,
      rowIdentity: 'merged-help-row:bmad-help',
      canonicalId,
      sourcePath,
      rowCountForStageCanonicalId: 1,
      commandValue,
      expectedCommandValue: canonicalId,
      descriptionValue,
      expectedDescriptionValue: descriptionValue,
      descriptionAuthoritySourceType: 'sidecar',
      descriptionAuthoritySourcePath: authoritySourcePath,
      commandAuthoritySourceType: 'sidecar',
      commandAuthoritySourcePath: authoritySourcePath,
      issuerOwnerClass: 'installer',
      issuingComponent: INSTALLER_HELP_CATALOG_MERGE_COMPONENT,
      issuingComponentBindingEvidence: `${INSTALLER_HELP_CATALOG_MERGE_COMPONENT}|${bindingEvidence}`,
      stageStatus: 'PASS',
      status: 'PASS',
    },
  ];
}

async function buildSidecarAwareExemplarHelpRow(options = {}) {
  const authorityCanonicalId = resolveCanonicalIdFromAuthorityRecords(options.helpAuthorityRecords);
  const sidecarMetadata = await loadExemplarHelpSidecar(options.sidecarPath);
  const canonicalIdentityResolution = await normalizeAndResolveExemplarAlias(sidecarMetadata.canonicalId, {
    fieldPath: 'canonicalId',
    sourcePath: sidecarMetadata.sourcePath,
    aliasTablePath: options.aliasTablePath,
    aliasTableSourcePath: options.aliasTableSourcePath,
  });
  const canonicalId = canonicalIdentityResolution.postAliasCanonicalId;

  if (authorityCanonicalId && authorityCanonicalId !== canonicalId) {
    createGenerationError(
      HELP_CATALOG_GENERATION_ERROR_CODES.CANONICAL_ID_MISMATCH,
      'canonicalId',
      sidecarMetadata.sourcePath,
      'Authority record canonicalId does not match sidecar canonicalId',
      authorityCanonicalId,
      canonicalId,
    );
  }

  const commandValue = canonicalId;
  const displayedCommandLabel = renderDisplayedCommandLabel(commandValue);
  const normalizedDisplayedLabel = normalizeDisplayedCommandLabel(displayedCommandLabel);
  const row = buildExemplarHelpCatalogRow({
    canonicalId: commandValue,
    description: sidecarMetadata.description,
  });

  const pipelineStageRows = buildPipelineStageRows({
    bmadFolderName: options.bmadFolderName || '_bmad',
    canonicalId,
    commandValue,
    descriptionValue: sidecarMetadata.description,
    authoritySourcePath: EXEMPLAR_HELP_CATALOG_AUTHORITY_SOURCE_PATH,
    sourcePath: EXEMPLAR_HELP_CATALOG_SOURCE_MARKDOWN_SOURCE_PATH,
  });

  const commandLabelReportRow = {
    surface: `${frontmatterMatchValue(options.bmadFolderName) || '_bmad'}/_config/bmad-help.csv`,
    canonicalId,
    rawCommandValue: commandValue,
    displayedCommandLabel,
    normalizedDisplayedLabel,
    rowCountForCanonicalId: 1,
    authoritySourceType: 'sidecar',
    authoritySourcePath: EXEMPLAR_HELP_CATALOG_AUTHORITY_SOURCE_PATH,
    status: 'PASS',
  };

  return {
    canonicalId,
    legacyName: sidecarMetadata.displayName,
    commandValue,
    displayedCommandLabel,
    normalizedDisplayedLabel,
    descriptionValue: sidecarMetadata.description,
    authoritySourceType: 'sidecar',
    authoritySourcePath: EXEMPLAR_HELP_CATALOG_AUTHORITY_SOURCE_PATH,
    sourcePath: EXEMPLAR_HELP_CATALOG_SOURCE_MARKDOWN_SOURCE_PATH,
    row,
    pipelineStageRows,
    commandLabelReportRow,
  };
}

module.exports = {
  HELP_CATALOG_GENERATION_ERROR_CODES,
  HelpCatalogGenerationError,
  EXEMPLAR_HELP_CATALOG_CANONICAL_ID,
  EXEMPLAR_HELP_CATALOG_AUTHORITY_SOURCE_PATH,
  EXEMPLAR_HELP_CATALOG_SOURCE_MARKDOWN_SOURCE_PATH,
  EXEMPLAR_HELP_CATALOG_ISSUING_COMPONENT,
  INSTALLER_HELP_CATALOG_MERGE_COMPONENT,
  normalizeDisplayedCommandLabel,
  renderDisplayedCommandLabel,
  evaluateExemplarCommandLabelReportRows,
  buildSidecarAwareExemplarHelpRow,
};

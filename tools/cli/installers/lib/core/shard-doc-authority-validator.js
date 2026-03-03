const path = require('node:path');
const fs = require('fs-extra');
const yaml = require('yaml');
const csv = require('csv-parse/sync');
const { getProjectRoot, getSourcePath } = require('../../../lib/project-root');

const SHARD_DOC_AUTHORITY_VALIDATION_ERROR_CODES = Object.freeze({
  SIDECAR_FILE_NOT_FOUND: 'ERR_SHARD_DOC_AUTHORITY_SIDECAR_FILE_NOT_FOUND',
  SIDECAR_PARSE_FAILED: 'ERR_SHARD_DOC_AUTHORITY_SIDECAR_PARSE_FAILED',
  SIDECAR_INVALID_METADATA: 'ERR_SHARD_DOC_AUTHORITY_SIDECAR_INVALID_METADATA',
  SIDECAR_CANONICAL_ID_MISMATCH: 'ERR_SHARD_DOC_AUTHORITY_SIDECAR_CANONICAL_ID_MISMATCH',
  SOURCE_XML_FILE_NOT_FOUND: 'ERR_SHARD_DOC_AUTHORITY_SOURCE_XML_FILE_NOT_FOUND',
  COMPATIBILITY_FILE_NOT_FOUND: 'ERR_SHARD_DOC_AUTHORITY_COMPATIBILITY_FILE_NOT_FOUND',
  COMPATIBILITY_PARSE_FAILED: 'ERR_SHARD_DOC_AUTHORITY_COMPATIBILITY_PARSE_FAILED',
  COMPATIBILITY_ROW_MISSING: 'ERR_SHARD_DOC_AUTHORITY_COMPATIBILITY_ROW_MISSING',
  COMPATIBILITY_ROW_DUPLICATE: 'ERR_SHARD_DOC_AUTHORITY_COMPATIBILITY_ROW_DUPLICATE',
  COMMAND_MISMATCH: 'ERR_SHARD_DOC_AUTHORITY_COMMAND_MISMATCH',
  DISPLAY_NAME_MISMATCH: 'ERR_SHARD_DOC_AUTHORITY_DISPLAY_NAME_MISMATCH',
  DUPLICATE_CANONICAL_COMMAND: 'ERR_SHARD_DOC_AUTHORITY_DUPLICATE_CANONICAL_COMMAND',
});

const SHARD_DOC_LOCKED_CANONICAL_ID = 'bmad-shard-doc';
const SHARD_DOC_LOCKED_AUTHORITATIVE_PRESENCE_KEY = `capability:${SHARD_DOC_LOCKED_CANONICAL_ID}`;

class ShardDocAuthorityValidationError extends Error {
  constructor({ code, detail, fieldPath, sourcePath, observedValue, expectedValue }) {
    const message = `${code}: ${detail} (fieldPath=${fieldPath}, sourcePath=${sourcePath})`;
    super(message);
    this.name = 'ShardDocAuthorityValidationError';
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

function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

function isBlankString(value) {
  return typeof value !== 'string' || value.trim().length === 0;
}

function csvMatchValue(value) {
  return String(value ?? '').trim();
}

function createValidationError(code, detail, fieldPath, sourcePath, observedValue, expectedValue) {
  throw new ShardDocAuthorityValidationError({
    code,
    detail,
    fieldPath,
    sourcePath,
    observedValue,
    expectedValue,
  });
}

function ensureSidecarMetadata(sidecarData, sidecarSourcePath, sourceXmlSourcePath) {
  const requiredFields = ['canonicalId', 'displayName', 'description', 'sourcePath'];
  for (const requiredField of requiredFields) {
    if (!hasOwn(sidecarData, requiredField)) {
      createValidationError(
        SHARD_DOC_AUTHORITY_VALIDATION_ERROR_CODES.SIDECAR_INVALID_METADATA,
        `Missing required sidecar metadata field "${requiredField}"`,
        requiredField,
        sidecarSourcePath,
      );
    }
  }

  for (const requiredField of requiredFields) {
    if (isBlankString(sidecarData[requiredField])) {
      createValidationError(
        SHARD_DOC_AUTHORITY_VALIDATION_ERROR_CODES.SIDECAR_INVALID_METADATA,
        `Required sidecar metadata field "${requiredField}" must be a non-empty string`,
        requiredField,
        sidecarSourcePath,
      );
    }
  }

  const normalizedCanonicalId = String(sidecarData.canonicalId).trim();
  if (normalizedCanonicalId !== SHARD_DOC_LOCKED_CANONICAL_ID) {
    createValidationError(
      SHARD_DOC_AUTHORITY_VALIDATION_ERROR_CODES.SIDECAR_CANONICAL_ID_MISMATCH,
      'Converted shard-doc sidecar canonicalId must remain locked to bmad-shard-doc',
      'canonicalId',
      sidecarSourcePath,
      normalizedCanonicalId,
      SHARD_DOC_LOCKED_CANONICAL_ID,
    );
  }

  const normalizedDeclaredSourcePath = normalizeSourcePath(sidecarData.sourcePath);
  if (normalizedDeclaredSourcePath !== sourceXmlSourcePath) {
    createValidationError(
      SHARD_DOC_AUTHORITY_VALIDATION_ERROR_CODES.SIDECAR_INVALID_METADATA,
      'Sidecar sourcePath must match shard-doc XML source path',
      'sourcePath',
      sidecarSourcePath,
      normalizedDeclaredSourcePath,
      sourceXmlSourcePath,
    );
  }
}

async function parseCompatibilityRows(compatibilityCatalogPath, compatibilityCatalogSourcePath) {
  if (!(await fs.pathExists(compatibilityCatalogPath))) {
    createValidationError(
      SHARD_DOC_AUTHORITY_VALIDATION_ERROR_CODES.COMPATIBILITY_FILE_NOT_FOUND,
      'Expected module-help compatibility catalog file was not found',
      '<file>',
      compatibilityCatalogSourcePath,
    );
  }

  let csvRaw;
  try {
    csvRaw = await fs.readFile(compatibilityCatalogPath, 'utf8');
  } catch (error) {
    createValidationError(
      SHARD_DOC_AUTHORITY_VALIDATION_ERROR_CODES.COMPATIBILITY_PARSE_FAILED,
      `Unable to read compatibility catalog file: ${error.message}`,
      '<document>',
      compatibilityCatalogSourcePath,
    );
  }

  try {
    return csv.parse(csvRaw, {
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true,
      trim: true,
    });
  } catch (error) {
    createValidationError(
      SHARD_DOC_AUTHORITY_VALIDATION_ERROR_CODES.COMPATIBILITY_PARSE_FAILED,
      `CSV parse failure: ${error.message}`,
      '<document>',
      compatibilityCatalogSourcePath,
    );
  }
}

function validateCompatibilityPrecedence({ rows, displayName, workflowFilePath, compatibilityCatalogSourcePath }) {
  const workflowMatches = rows.filter((row) => csvMatchValue(row['workflow-file']) === workflowFilePath);

  if (workflowMatches.length === 0) {
    createValidationError(
      SHARD_DOC_AUTHORITY_VALIDATION_ERROR_CODES.COMPATIBILITY_ROW_MISSING,
      'Converted shard-doc compatibility row is missing from module-help catalog',
      'workflow-file',
      compatibilityCatalogSourcePath,
      '<missing>',
      workflowFilePath,
    );
  }

  if (workflowMatches.length > 1) {
    createValidationError(
      SHARD_DOC_AUTHORITY_VALIDATION_ERROR_CODES.COMPATIBILITY_ROW_DUPLICATE,
      'Converted shard-doc compatibility row appears more than once in module-help catalog',
      'workflow-file',
      compatibilityCatalogSourcePath,
      workflowMatches.length,
      1,
    );
  }

  const canonicalCommandMatches = rows.filter((row) => csvMatchValue(row.command) === SHARD_DOC_LOCKED_CANONICAL_ID);
  if (canonicalCommandMatches.length > 1) {
    createValidationError(
      SHARD_DOC_AUTHORITY_VALIDATION_ERROR_CODES.DUPLICATE_CANONICAL_COMMAND,
      'Converted shard-doc canonical command appears in more than one compatibility row',
      'command',
      compatibilityCatalogSourcePath,
      canonicalCommandMatches.length,
      1,
    );
  }

  const shardDocRow = workflowMatches[0];
  const observedCommand = csvMatchValue(shardDocRow.command);
  if (!observedCommand || observedCommand !== SHARD_DOC_LOCKED_CANONICAL_ID) {
    createValidationError(
      SHARD_DOC_AUTHORITY_VALIDATION_ERROR_CODES.COMMAND_MISMATCH,
      'Converted shard-doc compatibility command must match locked canonical command bmad-shard-doc',
      'command',
      compatibilityCatalogSourcePath,
      observedCommand || '<empty>',
      SHARD_DOC_LOCKED_CANONICAL_ID,
    );
  }

  const observedDisplayName = csvMatchValue(shardDocRow.name);
  if (observedDisplayName && observedDisplayName !== displayName) {
    createValidationError(
      SHARD_DOC_AUTHORITY_VALIDATION_ERROR_CODES.DISPLAY_NAME_MISMATCH,
      'Converted shard-doc compatibility name must match sidecar displayName when provided',
      'name',
      compatibilityCatalogSourcePath,
      observedDisplayName,
      displayName,
    );
  }
}

function buildShardDocAuthorityRecords({ canonicalId, sidecarSourcePath, sourceXmlSourcePath }) {
  return [
    {
      recordType: 'metadata-authority',
      canonicalId,
      authoritativePresenceKey: SHARD_DOC_LOCKED_AUTHORITATIVE_PRESENCE_KEY,
      authoritySourceType: 'sidecar',
      authoritySourcePath: sidecarSourcePath,
      sourcePath: sourceXmlSourcePath,
    },
    {
      recordType: 'source-body-authority',
      canonicalId,
      authoritativePresenceKey: SHARD_DOC_LOCKED_AUTHORITATIVE_PRESENCE_KEY,
      authoritySourceType: 'source-xml',
      authoritySourcePath: sourceXmlSourcePath,
      sourcePath: sourceXmlSourcePath,
    },
  ];
}

async function validateShardDocAuthoritySplitAndPrecedence(options = {}) {
  const sidecarPath = options.sidecarPath || getSourcePath('core', 'tasks', 'shard-doc.artifact.yaml');
  const sourceXmlPath = options.sourceXmlPath || getSourcePath('core', 'tasks', 'shard-doc.xml');
  const compatibilityCatalogPath = options.compatibilityCatalogPath || getSourcePath('core', 'module-help.csv');
  const compatibilityWorkflowFilePath = options.compatibilityWorkflowFilePath || '_bmad/core/tasks/shard-doc.xml';

  const sidecarSourcePath = normalizeSourcePath(options.sidecarSourcePath || toProjectRelativePath(sidecarPath));
  const sourceXmlSourcePath = normalizeSourcePath(options.sourceXmlSourcePath || toProjectRelativePath(sourceXmlPath));
  const compatibilityCatalogSourcePath = normalizeSourcePath(
    options.compatibilityCatalogSourcePath || toProjectRelativePath(compatibilityCatalogPath),
  );

  if (!(await fs.pathExists(sidecarPath))) {
    createValidationError(
      SHARD_DOC_AUTHORITY_VALIDATION_ERROR_CODES.SIDECAR_FILE_NOT_FOUND,
      'Expected shard-doc sidecar metadata file was not found',
      '<file>',
      sidecarSourcePath,
    );
  }

  let sidecarData;
  try {
    const sidecarRaw = await fs.readFile(sidecarPath, 'utf8');
    sidecarData = yaml.parse(sidecarRaw);
  } catch (error) {
    createValidationError(
      SHARD_DOC_AUTHORITY_VALIDATION_ERROR_CODES.SIDECAR_PARSE_FAILED,
      `YAML parse failure: ${error.message}`,
      '<document>',
      sidecarSourcePath,
    );
  }

  if (!sidecarData || typeof sidecarData !== 'object' || Array.isArray(sidecarData)) {
    createValidationError(
      SHARD_DOC_AUTHORITY_VALIDATION_ERROR_CODES.SIDECAR_INVALID_METADATA,
      'Sidecar root must be a YAML mapping object',
      '<document>',
      sidecarSourcePath,
    );
  }

  ensureSidecarMetadata(sidecarData, sidecarSourcePath, sourceXmlSourcePath);

  if (!(await fs.pathExists(sourceXmlPath))) {
    createValidationError(
      SHARD_DOC_AUTHORITY_VALIDATION_ERROR_CODES.SOURCE_XML_FILE_NOT_FOUND,
      'Expected shard-doc XML source file was not found',
      '<file>',
      sourceXmlSourcePath,
    );
  }

  const compatibilityRows = await parseCompatibilityRows(compatibilityCatalogPath, compatibilityCatalogSourcePath);
  validateCompatibilityPrecedence({
    rows: compatibilityRows,
    displayName: sidecarData.displayName.trim(),
    workflowFilePath: compatibilityWorkflowFilePath,
    compatibilityCatalogSourcePath,
  });

  const canonicalId = SHARD_DOC_LOCKED_CANONICAL_ID;
  const authoritativeRecords = buildShardDocAuthorityRecords({
    canonicalId,
    sidecarSourcePath,
    sourceXmlSourcePath,
  });

  return {
    canonicalId,
    authoritativePresenceKey: SHARD_DOC_LOCKED_AUTHORITATIVE_PRESENCE_KEY,
    authoritativeRecords,
    checkedSurfaces: [sourceXmlSourcePath, compatibilityCatalogSourcePath],
  };
}

module.exports = {
  SHARD_DOC_AUTHORITY_VALIDATION_ERROR_CODES,
  SHARD_DOC_LOCKED_CANONICAL_ID,
  ShardDocAuthorityValidationError,
  buildShardDocAuthorityRecords,
  validateShardDocAuthoritySplitAndPrecedence,
};

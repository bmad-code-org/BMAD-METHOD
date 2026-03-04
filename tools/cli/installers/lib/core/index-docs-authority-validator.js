const path = require('node:path');
const fs = require('fs-extra');
const yaml = require('yaml');
const csv = require('csv-parse/sync');
const { getProjectRoot, getSourcePath } = require('../../../lib/project-root');

const INDEX_DOCS_AUTHORITY_VALIDATION_ERROR_CODES = Object.freeze({
  SIDECAR_FILE_NOT_FOUND: 'ERR_INDEX_DOCS_AUTHORITY_SIDECAR_FILE_NOT_FOUND',
  SIDECAR_PARSE_FAILED: 'ERR_INDEX_DOCS_AUTHORITY_SIDECAR_PARSE_FAILED',
  SIDECAR_INVALID_METADATA: 'ERR_INDEX_DOCS_AUTHORITY_SIDECAR_INVALID_METADATA',
  SIDECAR_CANONICAL_ID_MISMATCH: 'ERR_INDEX_DOCS_AUTHORITY_SIDECAR_CANONICAL_ID_MISMATCH',
  SOURCE_XML_FILE_NOT_FOUND: 'ERR_INDEX_DOCS_AUTHORITY_SOURCE_XML_FILE_NOT_FOUND',
  COMPATIBILITY_FILE_NOT_FOUND: 'ERR_INDEX_DOCS_AUTHORITY_COMPATIBILITY_FILE_NOT_FOUND',
  COMPATIBILITY_PARSE_FAILED: 'ERR_INDEX_DOCS_AUTHORITY_COMPATIBILITY_PARSE_FAILED',
  COMPATIBILITY_ROW_MISSING: 'ERR_INDEX_DOCS_AUTHORITY_COMPATIBILITY_ROW_MISSING',
  COMPATIBILITY_ROW_DUPLICATE: 'ERR_INDEX_DOCS_AUTHORITY_COMPATIBILITY_ROW_DUPLICATE',
  COMMAND_MISMATCH: 'ERR_INDEX_DOCS_AUTHORITY_COMMAND_MISMATCH',
  DISPLAY_NAME_MISMATCH: 'ERR_INDEX_DOCS_AUTHORITY_DISPLAY_NAME_MISMATCH',
  DUPLICATE_CANONICAL_COMMAND: 'ERR_INDEX_DOCS_AUTHORITY_DUPLICATE_CANONICAL_COMMAND',
});

const INDEX_DOCS_LOCKED_CANONICAL_ID = 'bmad-index-docs';
const INDEX_DOCS_LOCKED_AUTHORITATIVE_PRESENCE_KEY = `capability:${INDEX_DOCS_LOCKED_CANONICAL_ID}`;

class IndexDocsAuthorityValidationError extends Error {
  constructor({ code, detail, fieldPath, sourcePath, observedValue, expectedValue }) {
    const message = `${code}: ${detail} (fieldPath=${fieldPath}, sourcePath=${sourcePath})`;
    super(message);
    this.name = 'IndexDocsAuthorityValidationError';
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
  throw new IndexDocsAuthorityValidationError({
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
        INDEX_DOCS_AUTHORITY_VALIDATION_ERROR_CODES.SIDECAR_INVALID_METADATA,
        `Missing required sidecar metadata field "${requiredField}"`,
        requiredField,
        sidecarSourcePath,
      );
    }
  }

  for (const requiredField of requiredFields) {
    if (isBlankString(sidecarData[requiredField])) {
      createValidationError(
        INDEX_DOCS_AUTHORITY_VALIDATION_ERROR_CODES.SIDECAR_INVALID_METADATA,
        `Required sidecar metadata field "${requiredField}" must be a non-empty string`,
        requiredField,
        sidecarSourcePath,
      );
    }
  }

  const normalizedCanonicalId = String(sidecarData.canonicalId).trim();
  if (normalizedCanonicalId !== INDEX_DOCS_LOCKED_CANONICAL_ID) {
    createValidationError(
      INDEX_DOCS_AUTHORITY_VALIDATION_ERROR_CODES.SIDECAR_CANONICAL_ID_MISMATCH,
      'Converted index-docs sidecar canonicalId must remain locked to bmad-index-docs',
      'canonicalId',
      sidecarSourcePath,
      normalizedCanonicalId,
      INDEX_DOCS_LOCKED_CANONICAL_ID,
    );
  }

  const normalizedDeclaredSourcePath = normalizeSourcePath(sidecarData.sourcePath);
  if (normalizedDeclaredSourcePath !== sourceXmlSourcePath) {
    createValidationError(
      INDEX_DOCS_AUTHORITY_VALIDATION_ERROR_CODES.SIDECAR_INVALID_METADATA,
      'Sidecar sourcePath must match index-docs XML source path',
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
      INDEX_DOCS_AUTHORITY_VALIDATION_ERROR_CODES.COMPATIBILITY_FILE_NOT_FOUND,
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
      INDEX_DOCS_AUTHORITY_VALIDATION_ERROR_CODES.COMPATIBILITY_PARSE_FAILED,
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
      INDEX_DOCS_AUTHORITY_VALIDATION_ERROR_CODES.COMPATIBILITY_PARSE_FAILED,
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
      INDEX_DOCS_AUTHORITY_VALIDATION_ERROR_CODES.COMPATIBILITY_ROW_MISSING,
      'Converted index-docs compatibility row is missing from module-help catalog',
      'workflow-file',
      compatibilityCatalogSourcePath,
      '<missing>',
      workflowFilePath,
    );
  }

  if (workflowMatches.length > 1) {
    createValidationError(
      INDEX_DOCS_AUTHORITY_VALIDATION_ERROR_CODES.COMPATIBILITY_ROW_DUPLICATE,
      'Converted index-docs compatibility row appears more than once in module-help catalog',
      'workflow-file',
      compatibilityCatalogSourcePath,
      workflowMatches.length,
      1,
    );
  }

  const canonicalCommandMatches = rows.filter((row) => csvMatchValue(row.command) === INDEX_DOCS_LOCKED_CANONICAL_ID);
  if (canonicalCommandMatches.length > 1) {
    createValidationError(
      INDEX_DOCS_AUTHORITY_VALIDATION_ERROR_CODES.DUPLICATE_CANONICAL_COMMAND,
      'Converted index-docs canonical command appears in more than one compatibility row',
      'command',
      compatibilityCatalogSourcePath,
      canonicalCommandMatches.length,
      1,
    );
  }

  const indexDocsRow = workflowMatches[0];
  const observedCommand = csvMatchValue(indexDocsRow.command);
  if (!observedCommand || observedCommand !== INDEX_DOCS_LOCKED_CANONICAL_ID) {
    createValidationError(
      INDEX_DOCS_AUTHORITY_VALIDATION_ERROR_CODES.COMMAND_MISMATCH,
      'Converted index-docs compatibility command must match locked canonical command bmad-index-docs',
      'command',
      compatibilityCatalogSourcePath,
      observedCommand || '<empty>',
      INDEX_DOCS_LOCKED_CANONICAL_ID,
    );
  }

  const observedDisplayName = csvMatchValue(indexDocsRow.name);
  if (observedDisplayName && observedDisplayName !== displayName) {
    createValidationError(
      INDEX_DOCS_AUTHORITY_VALIDATION_ERROR_CODES.DISPLAY_NAME_MISMATCH,
      'Converted index-docs compatibility name must match sidecar displayName when provided',
      'name',
      compatibilityCatalogSourcePath,
      observedDisplayName,
      displayName,
    );
  }
}

function buildIndexDocsAuthorityRecords({ canonicalId, sidecarSourcePath, sourceXmlSourcePath }) {
  return [
    {
      recordType: 'metadata-authority',
      canonicalId,
      authoritativePresenceKey: INDEX_DOCS_LOCKED_AUTHORITATIVE_PRESENCE_KEY,
      authoritySourceType: 'sidecar',
      authoritySourcePath: sidecarSourcePath,
      sourcePath: sourceXmlSourcePath,
    },
    {
      recordType: 'source-body-authority',
      canonicalId,
      authoritativePresenceKey: INDEX_DOCS_LOCKED_AUTHORITATIVE_PRESENCE_KEY,
      authoritySourceType: 'source-xml',
      authoritySourcePath: sourceXmlSourcePath,
      sourcePath: sourceXmlSourcePath,
    },
  ];
}

async function validateIndexDocsAuthoritySplitAndPrecedence(options = {}) {
  const sidecarPath = options.sidecarPath || getSourcePath('core', 'tasks', 'index-docs.artifact.yaml');
  const sourceXmlPath = options.sourceXmlPath || getSourcePath('core', 'tasks', 'index-docs.xml');
  const compatibilityCatalogPath = options.compatibilityCatalogPath || getSourcePath('core', 'module-help.csv');
  const compatibilityWorkflowFilePath = options.compatibilityWorkflowFilePath || '_bmad/core/tasks/index-docs.xml';

  const sidecarSourcePath = normalizeSourcePath(options.sidecarSourcePath || toProjectRelativePath(sidecarPath));
  const sourceXmlSourcePath = normalizeSourcePath(options.sourceXmlSourcePath || toProjectRelativePath(sourceXmlPath));
  const compatibilityCatalogSourcePath = normalizeSourcePath(
    options.compatibilityCatalogSourcePath || toProjectRelativePath(compatibilityCatalogPath),
  );

  if (!(await fs.pathExists(sidecarPath))) {
    createValidationError(
      INDEX_DOCS_AUTHORITY_VALIDATION_ERROR_CODES.SIDECAR_FILE_NOT_FOUND,
      'Expected index-docs sidecar metadata file was not found',
      '<file>',
      sidecarSourcePath,
    );
  }

  let sidecarData;
  try {
    sidecarData = yaml.parse(await fs.readFile(sidecarPath, 'utf8'));
  } catch (error) {
    createValidationError(
      INDEX_DOCS_AUTHORITY_VALIDATION_ERROR_CODES.SIDECAR_PARSE_FAILED,
      `YAML parse failure: ${error.message}`,
      '<document>',
      sidecarSourcePath,
    );
  }

  if (!sidecarData || typeof sidecarData !== 'object' || Array.isArray(sidecarData)) {
    createValidationError(
      INDEX_DOCS_AUTHORITY_VALIDATION_ERROR_CODES.SIDECAR_INVALID_METADATA,
      'Sidecar root must be a YAML mapping object',
      '<document>',
      sidecarSourcePath,
    );
  }

  ensureSidecarMetadata(sidecarData, sidecarSourcePath, sourceXmlSourcePath);

  if (!(await fs.pathExists(sourceXmlPath))) {
    createValidationError(
      INDEX_DOCS_AUTHORITY_VALIDATION_ERROR_CODES.SOURCE_XML_FILE_NOT_FOUND,
      'Expected index-docs XML source file was not found',
      '<file>',
      sourceXmlSourcePath,
    );
  }

  const compatibilityRows = await parseCompatibilityRows(compatibilityCatalogPath, compatibilityCatalogSourcePath);
  validateCompatibilityPrecedence({
    rows: compatibilityRows,
    displayName: String(sidecarData.displayName || '').trim(),
    workflowFilePath: compatibilityWorkflowFilePath,
    compatibilityCatalogSourcePath,
  });

  const canonicalId = INDEX_DOCS_LOCKED_CANONICAL_ID;
  const authoritativeRecords = buildIndexDocsAuthorityRecords({
    canonicalId,
    sidecarSourcePath,
    sourceXmlSourcePath,
  });

  return {
    canonicalId,
    authoritativePresenceKey: INDEX_DOCS_LOCKED_AUTHORITATIVE_PRESENCE_KEY,
    authoritativeRecords,
  };
}

module.exports = {
  INDEX_DOCS_AUTHORITY_VALIDATION_ERROR_CODES,
  IndexDocsAuthorityValidationError,
  validateIndexDocsAuthoritySplitAndPrecedence,
};

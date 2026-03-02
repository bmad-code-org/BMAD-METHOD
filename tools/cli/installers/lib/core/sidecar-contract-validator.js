const path = require('node:path');
const fs = require('fs-extra');
const yaml = require('yaml');
const { getProjectRoot, getSourcePath } = require('../../../lib/project-root');

const HELP_SIDECAR_REQUIRED_FIELDS = Object.freeze([
  'schemaVersion',
  'canonicalId',
  'artifactType',
  'module',
  'sourcePath',
  'displayName',
  'description',
  'dependencies',
]);

const HELP_SIDECAR_ERROR_CODES = Object.freeze({
  FILE_NOT_FOUND: 'ERR_HELP_SIDECAR_FILE_NOT_FOUND',
  PARSE_FAILED: 'ERR_HELP_SIDECAR_PARSE_FAILED',
  INVALID_ROOT_OBJECT: 'ERR_HELP_SIDECAR_INVALID_ROOT_OBJECT',
  REQUIRED_FIELD_MISSING: 'ERR_HELP_SIDECAR_REQUIRED_FIELD_MISSING',
  REQUIRED_FIELD_EMPTY: 'ERR_HELP_SIDECAR_REQUIRED_FIELD_EMPTY',
  ARTIFACT_TYPE_INVALID: 'ERR_HELP_SIDECAR_ARTIFACT_TYPE_INVALID',
  MODULE_INVALID: 'ERR_HELP_SIDECAR_MODULE_INVALID',
  DEPENDENCIES_MISSING: 'ERR_HELP_SIDECAR_DEPENDENCIES_MISSING',
  DEPENDENCIES_REQUIRES_INVALID: 'ERR_HELP_SIDECAR_DEPENDENCIES_REQUIRES_INVALID',
  DEPENDENCIES_REQUIRES_NOT_EMPTY: 'ERR_HELP_SIDECAR_DEPENDENCIES_REQUIRES_NOT_EMPTY',
  MAJOR_VERSION_UNSUPPORTED: 'ERR_SIDECAR_MAJOR_VERSION_UNSUPPORTED',
  SOURCEPATH_BASENAME_MISMATCH: 'ERR_SIDECAR_SOURCEPATH_BASENAME_MISMATCH',
});

const HELP_EXEMPLAR_CANONICAL_SOURCE_PATH = 'bmad-fork/src/core/tasks/help.md';
const HELP_EXEMPLAR_SUPPORTED_SCHEMA_MAJOR = 1;

class SidecarContractError extends Error {
  constructor({ code, detail, fieldPath, sourcePath }) {
    const message = `${code}: ${detail} (fieldPath=${fieldPath}, sourcePath=${sourcePath})`;
    super(message);
    this.name = 'SidecarContractError';
    this.code = code;
    this.detail = detail;
    this.fieldPath = fieldPath;
    this.sourcePath = sourcePath;
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

function parseSchemaMajorVersion(value) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.trunc(value);
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const match = trimmed.match(/^(\d+)(?:\.\d+)?$/);
    if (!match) return null;
    return Number.parseInt(match[1], 10);
  }

  return null;
}

function getExpectedSidecarBasenameFromSourcePath(sourcePathValue) {
  const normalized = normalizeSourcePath(sourcePathValue).trim();
  if (!normalized) return '';

  const sourceBasename = path.posix.basename(normalized);
  if (!sourceBasename) return '';

  const sourceExt = path.posix.extname(sourceBasename);
  const baseWithoutExt = sourceExt ? sourceBasename.slice(0, -sourceExt.length) : sourceBasename;
  if (!baseWithoutExt) return '';

  return `${baseWithoutExt}.artifact.yaml`;
}

function createValidationError(code, fieldPath, sourcePath, detail) {
  throw new SidecarContractError({
    code,
    fieldPath,
    sourcePath,
    detail,
  });
}

function validateHelpSidecarContractData(sidecarData, options = {}) {
  const sourcePath = normalizeSourcePath(options.errorSourcePath || 'src/core/tasks/help.artifact.yaml');

  if (!sidecarData || typeof sidecarData !== 'object' || Array.isArray(sidecarData)) {
    createValidationError(
      HELP_SIDECAR_ERROR_CODES.INVALID_ROOT_OBJECT,
      '<document>',
      sourcePath,
      'Sidecar root must be a YAML mapping object.',
    );
  }

  for (const field of HELP_SIDECAR_REQUIRED_FIELDS) {
    if (!hasOwn(sidecarData, field)) {
      if (field === 'dependencies') {
        createValidationError(
          HELP_SIDECAR_ERROR_CODES.DEPENDENCIES_MISSING,
          field,
          sourcePath,
          'Exemplar sidecar requires an explicit dependencies block.',
        );
      }

      createValidationError(
        HELP_SIDECAR_ERROR_CODES.REQUIRED_FIELD_MISSING,
        field,
        sourcePath,
        `Missing required sidecar field "${field}".`,
      );
    }
  }

  const requiredNonEmptyStringFields = ['canonicalId', 'sourcePath', 'displayName', 'description'];
  for (const field of requiredNonEmptyStringFields) {
    if (isBlankString(sidecarData[field])) {
      createValidationError(
        HELP_SIDECAR_ERROR_CODES.REQUIRED_FIELD_EMPTY,
        field,
        sourcePath,
        `Required sidecar field "${field}" must be a non-empty string.`,
      );
    }
  }

  const schemaMajorVersion = parseSchemaMajorVersion(sidecarData.schemaVersion);
  if (schemaMajorVersion !== HELP_EXEMPLAR_SUPPORTED_SCHEMA_MAJOR) {
    createValidationError(
      HELP_SIDECAR_ERROR_CODES.MAJOR_VERSION_UNSUPPORTED,
      'schemaVersion',
      sourcePath,
      'sidecar schema major version is unsupported',
    );
  }

  if (sidecarData.artifactType !== 'task') {
    createValidationError(
      HELP_SIDECAR_ERROR_CODES.ARTIFACT_TYPE_INVALID,
      'artifactType',
      sourcePath,
      'Wave-1 exemplar requires artifactType to equal "task".',
    );
  }

  if (sidecarData.module !== 'core') {
    createValidationError(
      HELP_SIDECAR_ERROR_CODES.MODULE_INVALID,
      'module',
      sourcePath,
      'Wave-1 exemplar requires module to equal "core".',
    );
  }

  const dependencies = sidecarData.dependencies;
  if (!dependencies || typeof dependencies !== 'object' || Array.isArray(dependencies)) {
    createValidationError(
      HELP_SIDECAR_ERROR_CODES.DEPENDENCIES_MISSING,
      'dependencies',
      sourcePath,
      'Exemplar sidecar requires an explicit dependencies object.',
    );
  }

  if (!hasOwn(dependencies, 'requires') || !Array.isArray(dependencies.requires)) {
    createValidationError(
      HELP_SIDECAR_ERROR_CODES.DEPENDENCIES_REQUIRES_INVALID,
      'dependencies.requires',
      sourcePath,
      'Exemplar dependencies.requires must be an array.',
    );
  }

  if (dependencies.requires.length > 0) {
    createValidationError(
      HELP_SIDECAR_ERROR_CODES.DEPENDENCIES_REQUIRES_NOT_EMPTY,
      'dependencies.requires',
      sourcePath,
      'Wave-1 exemplar requires explicit zero dependencies: dependencies.requires must be [].',
    );
  }

  const normalizedDeclaredSourcePath = normalizeSourcePath(sidecarData.sourcePath);
  const sidecarBasename = path.posix.basename(sourcePath);
  const expectedSidecarBasename = getExpectedSidecarBasenameFromSourcePath(normalizedDeclaredSourcePath);

  const sourcePathMismatch = normalizedDeclaredSourcePath !== HELP_EXEMPLAR_CANONICAL_SOURCE_PATH;
  const basenameMismatch = !expectedSidecarBasename || sidecarBasename !== expectedSidecarBasename;

  if (sourcePathMismatch || basenameMismatch) {
    createValidationError(
      HELP_SIDECAR_ERROR_CODES.SOURCEPATH_BASENAME_MISMATCH,
      'sourcePath',
      sourcePath,
      'sidecar basename does not match sourcePath basename',
    );
  }
}

async function validateHelpSidecarContractFile(sidecarPath = getSourcePath('core', 'tasks', 'help.artifact.yaml'), options = {}) {
  const normalizedSourcePath = normalizeSourcePath(options.errorSourcePath || toProjectRelativePath(sidecarPath));

  if (!(await fs.pathExists(sidecarPath))) {
    createValidationError(
      HELP_SIDECAR_ERROR_CODES.FILE_NOT_FOUND,
      '<file>',
      normalizedSourcePath,
      'Expected exemplar sidecar file was not found.',
    );
  }

  let parsedSidecar;
  try {
    const sidecarRaw = await fs.readFile(sidecarPath, 'utf8');
    parsedSidecar = yaml.parse(sidecarRaw);
  } catch (error) {
    createValidationError(
      HELP_SIDECAR_ERROR_CODES.PARSE_FAILED,
      '<document>',
      normalizedSourcePath,
      `YAML parse failure: ${error.message}`,
    );
  }

  validateHelpSidecarContractData(parsedSidecar, { errorSourcePath: normalizedSourcePath });
}

module.exports = {
  HELP_SIDECAR_REQUIRED_FIELDS,
  HELP_SIDECAR_ERROR_CODES,
  SidecarContractError,
  validateHelpSidecarContractData,
  validateHelpSidecarContractFile,
};

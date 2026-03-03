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

const SHARD_DOC_SIDECAR_REQUIRED_FIELDS = Object.freeze([...HELP_SIDECAR_REQUIRED_FIELDS]);

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

const SHARD_DOC_SIDECAR_ERROR_CODES = Object.freeze({
  FILE_NOT_FOUND: 'ERR_SHARD_DOC_SIDECAR_FILE_NOT_FOUND',
  PARSE_FAILED: 'ERR_SHARD_DOC_SIDECAR_PARSE_FAILED',
  INVALID_ROOT_OBJECT: 'ERR_SHARD_DOC_SIDECAR_INVALID_ROOT_OBJECT',
  REQUIRED_FIELD_MISSING: 'ERR_SHARD_DOC_SIDECAR_REQUIRED_FIELD_MISSING',
  REQUIRED_FIELD_EMPTY: 'ERR_SHARD_DOC_SIDECAR_REQUIRED_FIELD_EMPTY',
  ARTIFACT_TYPE_INVALID: 'ERR_SHARD_DOC_SIDECAR_ARTIFACT_TYPE_INVALID',
  MODULE_INVALID: 'ERR_SHARD_DOC_SIDECAR_MODULE_INVALID',
  DEPENDENCIES_MISSING: 'ERR_SHARD_DOC_SIDECAR_DEPENDENCIES_MISSING',
  DEPENDENCIES_REQUIRES_INVALID: 'ERR_SHARD_DOC_SIDECAR_DEPENDENCIES_REQUIRES_INVALID',
  DEPENDENCIES_REQUIRES_NOT_EMPTY: 'ERR_SHARD_DOC_SIDECAR_DEPENDENCIES_REQUIRES_NOT_EMPTY',
  MAJOR_VERSION_UNSUPPORTED: 'ERR_SHARD_DOC_SIDECAR_MAJOR_VERSION_UNSUPPORTED',
  SOURCEPATH_BASENAME_MISMATCH: 'ERR_SHARD_DOC_SIDECAR_SOURCEPATH_BASENAME_MISMATCH',
});

const HELP_EXEMPLAR_CANONICAL_SOURCE_PATH = 'bmad-fork/src/core/tasks/help.md';
const SHARD_DOC_CANONICAL_SOURCE_PATH = 'bmad-fork/src/core/tasks/shard-doc.xml';
const SIDECAR_SUPPORTED_SCHEMA_MAJOR = 1;

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

function validateSidecarContractData(sidecarData, options) {
  const {
    sourcePath,
    requiredFields,
    requiredNonEmptyStringFields,
    errorCodes,
    expectedArtifactType,
    expectedModule,
    expectedCanonicalSourcePath,
    missingDependenciesDetail,
    dependenciesObjectDetail,
    dependenciesRequiresArrayDetail,
    dependenciesRequiresNotEmptyDetail,
    artifactTypeDetail,
    moduleDetail,
    requiresMustBeEmpty,
  } = options;

  if (!sidecarData || typeof sidecarData !== 'object' || Array.isArray(sidecarData)) {
    createValidationError(errorCodes.INVALID_ROOT_OBJECT, '<document>', sourcePath, 'Sidecar root must be a YAML mapping object.');
  }

  for (const field of requiredFields) {
    if (!hasOwn(sidecarData, field)) {
      if (field === 'dependencies') {
        createValidationError(errorCodes.DEPENDENCIES_MISSING, field, sourcePath, missingDependenciesDetail);
      }

      createValidationError(errorCodes.REQUIRED_FIELD_MISSING, field, sourcePath, `Missing required sidecar field "${field}".`);
    }
  }

  for (const field of requiredNonEmptyStringFields) {
    if (isBlankString(sidecarData[field])) {
      createValidationError(
        errorCodes.REQUIRED_FIELD_EMPTY,
        field,
        sourcePath,
        `Required sidecar field "${field}" must be a non-empty string.`,
      );
    }
  }

  const schemaMajorVersion = parseSchemaMajorVersion(sidecarData.schemaVersion);
  if (schemaMajorVersion !== SIDECAR_SUPPORTED_SCHEMA_MAJOR) {
    createValidationError(errorCodes.MAJOR_VERSION_UNSUPPORTED, 'schemaVersion', sourcePath, 'sidecar schema major version is unsupported');
  }

  if (sidecarData.artifactType !== expectedArtifactType) {
    createValidationError(errorCodes.ARTIFACT_TYPE_INVALID, 'artifactType', sourcePath, artifactTypeDetail);
  }

  if (sidecarData.module !== expectedModule) {
    createValidationError(errorCodes.MODULE_INVALID, 'module', sourcePath, moduleDetail);
  }

  const dependencies = sidecarData.dependencies;
  if (!dependencies || typeof dependencies !== 'object' || Array.isArray(dependencies)) {
    createValidationError(errorCodes.DEPENDENCIES_MISSING, 'dependencies', sourcePath, dependenciesObjectDetail);
  }

  if (!hasOwn(dependencies, 'requires') || !Array.isArray(dependencies.requires)) {
    createValidationError(errorCodes.DEPENDENCIES_REQUIRES_INVALID, 'dependencies.requires', sourcePath, dependenciesRequiresArrayDetail);
  }

  if (requiresMustBeEmpty && dependencies.requires.length > 0) {
    createValidationError(
      errorCodes.DEPENDENCIES_REQUIRES_NOT_EMPTY,
      'dependencies.requires',
      sourcePath,
      dependenciesRequiresNotEmptyDetail,
    );
  }

  const normalizedDeclaredSourcePath = normalizeSourcePath(sidecarData.sourcePath);
  const sidecarBasename = path.posix.basename(sourcePath);
  const expectedSidecarBasename = getExpectedSidecarBasenameFromSourcePath(normalizedDeclaredSourcePath);

  const sourcePathMismatch = normalizedDeclaredSourcePath !== expectedCanonicalSourcePath;
  const basenameMismatch = !expectedSidecarBasename || sidecarBasename !== expectedSidecarBasename;

  if (sourcePathMismatch || basenameMismatch) {
    createValidationError(
      errorCodes.SOURCEPATH_BASENAME_MISMATCH,
      'sourcePath',
      sourcePath,
      'sidecar basename does not match sourcePath basename',
    );
  }
}

function validateHelpSidecarContractData(sidecarData, options = {}) {
  const sourcePath = normalizeSourcePath(options.errorSourcePath || 'src/core/tasks/help.artifact.yaml');
  validateSidecarContractData(sidecarData, {
    sourcePath,
    requiredFields: HELP_SIDECAR_REQUIRED_FIELDS,
    requiredNonEmptyStringFields: ['canonicalId', 'sourcePath', 'displayName', 'description'],
    errorCodes: HELP_SIDECAR_ERROR_CODES,
    expectedArtifactType: 'task',
    expectedModule: 'core',
    expectedCanonicalSourcePath: HELP_EXEMPLAR_CANONICAL_SOURCE_PATH,
    missingDependenciesDetail: 'Exemplar sidecar requires an explicit dependencies block.',
    dependenciesObjectDetail: 'Exemplar sidecar requires an explicit dependencies object.',
    dependenciesRequiresArrayDetail: 'Exemplar dependencies.requires must be an array.',
    dependenciesRequiresNotEmptyDetail: 'Wave-1 exemplar requires explicit zero dependencies: dependencies.requires must be [].',
    artifactTypeDetail: 'Wave-1 exemplar requires artifactType to equal "task".',
    moduleDetail: 'Wave-1 exemplar requires module to equal "core".',
    requiresMustBeEmpty: true,
  });
}

function validateShardDocSidecarContractData(sidecarData, options = {}) {
  const sourcePath = normalizeSourcePath(options.errorSourcePath || 'src/core/tasks/shard-doc.artifact.yaml');
  validateSidecarContractData(sidecarData, {
    sourcePath,
    requiredFields: SHARD_DOC_SIDECAR_REQUIRED_FIELDS,
    requiredNonEmptyStringFields: ['canonicalId', 'sourcePath', 'displayName', 'description'],
    errorCodes: SHARD_DOC_SIDECAR_ERROR_CODES,
    expectedArtifactType: 'task',
    expectedModule: 'core',
    expectedCanonicalSourcePath: SHARD_DOC_CANONICAL_SOURCE_PATH,
    missingDependenciesDetail: 'Shard-doc sidecar requires an explicit dependencies block.',
    dependenciesObjectDetail: 'Shard-doc sidecar requires an explicit dependencies object.',
    dependenciesRequiresArrayDetail: 'Shard-doc dependencies.requires must be an array.',
    dependenciesRequiresNotEmptyDetail: 'Wave-2 shard-doc contract requires explicit zero dependencies: dependencies.requires must be [].',
    artifactTypeDetail: 'Wave-2 shard-doc contract requires artifactType to equal "task".',
    moduleDetail: 'Wave-2 shard-doc contract requires module to equal "core".',
    requiresMustBeEmpty: true,
  });
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

async function validateShardDocSidecarContractFile(sidecarPath = getSourcePath('core', 'tasks', 'shard-doc.artifact.yaml'), options = {}) {
  const normalizedSourcePath = normalizeSourcePath(options.errorSourcePath || toProjectRelativePath(sidecarPath));

  if (!(await fs.pathExists(sidecarPath))) {
    createValidationError(
      SHARD_DOC_SIDECAR_ERROR_CODES.FILE_NOT_FOUND,
      '<file>',
      normalizedSourcePath,
      'Expected shard-doc sidecar file was not found.',
    );
  }

  let parsedSidecar;
  try {
    const sidecarRaw = await fs.readFile(sidecarPath, 'utf8');
    parsedSidecar = yaml.parse(sidecarRaw);
  } catch (error) {
    createValidationError(
      SHARD_DOC_SIDECAR_ERROR_CODES.PARSE_FAILED,
      '<document>',
      normalizedSourcePath,
      `YAML parse failure: ${error.message}`,
    );
  }

  validateShardDocSidecarContractData(parsedSidecar, { errorSourcePath: normalizedSourcePath });
}

module.exports = {
  HELP_SIDECAR_REQUIRED_FIELDS,
  SHARD_DOC_SIDECAR_REQUIRED_FIELDS,
  HELP_SIDECAR_ERROR_CODES,
  SHARD_DOC_SIDECAR_ERROR_CODES,
  SidecarContractError,
  validateHelpSidecarContractData,
  validateHelpSidecarContractFile,
  validateShardDocSidecarContractData,
  validateShardDocSidecarContractFile,
};

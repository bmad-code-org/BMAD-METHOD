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
const INDEX_DOCS_SIDECAR_REQUIRED_FIELDS = Object.freeze([...HELP_SIDECAR_REQUIRED_FIELDS]);

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
  METADATA_FILENAME_AMBIGUOUS: 'ERR_HELP_SIDECAR_METADATA_FILENAME_AMBIGUOUS',
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
  METADATA_FILENAME_AMBIGUOUS: 'ERR_SHARD_DOC_SIDECAR_METADATA_FILENAME_AMBIGUOUS',
});

const INDEX_DOCS_SIDECAR_ERROR_CODES = Object.freeze({
  FILE_NOT_FOUND: 'ERR_INDEX_DOCS_SIDECAR_FILE_NOT_FOUND',
  PARSE_FAILED: 'ERR_INDEX_DOCS_SIDECAR_PARSE_FAILED',
  INVALID_ROOT_OBJECT: 'ERR_INDEX_DOCS_SIDECAR_INVALID_ROOT_OBJECT',
  REQUIRED_FIELD_MISSING: 'ERR_INDEX_DOCS_SIDECAR_REQUIRED_FIELD_MISSING',
  REQUIRED_FIELD_EMPTY: 'ERR_INDEX_DOCS_SIDECAR_REQUIRED_FIELD_EMPTY',
  ARTIFACT_TYPE_INVALID: 'ERR_INDEX_DOCS_SIDECAR_ARTIFACT_TYPE_INVALID',
  MODULE_INVALID: 'ERR_INDEX_DOCS_SIDECAR_MODULE_INVALID',
  DEPENDENCIES_MISSING: 'ERR_INDEX_DOCS_SIDECAR_DEPENDENCIES_MISSING',
  DEPENDENCIES_REQUIRES_INVALID: 'ERR_INDEX_DOCS_SIDECAR_DEPENDENCIES_REQUIRES_INVALID',
  DEPENDENCIES_REQUIRES_NOT_EMPTY: 'ERR_INDEX_DOCS_SIDECAR_DEPENDENCIES_REQUIRES_NOT_EMPTY',
  MAJOR_VERSION_UNSUPPORTED: 'ERR_INDEX_DOCS_SIDECAR_MAJOR_VERSION_UNSUPPORTED',
  SOURCEPATH_BASENAME_MISMATCH: 'ERR_INDEX_DOCS_SIDECAR_SOURCEPATH_BASENAME_MISMATCH',
  METADATA_FILENAME_AMBIGUOUS: 'ERR_INDEX_DOCS_SIDECAR_METADATA_FILENAME_AMBIGUOUS',
});

const HELP_EXEMPLAR_CANONICAL_SOURCE_PATH = 'bmad-fork/src/core/tasks/help.md';
const SHARD_DOC_CANONICAL_SOURCE_PATH = 'bmad-fork/src/core/tasks/shard-doc.xml';
const INDEX_DOCS_CANONICAL_SOURCE_PATH = 'bmad-fork/src/core/tasks/index-docs.xml';
const SKILL_METADATA_CANONICAL_FILENAME = 'skill-manifest.yaml';
const SKILL_METADATA_LEGACY_FILENAMES = Object.freeze(['bmad-config.yaml', 'manifest.yaml']);
const SKILL_METADATA_DERIVATION_MODES = Object.freeze({
  CANONICAL: 'canonical',
  LEGACY_FALLBACK: 'legacy-fallback',
});
const SKILL_METADATA_RESOLUTION_ERROR_CODES = Object.freeze({
  AMBIGUOUS_MATCH: 'ERR_SKILL_METADATA_FILENAME_AMBIGUOUS',
});
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

function toProjectRelativePath(filePath, projectRoot = getProjectRoot()) {
  const relative = path.relative(projectRoot, filePath);

  if (!relative || relative.startsWith('..')) {
    return normalizeSourcePath(path.resolve(filePath));
  }

  return normalizeSourcePath(relative);
}

function dedupeAndSort(values) {
  const normalized = new Set();
  for (const value of values || []) {
    const text = normalizeSourcePath(value).trim();
    if (text.length > 0) {
      normalized.add(text);
    }
  }
  return [...normalized].sort((left, right) => left.localeCompare(right));
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

function classifyMetadataFilename(filename) {
  const normalizedFilename = String(filename || '')
    .trim()
    .toLowerCase();
  if (normalizedFilename === SKILL_METADATA_CANONICAL_FILENAME) {
    return SKILL_METADATA_DERIVATION_MODES.CANONICAL;
  }
  if (SKILL_METADATA_LEGACY_FILENAMES.includes(normalizedFilename) || normalizedFilename.endsWith('.artifact.yaml')) {
    return SKILL_METADATA_DERIVATION_MODES.LEGACY_FALLBACK;
  }
  return SKILL_METADATA_DERIVATION_MODES.LEGACY_FALLBACK;
}

function getMetadataStemFromSourcePath(sourcePathValue) {
  const normalizedSourcePath = normalizeSourcePath(sourcePathValue).trim();
  if (!normalizedSourcePath) return '';

  const sourceBasename = path.posix.basename(normalizedSourcePath);
  if (!sourceBasename) return '';

  const sourceExt = path.posix.extname(sourceBasename);
  const baseWithoutExt = sourceExt ? sourceBasename.slice(0, -sourceExt.length) : sourceBasename;
  return baseWithoutExt.trim();
}

function buildSkillMetadataResolutionPlan({ sourceFilePath, projectRoot = getProjectRoot() }) {
  const absoluteSourceFilePath = path.resolve(sourceFilePath);
  const sourceDirAbsolutePath = path.dirname(absoluteSourceFilePath);
  const metadataStem = getMetadataStemFromSourcePath(absoluteSourceFilePath);
  const skillFolderAbsolutePath = path.join(sourceDirAbsolutePath, metadataStem);
  const canonicalTargetAbsolutePath = path.join(skillFolderAbsolutePath, SKILL_METADATA_CANONICAL_FILENAME);

  const candidateGroups = [
    {
      precedenceToken: SKILL_METADATA_CANONICAL_FILENAME,
      derivationMode: SKILL_METADATA_DERIVATION_MODES.CANONICAL,
      // Canonical authority is per-skill only; root task-folder canonical files are not eligible.
      explicitCandidates: [canonicalTargetAbsolutePath],
      wildcardDirectories: [],
    },
    {
      precedenceToken: 'bmad-config.yaml',
      derivationMode: SKILL_METADATA_DERIVATION_MODES.LEGACY_FALLBACK,
      explicitCandidates: [path.join(skillFolderAbsolutePath, 'bmad-config.yaml'), path.join(sourceDirAbsolutePath, 'bmad-config.yaml')],
      wildcardDirectories: [],
    },
    {
      precedenceToken: 'manifest.yaml',
      derivationMode: SKILL_METADATA_DERIVATION_MODES.LEGACY_FALLBACK,
      explicitCandidates: [path.join(skillFolderAbsolutePath, 'manifest.yaml'), path.join(sourceDirAbsolutePath, 'manifest.yaml')],
      wildcardDirectories: [],
    },
    {
      precedenceToken: `${metadataStem}.artifact.yaml`,
      derivationMode: SKILL_METADATA_DERIVATION_MODES.LEGACY_FALLBACK,
      explicitCandidates: [
        path.join(sourceDirAbsolutePath, `${metadataStem}.artifact.yaml`),
        path.join(skillFolderAbsolutePath, `${metadataStem}.artifact.yaml`),
      ],
      wildcardDirectories: [],
    },
  ];

  return {
    metadataStem,
    canonicalTargetAbsolutePath,
    canonicalTargetSourcePath: toProjectRelativePath(canonicalTargetAbsolutePath, projectRoot),
    candidateGroups,
  };
}

async function resolveCandidateGroupMatches(group = {}) {
  const explicitMatches = [];
  for (const candidatePath of group.explicitCandidates || []) {
    if (await fs.pathExists(candidatePath)) {
      explicitMatches.push(path.resolve(candidatePath));
    }
  }

  const wildcardMatches = [];
  for (const wildcardDirectory of group.wildcardDirectories || []) {
    if (!(await fs.pathExists(wildcardDirectory))) {
      continue;
    }
    const directoryEntries = await fs.readdir(wildcardDirectory, { withFileTypes: true });
    for (const entry of directoryEntries) {
      if (!entry.isFile()) continue;
      const filename = String(entry.name || '').trim();
      if (!filename.toLowerCase().endsWith('.artifact.yaml')) continue;
      wildcardMatches.push(path.join(wildcardDirectory, filename));
    }
  }

  return dedupeAndSort([...explicitMatches, ...wildcardMatches]);
}

async function resolveSkillMetadataAuthority({
  sourceFilePath,
  metadataPath = '',
  metadataSourcePath = '',
  projectRoot = getProjectRoot(),
  ambiguousErrorCode = SKILL_METADATA_RESOLUTION_ERROR_CODES.AMBIGUOUS_MATCH,
}) {
  const resolutionPlan = buildSkillMetadataResolutionPlan({
    sourceFilePath,
    projectRoot,
  });

  const resolvedMetadataPath = String(metadataPath || '').trim();
  if (resolvedMetadataPath.length > 0) {
    const resolvedAbsolutePath = path.resolve(resolvedMetadataPath);
    const resolvedFilename = path.posix.basename(normalizeSourcePath(resolvedAbsolutePath));
    return {
      resolvedAbsolutePath,
      resolvedSourcePath: normalizeSourcePath(metadataSourcePath || toProjectRelativePath(resolvedAbsolutePath, projectRoot)),
      resolvedFilename,
      canonicalTargetFilename: SKILL_METADATA_CANONICAL_FILENAME,
      canonicalTargetSourcePath: resolutionPlan.canonicalTargetSourcePath,
      derivationMode: classifyMetadataFilename(resolvedFilename),
      precedenceToken: resolvedFilename,
    };
  }

  for (const group of resolutionPlan.candidateGroups) {
    const matches = await resolveCandidateGroupMatches(group);
    if (matches.length === 0) {
      continue;
    }

    if (matches.length > 1) {
      throw new SidecarContractError({
        code: ambiguousErrorCode,
        detail: `metadata filename resolution is ambiguous for precedence "${group.precedenceToken}": ${matches.join('|')}`,
        fieldPath: '<file>',
        sourcePath: resolutionPlan.canonicalTargetSourcePath,
      });
    }

    const resolvedAbsolutePath = matches[0];
    const resolvedFilename = path.posix.basename(normalizeSourcePath(resolvedAbsolutePath));
    return {
      resolvedAbsolutePath,
      resolvedSourcePath: normalizeSourcePath(toProjectRelativePath(resolvedAbsolutePath, projectRoot)),
      resolvedFilename,
      canonicalTargetFilename: SKILL_METADATA_CANONICAL_FILENAME,
      canonicalTargetSourcePath: resolutionPlan.canonicalTargetSourcePath,
      derivationMode: group.derivationMode,
      precedenceToken: group.precedenceToken,
    };
  }

  return {
    resolvedAbsolutePath: '',
    resolvedSourcePath: '',
    resolvedFilename: '',
    canonicalTargetFilename: SKILL_METADATA_CANONICAL_FILENAME,
    canonicalTargetSourcePath: resolutionPlan.canonicalTargetSourcePath,
    derivationMode: '',
    precedenceToken: '',
  };
}

function getExpectedLegacyArtifactBasenameFromSourcePath(sourcePathValue) {
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
  const sidecarBasename = path.posix.basename(normalizeSourcePath(sourcePath)).toLowerCase();
  const expectedLegacyArtifactBasename = getExpectedLegacyArtifactBasenameFromSourcePath(normalizedDeclaredSourcePath).toLowerCase();
  const allowedMetadataBasenames = new Set([SKILL_METADATA_CANONICAL_FILENAME, ...SKILL_METADATA_LEGACY_FILENAMES]);
  if (expectedLegacyArtifactBasename.length > 0) {
    allowedMetadataBasenames.add(expectedLegacyArtifactBasename);
  }

  const sourcePathMismatch = normalizedDeclaredSourcePath !== expectedCanonicalSourcePath;
  const basenameMismatch = !allowedMetadataBasenames.has(sidecarBasename);

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
  const sourcePath = normalizeSourcePath(options.errorSourcePath || 'src/core/tasks/help/skill-manifest.yaml');
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
    dependenciesRequiresNotEmptyDetail: 'help exemplar requires explicit zero dependencies: dependencies.requires must be [].',
    artifactTypeDetail: 'help exemplar requires artifactType to equal "task".',
    moduleDetail: 'help exemplar requires module to equal "core".',
    requiresMustBeEmpty: true,
  });
}

function validateShardDocSidecarContractData(sidecarData, options = {}) {
  const sourcePath = normalizeSourcePath(options.errorSourcePath || 'src/core/tasks/shard-doc/skill-manifest.yaml');
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
    dependenciesRequiresNotEmptyDetail: 'Shard-doc contract requires explicit zero dependencies: dependencies.requires must be [].',
    artifactTypeDetail: 'Shard-doc contract requires artifactType to equal "task".',
    moduleDetail: 'Shard-doc contract requires module to equal "core".',
    requiresMustBeEmpty: true,
  });
}

function validateIndexDocsSidecarContractData(sidecarData, options = {}) {
  const sourcePath = normalizeSourcePath(options.errorSourcePath || 'src/core/tasks/index-docs/skill-manifest.yaml');
  validateSidecarContractData(sidecarData, {
    sourcePath,
    requiredFields: INDEX_DOCS_SIDECAR_REQUIRED_FIELDS,
    requiredNonEmptyStringFields: ['canonicalId', 'sourcePath', 'displayName', 'description'],
    errorCodes: INDEX_DOCS_SIDECAR_ERROR_CODES,
    expectedArtifactType: 'task',
    expectedModule: 'core',
    expectedCanonicalSourcePath: INDEX_DOCS_CANONICAL_SOURCE_PATH,
    missingDependenciesDetail: 'Index-docs sidecar requires an explicit dependencies block.',
    dependenciesObjectDetail: 'Index-docs sidecar requires an explicit dependencies object.',
    dependenciesRequiresArrayDetail: 'Index-docs dependencies.requires must be an array.',
    dependenciesRequiresNotEmptyDetail: 'Index-docs contract requires explicit zero dependencies: dependencies.requires must be [].',
    artifactTypeDetail: 'Index-docs contract requires artifactType to equal "task".',
    moduleDetail: 'Index-docs contract requires module to equal "core".',
    requiresMustBeEmpty: true,
  });
}

async function validateHelpSidecarContractFile(sidecarPath = '', options = {}) {
  const sourceFilePath = options.sourceFilePath || getSourcePath('core', 'tasks', 'help.md');
  const resolvedMetadataAuthority = await resolveSkillMetadataAuthority({
    sourceFilePath,
    metadataPath: sidecarPath,
    metadataSourcePath: options.errorSourcePath,
    ambiguousErrorCode: HELP_SIDECAR_ERROR_CODES.METADATA_FILENAME_AMBIGUOUS,
  });
  const resolvedSidecarPath = resolvedMetadataAuthority.resolvedAbsolutePath;
  const normalizedSourcePath = normalizeSourcePath(
    options.errorSourcePath || resolvedMetadataAuthority.resolvedSourcePath || resolvedMetadataAuthority.canonicalTargetSourcePath,
  );

  if (!resolvedSidecarPath || !(await fs.pathExists(resolvedSidecarPath))) {
    createValidationError(
      HELP_SIDECAR_ERROR_CODES.FILE_NOT_FOUND,
      '<file>',
      normalizedSourcePath,
      'Expected exemplar sidecar file was not found.',
    );
  }

  let parsedSidecar;
  try {
    const sidecarRaw = await fs.readFile(resolvedSidecarPath, 'utf8');
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
  return resolvedMetadataAuthority;
}

async function validateShardDocSidecarContractFile(sidecarPath = '', options = {}) {
  const sourceFilePath = options.sourceFilePath || getSourcePath('core', 'tasks', 'shard-doc.xml');
  const resolvedMetadataAuthority = await resolveSkillMetadataAuthority({
    sourceFilePath,
    metadataPath: sidecarPath,
    metadataSourcePath: options.errorSourcePath,
    ambiguousErrorCode: SHARD_DOC_SIDECAR_ERROR_CODES.METADATA_FILENAME_AMBIGUOUS,
  });
  const resolvedSidecarPath = resolvedMetadataAuthority.resolvedAbsolutePath;
  const normalizedSourcePath = normalizeSourcePath(
    options.errorSourcePath || resolvedMetadataAuthority.resolvedSourcePath || resolvedMetadataAuthority.canonicalTargetSourcePath,
  );

  if (!resolvedSidecarPath || !(await fs.pathExists(resolvedSidecarPath))) {
    createValidationError(
      SHARD_DOC_SIDECAR_ERROR_CODES.FILE_NOT_FOUND,
      '<file>',
      normalizedSourcePath,
      'Expected shard-doc sidecar file was not found.',
    );
  }

  let parsedSidecar;
  try {
    const sidecarRaw = await fs.readFile(resolvedSidecarPath, 'utf8');
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
  return resolvedMetadataAuthority;
}

async function validateIndexDocsSidecarContractFile(sidecarPath = '', options = {}) {
  const sourceFilePath = options.sourceFilePath || getSourcePath('core', 'tasks', 'index-docs.xml');
  const resolvedMetadataAuthority = await resolveSkillMetadataAuthority({
    sourceFilePath,
    metadataPath: sidecarPath,
    metadataSourcePath: options.errorSourcePath,
    ambiguousErrorCode: INDEX_DOCS_SIDECAR_ERROR_CODES.METADATA_FILENAME_AMBIGUOUS,
  });
  const resolvedSidecarPath = resolvedMetadataAuthority.resolvedAbsolutePath;
  const normalizedSourcePath = normalizeSourcePath(
    options.errorSourcePath || resolvedMetadataAuthority.resolvedSourcePath || resolvedMetadataAuthority.canonicalTargetSourcePath,
  );

  if (!resolvedSidecarPath || !(await fs.pathExists(resolvedSidecarPath))) {
    createValidationError(
      INDEX_DOCS_SIDECAR_ERROR_CODES.FILE_NOT_FOUND,
      '<file>',
      normalizedSourcePath,
      'Expected index-docs sidecar file was not found.',
    );
  }

  let parsedSidecar;
  try {
    const sidecarRaw = await fs.readFile(resolvedSidecarPath, 'utf8');
    parsedSidecar = yaml.parse(sidecarRaw);
  } catch (error) {
    createValidationError(
      INDEX_DOCS_SIDECAR_ERROR_CODES.PARSE_FAILED,
      '<document>',
      normalizedSourcePath,
      `YAML parse failure: ${error.message}`,
    );
  }

  validateIndexDocsSidecarContractData(parsedSidecar, { errorSourcePath: normalizedSourcePath });
  return resolvedMetadataAuthority;
}

module.exports = {
  HELP_SIDECAR_REQUIRED_FIELDS,
  SHARD_DOC_SIDECAR_REQUIRED_FIELDS,
  INDEX_DOCS_SIDECAR_REQUIRED_FIELDS,
  HELP_SIDECAR_ERROR_CODES,
  SHARD_DOC_SIDECAR_ERROR_CODES,
  INDEX_DOCS_SIDECAR_ERROR_CODES,
  SKILL_METADATA_CANONICAL_FILENAME,
  SKILL_METADATA_DERIVATION_MODES,
  SKILL_METADATA_LEGACY_FILENAMES,
  SKILL_METADATA_RESOLUTION_ERROR_CODES,
  SidecarContractError,
  resolveSkillMetadataAuthority,
  validateHelpSidecarContractData,
  validateHelpSidecarContractFile,
  validateShardDocSidecarContractData,
  validateShardDocSidecarContractFile,
  validateIndexDocsSidecarContractData,
  validateIndexDocsSidecarContractFile,
};

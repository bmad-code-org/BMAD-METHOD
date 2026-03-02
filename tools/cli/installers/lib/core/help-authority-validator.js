const path = require('node:path');
const fs = require('fs-extra');
const yaml = require('yaml');
const { getProjectRoot, getSourcePath } = require('../../../lib/project-root');
const { normalizeAndResolveExemplarAlias } = require('./help-alias-normalizer');

const HELP_AUTHORITY_VALIDATION_ERROR_CODES = Object.freeze({
  SIDECAR_FILE_NOT_FOUND: 'ERR_HELP_AUTHORITY_SIDECAR_FILE_NOT_FOUND',
  SIDECAR_PARSE_FAILED: 'ERR_HELP_AUTHORITY_SIDECAR_PARSE_FAILED',
  SIDECAR_INVALID_METADATA: 'ERR_HELP_AUTHORITY_SIDECAR_INVALID_METADATA',
  MARKDOWN_FILE_NOT_FOUND: 'ERR_HELP_AUTHORITY_MARKDOWN_FILE_NOT_FOUND',
  FRONTMATTER_PARSE_FAILED: 'ERR_HELP_AUTHORITY_FRONTMATTER_PARSE_FAILED',
});

const HELP_FRONTMATTER_MISMATCH_ERROR_CODES = Object.freeze({
  CANONICAL_ID_MISMATCH: 'ERR_FRONTMATTER_CANONICAL_ID_MISMATCH',
  DISPLAY_NAME_MISMATCH: 'ERR_FRONTMATTER_DISPLAY_NAME_MISMATCH',
  DESCRIPTION_MISMATCH: 'ERR_FRONTMATTER_DESCRIPTION_MISMATCH',
  DEPENDENCIES_REQUIRES_MISMATCH: 'ERR_FRONTMATTER_DEPENDENCIES_REQUIRES_MISMATCH',
});

const FRONTMATTER_MISMATCH_DETAILS = Object.freeze({
  [HELP_FRONTMATTER_MISMATCH_ERROR_CODES.CANONICAL_ID_MISMATCH]: 'frontmatter canonicalId must match sidecar canonicalId',
  [HELP_FRONTMATTER_MISMATCH_ERROR_CODES.DISPLAY_NAME_MISMATCH]: 'frontmatter name must match sidecar displayName',
  [HELP_FRONTMATTER_MISMATCH_ERROR_CODES.DESCRIPTION_MISMATCH]: 'frontmatter description must match sidecar description',
  [HELP_FRONTMATTER_MISMATCH_ERROR_CODES.DEPENDENCIES_REQUIRES_MISMATCH]:
    'frontmatter dependencies.requires must match sidecar dependencies.requires',
});

class HelpAuthorityValidationError extends Error {
  constructor({ code, detail, fieldPath, sourcePath, observedValue, expectedValue }) {
    const message = `${code}: ${detail} (fieldPath=${fieldPath}, sourcePath=${sourcePath})`;
    super(message);
    this.name = 'HelpAuthorityValidationError';
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

function ensureSidecarMetadata(sidecarData, sidecarSourcePath) {
  const requiredFields = ['canonicalId', 'displayName', 'description', 'dependencies'];
  for (const requiredField of requiredFields) {
    if (!hasOwn(sidecarData, requiredField)) {
      throw new HelpAuthorityValidationError({
        code: HELP_AUTHORITY_VALIDATION_ERROR_CODES.SIDECAR_INVALID_METADATA,
        detail: `Missing required sidecar metadata field "${requiredField}"`,
        fieldPath: requiredField,
        sourcePath: sidecarSourcePath,
      });
    }
  }

  const requiredStringFields = ['canonicalId', 'displayName', 'description'];
  for (const requiredStringField of requiredStringFields) {
    if (isBlankString(sidecarData[requiredStringField])) {
      throw new HelpAuthorityValidationError({
        code: HELP_AUTHORITY_VALIDATION_ERROR_CODES.SIDECAR_INVALID_METADATA,
        detail: `Required sidecar metadata field "${requiredStringField}" must be a non-empty string`,
        fieldPath: requiredStringField,
        sourcePath: sidecarSourcePath,
      });
    }
  }

  const requires = sidecarData.dependencies?.requires;
  if (!Array.isArray(requires)) {
    throw new HelpAuthorityValidationError({
      code: HELP_AUTHORITY_VALIDATION_ERROR_CODES.SIDECAR_INVALID_METADATA,
      detail: 'Sidecar metadata field "dependencies.requires" must be an array',
      fieldPath: 'dependencies.requires',
      sourcePath: sidecarSourcePath,
      observedValue: requires,
      expectedValue: [],
    });
  }
}

function serializeNormalizedDependencyTargets(value) {
  if (!Array.isArray(value)) return null;

  const normalized = value
    .map((target) =>
      String(target ?? '')
        .trim()
        .toLowerCase(),
    )
    .filter((target) => target.length > 0)
    .sort();

  return JSON.stringify(normalized);
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

function createFrontmatterMismatchError(code, fieldPath, sourcePath, observedValue, expectedValue) {
  throw new HelpAuthorityValidationError({
    code,
    detail: FRONTMATTER_MISMATCH_DETAILS[code],
    fieldPath,
    sourcePath,
    observedValue,
    expectedValue,
  });
}

function validateFrontmatterPrecedence(frontmatter, sidecarData, markdownSourcePath) {
  if (!frontmatter || typeof frontmatter !== 'object' || Array.isArray(frontmatter)) {
    return;
  }

  const sidecarCanonicalId = frontmatterMatchValue(sidecarData.canonicalId);
  const sidecarDisplayName = frontmatterMatchValue(sidecarData.displayName);
  const sidecarDescription = frontmatterMatchValue(sidecarData.description);

  if (hasOwn(frontmatter, 'canonicalId')) {
    const observedCanonicalId = frontmatterMatchValue(frontmatter.canonicalId);
    if (observedCanonicalId.length > 0 && observedCanonicalId !== sidecarCanonicalId) {
      createFrontmatterMismatchError(
        HELP_FRONTMATTER_MISMATCH_ERROR_CODES.CANONICAL_ID_MISMATCH,
        'canonicalId',
        markdownSourcePath,
        observedCanonicalId,
        sidecarCanonicalId,
      );
    }
  }

  if (hasOwn(frontmatter, 'name')) {
    const observedName = frontmatterMatchValue(frontmatter.name);
    if (observedName.length > 0 && observedName !== sidecarDisplayName) {
      createFrontmatterMismatchError(
        HELP_FRONTMATTER_MISMATCH_ERROR_CODES.DISPLAY_NAME_MISMATCH,
        'name',
        markdownSourcePath,
        observedName,
        sidecarDisplayName,
      );
    }
  }

  if (hasOwn(frontmatter, 'description')) {
    const observedDescription = frontmatterMatchValue(frontmatter.description);
    if (observedDescription.length > 0 && observedDescription !== sidecarDescription) {
      createFrontmatterMismatchError(
        HELP_FRONTMATTER_MISMATCH_ERROR_CODES.DESCRIPTION_MISMATCH,
        'description',
        markdownSourcePath,
        observedDescription,
        sidecarDescription,
      );
    }
  }

  const hasDependencyRequires =
    frontmatter.dependencies &&
    typeof frontmatter.dependencies === 'object' &&
    !Array.isArray(frontmatter.dependencies) &&
    hasOwn(frontmatter.dependencies, 'requires');

  if (hasDependencyRequires) {
    const observedSerialized = serializeNormalizedDependencyTargets(frontmatter.dependencies.requires);
    const expectedSerialized = serializeNormalizedDependencyTargets(sidecarData.dependencies.requires);

    if (observedSerialized === null || observedSerialized !== expectedSerialized) {
      createFrontmatterMismatchError(
        HELP_FRONTMATTER_MISMATCH_ERROR_CODES.DEPENDENCIES_REQUIRES_MISMATCH,
        'dependencies.requires',
        markdownSourcePath,
        observedSerialized,
        expectedSerialized,
      );
    }
  }
}

async function parseMarkdownFrontmatter(markdownPath, markdownSourcePath) {
  if (!(await fs.pathExists(markdownPath))) {
    throw new HelpAuthorityValidationError({
      code: HELP_AUTHORITY_VALIDATION_ERROR_CODES.MARKDOWN_FILE_NOT_FOUND,
      detail: 'Expected markdown surface file was not found',
      fieldPath: '<file>',
      sourcePath: markdownSourcePath,
    });
  }

  let markdownRaw;
  try {
    markdownRaw = await fs.readFile(markdownPath, 'utf8');
  } catch (error) {
    throw new HelpAuthorityValidationError({
      code: HELP_AUTHORITY_VALIDATION_ERROR_CODES.FRONTMATTER_PARSE_FAILED,
      detail: `Unable to read markdown content: ${error.message}`,
      fieldPath: '<document>',
      sourcePath: markdownSourcePath,
    });
  }

  const frontmatterMatch = markdownRaw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!frontmatterMatch) {
    return {};
  }

  try {
    const parsed = yaml.parse(frontmatterMatch[1]);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {};
    }
    return parsed;
  } catch (error) {
    throw new HelpAuthorityValidationError({
      code: HELP_AUTHORITY_VALIDATION_ERROR_CODES.FRONTMATTER_PARSE_FAILED,
      detail: `YAML frontmatter parse failure: ${error.message}`,
      fieldPath: '<frontmatter>',
      sourcePath: markdownSourcePath,
    });
  }
}

function buildHelpAuthorityRecords({ canonicalId, sidecarSourcePath, sourceMarkdownSourcePath }) {
  const authoritativePresenceKey = `capability:${canonicalId}`;

  return [
    {
      recordType: 'metadata-authority',
      canonicalId,
      authoritativePresenceKey,
      authoritySourceType: 'sidecar',
      authoritySourcePath: sidecarSourcePath,
      sourcePath: sourceMarkdownSourcePath,
    },
    {
      recordType: 'source-body-authority',
      canonicalId,
      authoritativePresenceKey,
      authoritySourceType: 'source-markdown',
      authoritySourcePath: sourceMarkdownSourcePath,
      sourcePath: sourceMarkdownSourcePath,
    },
  ];
}

async function validateHelpAuthoritySplitAndPrecedence(options = {}) {
  const sidecarPath = options.sidecarPath || getSourcePath('core', 'tasks', 'help.artifact.yaml');
  const sourceMarkdownPath = options.sourceMarkdownPath || getSourcePath('core', 'tasks', 'help.md');
  const runtimeMarkdownPath = options.runtimeMarkdownPath || '';

  const sidecarSourcePath = normalizeSourcePath(options.sidecarSourcePath || toProjectRelativePath(sidecarPath));
  const sourceMarkdownSourcePath = normalizeSourcePath(options.sourceMarkdownSourcePath || toProjectRelativePath(sourceMarkdownPath));
  const runtimeMarkdownSourcePath = normalizeSourcePath(
    options.runtimeMarkdownSourcePath || (runtimeMarkdownPath ? toProjectRelativePath(runtimeMarkdownPath) : ''),
  );

  if (!(await fs.pathExists(sidecarPath))) {
    throw new HelpAuthorityValidationError({
      code: HELP_AUTHORITY_VALIDATION_ERROR_CODES.SIDECAR_FILE_NOT_FOUND,
      detail: 'Expected sidecar metadata file was not found',
      fieldPath: '<file>',
      sourcePath: sidecarSourcePath,
    });
  }

  let sidecarData;
  try {
    const sidecarRaw = await fs.readFile(sidecarPath, 'utf8');
    sidecarData = yaml.parse(sidecarRaw);
  } catch (error) {
    throw new HelpAuthorityValidationError({
      code: HELP_AUTHORITY_VALIDATION_ERROR_CODES.SIDECAR_PARSE_FAILED,
      detail: `YAML parse failure: ${error.message}`,
      fieldPath: '<document>',
      sourcePath: sidecarSourcePath,
    });
  }

  if (!sidecarData || typeof sidecarData !== 'object' || Array.isArray(sidecarData)) {
    throw new HelpAuthorityValidationError({
      code: HELP_AUTHORITY_VALIDATION_ERROR_CODES.SIDECAR_INVALID_METADATA,
      detail: 'Sidecar root must be a YAML mapping object',
      fieldPath: '<document>',
      sourcePath: sidecarSourcePath,
    });
  }

  ensureSidecarMetadata(sidecarData, sidecarSourcePath);

  const sourceFrontmatter = await parseMarkdownFrontmatter(sourceMarkdownPath, sourceMarkdownSourcePath);
  validateFrontmatterPrecedence(sourceFrontmatter, sidecarData, sourceMarkdownSourcePath);

  const checkedSurfaces = [sourceMarkdownSourcePath];

  if (runtimeMarkdownPath && (await fs.pathExists(runtimeMarkdownPath))) {
    const runtimeFrontmatter = await parseMarkdownFrontmatter(runtimeMarkdownPath, runtimeMarkdownSourcePath);
    validateFrontmatterPrecedence(runtimeFrontmatter, sidecarData, runtimeMarkdownSourcePath);
    checkedSurfaces.push(runtimeMarkdownSourcePath);
  }

  const aliasResolutionOptions = {
    fieldPath: 'canonicalId',
    sourcePath: sidecarSourcePath,
  };

  const inferredAliasTablePath =
    options.aliasTablePath || (options.bmadDir ? path.join(options.bmadDir, '_config', 'canonical-aliases.csv') : '');

  if (inferredAliasTablePath && (await fs.pathExists(inferredAliasTablePath))) {
    aliasResolutionOptions.aliasTablePath = inferredAliasTablePath;
    aliasResolutionOptions.aliasTableSourcePath = normalizeSourcePath(
      options.aliasTableSourcePath || toProjectRelativePath(inferredAliasTablePath),
    );
  }

  const resolvedSidecarIdentity = await normalizeAndResolveExemplarAlias(sidecarData.canonicalId, aliasResolutionOptions);
  const canonicalId = resolvedSidecarIdentity.postAliasCanonicalId;
  const authoritativeRecords = buildHelpAuthorityRecords({
    canonicalId,
    sidecarSourcePath,
    sourceMarkdownSourcePath,
  });

  return {
    canonicalId,
    authoritativePresenceKey: `capability:${canonicalId}`,
    authoritativeRecords,
    checkedSurfaces,
  };
}

module.exports = {
  HELP_AUTHORITY_VALIDATION_ERROR_CODES,
  HELP_FRONTMATTER_MISMATCH_ERROR_CODES,
  HelpAuthorityValidationError,
  buildHelpAuthorityRecords,
  serializeNormalizedDependencyTargets,
  validateHelpAuthoritySplitAndPrecedence,
};

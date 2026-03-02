const path = require('node:path');
const fs = require('fs-extra');
const csv = require('csv-parse/sync');

const HELP_ALIAS_NORMALIZATION_ERROR_CODES = Object.freeze({
  EMPTY_INPUT: 'ERR_CAPABILITY_ALIAS_EMPTY_INPUT',
  MULTIPLE_LEADING_SLASHES: 'ERR_CAPABILITY_ALIAS_MULTIPLE_LEADING_SLASHES',
  EMPTY_PREALIAS: 'ERR_CAPABILITY_ALIAS_EMPTY_PREALIAS',
  UNRESOLVED: 'ERR_CAPABILITY_ALIAS_UNRESOLVED',
});

const EXEMPLAR_CANONICAL_ALIAS_SOURCE_PATH = '_bmad/_config/canonical-aliases.csv';

const LOCKED_EXEMPLAR_ALIAS_ROWS = Object.freeze([
  Object.freeze({
    rowIdentity: 'alias-row:bmad-help:canonical-id',
    canonicalId: 'bmad-help',
    normalizedAliasValue: 'bmad-help',
    rawIdentityHasLeadingSlash: false,
  }),
  Object.freeze({
    rowIdentity: 'alias-row:bmad-help:legacy-name',
    canonicalId: 'bmad-help',
    normalizedAliasValue: 'help',
    rawIdentityHasLeadingSlash: false,
  }),
  Object.freeze({
    rowIdentity: 'alias-row:bmad-help:slash-command',
    canonicalId: 'bmad-help',
    normalizedAliasValue: 'bmad-help',
    rawIdentityHasLeadingSlash: true,
  }),
]);

class HelpAliasNormalizationError extends Error {
  constructor({ code, detail, fieldPath, sourcePath, observedValue }) {
    const message = `${code}: ${detail} (fieldPath=${fieldPath}, sourcePath=${sourcePath}, observedValue=${observedValue})`;
    super(message);
    this.name = 'HelpAliasNormalizationError';
    this.code = code;
    this.detail = detail;
    this.fieldPath = fieldPath;
    this.sourcePath = sourcePath;
    this.observedValue = observedValue;
    this.fullMessage = message;
  }
}

function normalizeSourcePath(value) {
  if (!value) return '';
  return String(value).replaceAll('\\', '/');
}

function collapseWhitespace(value) {
  return String(value).replaceAll(/\s+/g, ' ');
}

function parseBoolean(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;

  const normalized = String(value ?? '')
    .trim()
    .toLowerCase();
  if (normalized === 'true' || normalized === '1') return true;
  if (normalized === 'false' || normalized === '0') return false;
  return null;
}

function throwAliasNormalizationError({ code, detail, fieldPath, sourcePath, observedValue }) {
  throw new HelpAliasNormalizationError({
    code,
    detail,
    fieldPath,
    sourcePath,
    observedValue,
  });
}

function normalizeRawIdentityToTuple(rawIdentity, options = {}) {
  const fieldPath = options.fieldPath || 'rawIdentity';
  const sourcePath = normalizeSourcePath(options.sourcePath || EXEMPLAR_CANONICAL_ALIAS_SOURCE_PATH);
  const normalizedRawIdentity = collapseWhitespace(
    String(rawIdentity ?? '')
      .trim()
      .toLowerCase(),
  );

  if (!normalizedRawIdentity) {
    throwAliasNormalizationError({
      code: HELP_ALIAS_NORMALIZATION_ERROR_CODES.EMPTY_INPUT,
      detail: 'alias identity is empty after normalization',
      fieldPath,
      sourcePath,
      observedValue: normalizedRawIdentity,
    });
  }

  if (/^\/{2,}/.test(normalizedRawIdentity)) {
    throwAliasNormalizationError({
      code: HELP_ALIAS_NORMALIZATION_ERROR_CODES.MULTIPLE_LEADING_SLASHES,
      detail: 'alias identity contains multiple leading slashes',
      fieldPath,
      sourcePath,
      observedValue: normalizedRawIdentity,
    });
  }

  const rawIdentityHasLeadingSlash = normalizedRawIdentity.startsWith('/');
  const preAliasNormalizedValue = rawIdentityHasLeadingSlash ? normalizedRawIdentity.slice(1) : normalizedRawIdentity;

  if (!preAliasNormalizedValue) {
    throwAliasNormalizationError({
      code: HELP_ALIAS_NORMALIZATION_ERROR_CODES.EMPTY_PREALIAS,
      detail: 'alias preAliasNormalizedValue is empty after slash normalization',
      fieldPath: 'preAliasNormalizedValue',
      sourcePath,
      observedValue: normalizedRawIdentity,
    });
  }

  return {
    normalizedRawIdentity,
    rawIdentityHasLeadingSlash,
    preAliasNormalizedValue,
  };
}

function normalizeAliasRows(aliasRows, aliasTableSourcePath = EXEMPLAR_CANONICAL_ALIAS_SOURCE_PATH) {
  if (!Array.isArray(aliasRows)) return [];

  const normalizedRows = [];
  const sourcePath = normalizeSourcePath(aliasTableSourcePath);

  for (const row of aliasRows) {
    if (!row || typeof row !== 'object' || Array.isArray(row)) {
      continue;
    }

    const canonicalId = collapseWhitespace(
      String(row.canonicalId ?? '')
        .trim()
        .toLowerCase(),
    );
    const rowIdentity = String(row.rowIdentity ?? '').trim();
    const parsedLeadingSlash = parseBoolean(row.rawIdentityHasLeadingSlash);
    const normalizedAliasValue = collapseWhitespace(
      String(row.normalizedAliasValue ?? '')
        .trim()
        .toLowerCase(),
    );

    if (!rowIdentity || !canonicalId || parsedLeadingSlash === null || !normalizedAliasValue) {
      continue;
    }

    normalizedRows.push({
      rowIdentity,
      canonicalId,
      rawIdentityHasLeadingSlash: parsedLeadingSlash,
      normalizedAliasValue,
      sourcePath,
    });
  }

  normalizedRows.sort((left, right) => left.rowIdentity.localeCompare(right.rowIdentity));
  return normalizedRows;
}

function resolveAliasTupleFromRows(tuple, aliasRows, options = {}) {
  const sourcePath = normalizeSourcePath(options.sourcePath || EXEMPLAR_CANONICAL_ALIAS_SOURCE_PATH);
  const normalizedRows = normalizeAliasRows(aliasRows, sourcePath);

  const matches = normalizedRows.filter(
    (row) =>
      row.rawIdentityHasLeadingSlash === tuple.rawIdentityHasLeadingSlash && row.normalizedAliasValue === tuple.preAliasNormalizedValue,
  );

  if (matches.length === 0) {
    throwAliasNormalizationError({
      code: HELP_ALIAS_NORMALIZATION_ERROR_CODES.UNRESOLVED,
      detail: 'alias tuple did not resolve to any canonical alias row',
      fieldPath: 'preAliasNormalizedValue',
      sourcePath,
      observedValue: `${tuple.preAliasNormalizedValue}|leadingSlash:${tuple.rawIdentityHasLeadingSlash}`,
    });
  }

  if (matches.length > 1) {
    throwAliasNormalizationError({
      code: HELP_ALIAS_NORMALIZATION_ERROR_CODES.UNRESOLVED,
      detail: 'alias tuple resolved ambiguously to multiple canonical alias rows',
      fieldPath: 'preAliasNormalizedValue',
      sourcePath,
      observedValue: `${tuple.preAliasNormalizedValue}|leadingSlash:${tuple.rawIdentityHasLeadingSlash}`,
    });
  }

  const match = matches[0];
  return {
    aliasRowLocator: match.rowIdentity,
    postAliasCanonicalId: match.canonicalId,
    aliasResolutionSourcePath: sourcePath,
  };
}

async function resolveAliasTupleUsingCanonicalAliasCsv(tuple, aliasTablePath, options = {}) {
  const sourcePath = normalizeSourcePath(options.sourcePath || aliasTablePath || EXEMPLAR_CANONICAL_ALIAS_SOURCE_PATH);

  if (!aliasTablePath || !(await fs.pathExists(aliasTablePath))) {
    throwAliasNormalizationError({
      code: HELP_ALIAS_NORMALIZATION_ERROR_CODES.UNRESOLVED,
      detail: 'canonical alias table file was not found',
      fieldPath: 'aliasTablePath',
      sourcePath,
      observedValue: aliasTablePath || '',
    });
  }

  const csvRaw = await fs.readFile(aliasTablePath, 'utf8');
  const parsedRows = csv.parse(csvRaw, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  return resolveAliasTupleFromRows(tuple, parsedRows, { sourcePath });
}

async function normalizeAndResolveExemplarAlias(rawIdentity, options = {}) {
  const tuple = normalizeRawIdentityToTuple(rawIdentity, {
    fieldPath: options.fieldPath || 'rawIdentity',
    sourcePath: options.sourcePath || EXEMPLAR_CANONICAL_ALIAS_SOURCE_PATH,
  });

  let resolution;
  if (Array.isArray(options.aliasRows)) {
    resolution = resolveAliasTupleFromRows(tuple, options.aliasRows, {
      sourcePath: options.aliasTableSourcePath || options.sourcePath || EXEMPLAR_CANONICAL_ALIAS_SOURCE_PATH,
    });
  } else if (options.aliasTablePath) {
    resolution = await resolveAliasTupleUsingCanonicalAliasCsv(tuple, options.aliasTablePath, {
      sourcePath: options.aliasTableSourcePath || options.sourcePath || normalizeSourcePath(path.resolve(options.aliasTablePath)),
    });
  } else {
    resolution = resolveAliasTupleFromRows(tuple, LOCKED_EXEMPLAR_ALIAS_ROWS, {
      sourcePath: options.aliasTableSourcePath || options.sourcePath || EXEMPLAR_CANONICAL_ALIAS_SOURCE_PATH,
    });
  }

  return {
    ...tuple,
    ...resolution,
  };
}

module.exports = {
  HELP_ALIAS_NORMALIZATION_ERROR_CODES,
  EXEMPLAR_CANONICAL_ALIAS_SOURCE_PATH,
  LOCKED_EXEMPLAR_ALIAS_ROWS,
  HelpAliasNormalizationError,
  normalizeRawIdentityToTuple,
  resolveAliasTupleFromRows,
  resolveAliasTupleUsingCanonicalAliasCsv,
  normalizeAndResolveExemplarAlias,
};

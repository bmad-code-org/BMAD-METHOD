const csv = require('csv-parse/sync');

const TASK_MANIFEST_COMPATIBILITY_PREFIX_COLUMNS = Object.freeze(['name', 'displayName', 'description', 'module', 'path', 'standalone']);

const TASK_MANIFEST_WAVE1_ADDITIVE_COLUMNS = Object.freeze(['legacyName', 'canonicalId', 'authoritySourceType', 'authoritySourcePath']);

const HELP_CATALOG_COMPATIBILITY_PREFIX_COLUMNS = Object.freeze([
  'module',
  'phase',
  'name',
  'code',
  'sequence',
  'workflow-file',
  'command',
  'required',
]);

const HELP_CATALOG_WAVE1_ADDITIVE_COLUMNS = Object.freeze([
  'agent-name',
  'agent-command',
  'agent-display-name',
  'agent-title',
  'options',
  'description',
  'output-location',
  'outputs',
]);

const PROJECTION_COMPATIBILITY_ERROR_CODES = Object.freeze({
  TASK_MANIFEST_CSV_PARSE_FAILED: 'ERR_TASK_MANIFEST_COMPAT_PARSE_FAILED',
  TASK_MANIFEST_HEADER_PREFIX_MISMATCH: 'ERR_TASK_MANIFEST_COMPAT_HEADER_PREFIX_MISMATCH',
  TASK_MANIFEST_HEADER_WAVE1_MISMATCH: 'ERR_TASK_MANIFEST_COMPAT_HEADER_WAVE1_MISMATCH',
  TASK_MANIFEST_REQUIRED_COLUMN_MISSING: 'ERR_TASK_MANIFEST_COMPAT_REQUIRED_COLUMN_MISSING',
  TASK_MANIFEST_ROW_FIELD_EMPTY: 'ERR_TASK_MANIFEST_COMPAT_ROW_FIELD_EMPTY',
  HELP_CATALOG_CSV_PARSE_FAILED: 'ERR_HELP_CATALOG_COMPAT_PARSE_FAILED',
  HELP_CATALOG_HEADER_PREFIX_MISMATCH: 'ERR_HELP_CATALOG_COMPAT_HEADER_PREFIX_MISMATCH',
  HELP_CATALOG_HEADER_WAVE1_MISMATCH: 'ERR_HELP_CATALOG_COMPAT_HEADER_WAVE1_MISMATCH',
  HELP_CATALOG_REQUIRED_COLUMN_MISSING: 'ERR_HELP_CATALOG_COMPAT_REQUIRED_COLUMN_MISSING',
  HELP_CATALOG_EXEMPLAR_ROW_CONTRACT_FAILED: 'ERR_HELP_CATALOG_COMPAT_EXEMPLAR_ROW_CONTRACT_FAILED',
  GITHUB_COPILOT_WORKFLOW_FILE_MISSING: 'ERR_GITHUB_COPILOT_HELP_WORKFLOW_FILE_MISSING',
});

class ProjectionCompatibilityError extends Error {
  constructor({ code, detail, surface, fieldPath, sourcePath, observedValue, expectedValue }) {
    const message = `${code}: ${detail} (surface=${surface}, fieldPath=${fieldPath}, sourcePath=${sourcePath})`;
    super(message);
    this.name = 'ProjectionCompatibilityError';
    this.code = code;
    this.detail = detail;
    this.surface = surface;
    this.fieldPath = fieldPath;
    this.sourcePath = sourcePath;
    this.observedValue = observedValue;
    this.expectedValue = expectedValue;
    this.fullMessage = message;
  }
}

function normalizeSourcePath(value) {
  return String(value || '')
    .trim()
    .replaceAll('\\', '/');
}

function normalizeValue(value) {
  return String(value ?? '').trim();
}

function throwCompatibilityError({ code, detail, surface, fieldPath, sourcePath, observedValue, expectedValue }) {
  throw new ProjectionCompatibilityError({
    code,
    detail,
    surface,
    fieldPath,
    sourcePath,
    observedValue,
    expectedValue,
  });
}

function parseHeaderColumns(csvContent, { code, surface, sourcePath }) {
  try {
    const parsed = csv.parse(String(csvContent ?? ''), {
      to_line: 1,
      skip_empty_lines: true,
      trim: true,
    });
    const headerColumns = Array.isArray(parsed) && parsed.length > 0 ? parsed[0].map(String) : [];
    if (headerColumns.length === 0) {
      throwCompatibilityError({
        code,
        detail: 'CSV surface is missing a header row',
        surface,
        fieldPath: '<header>',
        sourcePath,
        observedValue: '<empty>',
        expectedValue: 'comma-separated header columns',
      });
    }
    return headerColumns;
  } catch (error) {
    if (error instanceof ProjectionCompatibilityError) {
      throw error;
    }
    throwCompatibilityError({
      code,
      detail: `Unable to parse CSV header: ${error.message}`,
      surface,
      fieldPath: '<header>',
      sourcePath,
      observedValue: '<parse-failure>',
      expectedValue: 'valid CSV header',
    });
  }
}

function parseRowsWithHeaders(csvContent, { code, surface, sourcePath }) {
  try {
    return csv.parse(String(csvContent ?? ''), {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });
  } catch (error) {
    throwCompatibilityError({
      code,
      detail: `Unable to parse CSV rows: ${error.message}`,
      surface,
      fieldPath: '<rows>',
      sourcePath,
      observedValue: '<parse-failure>',
      expectedValue: 'valid CSV rows',
    });
  }
}

function assertLockedColumns({ headerColumns, expectedColumns, offset, code, detail, surface, sourcePath }) {
  for (const [index, expectedValue] of expectedColumns.entries()) {
    const headerIndex = offset + index;
    const observedValue = normalizeValue(headerColumns[headerIndex]);
    if (observedValue !== expectedValue) {
      throwCompatibilityError({
        code,
        detail,
        surface,
        fieldPath: `header[${headerIndex}]`,
        sourcePath,
        observedValue: observedValue || '<missing>',
        expectedValue,
      });
    }
  }
}

function assertRequiredColumns({ headerColumns, requiredColumns, code, surface, sourcePath }) {
  const headerSet = new Set(headerColumns.map((column) => normalizeValue(column)));
  for (const column of requiredColumns) {
    if (!headerSet.has(column)) {
      throwCompatibilityError({
        code,
        detail: 'Required compatibility column is missing from projection surface',
        surface,
        fieldPath: `header.${column}`,
        sourcePath,
        observedValue: '<missing>',
        expectedValue: column,
      });
    }
  }
}

function normalizeCommandValue(value) {
  return normalizeValue(value).toLowerCase().replace(/^\/+/, '');
}

function normalizeWorkflowPath(value) {
  return normalizeSourcePath(value).toLowerCase();
}

function validateTaskManifestLoaderEntries(rows, options = {}) {
  const surface = options.surface || 'task-manifest-loader';
  const sourcePath = normalizeSourcePath(options.sourcePath || '_bmad/_config/task-manifest.csv');
  const headerColumns = Array.isArray(options.headerColumns) ? options.headerColumns : Object.keys(rows?.[0] || {});
  const requiredColumns = ['name', 'module', 'path'];

  assertRequiredColumns({
    headerColumns,
    requiredColumns,
    code: PROJECTION_COMPATIBILITY_ERROR_CODES.TASK_MANIFEST_REQUIRED_COLUMN_MISSING,
    surface,
    sourcePath,
  });

  for (let index = 0; index < (Array.isArray(rows) ? rows.length : 0); index += 1) {
    const row = rows[index];
    for (const requiredColumn of requiredColumns) {
      if (!row || normalizeValue(row[requiredColumn]).length === 0) {
        throwCompatibilityError({
          code: PROJECTION_COMPATIBILITY_ERROR_CODES.TASK_MANIFEST_ROW_FIELD_EMPTY,
          detail: 'Task-manifest row is missing a required compatibility value',
          surface,
          fieldPath: `rows[${index}].${requiredColumn}`,
          sourcePath,
          observedValue: normalizeValue(row ? row[requiredColumn] : '') || '<empty>',
          expectedValue: 'non-empty string',
        });
      }
    }
  }

  return true;
}

function validateHelpCatalogLoaderEntries(rows, options = {}) {
  const surface = options.surface || 'bmad-help-catalog-loader';
  const sourcePath = normalizeSourcePath(options.sourcePath || '_bmad/_config/bmad-help.csv');
  const headerColumns = Array.isArray(options.headerColumns) ? options.headerColumns : Object.keys(rows?.[0] || {});
  const requiredColumns = ['name', 'workflow-file', 'command'];

  assertRequiredColumns({
    headerColumns,
    requiredColumns,
    code: PROJECTION_COMPATIBILITY_ERROR_CODES.HELP_CATALOG_REQUIRED_COLUMN_MISSING,
    surface,
    sourcePath,
  });

  const parsedRows = Array.isArray(rows) ? rows : [];
  for (const [index, row] of parsedRows.entries()) {
    const rawCommandValue = normalizeValue(row.command);
    if (rawCommandValue.length === 0) {
      continue;
    }

    if (normalizeValue(row['workflow-file']).length === 0) {
      throwCompatibilityError({
        code: PROJECTION_COMPATIBILITY_ERROR_CODES.GITHUB_COPILOT_WORKFLOW_FILE_MISSING,
        detail: 'Rows with command values must preserve workflow-file for prompt generation loaders',
        surface,
        fieldPath: `rows[${index}].workflow-file`,
        sourcePath,
        observedValue: '<empty>',
        expectedValue: 'non-empty string',
      });
    }
  }

  const exemplarRows = parsedRows.filter(
    (row) =>
      normalizeCommandValue(row.command) === 'bmad-help' && normalizeWorkflowPath(row['workflow-file']).endsWith('/core/tasks/help.md'),
  );
  if (exemplarRows.length !== 1) {
    throwCompatibilityError({
      code: PROJECTION_COMPATIBILITY_ERROR_CODES.HELP_CATALOG_EXEMPLAR_ROW_CONTRACT_FAILED,
      detail: 'Exactly one exemplar bmad-help compatibility row is required for help catalog consumers',
      surface,
      fieldPath: 'rows[*].command',
      sourcePath,
      observedValue: String(exemplarRows.length),
      expectedValue: '1',
    });
  }

  return true;
}

function validateGithubCopilotHelpLoaderEntries(rows, options = {}) {
  const sourcePath = normalizeSourcePath(options.sourcePath || '_bmad/_config/bmad-help.csv');
  return validateHelpCatalogLoaderEntries(rows, {
    ...options,
    sourcePath,
    surface: options.surface || 'github-copilot-help-loader',
  });
}

function validateTaskManifestCompatibilitySurface(csvContent, options = {}) {
  const surface = options.surface || 'task-manifest-loader';
  const sourcePath = normalizeSourcePath(options.sourcePath || '_bmad/_config/task-manifest.csv');
  const allowLegacyPrefixOnly = options.allowLegacyPrefixOnly === true;

  const headerColumns = parseHeaderColumns(csvContent, {
    code: PROJECTION_COMPATIBILITY_ERROR_CODES.TASK_MANIFEST_CSV_PARSE_FAILED,
    surface,
    sourcePath,
  });

  const isLegacyPrefixOnlyHeader = headerColumns.length === TASK_MANIFEST_COMPATIBILITY_PREFIX_COLUMNS.length;
  if (allowLegacyPrefixOnly && isLegacyPrefixOnlyHeader) {
    assertLockedColumns({
      headerColumns,
      expectedColumns: TASK_MANIFEST_COMPATIBILITY_PREFIX_COLUMNS,
      offset: 0,
      code: PROJECTION_COMPATIBILITY_ERROR_CODES.TASK_MANIFEST_HEADER_PREFIX_MISMATCH,
      detail: 'Task-manifest compatibility-prefix header ordering changed (non-additive change)',
      surface,
      sourcePath,
    });

    const rows = parseRowsWithHeaders(csvContent, {
      code: PROJECTION_COMPATIBILITY_ERROR_CODES.TASK_MANIFEST_CSV_PARSE_FAILED,
      surface,
      sourcePath,
    });
    validateTaskManifestLoaderEntries(rows, {
      surface,
      sourcePath,
      headerColumns,
    });

    return { headerColumns, rows, isLegacyPrefixOnlyHeader: true };
  }

  assertLockedColumns({
    headerColumns,
    expectedColumns: TASK_MANIFEST_COMPATIBILITY_PREFIX_COLUMNS,
    offset: 0,
    code: PROJECTION_COMPATIBILITY_ERROR_CODES.TASK_MANIFEST_HEADER_PREFIX_MISMATCH,
    detail: 'Task-manifest compatibility-prefix header ordering changed (non-additive change)',
    surface,
    sourcePath,
  });
  assertLockedColumns({
    headerColumns,
    expectedColumns: TASK_MANIFEST_WAVE1_ADDITIVE_COLUMNS,
    offset: TASK_MANIFEST_COMPATIBILITY_PREFIX_COLUMNS.length,
    code: PROJECTION_COMPATIBILITY_ERROR_CODES.TASK_MANIFEST_HEADER_WAVE1_MISMATCH,
    detail: 'Task-manifest wave-1 additive columns must remain appended after compatibility-prefix columns',
    surface,
    sourcePath,
  });

  const rows = parseRowsWithHeaders(csvContent, {
    code: PROJECTION_COMPATIBILITY_ERROR_CODES.TASK_MANIFEST_CSV_PARSE_FAILED,
    surface,
    sourcePath,
  });

  validateTaskManifestLoaderEntries(rows, {
    surface,
    sourcePath,
    headerColumns,
  });

  return { headerColumns, rows };
}

function validateHelpCatalogCompatibilitySurface(csvContent, options = {}) {
  const surface = options.surface || 'bmad-help-catalog-loader';
  const sourcePath = normalizeSourcePath(options.sourcePath || '_bmad/_config/bmad-help.csv');

  const headerColumns = parseHeaderColumns(csvContent, {
    code: PROJECTION_COMPATIBILITY_ERROR_CODES.HELP_CATALOG_CSV_PARSE_FAILED,
    surface,
    sourcePath,
  });

  assertLockedColumns({
    headerColumns,
    expectedColumns: HELP_CATALOG_COMPATIBILITY_PREFIX_COLUMNS,
    offset: 0,
    code: PROJECTION_COMPATIBILITY_ERROR_CODES.HELP_CATALOG_HEADER_PREFIX_MISMATCH,
    detail: 'Help-catalog compatibility-prefix header ordering changed (non-additive change)',
    surface,
    sourcePath,
  });
  assertLockedColumns({
    headerColumns,
    expectedColumns: HELP_CATALOG_WAVE1_ADDITIVE_COLUMNS,
    offset: HELP_CATALOG_COMPATIBILITY_PREFIX_COLUMNS.length,
    code: PROJECTION_COMPATIBILITY_ERROR_CODES.HELP_CATALOG_HEADER_WAVE1_MISMATCH,
    detail: 'Help-catalog wave-1 additive columns must remain appended after compatibility-prefix columns',
    surface,
    sourcePath,
  });

  const rows = parseRowsWithHeaders(csvContent, {
    code: PROJECTION_COMPATIBILITY_ERROR_CODES.HELP_CATALOG_CSV_PARSE_FAILED,
    surface,
    sourcePath,
  });

  validateHelpCatalogLoaderEntries(rows, {
    surface,
    sourcePath,
    headerColumns,
  });
  validateGithubCopilotHelpLoaderEntries(rows, {
    sourcePath,
    headerColumns,
  });

  return { headerColumns, rows };
}

module.exports = {
  PROJECTION_COMPATIBILITY_ERROR_CODES,
  ProjectionCompatibilityError,
  TASK_MANIFEST_COMPATIBILITY_PREFIX_COLUMNS,
  TASK_MANIFEST_WAVE1_ADDITIVE_COLUMNS,
  HELP_CATALOG_COMPATIBILITY_PREFIX_COLUMNS,
  HELP_CATALOG_WAVE1_ADDITIVE_COLUMNS,
  validateTaskManifestCompatibilitySurface,
  validateTaskManifestLoaderEntries,
  validateHelpCatalogCompatibilitySurface,
  validateHelpCatalogLoaderEntries,
  validateGithubCopilotHelpLoaderEntries,
};

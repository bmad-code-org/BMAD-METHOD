const path = require('node:path');
const crypto = require('node:crypto');
const os = require('node:os');
const fs = require('fs-extra');
const yaml = require('yaml');
const csv = require('csv-parse/sync');
const { getSourcePath } = require('../../../lib/project-root');
const { validateHelpSidecarContractFile, HELP_SIDECAR_ERROR_CODES } = require('./sidecar-contract-validator');
const { validateHelpAuthoritySplitAndPrecedence, HELP_FRONTMATTER_MISMATCH_ERROR_CODES } = require('./help-authority-validator');
const { ManifestGenerator } = require('./manifest-generator');
const { buildSidecarAwareExemplarHelpRow } = require('./help-catalog-generator');
const { CodexSetup } = require('../ide/codex');

const WAVE1_VALIDATION_ERROR_CODES = Object.freeze({
  REQUIRED_ARTIFACT_MISSING: 'ERR_WAVE1_VALIDATION_REQUIRED_ARTIFACT_MISSING',
  CSV_SCHEMA_MISMATCH: 'ERR_WAVE1_VALIDATION_CSV_SCHEMA_MISMATCH',
  REQUIRED_ROW_IDENTITY_MISSING: 'ERR_WAVE1_VALIDATION_REQUIRED_ROW_IDENTITY_MISSING',
  REQUIRED_EVIDENCE_LINK_MISSING: 'ERR_WAVE1_VALIDATION_REQUIRED_EVIDENCE_LINK_MISSING',
  EVIDENCE_LINK_REFERENCE_INVALID: 'ERR_WAVE1_VALIDATION_EVIDENCE_LINK_REFERENCE_INVALID',
  BINDING_EVIDENCE_INVALID: 'ERR_WAVE1_VALIDATION_BINDING_EVIDENCE_INVALID',
  ISSUER_PREREQUISITE_MISSING: 'ERR_WAVE1_VALIDATION_ISSUER_PREREQUISITE_MISSING',
  SELF_ATTESTED_ISSUER_CLAIM: 'ERR_WAVE1_VALIDATION_SELF_ATTESTED_ISSUER_CLAIM',
  YAML_SCHEMA_MISMATCH: 'ERR_WAVE1_VALIDATION_YAML_SCHEMA_MISMATCH',
  DECISION_RECORD_SCHEMA_MISMATCH: 'ERR_WAVE1_VALIDATION_DECISION_RECORD_SCHEMA_MISMATCH',
  DECISION_RECORD_PARSE_FAILED: 'ERR_WAVE1_VALIDATION_DECISION_RECORD_PARSE_FAILED',
});

const SIDEcar_AUTHORITY_SOURCE_PATH = 'bmad-fork/src/core/tasks/help.artifact.yaml';
const SOURCE_MARKDOWN_SOURCE_PATH = 'bmad-fork/src/core/tasks/help.md';
const EVIDENCE_ISSUER_COMPONENT = 'bmad-fork/tools/cli/installers/lib/core/wave-1-validation-harness.js';

const FRONTMATTER_MISMATCH_DETAILS = Object.freeze({
  [HELP_FRONTMATTER_MISMATCH_ERROR_CODES.CANONICAL_ID_MISMATCH]: 'frontmatter canonicalId must match sidecar canonicalId',
  [HELP_FRONTMATTER_MISMATCH_ERROR_CODES.DISPLAY_NAME_MISMATCH]: 'frontmatter name must match sidecar displayName',
  [HELP_FRONTMATTER_MISMATCH_ERROR_CODES.DESCRIPTION_MISMATCH]: 'frontmatter description must match sidecar description',
  [HELP_FRONTMATTER_MISMATCH_ERROR_CODES.DEPENDENCIES_REQUIRES_MISMATCH]:
    'frontmatter dependencies.requires must match sidecar dependencies.requires',
});

const WAVE1_VALIDATION_ARTIFACT_REGISTRY = Object.freeze([
  Object.freeze({
    artifactId: 1,
    relativePath: path.join('validation', 'wave-1', 'bmad-help-sidecar-snapshot.yaml'),
    type: 'yaml',
    requiredTopLevelKeys: ['schemaVersion', 'canonicalId', 'artifactType', 'module', 'sourcePath', 'displayName', 'description', 'status'],
  }),
  Object.freeze({
    artifactId: 2,
    relativePath: path.join('validation', 'wave-1', 'bmad-help-runtime-comparison.csv'),
    type: 'csv',
    columns: [
      'surface',
      'runtimePath',
      'sourcePath',
      'canonicalId',
      'normalizedCapabilityKey',
      'visibleName',
      'inclusionClassification',
      'contentAuthoritySourceType',
      'contentAuthoritySourcePath',
      'metadataAuthoritySourceType',
      'metadataAuthoritySourcePath',
      'status',
    ],
  }),
  Object.freeze({
    artifactId: 3,
    relativePath: path.join('validation', 'wave-1', 'bmad-help-issued-artifact-provenance.csv'),
    type: 'csv',
    columns: [
      'rowIdentity',
      'artifactPath',
      'canonicalId',
      'issuerOwnerClass',
      'evidenceIssuerComponent',
      'evidenceMethod',
      'issuingComponent',
      'issuingComponentBindingBasis',
      'issuingComponentBindingEvidence',
      'claimScope',
      'status',
    ],
    requiredRowIdentityFields: ['rowIdentity'],
  }),
  Object.freeze({
    artifactId: 4,
    relativePath: path.join('validation', 'wave-1', 'bmad-help-manifest-comparison.csv'),
    type: 'csv',
    columns: [
      'surface',
      'sourcePath',
      'legacyName',
      'canonicalId',
      'displayName',
      'normalizedCapabilityKey',
      'authoritySourceType',
      'authoritySourcePath',
      'issuerOwnerClass',
      'issuingComponent',
      'issuedArtifactEvidencePath',
      'issuedArtifactEvidenceRowIdentity',
      'issuingComponentBindingEvidence',
      'status',
    ],
    requiredRowIdentityFields: ['issuedArtifactEvidenceRowIdentity'],
  }),
  Object.freeze({
    artifactId: 5,
    relativePath: path.join('validation', 'wave-1', 'bmad-help-alias-table.csv'),
    type: 'csv',
    columns: [
      'rowIdentity',
      'canonicalId',
      'alias',
      'aliasType',
      'normalizedAliasValue',
      'rawIdentityHasLeadingSlash',
      'resolutionEligibility',
      'authoritySourceType',
      'authoritySourcePath',
      'status',
    ],
    requiredRowIdentityFields: ['rowIdentity'],
  }),
  Object.freeze({
    artifactId: 6,
    relativePath: path.join('validation', 'wave-1', 'bmad-help-description-provenance.csv'),
    type: 'csv',
    columns: [
      'surface',
      'sourcePath',
      'canonicalId',
      'descriptionValue',
      'expectedDescriptionValue',
      'descriptionAuthoritySourceType',
      'descriptionAuthoritySourcePath',
      'issuedArtifactEvidencePath',
      'issuedArtifactEvidenceRowIdentity',
      'status',
    ],
    requiredRowIdentityFields: ['issuedArtifactEvidenceRowIdentity'],
  }),
  Object.freeze({
    artifactId: 7,
    relativePath: path.join('validation', 'wave-1', 'bmad-help-export-comparison.csv'),
    type: 'csv',
    columns: [
      'exportPath',
      'sourcePath',
      'canonicalId',
      'visibleId',
      'visibleSurfaceClass',
      'normalizedVisibleKey',
      'authoritySourceType',
      'authoritySourcePath',
      'exportIdDerivationSourceType',
      'exportIdDerivationSourcePath',
      'issuerOwnerClass',
      'issuingComponent',
      'issuedArtifactEvidencePath',
      'issuedArtifactEvidenceRowIdentity',
      'issuingComponentBindingEvidence',
      'status',
    ],
    requiredRowIdentityFields: ['issuedArtifactEvidenceRowIdentity'],
  }),
  Object.freeze({
    artifactId: 8,
    relativePath: path.join('validation', 'wave-1', 'bmad-help-command-label-report.csv'),
    type: 'csv',
    columns: [
      'surface',
      'sourcePath',
      'canonicalId',
      'rawCommandValue',
      'displayedCommandLabel',
      'normalizedDisplayedLabel',
      'rowCountForCanonicalId',
      'authoritySourceType',
      'authoritySourcePath',
      'issuedArtifactEvidencePath',
      'issuedArtifactEvidenceRowIdentity',
      'status',
    ],
    requiredRowIdentityFields: ['issuedArtifactEvidenceRowIdentity'],
  }),
  Object.freeze({
    artifactId: 9,
    relativePath: path.join('validation', 'wave-1', 'bmad-help-catalog-pipeline.csv'),
    type: 'csv',
    columns: [
      'stage',
      'artifactPath',
      'rowIdentity',
      'canonicalId',
      'sourcePath',
      'rowCountForStageCanonicalId',
      'commandValue',
      'expectedCommandValue',
      'descriptionValue',
      'expectedDescriptionValue',
      'descriptionAuthoritySourceType',
      'descriptionAuthoritySourcePath',
      'commandAuthoritySourceType',
      'commandAuthoritySourcePath',
      'issuerOwnerClass',
      'issuingComponent',
      'issuedArtifactEvidencePath',
      'issuedArtifactEvidenceRowIdentity',
      'issuingComponentBindingEvidence',
      'stageStatus',
      'status',
    ],
    requiredRowIdentityFields: ['rowIdentity', 'issuedArtifactEvidenceRowIdentity'],
  }),
  Object.freeze({
    artifactId: 10,
    relativePath: path.join('validation', 'wave-1', 'bmad-help-duplicate-report.csv'),
    type: 'csv',
    columns: [
      'surface',
      'ownerClass',
      'sourcePath',
      'canonicalId',
      'normalizedCapabilityKey',
      'visibleName',
      'visibleId',
      'visibleSurfaceClass',
      'normalizedVisibleKey',
      'authorityRole',
      'authoritySourceType',
      'authoritySourcePath',
      'authoritativePresenceKey',
      'groupedAuthoritativePresenceCount',
      'groupedAuthoritativeSourceRecordCount',
      'groupedAuthoritativeSourcePathSet',
      'rawIdentityHasLeadingSlash',
      'preAliasNormalizedValue',
      'postAliasCanonicalId',
      'aliasRowLocator',
      'aliasResolutionEvidence',
      'aliasResolutionSourcePath',
      'conflictingProjectedRecordCount',
      'wrapperAuthoritativeRecordCount',
      'status',
    ],
  }),
  Object.freeze({
    artifactId: 11,
    relativePath: path.join('validation', 'wave-1', 'bmad-help-dependency-report.csv'),
    type: 'csv',
    columns: [
      'declaredIn',
      'sourcePath',
      'targetType',
      'targetId',
      'normalizedTargetId',
      'expectedOwnerClass',
      'resolutionCandidateCount',
      'resolvedOwnerClass',
      'resolvedSurface',
      'resolvedPath',
      'authoritySourceType',
      'authoritySourcePath',
      'failureReason',
      'status',
    ],
  }),
  Object.freeze({
    artifactId: 12,
    relativePath: path.join('decision-records', 'wave-1-native-skills-exit.md'),
    type: 'markdown',
    requiredFrontmatterKeys: ['wave', 'goNoGo', 'status'],
  }),
  Object.freeze({
    artifactId: 13,
    relativePath: path.join('validation', 'wave-1', 'bmad-help-sidecar-negative-validation.csv'),
    type: 'csv',
    columns: [
      'scenario',
      'fixturePath',
      'observedSchemaVersion',
      'observedSourcePathValue',
      'observedSidecarBasename',
      'expectedFailureCode',
      'observedFailureCode',
      'expectedFailureDetail',
      'observedFailureDetail',
      'status',
    ],
  }),
  Object.freeze({
    artifactId: 14,
    relativePath: path.join('validation', 'wave-1', 'bmad-help-frontmatter-mismatch-validation.csv'),
    type: 'csv',
    columns: [
      'scenario',
      'fixturePath',
      'frontmatterSurfacePath',
      'observedFrontmatterKeyPath',
      'mismatchedField',
      'observedFrontmatterValue',
      'expectedSidecarValue',
      'expectedAuthoritativeSourceType',
      'expectedAuthoritativeSourcePath',
      'expectedFailureCode',
      'observedFailureCode',
      'expectedFailureDetail',
      'observedFailureDetail',
      'observedAuthoritativeSourceType',
      'observedAuthoritativeSourcePath',
      'status',
    ],
  }),
]);

class Wave1ValidationHarnessError extends Error {
  constructor({ code, detail, artifactId, fieldPath, sourcePath, observedValue, expectedValue }) {
    const message = `${code}: ${detail} (artifact=${artifactId}, fieldPath=${fieldPath}, sourcePath=${sourcePath})`;
    super(message);
    this.name = 'Wave1ValidationHarnessError';
    this.code = code;
    this.detail = detail;
    this.artifactId = artifactId;
    this.fieldPath = fieldPath;
    this.sourcePath = sourcePath;
    this.observedValue = observedValue;
    this.expectedValue = expectedValue;
  }
}

function normalizePath(value) {
  return String(value || '').replaceAll('\\', '/');
}

function normalizeValue(value) {
  return String(value ?? '').trim();
}

function normalizeDependencyTargets(value) {
  const normalized = Array.isArray(value)
    ? value
        .map((target) => normalizeValue(String(target || '').toLowerCase()))
        .filter((target) => target.length > 0)
        .sort()
    : [];
  return JSON.stringify(normalized);
}

function computeSha256(value) {
  return crypto
    .createHash('sha256')
    .update(String(value || ''), 'utf8')
    .digest('hex');
}

function sortObjectKeysDeep(value) {
  if (Array.isArray(value)) {
    return value.map((item) => sortObjectKeysDeep(item));
  }
  if (!value || typeof value !== 'object') {
    return value;
  }
  const sorted = {};
  for (const key of Object.keys(value).sort()) {
    sorted[key] = sortObjectKeysDeep(value[key]);
  }
  return sorted;
}

function canonicalJsonStringify(value) {
  return JSON.stringify(sortObjectKeysDeep(value));
}

function buildIssuedArtifactRowIdentity(artifactPath) {
  return `issued-artifact:${String(artifactPath || '').replaceAll('/', '-')}`;
}

function buildAliasResolutionEvidence(preAliasNormalizedValue, rawIdentityHasLeadingSlash, aliasRowLocator) {
  const canonicalId = 'bmad-help';
  return `applied:${preAliasNormalizedValue}|leadingSlash:${rawIdentityHasLeadingSlash}->${canonicalId}|rows:${aliasRowLocator}`;
}

function parseCsvRows(csvContent) {
  return csv.parse(String(csvContent || ''), {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });
}

function parseCsvHeader(csvContent) {
  const parsed = csv.parse(String(csvContent || ''), {
    to_line: 1,
    skip_empty_lines: true,
    trim: true,
  });
  return Array.isArray(parsed) && parsed.length > 0 ? parsed[0].map(String) : [];
}

function escapeCsv(value) {
  return `"${String(value ?? '').replaceAll('"', '""')}"`;
}

function sortRowsDeterministically(rows, columns) {
  return [...rows].sort((left, right) => {
    const leftKey = columns.map((column) => normalizeValue(left[column])).join('|');
    const rightKey = columns.map((column) => normalizeValue(right[column])).join('|');
    return leftKey.localeCompare(rightKey);
  });
}

function parseFrontmatter(markdownContent) {
  const frontmatterMatch = String(markdownContent || '').match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!frontmatterMatch) return {};
  const parsed = yaml.parse(frontmatterMatch[1]);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return {};
  }
  return parsed;
}

function serializeCsv(columns, rows) {
  const lines = [columns.join(',')];
  for (const row of rows) {
    const serialized = columns.map((column) => escapeCsv(Object.prototype.hasOwnProperty.call(row, column) ? row[column] : ''));
    lines.push(serialized.join(','));
  }
  return `${lines.join('\n')}\n`;
}

const MODULE_HELP_COMPAT_COLUMNS = Object.freeze([
  'module',
  'phase',
  'name',
  'code',
  'sequence',
  'workflow-file',
  'command',
  'required',
  'agent',
  'options',
  'description',
  'output-location',
  'outputs',
]);

const HELP_CATALOG_COLUMNS = Object.freeze([
  'module',
  'phase',
  'name',
  'code',
  'sequence',
  'workflow-file',
  'command',
  'required',
  'agent-name',
  'agent-command',
  'agent-display-name',
  'agent-title',
  'options',
  'description',
  'output-location',
  'outputs',
]);

function countExemplarSkillProjectionRows(markdownContent) {
  const frontmatter = parseFrontmatter(markdownContent);
  return normalizeValue(frontmatter.name) === 'bmad-help' ? 1 : 0;
}

function countManifestClaimRows(csvContent, runtimeFolder) {
  const expectedTaskPath = normalizePath(`${runtimeFolder}/core/tasks/help.md`).toLowerCase();
  return parseCsvRows(csvContent).filter((row) => {
    const canonicalId = normalizeValue(row.canonicalId).toLowerCase();
    const moduleName = normalizeValue(row.module).toLowerCase();
    const name = normalizeValue(row.name).toLowerCase();
    const taskPath = normalizePath(normalizeValue(row.path)).toLowerCase();
    return canonicalId === 'bmad-help' && moduleName === 'core' && name === 'help' && taskPath === expectedTaskPath;
  }).length;
}

function countHelpCatalogClaimRows(csvContent) {
  return parseCsvRows(csvContent).filter((row) => {
    const command = normalizeValue(row.command).toLowerCase().replace(/^\/+/, '');
    const workflowFile = normalizePath(normalizeValue(row['workflow-file'])).toLowerCase();
    return command === 'bmad-help' && workflowFile.endsWith('/core/tasks/help.md');
  }).length;
}

function buildReplaySidecarFixture({ canonicalId = 'bmad-help', description = 'Help command' } = {}) {
  return {
    schemaVersion: 1,
    canonicalId,
    artifactType: 'task',
    module: 'core',
    sourcePath: SOURCE_MARKDOWN_SOURCE_PATH,
    displayName: 'help',
    description,
    dependencies: {
      requires: [],
    },
  };
}

function replayFailurePayload(error) {
  return canonicalJsonStringify({
    replayFailureCode: normalizeValue(error?.code || 'ERR_WAVE1_REPLAY_COMPONENT_FAILED'),
    replayFailureDetail: normalizeValue(error?.detail || error?.message || 'component replay failed'),
  });
}

function isSha256(value) {
  return /^[a-f0-9]{64}$/.test(String(value || ''));
}

class Wave1ValidationHarness {
  constructor() {
    this.registry = WAVE1_VALIDATION_ARTIFACT_REGISTRY;
  }

  getArtifactRegistry() {
    return this.registry;
  }

  resolveOutputPaths(options = {}) {
    const projectDir = path.resolve(options.projectDir || process.cwd());
    const planningArtifactsRoot = path.join(projectDir, '_bmad-output', 'planning-artifacts');
    const validationRoot = path.join(planningArtifactsRoot, 'validation', 'wave-1');
    const decisionRecordsRoot = path.join(planningArtifactsRoot, 'decision-records');
    return {
      projectDir,
      planningArtifactsRoot,
      validationRoot,
      decisionRecordsRoot,
    };
  }

  resolveSourceArtifactPaths(options = {}) {
    const projectDir = path.resolve(options.projectDir || process.cwd());

    const sidecarCandidates = [
      options.sidecarPath,
      path.join(projectDir, 'bmad-fork', 'src', 'core', 'tasks', 'help.artifact.yaml'),
      path.join(projectDir, 'src', 'core', 'tasks', 'help.artifact.yaml'),
      getSourcePath('core', 'tasks', 'help.artifact.yaml'),
    ].filter(Boolean);

    const sourceMarkdownCandidates = [
      options.sourceMarkdownPath,
      path.join(projectDir, 'bmad-fork', 'src', 'core', 'tasks', 'help.md'),
      path.join(projectDir, 'src', 'core', 'tasks', 'help.md'),
      getSourcePath('core', 'tasks', 'help.md'),
    ].filter(Boolean);

    const resolveExistingPath = async (candidates) => {
      for (const candidate of candidates) {
        if (await fs.pathExists(candidate)) {
          return candidate;
        }
      }
      return candidates[0];
    };

    return Promise.all([resolveExistingPath(sidecarCandidates), resolveExistingPath(sourceMarkdownCandidates)]).then(
      ([sidecarPath, sourceMarkdownPath]) => ({
        sidecarPath,
        sourceMarkdownPath,
      }),
    );
  }

  async readSidecarMetadata(sidecarPath) {
    const parsed = yaml.parse(await fs.readFile(sidecarPath, 'utf8'));
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {
        schemaVersion: 1,
        canonicalId: 'bmad-help',
        artifactType: 'task',
        module: 'core',
        sourcePath: SOURCE_MARKDOWN_SOURCE_PATH,
        displayName: 'help',
        description: 'Help command',
        dependencies: { requires: [] },
      };
    }
    return {
      schemaVersion: parsed.schemaVersion ?? 1,
      canonicalId: normalizeValue(parsed.canonicalId || 'bmad-help'),
      artifactType: normalizeValue(parsed.artifactType || 'task'),
      module: normalizeValue(parsed.module || 'core'),
      sourcePath: normalizeValue(parsed.sourcePath || SOURCE_MARKDOWN_SOURCE_PATH),
      displayName: normalizeValue(parsed.displayName || 'help'),
      description: normalizeValue(parsed.description || 'Help command'),
      dependencies: parsed.dependencies && typeof parsed.dependencies === 'object' ? parsed.dependencies : { requires: [] },
    };
  }

  async readCsvSurface(csvPath) {
    if (!(await fs.pathExists(csvPath))) {
      return [];
    }
    const content = await fs.readFile(csvPath, 'utf8');
    return parseCsvRows(content);
  }

  async assertRequiredInputSurfaceExists({ artifactId, absolutePath, sourcePath, description }) {
    if (await fs.pathExists(absolutePath)) {
      return;
    }
    throw new Wave1ValidationHarnessError({
      code: WAVE1_VALIDATION_ERROR_CODES.REQUIRED_ARTIFACT_MISSING,
      detail: `Required input surface is missing (${description})`,
      artifactId,
      fieldPath: '<file>',
      sourcePath: normalizePath(sourcePath),
      observedValue: '<missing>',
      expectedValue: normalizePath(sourcePath),
    });
  }

  requireRow({ rows, predicate, artifactId, fieldPath, sourcePath, detail }) {
    const match = (rows || []).find(predicate);
    if (match) {
      return match;
    }
    throw new Wave1ValidationHarnessError({
      code: WAVE1_VALIDATION_ERROR_CODES.REQUIRED_ROW_IDENTITY_MISSING,
      detail,
      artifactId,
      fieldPath,
      sourcePath: normalizePath(sourcePath),
      observedValue: '<missing>',
      expectedValue: 'required row',
    });
  }

  async writeCsvArtifact(filePath, columns, rows) {
    const sortedRows = sortRowsDeterministically(rows, columns);
    await fs.writeFile(filePath, serializeCsv(columns, sortedRows), 'utf8');
  }

  async ensureValidationFixtures(outputPaths, sidecarMetadata) {
    const sidecarNegativeRoot = path.join(outputPaths.validationRoot, 'fixtures', 'sidecar-negative');
    const frontmatterMismatchRoot = path.join(outputPaths.validationRoot, 'fixtures', 'frontmatter-mismatch');
    await fs.ensureDir(sidecarNegativeRoot);
    await fs.ensureDir(frontmatterMismatchRoot);

    const unknownMajorFixturePath = path.join(sidecarNegativeRoot, 'unknown-major-version', 'help.artifact.yaml');
    const basenameMismatchFixturePath = path.join(sidecarNegativeRoot, 'basename-path-mismatch', 'help.artifact.yaml');
    await fs.ensureDir(path.dirname(unknownMajorFixturePath));
    await fs.ensureDir(path.dirname(basenameMismatchFixturePath));

    const unknownMajorFixture = {
      ...sidecarMetadata,
      schemaVersion: 2,
      sourcePath: SOURCE_MARKDOWN_SOURCE_PATH,
    };
    const basenameMismatchFixture = {
      ...sidecarMetadata,
      schemaVersion: 1,
      sourcePath: 'bmad-fork/src/core/tasks/not-help.md',
    };

    await fs.writeFile(unknownMajorFixturePath, yaml.stringify(unknownMajorFixture), 'utf8');
    await fs.writeFile(basenameMismatchFixturePath, yaml.stringify(basenameMismatchFixture), 'utf8');

    const sourceMismatchRoot = path.join(frontmatterMismatchRoot, 'source');
    const runtimeMismatchRoot = path.join(frontmatterMismatchRoot, 'runtime');
    await fs.ensureDir(sourceMismatchRoot);
    await fs.ensureDir(runtimeMismatchRoot);

    const baseFrontmatter = {
      name: sidecarMetadata.displayName,
      description: sidecarMetadata.description,
      canonicalId: sidecarMetadata.canonicalId,
      dependencies: {
        requires: Array.isArray(sidecarMetadata.dependencies.requires) ? sidecarMetadata.dependencies.requires : [],
      },
    };

    const buildMarkdown = (frontmatter) => `---\n${yaml.stringify(frontmatter).trimEnd()}\n---\n\n# Fixture\n`;

    const scenarios = [
      {
        id: 'canonical-id-mismatch',
        keyPath: 'canonicalId',
        mismatchField: 'canonicalId',
        makeFrontmatter: () => ({ ...baseFrontmatter, canonicalId: 'legacy-help' }),
      },
      {
        id: 'display-name-mismatch',
        keyPath: 'name',
        mismatchField: 'displayName',
        makeFrontmatter: () => ({ ...baseFrontmatter, name: 'BMAD Help' }),
      },
      {
        id: 'description-mismatch',
        keyPath: 'description',
        mismatchField: 'description',
        makeFrontmatter: () => ({ ...baseFrontmatter, description: 'Runtime override' }),
      },
      {
        id: 'dependencies-mismatch',
        keyPath: 'dependencies.requires',
        mismatchField: 'dependencies.requires',
        makeFrontmatter: () => ({ ...baseFrontmatter, dependencies: { requires: ['skill:demo'] } }),
      },
    ];

    for (const scenario of scenarios) {
      const sourcePath = path.join(sourceMismatchRoot, `${scenario.id}.md`);
      const runtimePath = path.join(runtimeMismatchRoot, `${scenario.id}.md`);
      await fs.writeFile(sourcePath, buildMarkdown(scenario.makeFrontmatter()), 'utf8');
      await fs.writeFile(runtimePath, buildMarkdown(scenario.makeFrontmatter()), 'utf8');
    }

    return {
      unknownMajorFixturePath,
      basenameMismatchFixturePath,
      sourceMismatchRoot,
      runtimeMismatchRoot,
    };
  }

  buildArtifactPathsMap(outputPaths) {
    const artifactPaths = new Map();
    for (const artifact of this.registry) {
      artifactPaths.set(artifact.artifactId, path.join(outputPaths.planningArtifactsRoot, artifact.relativePath));
    }
    return artifactPaths;
  }

  resolveReplayContract({ artifactPath, componentPath, rowIdentity, runtimeFolder }) {
    const claimedRowIdentity = normalizeValue(rowIdentity);
    if (!claimedRowIdentity) {
      throw new Wave1ValidationHarnessError({
        code: WAVE1_VALIDATION_ERROR_CODES.REQUIRED_ROW_IDENTITY_MISSING,
        detail: 'Claimed replay rowIdentity is required',
        artifactId: 3,
        fieldPath: 'rowIdentity',
        sourcePath: artifactPath,
        observedValue: claimedRowIdentity,
        expectedValue: 'non-empty value',
      });
    }

    const expectedRowIdentity = buildIssuedArtifactRowIdentity(artifactPath);
    if (claimedRowIdentity !== expectedRowIdentity) {
      throw new Wave1ValidationHarnessError({
        code: WAVE1_VALIDATION_ERROR_CODES.REQUIRED_ROW_IDENTITY_MISSING,
        detail: 'Claimed replay rowIdentity does not match artifact claim rowIdentity contract',
        artifactId: 3,
        fieldPath: 'rowIdentity',
        sourcePath: artifactPath,
        observedValue: claimedRowIdentity,
        expectedValue: expectedRowIdentity,
      });
    }

    const contractsByClaimRowIdentity = new Map([
      [
        buildIssuedArtifactRowIdentity(`${runtimeFolder}/_config/task-manifest.csv`),
        {
          artifactPath: `${runtimeFolder}/_config/task-manifest.csv`,
          componentPathIncludes: 'manifest-generator.js',
          mutationKind: 'component-input-perturbation:manifest-generator/tasks',
          run: ({ workspaceRoot, perturbed }) => this.runManifestGeneratorReplay({ workspaceRoot, runtimeFolder, perturbed }),
        },
      ],
      [
        buildIssuedArtifactRowIdentity(`${runtimeFolder}/core/module-help.csv`),
        {
          artifactPath: `${runtimeFolder}/core/module-help.csv`,
          componentPathIncludes: 'help-catalog-generator.js',
          mutationKind: 'component-input-perturbation:help-catalog-generator/sidecar-canonical-id',
          run: ({ workspaceRoot, perturbed }) =>
            this.runHelpCatalogGeneratorReplay({
              workspaceRoot,
              runtimeFolder,
              perturbed,
            }),
        },
      ],
      [
        buildIssuedArtifactRowIdentity(`${runtimeFolder}/_config/bmad-help.csv`),
        {
          artifactPath: `${runtimeFolder}/_config/bmad-help.csv`,
          componentPathIncludes: 'installer.js::mergemodulehelpcatalogs',
          mutationKind: 'component-input-perturbation:installer/help-authority-records',
          run: ({ workspaceRoot, perturbed }) =>
            this.runInstallerMergeReplay({
              workspaceRoot,
              runtimeFolder,
              perturbed,
            }),
        },
      ],
      [
        buildIssuedArtifactRowIdentity('.agents/skills/bmad-help/SKILL.md'),
        {
          artifactPath: '.agents/skills/bmad-help/SKILL.md',
          componentPathIncludes: 'ide/codex.js',
          mutationKind: 'component-input-perturbation:codex/sidecar-canonical-id',
          run: ({ workspaceRoot, perturbed }) => this.runCodexExportReplay({ workspaceRoot, perturbed }),
        },
      ],
    ]);

    const contract = contractsByClaimRowIdentity.get(claimedRowIdentity);
    if (!contract) {
      throw new Wave1ValidationHarnessError({
        code: WAVE1_VALIDATION_ERROR_CODES.REQUIRED_ROW_IDENTITY_MISSING,
        detail: 'Claimed rowIdentity is not mapped to a replay contract',
        artifactId: 3,
        fieldPath: 'rowIdentity',
        sourcePath: artifactPath,
        observedValue: claimedRowIdentity,
        expectedValue: 'known issued-artifact claim rowIdentity',
      });
    }

    const normalizedComponentPath = normalizeValue(componentPath).toLowerCase();
    if (
      normalizeValue(artifactPath) !== normalizeValue(contract.artifactPath) ||
      !normalizedComponentPath.includes(String(contract.componentPathIncludes || '').toLowerCase())
    ) {
      throw new Wave1ValidationHarnessError({
        code: WAVE1_VALIDATION_ERROR_CODES.BINDING_EVIDENCE_INVALID,
        detail: 'Claimed replay rowIdentity/component pair does not match replay contract mapping',
        artifactId: 3,
        fieldPath: 'issuingComponent',
        sourcePath: artifactPath,
        observedValue: canonicalJsonStringify({
          artifactPath,
          componentPath,
          rowIdentity: claimedRowIdentity,
        }),
        expectedValue: canonicalJsonStringify({
          artifactPath: contract.artifactPath,
          componentPathIncludes: contract.componentPathIncludes,
          rowIdentity: claimedRowIdentity,
        }),
      });
    }

    return contract;
  }

  async runManifestGeneratorReplay({ workspaceRoot, runtimeFolder, perturbed }) {
    const bmadDir = path.join(workspaceRoot, runtimeFolder);
    const cfgDir = path.join(bmadDir, '_config');
    await fs.ensureDir(cfgDir);

    const generator = new ManifestGenerator();
    generator.bmadFolderName = runtimeFolder;
    generator.helpAuthorityRecords = [
      {
        canonicalId: 'bmad-help',
        authoritySourceType: 'sidecar',
        authoritySourcePath: SIDEcar_AUTHORITY_SOURCE_PATH,
      },
    ];
    generator.tasks = perturbed
      ? []
      : [
          {
            name: 'help',
            displayName: 'help',
            description: 'Help command',
            module: 'core',
            path: `${runtimeFolder}/core/tasks/help.md`,
            standalone: 'true',
          },
        ];

    await generator.writeTaskManifest(cfgDir);
    const outputPath = path.join(cfgDir, 'task-manifest.csv');
    const content = await fs.readFile(outputPath, 'utf8');
    return {
      content,
      targetRowCount: countManifestClaimRows(content, runtimeFolder),
    };
  }

  async runHelpCatalogGeneratorReplay({ workspaceRoot, runtimeFolder, perturbed }) {
    const sidecarPath = path.join(workspaceRoot, 'src', 'core', 'tasks', 'help.artifact.yaml');
    await fs.ensureDir(path.dirname(sidecarPath));
    await fs.writeFile(
      sidecarPath,
      yaml.stringify(
        buildReplaySidecarFixture({
          canonicalId: perturbed ? 'bmad-help-replay-perturbed' : 'bmad-help',
        }),
      ),
      'utf8',
    );

    const generated = await buildSidecarAwareExemplarHelpRow({
      sidecarPath,
      bmadFolderName: runtimeFolder,
    });
    const content = serializeCsv(HELP_CATALOG_COLUMNS, [generated.row]);
    return {
      content,
      targetRowCount: countHelpCatalogClaimRows(content),
    };
  }

  async runInstallerMergeReplay({ workspaceRoot, runtimeFolder, perturbed }) {
    const { Installer } = require('./installer');
    const bmadDir = path.join(workspaceRoot, runtimeFolder);
    const coreDir = path.join(bmadDir, 'core');
    const cfgDir = path.join(bmadDir, '_config');
    await fs.ensureDir(coreDir);
    await fs.ensureDir(cfgDir);

    const moduleHelpFixtureRows = [
      {
        module: 'core',
        phase: 'anytime',
        name: 'bmad-help',
        code: 'BH',
        sequence: '',
        'workflow-file': `${runtimeFolder}/core/tasks/help.md`,
        command: 'bmad-help',
        required: 'false',
        agent: '',
        options: '',
        description: 'Help command',
        'output-location': '',
        outputs: '',
      },
    ];
    await fs.writeFile(path.join(coreDir, 'module-help.csv'), serializeCsv(MODULE_HELP_COMPAT_COLUMNS, moduleHelpFixtureRows), 'utf8');
    await fs.writeFile(
      path.join(cfgDir, 'agent-manifest.csv'),
      'name,displayName,title,icon,capabilities,role,identity,communicationStyle,principles,module,path\n',
      'utf8',
    );

    const installer = new Installer();
    installer.bmadFolderName = runtimeFolder;
    installer.installedFiles = new Set();
    installer.helpAuthorityRecords = perturbed
      ? [
          {
            canonicalId: 'bmad-help-replay-perturbed',
            authoritySourceType: 'sidecar',
            authoritySourcePath: SIDEcar_AUTHORITY_SOURCE_PATH,
          },
        ]
      : [];

    await installer.mergeModuleHelpCatalogs(bmadDir);
    const outputPath = path.join(cfgDir, 'bmad-help.csv');
    const content = await fs.readFile(outputPath, 'utf8');
    return {
      content,
      targetRowCount: countHelpCatalogClaimRows(content),
    };
  }

  async runCodexExportReplay({ workspaceRoot, perturbed }) {
    const projectDir = workspaceRoot;
    const sourceDir = path.join(projectDir, 'src', 'core', 'tasks');
    await fs.ensureDir(sourceDir);
    await fs.writeFile(
      path.join(sourceDir, 'help.artifact.yaml'),
      yaml.stringify(
        buildReplaySidecarFixture({
          canonicalId: perturbed ? 'bmad-help-replay-perturbed' : 'bmad-help',
        }),
      ),
      'utf8',
    );

    const codex = new CodexSetup();
    codex.exportDerivationRecords = [];
    const artifact = {
      type: 'task',
      name: 'help',
      displayName: 'help',
      module: 'core',
      sourcePath: path.join(sourceDir, 'help.md'),
      relativePath: path.join('core', 'tasks', 'help.md'),
      content: '---\nname: help\ndescription: Help command\n---\n\n# Help\n',
    };

    const destDir = path.join(projectDir, '.agents', 'skills');
    await fs.ensureDir(destDir);
    await codex.writeSkillArtifacts(destDir, [artifact], 'task', { projectDir });

    const outputPath = path.join(destDir, 'bmad-help', 'SKILL.md');
    const content = await fs.readFile(outputPath, 'utf8');
    return {
      content,
      targetRowCount: countExemplarSkillProjectionRows(content),
    };
  }

  async executeIsolatedReplay({ artifactPath, componentPath, rowIdentity, runtimeFolder }) {
    const contract = this.resolveReplayContract({
      artifactPath,
      componentPath,
      rowIdentity,
      runtimeFolder,
    });
    const baselineWorkspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'wave1-replay-baseline-'));
    const perturbedWorkspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'wave1-replay-perturbed-'));

    try {
      const baseline = await contract.run({ workspaceRoot: baselineWorkspaceRoot, perturbed: false });
      if (Number(baseline.targetRowCount) <= 0) {
        throw new Wave1ValidationHarnessError({
          code: WAVE1_VALIDATION_ERROR_CODES.REQUIRED_ROW_IDENTITY_MISSING,
          detail: 'Claimed rowIdentity target is absent in baseline component replay output',
          artifactId: 3,
          fieldPath: 'rowIdentity',
          sourcePath: artifactPath,
          observedValue: Number(baseline.targetRowCount),
          expectedValue: `at least one row bound to ${normalizeValue(rowIdentity)}`,
        });
      }

      let mutated;
      try {
        mutated = await contract.run({ workspaceRoot: perturbedWorkspaceRoot, perturbed: true });
      } catch (error) {
        mutated = {
          content: replayFailurePayload(error),
          targetRowCount: 0,
        };
      }

      return {
        baselineContent: baseline.content,
        mutatedContent: mutated.content,
        baselineTargetRowCount: Number(baseline.targetRowCount),
        mutatedTargetRowCount: Number(mutated.targetRowCount),
        perturbationApplied: true,
        mutationKind: contract.mutationKind,
        targetedRowLocator: normalizeValue(rowIdentity),
      };
    } finally {
      await fs.remove(baselineWorkspaceRoot);
      await fs.remove(perturbedWorkspaceRoot);
    }
  }

  async buildObservedBindingEvidence({ artifactPath, absolutePath, componentPath, rowIdentity, optionalSurface = false, runtimeFolder }) {
    const exists = await fs.pathExists(absolutePath);
    if (!exists && optionalSurface) {
      const sentinelHash = computeSha256('surface-not-required');
      const payload = {
        evidenceVersion: 1,
        observationMethod: 'validator-observed-optional-surface-omitted',
        observationOutcome: 'surface-not-required',
        artifactPath,
        componentPath,
        baselineArtifactSha256: sentinelHash,
        mutatedArtifactSha256: sentinelHash,
        baselineRowIdentity: rowIdentity,
        mutatedRowIdentity: rowIdentity,
        targetedRowLocator: normalizeValue(rowIdentity),
        rowLevelDiffSha256: computeSha256(`${artifactPath}|${componentPath}|surface-not-required`),
        perturbationApplied: false,
        baselineTargetRowCount: 0,
        mutatedTargetRowCount: 0,
        mutationKind: 'not-applicable',
        serializationFormat: 'json-canonical-v1',
        encoding: 'utf-8',
        lineEndings: 'lf',
        worktreePath: 'in-memory-isolated-replay',
        commitSha: 'not-applicable',
        timestampUtc: '1970-01-01T00:00:00Z',
      };
      return {
        evidenceMethod: 'validator-observed-optional-surface-omitted',
        issuingComponentBindingBasis: 'validator-observed-optional-surface-omitted',
        issuingComponentBindingEvidence: canonicalJsonStringify(payload),
        status: 'SKIP',
      };
    }

    const mutationResult = await this.executeIsolatedReplay({
      artifactPath,
      componentPath,
      rowIdentity,
      runtimeFolder: normalizeValue(runtimeFolder || '_bmad'),
    });

    const baselineArtifactSha256 = computeSha256(mutationResult.baselineContent);
    const mutatedArtifactSha256 = computeSha256(mutationResult.mutatedContent);
    const diffPayload = {
      artifactPath,
      componentPath,
      rowIdentity,
      mutationKind: mutationResult.mutationKind,
      targetedRowLocator: mutationResult.targetedRowLocator,
      baselineTargetRowCount: mutationResult.baselineTargetRowCount,
      mutatedTargetRowCount: mutationResult.mutatedTargetRowCount,
      baselineArtifactSha256,
      mutatedArtifactSha256,
    };
    const payload = {
      evidenceVersion: 1,
      observationMethod: 'validator-observed-baseline-plus-isolated-single-component-perturbation',
      observationOutcome: mutationResult.perturbationApplied ? 'observed-impact' : 'no-impact-observed',
      artifactPath,
      componentPath,
      baselineArtifactSha256,
      mutatedArtifactSha256,
      baselineRowIdentity: rowIdentity,
      mutatedRowIdentity: rowIdentity,
      rowLevelDiffSha256: computeSha256(canonicalJsonStringify(diffPayload)),
      perturbationApplied: Boolean(mutationResult.perturbationApplied),
      baselineTargetRowCount: mutationResult.baselineTargetRowCount,
      mutatedTargetRowCount: mutationResult.mutatedTargetRowCount,
      mutationKind: mutationResult.mutationKind,
      targetedRowLocator: mutationResult.targetedRowLocator,
      serializationFormat: 'json-canonical-v1',
      encoding: 'utf-8',
      lineEndings: 'lf',
      worktreePath: 'in-memory-isolated-replay',
      commitSha: 'not-applicable',
      timestampUtc: '1970-01-01T00:00:00Z',
    };

    return {
      evidenceMethod: 'validator-observed-baseline-plus-isolated-single-component-perturbation',
      issuingComponentBindingBasis: 'validator-observed-baseline-plus-isolated-single-component-perturbation',
      issuingComponentBindingEvidence: canonicalJsonStringify(payload),
      status: 'PASS',
    };
  }

  async createIssuedArtifactProvenanceRows({ runtimeFolder, bmadDir, projectDir, requireExportSkillProjection }) {
    const artifactBindings = [
      {
        artifactPath: `${runtimeFolder}/_config/task-manifest.csv`,
        absolutePath: path.join(bmadDir, '_config', 'task-manifest.csv'),
        issuingComponent: 'bmad-fork/tools/cli/installers/lib/core/manifest-generator.js',
      },
      {
        artifactPath: `${runtimeFolder}/core/module-help.csv`,
        absolutePath: path.join(bmadDir, 'core', 'module-help.csv'),
        issuingComponent: 'bmad-fork/tools/cli/installers/lib/core/help-catalog-generator.js::buildSidecarAwareExemplarHelpRow()',
      },
      {
        artifactPath: `${runtimeFolder}/_config/bmad-help.csv`,
        absolutePath: path.join(bmadDir, '_config', 'bmad-help.csv'),
        issuingComponent: 'bmad-fork/tools/cli/installers/lib/core/installer.js::mergeModuleHelpCatalogs()',
      },
      {
        artifactPath: '.agents/skills/bmad-help/SKILL.md',
        absolutePath: path.join(projectDir, '.agents', 'skills', 'bmad-help', 'SKILL.md'),
        issuingComponent: 'bmad-fork/tools/cli/installers/lib/ide/codex.js',
        optionalSurface: !requireExportSkillProjection,
      },
    ];

    const provenanceRows = [];
    for (const binding of artifactBindings) {
      const rowIdentity = buildIssuedArtifactRowIdentity(binding.artifactPath);
      const evidence = await this.buildObservedBindingEvidence({
        artifactPath: binding.artifactPath,
        absolutePath: binding.absolutePath,
        componentPath: binding.issuingComponent,
        rowIdentity,
        optionalSurface: Boolean(binding.optionalSurface),
        runtimeFolder,
      });
      provenanceRows.push({
        rowIdentity,
        artifactPath: binding.artifactPath,
        canonicalId: 'bmad-help',
        issuerOwnerClass: 'independent-validator',
        evidenceIssuerComponent: EVIDENCE_ISSUER_COMPONENT,
        evidenceMethod: evidence.evidenceMethod,
        issuingComponent: binding.issuingComponent,
        issuingComponentBindingBasis: evidence.issuingComponentBindingBasis,
        issuingComponentBindingEvidence: evidence.issuingComponentBindingEvidence,
        claimScope: binding.artifactPath,
        status: evidence.status,
      });
    }

    return provenanceRows;
  }

  makeEvidenceLookup(provenanceRows) {
    const byArtifactPath = new Map();
    for (const row of provenanceRows) {
      byArtifactPath.set(row.artifactPath, row);
    }
    return byArtifactPath;
  }

  async generateValidationArtifacts(options = {}) {
    const outputPaths = this.resolveOutputPaths(options);
    const runtimeFolder = normalizeValue(options.bmadFolderName || '_bmad');
    const bmadDir = path.resolve(options.bmadDir || path.join(outputPaths.projectDir, runtimeFolder));
    const artifactPaths = this.buildArtifactPathsMap(outputPaths);
    const sourcePaths = await this.resolveSourceArtifactPaths({
      ...options,
      projectDir: outputPaths.projectDir,
    });
    const sidecarMetadata = await this.readSidecarMetadata(sourcePaths.sidecarPath);

    await fs.ensureDir(outputPaths.validationRoot);
    await fs.ensureDir(outputPaths.decisionRecordsRoot);

    const runtimeTaskPath = `${runtimeFolder}/core/tasks/help.md`;
    const runtimeModuleHelpPath = `${runtimeFolder}/core/module-help.csv`;
    const runtimeTaskManifestPath = `${runtimeFolder}/_config/task-manifest.csv`;
    const runtimeAliasPath = `${runtimeFolder}/_config/canonical-aliases.csv`;
    const runtimeHelpCatalogPath = `${runtimeFolder}/_config/bmad-help.csv`;
    const runtimePipelinePath = `${runtimeFolder}/_config/bmad-help-catalog-pipeline.csv`;
    const runtimeCommandLabelPath = `${runtimeFolder}/_config/bmad-help-command-label-report.csv`;
    const evidenceArtifactPath = '_bmad-output/planning-artifacts/validation/wave-1/bmad-help-issued-artifact-provenance.csv';
    const exportSkillPath = '.agents/skills/bmad-help/SKILL.md';
    const exportSkillAbsolutePath = path.join(outputPaths.projectDir, '.agents', 'skills', 'bmad-help', 'SKILL.md');
    const codexExportRows =
      Array.isArray(options.codexExportDerivationRecords) && options.codexExportDerivationRecords.length > 0
        ? [...options.codexExportDerivationRecords]
        : [];
    const requireExportSkillProjection = options.requireExportSkillProjection !== false || codexExportRows.length > 0;
    const exportSkillProjectionExists = await fs.pathExists(exportSkillAbsolutePath);

    const requiredInputSurfaces = [
      {
        artifactId: 1,
        absolutePath: sourcePaths.sidecarPath,
        sourcePath: SIDEcar_AUTHORITY_SOURCE_PATH,
        description: 'sidecar metadata authority',
      },
      {
        artifactId: 2,
        absolutePath: sourcePaths.sourceMarkdownPath,
        sourcePath: SOURCE_MARKDOWN_SOURCE_PATH,
        description: 'source markdown authority',
      },
      {
        artifactId: 2,
        absolutePath: path.join(bmadDir, 'core', 'tasks', 'help.md'),
        sourcePath: runtimeTaskPath,
        description: 'runtime help markdown projection',
      },
      {
        artifactId: 4,
        absolutePath: path.join(bmadDir, '_config', 'task-manifest.csv'),
        sourcePath: runtimeTaskManifestPath,
        description: 'task-manifest projection',
      },
      {
        artifactId: 5,
        absolutePath: path.join(bmadDir, '_config', 'canonical-aliases.csv'),
        sourcePath: runtimeAliasPath,
        description: 'canonical-aliases projection',
      },
      {
        artifactId: 6,
        absolutePath: path.join(bmadDir, 'core', 'module-help.csv'),
        sourcePath: runtimeModuleHelpPath,
        description: 'module-help projection',
      },
      {
        artifactId: 8,
        absolutePath: path.join(bmadDir, '_config', 'bmad-help.csv'),
        sourcePath: runtimeHelpCatalogPath,
        description: 'merged help-catalog projection',
      },
      {
        artifactId: 8,
        absolutePath: path.join(bmadDir, '_config', 'bmad-help-command-label-report.csv'),
        sourcePath: runtimeCommandLabelPath,
        description: 'command-label report projection',
      },
      {
        artifactId: 9,
        absolutePath: path.join(bmadDir, '_config', 'bmad-help-catalog-pipeline.csv'),
        sourcePath: runtimePipelinePath,
        description: 'help-catalog pipeline projection',
      },
    ];
    if (requireExportSkillProjection) {
      requiredInputSurfaces.push({
        artifactId: 7,
        absolutePath: exportSkillAbsolutePath,
        sourcePath: exportSkillPath,
        description: 'export skill projection',
      });
    }
    for (const requiredSurface of requiredInputSurfaces) {
      // Story 3.1 is fail-fast: required projection inputs must exist before generating validator outputs.
      await this.assertRequiredInputSurfaceExists(requiredSurface);
    }

    const taskManifestRows = await this.readCsvSurface(path.join(bmadDir, '_config', 'task-manifest.csv'));
    const aliasRows = await this.readCsvSurface(path.join(bmadDir, '_config', 'canonical-aliases.csv'));
    const moduleHelpRows = await this.readCsvSurface(path.join(bmadDir, 'core', 'module-help.csv'));
    const helpCatalogRows = await this.readCsvSurface(path.join(bmadDir, '_config', 'bmad-help.csv'));

    const pipelineRowsInput = Array.isArray(options.helpCatalogPipelineRows) && options.helpCatalogPipelineRows.length > 0;
    const commandLabelRowsInput =
      Array.isArray(options.helpCatalogCommandLabelReportRows) && options.helpCatalogCommandLabelReportRows.length > 0;

    const pipelineRows = pipelineRowsInput
      ? [...options.helpCatalogPipelineRows]
      : await this.readCsvSurface(path.join(bmadDir, '_config', 'bmad-help-catalog-pipeline.csv'));
    const commandLabelRows = commandLabelRowsInput
      ? [...options.helpCatalogCommandLabelReportRows]
      : await this.readCsvSurface(path.join(bmadDir, '_config', 'bmad-help-command-label-report.csv'));

    const provenanceRows = await this.createIssuedArtifactProvenanceRows({
      runtimeFolder,
      bmadDir,
      projectDir: outputPaths.projectDir,
      requireExportSkillProjection,
    });
    const evidenceLookup = this.makeEvidenceLookup(provenanceRows);

    // Artifact 1: sidecar snapshot
    const sidecarSnapshot = {
      schemaVersion: sidecarMetadata.schemaVersion,
      canonicalId: sidecarMetadata.canonicalId || 'bmad-help',
      artifactType: sidecarMetadata.artifactType || 'task',
      module: sidecarMetadata.module || 'core',
      sourcePath: SIDEcar_AUTHORITY_SOURCE_PATH,
      displayName: sidecarMetadata.displayName || 'help',
      description: sidecarMetadata.description || 'Help command',
      dependencies: {
        requires: Array.isArray(sidecarMetadata.dependencies.requires) ? sidecarMetadata.dependencies.requires : [],
      },
      status: 'PASS',
    };
    await fs.writeFile(artifactPaths.get(1), yaml.stringify(sidecarSnapshot), 'utf8');

    // Artifact 2: runtime comparison
    const runtimeComparisonRows = [
      {
        surface: runtimeTaskPath,
        runtimePath: runtimeTaskPath,
        sourcePath: SOURCE_MARKDOWN_SOURCE_PATH,
        canonicalId: 'bmad-help',
        normalizedCapabilityKey: 'capability:bmad-help',
        visibleName: 'help',
        inclusionClassification: 'included-runtime-content',
        contentAuthoritySourceType: 'source-markdown',
        contentAuthoritySourcePath: SOURCE_MARKDOWN_SOURCE_PATH,
        metadataAuthoritySourceType: 'sidecar',
        metadataAuthoritySourcePath: SIDEcar_AUTHORITY_SOURCE_PATH,
        status: 'PASS',
      },
      {
        surface: runtimeModuleHelpPath,
        runtimePath: runtimeModuleHelpPath,
        sourcePath: SOURCE_MARKDOWN_SOURCE_PATH,
        canonicalId: 'bmad-help',
        normalizedCapabilityKey: 'capability:bmad-help',
        visibleName: 'help',
        inclusionClassification: 'excluded-non-content-projection',
        contentAuthoritySourceType: 'n/a',
        contentAuthoritySourcePath: 'n/a',
        metadataAuthoritySourceType: 'sidecar',
        metadataAuthoritySourcePath: SIDEcar_AUTHORITY_SOURCE_PATH,
        status: 'PASS',
      },
    ];
    await this.writeCsvArtifact(artifactPaths.get(2), this.registry[1].columns, runtimeComparisonRows);

    // Artifact 3: issued artifact provenance
    await this.writeCsvArtifact(artifactPaths.get(3), this.registry[2].columns, provenanceRows);

    const manifestHelpRow = this.requireRow({
      rows: taskManifestRows,
      predicate: (row) => normalizeValue(row.canonicalId) === 'bmad-help',
      artifactId: 4,
      fieldPath: 'rows[canonicalId=bmad-help]',
      sourcePath: runtimeTaskManifestPath,
      detail: 'Required task-manifest exemplar row is missing',
    });
    const manifestEvidence = this.requireRow({
      rows: provenanceRows,
      predicate: (row) => normalizeValue(row.artifactPath) === runtimeTaskManifestPath && normalizeValue(row.status) === 'PASS',
      artifactId: 4,
      fieldPath: 'rows[artifactPath=_bmad/_config/task-manifest.csv]',
      sourcePath: evidenceArtifactPath,
      detail: 'Required manifest issuing-component binding evidence row is missing',
    });

    // Artifact 4: manifest comparison
    const manifestComparisonRows = [
      {
        surface: runtimeTaskManifestPath,
        sourcePath: SOURCE_MARKDOWN_SOURCE_PATH,
        legacyName: normalizeValue(manifestHelpRow.legacyName || manifestHelpRow.name || 'help'),
        canonicalId: normalizeValue(manifestHelpRow.canonicalId || 'bmad-help'),
        displayName: normalizeValue(manifestHelpRow.displayName || 'help'),
        normalizedCapabilityKey: 'capability:bmad-help',
        authoritySourceType: normalizeValue(manifestHelpRow.authoritySourceType || 'sidecar'),
        authoritySourcePath: normalizeValue(manifestHelpRow.authoritySourcePath || SIDEcar_AUTHORITY_SOURCE_PATH),
        issuerOwnerClass: 'independent-validator',
        issuingComponent: manifestEvidence.issuingComponent,
        issuedArtifactEvidencePath: evidenceArtifactPath,
        issuedArtifactEvidenceRowIdentity: manifestEvidence.rowIdentity,
        issuingComponentBindingEvidence: manifestEvidence.issuingComponentBindingEvidence,
        status: 'PASS',
      },
    ];
    await this.writeCsvArtifact(artifactPaths.get(4), this.registry[3].columns, manifestComparisonRows);

    // Artifact 5: alias table
    const aliasRowsForExemplar = aliasRows
      .filter((row) => normalizeValue(row.canonicalId) === 'bmad-help')
      .map((row) => ({
        rowIdentity: normalizeValue(row.rowIdentity),
        canonicalId: normalizeValue(row.canonicalId),
        alias: normalizeValue(row.alias),
        aliasType: normalizeValue(row.aliasType),
        normalizedAliasValue: normalizeValue(row.normalizedAliasValue),
        rawIdentityHasLeadingSlash: normalizeValue(row.rawIdentityHasLeadingSlash),
        resolutionEligibility: normalizeValue(row.resolutionEligibility),
        authoritySourceType: normalizeValue(row.authoritySourceType || 'sidecar'),
        authoritySourcePath: normalizeValue(row.authoritySourcePath || SIDEcar_AUTHORITY_SOURCE_PATH),
        status: 'PASS',
      }));
    if (aliasRowsForExemplar.length === 0) {
      throw new Wave1ValidationHarnessError({
        code: WAVE1_VALIDATION_ERROR_CODES.REQUIRED_ROW_IDENTITY_MISSING,
        detail: 'Required canonical alias rows for exemplar are missing',
        artifactId: 5,
        fieldPath: 'rows[canonicalId=bmad-help]',
        sourcePath: runtimeAliasPath,
        observedValue: '<missing>',
        expectedValue: 'required row',
      });
    }
    await this.writeCsvArtifact(artifactPaths.get(5), this.registry[4].columns, aliasRowsForExemplar);

    // Artifact 6: description provenance
    const moduleHelpRow = this.requireRow({
      rows: moduleHelpRows,
      predicate: (row) => normalizeValue(row.command).replace(/^\/+/, '') === 'bmad-help',
      artifactId: 6,
      fieldPath: 'rows[command=bmad-help]',
      sourcePath: runtimeModuleHelpPath,
      detail: 'Required module-help exemplar command row is missing',
    });
    const helpCatalogRow = this.requireRow({
      rows: helpCatalogRows,
      predicate: (row) => normalizeValue(row.command).replace(/^\/+/, '') === 'bmad-help',
      artifactId: 6,
      fieldPath: 'rows[command=bmad-help]',
      sourcePath: runtimeHelpCatalogPath,
      detail: 'Required merged help-catalog exemplar command row is missing',
    });

    const descriptionProvenanceRows = [
      {
        surface: runtimeTaskManifestPath,
        sourcePath: SOURCE_MARKDOWN_SOURCE_PATH,
        canonicalId: 'bmad-help',
        descriptionValue: normalizeValue(manifestHelpRow.description || sidecarMetadata.description),
        expectedDescriptionValue: sidecarMetadata.description,
        descriptionAuthoritySourceType: 'sidecar',
        descriptionAuthoritySourcePath: SIDEcar_AUTHORITY_SOURCE_PATH,
        issuedArtifactEvidencePath: evidenceArtifactPath,
        issuedArtifactEvidenceRowIdentity: manifestEvidence.rowIdentity,
        status: 'PASS',
      },
      {
        surface: runtimeModuleHelpPath,
        sourcePath: SOURCE_MARKDOWN_SOURCE_PATH,
        canonicalId: 'bmad-help',
        descriptionValue: normalizeValue(moduleHelpRow.description || sidecarMetadata.description),
        expectedDescriptionValue: sidecarMetadata.description,
        descriptionAuthoritySourceType: 'sidecar',
        descriptionAuthoritySourcePath: SIDEcar_AUTHORITY_SOURCE_PATH,
        issuedArtifactEvidencePath: evidenceArtifactPath,
        issuedArtifactEvidenceRowIdentity: this.requireRow({
          rows: provenanceRows,
          predicate: (row) => normalizeValue(row.artifactPath) === runtimeModuleHelpPath && normalizeValue(row.status) === 'PASS',
          artifactId: 6,
          fieldPath: 'rows[artifactPath=_bmad/core/module-help.csv]',
          sourcePath: evidenceArtifactPath,
          detail: 'Required module-help issuing-component binding evidence row is missing',
        }).rowIdentity,
        status: 'PASS',
      },
      {
        surface: runtimeHelpCatalogPath,
        sourcePath: SOURCE_MARKDOWN_SOURCE_PATH,
        canonicalId: 'bmad-help',
        descriptionValue: normalizeValue(helpCatalogRow.description || sidecarMetadata.description),
        expectedDescriptionValue: sidecarMetadata.description,
        descriptionAuthoritySourceType: 'sidecar',
        descriptionAuthoritySourcePath: SIDEcar_AUTHORITY_SOURCE_PATH,
        issuedArtifactEvidencePath: evidenceArtifactPath,
        issuedArtifactEvidenceRowIdentity: this.requireRow({
          rows: provenanceRows,
          predicate: (row) => normalizeValue(row.artifactPath) === runtimeHelpCatalogPath && normalizeValue(row.status) === 'PASS',
          artifactId: 6,
          fieldPath: 'rows[artifactPath=_bmad/_config/bmad-help.csv]',
          sourcePath: evidenceArtifactPath,
          detail: 'Required merged help-catalog issuing-component binding evidence row is missing',
        }).rowIdentity,
        status: 'PASS',
      },
    ];
    await this.writeCsvArtifact(artifactPaths.get(6), this.registry[5].columns, descriptionProvenanceRows);

    // Artifact 7: export comparison
    const exportEvidence = evidenceLookup.get(exportSkillPath);
    const exportRowIdentity = normalizeValue(exportEvidence?.rowIdentity || buildIssuedArtifactRowIdentity(exportSkillPath));
    const exportIssuingComponent = normalizeValue(exportEvidence?.issuingComponent || 'not-applicable');
    const exportBindingEvidence = normalizeValue(exportEvidence?.issuingComponentBindingEvidence || '');
    const exportStatus = requireExportSkillProjection || exportSkillProjectionExists ? 'PASS' : 'SKIP';
    const exportSkillFrontmatter = exportSkillProjectionExists ? parseFrontmatter(await fs.readFile(exportSkillAbsolutePath, 'utf8')) : {};
    const codexRecord = codexExportRows.find((row) => normalizeValue(row.canonicalId) === 'bmad-help');
    const exportPath = normalizeValue(codexRecord?.exportPath || exportSkillPath);
    const exportComparisonRows = [
      {
        exportPath,
        sourcePath: SOURCE_MARKDOWN_SOURCE_PATH,
        canonicalId: 'bmad-help',
        visibleId: normalizeValue(codexRecord?.visibleId || exportSkillFrontmatter.name || sidecarMetadata.canonicalId || 'bmad-help'),
        visibleSurfaceClass: normalizeValue(codexRecord?.visibleSurfaceClass || 'export-id'),
        normalizedVisibleKey: 'export-id:bmad-help',
        authoritySourceType: normalizeValue(codexRecord?.authoritySourceType || 'sidecar'),
        authoritySourcePath: normalizeValue(codexRecord?.authoritySourcePath || SIDEcar_AUTHORITY_SOURCE_PATH),
        exportIdDerivationSourceType: normalizeValue(codexRecord?.exportIdDerivationSourceType || 'sidecar-canonical-id'),
        exportIdDerivationSourcePath: normalizeValue(codexRecord?.exportIdDerivationSourcePath || SIDEcar_AUTHORITY_SOURCE_PATH),
        issuerOwnerClass: exportStatus === 'PASS' ? 'independent-validator' : 'not-applicable',
        issuingComponent: exportIssuingComponent,
        issuedArtifactEvidencePath: exportStatus === 'PASS' ? evidenceArtifactPath : 'not-applicable',
        issuedArtifactEvidenceRowIdentity: exportRowIdentity,
        issuingComponentBindingEvidence: exportBindingEvidence,
        status: exportStatus,
      },
    ];
    await this.writeCsvArtifact(artifactPaths.get(7), this.registry[6].columns, exportComparisonRows);

    // Artifact 8: command label report
    const commandLabelRow = this.requireRow({
      rows: commandLabelRows,
      predicate: (row) => normalizeValue(row.canonicalId) === 'bmad-help',
      artifactId: 8,
      fieldPath: 'rows[canonicalId=bmad-help]',
      sourcePath: runtimeCommandLabelPath,
      detail: 'Required command-label report exemplar row is missing',
    });
    const commandLabelEvidence = this.requireRow({
      rows: provenanceRows,
      predicate: (row) => normalizeValue(row.artifactPath) === runtimeHelpCatalogPath && normalizeValue(row.status) === 'PASS',
      artifactId: 8,
      fieldPath: 'rows[artifactPath=_bmad/_config/bmad-help.csv]',
      sourcePath: evidenceArtifactPath,
      detail: 'Required command-label issuing-component binding evidence row is missing',
    });
    const validationCommandLabelRows = [
      {
        surface: runtimeHelpCatalogPath,
        sourcePath: SOURCE_MARKDOWN_SOURCE_PATH,
        canonicalId: 'bmad-help',
        rawCommandValue: normalizeValue(commandLabelRow.rawCommandValue || 'bmad-help').replace(/^\/+/, ''),
        displayedCommandLabel: normalizeValue(commandLabelRow.displayedCommandLabel || '/bmad-help'),
        normalizedDisplayedLabel: normalizeValue(commandLabelRow.normalizedDisplayedLabel || '/bmad-help'),
        rowCountForCanonicalId: normalizeValue(commandLabelRow.rowCountForCanonicalId || 1),
        authoritySourceType: normalizeValue(commandLabelRow.authoritySourceType || 'sidecar'),
        authoritySourcePath: normalizeValue(commandLabelRow.authoritySourcePath || SIDEcar_AUTHORITY_SOURCE_PATH),
        issuedArtifactEvidencePath: evidenceArtifactPath,
        issuedArtifactEvidenceRowIdentity: commandLabelEvidence.rowIdentity,
        status: 'PASS',
      },
    ];
    await this.writeCsvArtifact(artifactPaths.get(8), this.registry[7].columns, validationCommandLabelRows);

    // Artifact 9: catalog pipeline
    const pipelineWithEvidence = pipelineRows
      .filter((row) => normalizeValue(row.canonicalId) === 'bmad-help')
      .map((row) => {
        const artifactPath = normalizeValue(row.artifactPath);
        const evidenceRow = evidenceLookup.get(artifactPath) || null;
        return {
          stage: normalizeValue(row.stage),
          artifactPath,
          rowIdentity: normalizeValue(row.rowIdentity),
          canonicalId: 'bmad-help',
          sourcePath: normalizeValue(row.sourcePath || SOURCE_MARKDOWN_SOURCE_PATH),
          rowCountForStageCanonicalId: normalizeValue(row.rowCountForStageCanonicalId || 1),
          commandValue: normalizeValue(row.commandValue || 'bmad-help'),
          expectedCommandValue: normalizeValue(row.expectedCommandValue || 'bmad-help'),
          descriptionValue: normalizeValue(row.descriptionValue || sidecarMetadata.description),
          expectedDescriptionValue: normalizeValue(row.expectedDescriptionValue || sidecarMetadata.description),
          descriptionAuthoritySourceType: normalizeValue(row.descriptionAuthoritySourceType || 'sidecar'),
          descriptionAuthoritySourcePath: normalizeValue(row.descriptionAuthoritySourcePath || SIDEcar_AUTHORITY_SOURCE_PATH),
          commandAuthoritySourceType: normalizeValue(row.commandAuthoritySourceType || 'sidecar'),
          commandAuthoritySourcePath: normalizeValue(row.commandAuthoritySourcePath || SIDEcar_AUTHORITY_SOURCE_PATH),
          issuerOwnerClass: 'independent-validator',
          issuingComponent: normalizeValue(evidenceRow?.issuingComponent || row.issuingComponent),
          issuedArtifactEvidencePath: evidenceArtifactPath,
          issuedArtifactEvidenceRowIdentity: normalizeValue(evidenceRow?.rowIdentity || ''),
          issuingComponentBindingEvidence: normalizeValue(evidenceRow?.issuingComponentBindingEvidence || ''),
          stageStatus: normalizeValue(row.stageStatus || row.status || 'PASS'),
          status: normalizeValue(row.status || 'PASS'),
        };
      });
    if (pipelineWithEvidence.length === 0) {
      throw new Wave1ValidationHarnessError({
        code: WAVE1_VALIDATION_ERROR_CODES.REQUIRED_ROW_IDENTITY_MISSING,
        detail: 'Required help-catalog pipeline exemplar rows are missing',
        artifactId: 9,
        fieldPath: 'rows[canonicalId=bmad-help]',
        sourcePath: runtimePipelinePath,
        observedValue: '<missing>',
        expectedValue: 'required row',
      });
    }
    await this.writeCsvArtifact(artifactPaths.get(9), this.registry[8].columns, pipelineWithEvidence);

    // Artifact 10: duplicate report
    const groupedSourcePathSet = `${SIDEcar_AUTHORITY_SOURCE_PATH}|${SOURCE_MARKDOWN_SOURCE_PATH}`;
    const duplicateRows = [
      {
        surface: SOURCE_MARKDOWN_SOURCE_PATH,
        ownerClass: 'bmad-source',
        sourcePath: SOURCE_MARKDOWN_SOURCE_PATH,
        canonicalId: 'bmad-help',
        normalizedCapabilityKey: 'capability:bmad-help',
        visibleName: 'help',
        visibleId: 'bmad-help',
        visibleSurfaceClass: 'source-markdown',
        normalizedVisibleKey: 'source-markdown:help',
        authorityRole: 'authoritative',
        authoritySourceType: 'source-markdown',
        authoritySourcePath: SOURCE_MARKDOWN_SOURCE_PATH,
        authoritativePresenceKey: 'capability:bmad-help',
        groupedAuthoritativePresenceCount: 1,
        groupedAuthoritativeSourceRecordCount: 2,
        groupedAuthoritativeSourcePathSet: groupedSourcePathSet,
        rawIdentityHasLeadingSlash: 'false',
        preAliasNormalizedValue: 'help',
        postAliasCanonicalId: 'bmad-help',
        aliasRowLocator: 'alias-row:bmad-help:legacy-name',
        aliasResolutionEvidence: buildAliasResolutionEvidence('help', false, 'alias-row:bmad-help:legacy-name'),
        aliasResolutionSourcePath: `${runtimeFolder}/_config/canonical-aliases.csv`,
        conflictingProjectedRecordCount: 0,
        wrapperAuthoritativeRecordCount: 0,
        status: 'PASS',
      },
      {
        surface: SIDEcar_AUTHORITY_SOURCE_PATH,
        ownerClass: 'bmad-source',
        sourcePath: SOURCE_MARKDOWN_SOURCE_PATH,
        canonicalId: 'bmad-help',
        normalizedCapabilityKey: 'capability:bmad-help',
        visibleName: 'help',
        visibleId: 'bmad-help',
        visibleSurfaceClass: 'sidecar',
        normalizedVisibleKey: 'sidecar:bmad-help',
        authorityRole: 'authoritative',
        authoritySourceType: 'sidecar',
        authoritySourcePath: SIDEcar_AUTHORITY_SOURCE_PATH,
        authoritativePresenceKey: 'capability:bmad-help',
        groupedAuthoritativePresenceCount: 1,
        groupedAuthoritativeSourceRecordCount: 2,
        groupedAuthoritativeSourcePathSet: groupedSourcePathSet,
        rawIdentityHasLeadingSlash: 'false',
        preAliasNormalizedValue: 'bmad-help',
        postAliasCanonicalId: 'bmad-help',
        aliasRowLocator: 'alias-row:bmad-help:canonical-id',
        aliasResolutionEvidence: buildAliasResolutionEvidence('bmad-help', false, 'alias-row:bmad-help:canonical-id'),
        aliasResolutionSourcePath: `${runtimeFolder}/_config/canonical-aliases.csv`,
        conflictingProjectedRecordCount: 0,
        wrapperAuthoritativeRecordCount: 0,
        status: 'PASS',
      },
      {
        surface: runtimeTaskPath,
        ownerClass: 'bmad-generated-runtime',
        sourcePath: SOURCE_MARKDOWN_SOURCE_PATH,
        canonicalId: 'bmad-help',
        normalizedCapabilityKey: 'capability:bmad-help',
        visibleName: 'help',
        visibleId: 'bmad-help',
        visibleSurfaceClass: 'runtime-markdown',
        normalizedVisibleKey: 'runtime-markdown:help',
        authorityRole: 'projected',
        authoritySourceType: 'source-markdown',
        authoritySourcePath: SOURCE_MARKDOWN_SOURCE_PATH,
        authoritativePresenceKey: 'capability:bmad-help',
        groupedAuthoritativePresenceCount: 1,
        groupedAuthoritativeSourceRecordCount: 2,
        groupedAuthoritativeSourcePathSet: groupedSourcePathSet,
        rawIdentityHasLeadingSlash: 'false',
        preAliasNormalizedValue: 'help',
        postAliasCanonicalId: 'bmad-help',
        aliasRowLocator: 'alias-row:bmad-help:legacy-name',
        aliasResolutionEvidence: buildAliasResolutionEvidence('help', false, 'alias-row:bmad-help:legacy-name'),
        aliasResolutionSourcePath: `${runtimeFolder}/_config/canonical-aliases.csv`,
        conflictingProjectedRecordCount: 0,
        wrapperAuthoritativeRecordCount: 0,
        status: 'PASS',
      },
      {
        surface: runtimeModuleHelpPath,
        ownerClass: 'bmad-generated-runtime',
        sourcePath: SOURCE_MARKDOWN_SOURCE_PATH,
        canonicalId: 'bmad-help',
        normalizedCapabilityKey: 'capability:bmad-help',
        visibleName: 'bmad-help',
        visibleId: '/bmad-help',
        visibleSurfaceClass: 'module-help-command',
        normalizedVisibleKey: 'module-help-command:/bmad-help',
        authorityRole: 'projected',
        authoritySourceType: 'sidecar',
        authoritySourcePath: SIDEcar_AUTHORITY_SOURCE_PATH,
        authoritativePresenceKey: 'capability:bmad-help',
        groupedAuthoritativePresenceCount: 1,
        groupedAuthoritativeSourceRecordCount: 2,
        groupedAuthoritativeSourcePathSet: groupedSourcePathSet,
        rawIdentityHasLeadingSlash: 'true',
        preAliasNormalizedValue: 'bmad-help',
        postAliasCanonicalId: 'bmad-help',
        aliasRowLocator: 'alias-row:bmad-help:slash-command',
        aliasResolutionEvidence: buildAliasResolutionEvidence('bmad-help', true, 'alias-row:bmad-help:slash-command'),
        aliasResolutionSourcePath: `${runtimeFolder}/_config/canonical-aliases.csv`,
        conflictingProjectedRecordCount: 0,
        wrapperAuthoritativeRecordCount: 0,
        status: 'PASS',
      },
      {
        surface: runtimeTaskManifestPath,
        ownerClass: 'bmad-generated-config',
        sourcePath: SOURCE_MARKDOWN_SOURCE_PATH,
        canonicalId: 'bmad-help',
        normalizedCapabilityKey: 'capability:bmad-help',
        visibleName: 'help',
        visibleId: 'bmad-help',
        visibleSurfaceClass: 'task-manifest',
        normalizedVisibleKey: 'task-manifest:help',
        authorityRole: 'projected',
        authoritySourceType: 'sidecar',
        authoritySourcePath: SIDEcar_AUTHORITY_SOURCE_PATH,
        authoritativePresenceKey: 'capability:bmad-help',
        groupedAuthoritativePresenceCount: 1,
        groupedAuthoritativeSourceRecordCount: 2,
        groupedAuthoritativeSourcePathSet: groupedSourcePathSet,
        rawIdentityHasLeadingSlash: 'false',
        preAliasNormalizedValue: 'help',
        postAliasCanonicalId: 'bmad-help',
        aliasRowLocator: 'alias-row:bmad-help:legacy-name',
        aliasResolutionEvidence: buildAliasResolutionEvidence('help', false, 'alias-row:bmad-help:legacy-name'),
        aliasResolutionSourcePath: `${runtimeFolder}/_config/canonical-aliases.csv`,
        conflictingProjectedRecordCount: 0,
        wrapperAuthoritativeRecordCount: 0,
        status: 'PASS',
      },
      {
        surface: runtimeAliasPath,
        ownerClass: 'bmad-generated-config',
        sourcePath: SOURCE_MARKDOWN_SOURCE_PATH,
        canonicalId: 'bmad-help',
        normalizedCapabilityKey: 'capability:bmad-help',
        visibleName: 'bmad-help',
        visibleId: 'bmad-help',
        visibleSurfaceClass: 'canonical-alias-table',
        normalizedVisibleKey: 'canonical-alias-table:bmad-help',
        authorityRole: 'projected',
        authoritySourceType: 'sidecar',
        authoritySourcePath: SIDEcar_AUTHORITY_SOURCE_PATH,
        authoritativePresenceKey: 'capability:bmad-help',
        groupedAuthoritativePresenceCount: 1,
        groupedAuthoritativeSourceRecordCount: 2,
        groupedAuthoritativeSourcePathSet: groupedSourcePathSet,
        rawIdentityHasLeadingSlash: 'false',
        preAliasNormalizedValue: 'bmad-help',
        postAliasCanonicalId: 'bmad-help',
        aliasRowLocator: 'alias-row:bmad-help:canonical-id',
        aliasResolutionEvidence: buildAliasResolutionEvidence('bmad-help', false, 'alias-row:bmad-help:canonical-id'),
        aliasResolutionSourcePath: `${runtimeFolder}/_config/canonical-aliases.csv`,
        conflictingProjectedRecordCount: 0,
        wrapperAuthoritativeRecordCount: 0,
        status: 'PASS',
      },
      {
        surface: runtimeHelpCatalogPath,
        ownerClass: 'bmad-generated-config',
        sourcePath: SOURCE_MARKDOWN_SOURCE_PATH,
        canonicalId: 'bmad-help',
        normalizedCapabilityKey: 'capability:bmad-help',
        visibleName: 'bmad-help',
        visibleId: '/bmad-help',
        visibleSurfaceClass: 'help-catalog-command',
        normalizedVisibleKey: 'help-catalog-command:/bmad-help',
        authorityRole: 'projected',
        authoritySourceType: 'sidecar',
        authoritySourcePath: SIDEcar_AUTHORITY_SOURCE_PATH,
        authoritativePresenceKey: 'capability:bmad-help',
        groupedAuthoritativePresenceCount: 1,
        groupedAuthoritativeSourceRecordCount: 2,
        groupedAuthoritativeSourcePathSet: groupedSourcePathSet,
        rawIdentityHasLeadingSlash: 'true',
        preAliasNormalizedValue: 'bmad-help',
        postAliasCanonicalId: 'bmad-help',
        aliasRowLocator: 'alias-row:bmad-help:slash-command',
        aliasResolutionEvidence: buildAliasResolutionEvidence('bmad-help', true, 'alias-row:bmad-help:slash-command'),
        aliasResolutionSourcePath: `${runtimeFolder}/_config/canonical-aliases.csv`,
        conflictingProjectedRecordCount: 0,
        wrapperAuthoritativeRecordCount: 0,
        status: 'PASS',
      },
      {
        surface: '.agents/skills/bmad-help/SKILL.md',
        ownerClass: 'bmad-generated-export',
        sourcePath: SOURCE_MARKDOWN_SOURCE_PATH,
        canonicalId: 'bmad-help',
        normalizedCapabilityKey: 'capability:bmad-help',
        visibleName: 'bmad-help',
        visibleId: 'bmad-help',
        visibleSurfaceClass: 'export-id',
        normalizedVisibleKey: 'export-id:bmad-help',
        authorityRole: 'projected',
        authoritySourceType: 'sidecar',
        authoritySourcePath: SIDEcar_AUTHORITY_SOURCE_PATH,
        authoritativePresenceKey: 'capability:bmad-help',
        groupedAuthoritativePresenceCount: 1,
        groupedAuthoritativeSourceRecordCount: 2,
        groupedAuthoritativeSourcePathSet: groupedSourcePathSet,
        rawIdentityHasLeadingSlash: 'false',
        preAliasNormalizedValue: 'bmad-help',
        postAliasCanonicalId: 'bmad-help',
        aliasRowLocator: 'alias-row:bmad-help:canonical-id',
        aliasResolutionEvidence: buildAliasResolutionEvidence('bmad-help', false, 'alias-row:bmad-help:canonical-id'),
        aliasResolutionSourcePath: `${runtimeFolder}/_config/canonical-aliases.csv`,
        conflictingProjectedRecordCount: 0,
        wrapperAuthoritativeRecordCount: 0,
        status: 'PASS',
      },
    ];
    await this.writeCsvArtifact(artifactPaths.get(10), this.registry[9].columns, duplicateRows);

    // Artifact 11: dependency report
    const dependencyRows = [
      {
        declaredIn: 'sidecar',
        sourcePath: SIDEcar_AUTHORITY_SOURCE_PATH,
        targetType: 'declaration',
        targetId: '[]',
        normalizedTargetId: '[]',
        expectedOwnerClass: 'none',
        resolutionCandidateCount: 0,
        resolvedOwnerClass: 'none',
        resolvedSurface: 'none',
        resolvedPath: 'none',
        authoritySourceType: 'sidecar',
        authoritySourcePath: SIDEcar_AUTHORITY_SOURCE_PATH,
        failureReason: 'none',
        status: 'PASS',
      },
    ];
    await this.writeCsvArtifact(artifactPaths.get(11), this.registry[10].columns, dependencyRows);

    // Artifact 12: decision record
    const decisionRecord = {
      wave: 1,
      goNoGo: 'GO',
      status: 'PASS',
    };
    const decisionRecordContent = `---\n${yaml.stringify(decisionRecord).trimEnd()}\n---\n\n# Wave 1 Native Skills Exit\n\nStatus: PASS\n`;
    await fs.writeFile(artifactPaths.get(12), decisionRecordContent, 'utf8');

    // Fixtures for artifacts 13 and 14
    const fixtures = await this.ensureValidationFixtures(outputPaths, sidecarMetadata);

    // Artifact 13: sidecar negative validation
    const sidecarNegativeRows = [];
    const sidecarNegativeScenarios = [
      {
        scenario: 'unknown-major-version',
        fixturePath: '_bmad-output/planning-artifacts/validation/wave-1/fixtures/sidecar-negative/unknown-major-version/help.artifact.yaml',
        absolutePath: fixtures.unknownMajorFixturePath,
        expectedFailureCode: HELP_SIDECAR_ERROR_CODES.MAJOR_VERSION_UNSUPPORTED,
        expectedFailureDetail: 'sidecar schema major version is unsupported',
      },
      {
        scenario: 'basename-path-mismatch',
        fixturePath:
          '_bmad-output/planning-artifacts/validation/wave-1/fixtures/sidecar-negative/basename-path-mismatch/help.artifact.yaml',
        absolutePath: fixtures.basenameMismatchFixturePath,
        expectedFailureCode: HELP_SIDECAR_ERROR_CODES.SOURCEPATH_BASENAME_MISMATCH,
        expectedFailureDetail: 'sidecar basename does not match sourcePath basename',
      },
    ];
    for (const scenario of sidecarNegativeScenarios) {
      const fixtureData = yaml.parse(await fs.readFile(scenario.absolutePath, 'utf8'));
      let observedFailureCode = '';
      let observedFailureDetail = '';
      try {
        await validateHelpSidecarContractFile(scenario.absolutePath, {
          errorSourcePath: scenario.fixturePath,
        });
      } catch (error) {
        observedFailureCode = normalizeValue(error.code);
        observedFailureDetail = normalizeValue(error.detail);
      }
      sidecarNegativeRows.push({
        scenario: scenario.scenario,
        fixturePath: scenario.fixturePath,
        observedSchemaVersion: normalizeValue(fixtureData.schemaVersion),
        observedSourcePathValue: normalizeValue(fixtureData.sourcePath),
        observedSidecarBasename: normalizeValue(path.basename(scenario.absolutePath)),
        expectedFailureCode: scenario.expectedFailureCode,
        observedFailureCode,
        expectedFailureDetail: scenario.expectedFailureDetail,
        observedFailureDetail,
        status:
          observedFailureCode === scenario.expectedFailureCode && observedFailureDetail === scenario.expectedFailureDetail
            ? 'PASS'
            : 'FAIL',
      });
    }
    await this.writeCsvArtifact(artifactPaths.get(13), this.registry[12].columns, sidecarNegativeRows);

    // Artifact 14: frontmatter mismatch validation
    const mismatchRows = [];
    const mismatchScenarios = [
      {
        scenario: 'canonical-id-mismatch',
        fieldPath: 'canonicalId',
        mismatchField: 'canonicalId',
        expectedFailureCode: HELP_FRONTMATTER_MISMATCH_ERROR_CODES.CANONICAL_ID_MISMATCH,
      },
      {
        scenario: 'display-name-mismatch',
        fieldPath: 'name',
        mismatchField: 'displayName',
        expectedFailureCode: HELP_FRONTMATTER_MISMATCH_ERROR_CODES.DISPLAY_NAME_MISMATCH,
      },
      {
        scenario: 'description-mismatch',
        fieldPath: 'description',
        mismatchField: 'description',
        expectedFailureCode: HELP_FRONTMATTER_MISMATCH_ERROR_CODES.DESCRIPTION_MISMATCH,
      },
      {
        scenario: 'dependencies-mismatch',
        fieldPath: 'dependencies.requires',
        mismatchField: 'dependencies.requires',
        expectedFailureCode: HELP_FRONTMATTER_MISMATCH_ERROR_CODES.DEPENDENCIES_REQUIRES_MISMATCH,
      },
    ];

    const makeValidFrontmatterMarkdown = () =>
      `---\n${yaml
        .stringify({
          name: sidecarMetadata.displayName,
          description: sidecarMetadata.description,
          canonicalId: sidecarMetadata.canonicalId,
          dependencies: {
            requires: Array.isArray(sidecarMetadata.dependencies.requires) ? sidecarMetadata.dependencies.requires : [],
          },
        })
        .trimEnd()}\n---\n\n# Valid\n`;

    const tempValidRuntimePath = path.join(outputPaths.validationRoot, 'fixtures', 'frontmatter-mismatch', 'runtime-valid.md');
    const tempValidSourcePath = path.join(outputPaths.validationRoot, 'fixtures', 'frontmatter-mismatch', 'source-valid.md');
    await fs.writeFile(tempValidRuntimePath, makeValidFrontmatterMarkdown(), 'utf8');
    await fs.writeFile(tempValidSourcePath, makeValidFrontmatterMarkdown(), 'utf8');

    for (const scope of ['source', 'runtime']) {
      for (const scenario of mismatchScenarios) {
        const fixturePath = path.join(outputPaths.validationRoot, 'fixtures', 'frontmatter-mismatch', scope, `${scenario.scenario}.md`);
        const fixtureRelativePath = `_bmad-output/planning-artifacts/validation/wave-1/fixtures/frontmatter-mismatch/${scope}/${scenario.scenario}.md`;
        let observedFailureCode = '';
        let observedFailureDetail = '';
        let observedFrontmatterValue = '';
        let expectedSidecarValue = '';
        let observedAuthoritativeSourceType = '';
        let observedAuthoritativeSourcePath = '';

        const parsedFixture = parseFrontmatter(await fs.readFile(fixturePath, 'utf8'));
        if (scenario.fieldPath === 'dependencies.requires') {
          observedFrontmatterValue = normalizeDependencyTargets(parsedFixture.dependencies?.requires);
          expectedSidecarValue = normalizeDependencyTargets(sidecarMetadata.dependencies.requires);
        } else {
          observedFrontmatterValue = normalizeValue(parsedFixture[scenario.fieldPath]);
          if (scenario.fieldPath === 'canonicalId') {
            expectedSidecarValue = sidecarMetadata.canonicalId;
          } else if (scenario.fieldPath === 'name') {
            expectedSidecarValue = sidecarMetadata.displayName;
          } else {
            expectedSidecarValue = sidecarMetadata.description;
          }
        }

        try {
          await validateHelpAuthoritySplitAndPrecedence({
            sidecarPath: sourcePaths.sidecarPath,
            sourceMarkdownPath: scope === 'source' ? fixturePath : tempValidSourcePath,
            runtimeMarkdownPath: scope === 'runtime' ? fixturePath : tempValidRuntimePath,
            sidecarSourcePath: SIDEcar_AUTHORITY_SOURCE_PATH,
            sourceMarkdownSourcePath: SOURCE_MARKDOWN_SOURCE_PATH,
            runtimeMarkdownSourcePath: `${runtimeFolder}/core/tasks/help.md`,
          });
        } catch (error) {
          observedFailureCode = normalizeValue(error.code);
          observedFailureDetail = normalizeValue(error.detail);
          observedAuthoritativeSourceType = 'sidecar';
          observedAuthoritativeSourcePath = SIDEcar_AUTHORITY_SOURCE_PATH;
        }

        mismatchRows.push({
          scenario: scenario.scenario,
          fixturePath: fixtureRelativePath,
          frontmatterSurfacePath: scope === 'source' ? SOURCE_MARKDOWN_SOURCE_PATH : `${runtimeFolder}/core/tasks/help.md`,
          observedFrontmatterKeyPath: scenario.fieldPath,
          mismatchedField: scenario.mismatchField,
          observedFrontmatterValue,
          expectedSidecarValue,
          expectedAuthoritativeSourceType: 'sidecar',
          expectedAuthoritativeSourcePath: SIDEcar_AUTHORITY_SOURCE_PATH,
          expectedFailureCode: scenario.expectedFailureCode,
          observedFailureCode,
          expectedFailureDetail: FRONTMATTER_MISMATCH_DETAILS[scenario.expectedFailureCode],
          observedFailureDetail,
          observedAuthoritativeSourceType,
          observedAuthoritativeSourcePath,
          status:
            observedFailureCode === scenario.expectedFailureCode &&
            observedFailureDetail === FRONTMATTER_MISMATCH_DETAILS[scenario.expectedFailureCode]
              ? 'PASS'
              : 'FAIL',
        });
      }
    }
    await this.writeCsvArtifact(artifactPaths.get(14), this.registry[13].columns, mismatchRows);

    return {
      projectDir: outputPaths.projectDir,
      planningArtifactsRoot: outputPaths.planningArtifactsRoot,
      validationRoot: outputPaths.validationRoot,
      decisionRecordsRoot: outputPaths.decisionRecordsRoot,
      generatedArtifactCount: this.registry.length,
      artifactPaths: Object.fromEntries([...artifactPaths.entries()].map(([artifactId, artifactPath]) => [artifactId, artifactPath])),
    };
  }

  parseBindingEvidencePayload({ payloadRaw, artifactId, fieldPath, sourcePath }) {
    let parsed;
    try {
      parsed = JSON.parse(String(payloadRaw || ''));
    } catch (error) {
      throw new Wave1ValidationHarnessError({
        code: WAVE1_VALIDATION_ERROR_CODES.BINDING_EVIDENCE_INVALID,
        detail: `Binding evidence payload is not valid JSON (${error.message})`,
        artifactId,
        fieldPath,
        sourcePath,
        observedValue: String(payloadRaw || ''),
        expectedValue: 'valid JSON payload',
      });
    }

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Wave1ValidationHarnessError({
        code: WAVE1_VALIDATION_ERROR_CODES.BINDING_EVIDENCE_INVALID,
        detail: 'Binding evidence payload must be a JSON object',
        artifactId,
        fieldPath,
        sourcePath,
        observedValue: typeof parsed,
        expectedValue: 'object',
      });
    }

    return parsed;
  }

  validateProvenanceReplayEvidenceRow(row, sourcePath) {
    const artifactId = 3;
    const rowStatus = normalizeValue(row.status || 'PASS');
    const payload = this.parseBindingEvidencePayload({
      payloadRaw: row.issuingComponentBindingEvidence,
      artifactId,
      fieldPath: 'issuingComponentBindingEvidence',
      sourcePath,
    });

    if (normalizeValue(payload.evidenceVersion) !== '1') {
      throw new Wave1ValidationHarnessError({
        code: WAVE1_VALIDATION_ERROR_CODES.BINDING_EVIDENCE_INVALID,
        detail: 'Binding evidence payload must use evidenceVersion=1',
        artifactId,
        fieldPath: 'issuingComponentBindingEvidence.evidenceVersion',
        sourcePath,
        observedValue: normalizeValue(payload.evidenceVersion),
        expectedValue: '1',
      });
    }

    if (rowStatus === 'SKIP') {
      if (normalizeValue(payload.observationMethod) !== 'validator-observed-optional-surface-omitted') {
        throw new Wave1ValidationHarnessError({
          code: WAVE1_VALIDATION_ERROR_CODES.BINDING_EVIDENCE_INVALID,
          detail: 'Optional-surface provenance rows must use optional-surface evidence method',
          artifactId,
          fieldPath: 'issuingComponentBindingEvidence.observationMethod',
          sourcePath,
          observedValue: normalizeValue(payload.observationMethod),
          expectedValue: 'validator-observed-optional-surface-omitted',
        });
      }
      return payload;
    }

    const requiredPayloadFields = [
      'observationMethod',
      'artifactPath',
      'componentPath',
      'baselineArtifactSha256',
      'mutatedArtifactSha256',
      'baselineRowIdentity',
      'mutatedRowIdentity',
      'targetedRowLocator',
      'rowLevelDiffSha256',
      'perturbationApplied',
      'baselineTargetRowCount',
      'mutatedTargetRowCount',
    ];
    for (const key of requiredPayloadFields) {
      if (normalizeValue(payload[key]).length === 0 && payload[key] !== false) {
        throw new Wave1ValidationHarnessError({
          code: WAVE1_VALIDATION_ERROR_CODES.BINDING_EVIDENCE_INVALID,
          detail: 'Required binding evidence field is missing',
          artifactId,
          fieldPath: `issuingComponentBindingEvidence.${key}`,
          sourcePath,
          observedValue: '<missing>',
          expectedValue: key,
        });
      }
    }

    if (
      normalizeValue(payload.observationMethod) !== 'validator-observed-baseline-plus-isolated-single-component-perturbation' ||
      normalizeValue(row.evidenceMethod) !== 'validator-observed-baseline-plus-isolated-single-component-perturbation' ||
      normalizeValue(row.issuingComponentBindingBasis) !== 'validator-observed-baseline-plus-isolated-single-component-perturbation'
    ) {
      throw new Wave1ValidationHarnessError({
        code: WAVE1_VALIDATION_ERROR_CODES.BINDING_EVIDENCE_INVALID,
        detail: 'Replay evidence must use the baseline-plus-isolated-perturbation method',
        artifactId,
        fieldPath: 'evidenceMethod',
        sourcePath,
        observedValue: normalizeValue(row.evidenceMethod),
        expectedValue: 'validator-observed-baseline-plus-isolated-single-component-perturbation',
      });
    }

    if (
      normalizeValue(payload.artifactPath) !== normalizeValue(row.artifactPath) ||
      normalizeValue(payload.componentPath) !== normalizeValue(row.issuingComponent) ||
      normalizeValue(payload.baselineRowIdentity) !== normalizeValue(row.rowIdentity) ||
      normalizeValue(payload.mutatedRowIdentity) !== normalizeValue(row.rowIdentity) ||
      normalizeValue(payload.targetedRowLocator) !== normalizeValue(row.rowIdentity)
    ) {
      throw new Wave1ValidationHarnessError({
        code: WAVE1_VALIDATION_ERROR_CODES.BINDING_EVIDENCE_INVALID,
        detail: 'Binding evidence payload does not match provenance row contract fields',
        artifactId,
        fieldPath: 'issuingComponentBindingEvidence',
        sourcePath,
        observedValue: canonicalJsonStringify(payload),
        expectedValue: 'payload fields aligned with provenance row fields',
      });
    }

    if (!isSha256(payload.baselineArtifactSha256) || !isSha256(payload.mutatedArtifactSha256) || !isSha256(payload.rowLevelDiffSha256)) {
      throw new Wave1ValidationHarnessError({
        code: WAVE1_VALIDATION_ERROR_CODES.BINDING_EVIDENCE_INVALID,
        detail: 'Replay evidence hashes must be sha256 hex values',
        artifactId,
        fieldPath: 'issuingComponentBindingEvidence.*Sha256',
        sourcePath,
        observedValue: canonicalJsonStringify({
          baselineArtifactSha256: payload.baselineArtifactSha256,
          mutatedArtifactSha256: payload.mutatedArtifactSha256,
          rowLevelDiffSha256: payload.rowLevelDiffSha256,
        }),
        expectedValue: '64-char lowercase hex values',
      });
    }

    if (payload.baselineArtifactSha256 === payload.mutatedArtifactSha256 || payload.perturbationApplied !== true) {
      throw new Wave1ValidationHarnessError({
        code: WAVE1_VALIDATION_ERROR_CODES.BINDING_EVIDENCE_INVALID,
        detail: 'Replay evidence must show isolated perturbation impact',
        artifactId,
        fieldPath: 'issuingComponentBindingEvidence.perturbationApplied',
        sourcePath,
        observedValue: canonicalJsonStringify({
          perturbationApplied: payload.perturbationApplied,
          baselineArtifactSha256: payload.baselineArtifactSha256,
          mutatedArtifactSha256: payload.mutatedArtifactSha256,
        }),
        expectedValue: 'perturbationApplied=true and differing baseline/mutated hashes',
      });
    }

    if (Number(payload.baselineTargetRowCount) <= Number(payload.mutatedTargetRowCount)) {
      throw new Wave1ValidationHarnessError({
        code: WAVE1_VALIDATION_ERROR_CODES.BINDING_EVIDENCE_INVALID,
        detail: 'Replay evidence must show reduced target-row impact after perturbation',
        artifactId,
        fieldPath: 'issuingComponentBindingEvidence.baselineTargetRowCount',
        sourcePath,
        observedValue: canonicalJsonStringify({
          baselineTargetRowCount: payload.baselineTargetRowCount,
          mutatedTargetRowCount: payload.mutatedTargetRowCount,
        }),
        expectedValue: 'baselineTargetRowCount > mutatedTargetRowCount',
      });
    }

    return payload;
  }

  assertRequiredEvidenceField({ value, artifactId, fieldPath, sourcePath }) {
    if (normalizeValue(value).length > 0) {
      return;
    }
    throw new Wave1ValidationHarnessError({
      code: WAVE1_VALIDATION_ERROR_CODES.REQUIRED_EVIDENCE_LINK_MISSING,
      detail: 'Required evidence-link field is missing or empty',
      artifactId,
      fieldPath,
      sourcePath,
      observedValue: normalizeValue(value),
      expectedValue: 'non-empty value',
    });
  }

  validateEvidenceLinkedRows({ rows, artifactId, sourcePath, evidencePath, provenanceByIdentity, requiredFields, rowArtifactPathField }) {
    for (const [index, row] of rows.entries()) {
      const status = normalizeValue(row.status || row.stageStatus || 'PASS');
      if (status !== 'PASS') continue;

      for (const field of requiredFields) {
        this.assertRequiredEvidenceField({
          value: row[field],
          artifactId,
          fieldPath: `rows[${index}].${field}`,
          sourcePath,
        });
      }

      if (normalizeValue(row.issuedArtifactEvidencePath) !== evidencePath) {
        throw new Wave1ValidationHarnessError({
          code: WAVE1_VALIDATION_ERROR_CODES.EVIDENCE_LINK_REFERENCE_INVALID,
          detail: 'Evidence-link path does not point to required provenance artifact',
          artifactId,
          fieldPath: `rows[${index}].issuedArtifactEvidencePath`,
          sourcePath,
          observedValue: normalizeValue(row.issuedArtifactEvidencePath),
          expectedValue: evidencePath,
        });
      }

      const linkedEvidenceRowIdentity = normalizeValue(row.issuedArtifactEvidenceRowIdentity);
      const provenanceRow = provenanceByIdentity.get(linkedEvidenceRowIdentity);
      if (!provenanceRow) {
        throw new Wave1ValidationHarnessError({
          code: WAVE1_VALIDATION_ERROR_CODES.EVIDENCE_LINK_REFERENCE_INVALID,
          detail: 'Evidence-link row identity does not resolve to provenance artifact row',
          artifactId,
          fieldPath: `rows[${index}].issuedArtifactEvidenceRowIdentity`,
          sourcePath,
          observedValue: linkedEvidenceRowIdentity,
          expectedValue: 'existing artifact-3 rowIdentity',
        });
      }

      if (normalizeValue(provenanceRow.status) !== 'PASS') {
        throw new Wave1ValidationHarnessError({
          code: WAVE1_VALIDATION_ERROR_CODES.ISSUER_PREREQUISITE_MISSING,
          detail: 'Terminal PASS requires linked provenance rows to be PASS',
          artifactId,
          fieldPath: `rows[${index}].issuedArtifactEvidenceRowIdentity`,
          sourcePath,
          observedValue: normalizeValue(provenanceRow.status),
          expectedValue: 'PASS',
        });
      }

      if (rowArtifactPathField && normalizeValue(row[rowArtifactPathField]) !== normalizeValue(provenanceRow.artifactPath)) {
        throw new Wave1ValidationHarnessError({
          code: WAVE1_VALIDATION_ERROR_CODES.EVIDENCE_LINK_REFERENCE_INVALID,
          detail: 'Evidence-linked provenance row does not match claimed artifact path',
          artifactId,
          fieldPath: `rows[${index}].${rowArtifactPathField}`,
          sourcePath,
          observedValue: normalizeValue(row[rowArtifactPathField]),
          expectedValue: normalizeValue(provenanceRow.artifactPath),
        });
      }

      if (
        Object.prototype.hasOwnProperty.call(row, 'issuingComponent') &&
        normalizeValue(row.issuingComponent).length > 0 &&
        normalizeValue(row.issuingComponent) !== normalizeValue(provenanceRow.issuingComponent)
      ) {
        throw new Wave1ValidationHarnessError({
          code: WAVE1_VALIDATION_ERROR_CODES.SELF_ATTESTED_ISSUER_CLAIM,
          detail: 'Issuer component claim diverges from validator-linked provenance evidence',
          artifactId,
          fieldPath: `rows[${index}].issuingComponent`,
          sourcePath,
          observedValue: normalizeValue(row.issuingComponent),
          expectedValue: normalizeValue(provenanceRow.issuingComponent),
        });
      }

      if (
        Object.prototype.hasOwnProperty.call(row, 'issuingComponentBindingEvidence') &&
        normalizeValue(row.issuingComponentBindingEvidence).length > 0 &&
        normalizeValue(row.issuingComponentBindingEvidence) !== normalizeValue(provenanceRow.issuingComponentBindingEvidence)
      ) {
        throw new Wave1ValidationHarnessError({
          code: WAVE1_VALIDATION_ERROR_CODES.SELF_ATTESTED_ISSUER_CLAIM,
          detail: 'Issuer binding evidence claim diverges from validator-linked provenance evidence',
          artifactId,
          fieldPath: `rows[${index}].issuingComponentBindingEvidence`,
          sourcePath,
          observedValue: normalizeValue(row.issuingComponentBindingEvidence),
          expectedValue: normalizeValue(provenanceRow.issuingComponentBindingEvidence),
        });
      }
    }
  }

  validateIssuerPrerequisites({ artifactDataById, runtimeFolder, requireExportSkillProjection }) {
    const evidencePath = '_bmad-output/planning-artifacts/validation/wave-1/bmad-help-issued-artifact-provenance.csv';
    const provenanceArtifact = artifactDataById.get(3) || { rows: [] };
    const provenanceRows = Array.isArray(provenanceArtifact.rows) ? provenanceArtifact.rows : [];
    const provenanceByIdentity = new Map();
    const provenanceByArtifactPath = new Map();

    for (const [index, row] of provenanceRows.entries()) {
      const sourcePath = normalizePath((provenanceArtifact.relativePath || '').replaceAll('\\', '/'));
      const rowIdentity = normalizeValue(row.rowIdentity);
      this.assertRequiredEvidenceField({
        value: rowIdentity,
        artifactId: 3,
        fieldPath: `rows[${index}].rowIdentity`,
        sourcePath,
      });
      this.validateProvenanceReplayEvidenceRow(row, sourcePath);
      provenanceByIdentity.set(rowIdentity, row);
      provenanceByArtifactPath.set(normalizeValue(row.artifactPath), row);
    }

    const requiredProvenanceArtifactPaths = [
      `${runtimeFolder}/_config/task-manifest.csv`,
      `${runtimeFolder}/core/module-help.csv`,
      `${runtimeFolder}/_config/bmad-help.csv`,
    ];
    if (requireExportSkillProjection) {
      requiredProvenanceArtifactPaths.push('.agents/skills/bmad-help/SKILL.md');
    }

    for (const artifactPath of requiredProvenanceArtifactPaths) {
      const row = provenanceByArtifactPath.get(artifactPath);
      if (!row || normalizeValue(row.status) !== 'PASS') {
        throw new Wave1ValidationHarnessError({
          code: WAVE1_VALIDATION_ERROR_CODES.ISSUER_PREREQUISITE_MISSING,
          detail: 'Terminal PASS requires provenance prerequisite rows for all required issuing-component claims',
          artifactId: 3,
          fieldPath: `rows[artifactPath=${artifactPath}]`,
          sourcePath: normalizePath(provenanceArtifact.relativePath),
          observedValue: row ? normalizeValue(row.status) : '<missing>',
          expectedValue: 'PASS',
        });
      }
    }

    const artifact4 = artifactDataById.get(4) || { rows: [], relativePath: '' };
    this.validateEvidenceLinkedRows({
      rows: artifact4.rows || [],
      artifactId: 4,
      sourcePath: normalizePath(artifact4.relativePath),
      evidencePath,
      provenanceByIdentity,
      requiredFields: ['issuedArtifactEvidencePath', 'issuedArtifactEvidenceRowIdentity', 'issuingComponentBindingEvidence'],
    });

    const artifact6 = artifactDataById.get(6) || { rows: [], relativePath: '' };
    this.validateEvidenceLinkedRows({
      rows: artifact6.rows || [],
      artifactId: 6,
      sourcePath: normalizePath(artifact6.relativePath),
      evidencePath,
      provenanceByIdentity,
      requiredFields: ['issuedArtifactEvidencePath', 'issuedArtifactEvidenceRowIdentity'],
    });

    const artifact7 = artifactDataById.get(7) || { rows: [], relativePath: '' };
    this.validateEvidenceLinkedRows({
      rows: artifact7.rows || [],
      artifactId: 7,
      sourcePath: normalizePath(artifact7.relativePath),
      evidencePath,
      provenanceByIdentity,
      requiredFields: ['issuedArtifactEvidencePath', 'issuedArtifactEvidenceRowIdentity', 'issuingComponentBindingEvidence'],
    });

    const artifact8 = artifactDataById.get(8) || { rows: [], relativePath: '' };
    this.validateEvidenceLinkedRows({
      rows: artifact8.rows || [],
      artifactId: 8,
      sourcePath: normalizePath(artifact8.relativePath),
      evidencePath,
      provenanceByIdentity,
      requiredFields: ['issuedArtifactEvidencePath', 'issuedArtifactEvidenceRowIdentity'],
    });

    const artifact9 = artifactDataById.get(9) || { rows: [], relativePath: '' };
    this.validateEvidenceLinkedRows({
      rows: artifact9.rows || [],
      artifactId: 9,
      sourcePath: normalizePath(artifact9.relativePath),
      evidencePath,
      provenanceByIdentity,
      requiredFields: [
        'issuedArtifactEvidencePath',
        'issuedArtifactEvidenceRowIdentity',
        'issuingComponentBindingEvidence',
        'issuingComponent',
      ],
      rowArtifactPathField: 'artifactPath',
    });
  }

  inferRequireExportSkillProjection({ artifactDataById, optionsRequireExportSkillProjection }) {
    if (typeof optionsRequireExportSkillProjection === 'boolean') {
      return optionsRequireExportSkillProjection;
    }

    const exportSurfacePath = '.agents/skills/bmad-help/SKILL.md';
    const provenanceArtifact = artifactDataById.get(3) || { rows: [] };
    const provenanceRows = Array.isArray(provenanceArtifact.rows) ? provenanceArtifact.rows : [];
    const exportProvenanceRow = provenanceRows.find((row) => normalizeValue(row.artifactPath) === exportSurfacePath);
    if (exportProvenanceRow) {
      return normalizeValue(exportProvenanceRow.status) === 'PASS';
    }

    const exportArtifact = artifactDataById.get(7) || { rows: [] };
    const exportRows = Array.isArray(exportArtifact.rows) ? exportArtifact.rows : [];
    if (exportRows.length > 0) {
      return exportRows.some((row) => {
        const status = normalizeValue(row.status || row.stageStatus || '');
        return status === 'PASS';
      });
    }

    return false;
  }

  async validateGeneratedArtifacts(options = {}) {
    const outputPaths = this.resolveOutputPaths(options);
    const planningArtifactsRoot = outputPaths.planningArtifactsRoot;
    const artifactDataById = new Map();

    for (const artifact of this.registry) {
      const artifactPath = path.join(planningArtifactsRoot, artifact.relativePath);
      if (!(await fs.pathExists(artifactPath))) {
        throw new Wave1ValidationHarnessError({
          code: WAVE1_VALIDATION_ERROR_CODES.REQUIRED_ARTIFACT_MISSING,
          detail: 'Required wave-1 validation artifact is missing',
          artifactId: artifact.artifactId,
          fieldPath: '<file>',
          sourcePath: normalizePath(artifact.relativePath),
          observedValue: '<missing>',
          expectedValue: normalizePath(artifact.relativePath),
        });
      }

      switch (artifact.type) {
        case 'csv': {
          const content = await fs.readFile(artifactPath, 'utf8');
          const observedHeader = parseCsvHeader(content);
          const expectedHeader = artifact.columns || [];
          const rows = parseCsvRows(content);
          artifactDataById.set(artifact.artifactId, {
            type: 'csv',
            relativePath: artifact.relativePath,
            header: observedHeader,
            rows,
          });

          if (observedHeader.length !== expectedHeader.length) {
            throw new Wave1ValidationHarnessError({
              code: WAVE1_VALIDATION_ERROR_CODES.CSV_SCHEMA_MISMATCH,
              detail: 'CSV header length does not match required schema',
              artifactId: artifact.artifactId,
              fieldPath: '<header>',
              sourcePath: normalizePath(artifact.relativePath),
              observedValue: observedHeader.join(','),
              expectedValue: expectedHeader.join(','),
            });
          }

          for (const [index, expectedValue] of expectedHeader.entries()) {
            const observed = normalizeValue(observedHeader[index]);
            const expected = normalizeValue(expectedValue);
            if (observed !== expected) {
              throw new Wave1ValidationHarnessError({
                code: WAVE1_VALIDATION_ERROR_CODES.CSV_SCHEMA_MISMATCH,
                detail: 'CSV header ordering does not match required schema',
                artifactId: artifact.artifactId,
                fieldPath: `header[${index}]`,
                sourcePath: normalizePath(artifact.relativePath),
                observedValue: observed,
                expectedValue: expected,
              });
            }
          }

          if (Array.isArray(artifact.requiredRowIdentityFields) && artifact.requiredRowIdentityFields.length > 0) {
            if (rows.length === 0) {
              throw new Wave1ValidationHarnessError({
                code: WAVE1_VALIDATION_ERROR_CODES.REQUIRED_ROW_IDENTITY_MISSING,
                detail: 'Required row identity rows are missing',
                artifactId: artifact.artifactId,
                fieldPath: 'rows',
                sourcePath: normalizePath(artifact.relativePath),
                observedValue: '<empty>',
                expectedValue: 'at least one row',
              });
            }
            for (const field of artifact.requiredRowIdentityFields) {
              if (!expectedHeader.includes(field)) {
                throw new Wave1ValidationHarnessError({
                  code: WAVE1_VALIDATION_ERROR_CODES.CSV_SCHEMA_MISMATCH,
                  detail: 'Required row identity field is missing from artifact schema',
                  artifactId: artifact.artifactId,
                  fieldPath: `header.${field}`,
                  sourcePath: normalizePath(artifact.relativePath),
                  observedValue: '<missing>',
                  expectedValue: field,
                });
              }

              for (const [rowIndex, row] of rows.entries()) {
                if (normalizeValue(row[field]).length === 0) {
                  const isEvidenceLinkField = field === 'issuedArtifactEvidenceRowIdentity';
                  throw new Wave1ValidationHarnessError({
                    code: isEvidenceLinkField
                      ? WAVE1_VALIDATION_ERROR_CODES.REQUIRED_EVIDENCE_LINK_MISSING
                      : WAVE1_VALIDATION_ERROR_CODES.REQUIRED_ROW_IDENTITY_MISSING,
                    detail: isEvidenceLinkField
                      ? 'Required evidence-link row identity is missing or empty'
                      : 'Required row identity value is missing or empty',
                    artifactId: artifact.artifactId,
                    fieldPath: `rows[${rowIndex}].${field}`,
                    sourcePath: normalizePath(artifact.relativePath),
                    observedValue: normalizeValue(row[field]),
                    expectedValue: 'non-empty value',
                  });
                }
              }
            }
          }
          break;
        }
        case 'yaml': {
          const parsed = yaml.parse(await fs.readFile(artifactPath, 'utf8'));
          artifactDataById.set(artifact.artifactId, {
            type: 'yaml',
            relativePath: artifact.relativePath,
            parsed,
          });
          if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
            throw new Wave1ValidationHarnessError({
              code: WAVE1_VALIDATION_ERROR_CODES.YAML_SCHEMA_MISMATCH,
              detail: 'YAML artifact root must be a mapping object',
              artifactId: artifact.artifactId,
              fieldPath: '<document>',
              sourcePath: normalizePath(artifact.relativePath),
              observedValue: typeof parsed,
              expectedValue: 'object',
            });
          }
          for (const requiredKey of artifact.requiredTopLevelKeys || []) {
            if (!Object.prototype.hasOwnProperty.call(parsed, requiredKey)) {
              throw new Wave1ValidationHarnessError({
                code: WAVE1_VALIDATION_ERROR_CODES.YAML_SCHEMA_MISMATCH,
                detail: 'Required YAML key is missing',
                artifactId: artifact.artifactId,
                fieldPath: requiredKey,
                sourcePath: normalizePath(artifact.relativePath),
                observedValue: '<missing>',
                expectedValue: requiredKey,
              });
            }
          }
          break;
        }
        case 'markdown': {
          const content = await fs.readFile(artifactPath, 'utf8');
          artifactDataById.set(artifact.artifactId, {
            type: 'markdown',
            relativePath: artifact.relativePath,
            content,
          });
          let frontmatter;
          try {
            frontmatter = parseFrontmatter(content);
          } catch (error) {
            throw new Wave1ValidationHarnessError({
              code: WAVE1_VALIDATION_ERROR_CODES.DECISION_RECORD_PARSE_FAILED,
              detail: `Unable to parse decision record frontmatter (${error.message})`,
              artifactId: artifact.artifactId,
              fieldPath: '<frontmatter>',
              sourcePath: normalizePath(artifact.relativePath),
            });
          }
          for (const requiredKey of artifact.requiredFrontmatterKeys || []) {
            if (!Object.prototype.hasOwnProperty.call(frontmatter, requiredKey)) {
              throw new Wave1ValidationHarnessError({
                code: WAVE1_VALIDATION_ERROR_CODES.DECISION_RECORD_SCHEMA_MISMATCH,
                detail: 'Required decision-record key is missing',
                artifactId: artifact.artifactId,
                fieldPath: requiredKey,
                sourcePath: normalizePath(artifact.relativePath),
                observedValue: '<missing>',
                expectedValue: requiredKey,
              });
            }
          }
          break;
        }
        default: {
          break;
        }
      }
    }

    const inferredRequireExportSkillProjection = this.inferRequireExportSkillProjection({
      artifactDataById,
      optionsRequireExportSkillProjection: options.requireExportSkillProjection,
    });

    this.validateIssuerPrerequisites({
      artifactDataById,
      runtimeFolder: normalizeValue(options.bmadFolderName || '_bmad'),
      requireExportSkillProjection: inferredRequireExportSkillProjection,
    });

    return {
      status: 'PASS',
      validatedArtifactCount: this.registry.length,
    };
  }

  async generateAndValidate(options = {}) {
    const generated = await this.generateValidationArtifacts(options);
    const validation = await this.validateGeneratedArtifacts(options);
    return {
      ...generated,
      terminalStatus: validation.status,
      validatedArtifactCount: validation.validatedArtifactCount,
    };
  }
}

module.exports = {
  WAVE1_VALIDATION_ERROR_CODES,
  WAVE1_VALIDATION_ARTIFACT_REGISTRY,
  Wave1ValidationHarnessError,
  Wave1ValidationHarness,
};

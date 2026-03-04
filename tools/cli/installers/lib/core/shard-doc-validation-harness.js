const path = require('node:path');
const crypto = require('node:crypto');
const os = require('node:os');
const fs = require('fs-extra');
const yaml = require('yaml');
const csv = require('csv-parse/sync');
const { getSourcePath } = require('../../../lib/project-root');
const { normalizeDisplayedCommandLabel } = require('./help-catalog-generator');
const { ManifestGenerator } = require('./manifest-generator');
const {
  ProjectionCompatibilityError,
  validateTaskManifestCompatibilitySurface,
  validateHelpCatalogLoaderEntries,
  validateGithubCopilotHelpLoaderEntries,
} = require('./projection-compatibility-validator');

const SHARD_DOC_SIDECAR_SOURCE_PATH = 'bmad-fork/src/core/tasks/shard-doc.artifact.yaml';
const SHARD_DOC_SOURCE_XML_SOURCE_PATH = 'bmad-fork/src/core/tasks/shard-doc.xml';
const SHARD_DOC_EVIDENCE_ISSUER_COMPONENT = 'bmad-fork/tools/cli/installers/lib/core/shard-doc-validation-harness.js';

const SHARD_DOC_VALIDATION_ERROR_CODES = Object.freeze({
  REQUIRED_ARTIFACT_MISSING: 'ERR_SHARD_DOC_VALIDATION_REQUIRED_ARTIFACT_MISSING',
  CSV_SCHEMA_MISMATCH: 'ERR_SHARD_DOC_VALIDATION_CSV_SCHEMA_MISMATCH',
  REQUIRED_ROW_MISSING: 'ERR_SHARD_DOC_VALIDATION_REQUIRED_ROW_MISSING',
  YAML_SCHEMA_MISMATCH: 'ERR_SHARD_DOC_VALIDATION_YAML_SCHEMA_MISMATCH',
  BINDING_EVIDENCE_INVALID: 'ERR_SHARD_DOC_VALIDATION_BINDING_EVIDENCE_INVALID',
  COMPATIBILITY_GATE_FAILED: 'ERR_SHARD_DOC_VALIDATION_COMPATIBILITY_GATE_FAILED',
  REPLAY_EVIDENCE_INVALID: 'ERR_SHARD_DOC_VALIDATION_REPLAY_EVIDENCE_INVALID',
});

const SHARD_DOC_VALIDATION_ARTIFACT_REGISTRY = Object.freeze([
  Object.freeze({
    artifactId: 1,
    relativePath: path.join('validation', 'shard-doc', 'shard-doc-sidecar-snapshot.yaml'),
    type: 'yaml',
    requiredTopLevelKeys: ['schemaVersion', 'canonicalId', 'artifactType', 'module', 'sourcePath', 'displayName', 'description', 'status'],
  }),
  Object.freeze({
    artifactId: 2,
    relativePath: path.join('validation', 'shard-doc', 'shard-doc-authority-records.csv'),
    type: 'csv',
    columns: [
      'rowIdentity',
      'recordType',
      'canonicalId',
      'authoritativePresenceKey',
      'authoritySourceType',
      'authoritySourcePath',
      'status',
    ],
    requiredRowIdentityFields: ['rowIdentity'],
  }),
  Object.freeze({
    artifactId: 3,
    relativePath: path.join('validation', 'shard-doc', 'shard-doc-task-manifest-comparison.csv'),
    type: 'csv',
    columns: [
      'surface',
      'sourcePath',
      'name',
      'module',
      'path',
      'legacyName',
      'canonicalId',
      'authoritySourceType',
      'authoritySourcePath',
      'status',
    ],
  }),
  Object.freeze({
    artifactId: 4,
    relativePath: path.join('validation', 'shard-doc', 'shard-doc-help-catalog-comparison.csv'),
    type: 'csv',
    columns: ['surface', 'sourcePath', 'name', 'workflowFile', 'command', 'rowCountForCanonicalCommand', 'status'],
  }),
  Object.freeze({
    artifactId: 5,
    relativePath: path.join('validation', 'shard-doc', 'shard-doc-alias-table.csv'),
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
    relativePath: path.join('validation', 'shard-doc', 'shard-doc-command-label-report.csv'),
    type: 'csv',
    columns: [
      'surface',
      'canonicalId',
      'rawCommandValue',
      'displayedCommandLabel',
      'normalizedDisplayedLabel',
      'rowCountForCanonicalId',
      'authoritySourceType',
      'authoritySourcePath',
      'status',
    ],
  }),
  Object.freeze({
    artifactId: 7,
    relativePath: path.join('validation', 'shard-doc', 'shard-doc-duplicate-report.csv'),
    type: 'csv',
    columns: ['surface', 'canonicalId', 'normalizedVisibleKey', 'matchingRowCount', 'status'],
  }),
  Object.freeze({
    artifactId: 8,
    relativePath: path.join('validation', 'shard-doc', 'shard-doc-artifact-inventory.csv'),
    type: 'csv',
    columns: ['rowIdentity', 'artifactId', 'artifactPath', 'artifactType', 'required', 'rowCount', 'exists', 'schemaVersion', 'status'],
    requiredRowIdentityFields: ['rowIdentity'],
  }),
  Object.freeze({
    artifactId: 9,
    relativePath: path.join('validation', 'shard-doc', 'shard-doc-compatibility-gates.csv'),
    type: 'csv',
    columns: ['gateId', 'surface', 'sourcePath', 'status', 'failureCode', 'failureDetail'],
    requiredRowIdentityFields: ['gateId'],
  }),
  Object.freeze({
    artifactId: 10,
    relativePath: path.join('validation', 'shard-doc', 'shard-doc-issued-artifact-provenance.csv'),
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
    artifactId: 11,
    relativePath: path.join('validation', 'shard-doc', 'shard-doc-replay-evidence.csv'),
    type: 'csv',
    columns: [
      'rowIdentity',
      'provenanceRowIdentity',
      'artifactPath',
      'issuingComponent',
      'targetedRowLocator',
      'baselineArtifactSha256',
      'mutatedArtifactSha256',
      'rowLevelDiffSha256',
      'perturbationApplied',
      'baselineTargetRowCount',
      'mutatedTargetRowCount',
      'mutationKind',
      'evidenceIssuerClass',
      'status',
    ],
    requiredRowIdentityFields: ['rowIdentity', 'provenanceRowIdentity'],
  }),
  Object.freeze({
    artifactId: 12,
    relativePath: path.join('validation', 'shard-doc', 'shard-doc-gate-summary.csv'),
    type: 'csv',
    columns: ['gateId', 'status', 'detail', 'sourcePath'],
    requiredRowIdentityFields: ['gateId'],
  }),
]);

class ShardDocValidationHarnessError extends Error {
  constructor({ code, detail, artifactId, fieldPath, sourcePath, observedValue, expectedValue }) {
    const message = `${code}: ${detail} (artifact=${artifactId}, fieldPath=${fieldPath}, sourcePath=${sourcePath})`;
    super(message);
    this.name = 'ShardDocValidationHarnessError';
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

function serializeCsv(columns, rows) {
  const lines = [columns.join(',')];
  for (const row of rows) {
    const serialized = columns.map((column) => escapeCsv(Object.prototype.hasOwnProperty.call(row, column) ? row[column] : ''));
    lines.push(serialized.join(','));
  }
  return `${lines.join('\n')}\n`;
}

function sortRowsDeterministically(rows, columns) {
  return [...rows].sort((left, right) => {
    const leftKey = columns.map((column) => normalizeValue(left[column])).join('|');
    const rightKey = columns.map((column) => normalizeValue(right[column])).join('|');
    return leftKey.localeCompare(rightKey);
  });
}

function computeSha256(value) {
  return crypto
    .createHash('sha256')
    .update(String(value || ''), 'utf8')
    .digest('hex');
}

function sortObjectKeysDeep(value) {
  if (Array.isArray(value)) return value.map((item) => sortObjectKeysDeep(item));
  if (!value || typeof value !== 'object') return value;
  const sorted = {};
  for (const key of Object.keys(value).sort()) {
    sorted[key] = sortObjectKeysDeep(value[key]);
  }
  return sorted;
}

function canonicalJsonStringify(value) {
  return JSON.stringify(sortObjectKeysDeep(value));
}

function isSha256(value) {
  return /^[a-f0-9]{64}$/.test(String(value || ''));
}

function buildIssuedArtifactRowIdentity(artifactPath) {
  return `issued-artifact:${String(artifactPath || '').replaceAll('/', '-')}`;
}

function countShardDocManifestClaimRows(csvContent, runtimeFolder) {
  const expectedPath = normalizePath(`${runtimeFolder}/core/tasks/shard-doc.xml`).toLowerCase();
  return parseCsvRows(csvContent).filter((row) => {
    return (
      normalizeValue(row.canonicalId) === 'bmad-shard-doc' &&
      normalizeValue(row.name).toLowerCase() === 'shard-doc' &&
      normalizeValue(row.module).toLowerCase() === 'core' &&
      normalizePath(normalizeValue(row.path)).toLowerCase() === expectedPath
    );
  }).length;
}

function countShardDocHelpCatalogClaimRows(csvContent) {
  return parseCsvRows(csvContent).filter((row) => {
    const command = normalizeValue(row.command).replace(/^\/+/, '').toLowerCase();
    const workflowFile = normalizePath(normalizeValue(row['workflow-file'])).toLowerCase();
    return command === 'bmad-shard-doc' && workflowFile.endsWith('/core/tasks/shard-doc.xml');
  }).length;
}

class ShardDocValidationHarness {
  constructor() {
    this.registry = SHARD_DOC_VALIDATION_ARTIFACT_REGISTRY;
  }

  getArtifactRegistry() {
    return this.registry;
  }

  resolveOutputPaths(options = {}) {
    const projectDir = path.resolve(options.projectDir || process.cwd());
    const planningArtifactsRoot = path.join(projectDir, '_bmad-output', 'planning-artifacts');
    const validationRoot = path.join(planningArtifactsRoot, 'validation', 'shard-doc');
    return {
      projectDir,
      planningArtifactsRoot,
      validationRoot,
    };
  }

  buildArtifactPathsMap(outputPaths) {
    const artifactPaths = new Map();
    for (const artifact of this.registry) {
      artifactPaths.set(artifact.artifactId, path.join(outputPaths.planningArtifactsRoot, artifact.relativePath));
    }
    return artifactPaths;
  }

  async writeCsvArtifact(filePath, columns, rows) {
    const sortedRows = sortRowsDeterministically(rows, columns);
    await fs.writeFile(filePath, serializeCsv(columns, sortedRows), 'utf8');
  }

  async assertRequiredInputSurfaceExists({ artifactId, absolutePath, sourcePath, description }) {
    if (await fs.pathExists(absolutePath)) {
      return;
    }
    throw new ShardDocValidationHarnessError({
      code: SHARD_DOC_VALIDATION_ERROR_CODES.REQUIRED_ARTIFACT_MISSING,
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
    throw new ShardDocValidationHarnessError({
      code: SHARD_DOC_VALIDATION_ERROR_CODES.REQUIRED_ROW_MISSING,
      detail,
      artifactId,
      fieldPath,
      sourcePath: normalizePath(sourcePath),
      observedValue: '<missing>',
      expectedValue: 'required row',
    });
  }

  resolveReplayContract({ artifactPath, componentPath, rowIdentity, runtimeFolder }) {
    const claimedRowIdentity = normalizeValue(rowIdentity);
    if (!claimedRowIdentity) {
      throw new ShardDocValidationHarnessError({
        code: SHARD_DOC_VALIDATION_ERROR_CODES.REQUIRED_ROW_MISSING,
        detail: 'Claimed replay rowIdentity is required',
        artifactId: 11,
        fieldPath: 'rowIdentity',
        sourcePath: normalizePath(artifactPath),
        observedValue: '<empty>',
        expectedValue: 'non-empty rowIdentity',
      });
    }

    const expectedRowIdentity = buildIssuedArtifactRowIdentity(artifactPath);
    if (claimedRowIdentity !== expectedRowIdentity) {
      throw new ShardDocValidationHarnessError({
        code: SHARD_DOC_VALIDATION_ERROR_CODES.REQUIRED_ROW_MISSING,
        detail: 'Claimed replay rowIdentity does not match issued-artifact contract',
        artifactId: 11,
        fieldPath: 'rowIdentity',
        sourcePath: normalizePath(artifactPath),
        observedValue: claimedRowIdentity,
        expectedValue: expectedRowIdentity,
      });
    }

    const contractsByRowIdentity = new Map([
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
        buildIssuedArtifactRowIdentity(`${runtimeFolder}/_config/bmad-help.csv`),
        {
          artifactPath: `${runtimeFolder}/_config/bmad-help.csv`,
          componentPathIncludes: 'installer.js::mergemodulehelpcatalogs',
          mutationKind: 'component-input-perturbation:installer/module-help-command',
          run: ({ workspaceRoot, perturbed }) => this.runInstallerMergeReplay({ workspaceRoot, runtimeFolder, perturbed }),
        },
      ],
    ]);

    const contract = contractsByRowIdentity.get(claimedRowIdentity);
    if (!contract) {
      throw new ShardDocValidationHarnessError({
        code: SHARD_DOC_VALIDATION_ERROR_CODES.REQUIRED_ROW_MISSING,
        detail: 'Claimed replay rowIdentity is not mapped to a replay contract',
        artifactId: 11,
        fieldPath: 'rowIdentity',
        sourcePath: normalizePath(artifactPath),
        observedValue: claimedRowIdentity,
        expectedValue: 'known issued-artifact rowIdentity',
      });
    }

    const normalizedComponentPath = normalizeValue(componentPath).toLowerCase();
    if (
      normalizeValue(artifactPath) !== normalizeValue(contract.artifactPath) ||
      !normalizedComponentPath.includes(String(contract.componentPathIncludes || '').toLowerCase())
    ) {
      throw new ShardDocValidationHarnessError({
        code: SHARD_DOC_VALIDATION_ERROR_CODES.BINDING_EVIDENCE_INVALID,
        detail: 'Claimed issuingComponent does not match replay contract mapping',
        artifactId: 11,
        fieldPath: 'issuingComponent',
        sourcePath: normalizePath(artifactPath),
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
    generator.helpAuthorityRecords = [];
    generator.taskAuthorityRecords = [
      {
        recordType: 'metadata-authority',
        canonicalId: 'bmad-shard-doc',
        authoritySourceType: 'sidecar',
        authoritySourcePath: SHARD_DOC_SIDECAR_SOURCE_PATH,
        sourcePath: SHARD_DOC_SOURCE_XML_SOURCE_PATH,
      },
    ];
    generator.tasks = perturbed
      ? []
      : [
          {
            name: 'shard-doc',
            displayName: 'Shard Document',
            description: 'Split large markdown documents into smaller files by section with an index.',
            module: 'core',
            path: `${runtimeFolder}/core/tasks/shard-doc.xml`,
            standalone: 'true',
          },
        ];

    await generator.writeTaskManifest(cfgDir);
    const outputPath = path.join(cfgDir, 'task-manifest.csv');
    const content = await fs.readFile(outputPath, 'utf8');
    return {
      content,
      targetRowCount: countShardDocManifestClaimRows(content, runtimeFolder),
    };
  }

  async runInstallerMergeReplay({ workspaceRoot, runtimeFolder, perturbed }) {
    const { Installer } = require('./installer');

    const bmadDir = path.join(workspaceRoot, runtimeFolder);
    const coreDir = path.join(bmadDir, 'core');
    const cfgDir = path.join(bmadDir, '_config');
    await fs.ensureDir(coreDir);
    await fs.ensureDir(cfgDir);

    const buildCsvLine = (values) =>
      values
        .map((value) => {
          const text = String(value ?? '');
          return text.includes(',') || text.includes('"') ? `"${text.replaceAll('"', '""')}"` : text;
        })
        .join(',');
    const writeCsv = async (filePath, columns, rows) => {
      const lines = [columns.join(','), ...rows.map((row) => buildCsvLine(columns.map((column) => row[column] ?? '')))];
      await fs.writeFile(filePath, `${lines.join('\n')}\n`, 'utf8');
    };

    await writeCsv(
      path.join(coreDir, 'module-help.csv'),
      [
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
      ],
      [
        {
          module: 'core',
          phase: 'anytime',
          name: 'help',
          code: 'BH',
          sequence: '',
          'workflow-file': `${runtimeFolder}/core/tasks/help.md`,
          command: 'bmad-help',
          required: 'false',
          agent: '',
          options: '',
          description: 'Show BMAD help',
          'output-location': '',
          outputs: '',
        },
        {
          module: 'core',
          phase: 'anytime',
          name: 'Shard Document',
          code: 'SD',
          sequence: '',
          'workflow-file': `${runtimeFolder}/core/tasks/shard-doc.xml`,
          command: perturbed ? 'shard-doc' : 'bmad-shard-doc',
          required: 'false',
          agent: '',
          options: '',
          description: 'Split large markdown documents into smaller files by section with an index.',
          'output-location': '',
          outputs: '',
        },
        {
          module: 'core',
          phase: 'anytime',
          name: 'Index Docs',
          code: 'ID',
          sequence: '',
          'workflow-file': `${runtimeFolder}/core/tasks/index-docs.xml`,
          command: 'bmad-index-docs',
          required: 'false',
          agent: '',
          options: '',
          description:
            'Create lightweight index for quick LLM scanning. Use when LLM needs to understand available docs without loading everything.',
          'output-location': '',
          outputs: '',
        },
      ],
    );

    await fs.writeFile(
      path.join(cfgDir, 'agent-manifest.csv'),
      'name,displayName,title,icon,capabilities,role,identity,communicationStyle,principles,module,path\n',
      'utf8',
    );

    const installer = new Installer();
    installer.bmadFolderName = runtimeFolder;
    installer.installedFiles = new Set();
    installer.helpAuthorityRecords = [];
    installer.shardDocAuthorityRecords = [
      {
        recordType: 'metadata-authority',
        canonicalId: 'bmad-shard-doc',
        authoritySourceType: 'sidecar',
        authoritySourcePath: SHARD_DOC_SIDECAR_SOURCE_PATH,
        sourcePath: SHARD_DOC_SOURCE_XML_SOURCE_PATH,
      },
    ];

    try {
      await installer.mergeModuleHelpCatalogs(bmadDir);
      const outputPath = path.join(cfgDir, 'bmad-help.csv');
      const content = await fs.readFile(outputPath, 'utf8');
      return {
        content,
        targetRowCount: countShardDocHelpCatalogClaimRows(content),
      };
    } catch (error) {
      if (perturbed && normalizeValue(error?.code) === 'ERR_HELP_COMMAND_LABEL_CONTRACT_FAILED') {
        return {
          content: `PERTURBED_COMPONENT_FAILURE:${normalizeValue(error.code)}:${normalizeValue(error.detail || error.message)}`,
          targetRowCount: 0,
        };
      }
      throw error;
    }
  }

  async executeIsolatedReplay({ artifactPath, componentPath, rowIdentity, runtimeFolder }) {
    const contract = this.resolveReplayContract({
      artifactPath,
      componentPath,
      rowIdentity,
      runtimeFolder,
    });
    const baselineWorkspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'shard-doc-replay-baseline-'));
    const perturbedWorkspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'shard-doc-replay-perturbed-'));

    try {
      const baseline = await contract.run({ workspaceRoot: baselineWorkspaceRoot, perturbed: false });
      if (Number(baseline.targetRowCount) <= 0) {
        throw new ShardDocValidationHarnessError({
          code: SHARD_DOC_VALIDATION_ERROR_CODES.REQUIRED_ROW_MISSING,
          detail: 'Claimed replay rowIdentity target is absent in baseline component output',
          artifactId: 11,
          fieldPath: 'rowIdentity',
          sourcePath: normalizePath(artifactPath),
          observedValue: String(baseline.targetRowCount),
          expectedValue: `at least one row for ${normalizeValue(rowIdentity)}`,
        });
      }

      const mutated = await contract.run({ workspaceRoot: perturbedWorkspaceRoot, perturbed: true });
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

  async buildObservedBindingEvidence({ artifactPath, absolutePath, componentPath, rowIdentity, runtimeFolder }) {
    await this.assertRequiredInputSurfaceExists({
      artifactId: 10,
      absolutePath,
      sourcePath: artifactPath,
      description: 'issued-artifact replay target surface',
    });

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
    const rowLevelDiffSha256 = computeSha256(canonicalJsonStringify(diffPayload));
    const evidencePayload = canonicalJsonStringify({
      evidenceVersion: 1,
      observationMethod: 'validator-observed-baseline-plus-isolated-single-component-perturbation',
      observationOutcome:
        mutationResult.baselineTargetRowCount > mutationResult.mutatedTargetRowCount ? 'observed-impact' : 'no-impact-observed',
      artifactPath,
      componentPath,
      targetedRowLocator: mutationResult.targetedRowLocator,
      mutationKind: mutationResult.mutationKind,
      baselineTargetRowCount: mutationResult.baselineTargetRowCount,
      mutatedTargetRowCount: mutationResult.mutatedTargetRowCount,
      baselineArtifactSha256,
      mutatedArtifactSha256,
      rowLevelDiffSha256,
      perturbationApplied: true,
      serializationFormat: 'json-canonical-v1',
      encoding: 'utf-8',
      lineEndings: 'lf',
      worktreePath: 'isolated-replay-temp-workspaces',
      commitSha: 'not-applicable',
      timestampUtc: '1970-01-01T00:00:00Z',
    });

    return {
      evidenceMethod: 'validator-observed-baseline-plus-isolated-single-component-perturbation',
      issuingComponentBindingBasis: 'validator-observed-baseline-plus-isolated-single-component-perturbation',
      issuingComponentBindingEvidence: evidencePayload,
      targetedRowLocator: mutationResult.targetedRowLocator,
      baselineArtifactSha256,
      mutatedArtifactSha256,
      rowLevelDiffSha256,
      perturbationApplied: true,
      baselineTargetRowCount: mutationResult.baselineTargetRowCount,
      mutatedTargetRowCount: mutationResult.mutatedTargetRowCount,
      mutationKind: mutationResult.mutationKind,
      status: mutationResult.baselineTargetRowCount > mutationResult.mutatedTargetRowCount ? 'PASS' : 'FAIL',
    };
  }

  async createIssuedArtifactEvidenceRows({ runtimeFolder, bmadDir }) {
    const bindings = [
      {
        artifactPath: `${runtimeFolder}/_config/task-manifest.csv`,
        absolutePath: path.join(bmadDir, '_config', 'task-manifest.csv'),
        issuingComponent: 'bmad-fork/tools/cli/installers/lib/core/manifest-generator.js',
      },
      {
        artifactPath: `${runtimeFolder}/_config/bmad-help.csv`,
        absolutePath: path.join(bmadDir, '_config', 'bmad-help.csv'),
        issuingComponent: 'bmad-fork/tools/cli/installers/lib/core/installer.js::mergeModuleHelpCatalogs()',
      },
    ];

    const provenanceRows = [];
    const replayEvidenceRows = [];

    for (const binding of bindings) {
      const rowIdentity = buildIssuedArtifactRowIdentity(binding.artifactPath);
      const evidence = await this.buildObservedBindingEvidence({
        artifactPath: binding.artifactPath,
        absolutePath: binding.absolutePath,
        componentPath: binding.issuingComponent,
        rowIdentity,
        runtimeFolder,
      });

      provenanceRows.push({
        rowIdentity,
        artifactPath: binding.artifactPath,
        canonicalId: 'bmad-shard-doc',
        issuerOwnerClass: 'independent-validator',
        evidenceIssuerComponent: SHARD_DOC_EVIDENCE_ISSUER_COMPONENT,
        evidenceMethod: evidence.evidenceMethod,
        issuingComponent: binding.issuingComponent,
        issuingComponentBindingBasis: evidence.issuingComponentBindingBasis,
        issuingComponentBindingEvidence: evidence.issuingComponentBindingEvidence,
        claimScope: binding.artifactPath,
        status: evidence.status,
      });

      replayEvidenceRows.push({
        rowIdentity: `replay-evidence:${rowIdentity}`,
        provenanceRowIdentity: rowIdentity,
        artifactPath: binding.artifactPath,
        issuingComponent: binding.issuingComponent,
        targetedRowLocator: evidence.targetedRowLocator,
        baselineArtifactSha256: evidence.baselineArtifactSha256,
        mutatedArtifactSha256: evidence.mutatedArtifactSha256,
        rowLevelDiffSha256: evidence.rowLevelDiffSha256,
        perturbationApplied: evidence.perturbationApplied ? 'true' : 'false',
        baselineTargetRowCount: String(evidence.baselineTargetRowCount),
        mutatedTargetRowCount: String(evidence.mutatedTargetRowCount),
        mutationKind: evidence.mutationKind,
        evidenceIssuerClass: 'independent-validator',
        status: evidence.status,
      });
    }

    return {
      provenanceRows,
      replayEvidenceRows,
    };
  }

  runCompatibilityGate({ gateId, surface, sourcePath, runner }) {
    try {
      runner();
      return {
        gateId,
        surface,
        sourcePath,
        status: 'PASS',
        failureCode: '',
        failureDetail: '',
      };
    } catch (error) {
      if (error instanceof ProjectionCompatibilityError) {
        return {
          gateId,
          surface,
          sourcePath,
          status: 'FAIL',
          failureCode: normalizeValue(error.code || 'ERR_COMPATIBILITY_GATE_FAILED'),
          failureDetail: normalizeValue(error.detail || error.message || 'compatibility gate failure'),
        };
      }
      throw error;
    }
  }

  generateCompatibilityGateRows({ taskManifestCsvContent, helpCatalogCsvContent, runtimeFolder }) {
    const helpRows = parseCsvRows(helpCatalogCsvContent);
    const helpHeaderColumns = parseCsvHeader(helpCatalogCsvContent);

    return [
      this.runCompatibilityGate({
        gateId: 'task-manifest-loader',
        surface: 'task-manifest-loader',
        sourcePath: `${runtimeFolder}/_config/task-manifest.csv`,
        runner: () => {
          validateTaskManifestCompatibilitySurface(taskManifestCsvContent, {
            surface: 'task-manifest-loader',
            sourcePath: `${runtimeFolder}/_config/task-manifest.csv`,
          });
        },
      }),
      this.runCompatibilityGate({
        gateId: 'bmad-help-catalog-loader',
        surface: 'bmad-help-catalog-loader',
        sourcePath: `${runtimeFolder}/_config/bmad-help.csv`,
        runner: () => {
          validateHelpCatalogLoaderEntries(helpRows, {
            surface: 'bmad-help-catalog-loader',
            sourcePath: `${runtimeFolder}/_config/bmad-help.csv`,
            headerColumns: helpHeaderColumns,
          });
        },
      }),
      this.runCompatibilityGate({
        gateId: 'github-copilot-help-loader',
        surface: 'github-copilot-help-loader',
        sourcePath: `${runtimeFolder}/_config/bmad-help.csv`,
        runner: () => {
          validateGithubCopilotHelpLoaderEntries(helpRows, {
            surface: 'github-copilot-help-loader',
            sourcePath: `${runtimeFolder}/_config/bmad-help.csv`,
            headerColumns: helpHeaderColumns,
          });
        },
      }),
    ];
  }

  buildGateSummaryRows({ compatibilityRows, provenanceRows, replayRows, runtimeFolder }) {
    const compatibilityPass = compatibilityRows.every((row) => normalizeValue(row.status) === 'PASS');
    const provenancePass = provenanceRows.every((row) => normalizeValue(row.status) === 'PASS');
    const replayPass = replayRows.every((row) => normalizeValue(row.status) === 'PASS');

    return [
      {
        gateId: 'compatibility-gates',
        status: compatibilityPass ? 'PASS' : 'FAIL',
        detail: compatibilityPass ? 'task/help/copilot compatibility gates passed' : 'one or more compatibility gates failed',
        sourcePath: `${runtimeFolder}/_config/task-manifest.csv|${runtimeFolder}/_config/bmad-help.csv`,
      },
      {
        gateId: 'issued-artifact-provenance',
        status: provenancePass ? 'PASS' : 'FAIL',
        detail: provenancePass ? 'all issued-artifact provenance claims validated' : 'one or more provenance claims failed replay binding',
        sourcePath: 'validation/shard-doc/shard-doc-issued-artifact-provenance.csv',
      },
      {
        gateId: 'replay-evidence',
        status: replayPass ? 'PASS' : 'FAIL',
        detail: replayPass ? 'row-targeted isolated replay evidence validated' : 'replay evidence is missing or invalid',
        sourcePath: 'validation/shard-doc/shard-doc-replay-evidence.csv',
      },
      {
        gateId: 'required-test-commands',
        status: compatibilityPass && provenancePass && replayPass ? 'PASS' : 'FAIL',
        detail:
          compatibilityPass && provenancePass && replayPass
            ? 'harness prerequisites satisfied; CI/local test commands must also pass'
            : 'harness prerequisites failed; required test command gate is blocked',
        sourcePath: 'npm run test:install|npm test',
      },
    ];
  }

  async generateValidationArtifacts(options = {}) {
    const outputPaths = this.resolveOutputPaths(options);
    const runtimeFolder = normalizeValue(options.bmadFolderName || '_bmad');
    const bmadDir = path.resolve(options.bmadDir || path.join(outputPaths.projectDir, runtimeFolder));
    const artifactPaths = this.buildArtifactPathsMap(outputPaths);
    const sidecarPath =
      options.sidecarPath ||
      ((await fs.pathExists(path.join(outputPaths.projectDir, SHARD_DOC_SIDECAR_SOURCE_PATH)))
        ? path.join(outputPaths.projectDir, SHARD_DOC_SIDECAR_SOURCE_PATH)
        : getSourcePath('core', 'tasks', 'shard-doc.artifact.yaml'));
    const sourceXmlPath =
      options.sourceXmlPath ||
      ((await fs.pathExists(path.join(outputPaths.projectDir, SHARD_DOC_SOURCE_XML_SOURCE_PATH)))
        ? path.join(outputPaths.projectDir, SHARD_DOC_SOURCE_XML_SOURCE_PATH)
        : getSourcePath('core', 'tasks', 'shard-doc.xml'));

    await fs.ensureDir(outputPaths.validationRoot);

    await this.assertRequiredInputSurfaceExists({
      artifactId: 1,
      absolutePath: sidecarPath,
      sourcePath: SHARD_DOC_SIDECAR_SOURCE_PATH,
      description: 'shard-doc sidecar metadata authority',
    });
    await this.assertRequiredInputSurfaceExists({
      artifactId: 2,
      absolutePath: sourceXmlPath,
      sourcePath: SHARD_DOC_SOURCE_XML_SOURCE_PATH,
      description: 'shard-doc XML source authority',
    });
    await this.assertRequiredInputSurfaceExists({
      artifactId: 3,
      absolutePath: path.join(bmadDir, '_config', 'task-manifest.csv'),
      sourcePath: `${runtimeFolder}/_config/task-manifest.csv`,
      description: 'task-manifest projection surface',
    });
    await this.assertRequiredInputSurfaceExists({
      artifactId: 4,
      absolutePath: path.join(bmadDir, '_config', 'bmad-help.csv'),
      sourcePath: `${runtimeFolder}/_config/bmad-help.csv`,
      description: 'help-catalog projection surface',
    });
    await this.assertRequiredInputSurfaceExists({
      artifactId: 5,
      absolutePath: path.join(bmadDir, '_config', 'canonical-aliases.csv'),
      sourcePath: `${runtimeFolder}/_config/canonical-aliases.csv`,
      description: 'canonical-aliases projection surface',
    });

    const sidecarMetadata = yaml.parse(await fs.readFile(sidecarPath, 'utf8'));
    const taskManifestCsvContent = await fs.readFile(path.join(bmadDir, '_config', 'task-manifest.csv'), 'utf8');
    const helpCatalogCsvContent = await fs.readFile(path.join(bmadDir, '_config', 'bmad-help.csv'), 'utf8');
    const aliasCsvContent = await fs.readFile(path.join(bmadDir, '_config', 'canonical-aliases.csv'), 'utf8');
    const taskManifestRows = parseCsvRows(taskManifestCsvContent);
    const helpCatalogRows = parseCsvRows(helpCatalogCsvContent);
    const aliasRows = parseCsvRows(aliasCsvContent);
    const commandLabelReportPath = path.join(bmadDir, '_config', 'bmad-help-command-label-report.csv');
    let commandLabelRows = [];
    if (Array.isArray(options.helpCatalogCommandLabelReportRows) && options.helpCatalogCommandLabelReportRows.length > 0) {
      commandLabelRows = options.helpCatalogCommandLabelReportRows;
    } else {
      await this.assertRequiredInputSurfaceExists({
        artifactId: 6,
        absolutePath: commandLabelReportPath,
        sourcePath: `${runtimeFolder}/_config/bmad-help-command-label-report.csv`,
        description: 'help-catalog command-label report projection surface',
      });
      commandLabelRows = parseCsvRows(await fs.readFile(commandLabelReportPath, 'utf8'));
    }

    const shardDocTaskRow = this.requireRow({
      rows: taskManifestRows,
      predicate: (row) =>
        normalizeValue(row.module).toLowerCase() === 'core' &&
        normalizeValue(row.name).toLowerCase() === 'shard-doc' &&
        normalizeValue(row.canonicalId) === 'bmad-shard-doc',
      artifactId: 3,
      fieldPath: 'rows[module=core,name=shard-doc,canonicalId=bmad-shard-doc]',
      sourcePath: `${runtimeFolder}/_config/task-manifest.csv`,
      detail: 'Required shard-doc task-manifest canonical row is missing',
    });
    const shardDocHelpRows = helpCatalogRows.filter(
      (row) =>
        normalizeValue(row.command).replace(/^\/+/, '') === 'bmad-shard-doc' &&
        normalizePath(normalizeValue(row['workflow-file'])).toLowerCase().endsWith('/core/tasks/shard-doc.xml'),
    );
    if (shardDocHelpRows.length !== 1) {
      throw new ShardDocValidationHarnessError({
        code: SHARD_DOC_VALIDATION_ERROR_CODES.REQUIRED_ROW_MISSING,
        detail: 'Expected exactly one shard-doc help-catalog command row',
        artifactId: 4,
        fieldPath: 'rows[*].command',
        sourcePath: `${runtimeFolder}/_config/bmad-help.csv`,
        observedValue: String(shardDocHelpRows.length),
        expectedValue: '1',
      });
    }

    const shardDocAliasRows = aliasRows.filter((row) => normalizeValue(row.canonicalId) === 'bmad-shard-doc');
    const requiredAliasTypes = new Set(['canonical-id', 'legacy-name', 'slash-command']);
    const observedAliasTypes = new Set(shardDocAliasRows.map((row) => normalizeValue(row.aliasType)));
    for (const aliasType of requiredAliasTypes) {
      if (!observedAliasTypes.has(aliasType)) {
        throw new ShardDocValidationHarnessError({
          code: SHARD_DOC_VALIDATION_ERROR_CODES.REQUIRED_ROW_MISSING,
          detail: 'Required shard-doc alias type row is missing',
          artifactId: 5,
          fieldPath: 'rows[*].aliasType',
          sourcePath: `${runtimeFolder}/_config/canonical-aliases.csv`,
          observedValue: [...observedAliasTypes].join('|') || '<missing>',
          expectedValue: aliasType,
        });
      }
    }

    const shardDocCommandLabelRows = commandLabelRows.filter((row) => normalizeValue(row.canonicalId) === 'bmad-shard-doc');
    if (shardDocCommandLabelRows.length !== 1) {
      throw new ShardDocValidationHarnessError({
        code: SHARD_DOC_VALIDATION_ERROR_CODES.REQUIRED_ROW_MISSING,
        detail: 'Expected exactly one shard-doc command-label row',
        artifactId: 6,
        fieldPath: 'rows[*].canonicalId',
        sourcePath: `${runtimeFolder}/_config/bmad-help-command-label-report.csv`,
        observedValue: String(shardDocCommandLabelRows.length),
        expectedValue: '1',
      });
    }
    const shardDocCommandLabelRow = shardDocCommandLabelRows[0];

    const authorityRecordsInput = Array.isArray(options.shardDocAuthorityRecords) ? options.shardDocAuthorityRecords : [];
    const authorityRecords =
      authorityRecordsInput.length > 0
        ? authorityRecordsInput.map((record) => ({
            rowIdentity: `authority-record:${normalizeValue(record.recordType || 'unknown')}`,
            recordType: normalizeValue(record.recordType),
            canonicalId: normalizeValue(record.canonicalId),
            authoritativePresenceKey: normalizeValue(record.authoritativePresenceKey),
            authoritySourceType: normalizeValue(record.authoritySourceType),
            authoritySourcePath: normalizeValue(record.authoritySourcePath),
            status: 'PASS',
          }))
        : [
            {
              rowIdentity: 'authority-record:metadata-authority',
              recordType: 'metadata-authority',
              canonicalId: 'bmad-shard-doc',
              authoritativePresenceKey: 'capability:bmad-shard-doc',
              authoritySourceType: 'sidecar',
              authoritySourcePath: SHARD_DOC_SIDECAR_SOURCE_PATH,
              status: 'PASS',
            },
            {
              rowIdentity: 'authority-record:source-body-authority',
              recordType: 'source-body-authority',
              canonicalId: 'bmad-shard-doc',
              authoritativePresenceKey: 'capability:bmad-shard-doc',
              authoritySourceType: 'source-xml',
              authoritySourcePath: SHARD_DOC_SOURCE_XML_SOURCE_PATH,
              status: 'PASS',
            },
          ];

    // Artifact 1
    const sidecarSnapshot = {
      schemaVersion: sidecarMetadata?.schemaVersion ?? 1,
      canonicalId: normalizeValue(sidecarMetadata?.canonicalId || 'bmad-shard-doc'),
      artifactType: normalizeValue(sidecarMetadata?.artifactType || 'task'),
      module: normalizeValue(sidecarMetadata?.module || 'core'),
      sourcePath: SHARD_DOC_SIDECAR_SOURCE_PATH,
      displayName: normalizeValue(sidecarMetadata?.displayName || 'Shard Document'),
      description: normalizeValue(
        sidecarMetadata?.description || 'Split large markdown documents into smaller files by section with an index.',
      ),
      status: 'PASS',
    };
    await fs.writeFile(artifactPaths.get(1), yaml.stringify(sidecarSnapshot), 'utf8');

    // Artifact 2
    await this.writeCsvArtifact(artifactPaths.get(2), this.registry[1].columns, authorityRecords);

    // Artifact 3
    const taskManifestComparisonRows = [
      {
        surface: `${runtimeFolder}/_config/task-manifest.csv`,
        sourcePath: SHARD_DOC_SOURCE_XML_SOURCE_PATH,
        name: normalizeValue(shardDocTaskRow.name || 'shard-doc'),
        module: normalizeValue(shardDocTaskRow.module || 'core'),
        path: normalizeValue(shardDocTaskRow.path || `${runtimeFolder}/core/tasks/shard-doc.xml`),
        legacyName: normalizeValue(shardDocTaskRow.legacyName || 'shard-doc'),
        canonicalId: normalizeValue(shardDocTaskRow.canonicalId || 'bmad-shard-doc'),
        authoritySourceType: normalizeValue(shardDocTaskRow.authoritySourceType || 'sidecar'),
        authoritySourcePath: normalizeValue(shardDocTaskRow.authoritySourcePath || SHARD_DOC_SIDECAR_SOURCE_PATH),
        status: 'PASS',
      },
    ];
    await this.writeCsvArtifact(artifactPaths.get(3), this.registry[2].columns, taskManifestComparisonRows);

    // Artifact 4
    const shardDocHelpRow = shardDocHelpRows[0];
    const helpCatalogComparisonRows = [
      {
        surface: `${runtimeFolder}/_config/bmad-help.csv`,
        sourcePath: SHARD_DOC_SOURCE_XML_SOURCE_PATH,
        name: normalizeValue(shardDocHelpRow.name || 'Shard Document'),
        workflowFile: normalizeValue(shardDocHelpRow['workflow-file'] || '_bmad/core/tasks/shard-doc.xml'),
        command: normalizeValue(shardDocHelpRow.command || 'bmad-shard-doc').replace(/^\/+/, ''),
        rowCountForCanonicalCommand: String(shardDocHelpRows.length),
        status: shardDocHelpRows.length === 1 ? 'PASS' : 'FAIL',
      },
    ];
    await this.writeCsvArtifact(artifactPaths.get(4), this.registry[3].columns, helpCatalogComparisonRows);

    // Artifact 5
    const aliasTableRows = shardDocAliasRows.map((row) => ({
      rowIdentity: normalizeValue(row.rowIdentity),
      canonicalId: normalizeValue(row.canonicalId),
      alias: normalizeValue(row.alias),
      aliasType: normalizeValue(row.aliasType),
      normalizedAliasValue: normalizeValue(row.normalizedAliasValue),
      rawIdentityHasLeadingSlash: normalizeValue(row.rawIdentityHasLeadingSlash),
      resolutionEligibility: normalizeValue(row.resolutionEligibility),
      authoritySourceType: normalizeValue(row.authoritySourceType || 'sidecar'),
      authoritySourcePath: normalizeValue(row.authoritySourcePath || SHARD_DOC_SIDECAR_SOURCE_PATH),
      status: 'PASS',
    }));
    await this.writeCsvArtifact(artifactPaths.get(5), this.registry[4].columns, aliasTableRows);

    // Artifact 6
    const commandLabelReportRows = [
      {
        surface: normalizeValue(shardDocCommandLabelRow.surface || `${runtimeFolder}/_config/bmad-help.csv`),
        canonicalId: 'bmad-shard-doc',
        rawCommandValue: normalizeValue(shardDocCommandLabelRow.rawCommandValue || 'bmad-shard-doc').replace(/^\/+/, ''),
        displayedCommandLabel: normalizeValue(shardDocCommandLabelRow.displayedCommandLabel || '/bmad-shard-doc'),
        normalizedDisplayedLabel: normalizeDisplayedCommandLabel(
          normalizeValue(
            shardDocCommandLabelRow.normalizedDisplayedLabel || shardDocCommandLabelRow.displayedCommandLabel || '/bmad-shard-doc',
          ),
        ),
        rowCountForCanonicalId: normalizeValue(shardDocCommandLabelRow.rowCountForCanonicalId || '1'),
        authoritySourceType: normalizeValue(shardDocCommandLabelRow.authoritySourceType || 'sidecar'),
        authoritySourcePath: normalizeValue(shardDocCommandLabelRow.authoritySourcePath || SHARD_DOC_SIDECAR_SOURCE_PATH),
        status: normalizeValue(shardDocCommandLabelRow.status || 'PASS') || 'PASS',
      },
    ];
    await this.writeCsvArtifact(artifactPaths.get(6), this.registry[5].columns, commandLabelReportRows);

    // Artifact 7
    const duplicateRows = [
      {
        surface: `${runtimeFolder}/_config/bmad-help.csv`,
        canonicalId: 'bmad-shard-doc',
        normalizedVisibleKey: 'help-catalog-command:/bmad-shard-doc',
        matchingRowCount: String(shardDocHelpRows.length),
        status: shardDocHelpRows.length === 1 ? 'PASS' : 'FAIL',
      },
    ];
    await this.writeCsvArtifact(artifactPaths.get(7), this.registry[6].columns, duplicateRows);

    // Artifact 9
    const compatibilityRows = this.generateCompatibilityGateRows({
      taskManifestCsvContent,
      helpCatalogCsvContent,
      runtimeFolder,
    });
    await this.writeCsvArtifact(artifactPaths.get(9), this.registry[8].columns, compatibilityRows);

    // Artifact 10 + 11
    const { provenanceRows, replayEvidenceRows } = await this.createIssuedArtifactEvidenceRows({
      runtimeFolder,
      bmadDir,
    });
    await this.writeCsvArtifact(artifactPaths.get(10), this.registry[9].columns, provenanceRows);
    await this.writeCsvArtifact(artifactPaths.get(11), this.registry[10].columns, replayEvidenceRows);

    // Artifact 12
    const gateSummaryRows = this.buildGateSummaryRows({
      compatibilityRows,
      provenanceRows,
      replayRows: replayEvidenceRows,
      runtimeFolder,
    });
    await this.writeCsvArtifact(artifactPaths.get(12), this.registry[11].columns, gateSummaryRows);

    // Artifact 8 (after all other artifacts exist)
    const inventoryRows = [];
    for (const artifact of this.registry) {
      const artifactPath = normalizePath(artifact.relativePath);
      const absolutePath = artifactPaths.get(artifact.artifactId);
      const isInventoryArtifact = artifact.artifactId === 8;
      const exists = isInventoryArtifact ? true : await fs.pathExists(absolutePath);
      let rowCount = 0;
      if (isInventoryArtifact) {
        rowCount = this.registry.length;
      } else if (exists && artifact.type === 'csv') {
        rowCount = parseCsvRows(await fs.readFile(absolutePath, 'utf8')).length;
      } else if (exists && artifact.type === 'yaml') {
        rowCount = 1;
      }
      inventoryRows.push({
        rowIdentity: `artifact-inventory-row:${artifact.artifactId}`,
        artifactId: String(artifact.artifactId),
        artifactPath,
        artifactType: artifact.type,
        required: 'true',
        rowCount: String(rowCount),
        exists: exists ? 'true' : 'false',
        schemaVersion: artifact.type === 'yaml' ? '1' : String((artifact.columns || []).length),
        status: exists ? 'PASS' : 'FAIL',
      });
    }
    await this.writeCsvArtifact(artifactPaths.get(8), this.registry[7].columns, inventoryRows);

    return {
      projectDir: outputPaths.projectDir,
      planningArtifactsRoot: outputPaths.planningArtifactsRoot,
      validationRoot: outputPaths.validationRoot,
      generatedArtifactCount: this.registry.length,
      artifactPaths: Object.fromEntries([...artifactPaths.entries()].map(([artifactId, artifactPath]) => [artifactId, artifactPath])),
    };
  }

  validateReplayEvidenceRow(row, sourcePath) {
    if (!isSha256(row.baselineArtifactSha256)) {
      throw new ShardDocValidationHarnessError({
        code: SHARD_DOC_VALIDATION_ERROR_CODES.REPLAY_EVIDENCE_INVALID,
        detail: 'Replay evidence baselineArtifactSha256 must be a valid sha256 hex digest',
        artifactId: 11,
        fieldPath: 'rows[*].baselineArtifactSha256',
        sourcePath,
        observedValue: normalizeValue(row.baselineArtifactSha256),
        expectedValue: '64-char lowercase sha256 hex',
      });
    }
    if (!isSha256(row.mutatedArtifactSha256)) {
      throw new ShardDocValidationHarnessError({
        code: SHARD_DOC_VALIDATION_ERROR_CODES.REPLAY_EVIDENCE_INVALID,
        detail: 'Replay evidence mutatedArtifactSha256 must be a valid sha256 hex digest',
        artifactId: 11,
        fieldPath: 'rows[*].mutatedArtifactSha256',
        sourcePath,
        observedValue: normalizeValue(row.mutatedArtifactSha256),
        expectedValue: '64-char lowercase sha256 hex',
      });
    }
    if (!isSha256(row.rowLevelDiffSha256)) {
      throw new ShardDocValidationHarnessError({
        code: SHARD_DOC_VALIDATION_ERROR_CODES.REPLAY_EVIDENCE_INVALID,
        detail: 'Replay evidence rowLevelDiffSha256 must be a valid sha256 hex digest',
        artifactId: 11,
        fieldPath: 'rows[*].rowLevelDiffSha256',
        sourcePath,
        observedValue: normalizeValue(row.rowLevelDiffSha256),
        expectedValue: '64-char lowercase sha256 hex',
      });
    }

    const perturbationApplied = normalizeValue(row.perturbationApplied).toLowerCase();
    if (perturbationApplied !== 'true') {
      throw new ShardDocValidationHarnessError({
        code: SHARD_DOC_VALIDATION_ERROR_CODES.REPLAY_EVIDENCE_INVALID,
        detail: 'Replay evidence must prove perturbationApplied=true from isolated component replay',
        artifactId: 11,
        fieldPath: 'rows[*].perturbationApplied',
        sourcePath,
        observedValue: normalizeValue(row.perturbationApplied),
        expectedValue: 'true',
      });
    }
  }

  async validateGeneratedArtifacts(options = {}) {
    const outputPaths = this.resolveOutputPaths(options);
    const artifactDataById = new Map();

    for (const artifact of this.registry) {
      const artifactPath = path.join(outputPaths.planningArtifactsRoot, artifact.relativePath);
      if (!(await fs.pathExists(artifactPath))) {
        throw new ShardDocValidationHarnessError({
          code: SHARD_DOC_VALIDATION_ERROR_CODES.REQUIRED_ARTIFACT_MISSING,
          detail: 'Required shard-doc validation artifact is missing',
          artifactId: artifact.artifactId,
          fieldPath: '<file>',
          sourcePath: normalizePath(artifact.relativePath),
          observedValue: '<missing>',
          expectedValue: normalizePath(artifact.relativePath),
        });
      }

      if (artifact.type === 'csv') {
        const content = await fs.readFile(artifactPath, 'utf8');
        const observedHeader = parseCsvHeader(content);
        const expectedHeader = artifact.columns || [];
        if (observedHeader.length !== expectedHeader.length) {
          throw new ShardDocValidationHarnessError({
            code: SHARD_DOC_VALIDATION_ERROR_CODES.CSV_SCHEMA_MISMATCH,
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
            throw new ShardDocValidationHarnessError({
              code: SHARD_DOC_VALIDATION_ERROR_CODES.CSV_SCHEMA_MISMATCH,
              detail: 'CSV header ordering does not match required schema',
              artifactId: artifact.artifactId,
              fieldPath: `header[${index}]`,
              sourcePath: normalizePath(artifact.relativePath),
              observedValue: observed,
              expectedValue: expected,
            });
          }
        }

        const rows = parseCsvRows(content);
        if (rows.length === 0) {
          throw new ShardDocValidationHarnessError({
            code: SHARD_DOC_VALIDATION_ERROR_CODES.REQUIRED_ROW_MISSING,
            detail: 'Required CSV artifact rows are missing',
            artifactId: artifact.artifactId,
            fieldPath: 'rows',
            sourcePath: normalizePath(artifact.relativePath),
            observedValue: '<empty>',
            expectedValue: 'at least one row',
          });
        }
        for (const requiredField of artifact.requiredRowIdentityFields || []) {
          for (const [rowIndex, row] of rows.entries()) {
            if (!normalizeValue(row[requiredField])) {
              throw new ShardDocValidationHarnessError({
                code: SHARD_DOC_VALIDATION_ERROR_CODES.REQUIRED_ROW_MISSING,
                detail: 'Required row identity field is empty',
                artifactId: artifact.artifactId,
                fieldPath: `rows[${rowIndex}].${requiredField}`,
                sourcePath: normalizePath(artifact.relativePath),
                observedValue: '<empty>',
                expectedValue: 'non-empty string',
              });
            }
          }
        }

        artifactDataById.set(artifact.artifactId, { type: 'csv', rows, header: observedHeader });
      } else if (artifact.type === 'yaml') {
        const parsed = yaml.parse(await fs.readFile(artifactPath, 'utf8'));
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
          throw new ShardDocValidationHarnessError({
            code: SHARD_DOC_VALIDATION_ERROR_CODES.YAML_SCHEMA_MISMATCH,
            detail: 'YAML artifact root must be a mapping object',
            artifactId: artifact.artifactId,
            fieldPath: '<document>',
            sourcePath: normalizePath(artifact.relativePath),
            observedValue: typeof parsed,
            expectedValue: 'object',
          });
        }
        for (const key of artifact.requiredTopLevelKeys || []) {
          if (!Object.prototype.hasOwnProperty.call(parsed, key)) {
            throw new ShardDocValidationHarnessError({
              code: SHARD_DOC_VALIDATION_ERROR_CODES.YAML_SCHEMA_MISMATCH,
              detail: 'Required YAML key is missing',
              artifactId: artifact.artifactId,
              fieldPath: key,
              sourcePath: normalizePath(artifact.relativePath),
              observedValue: '<missing>',
              expectedValue: key,
            });
          }
        }
        artifactDataById.set(artifact.artifactId, { type: 'yaml', parsed });
      }
    }

    const authorityRows = artifactDataById.get(2)?.rows || [];
    this.requireRow({
      rows: authorityRows,
      predicate: (row) =>
        normalizeValue(row.recordType) === 'metadata-authority' &&
        normalizeValue(row.canonicalId) === 'bmad-shard-doc' &&
        normalizeValue(row.authoritativePresenceKey) === 'capability:bmad-shard-doc',
      artifactId: 2,
      fieldPath: 'rows[*].recordType',
      sourcePath: normalizePath(this.registry[1].relativePath),
      detail: 'Metadata authority record for shard-doc is missing',
    });
    this.requireRow({
      rows: authorityRows,
      predicate: (row) =>
        normalizeValue(row.recordType) === 'source-body-authority' &&
        normalizeValue(row.canonicalId) === 'bmad-shard-doc' &&
        normalizeValue(row.authoritativePresenceKey) === 'capability:bmad-shard-doc',
      artifactId: 2,
      fieldPath: 'rows[*].recordType',
      sourcePath: normalizePath(this.registry[1].relativePath),
      detail: 'Source-body authority record for shard-doc is missing',
    });

    const compatibilityRows = artifactDataById.get(9)?.rows || [];
    for (const gateId of ['task-manifest-loader', 'bmad-help-catalog-loader', 'github-copilot-help-loader']) {
      const gateRow = this.requireRow({
        rows: compatibilityRows,
        predicate: (row) => normalizeValue(row.gateId) === gateId,
        artifactId: 9,
        fieldPath: 'rows[*].gateId',
        sourcePath: normalizePath(this.registry[8].relativePath),
        detail: `Required compatibility gate row is missing (${gateId})`,
      });
      if (normalizeValue(gateRow.status) !== 'PASS') {
        throw new ShardDocValidationHarnessError({
          code: SHARD_DOC_VALIDATION_ERROR_CODES.COMPATIBILITY_GATE_FAILED,
          detail: `Compatibility gate failed (${gateId})`,
          artifactId: 9,
          fieldPath: `rows[gateId=${gateId}].status`,
          sourcePath: normalizePath(this.registry[8].relativePath),
          observedValue: normalizeValue(gateRow.status),
          expectedValue: 'PASS',
        });
      }
    }

    const provenanceRows = artifactDataById.get(10)?.rows || [];
    for (const artifactPath of ['_bmad/_config/task-manifest.csv', '_bmad/_config/bmad-help.csv']) {
      const rowIdentity = buildIssuedArtifactRowIdentity(artifactPath);
      const provenanceRow = this.requireRow({
        rows: provenanceRows,
        predicate: (row) => normalizeValue(row.rowIdentity) === rowIdentity,
        artifactId: 10,
        fieldPath: 'rows[*].rowIdentity',
        sourcePath: normalizePath(this.registry[9].relativePath),
        detail: `Required issued-artifact provenance row is missing (${rowIdentity})`,
      });
      if (
        normalizeValue(provenanceRow.status) !== 'PASS' ||
        normalizeValue(provenanceRow.issuerOwnerClass) !== 'independent-validator' ||
        normalizeValue(provenanceRow.evidenceIssuerComponent) !== SHARD_DOC_EVIDENCE_ISSUER_COMPONENT
      ) {
        throw new ShardDocValidationHarnessError({
          code: SHARD_DOC_VALIDATION_ERROR_CODES.BINDING_EVIDENCE_INVALID,
          detail: 'Issued-artifact provenance row failed deterministic issuer binding contract',
          artifactId: 10,
          fieldPath: `rows[rowIdentity=${rowIdentity}]`,
          sourcePath: normalizePath(this.registry[9].relativePath),
          observedValue: canonicalJsonStringify({
            status: normalizeValue(provenanceRow.status),
            issuerOwnerClass: normalizeValue(provenanceRow.issuerOwnerClass),
            evidenceIssuerComponent: normalizeValue(provenanceRow.evidenceIssuerComponent),
          }),
          expectedValue: canonicalJsonStringify({
            status: 'PASS',
            issuerOwnerClass: 'independent-validator',
            evidenceIssuerComponent: SHARD_DOC_EVIDENCE_ISSUER_COMPONENT,
          }),
        });
      }
      if (!normalizeValue(provenanceRow.issuingComponentBindingEvidence)) {
        throw new ShardDocValidationHarnessError({
          code: SHARD_DOC_VALIDATION_ERROR_CODES.BINDING_EVIDENCE_INVALID,
          detail: 'Issued-artifact provenance row is missing binding evidence payload',
          artifactId: 10,
          fieldPath: `rows[rowIdentity=${rowIdentity}].issuingComponentBindingEvidence`,
          sourcePath: normalizePath(this.registry[9].relativePath),
          observedValue: '<empty>',
          expectedValue: 'non-empty canonical JSON payload',
        });
      }
    }

    const replayRows = artifactDataById.get(11)?.rows || [];
    for (const replayRow of replayRows) {
      this.validateReplayEvidenceRow(replayRow, normalizePath(this.registry[10].relativePath));
      const provenanceRow = this.requireRow({
        rows: provenanceRows,
        predicate: (row) => normalizeValue(row.rowIdentity) === normalizeValue(replayRow.provenanceRowIdentity),
        artifactId: 11,
        fieldPath: 'rows[*].provenanceRowIdentity',
        sourcePath: normalizePath(this.registry[10].relativePath),
        detail: 'Replay evidence row references missing issued-artifact provenance rowIdentity',
      });
      if (normalizeValue(replayRow.targetedRowLocator) !== normalizeValue(provenanceRow.rowIdentity)) {
        throw new ShardDocValidationHarnessError({
          code: SHARD_DOC_VALIDATION_ERROR_CODES.REPLAY_EVIDENCE_INVALID,
          detail: 'Replay evidence targetedRowLocator must equal provenance rowIdentity',
          artifactId: 11,
          fieldPath: 'rows[*].targetedRowLocator',
          sourcePath: normalizePath(this.registry[10].relativePath),
          observedValue: normalizeValue(replayRow.targetedRowLocator),
          expectedValue: normalizeValue(provenanceRow.rowIdentity),
        });
      }
      if (
        Number.parseInt(normalizeValue(replayRow.baselineTargetRowCount), 10) <=
        Number.parseInt(normalizeValue(replayRow.mutatedTargetRowCount), 10)
      ) {
        throw new ShardDocValidationHarnessError({
          code: SHARD_DOC_VALIDATION_ERROR_CODES.REPLAY_EVIDENCE_INVALID,
          detail: 'Replay evidence must show baseline target count greater than mutated target count',
          artifactId: 11,
          fieldPath: 'rows[*].baselineTargetRowCount',
          sourcePath: normalizePath(this.registry[10].relativePath),
          observedValue: `${normalizeValue(replayRow.baselineTargetRowCount)}<=${normalizeValue(replayRow.mutatedTargetRowCount)}`,
          expectedValue: 'baselineTargetRowCount > mutatedTargetRowCount',
        });
      }
    }

    const gateSummaryRows = artifactDataById.get(12)?.rows || [];
    for (const gateId of ['compatibility-gates', 'issued-artifact-provenance', 'replay-evidence']) {
      const summaryRow = this.requireRow({
        rows: gateSummaryRows,
        predicate: (row) => normalizeValue(row.gateId) === gateId,
        artifactId: 12,
        fieldPath: 'rows[*].gateId',
        sourcePath: normalizePath(this.registry[11].relativePath),
        detail: `Required gate summary row is missing (${gateId})`,
      });
      if (normalizeValue(summaryRow.status) !== 'PASS') {
        throw new ShardDocValidationHarnessError({
          code: SHARD_DOC_VALIDATION_ERROR_CODES.COMPATIBILITY_GATE_FAILED,
          detail: `Gate summary failed (${gateId})`,
          artifactId: 12,
          fieldPath: `rows[gateId=${gateId}].status`,
          sourcePath: normalizePath(this.registry[11].relativePath),
          observedValue: normalizeValue(summaryRow.status),
          expectedValue: 'PASS',
        });
      }
    }

    const inventoryRows = artifactDataById.get(8)?.rows || [];
    if (inventoryRows.length !== this.registry.length) {
      throw new ShardDocValidationHarnessError({
        code: SHARD_DOC_VALIDATION_ERROR_CODES.REQUIRED_ROW_MISSING,
        detail: 'Artifact inventory must include one row per required artifact',
        artifactId: 8,
        fieldPath: 'rows',
        sourcePath: normalizePath(this.registry[7].relativePath),
        observedValue: String(inventoryRows.length),
        expectedValue: String(this.registry.length),
      });
    }
    for (const artifact of this.registry) {
      const expectedArtifactPath = normalizePath(artifact.relativePath);
      const expectedSchemaVersion = artifact.type === 'yaml' ? '1' : String((artifact.columns || []).length);
      const inventoryRow = this.requireRow({
        rows: inventoryRows,
        predicate: (row) =>
          normalizeValue(row.artifactId) === String(artifact.artifactId) &&
          normalizePath(normalizeValue(row.artifactPath)) === expectedArtifactPath &&
          normalizeValue(row.artifactType) === artifact.type &&
          normalizeValue(row.required).toLowerCase() === 'true' &&
          normalizeValue(row.exists).toLowerCase() === 'true' &&
          normalizeValue(row.status) === 'PASS' &&
          normalizeValue(row.schemaVersion) === expectedSchemaVersion,
        artifactId: 8,
        fieldPath: 'rows[*].artifactId',
        sourcePath: normalizePath(this.registry[7].relativePath),
        detail: `Artifact inventory is missing deterministic PASS row for artifact ${artifact.artifactId}`,
      });

      const observedRowCount = Number.parseInt(normalizeValue(inventoryRow.rowCount), 10);
      const expectedInventoryRowCount = artifact.artifactId === 8 ? this.registry.length : null;
      const rowCountIsValid =
        Number.isFinite(observedRowCount) &&
        (expectedInventoryRowCount === null ? observedRowCount >= 1 : observedRowCount === expectedInventoryRowCount);
      if (!rowCountIsValid) {
        throw new ShardDocValidationHarnessError({
          code: SHARD_DOC_VALIDATION_ERROR_CODES.REQUIRED_ROW_MISSING,
          detail: 'Artifact inventory rowCount does not satisfy deterministic contract',
          artifactId: 8,
          fieldPath: `rows[artifactId=${artifact.artifactId}].rowCount`,
          sourcePath: normalizePath(this.registry[7].relativePath),
          observedValue: normalizeValue(inventoryRow.rowCount) || '<empty>',
          expectedValue: expectedInventoryRowCount === null ? '>= 1' : String(expectedInventoryRowCount),
        });
      }
    }

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
  SHARD_DOC_VALIDATION_ERROR_CODES,
  SHARD_DOC_VALIDATION_ARTIFACT_REGISTRY,
  ShardDocValidationHarnessError,
  ShardDocValidationHarness,
};

const path = require('node:path');
const fs = require('fs-extra');
const yaml = require('yaml');
const csv = require('csv-parse/sync');
const { getSourcePath } = require('../../../lib/project-root');
const { normalizeDisplayedCommandLabel } = require('./help-catalog-generator');

const SHARD_DOC_SIDECAR_SOURCE_PATH = 'bmad-fork/src/core/tasks/shard-doc.artifact.yaml';
const SHARD_DOC_SOURCE_XML_SOURCE_PATH = 'bmad-fork/src/core/tasks/shard-doc.xml';

const WAVE2_VALIDATION_ERROR_CODES = Object.freeze({
  REQUIRED_ARTIFACT_MISSING: 'ERR_WAVE2_VALIDATION_REQUIRED_ARTIFACT_MISSING',
  CSV_SCHEMA_MISMATCH: 'ERR_WAVE2_VALIDATION_CSV_SCHEMA_MISMATCH',
  REQUIRED_ROW_MISSING: 'ERR_WAVE2_VALIDATION_REQUIRED_ROW_MISSING',
  YAML_SCHEMA_MISMATCH: 'ERR_WAVE2_VALIDATION_YAML_SCHEMA_MISMATCH',
});

const WAVE2_VALIDATION_ARTIFACT_REGISTRY = Object.freeze([
  Object.freeze({
    artifactId: 1,
    relativePath: path.join('validation', 'wave-2', 'shard-doc-sidecar-snapshot.yaml'),
    type: 'yaml',
    requiredTopLevelKeys: ['schemaVersion', 'canonicalId', 'artifactType', 'module', 'sourcePath', 'displayName', 'description', 'status'],
  }),
  Object.freeze({
    artifactId: 2,
    relativePath: path.join('validation', 'wave-2', 'shard-doc-authority-records.csv'),
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
    relativePath: path.join('validation', 'wave-2', 'shard-doc-task-manifest-comparison.csv'),
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
    relativePath: path.join('validation', 'wave-2', 'shard-doc-help-catalog-comparison.csv'),
    type: 'csv',
    columns: ['surface', 'sourcePath', 'name', 'workflowFile', 'command', 'rowCountForCanonicalCommand', 'status'],
  }),
  Object.freeze({
    artifactId: 5,
    relativePath: path.join('validation', 'wave-2', 'shard-doc-alias-table.csv'),
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
    relativePath: path.join('validation', 'wave-2', 'shard-doc-command-label-report.csv'),
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
    relativePath: path.join('validation', 'wave-2', 'shard-doc-duplicate-report.csv'),
    type: 'csv',
    columns: ['surface', 'canonicalId', 'normalizedVisibleKey', 'matchingRowCount', 'status'],
  }),
  Object.freeze({
    artifactId: 8,
    relativePath: path.join('validation', 'wave-2', 'shard-doc-artifact-inventory.csv'),
    type: 'csv',
    columns: ['rowIdentity', 'artifactId', 'artifactPath', 'artifactType', 'required', 'rowCount', 'exists', 'schemaVersion', 'status'],
    requiredRowIdentityFields: ['rowIdentity'],
  }),
]);

class Wave2ValidationHarnessError extends Error {
  constructor({ code, detail, artifactId, fieldPath, sourcePath, observedValue, expectedValue }) {
    const message = `${code}: ${detail} (artifact=${artifactId}, fieldPath=${fieldPath}, sourcePath=${sourcePath})`;
    super(message);
    this.name = 'Wave2ValidationHarnessError';
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

class Wave2ValidationHarness {
  constructor() {
    this.registry = WAVE2_VALIDATION_ARTIFACT_REGISTRY;
  }

  getArtifactRegistry() {
    return this.registry;
  }

  resolveOutputPaths(options = {}) {
    const projectDir = path.resolve(options.projectDir || process.cwd());
    const planningArtifactsRoot = path.join(projectDir, '_bmad-output', 'planning-artifacts');
    const validationRoot = path.join(planningArtifactsRoot, 'validation', 'wave-2');
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
    throw new Wave2ValidationHarnessError({
      code: WAVE2_VALIDATION_ERROR_CODES.REQUIRED_ARTIFACT_MISSING,
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
    throw new Wave2ValidationHarnessError({
      code: WAVE2_VALIDATION_ERROR_CODES.REQUIRED_ROW_MISSING,
      detail,
      artifactId,
      fieldPath,
      sourcePath: normalizePath(sourcePath),
      observedValue: '<missing>',
      expectedValue: 'required row',
    });
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
    const taskManifestRows = parseCsvRows(await fs.readFile(path.join(bmadDir, '_config', 'task-manifest.csv'), 'utf8'));
    const helpCatalogRows = parseCsvRows(await fs.readFile(path.join(bmadDir, '_config', 'bmad-help.csv'), 'utf8'));
    const aliasRows = parseCsvRows(await fs.readFile(path.join(bmadDir, '_config', 'canonical-aliases.csv'), 'utf8'));
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
      throw new Wave2ValidationHarnessError({
        code: WAVE2_VALIDATION_ERROR_CODES.REQUIRED_ROW_MISSING,
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
        throw new Wave2ValidationHarnessError({
          code: WAVE2_VALIDATION_ERROR_CODES.REQUIRED_ROW_MISSING,
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
      throw new Wave2ValidationHarnessError({
        code: WAVE2_VALIDATION_ERROR_CODES.REQUIRED_ROW_MISSING,
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

    // Artifact 8
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

  async validateGeneratedArtifacts(options = {}) {
    const outputPaths = this.resolveOutputPaths(options);
    const artifactDataById = new Map();

    for (const artifact of this.registry) {
      const artifactPath = path.join(outputPaths.planningArtifactsRoot, artifact.relativePath);
      if (!(await fs.pathExists(artifactPath))) {
        throw new Wave2ValidationHarnessError({
          code: WAVE2_VALIDATION_ERROR_CODES.REQUIRED_ARTIFACT_MISSING,
          detail: 'Required wave-2 validation artifact is missing',
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
          throw new Wave2ValidationHarnessError({
            code: WAVE2_VALIDATION_ERROR_CODES.CSV_SCHEMA_MISMATCH,
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
            throw new Wave2ValidationHarnessError({
              code: WAVE2_VALIDATION_ERROR_CODES.CSV_SCHEMA_MISMATCH,
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
          throw new Wave2ValidationHarnessError({
            code: WAVE2_VALIDATION_ERROR_CODES.REQUIRED_ROW_MISSING,
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
              throw new Wave2ValidationHarnessError({
                code: WAVE2_VALIDATION_ERROR_CODES.REQUIRED_ROW_MISSING,
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
          throw new Wave2ValidationHarnessError({
            code: WAVE2_VALIDATION_ERROR_CODES.YAML_SCHEMA_MISMATCH,
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
            throw new Wave2ValidationHarnessError({
              code: WAVE2_VALIDATION_ERROR_CODES.YAML_SCHEMA_MISMATCH,
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

    const inventoryRows = artifactDataById.get(8)?.rows || [];
    if (inventoryRows.length !== this.registry.length) {
      throw new Wave2ValidationHarnessError({
        code: WAVE2_VALIDATION_ERROR_CODES.REQUIRED_ROW_MISSING,
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
        throw new Wave2ValidationHarnessError({
          code: WAVE2_VALIDATION_ERROR_CODES.REQUIRED_ROW_MISSING,
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
  WAVE2_VALIDATION_ERROR_CODES,
  WAVE2_VALIDATION_ARTIFACT_REGISTRY,
  Wave2ValidationHarnessError,
  Wave2ValidationHarness,
};

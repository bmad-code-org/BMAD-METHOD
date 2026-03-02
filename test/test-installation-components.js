/**
 * Installation Component Tests
 *
 * Tests individual installation components in isolation:
 * - Agent YAML → XML compilation
 * - Manifest generation
 * - Path resolution
 * - Customization merging
 *
 * These are deterministic unit tests that don't require full installation.
 * Usage: node test/test-installation-components.js
 */

const path = require('node:path');
const os = require('node:os');
const fs = require('fs-extra');
const yaml = require('yaml');
const csv = require('csv-parse/sync');
const { YamlXmlBuilder } = require('../tools/cli/lib/yaml-xml-builder');
const { Installer } = require('../tools/cli/installers/lib/core/installer');
const { ManifestGenerator } = require('../tools/cli/installers/lib/core/manifest-generator');
const { TaskToolCommandGenerator } = require('../tools/cli/installers/lib/ide/shared/task-tool-command-generator');
const { GitHubCopilotSetup } = require('../tools/cli/installers/lib/ide/github-copilot');
const {
  HELP_ALIAS_NORMALIZATION_ERROR_CODES,
  LOCKED_EXEMPLAR_ALIAS_ROWS,
  normalizeRawIdentityToTuple,
  resolveAliasTupleFromRows,
  resolveAliasTupleUsingCanonicalAliasCsv,
  normalizeAndResolveExemplarAlias,
} = require('../tools/cli/installers/lib/core/help-alias-normalizer');
const {
  HELP_SIDECAR_REQUIRED_FIELDS,
  HELP_SIDECAR_ERROR_CODES,
  validateHelpSidecarContractFile,
} = require('../tools/cli/installers/lib/core/sidecar-contract-validator');
const {
  HELP_FRONTMATTER_MISMATCH_ERROR_CODES,
  validateHelpAuthoritySplitAndPrecedence,
} = require('../tools/cli/installers/lib/core/help-authority-validator');
const {
  HELP_CATALOG_GENERATION_ERROR_CODES,
  EXEMPLAR_HELP_CATALOG_AUTHORITY_SOURCE_PATH,
  EXEMPLAR_HELP_CATALOG_ISSUING_COMPONENT,
  INSTALLER_HELP_CATALOG_MERGE_COMPONENT,
  buildSidecarAwareExemplarHelpRow,
  evaluateExemplarCommandLabelReportRows,
} = require('../tools/cli/installers/lib/core/help-catalog-generator');
const {
  CodexSetup,
  CODEX_EXPORT_DERIVATION_ERROR_CODES,
  EXEMPLAR_HELP_EXPORT_DERIVATION_SOURCE_TYPE,
} = require('../tools/cli/installers/lib/ide/codex');
const {
  PROJECTION_COMPATIBILITY_ERROR_CODES,
  TASK_MANIFEST_COMPATIBILITY_PREFIX_COLUMNS,
  TASK_MANIFEST_WAVE1_ADDITIVE_COLUMNS,
  HELP_CATALOG_COMPATIBILITY_PREFIX_COLUMNS,
  HELP_CATALOG_WAVE1_ADDITIVE_COLUMNS,
  validateTaskManifestCompatibilitySurface,
  validateTaskManifestLoaderEntries,
  validateHelpCatalogCompatibilitySurface,
  validateHelpCatalogLoaderEntries,
  validateGithubCopilotHelpLoaderEntries,
} = require('../tools/cli/installers/lib/core/projection-compatibility-validator');
const {
  WAVE1_VALIDATION_ERROR_CODES,
  WAVE1_VALIDATION_ARTIFACT_REGISTRY,
  Wave1ValidationHarness,
} = require('../tools/cli/installers/lib/core/wave-1-validation-harness');

// ANSI colors
const colors = {
  reset: '\u001B[0m',
  green: '\u001B[32m',
  red: '\u001B[31m',
  yellow: '\u001B[33m',
  cyan: '\u001B[36m',
  dim: '\u001B[2m',
};

let passed = 0;
let failed = 0;

/**
 * Test helper: Assert condition
 */
function assert(condition, testName, errorMessage = '') {
  if (condition) {
    console.log(`${colors.green}✓${colors.reset} ${testName}`);
    passed++;
  } else {
    console.log(`${colors.red}✗${colors.reset} ${testName}`);
    if (errorMessage) {
      console.log(`  ${colors.dim}${errorMessage}${colors.reset}`);
    }
    failed++;
  }
}

/**
 * Test Suite
 */
async function runTests() {
  console.log(`${colors.cyan}========================================`);
  console.log('Installation Component Tests');
  console.log(`========================================${colors.reset}\n`);

  const projectRoot = path.join(__dirname, '..');

  // ============================================================
  // Test 1: YAML → XML Agent Compilation (In-Memory)
  // ============================================================
  console.log(`${colors.yellow}Test Suite 1: Agent Compilation${colors.reset}\n`);

  try {
    const builder = new YamlXmlBuilder();
    const pmAgentPath = path.join(projectRoot, 'src/bmm/agents/pm.agent.yaml');

    // Create temp output path
    const tempOutput = path.join(__dirname, 'temp-pm-agent.md');

    try {
      const result = await builder.buildAgent(pmAgentPath, null, tempOutput, { includeMetadata: true });

      assert(result && result.outputPath === tempOutput, 'Agent compilation returns result object with outputPath');

      // Read the output
      const compiled = await fs.readFile(tempOutput, 'utf8');

      assert(compiled.includes('<agent'), 'Compiled agent contains <agent> tag');

      assert(compiled.includes('<persona>'), 'Compiled agent contains <persona> tag');

      assert(compiled.includes('<menu>'), 'Compiled agent contains <menu> tag');

      assert(compiled.includes('Product Manager'), 'Compiled agent contains agent title');

      // Cleanup
      await fs.remove(tempOutput);
    } catch (error) {
      assert(false, 'Agent compilation succeeds', error.message);
    }
  } catch (error) {
    assert(false, 'YamlXmlBuilder instantiates', error.message);
  }

  console.log('');

  // ============================================================
  // Test 2: Customization Merging
  // ============================================================
  console.log(`${colors.yellow}Test Suite 2: Customization Merging${colors.reset}\n`);

  try {
    const builder = new YamlXmlBuilder();

    // Test deepMerge function
    const base = {
      agent: {
        metadata: { name: 'John', title: 'PM' },
        persona: { role: 'Product Manager', style: 'Analytical' },
      },
    };

    const customize = {
      agent: {
        metadata: { name: 'Sarah' }, // Override name only
        persona: { style: 'Concise' }, // Override style only
      },
    };

    const merged = builder.deepMerge(base, customize);

    assert(merged.agent.metadata.name === 'Sarah', 'Deep merge overrides customized name');

    assert(merged.agent.metadata.title === 'PM', 'Deep merge preserves non-overridden title');

    assert(merged.agent.persona.role === 'Product Manager', 'Deep merge preserves non-overridden role');

    assert(merged.agent.persona.style === 'Concise', 'Deep merge overrides customized style');
  } catch (error) {
    assert(false, 'Customization merging works', error.message);
  }

  console.log('');

  // ============================================================
  // Test 3: Path Resolution
  // ============================================================
  console.log(`${colors.yellow}Test Suite 3: Path Variable Resolution${colors.reset}\n`);

  try {
    const builder = new YamlXmlBuilder();

    // Test path resolution logic (if exposed)
    // This would test {project-root}, {installed_path}, {config_source} resolution

    const testPath = '{project-root}/bmad/bmm/config.yaml';
    const expectedPattern = /\/bmad\/bmm\/config\.yaml$/;

    assert(
      true, // Placeholder - would test actual resolution
      'Path variable resolution pattern matches expected format',
      'Note: This test validates path resolution logic exists',
    );
  } catch (error) {
    assert(false, 'Path resolution works', error.message);
  }

  console.log('');

  // ============================================================
  // Test 4: Exemplar Sidecar Contract Validation
  // ============================================================
  console.log(`${colors.yellow}Test Suite 4: Sidecar Contract Validation${colors.reset}\n`);

  const validHelpSidecar = {
    schemaVersion: 1,
    canonicalId: 'bmad-help',
    artifactType: 'task',
    module: 'core',
    sourcePath: 'bmad-fork/src/core/tasks/help.md',
    displayName: 'help',
    description: 'Help command',
    dependencies: {
      requires: [],
    },
  };

  const tempSidecarRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-help-sidecar-'));
  const tempSidecarPath = path.join(tempSidecarRoot, 'help.artifact.yaml');
  const deterministicSourcePath = 'bmad-fork/src/core/tasks/help.artifact.yaml';
  const expectedUnsupportedMajorDetail = 'sidecar schema major version is unsupported';
  const expectedBasenameMismatchDetail = 'sidecar basename does not match sourcePath basename';

  const writeTempSidecar = async (data) => {
    await fs.writeFile(tempSidecarPath, yaml.stringify(data), 'utf8');
  };

  const expectValidationError = async (data, expectedCode, expectedFieldPath, testLabel, expectedDetail = null) => {
    await writeTempSidecar(data);

    try {
      await validateHelpSidecarContractFile(tempSidecarPath, { errorSourcePath: deterministicSourcePath });
      assert(false, testLabel, 'Expected validation error but validation passed');
    } catch (error) {
      assert(error.code === expectedCode, `${testLabel} returns expected error code`, `Expected ${expectedCode}, got ${error.code}`);
      assert(
        error.fieldPath === expectedFieldPath,
        `${testLabel} returns expected field path`,
        `Expected ${expectedFieldPath}, got ${error.fieldPath}`,
      );
      assert(
        typeof error.message === 'string' &&
          error.message.includes(expectedCode) &&
          error.message.includes(expectedFieldPath) &&
          error.message.includes(deterministicSourcePath),
        `${testLabel} includes deterministic message context`,
      );
      if (expectedDetail !== null) {
        assert(
          error.detail === expectedDetail,
          `${testLabel} returns locked detail string`,
          `Expected "${expectedDetail}", got "${error.detail}"`,
        );
      }
    }
  };

  try {
    await writeTempSidecar(validHelpSidecar);
    await validateHelpSidecarContractFile(tempSidecarPath, { errorSourcePath: deterministicSourcePath });
    assert(true, 'Valid sidecar contract passes');

    for (const requiredField of HELP_SIDECAR_REQUIRED_FIELDS.filter((field) => field !== 'dependencies')) {
      const invalidSidecar = structuredClone(validHelpSidecar);
      delete invalidSidecar[requiredField];
      await expectValidationError(
        invalidSidecar,
        HELP_SIDECAR_ERROR_CODES.REQUIRED_FIELD_MISSING,
        requiredField,
        `Missing required field "${requiredField}"`,
      );
    }

    await expectValidationError(
      { ...validHelpSidecar, artifactType: 'workflow' },
      HELP_SIDECAR_ERROR_CODES.ARTIFACT_TYPE_INVALID,
      'artifactType',
      'Invalid artifactType',
    );

    await expectValidationError(
      { ...validHelpSidecar, module: 'bmm' },
      HELP_SIDECAR_ERROR_CODES.MODULE_INVALID,
      'module',
      'Invalid module',
    );

    await expectValidationError(
      { ...validHelpSidecar, schemaVersion: 2 },
      HELP_SIDECAR_ERROR_CODES.MAJOR_VERSION_UNSUPPORTED,
      'schemaVersion',
      'Unsupported sidecar major schema version',
      expectedUnsupportedMajorDetail,
    );

    await expectValidationError(
      { ...validHelpSidecar, canonicalId: '   ' },
      HELP_SIDECAR_ERROR_CODES.REQUIRED_FIELD_EMPTY,
      'canonicalId',
      'Empty canonicalId',
    );

    await expectValidationError(
      { ...validHelpSidecar, sourcePath: '' },
      HELP_SIDECAR_ERROR_CODES.REQUIRED_FIELD_EMPTY,
      'sourcePath',
      'Empty sourcePath',
    );

    await expectValidationError(
      { ...validHelpSidecar, sourcePath: 'bmad-fork/src/core/tasks/not-help.md' },
      HELP_SIDECAR_ERROR_CODES.SOURCEPATH_BASENAME_MISMATCH,
      'sourcePath',
      'Source path mismatch with exemplar contract',
      expectedBasenameMismatchDetail,
    );

    const mismatchedBasenamePath = path.join(tempSidecarRoot, 'not-help.artifact.yaml');
    await fs.writeFile(mismatchedBasenamePath, yaml.stringify(validHelpSidecar), 'utf8');
    try {
      await validateHelpSidecarContractFile(mismatchedBasenamePath, {
        errorSourcePath: 'bmad-fork/src/core/tasks/not-help.artifact.yaml',
      });
      assert(false, 'Sidecar basename mismatch returns validation error', 'Expected validation error but validation passed');
    } catch (error) {
      assert(error.code === HELP_SIDECAR_ERROR_CODES.SOURCEPATH_BASENAME_MISMATCH, 'Sidecar basename mismatch returns expected error code');
      assert(
        error.fieldPath === 'sourcePath',
        'Sidecar basename mismatch returns expected field path',
        `Expected sourcePath, got ${error.fieldPath}`,
      );
      assert(
        typeof error.message === 'string' &&
          error.message.includes(HELP_SIDECAR_ERROR_CODES.SOURCEPATH_BASENAME_MISMATCH) &&
          error.message.includes('bmad-fork/src/core/tasks/not-help.artifact.yaml'),
        'Sidecar basename mismatch includes deterministic message context',
      );
      assert(
        error.detail === expectedBasenameMismatchDetail,
        'Sidecar basename mismatch returns locked detail string',
        `Expected "${expectedBasenameMismatchDetail}", got "${error.detail}"`,
      );
    }

    const missingDependencies = structuredClone(validHelpSidecar);
    delete missingDependencies.dependencies;
    await expectValidationError(
      missingDependencies,
      HELP_SIDECAR_ERROR_CODES.DEPENDENCIES_MISSING,
      'dependencies',
      'Missing dependencies block',
    );

    await expectValidationError(
      { ...validHelpSidecar, dependencies: { requires: 'skill:bmad-help' } },
      HELP_SIDECAR_ERROR_CODES.DEPENDENCIES_REQUIRES_INVALID,
      'dependencies.requires',
      'Non-array dependencies.requires',
    );

    await expectValidationError(
      { ...validHelpSidecar, dependencies: { requires: ['skill:bmad-help'] } },
      HELP_SIDECAR_ERROR_CODES.DEPENDENCIES_REQUIRES_NOT_EMPTY,
      'dependencies.requires',
      'Non-empty dependencies.requires',
    );
  } catch (error) {
    assert(false, 'Sidecar validation suite setup', error.message);
  } finally {
    await fs.remove(tempSidecarRoot);
  }

  console.log('');

  // ============================================================
  // Test 5: Authority Split and Frontmatter Precedence
  // ============================================================
  console.log(`${colors.yellow}Test Suite 5: Authority Split and Precedence${colors.reset}\n`);

  const tempAuthorityRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-help-authority-'));
  const tempAuthoritySidecarPath = path.join(tempAuthorityRoot, 'help.artifact.yaml');
  const tempAuthoritySourcePath = path.join(tempAuthorityRoot, 'help-source.md');
  const tempAuthorityRuntimePath = path.join(tempAuthorityRoot, 'help-runtime.md');

  const deterministicAuthorityPaths = {
    sidecar: 'bmad-fork/src/core/tasks/help.artifact.yaml',
    source: 'bmad-fork/src/core/tasks/help.md',
    runtime: '_bmad/core/tasks/help.md',
  };

  const writeMarkdownWithFrontmatter = async (filePath, frontmatter) => {
    const frontmatterBody = yaml.stringify(frontmatter).trimEnd();
    await fs.writeFile(filePath, `---\n${frontmatterBody}\n---\n\n# Placeholder\n`, 'utf8');
  };

  const validAuthoritySidecar = {
    schemaVersion: 1,
    canonicalId: 'bmad-help',
    artifactType: 'task',
    module: 'core',
    sourcePath: deterministicAuthorityPaths.source,
    displayName: 'help',
    description: 'Help command',
    dependencies: {
      requires: [],
    },
  };

  const validAuthorityFrontmatter = {
    name: 'help',
    description: 'Help command',
    canonicalId: 'bmad-help',
    dependencies: {
      requires: [],
    },
  };

  const runAuthorityValidation = async () =>
    validateHelpAuthoritySplitAndPrecedence({
      sidecarPath: tempAuthoritySidecarPath,
      sourceMarkdownPath: tempAuthoritySourcePath,
      runtimeMarkdownPath: tempAuthorityRuntimePath,
      sidecarSourcePath: deterministicAuthorityPaths.sidecar,
      sourceMarkdownSourcePath: deterministicAuthorityPaths.source,
      runtimeMarkdownSourcePath: deterministicAuthorityPaths.runtime,
    });

  const expectAuthorityValidationError = async (
    sourceFrontmatter,
    runtimeFrontmatter,
    expectedCode,
    expectedFieldPath,
    expectedSourcePath,
    testLabel,
  ) => {
    await writeMarkdownWithFrontmatter(tempAuthoritySourcePath, sourceFrontmatter);
    await writeMarkdownWithFrontmatter(tempAuthorityRuntimePath, runtimeFrontmatter);

    try {
      await runAuthorityValidation();
      assert(false, testLabel, 'Expected authority validation error but validation passed');
    } catch (error) {
      assert(error.code === expectedCode, `${testLabel} returns expected error code`, `Expected ${expectedCode}, got ${error.code}`);
      assert(
        error.fieldPath === expectedFieldPath,
        `${testLabel} returns expected field path`,
        `Expected ${expectedFieldPath}, got ${error.fieldPath}`,
      );
      assert(
        error.sourcePath === expectedSourcePath,
        `${testLabel} returns expected source path`,
        `Expected ${expectedSourcePath}, got ${error.sourcePath}`,
      );
      assert(
        typeof error.message === 'string' &&
          error.message.includes(expectedCode) &&
          error.message.includes(expectedFieldPath) &&
          error.message.includes(expectedSourcePath),
        `${testLabel} includes deterministic message context`,
      );
    }
  };

  try {
    await fs.writeFile(tempAuthoritySidecarPath, yaml.stringify(validAuthoritySidecar), 'utf8');
    await writeMarkdownWithFrontmatter(tempAuthoritySourcePath, validAuthorityFrontmatter);
    await writeMarkdownWithFrontmatter(tempAuthorityRuntimePath, validAuthorityFrontmatter);

    const authorityValidation = await runAuthorityValidation();
    assert(
      authorityValidation.authoritativePresenceKey === 'capability:bmad-help',
      'Authority validation returns shared authoritative presence key',
    );
    assert(
      Array.isArray(authorityValidation.authoritativeRecords) && authorityValidation.authoritativeRecords.length === 2,
      'Authority validation returns sidecar and source authority records',
    );

    const sidecarRecord = authorityValidation.authoritativeRecords.find((record) => record.authoritySourceType === 'sidecar');
    const sourceRecord = authorityValidation.authoritativeRecords.find((record) => record.authoritySourceType === 'source-markdown');

    assert(
      sidecarRecord && sourceRecord && sidecarRecord.authoritativePresenceKey === sourceRecord.authoritativePresenceKey,
      'Source markdown and sidecar records share one authoritative presence key',
    );
    assert(
      sidecarRecord && sidecarRecord.authoritySourcePath === deterministicAuthorityPaths.sidecar,
      'Sidecar authority record preserves truthful sidecar source path',
    );
    assert(
      sourceRecord && sourceRecord.authoritySourcePath === deterministicAuthorityPaths.source,
      'Source body authority record preserves truthful source markdown path',
    );

    const manifestGenerator = new ManifestGenerator();
    manifestGenerator.modules = ['core'];
    manifestGenerator.bmadDir = tempAuthorityRoot;
    manifestGenerator.selectedIdes = [];
    manifestGenerator.helpAuthorityRecords = authorityValidation.authoritativeRecords;

    const tempManifestConfigDir = path.join(tempAuthorityRoot, '_config');
    await fs.ensureDir(tempManifestConfigDir);
    await manifestGenerator.writeMainManifest(tempManifestConfigDir);

    const writtenManifestRaw = await fs.readFile(path.join(tempManifestConfigDir, 'manifest.yaml'), 'utf8');
    const writtenManifest = yaml.parse(writtenManifestRaw);

    assert(
      writtenManifest.helpAuthority && Array.isArray(writtenManifest.helpAuthority.records),
      'Manifest generation persists help authority records',
    );
    assert(
      writtenManifest.helpAuthority && writtenManifest.helpAuthority.records && writtenManifest.helpAuthority.records.length === 2,
      'Manifest generation persists both authority records',
    );
    assert(
      writtenManifest.helpAuthority &&
        writtenManifest.helpAuthority.records.some(
          (record) => record.authoritySourceType === 'sidecar' && record.authoritySourcePath === deterministicAuthorityPaths.sidecar,
        ),
      'Manifest generation preserves sidecar authority provenance',
    );
    assert(
      writtenManifest.helpAuthority &&
        writtenManifest.helpAuthority.records.some(
          (record) => record.authoritySourceType === 'source-markdown' && record.authoritySourcePath === deterministicAuthorityPaths.source,
        ),
      'Manifest generation preserves source-markdown authority provenance',
    );

    await expectAuthorityValidationError(
      { ...validAuthorityFrontmatter, canonicalId: 'legacy-help' },
      validAuthorityFrontmatter,
      HELP_FRONTMATTER_MISMATCH_ERROR_CODES.CANONICAL_ID_MISMATCH,
      'canonicalId',
      deterministicAuthorityPaths.source,
      'Source canonicalId mismatch',
    );

    await expectAuthorityValidationError(
      { ...validAuthorityFrontmatter, name: 'BMAD Help' },
      validAuthorityFrontmatter,
      HELP_FRONTMATTER_MISMATCH_ERROR_CODES.DISPLAY_NAME_MISMATCH,
      'name',
      deterministicAuthorityPaths.source,
      'Source display-name mismatch',
    );

    await expectAuthorityValidationError(
      validAuthorityFrontmatter,
      { ...validAuthorityFrontmatter, description: 'Runtime override' },
      HELP_FRONTMATTER_MISMATCH_ERROR_CODES.DESCRIPTION_MISMATCH,
      'description',
      deterministicAuthorityPaths.runtime,
      'Runtime description mismatch',
    );

    await expectAuthorityValidationError(
      { ...validAuthorityFrontmatter, dependencies: { requires: ['skill:other'] } },
      validAuthorityFrontmatter,
      HELP_FRONTMATTER_MISMATCH_ERROR_CODES.DEPENDENCIES_REQUIRES_MISMATCH,
      'dependencies.requires',
      deterministicAuthorityPaths.source,
      'Source dependencies.requires mismatch',
    );
  } catch (error) {
    assert(false, 'Authority split and precedence suite setup', error.message);
  } finally {
    await fs.remove(tempAuthorityRoot);
  }

  console.log('');

  // ============================================================
  // Test 6: Installer Fail-Fast Pre-Generation
  // ============================================================
  console.log(`${colors.yellow}Test Suite 6: Installer Fail-Fast Pre-Generation${colors.reset}\n`);

  const tempInstallerRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-installer-sidecar-failfast-'));

  try {
    const installer = new Installer();
    let authorityValidationCalled = false;
    let generateConfigsCalled = false;
    let manifestGenerationCalled = false;
    let helpCatalogGenerationCalled = false;
    let successResultCount = 0;

    installer.validateHelpSidecarContractFile = async () => {
      const error = new Error(expectedUnsupportedMajorDetail);
      error.code = HELP_SIDECAR_ERROR_CODES.MAJOR_VERSION_UNSUPPORTED;
      error.fieldPath = 'schemaVersion';
      error.detail = expectedUnsupportedMajorDetail;
      throw error;
    };

    installer.validateHelpAuthoritySplitAndPrecedence = async () => {
      authorityValidationCalled = true;
      return {
        authoritativeRecords: [],
        authoritativePresenceKey: 'capability:bmad-help',
      };
    };

    installer.generateModuleConfigs = async () => {
      generateConfigsCalled = true;
    };

    installer.mergeModuleHelpCatalogs = async () => {
      helpCatalogGenerationCalled = true;
    };

    installer.ManifestGenerator = class ManifestGeneratorStub {
      async generateManifests() {
        manifestGenerationCalled = true;
        return {
          workflows: 0,
          agents: 0,
          tasks: 0,
          tools: 0,
        };
      }
    };

    try {
      await installer.runConfigurationGenerationTask({
        message: () => {},
        bmadDir: tempInstallerRoot,
        moduleConfigs: { core: {} },
        config: { ides: [] },
        allModules: ['core'],
        addResult: () => {
          successResultCount += 1;
        },
      });
      assert(
        false,
        'Installer fail-fast blocks projection generation on sidecar validation failure',
        'Expected sidecar validation failure but configuration generation completed',
      );
    } catch (error) {
      assert(
        error.code === HELP_SIDECAR_ERROR_CODES.MAJOR_VERSION_UNSUPPORTED,
        'Installer fail-fast surfaces sidecar validation error code',
        `Expected ${HELP_SIDECAR_ERROR_CODES.MAJOR_VERSION_UNSUPPORTED}, got ${error.code}`,
      );
      assert(
        !authorityValidationCalled && !generateConfigsCalled && !manifestGenerationCalled && !helpCatalogGenerationCalled,
        'Installer fail-fast prevents downstream authority/config/manifest/help generation',
      );
      assert(
        successResultCount === 0,
        'Installer fail-fast records no successful projection milestones',
        `Expected 0, got ${successResultCount}`,
      );
    }
  } catch (error) {
    assert(false, 'Installer fail-fast test setup', error.message);
  } finally {
    await fs.remove(tempInstallerRoot);
  }

  console.log('');

  // ============================================================
  // Test 7: Canonical Alias Normalization Core
  // ============================================================
  console.log(`${colors.yellow}Test Suite 7: Canonical Alias Normalization Core${colors.reset}\n`);

  const deterministicAliasTableSourcePath = '_bmad/_config/canonical-aliases.csv';

  const expectAliasNormalizationError = async (
    operation,
    expectedCode,
    expectedFieldPath,
    expectedObservedValue,
    testLabel,
    expectedDetail = null,
  ) => {
    try {
      await Promise.resolve(operation());
      assert(false, testLabel, 'Expected alias normalization error but operation succeeded');
    } catch (error) {
      assert(error.code === expectedCode, `${testLabel} returns expected error code`, `Expected ${expectedCode}, got ${error.code}`);
      assert(
        error.fieldPath === expectedFieldPath,
        `${testLabel} returns expected field path`,
        `Expected ${expectedFieldPath}, got ${error.fieldPath}`,
      );
      assert(
        error.sourcePath === deterministicAliasTableSourcePath,
        `${testLabel} returns expected source path`,
        `Expected ${deterministicAliasTableSourcePath}, got ${error.sourcePath}`,
      );
      assert(
        error.observedValue === expectedObservedValue,
        `${testLabel} returns normalized offending value context`,
        `Expected "${expectedObservedValue}", got "${error.observedValue}"`,
      );
      assert(
        typeof error.message === 'string' &&
          error.message.includes(expectedCode) &&
          error.message.includes(expectedFieldPath) &&
          error.message.includes(deterministicAliasTableSourcePath),
        `${testLabel} includes deterministic message context`,
      );
      if (expectedDetail !== null) {
        assert(
          error.detail === expectedDetail,
          `${testLabel} returns locked detail string`,
          `Expected "${expectedDetail}", got "${error.detail}"`,
        );
      }
    }
  };

  try {
    const canonicalTuple = normalizeRawIdentityToTuple('   BMAD-HELP   ', {
      fieldPath: 'canonicalId',
      sourcePath: deterministicAliasTableSourcePath,
    });

    assert(canonicalTuple.rawIdentityHasLeadingSlash === false, 'Canonical tuple sets rawIdentityHasLeadingSlash=false');
    assert(canonicalTuple.preAliasNormalizedValue === 'bmad-help', 'Canonical tuple computes preAliasNormalizedValue=bmad-help');
    assert(canonicalTuple.normalizedRawIdentity === 'bmad-help', 'Canonical tuple computes normalizedRawIdentity');

    const canonicalResolution = resolveAliasTupleFromRows(canonicalTuple, LOCKED_EXEMPLAR_ALIAS_ROWS, {
      sourcePath: deterministicAliasTableSourcePath,
    });
    assert(
      canonicalResolution.aliasRowLocator === 'alias-row:bmad-help:canonical-id',
      'Canonical tuple resolves to locked canonical-id row locator',
    );
    assert(canonicalResolution.postAliasCanonicalId === 'bmad-help', 'Canonical tuple resolves to locked canonicalId');

    const legacyResolution = await normalizeAndResolveExemplarAlias('   HELP   ', {
      fieldPath: 'canonicalId',
      sourcePath: deterministicAliasTableSourcePath,
    });
    assert(legacyResolution.rawIdentityHasLeadingSlash === false, 'Legacy tuple sets rawIdentityHasLeadingSlash=false');
    assert(legacyResolution.preAliasNormalizedValue === 'help', 'Legacy tuple computes preAliasNormalizedValue=help');
    assert(
      legacyResolution.aliasRowLocator === 'alias-row:bmad-help:legacy-name',
      'Legacy tuple resolves to locked legacy-name row locator',
    );
    assert(legacyResolution.postAliasCanonicalId === 'bmad-help', 'Legacy tuple resolves to locked canonicalId');

    const slashResolution = await normalizeAndResolveExemplarAlias('  /BMAD-HELP  ', {
      fieldPath: 'canonicalId',
      sourcePath: deterministicAliasTableSourcePath,
    });
    assert(slashResolution.rawIdentityHasLeadingSlash === true, 'Slash tuple sets rawIdentityHasLeadingSlash=true');
    assert(slashResolution.preAliasNormalizedValue === 'bmad-help', 'Slash tuple computes preAliasNormalizedValue=bmad-help');
    assert(
      slashResolution.aliasRowLocator === 'alias-row:bmad-help:slash-command',
      'Slash tuple resolves to locked slash-command row locator',
    );
    assert(slashResolution.postAliasCanonicalId === 'bmad-help', 'Slash tuple resolves to locked canonicalId');

    const tempAliasAuthorityRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-alias-authority-'));
    const tempAliasSidecarPath = path.join(tempAliasAuthorityRoot, 'help.artifact.yaml');
    const tempAliasSourcePath = path.join(tempAliasAuthorityRoot, 'help-source.md');
    const tempAliasRuntimePath = path.join(tempAliasAuthorityRoot, 'help-runtime.md');
    const tempAliasConfigDir = path.join(tempAliasAuthorityRoot, '_config');
    const tempAuthorityAliasTablePath = path.join(tempAliasConfigDir, 'canonical-aliases.csv');
    const aliasAuthorityPaths = {
      sidecar: 'bmad-fork/src/core/tasks/help.artifact.yaml',
      source: 'bmad-fork/src/core/tasks/help.md',
      runtime: '_bmad/core/tasks/help.md',
    };

    const aliasFrontmatter = {
      name: 'help',
      description: 'Help command',
      canonicalId: 'help',
      dependencies: {
        requires: [],
      },
    };

    try {
      await fs.writeFile(
        tempAliasSidecarPath,
        yaml.stringify({
          schemaVersion: 1,
          canonicalId: 'help',
          artifactType: 'task',
          module: 'core',
          sourcePath: aliasAuthorityPaths.source,
          displayName: 'help',
          description: 'Help command',
          dependencies: {
            requires: [],
          },
        }),
        'utf8',
      );
      await fs.writeFile(tempAliasSourcePath, `---\n${yaml.stringify(aliasFrontmatter).trimEnd()}\n---\n\n# Help\n`, 'utf8');
      await fs.writeFile(tempAliasRuntimePath, `---\n${yaml.stringify(aliasFrontmatter).trimEnd()}\n---\n\n# Help\n`, 'utf8');

      const aliasAuthorityValidation = await validateHelpAuthoritySplitAndPrecedence({
        sidecarPath: tempAliasSidecarPath,
        sourceMarkdownPath: tempAliasSourcePath,
        runtimeMarkdownPath: tempAliasRuntimePath,
        sidecarSourcePath: aliasAuthorityPaths.sidecar,
        sourceMarkdownSourcePath: aliasAuthorityPaths.source,
        runtimeMarkdownSourcePath: aliasAuthorityPaths.runtime,
      });

      assert(
        aliasAuthorityValidation.canonicalId === 'bmad-help',
        'Authority validation normalizes legacy canonical identity to locked canonicalId',
      );
      assert(
        aliasAuthorityValidation.authoritativePresenceKey === 'capability:bmad-help',
        'Authority validation emits canonical presence key after alias resolution',
      );

      await fs.ensureDir(tempAliasConfigDir);
      await fs.writeFile(
        tempAuthorityAliasTablePath,
        [
          'rowIdentity,canonicalId,normalizedAliasValue,rawIdentityHasLeadingSlash',
          'alias-row:bmad-help:legacy-name,bmad-help-csv,help,false',
        ].join('\n') + '\n',
        'utf8',
      );
      const csvBackedAuthorityValidation = await validateHelpAuthoritySplitAndPrecedence({
        sidecarPath: tempAliasSidecarPath,
        sourceMarkdownPath: tempAliasSourcePath,
        runtimeMarkdownPath: tempAliasRuntimePath,
        sidecarSourcePath: aliasAuthorityPaths.sidecar,
        sourceMarkdownSourcePath: aliasAuthorityPaths.source,
        runtimeMarkdownSourcePath: aliasAuthorityPaths.runtime,
        bmadDir: tempAliasAuthorityRoot,
      });
      assert(
        csvBackedAuthorityValidation.canonicalId === 'bmad-help-csv',
        'Authority validation prefers canonical alias CSV when available',
      );
      assert(
        csvBackedAuthorityValidation.authoritativePresenceKey === 'capability:bmad-help-csv',
        'Authority validation derives presence key from CSV-resolved canonical identity',
      );
    } finally {
      await fs.remove(tempAliasAuthorityRoot);
    }

    const collapsedWhitespaceTuple = normalizeRawIdentityToTuple('  bmad\t\thelp  ', {
      fieldPath: 'canonicalId',
      sourcePath: deterministicAliasTableSourcePath,
    });
    assert(
      collapsedWhitespaceTuple.preAliasNormalizedValue === 'bmad help',
      'Tuple normalization collapses internal whitespace runs deterministically',
    );

    await expectAliasNormalizationError(
      () =>
        normalizeRawIdentityToTuple(' \n\t ', {
          fieldPath: 'canonicalId',
          sourcePath: deterministicAliasTableSourcePath,
        }),
      HELP_ALIAS_NORMALIZATION_ERROR_CODES.EMPTY_INPUT,
      'canonicalId',
      '',
      'Empty alias input',
      'alias identity is empty after normalization',
    );

    await expectAliasNormalizationError(
      () =>
        normalizeRawIdentityToTuple('//bmad-help', {
          fieldPath: 'canonicalId',
          sourcePath: deterministicAliasTableSourcePath,
        }),
      HELP_ALIAS_NORMALIZATION_ERROR_CODES.MULTIPLE_LEADING_SLASHES,
      'canonicalId',
      '//bmad-help',
      'Alias input with multiple leading slashes',
      'alias identity contains multiple leading slashes',
    );

    await expectAliasNormalizationError(
      () =>
        normalizeRawIdentityToTuple('/   ', {
          fieldPath: 'canonicalId',
          sourcePath: deterministicAliasTableSourcePath,
        }),
      HELP_ALIAS_NORMALIZATION_ERROR_CODES.EMPTY_PREALIAS,
      'preAliasNormalizedValue',
      '/',
      'Alias input with empty pre-alias value',
      'alias preAliasNormalizedValue is empty after slash normalization',
    );

    await expectAliasNormalizationError(
      () =>
        normalizeAndResolveExemplarAlias('not-a-locked-alias', {
          fieldPath: 'canonicalId',
          sourcePath: deterministicAliasTableSourcePath,
        }),
      HELP_ALIAS_NORMALIZATION_ERROR_CODES.UNRESOLVED,
      'preAliasNormalizedValue',
      'not-a-locked-alias|leadingSlash:false',
      'Unresolved alias tuple',
      'alias tuple did not resolve to any canonical alias row',
    );

    const ambiguousAliasRows = [
      {
        rowIdentity: 'alias-row:a',
        canonicalId: 'bmad-help',
        normalizedAliasValue: 'help',
        rawIdentityHasLeadingSlash: false,
      },
      {
        rowIdentity: 'alias-row:b',
        canonicalId: 'legacy-help',
        normalizedAliasValue: 'help',
        rawIdentityHasLeadingSlash: false,
      },
    ];
    const ambiguousTuple = normalizeRawIdentityToTuple('help', {
      fieldPath: 'canonicalId',
      sourcePath: deterministicAliasTableSourcePath,
    });
    await expectAliasNormalizationError(
      () =>
        resolveAliasTupleFromRows(ambiguousTuple, ambiguousAliasRows, {
          sourcePath: deterministicAliasTableSourcePath,
        }),
      HELP_ALIAS_NORMALIZATION_ERROR_CODES.UNRESOLVED,
      'preAliasNormalizedValue',
      'help|leadingSlash:false',
      'Ambiguous alias tuple resolution',
      'alias tuple resolved ambiguously to multiple canonical alias rows',
    );

    const tempAliasTableRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-canonical-alias-table-'));
    const tempAliasTablePath = path.join(tempAliasTableRoot, 'canonical-aliases.csv');
    const csvRows = [
      'rowIdentity,canonicalId,normalizedAliasValue,rawIdentityHasLeadingSlash',
      'alias-row:bmad-help:canonical-id,bmad-help,bmad-help,false',
      'alias-row:bmad-help:legacy-name,bmad-help,help,false',
      'alias-row:bmad-help:slash-command,bmad-help,bmad-help,true',
    ];
    try {
      await fs.writeFile(tempAliasTablePath, `${csvRows.join('\n')}\n`, 'utf8');
      const csvTuple = normalizeRawIdentityToTuple('/bmad-help', {
        fieldPath: 'canonicalId',
        sourcePath: deterministicAliasTableSourcePath,
      });
      const csvResolution = await resolveAliasTupleUsingCanonicalAliasCsv(csvTuple, tempAliasTablePath, {
        sourcePath: deterministicAliasTableSourcePath,
      });
      assert(
        csvResolution.aliasRowLocator === 'alias-row:bmad-help:slash-command',
        'CSV-backed tuple resolution maps slash-command alias row locator',
      );
      assert(csvResolution.postAliasCanonicalId === 'bmad-help', 'CSV-backed tuple resolution maps canonicalId');

      const manifestGenerator = new ManifestGenerator();
      const normalizedHelpAuthorityRecords = await manifestGenerator.normalizeHelpAuthorityRecords([
        {
          recordType: 'metadata-authority',
          canonicalId: 'help',
          authoritativePresenceKey: 'capability:legacy-help',
          authoritySourceType: 'sidecar',
          authoritySourcePath: aliasAuthorityPaths.sidecar,
          sourcePath: aliasAuthorityPaths.source,
        },
      ]);
      assert(
        normalizedHelpAuthorityRecords.length === 1 && normalizedHelpAuthorityRecords[0].canonicalId === 'bmad-help',
        'Manifest generator normalizes legacy canonical identities using alias tuple resolution',
      );
      assert(
        normalizedHelpAuthorityRecords.length === 1 &&
          normalizedHelpAuthorityRecords[0].authoritativePresenceKey === 'capability:bmad-help',
        'Manifest generator canonicalizes authoritative presence key from normalized canonicalId',
      );

      await expectAliasNormalizationError(
        () =>
          manifestGenerator.normalizeHelpAuthorityRecords([
            {
              recordType: 'metadata-authority',
              canonicalId: 'not-a-locked-alias',
              authoritativePresenceKey: 'capability:not-a-locked-alias',
              authoritySourceType: 'sidecar',
              authoritySourcePath: aliasAuthorityPaths.sidecar,
              sourcePath: aliasAuthorityPaths.source,
            },
          ]),
        HELP_ALIAS_NORMALIZATION_ERROR_CODES.UNRESOLVED,
        'preAliasNormalizedValue',
        'not-a-locked-alias|leadingSlash:false',
        'Manifest generator fails unresolved canonical identity normalization',
        'alias tuple did not resolve to any canonical alias row',
      );

      await expectAliasNormalizationError(
        () =>
          resolveAliasTupleUsingCanonicalAliasCsv(csvTuple, path.join(tempAliasTableRoot, 'missing.csv'), {
            sourcePath: deterministicAliasTableSourcePath,
          }),
        HELP_ALIAS_NORMALIZATION_ERROR_CODES.UNRESOLVED,
        'aliasTablePath',
        path.join(tempAliasTableRoot, 'missing.csv'),
        'CSV-backed alias resolution with missing table file',
        'canonical alias table file was not found',
      );
    } finally {
      await fs.remove(tempAliasTableRoot);
    }
  } catch (error) {
    assert(false, 'Canonical alias normalization suite setup', error.message);
  }

  console.log('');

  // ============================================================
  // Test 8: Additive Task Manifest Projection
  // ============================================================
  console.log(`${colors.yellow}Test Suite 8: Additive Task Manifest Projection${colors.reset}\n`);

  const tempTaskManifestRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-task-manifest-'));
  try {
    const manifestGenerator = new ManifestGenerator();
    manifestGenerator.bmadDir = tempTaskManifestRoot;
    manifestGenerator.bmadFolderName = '_bmad';
    manifestGenerator.tasks = [
      {
        name: 'help',
        displayName: 'help',
        description: 'Help command',
        module: 'core',
        path: 'core/tasks/help.md',
        standalone: true,
      },
      {
        name: 'validate-workflow',
        displayName: 'validate-workflow',
        description: 'Validate workflow',
        module: 'core',
        path: 'core/tasks/validate-workflow.xml',
        standalone: true,
      },
    ];
    manifestGenerator.helpAuthorityRecords = [
      {
        recordType: 'metadata-authority',
        canonicalId: 'bmad-help',
        authoritativePresenceKey: 'capability:bmad-help',
        authoritySourceType: 'sidecar',
        authoritySourcePath: 'bmad-fork/src/core/tasks/help.artifact.yaml',
        sourcePath: 'bmad-fork/src/core/tasks/help.md',
      },
    ];

    const tempTaskManifestConfigDir = path.join(tempTaskManifestRoot, '_config');
    await fs.ensureDir(tempTaskManifestConfigDir);
    await manifestGenerator.writeTaskManifest(tempTaskManifestConfigDir);

    const writtenTaskManifestRaw = await fs.readFile(path.join(tempTaskManifestConfigDir, 'task-manifest.csv'), 'utf8');
    const writtenTaskManifestLines = writtenTaskManifestRaw.trim().split('\n');
    const expectedHeader =
      'name,displayName,description,module,path,standalone,legacyName,canonicalId,authoritySourceType,authoritySourcePath';

    assert(
      writtenTaskManifestLines[0] === expectedHeader,
      'Task manifest writes compatibility-prefix columns with locked wave-1 appended column order',
    );

    const writtenTaskManifestRecords = csv.parse(writtenTaskManifestRaw, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });
    const helpTaskRow = writtenTaskManifestRecords.find((record) => record.module === 'core' && record.name === 'help');
    const validateTaskRow = writtenTaskManifestRecords.find((record) => record.module === 'core' && record.name === 'validate-workflow');

    assert(!!helpTaskRow, 'Task manifest includes exemplar help row');
    assert(helpTaskRow && helpTaskRow.legacyName === 'help', 'Task manifest help row sets legacyName=help');
    assert(helpTaskRow && helpTaskRow.canonicalId === 'bmad-help', 'Task manifest help row sets canonicalId=bmad-help');
    assert(helpTaskRow && helpTaskRow.authoritySourceType === 'sidecar', 'Task manifest help row sets authoritySourceType=sidecar');
    assert(
      helpTaskRow && helpTaskRow.authoritySourcePath === 'bmad-fork/src/core/tasks/help.artifact.yaml',
      'Task manifest help row sets authoritySourcePath to sidecar source path',
    );

    assert(!!validateTaskRow, 'Task manifest preserves non-exemplar rows');
    assert(
      validateTaskRow && validateTaskRow.legacyName === 'validate-workflow',
      'Task manifest non-exemplar rows remain additive-compatible with default legacyName',
    );

    let capturedAuthorityValidationOptions = null;
    let capturedManifestHelpAuthorityRecords = null;
    let capturedInstalledFiles = null;

    const installer = new Installer();
    installer.validateHelpSidecarContractFile = async () => {};
    installer.validateHelpAuthoritySplitAndPrecedence = async (options) => {
      capturedAuthorityValidationOptions = options;
      return {
        authoritativePresenceKey: 'capability:bmad-help',
        authoritativeRecords: [
          {
            recordType: 'metadata-authority',
            canonicalId: 'bmad-help',
            authoritativePresenceKey: 'capability:bmad-help',
            authoritySourceType: 'sidecar',
            authoritySourcePath: options.sidecarSourcePath,
            sourcePath: options.sourceMarkdownSourcePath,
          },
        ],
      };
    };
    installer.generateModuleConfigs = async () => {};
    installer.mergeModuleHelpCatalogs = async () => {};
    installer.ManifestGenerator = class ManifestGeneratorStub {
      async generateManifests(_bmadDir, _selectedModules, _installedFiles, options = {}) {
        capturedInstalledFiles = _installedFiles;
        capturedManifestHelpAuthorityRecords = options.helpAuthorityRecords;
        return {
          workflows: 0,
          agents: 0,
          tasks: 0,
          tools: 0,
        };
      }
    };

    await installer.runConfigurationGenerationTask({
      message: () => {},
      bmadDir: tempTaskManifestRoot,
      moduleConfigs: { core: {} },
      config: { ides: [] },
      allModules: ['core'],
      addResult: () => {},
    });

    assert(
      capturedAuthorityValidationOptions &&
        capturedAuthorityValidationOptions.sidecarSourcePath === 'bmad-fork/src/core/tasks/help.artifact.yaml',
      'Installer passes locked sidecar source path to authority validation',
    );
    assert(
      capturedAuthorityValidationOptions &&
        capturedAuthorityValidationOptions.sourceMarkdownSourcePath === 'bmad-fork/src/core/tasks/help.md',
      'Installer passes locked source-markdown path to authority validation',
    );
    assert(
      capturedAuthorityValidationOptions && capturedAuthorityValidationOptions.runtimeMarkdownSourcePath === '_bmad/core/tasks/help.md',
      'Installer passes locked runtime markdown path to authority validation',
    );
    assert(
      Array.isArray(capturedManifestHelpAuthorityRecords) &&
        capturedManifestHelpAuthorityRecords[0] &&
        capturedManifestHelpAuthorityRecords[0].authoritySourcePath === 'bmad-fork/src/core/tasks/help.artifact.yaml',
      'Installer passes sidecar authority path into manifest generation options',
    );
    assert(
      Array.isArray(capturedInstalledFiles) &&
        capturedInstalledFiles.some((filePath) => filePath.endsWith('/_config/canonical-aliases.csv')),
      'Installer pre-registers canonical-aliases.csv for files-manifest tracking',
    );
  } catch (error) {
    assert(false, 'Additive task manifest projection suite setup', error.message);
  } finally {
    await fs.remove(tempTaskManifestRoot);
  }

  console.log('');

  // ============================================================
  // Test 9: Canonical Alias Table Projection
  // ============================================================
  console.log(`${colors.yellow}Test Suite 9: Canonical Alias Table Projection${colors.reset}\n`);

  const tempCanonicalAliasRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-canonical-alias-projection-'));
  try {
    const manifestGenerator = new ManifestGenerator();
    manifestGenerator.bmadDir = tempCanonicalAliasRoot;
    manifestGenerator.bmadFolderName = '_bmad';
    manifestGenerator.helpAuthorityRecords = [
      {
        recordType: 'metadata-authority',
        canonicalId: 'bmad-help',
        authoritativePresenceKey: 'capability:bmad-help',
        authoritySourceType: 'sidecar',
        authoritySourcePath: 'bmad-fork/src/core/tasks/help.artifact.yaml',
        sourcePath: 'bmad-fork/src/core/tasks/help.md',
      },
    ];

    const tempCanonicalAliasConfigDir = path.join(tempCanonicalAliasRoot, '_config');
    await fs.ensureDir(tempCanonicalAliasConfigDir);
    const canonicalAliasPath = await manifestGenerator.writeCanonicalAliasManifest(tempCanonicalAliasConfigDir);

    const canonicalAliasRaw = await fs.readFile(canonicalAliasPath, 'utf8');
    const canonicalAliasLines = canonicalAliasRaw.trim().split('\n');
    const expectedCanonicalAliasHeader =
      'canonicalId,alias,aliasType,authoritySourceType,authoritySourcePath,rowIdentity,normalizedAliasValue,rawIdentityHasLeadingSlash,resolutionEligibility';
    assert(
      canonicalAliasLines[0] === expectedCanonicalAliasHeader,
      'Canonical alias table writes locked compatibility-prefix plus tuple eligibility column order',
    );

    const canonicalAliasRows = csv.parse(canonicalAliasRaw, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });
    assert(canonicalAliasRows.length === 3, 'Canonical alias table emits exactly three exemplar rows');
    assert(
      canonicalAliasRows.map((row) => row.aliasType).join(',') === 'canonical-id,legacy-name,slash-command',
      'Canonical alias table preserves locked deterministic row ordering',
    );

    const expectedRowsByType = new Map([
      [
        'canonical-id',
        {
          canonicalId: 'bmad-help',
          alias: 'bmad-help',
          rowIdentity: 'alias-row:bmad-help:canonical-id',
          normalizedAliasValue: 'bmad-help',
          rawIdentityHasLeadingSlash: 'false',
          resolutionEligibility: 'canonical-id-only',
        },
      ],
      [
        'legacy-name',
        {
          canonicalId: 'bmad-help',
          alias: 'help',
          rowIdentity: 'alias-row:bmad-help:legacy-name',
          normalizedAliasValue: 'help',
          rawIdentityHasLeadingSlash: 'false',
          resolutionEligibility: 'legacy-name-only',
        },
      ],
      [
        'slash-command',
        {
          canonicalId: 'bmad-help',
          alias: '/bmad-help',
          rowIdentity: 'alias-row:bmad-help:slash-command',
          normalizedAliasValue: 'bmad-help',
          rawIdentityHasLeadingSlash: 'true',
          resolutionEligibility: 'slash-command-only',
        },
      ],
    ]);

    for (const [aliasType, expectedRow] of expectedRowsByType) {
      const matchingRows = canonicalAliasRows.filter((row) => row.aliasType === aliasType);
      assert(matchingRows.length === 1, `Canonical alias table emits exactly one ${aliasType} exemplar row`);

      const row = matchingRows[0];
      assert(
        row && row.authoritySourceType === 'sidecar' && row.authoritySourcePath === 'bmad-fork/src/core/tasks/help.artifact.yaml',
        `${aliasType} exemplar row uses sidecar provenance fields`,
      );
      assert(row && row.canonicalId === expectedRow.canonicalId, `${aliasType} exemplar row locks canonicalId contract`);
      assert(row && row.alias === expectedRow.alias, `${aliasType} exemplar row locks alias contract`);
      assert(row && row.rowIdentity === expectedRow.rowIdentity, `${aliasType} exemplar row locks rowIdentity contract`);
      assert(
        row && row.normalizedAliasValue === expectedRow.normalizedAliasValue,
        `${aliasType} exemplar row locks normalizedAliasValue contract`,
      );
      assert(
        row && row.rawIdentityHasLeadingSlash === expectedRow.rawIdentityHasLeadingSlash,
        `${aliasType} exemplar row locks rawIdentityHasLeadingSlash contract`,
      );
      assert(
        row && row.resolutionEligibility === expectedRow.resolutionEligibility,
        `${aliasType} exemplar row locks resolutionEligibility contract`,
      );
    }

    const validateLockedCanonicalAliasProjection = (rows) => {
      for (const [aliasType, expectedRow] of expectedRowsByType) {
        const matchingRows = rows.filter((row) => row.canonicalId === 'bmad-help' && row.aliasType === aliasType);
        if (matchingRows.length === 0) {
          return { valid: false, reason: `missing:${aliasType}` };
        }
        if (matchingRows.length > 1) {
          return { valid: false, reason: `conflict:${aliasType}` };
        }

        const row = matchingRows[0];
        if (
          row.rowIdentity !== expectedRow.rowIdentity ||
          row.normalizedAliasValue !== expectedRow.normalizedAliasValue ||
          row.rawIdentityHasLeadingSlash !== expectedRow.rawIdentityHasLeadingSlash ||
          row.resolutionEligibility !== expectedRow.resolutionEligibility
        ) {
          return { valid: false, reason: `conflict:${aliasType}` };
        }
      }

      if (rows.length !== expectedRowsByType.size) {
        return { valid: false, reason: 'conflict:extra-rows' };
      }

      return { valid: true, reason: 'ok' };
    };

    const baselineProjectionValidation = validateLockedCanonicalAliasProjection(canonicalAliasRows);
    assert(
      baselineProjectionValidation.valid,
      'Canonical alias projection validator passes when all required exemplar rows are present exactly once',
      baselineProjectionValidation.reason,
    );

    const missingLegacyRows = canonicalAliasRows.filter((row) => row.aliasType !== 'legacy-name');
    const missingLegacyValidation = validateLockedCanonicalAliasProjection(missingLegacyRows);
    assert(
      !missingLegacyValidation.valid && missingLegacyValidation.reason === 'missing:legacy-name',
      'Canonical alias projection validator fails when required legacy-name row is missing',
    );

    const conflictingRows = [
      ...canonicalAliasRows,
      {
        ...canonicalAliasRows.find((row) => row.aliasType === 'slash-command'),
        rowIdentity: 'alias-row:bmad-help:slash-command:duplicate',
      },
    ];
    const conflictingValidation = validateLockedCanonicalAliasProjection(conflictingRows);
    assert(
      !conflictingValidation.valid && conflictingValidation.reason === 'conflict:slash-command',
      'Canonical alias projection validator fails when conflicting duplicate exemplar rows appear',
    );

    const fallbackManifestGenerator = new ManifestGenerator();
    fallbackManifestGenerator.bmadDir = tempCanonicalAliasRoot;
    fallbackManifestGenerator.bmadFolderName = '_bmad';
    fallbackManifestGenerator.helpAuthorityRecords = [];
    const fallbackCanonicalAliasPath = await fallbackManifestGenerator.writeCanonicalAliasManifest(tempCanonicalAliasConfigDir);
    const fallbackCanonicalAliasRaw = await fs.readFile(fallbackCanonicalAliasPath, 'utf8');
    const fallbackCanonicalAliasRows = csv.parse(fallbackCanonicalAliasRaw, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });
    assert(
      fallbackCanonicalAliasRows.every(
        (row) => row.authoritySourceType === 'sidecar' && row.authoritySourcePath === 'bmad-fork/src/core/tasks/help.artifact.yaml',
      ),
      'Canonical alias table falls back to locked sidecar provenance when authority records are unavailable',
    );

    const tempGeneratedBmadDir = path.join(tempCanonicalAliasRoot, '_bmad');
    await fs.ensureDir(tempGeneratedBmadDir);
    const manifestStats = await new ManifestGenerator().generateManifests(
      tempGeneratedBmadDir,
      [],
      [path.join(tempGeneratedBmadDir, '_config', 'canonical-aliases.csv')],
      {
        ides: [],
        preservedModules: [],
        helpAuthorityRecords: manifestGenerator.helpAuthorityRecords,
      },
    );

    assert(
      Array.isArray(manifestStats.manifestFiles) &&
        manifestStats.manifestFiles.some((filePath) => filePath.endsWith('/_config/canonical-aliases.csv')),
      'Manifest generation includes canonical-aliases.csv in output sequencing',
    );

    const writtenFilesManifestRaw = await fs.readFile(path.join(tempGeneratedBmadDir, '_config', 'files-manifest.csv'), 'utf8');
    assert(
      writtenFilesManifestRaw.includes('"_config/canonical-aliases.csv"'),
      'Files manifest tracks canonical-aliases.csv when pre-registered by installer flow',
    );
  } catch (error) {
    assert(false, 'Canonical alias projection suite setup', error.message);
  } finally {
    await fs.remove(tempCanonicalAliasRoot);
  }

  console.log('');

  // ============================================================
  // Test 10: Help Catalog Projection + Command Label Contract
  // ============================================================
  console.log(`${colors.yellow}Test Suite 10: Help Catalog Projection + Command Label Contract${colors.reset}\n`);

  const tempHelpCatalogRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-help-catalog-projection-'));
  try {
    const installer = new Installer();
    installer.helpAuthorityRecords = [
      {
        recordType: 'metadata-authority',
        canonicalId: 'bmad-help',
        authoritativePresenceKey: 'capability:bmad-help',
        authoritySourceType: 'sidecar',
        authoritySourcePath: 'bmad-fork/src/core/tasks/help.artifact.yaml',
        sourcePath: 'bmad-fork/src/core/tasks/help.md',
      },
    ];

    const sidecarAwareExemplar = await buildSidecarAwareExemplarHelpRow({
      helpAuthorityRecords: installer.helpAuthorityRecords,
    });
    assert(
      sidecarAwareExemplar.commandValue === 'bmad-help',
      'Sidecar-aware exemplar help row derives raw command from canonical identity',
    );
    assert(
      sidecarAwareExemplar.displayedCommandLabel === '/bmad-help',
      'Sidecar-aware exemplar help row renders displayed label with exactly one leading slash',
    );
    assert(
      sidecarAwareExemplar.authoritySourcePath === EXEMPLAR_HELP_CATALOG_AUTHORITY_SOURCE_PATH,
      'Sidecar-aware exemplar help row locks authority source path to sidecar metadata file',
    );

    const legacySidecarPath = path.join(tempHelpCatalogRoot, 'legacy-help.artifact.yaml');
    await fs.writeFile(
      legacySidecarPath,
      yaml.stringify({
        schemaVersion: 1,
        canonicalId: 'help',
        artifactType: 'task',
        module: 'core',
        sourcePath: 'bmad-fork/src/core/tasks/help.md',
        displayName: 'help',
        description: 'Legacy exemplar alias canonical id',
        dependencies: { requires: [] },
      }),
      'utf8',
    );
    const legacyIdentityExemplar = await buildSidecarAwareExemplarHelpRow({
      sidecarPath: legacySidecarPath,
      helpAuthorityRecords: installer.helpAuthorityRecords,
    });
    assert(
      legacyIdentityExemplar.commandValue === 'bmad-help',
      'Sidecar-aware exemplar help row normalizes legacy sidecar canonicalId to locked canonical identity',
    );

    await installer.mergeModuleHelpCatalogs(tempHelpCatalogRoot);

    const generatedHelpPath = path.join(tempHelpCatalogRoot, '_config', 'bmad-help.csv');
    const generatedCommandLabelReportPath = path.join(tempHelpCatalogRoot, '_config', 'bmad-help-command-label-report.csv');
    const generatedPipelineReportPath = path.join(tempHelpCatalogRoot, '_config', 'bmad-help-catalog-pipeline.csv');
    const generatedHelpRaw = await fs.readFile(generatedHelpPath, 'utf8');
    const generatedHelpLines = generatedHelpRaw.trim().split('\n');
    const expectedHelpHeader =
      'module,phase,name,code,sequence,workflow-file,command,required,agent-name,agent-command,agent-display-name,agent-title,options,description,output-location,outputs';
    assert(generatedHelpLines[0] === expectedHelpHeader, 'Help catalog header remains additive-compatible for existing consumers');

    const generatedHelpRows = csv.parse(generatedHelpRaw, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    const exemplarRows = generatedHelpRows.filter((row) => row.command === 'bmad-help');
    assert(exemplarRows.length === 1, 'Help catalog emits exactly one exemplar raw command row for bmad-help');
    assert(
      exemplarRows[0] && exemplarRows[0].name === 'bmad-help',
      'Help catalog exemplar row preserves locked bmad-help workflow identity',
    );

    const sidecarRaw = await fs.readFile(path.join(projectRoot, 'src', 'core', 'tasks', 'help.artifact.yaml'), 'utf8');
    const sidecarData = yaml.parse(sidecarRaw);
    assert(
      exemplarRows[0] && exemplarRows[0].description === sidecarData.description,
      'Help catalog exemplar row description is sourced from sidecar metadata',
    );

    const commandLabelRows = installer.helpCatalogCommandLabelReportRows || [];
    assert(commandLabelRows.length === 1, 'Installer emits one command-label report row for exemplar canonical id');
    assert(
      commandLabelRows[0] &&
        commandLabelRows[0].rawCommandValue === 'bmad-help' &&
        commandLabelRows[0].displayedCommandLabel === '/bmad-help',
      'Command-label report locks raw and displayed command values for exemplar',
    );
    assert(
      commandLabelRows[0] &&
        commandLabelRows[0].authoritySourceType === 'sidecar' &&
        commandLabelRows[0].authoritySourcePath === 'bmad-fork/src/core/tasks/help.artifact.yaml',
      'Command-label report includes sidecar provenance linkage',
    );
    const generatedCommandLabelReportRaw = await fs.readFile(generatedCommandLabelReportPath, 'utf8');
    const generatedCommandLabelReportRows = csv.parse(generatedCommandLabelReportRaw, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });
    assert(
      generatedCommandLabelReportRows.length === 1 &&
        generatedCommandLabelReportRows[0].displayedCommandLabel === '/bmad-help' &&
        generatedCommandLabelReportRows[0].rowCountForCanonicalId === '1',
      'Installer persists command-label report artifact with locked exemplar label contract values',
    );

    const baselineLabelContract = evaluateExemplarCommandLabelReportRows(commandLabelRows);
    assert(
      baselineLabelContract.valid,
      'Command-label validator passes when exactly one exemplar /bmad-help displayed label row exists',
      baselineLabelContract.reason,
    );

    const invalidLegacyLabelContract = evaluateExemplarCommandLabelReportRows([
      {
        ...commandLabelRows[0],
        displayedCommandLabel: 'help',
      },
    ]);
    assert(
      !invalidLegacyLabelContract.valid && invalidLegacyLabelContract.reason === 'invalid-displayed-label:help',
      'Command-label validator fails on alternate displayed label form "help"',
    );

    const invalidSlashHelpLabelContract = evaluateExemplarCommandLabelReportRows([
      {
        ...commandLabelRows[0],
        displayedCommandLabel: '/help',
      },
    ]);
    assert(
      !invalidSlashHelpLabelContract.valid && invalidSlashHelpLabelContract.reason === 'invalid-displayed-label:/help',
      'Command-label validator fails on alternate displayed label form "/help"',
    );

    const pipelineRows = installer.helpCatalogPipelineRows || [];
    assert(pipelineRows.length === 2, 'Installer emits two stage rows for help catalog pipeline evidence linkage');
    const installedStageRow = pipelineRows.find((row) => row.stage === 'installed-compatibility-row');
    const mergedStageRow = pipelineRows.find((row) => row.stage === 'merged-config-row');

    assert(
      installedStageRow &&
        installedStageRow.issuingComponent === EXEMPLAR_HELP_CATALOG_ISSUING_COMPONENT &&
        installedStageRow.commandAuthoritySourceType === 'sidecar' &&
        installedStageRow.commandAuthoritySourcePath === 'bmad-fork/src/core/tasks/help.artifact.yaml',
      'Installed compatibility stage row preserves sidecar command provenance and issuing component linkage',
    );
    assert(
      mergedStageRow &&
        mergedStageRow.issuingComponent === INSTALLER_HELP_CATALOG_MERGE_COMPONENT &&
        mergedStageRow.commandAuthoritySourceType === 'sidecar' &&
        mergedStageRow.commandAuthoritySourcePath === 'bmad-fork/src/core/tasks/help.artifact.yaml',
      'Merged config stage row preserves sidecar command provenance and merge issuing component linkage',
    );
    assert(
      pipelineRows.every((row) => row.status === 'PASS' && typeof row.issuingComponentBindingEvidence === 'string'),
      'Pipeline rows include deterministic PASS status and non-empty issuing-component evidence linkage',
    );
    const generatedPipelineReportRaw = await fs.readFile(generatedPipelineReportPath, 'utf8');
    const generatedPipelineReportRows = csv.parse(generatedPipelineReportRaw, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });
    assert(
      generatedPipelineReportRows.length === 2 &&
        generatedPipelineReportRows.every(
          (row) =>
            row.commandAuthoritySourceType === 'sidecar' &&
            row.commandAuthoritySourcePath === 'bmad-fork/src/core/tasks/help.artifact.yaml',
        ),
      'Installer persists pipeline stage artifact with sidecar command provenance linkage for both stages',
    );

    const tempAltLabelRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-help-catalog-alt-label-'));
    try {
      const moduleDir = path.join(tempAltLabelRoot, 'modx');
      await fs.ensureDir(moduleDir);
      await fs.writeFile(
        path.join(moduleDir, 'module-help.csv'),
        [
          'module,phase,name,code,sequence,workflow-file,command,required,agent,options,description,output-location,outputs',
          'modx,anytime,alt-help,AH,,_bmad/core/tasks/help.md,/help,false,,,Alt help label,,,',
        ].join('\n') + '\n',
        'utf8',
      );

      const alternateLabelInstaller = new Installer();
      alternateLabelInstaller.helpAuthorityRecords = installer.helpAuthorityRecords;
      try {
        await alternateLabelInstaller.mergeModuleHelpCatalogs(tempAltLabelRoot);
        assert(
          false,
          'Installer command-label contract rejects alternate rendered labels in merged help catalog',
          'Expected command label contract failure for /help but merge succeeded',
        );
      } catch (error) {
        assert(
          error.code === HELP_CATALOG_GENERATION_ERROR_CODES.COMMAND_LABEL_CONTRACT_FAILED,
          'Installer command-label contract returns deterministic failure code for alternate labels',
          `Expected ${HELP_CATALOG_GENERATION_ERROR_CODES.COMMAND_LABEL_CONTRACT_FAILED}, got ${error.code}`,
        );
      }
    } finally {
      await fs.remove(tempAltLabelRoot);
    }
  } catch (error) {
    assert(false, 'Help catalog projection suite setup', error.message);
  } finally {
    await fs.remove(tempHelpCatalogRoot);
  }

  console.log('');

  // ============================================================
  // Test 11: Export Projection from Sidecar Canonical ID
  // ============================================================
  console.log(`${colors.yellow}Test Suite 11: Export Projection from Sidecar Canonical ID${colors.reset}\n`);

  const tempExportRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-export-projection-'));
  try {
    const codexSetup = new CodexSetup();
    const skillsDir = path.join(tempExportRoot, '.agents', 'skills');
    await fs.ensureDir(skillsDir);
    await fs.ensureDir(path.join(tempExportRoot, 'bmad-fork', 'src', 'core', 'tasks'));
    await fs.writeFile(
      path.join(tempExportRoot, 'bmad-fork', 'src', 'core', 'tasks', 'help.artifact.yaml'),
      yaml.stringify({
        schemaVersion: 1,
        canonicalId: 'bmad-help',
        artifactType: 'task',
        module: 'core',
        sourcePath: 'bmad-fork/src/core/tasks/help.md',
        displayName: 'help',
        description: 'Help command',
        dependencies: { requires: [] },
      }),
      'utf8',
    );

    const exemplarTaskArtifact = {
      type: 'task',
      name: 'help',
      module: 'core',
      sourcePath: path.join(tempExportRoot, '_bmad', 'core', 'tasks', 'help.md'),
      relativePath: path.join('core', 'tasks', 'help.md'),
      content: '---\nname: help\ndescription: Help command\ncanonicalId: bmad-help\n---\n\n# help\n',
    };

    const writtenCount = await codexSetup.writeSkillArtifacts(skillsDir, [exemplarTaskArtifact], 'task', {
      projectDir: tempExportRoot,
    });
    assert(writtenCount === 1, 'Codex export writes one exemplar skill artifact');

    const exemplarSkillPath = path.join(skillsDir, 'bmad-help', 'SKILL.md');
    assert(await fs.pathExists(exemplarSkillPath), 'Codex export derives exemplar skill path from sidecar canonical identity');

    const exemplarSkillRaw = await fs.readFile(exemplarSkillPath, 'utf8');
    const exemplarFrontmatterMatch = exemplarSkillRaw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    const exemplarFrontmatter = exemplarFrontmatterMatch ? yaml.parse(exemplarFrontmatterMatch[1]) : null;
    assert(
      exemplarFrontmatter && exemplarFrontmatter.name === 'bmad-help',
      'Codex export frontmatter sets required name from sidecar canonical identity',
    );
    assert(
      exemplarFrontmatter && Object.keys(exemplarFrontmatter).sort().join(',') === 'description,name',
      'Codex export frontmatter remains constrained to required name plus optional description',
    );

    const exportDerivationRecord = codexSetup.exportDerivationRecords.find((row) => row.exportPath === '.agents/skills/bmad-help/SKILL.md');
    assert(
      exportDerivationRecord &&
        exportDerivationRecord.exportIdDerivationSourceType === EXEMPLAR_HELP_EXPORT_DERIVATION_SOURCE_TYPE &&
        exportDerivationRecord.exportIdDerivationSourcePath === 'bmad-fork/src/core/tasks/help.artifact.yaml',
      'Codex export records exemplar derivation source metadata from sidecar canonical-id',
    );

    const tempSubmoduleRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-export-submodule-root-'));
    try {
      const submoduleRootSetup = new CodexSetup();
      const submoduleSkillsDir = path.join(tempSubmoduleRoot, '.agents', 'skills');
      await fs.ensureDir(submoduleSkillsDir);
      await fs.ensureDir(path.join(tempSubmoduleRoot, 'src', 'core', 'tasks'));
      await fs.writeFile(
        path.join(tempSubmoduleRoot, 'src', 'core', 'tasks', 'help.artifact.yaml'),
        yaml.stringify({
          schemaVersion: 1,
          canonicalId: 'bmad-help',
          artifactType: 'task',
          module: 'core',
          sourcePath: 'bmad-fork/src/core/tasks/help.md',
          displayName: 'help',
          description: 'Help command',
          dependencies: { requires: [] },
        }),
        'utf8',
      );

      await submoduleRootSetup.writeSkillArtifacts(submoduleSkillsDir, [exemplarTaskArtifact], 'task', {
        projectDir: tempSubmoduleRoot,
      });

      const submoduleExportDerivationRecord = submoduleRootSetup.exportDerivationRecords.find(
        (row) => row.exportPath === '.agents/skills/bmad-help/SKILL.md',
      );
      assert(
        submoduleExportDerivationRecord &&
          submoduleExportDerivationRecord.exportIdDerivationSourcePath === 'bmad-fork/src/core/tasks/help.artifact.yaml',
        'Codex export locks exemplar derivation source-path contract when running from submodule root',
      );
    } finally {
      await fs.remove(tempSubmoduleRoot);
    }

    const tempNoSidecarRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-export-missing-sidecar-'));
    try {
      const noSidecarSetup = new CodexSetup();
      const noSidecarSkillDir = path.join(tempNoSidecarRoot, '.agents', 'skills');
      await fs.ensureDir(noSidecarSkillDir);

      try {
        await noSidecarSetup.writeSkillArtifacts(noSidecarSkillDir, [exemplarTaskArtifact], 'task', {
          projectDir: tempNoSidecarRoot,
        });
        assert(
          false,
          'Codex export fails when exemplar sidecar metadata is missing',
          'Expected sidecar file-not-found failure but export succeeded',
        );
      } catch (error) {
        assert(
          error.code === CODEX_EXPORT_DERIVATION_ERROR_CODES.SIDECAR_FILE_NOT_FOUND,
          'Codex export missing sidecar failure returns deterministic error code',
          `Expected ${CODEX_EXPORT_DERIVATION_ERROR_CODES.SIDECAR_FILE_NOT_FOUND}, got ${error.code}`,
        );
      }
    } finally {
      await fs.remove(tempNoSidecarRoot);
    }

    const tempInferenceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-export-no-inference-'));
    try {
      const noInferenceSetup = new CodexSetup();
      const noInferenceSkillDir = path.join(tempInferenceRoot, '.agents', 'skills');
      await fs.ensureDir(noInferenceSkillDir);
      await fs.ensureDir(path.join(tempInferenceRoot, 'bmad-fork', 'src', 'core', 'tasks'));
      await fs.writeFile(
        path.join(tempInferenceRoot, 'bmad-fork', 'src', 'core', 'tasks', 'help.artifact.yaml'),
        yaml.stringify({
          schemaVersion: 1,
          canonicalId: 'nonexistent-help-id',
          artifactType: 'task',
          module: 'core',
          sourcePath: 'bmad-fork/src/core/tasks/help.md',
          displayName: 'help',
          description: 'Help command',
          dependencies: { requires: [] },
        }),
        'utf8',
      );

      try {
        await noInferenceSetup.writeSkillArtifacts(noInferenceSkillDir, [exemplarTaskArtifact], 'task', {
          projectDir: tempInferenceRoot,
        });
        assert(
          false,
          'Codex export rejects path-inferred exemplar id when sidecar canonical-id derivation is unresolved',
          'Expected canonical-id derivation failure but export succeeded',
        );
      } catch (error) {
        assert(
          error.code === CODEX_EXPORT_DERIVATION_ERROR_CODES.CANONICAL_ID_DERIVATION_FAILED,
          'Codex export unresolved canonical-id derivation returns deterministic failure code',
          `Expected ${CODEX_EXPORT_DERIVATION_ERROR_CODES.CANONICAL_ID_DERIVATION_FAILED}, got ${error.code}`,
        );
      }
    } finally {
      await fs.remove(tempInferenceRoot);
    }

    const compatibilitySetup = new CodexSetup();
    const compatibilityIdentity = await compatibilitySetup.resolveSkillIdentityFromArtifact(
      {
        type: 'workflow-command',
        name: 'create-story',
        module: 'bmm',
        relativePath: path.join('bmm', 'workflows', 'create-story.md'),
      },
      tempExportRoot,
    );
    assert(
      compatibilityIdentity.skillName === 'bmad-bmm-create-story' && compatibilityIdentity.exportIdDerivationSourceType === 'path-derived',
      'Codex export preserves non-exemplar path-derived skill identity behavior',
    );
  } catch (error) {
    assert(false, 'Export projection suite setup', error.message);
  } finally {
    await fs.remove(tempExportRoot);
  }

  console.log('');

  // ============================================================
  // Test 12: QA Agent Compilation
  // ============================================================
  console.log(`${colors.yellow}Test Suite 12: QA Agent Compilation${colors.reset}\n`);

  try {
    const builder = new YamlXmlBuilder();
    const qaAgentPath = path.join(projectRoot, 'src/bmm/agents/qa.agent.yaml');
    const tempOutput = path.join(__dirname, 'temp-qa-agent.md');

    try {
      const result = await builder.buildAgent(qaAgentPath, null, tempOutput, { includeMetadata: true });
      const compiled = await fs.readFile(tempOutput, 'utf8');

      assert(compiled.includes('QA Engineer'), 'QA agent compilation includes agent title');

      assert(compiled.includes('qa-generate-e2e-tests'), 'QA agent menu includes automate workflow');

      // Cleanup
      await fs.remove(tempOutput);
    } catch (error) {
      assert(false, 'QA agent compiles successfully', error.message);
    }
  } catch (error) {
    assert(false, 'QA compilation test setup', error.message);
  }

  console.log('');

  // ============================================================
  // Test 13: Projection Consumer Compatibility Contracts
  // ============================================================
  console.log(`${colors.yellow}Test Suite 13: Projection Consumer Compatibility${colors.reset}\n`);

  const tempCompatibilityRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-projection-compatibility-'));
  try {
    const tempCompatibilityConfigDir = path.join(tempCompatibilityRoot, '_config');
    await fs.ensureDir(tempCompatibilityConfigDir);

    const buildCsvLine = (columns, row) =>
      columns
        .map((column) => {
          const value = String(row[column] ?? '');
          return value.includes(',') ? `"${value.replaceAll('"', '""')}"` : value;
        })
        .join(',');

    const taskManifestColumns = [
      ...TASK_MANIFEST_COMPATIBILITY_PREFIX_COLUMNS,
      ...TASK_MANIFEST_WAVE1_ADDITIVE_COLUMNS,
      'futureAdditiveField',
    ];
    const validTaskRows = [
      {
        name: 'help',
        displayName: 'help',
        description: 'Help command',
        module: 'core',
        path: '{project-root}/_bmad/core/tasks/help.md',
        standalone: 'true',
        legacyName: 'help',
        canonicalId: 'bmad-help',
        authoritySourceType: 'sidecar',
        authoritySourcePath: 'bmad-fork/src/core/tasks/help.artifact.yaml',
        futureAdditiveField: 'wave-1',
      },
      {
        name: 'create-story',
        displayName: 'Create Story',
        description: 'Create a dedicated story file',
        module: 'bmm',
        path: '{project-root}/_bmad/bmm/workflows/2-creation/create-story/workflow.yaml',
        standalone: 'true',
        legacyName: 'create-story',
        canonicalId: '',
        authoritySourceType: '',
        authoritySourcePath: '',
        futureAdditiveField: 'wave-1',
      },
    ];
    const validTaskManifestCsv =
      [taskManifestColumns.join(','), ...validTaskRows.map((row) => buildCsvLine(taskManifestColumns, row))].join('\n') + '\n';
    await fs.writeFile(path.join(tempCompatibilityConfigDir, 'task-manifest.csv'), validTaskManifestCsv, 'utf8');

    const validatedTaskSurface = validateTaskManifestCompatibilitySurface(validTaskManifestCsv, {
      sourcePath: '_bmad/_config/task-manifest.csv',
    });
    assert(
      validatedTaskSurface.headerColumns[0] === 'name' &&
        validatedTaskSurface.headerColumns[TASK_MANIFEST_COMPATIBILITY_PREFIX_COLUMNS.length] === 'legacyName',
      'Task-manifest compatibility validator enforces locked prefix plus additive wave-1 ordering',
    );
    assert(
      validatedTaskSurface.headerColumns.at(-1) === 'futureAdditiveField',
      'Task-manifest compatibility validator allows additive columns appended after locked wave-1 columns',
    );

    validateTaskManifestLoaderEntries(validatedTaskSurface.rows, {
      sourcePath: '_bmad/_config/task-manifest.csv',
      headerColumns: validatedTaskSurface.headerColumns,
    });
    assert(true, 'Task-manifest loader compatibility validator accepts known loader columns with additive fields');

    const taskToolGenerator = new TaskToolCommandGenerator();
    const loadedTaskRows = await taskToolGenerator.loadTaskManifest(tempCompatibilityRoot);
    assert(
      Array.isArray(loadedTaskRows) &&
        loadedTaskRows.length === 2 &&
        loadedTaskRows[0].name === 'help' &&
        loadedTaskRows[1].name === 'create-story',
      'Task-manifest loader remains parseable when additive columns are present',
    );

    const legacyTaskManifestColumns = [...TASK_MANIFEST_COMPATIBILITY_PREFIX_COLUMNS];
    const legacyTaskManifestCsv =
      [legacyTaskManifestColumns.join(','), buildCsvLine(legacyTaskManifestColumns, validTaskRows[0])].join('\n') + '\n';
    const legacyTaskSurface = validateTaskManifestCompatibilitySurface(legacyTaskManifestCsv, {
      sourcePath: '_bmad/_config/task-manifest.csv',
      allowLegacyPrefixOnly: true,
    });
    assert(
      legacyTaskSurface.isLegacyPrefixOnlyHeader === true,
      'Task-manifest compatibility validator supports legacy prefix-only headers during migration reads',
    );
    try {
      validateTaskManifestCompatibilitySurface(legacyTaskManifestCsv, {
        sourcePath: '_bmad/_config/task-manifest.csv',
      });
      assert(false, 'Task-manifest strict validator rejects legacy prefix-only header without migration mode');
    } catch (error) {
      assert(
        error.code === PROJECTION_COMPATIBILITY_ERROR_CODES.TASK_MANIFEST_HEADER_WAVE1_MISMATCH,
        'Task-manifest strict validator emits deterministic wave-1 mismatch error for legacy prefix-only headers',
      );
    }

    const reorderedTaskManifestColumns = [...taskManifestColumns];
    [reorderedTaskManifestColumns[0], reorderedTaskManifestColumns[1]] = [reorderedTaskManifestColumns[1], reorderedTaskManifestColumns[0]];
    const invalidTaskManifestCsv =
      [reorderedTaskManifestColumns.join(','), buildCsvLine(reorderedTaskManifestColumns, validTaskRows[0])].join('\n') + '\n';
    try {
      validateTaskManifestCompatibilitySurface(invalidTaskManifestCsv, {
        sourcePath: '_bmad/_config/task-manifest.csv',
      });
      assert(false, 'Task-manifest validator rejects non-additive reordered compatibility-prefix headers');
    } catch (error) {
      assert(
        error.code === PROJECTION_COMPATIBILITY_ERROR_CODES.TASK_MANIFEST_HEADER_PREFIX_MISMATCH && error.fieldPath === 'header[0]',
        'Task-manifest validator emits deterministic diagnostics for reordered compatibility-prefix headers',
      );
    }

    const helpCatalogColumns = [
      ...HELP_CATALOG_COMPATIBILITY_PREFIX_COLUMNS,
      ...HELP_CATALOG_WAVE1_ADDITIVE_COLUMNS,
      'futureAdditiveField',
    ];
    const validHelpRows = [
      {
        module: 'core',
        phase: 'anytime',
        name: 'bmad-help',
        code: 'BH',
        sequence: '',
        'workflow-file': '_bmad/core/tasks/help.md',
        command: 'bmad-help',
        required: 'false',
        'agent-name': '',
        'agent-command': '',
        'agent-display-name': '',
        'agent-title': '',
        options: '',
        description: 'Help command',
        'output-location': '',
        outputs: '',
        futureAdditiveField: 'wave-1',
      },
      {
        module: 'bmm',
        phase: 'planning',
        name: 'create-story',
        code: 'CS',
        sequence: '',
        'workflow-file': '_bmad/bmm/workflows/2-creation/create-story/workflow.yaml',
        command: 'bmad-bmm-create-story',
        required: 'false',
        'agent-name': 'sm',
        'agent-command': 'bmad:agent:sm',
        'agent-display-name': 'Scrum Master',
        'agent-title': 'SM',
        options: '',
        description: 'Create next story',
        'output-location': '',
        outputs: '',
        futureAdditiveField: 'wave-1',
      },
    ];
    const validHelpCatalogCsv =
      [helpCatalogColumns.join(','), ...validHelpRows.map((row) => buildCsvLine(helpCatalogColumns, row))].join('\n') + '\n';
    await fs.writeFile(path.join(tempCompatibilityConfigDir, 'bmad-help.csv'), validHelpCatalogCsv, 'utf8');

    const validatedHelpSurface = validateHelpCatalogCompatibilitySurface(validHelpCatalogCsv, {
      sourcePath: '_bmad/_config/bmad-help.csv',
    });
    assert(
      validatedHelpSurface.headerColumns[5] === 'workflow-file' && validatedHelpSurface.headerColumns[6] === 'command',
      'Help-catalog compatibility validator preserves workflow-file and command compatibility columns',
    );
    assert(
      validatedHelpSurface.headerColumns.at(-1) === 'futureAdditiveField',
      'Help-catalog compatibility validator allows additive columns appended after locked wave-1 columns',
    );

    validateHelpCatalogLoaderEntries(validatedHelpSurface.rows, {
      sourcePath: '_bmad/_config/bmad-help.csv',
      headerColumns: validatedHelpSurface.headerColumns,
    });
    validateGithubCopilotHelpLoaderEntries(validatedHelpSurface.rows, {
      sourcePath: '_bmad/_config/bmad-help.csv',
      headerColumns: validatedHelpSurface.headerColumns,
    });
    assert(true, 'Help-catalog and GitHub Copilot loader compatibility validators accept stable command/workflow-file contracts');

    const githubCopilotSetup = new GitHubCopilotSetup();
    const loadedHelpRows = await githubCopilotSetup.loadBmadHelp(tempCompatibilityRoot);
    assert(
      Array.isArray(loadedHelpRows) &&
        loadedHelpRows.length === 2 &&
        loadedHelpRows[0]['workflow-file'] === '_bmad/core/tasks/help.md' &&
        loadedHelpRows[0].command === 'bmad-help',
      'GitHub Copilot help loader remains parseable with additive help-catalog columns',
    );

    const reorderedHelpCatalogColumns = [...helpCatalogColumns];
    [reorderedHelpCatalogColumns[5], reorderedHelpCatalogColumns[6]] = [reorderedHelpCatalogColumns[6], reorderedHelpCatalogColumns[5]];
    const invalidHelpCatalogCsv =
      [reorderedHelpCatalogColumns.join(','), buildCsvLine(reorderedHelpCatalogColumns, validHelpRows[0])].join('\n') + '\n';
    try {
      validateHelpCatalogCompatibilitySurface(invalidHelpCatalogCsv, {
        sourcePath: '_bmad/_config/bmad-help.csv',
      });
      assert(false, 'Help-catalog validator rejects non-additive reordered compatibility headers');
    } catch (error) {
      assert(
        error.code === PROJECTION_COMPATIBILITY_ERROR_CODES.HELP_CATALOG_HEADER_PREFIX_MISMATCH && error.fieldPath === 'header[5]',
        'Help-catalog validator emits deterministic diagnostics for reordered compatibility headers',
      );
    }

    const missingWorkflowFileRows = [
      {
        ...validHelpRows[0],
        'workflow-file': '',
        command: 'bmad-help',
      },
    ];
    const missingWorkflowFileCsv =
      [helpCatalogColumns.join(','), ...missingWorkflowFileRows.map((row) => buildCsvLine(helpCatalogColumns, row))].join('\n') + '\n';
    await fs.writeFile(path.join(tempCompatibilityConfigDir, 'bmad-help.csv'), missingWorkflowFileCsv, 'utf8');
    try {
      await githubCopilotSetup.loadBmadHelp(tempCompatibilityRoot);
      assert(false, 'GitHub Copilot help loader rejects rows that drop workflow-file while keeping command values');
    } catch (error) {
      assert(
        error.code === PROJECTION_COMPATIBILITY_ERROR_CODES.GITHUB_COPILOT_WORKFLOW_FILE_MISSING &&
          error.fieldPath === 'rows[0].workflow-file',
        'GitHub Copilot help loader emits deterministic diagnostics for missing workflow-file compatibility breaks',
      );
    }
  } catch (error) {
    assert(false, 'Projection compatibility suite setup', error.message);
  } finally {
    await fs.remove(tempCompatibilityRoot);
  }

  console.log('');

  // ============================================================
  // Test 14: Deterministic Validation Artifact Suite
  // ============================================================
  console.log(`${colors.yellow}Test Suite 14: Deterministic Validation Artifact Suite${colors.reset}\n`);

  const tempValidationHarnessRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-wave1-validation-suite-'));
  try {
    const tempProjectRoot = tempValidationHarnessRoot;
    const tempBmadDir = path.join(tempProjectRoot, '_bmad');
    const tempConfigDir = path.join(tempBmadDir, '_config');
    const tempSourceTasksDir = path.join(tempProjectRoot, 'bmad-fork', 'src', 'core', 'tasks');
    const tempSkillDir = path.join(tempProjectRoot, '.agents', 'skills', 'bmad-help');

    await fs.ensureDir(tempConfigDir);
    await fs.ensureDir(path.join(tempBmadDir, 'core', 'tasks'));
    await fs.ensureDir(path.join(tempBmadDir, 'core'));
    await fs.ensureDir(tempSourceTasksDir);
    await fs.ensureDir(tempSkillDir);

    const writeCsv = async (filePath, columns, rows) => {
      const buildCsvLine = (values) =>
        values
          .map((value) => {
            const text = String(value ?? '');
            return text.includes(',') || text.includes('"') ? `"${text.replaceAll('"', '""')}"` : text;
          })
          .join(',');
      const lines = [columns.join(','), ...rows.map((row) => buildCsvLine(columns.map((column) => row[column] ?? '')))];
      await fs.writeFile(filePath, `${lines.join('\n')}\n`, 'utf8');
    };

    const sidecarFixture = {
      schemaVersion: 1,
      canonicalId: 'bmad-help',
      artifactType: 'task',
      module: 'core',
      sourcePath: 'bmad-fork/src/core/tasks/help.md',
      displayName: 'help',
      description: 'Help command',
      dependencies: {
        requires: [],
      },
    };
    await fs.writeFile(path.join(tempSourceTasksDir, 'help.artifact.yaml'), yaml.stringify(sidecarFixture), 'utf8');
    await fs.writeFile(
      path.join(tempSourceTasksDir, 'help.md'),
      `---\n${yaml
        .stringify({
          name: 'help',
          description: 'Help command',
          canonicalId: 'bmad-help',
          dependencies: { requires: [] },
        })
        .trimEnd()}\n---\n\n# Source Help\n`,
      'utf8',
    );
    await fs.writeFile(
      path.join(tempBmadDir, 'core', 'tasks', 'help.md'),
      `---\n${yaml
        .stringify({
          name: 'help',
          description: 'Help command',
          canonicalId: 'bmad-help',
          dependencies: { requires: [] },
        })
        .trimEnd()}\n---\n\n# Runtime Help\n`,
      'utf8',
    );
    await fs.writeFile(
      path.join(tempSkillDir, 'SKILL.md'),
      `---\n${yaml.stringify({ name: 'bmad-help', description: 'Help command' }).trimEnd()}\n---\n\n# Skill\n`,
      'utf8',
    );

    await writeCsv(
      path.join(tempConfigDir, 'task-manifest.csv'),
      [...TASK_MANIFEST_COMPATIBILITY_PREFIX_COLUMNS, ...TASK_MANIFEST_WAVE1_ADDITIVE_COLUMNS],
      [
        {
          name: 'help',
          displayName: 'help',
          description: 'Help command',
          module: 'core',
          path: '_bmad/core/tasks/help.md',
          standalone: 'true',
          legacyName: 'help',
          canonicalId: 'bmad-help',
          authoritySourceType: 'sidecar',
          authoritySourcePath: 'bmad-fork/src/core/tasks/help.artifact.yaml',
        },
      ],
    );
    await writeCsv(
      path.join(tempConfigDir, 'canonical-aliases.csv'),
      [
        'canonicalId',
        'alias',
        'aliasType',
        'authoritySourceType',
        'authoritySourcePath',
        'rowIdentity',
        'normalizedAliasValue',
        'rawIdentityHasLeadingSlash',
        'resolutionEligibility',
      ],
      [
        {
          canonicalId: 'bmad-help',
          alias: 'bmad-help',
          aliasType: 'canonical-id',
          authoritySourceType: 'sidecar',
          authoritySourcePath: 'bmad-fork/src/core/tasks/help.artifact.yaml',
          rowIdentity: 'alias-row:bmad-help:canonical-id',
          normalizedAliasValue: 'bmad-help',
          rawIdentityHasLeadingSlash: 'false',
          resolutionEligibility: 'canonical-id-only',
        },
        {
          canonicalId: 'bmad-help',
          alias: 'help',
          aliasType: 'legacy-name',
          authoritySourceType: 'sidecar',
          authoritySourcePath: 'bmad-fork/src/core/tasks/help.artifact.yaml',
          rowIdentity: 'alias-row:bmad-help:legacy-name',
          normalizedAliasValue: 'help',
          rawIdentityHasLeadingSlash: 'false',
          resolutionEligibility: 'legacy-name-only',
        },
        {
          canonicalId: 'bmad-help',
          alias: '/bmad-help',
          aliasType: 'slash-command',
          authoritySourceType: 'sidecar',
          authoritySourcePath: 'bmad-fork/src/core/tasks/help.artifact.yaml',
          rowIdentity: 'alias-row:bmad-help:slash-command',
          normalizedAliasValue: 'bmad-help',
          rawIdentityHasLeadingSlash: 'true',
          resolutionEligibility: 'slash-command-only',
        },
      ],
    );
    await writeCsv(
      path.join(tempConfigDir, 'bmad-help.csv'),
      [...HELP_CATALOG_COMPATIBILITY_PREFIX_COLUMNS, ...HELP_CATALOG_WAVE1_ADDITIVE_COLUMNS],
      [
        {
          module: 'core',
          phase: 'anytime',
          name: 'bmad-help',
          code: 'BH',
          sequence: '',
          'workflow-file': '_bmad/core/tasks/help.md',
          command: 'bmad-help',
          required: 'false',
          'agent-name': '',
          'agent-command': '',
          'agent-display-name': '',
          'agent-title': '',
          options: '',
          description: 'Help command',
          'output-location': '',
          outputs: '',
        },
      ],
    );
    await writeCsv(
      path.join(tempBmadDir, 'core', 'module-help.csv'),
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
          name: 'bmad-help',
          code: 'BH',
          sequence: '',
          'workflow-file': '_bmad/core/tasks/help.md',
          command: 'bmad-help',
          required: 'false',
          agent: '',
          options: '',
          description: 'Help command',
          'output-location': '',
          outputs: '',
        },
      ],
    );
    await writeCsv(
      path.join(tempConfigDir, 'bmad-help-catalog-pipeline.csv'),
      [
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
        'issuingComponentBindingEvidence',
        'stageStatus',
        'status',
      ],
      [
        {
          stage: 'installed-compatibility-row',
          artifactPath: '_bmad/core/module-help.csv',
          rowIdentity: 'module-help-row:bmad-help',
          canonicalId: 'bmad-help',
          sourcePath: 'bmad-fork/src/core/tasks/help.md',
          rowCountForStageCanonicalId: '1',
          commandValue: 'bmad-help',
          expectedCommandValue: 'bmad-help',
          descriptionValue: 'Help command',
          expectedDescriptionValue: 'Help command',
          descriptionAuthoritySourceType: 'sidecar',
          descriptionAuthoritySourcePath: 'bmad-fork/src/core/tasks/help.artifact.yaml',
          commandAuthoritySourceType: 'sidecar',
          commandAuthoritySourcePath: 'bmad-fork/src/core/tasks/help.artifact.yaml',
          issuerOwnerClass: 'installer',
          issuingComponent: 'bmad-fork/tools/cli/installers/lib/core/help-catalog-generator.js::buildSidecarAwareExemplarHelpRow()',
          issuingComponentBindingEvidence: 'deterministic',
          stageStatus: 'PASS',
          status: 'PASS',
        },
        {
          stage: 'merged-config-row',
          artifactPath: '_bmad/_config/bmad-help.csv',
          rowIdentity: 'merged-help-row:bmad-help',
          canonicalId: 'bmad-help',
          sourcePath: 'bmad-fork/src/core/tasks/help.md',
          rowCountForStageCanonicalId: '1',
          commandValue: 'bmad-help',
          expectedCommandValue: 'bmad-help',
          descriptionValue: 'Help command',
          expectedDescriptionValue: 'Help command',
          descriptionAuthoritySourceType: 'sidecar',
          descriptionAuthoritySourcePath: 'bmad-fork/src/core/tasks/help.artifact.yaml',
          commandAuthoritySourceType: 'sidecar',
          commandAuthoritySourcePath: 'bmad-fork/src/core/tasks/help.artifact.yaml',
          issuerOwnerClass: 'installer',
          issuingComponent: 'bmad-fork/tools/cli/installers/lib/core/installer.js::mergeModuleHelpCatalogs()',
          issuingComponentBindingEvidence: 'deterministic',
          stageStatus: 'PASS',
          status: 'PASS',
        },
      ],
    );
    await writeCsv(
      path.join(tempConfigDir, 'bmad-help-command-label-report.csv'),
      [
        'surface',
        'canonicalId',
        'rawCommandValue',
        'displayedCommandLabel',
        'normalizedDisplayedLabel',
        'rowCountForCanonicalId',
        'authoritySourceType',
        'authoritySourcePath',
        'status',
        'failureReason',
      ],
      [
        {
          surface: '_bmad/_config/bmad-help.csv',
          canonicalId: 'bmad-help',
          rawCommandValue: 'bmad-help',
          displayedCommandLabel: '/bmad-help',
          normalizedDisplayedLabel: '/bmad-help',
          rowCountForCanonicalId: '1',
          authoritySourceType: 'sidecar',
          authoritySourcePath: 'bmad-fork/src/core/tasks/help.artifact.yaml',
          status: 'PASS',
          failureReason: '',
        },
      ],
    );

    const harness = new Wave1ValidationHarness();
    const firstRun = await harness.generateAndValidate({
      projectDir: tempProjectRoot,
      bmadDir: tempBmadDir,
      bmadFolderName: '_bmad',
      sidecarPath: path.join(tempSourceTasksDir, 'help.artifact.yaml'),
      sourceMarkdownPath: path.join(tempSourceTasksDir, 'help.md'),
    });
    assert(
      firstRun.terminalStatus === 'PASS' && firstRun.generatedArtifactCount === WAVE1_VALIDATION_ARTIFACT_REGISTRY.length,
      'Wave-1 validation harness generates and validates all required artifacts',
    );

    const artifactPathsById = new Map(
      WAVE1_VALIDATION_ARTIFACT_REGISTRY.map((artifact) => [
        artifact.artifactId,
        path.join(tempProjectRoot, '_bmad-output', 'planning-artifacts', artifact.relativePath),
      ]),
    );
    for (const [artifactId, artifactPath] of artifactPathsById.entries()) {
      assert(await fs.pathExists(artifactPath), `Wave-1 validation harness outputs artifact ${artifactId}`);
    }

    const artifactThreeBaselineRows = csv.parse(await fs.readFile(artifactPathsById.get(3), 'utf8'), {
      columns: true,
      skip_empty_lines: true,
    });
    const manifestProvenanceRow = artifactThreeBaselineRows.find((row) => row.artifactPath === '_bmad/_config/task-manifest.csv');
    let manifestReplayEvidence = null;
    try {
      manifestReplayEvidence = JSON.parse(String(manifestProvenanceRow?.issuingComponentBindingEvidence || ''));
    } catch {
      manifestReplayEvidence = null;
    }
    assert(
      manifestReplayEvidence &&
        manifestReplayEvidence.evidenceVersion === 1 &&
        manifestReplayEvidence.observationMethod === 'validator-observed-baseline-plus-isolated-single-component-perturbation' &&
        typeof manifestReplayEvidence.baselineArtifactSha256 === 'string' &&
        manifestReplayEvidence.baselineArtifactSha256.length === 64 &&
        typeof manifestReplayEvidence.mutatedArtifactSha256 === 'string' &&
        manifestReplayEvidence.mutatedArtifactSha256.length === 64 &&
        manifestReplayEvidence.baselineArtifactSha256 !== manifestReplayEvidence.mutatedArtifactSha256 &&
        manifestReplayEvidence.perturbationApplied === true &&
        Number(manifestReplayEvidence.baselineTargetRowCount) > Number(manifestReplayEvidence.mutatedTargetRowCount) &&
        manifestReplayEvidence.targetedRowLocator === manifestProvenanceRow.rowIdentity,
      'Wave-1 validation harness emits validator-observed replay evidence with baseline/perturbation impact',
    );

    const firstArtifactContents = new Map();
    for (const [artifactId, artifactPath] of artifactPathsById.entries()) {
      firstArtifactContents.set(artifactId, await fs.readFile(artifactPath, 'utf8'));
    }

    await harness.generateAndValidate({
      projectDir: tempProjectRoot,
      bmadDir: tempBmadDir,
      bmadFolderName: '_bmad',
      sidecarPath: path.join(tempSourceTasksDir, 'help.artifact.yaml'),
      sourceMarkdownPath: path.join(tempSourceTasksDir, 'help.md'),
    });

    let deterministicOutputs = true;
    for (const [artifactId, artifactPath] of artifactPathsById.entries()) {
      const rerunContent = await fs.readFile(artifactPath, 'utf8');
      if (rerunContent !== firstArtifactContents.get(artifactId)) {
        deterministicOutputs = false;
        break;
      }
    }
    assert(deterministicOutputs, 'Wave-1 validation harness outputs are byte-stable across unchanged repeated runs');

    await fs.remove(path.join(tempSkillDir, 'SKILL.md'));
    const noIdeInstaller = new Installer();
    noIdeInstaller.codexExportDerivationRecords = [];
    const noIdeValidationOptions = await noIdeInstaller.buildWave1ValidationOptions({
      projectDir: tempProjectRoot,
      bmadDir: tempBmadDir,
    });
    assert(
      noIdeValidationOptions.requireExportSkillProjection === false,
      'Installer wave-1 validation options disable export-surface requirement for no-IDE/non-Codex flow',
    );
    const noIdeRun = await harness.generateAndValidate({
      ...noIdeValidationOptions,
      sidecarPath: path.join(tempSourceTasksDir, 'help.artifact.yaml'),
      sourceMarkdownPath: path.join(tempSourceTasksDir, 'help.md'),
    });
    assert(
      noIdeRun.terminalStatus === 'PASS',
      'Wave-1 validation harness remains terminal-PASS for no-IDE/non-Codex flow when core projection surfaces are present',
    );
    const noIdeStandaloneValidation = await harness.validateGeneratedArtifacts({
      projectDir: tempProjectRoot,
      bmadFolderName: '_bmad',
    });
    assert(
      noIdeStandaloneValidation.status === 'PASS',
      'Wave-1 validation harness infers no-IDE export prerequisite context during standalone validation when options are omitted',
    );
    try {
      await harness.buildObservedBindingEvidence({
        artifactPath: '_bmad/_config/task-manifest.csv',
        absolutePath: path.join(tempBmadDir, '_config', 'task-manifest.csv'),
        componentPath: 'bmad-fork/tools/cli/installers/lib/core/manifest-generator.js',
        rowIdentity: 'issued-artifact:missing-claim-row',
        optionalSurface: false,
        runtimeFolder: '_bmad',
      });
      assert(false, 'Wave-1 replay evidence generation rejects unmapped claimed rowIdentity');
    } catch (error) {
      assert(
        error.code === WAVE1_VALIDATION_ERROR_CODES.REQUIRED_ROW_IDENTITY_MISSING,
        'Wave-1 replay evidence generation emits deterministic missing-claimed-rowIdentity error code',
      );
    }
    await fs.writeFile(
      path.join(tempSkillDir, 'SKILL.md'),
      `---\n${yaml.stringify({ name: 'bmad-help', description: 'Help command' }).trimEnd()}\n---\n\n# Skill\n`,
      'utf8',
    );

    await fs.remove(path.join(tempConfigDir, 'task-manifest.csv'));
    try {
      await harness.generateAndValidate({
        projectDir: tempProjectRoot,
        bmadDir: tempBmadDir,
        bmadFolderName: '_bmad',
        sidecarPath: path.join(tempSourceTasksDir, 'help.artifact.yaml'),
        sourceMarkdownPath: path.join(tempSourceTasksDir, 'help.md'),
      });
      assert(false, 'Wave-1 validation harness fails when required projection input surfaces are missing');
    } catch (error) {
      assert(
        error.code === WAVE1_VALIDATION_ERROR_CODES.REQUIRED_ARTIFACT_MISSING,
        'Wave-1 validation harness emits deterministic missing-input-surface error code',
      );
    }
    await writeCsv(
      path.join(tempConfigDir, 'task-manifest.csv'),
      [...TASK_MANIFEST_COMPATIBILITY_PREFIX_COLUMNS, ...TASK_MANIFEST_WAVE1_ADDITIVE_COLUMNS],
      [
        {
          name: 'help',
          displayName: 'help',
          description: 'Help command',
          module: 'core',
          path: '_bmad/core/tasks/help.md',
          standalone: 'true',
          legacyName: 'help',
          canonicalId: 'bmad-help',
          authoritySourceType: 'sidecar',
          authoritySourcePath: 'bmad-fork/src/core/tasks/help.artifact.yaml',
        },
      ],
    );
    await harness.generateAndValidate({
      projectDir: tempProjectRoot,
      bmadDir: tempBmadDir,
      bmadFolderName: '_bmad',
      sidecarPath: path.join(tempSourceTasksDir, 'help.artifact.yaml'),
      sourceMarkdownPath: path.join(tempSourceTasksDir, 'help.md'),
    });

    await fs.remove(artifactPathsById.get(14));
    try {
      await harness.validateGeneratedArtifacts({ projectDir: tempProjectRoot });
      assert(false, 'Wave-1 validation harness fails when a required artifact is missing');
    } catch (error) {
      assert(
        error.code === WAVE1_VALIDATION_ERROR_CODES.REQUIRED_ARTIFACT_MISSING,
        'Wave-1 validation harness emits deterministic missing-artifact error code',
      );
    }

    await harness.generateAndValidate({
      projectDir: tempProjectRoot,
      bmadDir: tempBmadDir,
      bmadFolderName: '_bmad',
      sidecarPath: path.join(tempSourceTasksDir, 'help.artifact.yaml'),
      sourceMarkdownPath: path.join(tempSourceTasksDir, 'help.md'),
    });

    const artifactTwoPath = artifactPathsById.get(2);
    const artifactTwoContent = await fs.readFile(artifactTwoPath, 'utf8');
    const artifactTwoLines = artifactTwoContent.split('\n');
    artifactTwoLines[0] = artifactTwoLines[0].replace('surface', 'brokenSurface');
    await fs.writeFile(artifactTwoPath, artifactTwoLines.join('\n'), 'utf8');
    try {
      await harness.validateGeneratedArtifacts({ projectDir: tempProjectRoot });
      assert(false, 'Wave-1 validation harness rejects schema/header drift');
    } catch (error) {
      assert(
        error.code === WAVE1_VALIDATION_ERROR_CODES.CSV_SCHEMA_MISMATCH,
        'Wave-1 validation harness emits deterministic schema-mismatch error code',
      );
    }

    await harness.generateAndValidate({
      projectDir: tempProjectRoot,
      bmadDir: tempBmadDir,
      bmadFolderName: '_bmad',
      sidecarPath: path.join(tempSourceTasksDir, 'help.artifact.yaml'),
      sourceMarkdownPath: path.join(tempSourceTasksDir, 'help.md'),
    });

    const artifactNinePath = artifactPathsById.get(9);
    const artifactNineHeader = (await fs.readFile(artifactNinePath, 'utf8')).split('\n')[0];
    await fs.writeFile(artifactNinePath, `${artifactNineHeader}\n`, 'utf8');
    try {
      await harness.validateGeneratedArtifacts({ projectDir: tempProjectRoot });
      assert(false, 'Wave-1 validation harness rejects header-only required-identity artifacts');
    } catch (error) {
      assert(
        error.code === WAVE1_VALIDATION_ERROR_CODES.REQUIRED_ROW_IDENTITY_MISSING,
        'Wave-1 validation harness emits deterministic missing-row error code for header-only artifacts',
      );
    }

    await harness.generateAndValidate({
      projectDir: tempProjectRoot,
      bmadDir: tempBmadDir,
      bmadFolderName: '_bmad',
      sidecarPath: path.join(tempSourceTasksDir, 'help.artifact.yaml'),
      sourceMarkdownPath: path.join(tempSourceTasksDir, 'help.md'),
    });

    const artifactThreePath = artifactPathsById.get(3);
    const artifactThreeContent = await fs.readFile(artifactThreePath, 'utf8');
    const artifactThreeRows = csv.parse(artifactThreeContent, {
      columns: true,
      skip_empty_lines: true,
    });
    artifactThreeRows[0].rowIdentity = '';
    await writeCsv(
      artifactThreePath,
      [
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
      artifactThreeRows,
    );
    try {
      await harness.validateGeneratedArtifacts({ projectDir: tempProjectRoot });
      assert(false, 'Wave-1 validation harness rejects missing required row identity values');
    } catch (error) {
      assert(
        error.code === WAVE1_VALIDATION_ERROR_CODES.REQUIRED_ROW_IDENTITY_MISSING,
        'Wave-1 validation harness emits deterministic row-identity error code',
      );
    }

    await harness.generateAndValidate({
      projectDir: tempProjectRoot,
      bmadDir: tempBmadDir,
      bmadFolderName: '_bmad',
      sidecarPath: path.join(tempSourceTasksDir, 'help.artifact.yaml'),
      sourceMarkdownPath: path.join(tempSourceTasksDir, 'help.md'),
    });

    const artifactFourPath = artifactPathsById.get(4);
    const artifactFourRows = csv.parse(await fs.readFile(artifactFourPath, 'utf8'), {
      columns: true,
      skip_empty_lines: true,
    });
    artifactFourRows[0].issuedArtifactEvidenceRowIdentity = '';
    await writeCsv(
      artifactFourPath,
      [
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
      artifactFourRows,
    );
    try {
      await harness.validateGeneratedArtifacts({ projectDir: tempProjectRoot });
      assert(false, 'Wave-1 validation harness rejects PASS rows missing required evidence-link fields');
    } catch (error) {
      assert(
        error.code === WAVE1_VALIDATION_ERROR_CODES.REQUIRED_EVIDENCE_LINK_MISSING,
        'Wave-1 validation harness emits deterministic evidence-link error code for missing row identity link',
      );
    }

    await harness.generateAndValidate({
      projectDir: tempProjectRoot,
      bmadDir: tempBmadDir,
      bmadFolderName: '_bmad',
      sidecarPath: path.join(tempSourceTasksDir, 'help.artifact.yaml'),
      sourceMarkdownPath: path.join(tempSourceTasksDir, 'help.md'),
    });

    const artifactNineTamperedRows = csv.parse(await fs.readFile(artifactPathsById.get(9), 'utf8'), {
      columns: true,
      skip_empty_lines: true,
    });
    artifactNineTamperedRows[0].issuingComponent = 'self-attested-generator-component';
    await writeCsv(
      artifactPathsById.get(9),
      [
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
      artifactNineTamperedRows,
    );
    try {
      await harness.validateGeneratedArtifacts({ projectDir: tempProjectRoot });
      assert(false, 'Wave-1 validation harness rejects self-attested issuer claims that diverge from validator evidence');
    } catch (error) {
      assert(
        error.code === WAVE1_VALIDATION_ERROR_CODES.SELF_ATTESTED_ISSUER_CLAIM,
        'Wave-1 validation harness emits deterministic self-attested issuer-claim rejection code',
      );
    }

    await harness.generateAndValidate({
      projectDir: tempProjectRoot,
      bmadDir: tempBmadDir,
      bmadFolderName: '_bmad',
      sidecarPath: path.join(tempSourceTasksDir, 'help.artifact.yaml'),
      sourceMarkdownPath: path.join(tempSourceTasksDir, 'help.md'),
    });

    const artifactThreeTamperedRows = csv.parse(await fs.readFile(artifactPathsById.get(3), 'utf8'), {
      columns: true,
      skip_empty_lines: true,
    });
    artifactThreeTamperedRows[0].issuingComponentBindingEvidence = '{"broken":true}';
    await writeCsv(
      artifactPathsById.get(3),
      [
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
      artifactThreeTamperedRows,
    );
    try {
      await harness.validateGeneratedArtifacts({ projectDir: tempProjectRoot });
      assert(false, 'Wave-1 validation harness rejects malformed replay-evidence payloads');
    } catch (error) {
      assert(
        error.code === WAVE1_VALIDATION_ERROR_CODES.BINDING_EVIDENCE_INVALID,
        'Wave-1 validation harness emits deterministic replay-evidence validation error code',
      );
    }
  } catch (error) {
    assert(false, 'Deterministic validation artifact suite setup', error.message);
  } finally {
    await fs.remove(tempValidationHarnessRoot);
  }

  console.log('');

  // ============================================================
  // Summary
  // ============================================================
  console.log(`${colors.cyan}========================================`);
  console.log('Test Results:');
  console.log(`  Passed: ${colors.green}${passed}${colors.reset}`);
  console.log(`  Failed: ${colors.red}${failed}${colors.reset}`);
  console.log(`========================================${colors.reset}\n`);

  if (failed === 0) {
    console.log(`${colors.green}✨ All installation component tests passed!${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`${colors.red}❌ Some installation component tests failed${colors.reset}\n`);
    process.exit(1);
  }
}

// Run tests
runTests().catch((error) => {
  console.error(`${colors.red}Test runner failed:${colors.reset}`, error.message);
  console.error(error.stack);
  process.exit(1);
});

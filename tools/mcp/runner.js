const fs = require('node:fs');
const path = require('node:path');
const process = require('node:process');
const YAML = require('js-yaml');
const { ChromeDevToolsMcpClient } = require('./chrome-devtools-client');

function resolveArtifactDir(explicitDir) {
  const baseDir =
    explicitDir ??
    process.env.ARTIFACTS_DIR ??
    path.join(process.cwd(), 'artifacts', 'latest');
  const dir = path.join(baseDir, 'frontend');
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function slugify(value) {
  if (!value) {
    return '';
  }

  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 64);
}

function titleCase(value) {
  if (!value) {
    return '';
  }

  return value
    .replace(/[-_]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function ensureSpecReportDir(baseDir) {
  const dir = path.join(baseDir, 'reports');
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function renderStepLine(step) {
  const checkbox = step.status === 'passed' ? '[x]' : '[ ]';
  const description =
    step.step.description ??
    `${step.step.tool} ${JSON.stringify(step.step.params ?? {})}`;
  return `- ${checkbox} ${description}`;
}

function writeSpecMarkdown(result, artifactDir) {
  const reportDir = ensureSpecReportDir(artifactDir);
  const slugSource = result.spec.id ?? result.spec.name ?? 'spec';
  const slug = slugify(slugSource) || 'spec';
  const reportPath = path.join(reportDir, `${slug}.md`);

  const lines = [
    `# ${result.spec.name ?? slugSource}`,
    '',
    `- **Spec ID:** ${result.spec.id ?? 'n/a'}`,
    `- **Status:** ${result.status === 'passed' ? '✅ Passed' : '❌ Failed'}`,
    `- **Expected Status:** ${result.spec.expectedStatus ?? 'passing'}`,
    `- **Route:** ${result.spec.category ?? 'n/a'}`,
    `- **Role:** ${result.spec.role ?? 'n/a'}`,
    `- **Duration:** ${result.durationMs}ms`,
    '',
    result.spec.description ? `${result.spec.description}\n` : '',
    '## Steps',
    '',
  ];

  for (const step of result.steps) {
    lines.push(renderStepLine(step));
    if (step.message) {
      lines.push(`  ↳ ${step.message}`);
    }
    if (step.response?.text) {
      lines.push(`  ↳ Response: ${step.response.text}`);
    }
  }

  fs.writeFileSync(reportPath, lines.filter(Boolean).join('\n'));
}

function flattenStructuredContent(content) {
  if (content === undefined || content === null) {
    return '';
  }
  if (typeof content === 'string') {
    return content;
  }
  if (Array.isArray(content)) {
    return content
      .map((entry) => flattenStructuredContent(entry))
      .filter(Boolean)
      .join('\n');
  }
  if (typeof content === 'object') {
    if ('text' in content) {
      const value = content.text;
      if (typeof value === 'string') {
        return value;
      }
    }
    return JSON.stringify(content, null, 2);
  }
  return String(content);
}

function collectToolResponse(result) {
  const structured = result?.structuredContent ?? result?.content ?? null;
  const text = flattenStructuredContent(structured);
  return {
    raw: result,
    structured,
    text,
  };
}

function assertExpectation(expectation, response) {
  switch (expectation?.type) {
    case 'textIncludes':
      return response.text.includes(expectation.value)
        ? undefined
        : `Expected response text to include "${expectation.value}"`;
    case 'textNotIncludes':
      return response.text.includes(expectation.value)
        ? `Expected response text to exclude "${expectation.value}"`
        : undefined;
    case 'equals':
      return response.text.trim() === (expectation.value ?? '').trim()
        ? undefined
        : `Expected exact match.\nExpected: ${expectation.value}\nActual: ${response.text}`;
    case 'structuredMatches': {
      const actual = JSON.stringify(response.structured, null, 2);
      const expected = (expectation.value ?? '').trim();
      return actual === expected
        ? undefined
        : `Structured payload mismatch.\nExpected: ${expected}\nActual: ${actual}`;
    }
    case undefined:
      return undefined;
    default:
      return `Unsupported expectation type: ${expectation.type}`;
  }
}

function loadSpecFile(specPath, overrides = {}) {
  const yamlText = fs.readFileSync(specPath, 'utf-8');
  const data = YAML.load(yamlText) || {};

  if (!data.id) {
    const slugSource = overrides.slugSource ?? path.basename(specPath);
    data.id = slugify(slugSource.replace(/\.[^.]+$/, ''));
  }
  if (!data.name) {
    data.name = titleCase(data.id);
  }
  if (overrides.category && !data.category) {
    data.category = overrides.category;
  }
  if (overrides.role && !data.role) {
    data.role = overrides.role;
  }
  if (overrides.description && !data.description) {
    data.description = overrides.description;
  }
  if (overrides.expectedStatus && !data.expectedStatus) {
    data.expectedStatus = overrides.expectedStatus;
  }

  if (!Array.isArray(data.steps)) {
    throw new Error(`Spec ${specPath} missing steps array`);
  }

  return data;
}

function loadSpecsFromManifest(manifestPath, options = {}) {
  const projectRoot = options.projectRoot ?? process.cwd();
  const manifestRaw = fs.readFileSync(manifestPath, 'utf-8');
  let manifest;
  if (manifestPath.endsWith('.yaml') || manifestPath.endsWith('.yml')) {
    manifest = YAML.load(manifestRaw) || {};
  } else {
    manifest = JSON.parse(manifestRaw);
  }

  const manifestSpecs = [];
  for (const batch of manifest?.batches ?? []) {
    if (options.filter?.batch && options.filter.batch !== batch.id) {
      continue;
    }

    const scenarioCategory = batch.category ?? titleCase(batch.id);
    for (const scenario of batch.scenarios ?? []) {
      if (
        options.filter?.scenario &&
        options.filter.scenario !== scenario.id
      ) {
        continue;
      }

      const scenarioPath = path.isAbsolute(scenario.file)
        ? scenario.file
        : path.join(projectRoot, scenario.file);
      if (!fs.existsSync(scenarioPath)) {
        console.warn(`⚠️  Manifest referenced spec not found: ${scenario.file}`);
        continue;
      }

      const spec = loadSpecFile(scenarioPath, {
        slugSource: scenario.id || path.basename(scenarioPath),
        category: scenario.category ?? scenarioCategory,
        role: scenario.role,
        description: scenario.description,
        expectedStatus: scenario.expectedStatus,
      });

      manifestSpecs.push(spec);
    }
  }

  return manifestSpecs;
}

function resolveMcpOptionsFromEnv() {
  const artifactsBase = process.env.ARTIFACTS_DIR
    ? path.resolve(process.env.ARTIFACTS_DIR)
    : path.join(process.cwd(), 'artifacts', 'latest');
  fs.mkdirSync(artifactsBase, { recursive: true });

  return {
    headless:
      process.env.MCP_HEADLESS !== undefined
        ? process.env.MCP_HEADLESS !== 'false'
        : true,
    isolated:
      process.env.MCP_ISOLATED !== undefined
        ? process.env.MCP_ISOLATED !== 'false'
        : true,
    channel: process.env.MCP_CHANNEL || undefined,
    viewport: process.env.MCP_VIEWPORT || '1280x720',
    browserUrl: process.env.MCP_BROWSER_URL || undefined,
    acceptInsecureCerts: process.env.MCP_ACCEPT_INSECURE_CERTS === 'true',
    executablePath: process.env.MCP_EXECUTABLE_PATH || undefined,
    extraChromeArgs: process.env.MCP_CHROME_ARGS
      ? process.env.MCP_CHROME_ARGS.split(/\s+/).filter(Boolean)
      : undefined,
    logFile: path.join(artifactsBase, 'chrome-devtools-mcp.log'),
    env: { ...process.env },
    cwd: process.cwd(),
  };
}

async function delay(ms) {
  if (!ms || ms <= 0) {
    return;
  }
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function runSpec(client, spec, artifactDir) {
  const startedAt = new Date();
  const stepResults = [];
  let specFailed = false;

  for (const step of spec.steps) {
    const stepStart = new Date();
    try {
      const response = collectToolResponse(
        await client.callTool(step.tool, step.params ?? {}),
      );
      const expectationMessage = step.expect
        ? assertExpectation(step.expect, response)
        : undefined;
      const stepEnd = new Date();
      stepResults.push({
        step,
        status: expectationMessage ? 'failed' : 'passed',
        startTime: stepStart.toISOString(),
        endTime: stepEnd.toISOString(),
        durationMs: stepEnd.getTime() - stepStart.getTime(),
        response,
        message: expectationMessage,
      });
      if (expectationMessage) {
        specFailed = true;
      }
    } catch (error) {
      const stepEnd = new Date();
      stepResults.push({
        step,
        status: 'failed',
        startTime: stepStart.toISOString(),
        endTime: stepEnd.toISOString(),
        durationMs: stepEnd.getTime() - stepStart.getTime(),
        message:
          error && typeof error.stack === 'string'
            ? error.stack
            : error && error.message
            ? error.message
            : String(error),
      });
      specFailed = true;
    }

    await delay(step.waitAfterMs);
  }

  const completedAt = new Date();
  const result = {
    spec,
    status: specFailed ? 'failed' : 'passed',
    steps: stepResults,
    startedAt: startedAt.toISOString(),
    completedAt: completedAt.toISOString(),
    durationMs: completedAt.getTime() - startedAt.getTime(),
    expectedStatus: spec.expectedStatus,
  };

  const fileName = path.join(artifactDir, `${slugify(spec.id)}.json`);
  fs.writeFileSync(fileName, JSON.stringify(result, null, 2));
  return result;
}

async function executeSpecs(specs, options = {}) {
  if (!specs.length) {
    throw new Error('No MCP specs found to execute.');
  }

  const artifactDir = resolveArtifactDir(options.artifactDir);
  const clientOptions = options.clientOptions ?? {};
  const client = new ChromeDevToolsMcpClient(clientOptions);
  const summaryPath = path.join(artifactDir, 'summary.json');
  const summary = [];

  console.log('⚙️  Connecting to chrome-devtools-mcp...');
  await client.connect();
  console.log('✅ Connected to chrome-devtools-mcp.');

  try {
    for (const spec of specs) {
      console.log(`\n▶️  ${spec.name}`);
      const result = await runSpec(client, spec, artifactDir);
      summary.push(result);
      writeSpecMarkdown(result, artifactDir);
      const statusEmoji =
        result.status === 'passed'
          ? '✅'
          : result.spec.expectedStatus === 'failing'
          ? '⚠️'
          : '❌';
      console.log(
        `${statusEmoji} ${spec.name} (${result.steps.length} steps) - ${result.status}`,
      );
      for (const step of result.steps) {
        const stepEmoji = step.status === 'passed' ? '  ✓' : '  ✗';
        const description =
          step.step.description ??
          `${step.step.tool} ${JSON.stringify(step.step.params ?? {})}`;
        console.log(`${stepEmoji} ${description}`);
        if (step.message) {
          console.log(`      ↳ ${step.message}`);
        }
      }
    }
  } finally {
    await client.disconnect();
  }

  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

  const hasBlockingFailures = summary.some((result) => {
    if (result.status === 'passed') {
      return false;
    }
    if (result.spec.expectedStatus === 'failing') {
      return false;
    }
    return true;
  });

  if (hasBlockingFailures) {
    console.error(
      '\n❌ One or more MCP specs failed. See artifacts for details.',
    );
    return { summary, artifactDir, status: 'failed' };
  }

  console.log('\n✅ MCP spec execution completed.');
  return { summary, artifactDir, status: 'passed' };
}

async function executeManifest(manifestPath, options = {}) {
  const specs = loadSpecsFromManifest(manifestPath, {
    projectRoot: options.projectRoot,
    filter: options.filter,
  });

  if (!specs.length) {
    throw new Error(`Manifest ${manifestPath} did not resolve to any specs.`);
  }

  return executeSpecs(specs, options);
}

function loadSpecFromFile(specPath) {
  return loadSpecFile(specPath, { slugSource: path.basename(specPath) });
}

module.exports = {
  resolveArtifactDir,
  resolveMcpOptionsFromEnv,
  collectToolResponse,
  assertExpectation,
  executeManifest,
  executeSpecs,
  loadSpecFromFile,
  runSpec,
  ChromeDevToolsMcpClient,
};

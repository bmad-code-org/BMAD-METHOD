import childProcess from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const mode = process.argv[2] ?? 'audit';
if (!['create', 'update', 'audit'].includes(mode))
  throw new Error('Usage: node tools/apf/project-contract.mjs <create|update|audit> [root]');
const root = path.resolve(process.argv[3] ?? process.cwd());
const sourceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const ignored = new Set(['.agents', '.apf', '.codex', '.git', 'node_modules', 'dist', 'build', '.next', 'coverage', 'vendor']);
const generatedStart = '<!-- APF:GENERATED:START -->';
const generatedEnd = '<!-- APF:GENERATED:END -->';

function files(directory, depth = 0) {
  if (depth > 2) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (ignored.has(entry.name)) return [];
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? files(file, depth + 1) : [file];
  });
}

function git(command) {
  try {
    return childProcess.execFileSync('git', command, { cwd: root, encoding: 'utf8' }).trim();
  } catch {
    return 'unknown';
  }
}

function commandMap(packageJson) {
  const scripts = packageJson?.scripts ?? {};
  return Object.fromEntries(
    Object.entries(scripts).filter(([name]) => /^(dev|build|lint|test|typecheck|check|quality|validate)/.test(name)),
  );
}

function discover() {
  const packageFile = path.join(root, 'package.json');
  const packageJson = fs.existsSync(packageFile) ? JSON.parse(fs.readFileSync(packageFile, 'utf8')) : null;
  const directories = fs
    .readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !ignored.has(entry.name))
    .filter((entry) => entry.name !== 'docs' || fs.readdirSync(path.join(root, entry.name)).some((child) => child !== 'ai'))
    .map((entry) => entry.name)
    .sort();
  const workspaceFiles = files(root)
    .map((file) => path.relative(root, file))
    .filter((file) => !file.startsWith('docs/ai/') && file !== 'AGENTS.md')
    .filter((file) => /(^|\/)(package\.json|pnpm-workspace\.yaml|turbo\.json|docker-compose\.ya?ml|AGENTS\.md)$/.test(file));
  return {
    schema_version: 1,
    generated_at: git(['show', '-s', '--format=%cI', 'HEAD']),
    repository: {
      commit: git(['rev-parse', 'HEAD']),
      layout: directories,
      package_manager: fs.existsSync(path.join(root, 'pnpm-lock.yaml'))
        ? 'pnpm'
        : fs.existsSync(path.join(root, 'package-lock.json'))
          ? 'npm'
          : 'unknown',
    },
    commands: commandMap(packageJson),
    sources: workspaceFiles.sort(),
    rules: [
      { id: 'R-001', status: 'observed', statement: 'Repository layout and commands are generated from tracked local files.' },
      {
        id: 'R-002',
        status: 'unknown',
        statement: 'Architectural conflicts require an owner decision; generation does not normalize them.',
      },
    ],
  };
}

function generatedAgents(contract) {
  const commandLines =
    Object.entries(contract.commands)
      .map(([name, command]) => `- ${name}: \`${command}\``)
      .join('\n') || '- No recognised commands discovered.';
  return `${generatedStart}\n# APF Project Guidance\n\n## Repository map\n\n- Top-level directories: ${contract.repository.layout.join(', ') || 'none'}\n\n## Commands\n\n${commandLines}\n\n## Execution policy\n\n- Use the smallest safe process.\n- Do not create a spec for patch or focused work.\n- Use targeted verification unless risk requires more.\n- Read project references only when relevant to the task.\n${generatedEnd}`;
}

function replaceGenerated(existing, generated) {
  const matcher = new RegExp(`${generatedStart}[\\s\\S]*?${generatedEnd}`);
  return matcher.test(existing) ? existing.replace(matcher, generated) : `${generated}\n\n${existing}`.trimEnd() + '\n';
}

function writeIfChanged(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== content) fs.writeFileSync(file, content);
}

function writeProjectSkills() {
  const names = ['project-change-ui', 'project-add-feature', 'project-modify-auth'];
  for (const name of names) {
    const source = path.join(sourceRoot, 'expansion-packs/ai-product-factory/templates/project-skills', name, 'SKILL.md');
    if (fs.existsSync(source)) writeIfChanged(path.join(root, '.agents/skills', name, 'SKILL.md'), fs.readFileSync(source, 'utf8'));
  }
  return names;
}

const contract = discover();
const contractPath = path.join(root, '.apf', 'project-contract.yaml');
const agentsPath = path.join(root, 'AGENTS.md');
const expected = yaml.dump(contract, { lineWidth: 120, noRefs: true, sortKeys: false });
const existing = fs.existsSync(contractPath) ? fs.readFileSync(contractPath, 'utf8') : null;
if (mode === 'audit') {
  const result = existing === expected ? 'in-sync' : existing ? 'drift-detected' : 'missing';
  console.log(yaml.dump({ mode, status: result, contract: path.relative(root, contractPath), repository_modifications: false }));
  process.exit(result === 'in-sync' ? 0 : 2);
}
writeIfChanged(contractPath, expected);
const currentAgents = fs.existsSync(agentsPath) ? fs.readFileSync(agentsPath, 'utf8') : '';
writeIfChanged(agentsPath, replaceGenerated(currentAgents, generatedAgents(contract)));
const docsDir = path.join(root, 'docs', 'ai');
writeIfChanged(
  path.join(docsDir, 'project-map.md'),
  `# Project Map\n\nGenerated from commit \`${contract.repository.commit}\`.\n\n- Top-level directories: ${contract.repository.layout.join(', ') || 'none'}\n`,
);
writeIfChanged(
  path.join(docsDir, 'known-deviations.md'),
  '# Known Deviations\n\nNo architectural conflict is silently normalized. Record an owner decision here before treating a conflicting pattern as canonical.\n',
);
writeIfChanged(
  path.join(docsDir, 'bmad-project-context.md'),
  `# BMAD Project Context\n\nCanonical APF contract: \`.apf/project-contract.yaml\`.\n\nRepository commit: \`${contract.repository.commit}\`.\n`,
);
writeIfChanged(path.join(root, '.codex/config.toml'), '[apf]\nexecution_adapter = "codex"\ndefault_task_mode = "auto"\n');
const skills = writeProjectSkills();
writeIfChanged(
  path.join(root, '.apf/hashes.yaml'),
  yaml.dump({ contract_sha256: createHash('sha256').update(expected).digest('hex'), generated_skills: skills }),
);
console.log(
  yaml.dump({
    mode,
    status: 'generated',
    contract: path.relative(root, contractPath),
    agents: path.relative(root, agentsPath),
    skills,
  }),
);

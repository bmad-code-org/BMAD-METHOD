/**
 * Spike: Convert subagent Markdown (frontmatter + sections) into BMAD *.agent.yaml
 *
 * Usage:
 *   node tools/cli/spikes/convert-subagent-md.js subagentic/claude-subagents/agents/master.md \
 *     src/modules/subagentic/agents/master.agent.yaml
 */

const fs = require('node:fs');
const path = require('node:path');
const yaml = require('js-yaml');

function readFile(p) {
  return fs.readFileSync(p, 'utf8');
}

function writeFile(p, content) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content, 'utf8');
}

function parseFrontmatter(md) {
  const fmMatch = md.match(/^---\n([\s\S]*?)\n---\n/);
  if (!fmMatch) return {};
  try {
    return yaml.load(fmMatch[1]) || {};
  } catch {
    return {};
  }
}

function extractSection(md, headingRegex) {
  const lines = md.split(/\r?\n/);
  let start = -1;
  for (const [i, line] of lines.entries()) {
    if (headingRegex.test(line)) {
      start = i + 1;
      break;
    }
  }
  if (start === -1) return [];
  const out = [];
  for (let i = start; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('#')) break; // next heading
    out.push(line);
  }
  return out;
}

function extractPrinciples(md) {
  // Section: "# Core Operating Principles" — numbered list lines
  const body = extractSection(md, /^#\s+Core Operating Principles/i);
  const principles = [];
  for (const line of body) {
    const m = line.match(/^\s*\d+\.\s*(.*\S)\s*$/);
    if (m) principles.push(m[1]);
  }
  return principles;
}

function kebabize(s) {
  return String(s)
    .trim()
    .replace(/^\*/, '') // strip leading asterisk from commands
    .replaceAll(/[^a-zA-Z0-9]+/g, '-')
    .replaceAll(/-+/g, '-')
    .toLowerCase()
    .replaceAll(/^-|-$/g, '');
}

function extractCommands(md) {
  // Section: "# Commands" — list lines like: - **\*help** - Description
  const body = extractSection(md, /^#\s+Commands/i);
  const commands = [];
  for (const raw of body) {
    const line = raw.trim();
    const m = line.match(/^[-*]\s+\*\*(.+?)\*\*\s*-\s*(.+)$/); // **bold** - desc
    if (m) {
      const bold = m[1].trim(); // e.g. *help or *create-doc {template}
      const desc = m[2].trim();
      const trigger = kebabize(bold.split(/\s|\{/)[0]); // take first token before space or {
      if (trigger) {
        commands.push({ trigger, desc, raw: bold });
      }
    }
  }
  return commands;
}

function buildAgentYaml({ moduleSlug, id, name, title, icon, role, identity, commStyle, principles, commands }) {
  // Map commands to BMAD agent.menu with 'exec' target as a placeholder executor
  const menu = commands.map((c) => ({
    trigger: c.trigger,
    description: c.desc,
    exec: `subagentic-command:${c.raw}`,
  }));

  // Ensure at least one menu entry
  if (menu.length === 0) {
    menu.push({ trigger: 'help', description: 'Show available commands', exec: 'subagentic-command:*help' });
  }

  const agentDoc = {
    agent: {
      metadata: {
        id,
        name,
        title,
        icon,
        module: moduleSlug,
      },
      persona: {
        role,
        identity,
        communication_style: commStyle,
        principles:
          principles.length > 0
            ? principles
            : ['Runtime resource loading', 'Direct execution', 'Command processing with * prefix', 'Numbered lists for choices'],
      },
      menu,
    },
  };

  return yaml.dump(agentDoc, { noRefs: true, lineWidth: 120 });
}

function main() {
  const [, , inPath, outPath] = process.argv;
  if (!inPath || !outPath) {
    console.error('Usage: node tools/cli/spikes/convert-subagent-md.js <input.md> <output.agent.yaml>');
    process.exit(2);
  }
  const md = readFile(inPath);
  const fm = parseFrontmatter(md);
  const principles = extractPrinciples(md);
  const commands = extractCommands(md);

  const baseName = (fm.name || path.parse(inPath).name).trim();
  const moduleSlug = 'subagentic';
  const id = `subagentic/${baseName}`;
  const name = baseName;
  const title = (fm.description || baseName).trim();
  const icon = fm.color ? String(fm.color) : '🧰';
  const role = `${baseName} agent`;
  const identity = fm.description || `${baseName} converted from subagent markdown`;
  const commStyle = 'precise and concise';

  const outYaml = buildAgentYaml({ moduleSlug, id, name, title, icon, role, identity, commStyle, principles, commands });
  writeFile(outPath, outYaml);
  console.log(`Wrote ${outPath} with ${commands.length} menu item(s).`);
}

if (require.main === module) {
  main();
}

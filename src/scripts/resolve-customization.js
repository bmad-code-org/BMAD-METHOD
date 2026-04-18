#!/usr/bin/env node
/**
 * Resolve customization for a BMad skill using three-layer YAML merge.
 *
 * Reads customization from three layers (highest priority first):
 *   1. {project-root}/_bmad/customizations/{name}.user.yaml  (personal, gitignored)
 *   2. {project-root}/_bmad/customizations/{name}.yaml        (team/org, committed)
 *   3. {skill-root}/customize.yaml                            (skill defaults)
 *
 * Skill name is derived from the basename of the skill directory.
 *
 * Outputs merged JSON to stdout. Errors go to stderr.
 *
 * Usage:
 *   node resolve-customization.js --skill /abs/path/to/skill-dir
 *   node resolve-customization.js --skill ... --key agent
 *   node resolve-customization.js --skill ... --key agent --key agent.menu
 *
 * Merge rules (matches BMad v6.1 semantics where applicable):
 *   - metadata: shallow merge  (scalar fields override)
 *   - persona:  full replace   (if override contains persona, it replaces wholesale)
 *   - critical_actions: append (override items appended after defaults)
 *   - memories:         append
 *   - menu:             merge by code when present, otherwise append
 *   - other tables:     deep merge
 *   - other arrays:     atomic replace
 *   - scalars:          override wins
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');
const yaml = require('yaml');

function findProjectRoot(start) {
  let current = path.resolve(start);
  while (true) {
    if (
      fs.existsSync(path.join(current, '_bmad')) ||
      fs.existsSync(path.join(current, '.git'))
    ) {
      return current;
    }
    const parent = path.dirname(current);
    if (parent === current) return null;
    current = parent;
  }
}

function loadYaml(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = yaml.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (err) {
    if (err.code === 'ENOENT') return {};
    process.stderr.write(`warning: failed to parse ${filePath}: ${err.message}\n`);
    return {};
  }
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isMenuArray(value) {
  return Array.isArray(value) && value.length > 0 && value.every((item) => isPlainObject(item));
}

function mergeByKey(base, override, keyName) {
  const result = [];
  const indexByKey = new Map();

  for (const item of base) {
    if (!isPlainObject(item)) continue;
    if (item[keyName] !== undefined) {
      indexByKey.set(item[keyName], result.length);
    }
    result.push({ ...item });
  }

  for (const item of override) {
    if (!isPlainObject(item)) {
      result.push(item);
      continue;
    }
    const key = item[keyName];
    if (key !== undefined && indexByKey.has(key)) {
      result[indexByKey.get(key)] = { ...item };
    } else {
      if (key !== undefined) indexByKey.set(key, result.length);
      result.push({ ...item });
    }
  }

  return result;
}

function appendArrays(base, override) {
  const baseArr = Array.isArray(base) ? base : [];
  const overrideArr = Array.isArray(override) ? override : [];
  return [...baseArr, ...overrideArr];
}

function deepMerge(base, override) {
  if (!isPlainObject(base)) return override;
  if (!isPlainObject(override)) return override;

  const result = { ...base };
  for (const [key, overVal] of Object.entries(override)) {
    const baseVal = result[key];

    if (isPlainObject(overVal) && isPlainObject(baseVal)) {
      result[key] = deepMerge(baseVal, overVal);
    } else if (Array.isArray(overVal) && Array.isArray(baseVal)) {
      result[key] = overVal;
    } else {
      result[key] = overVal;
    }
  }
  return result;
}

/**
 * Apply v6.1-compatible per-field merge semantics to the `agent` block,
 * then deep-merge everything else normally.
 */
function mergeAgentBlock(base, override) {
  const baseAgent = (base && base.agent) || {};
  const overAgent = (override && override.agent) || {};

  const mergedAgent = { ...baseAgent };

  for (const [key, overVal] of Object.entries(overAgent)) {
    const baseVal = baseAgent[key];

    switch (key) {
      case 'metadata': {
        mergedAgent.metadata = {
          ...(isPlainObject(baseVal) ? baseVal : {}),
          ...(isPlainObject(overVal) ? overVal : {}),
        };
        break;
      }
      case 'persona': {
        // v6.1 semantics: persona replaces wholesale when present in override
        mergedAgent.persona = overVal;
        break;
      }
      case 'critical_actions':
      case 'memories': {
        mergedAgent[key] = appendArrays(baseVal, overVal);
        break;
      }
      case 'menu': {
        // Merge by `code` when both sides use it; otherwise append.
        const baseArr = Array.isArray(baseVal) ? baseVal : [];
        const overArr = Array.isArray(overVal) ? overVal : [];
        const anyHasCode = [...baseArr, ...overArr].some(
          (item) => isPlainObject(item) && item.code !== undefined,
        );
        mergedAgent[key] = anyHasCode
          ? mergeByKey(baseArr, overArr, 'code')
          : appendArrays(baseArr, overArr);
        break;
      }
      default: {
        if (isPlainObject(overVal) && isPlainObject(baseVal)) {
          mergedAgent[key] = deepMerge(baseVal, overVal);
        } else {
          mergedAgent[key] = overVal;
        }
      }
    }
  }

  return { ...base, ...override, agent: mergedAgent };
}

function extractKey(data, dottedKey) {
  const parts = dottedKey.split('.');
  let current = data;
  for (const part of parts) {
    if (isPlainObject(current) && part in current) {
      current = current[part];
    } else {
      return undefined;
    }
  }
  return current;
}

function parseArgs(argv) {
  const args = { skill: null, keys: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--skill' || a === '-s') {
      args.skill = argv[++i];
    } else if (a === '--key' || a === '-k') {
      args.keys.push(argv[++i]);
    } else if (a === '--help' || a === '-h') {
      printHelp();
      process.exit(0);
    } else {
      process.stderr.write(`warning: unknown argument: ${a}\n`);
    }
  }
  return args;
}

function printHelp() {
  process.stdout.write(
    [
      'Usage: node resolve-customization.js --skill <skill-dir> [--key <path>]...',
      '',
      'Options:',
      '  --skill, -s PATH   Absolute path to the skill directory (must contain customize.yaml)',
      '  --key,   -k PATH   Dotted field path to resolve (repeatable). Omit for full dump.',
      '  --help,  -h        Show this help.',
      '',
      'Outputs merged JSON on stdout. Resolution priority: user > team > skill defaults.',
    ].join('\n') + '\n',
  );
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.skill) {
    process.stderr.write('error: --skill <path> is required\n');
    process.exit(2);
  }

  const skillDir = path.resolve(args.skill);
  const skillName = path.basename(skillDir);
  const defaultsPath = path.join(skillDir, 'customize.yaml');

  const defaults = loadYaml(defaultsPath);
  if (Object.keys(defaults).length === 0) {
    process.stderr.write(`warning: no defaults found at ${defaultsPath}\n`);
  }

  const projectRoot =
    findProjectRoot(process.cwd()) || findProjectRoot(skillDir);

  let team = {};
  let user = {};
  if (projectRoot) {
    const customizationsDir = path.join(projectRoot, '_bmad', 'customizations');
    team = loadYaml(path.join(customizationsDir, `${skillName}.yaml`));
    user = loadYaml(path.join(customizationsDir, `${skillName}.user.yaml`));
  }

  let merged = mergeAgentBlock(defaults, team);
  merged = mergeAgentBlock(merged, user);

  let output;
  if (args.keys.length > 0) {
    output = {};
    for (const key of args.keys) {
      const value = extractKey(merged, key);
      if (value !== undefined) output[key] = value;
    }
  } else {
    output = merged;
  }

  process.stdout.write(JSON.stringify(output, null, 2) + '\n');
}

main();

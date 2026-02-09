/**
 * File Reference Validator
 *
 * Validates cross-file references in BMAD source files (agents, workflows, tasks, steps).
 * Catches broken file paths, missing referenced files, and absolute path leaks.
 *
 * What it checks:
 * - {project-root}/_bmad/ references in YAML and markdown resolve to real src/ files
 * - Relative path references (./file.md, ../data/file.csv) point to existing files
 * - exec="..." and <invoke-task> targets exist
 * - Step metadata (thisStepFile, nextStepFile) references are valid
 * - Load directives (Load: `./file.md`) target existing files
 * - No absolute paths (/Users/, /home/, C:\) leak into source files
 *
 * What it does NOT check (deferred):
 * - {installed_path} variable interpolation (self-referential, low risk)
 * - {{mustache}} template variables (runtime substitution)
 * - {config_source}:key dynamic YAML dereferences
 *
 * Usage:
 *   node tools/validate-file-refs.js            # Warn on broken references (exit 0)
 *   node tools/validate-file-refs.js --strict    # Fail on broken references (exit 1)
 *   node tools/validate-file-refs.js --verbose   # Show all checked references
 *
 * Default mode is warning-only (exit 0) so adoption is non-disruptive.
 * Use --strict when you want CI or pre-commit to enforce valid references.
 */

const fs = require('node:fs');
const path = require('node:path');
const yaml = require('yaml');
const { parse: parseCsv } = require('csv-parse/sync');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.join(PROJECT_ROOT, 'src');
const VERBOSE = process.argv.includes('--verbose');
const STRICT = process.argv.includes('--strict');

// --- Constants ---

// File extensions to scan
const SCAN_EXTENSIONS = new Set(['.yaml', '.yml', '.md', '.xml', '.csv']);

// Skip directories
const SKIP_DIRS = new Set(['node_modules', '.git']);

// Pattern: {project-root}/_bmad/ references
const PROJECT_ROOT_REF = /\{project-root\}\/_bmad\/([^\s'"<>})\]`]+)/g;

// Pattern: {_bmad}/ shorthand references
const BMAD_SHORTHAND_REF = /\{_bmad\}\/([^\s'"<>})\]`]+)/g;

// Pattern: exec="..." attributes
const EXEC_ATTR = /exec="([^"]+)"/g;

// Pattern: <invoke-task> content
const INVOKE_TASK = /<invoke-task>([^<]+)<\/invoke-task>/g;

// Pattern: relative paths in quotes
const RELATIVE_PATH_QUOTED = /['"](\.\.\/?[^'"]+\.(?:md|yaml|yml|xml|json|csv|txt))['"]/g;
const RELATIVE_PATH_DOT = /['"](\.\/[^'"]+\.(?:md|yaml|yml|xml|json|csv|txt))['"]/g;

// Pattern: step metadata
const STEP_META = /(?:thisStepFile|nextStepFile|continueStepFile|skipToStepFile|altStepFile|workflowFile):\s*['"](\.[^'"]+)['"]/g;

// Pattern: Load directives
const LOAD_DIRECTIVE = /Load[:\s]+`(\.[^`]+)`/g;

// Pattern: absolute path leaks
const ABS_PATH_LEAK = /(?:\/Users\/|\/home\/|[A-Z]:\\\\)/;

// --- Output Escaping ---

function escapeAnnotation(str) {
  return str.replaceAll('%', '%25').replaceAll('\r', '%0D').replaceAll('\n', '%0A');
}

function escapeTableCell(str) {
  return String(str).replaceAll('|', String.raw`\|`);
}

// Path prefixes/patterns that only exist in installed structure, not in source
const INSTALL_ONLY_PATHS = ['_config/'];

// Files that are generated at install time and don't exist in the source tree
const INSTALL_GENERATED_FILES = ['config.yaml'];

// Variables that indicate a path is not statically resolvable
const UNRESOLVABLE_VARS = [
  '{output_folder}',
  '{value}',
  '{timestamp}',
  '{config_source}:',
  '{installed_path}',
  '{shared_path}',
  '{planning_artifacts}',
  '{research_topic}',
  '{user_name}',
  '{communication_language}',
  '{epic_number}',
  '{next_epic_num}',
  '{epic_num}',
  '{part_id}',
  '{count}',
  '{date}',
  '{outputFile}',
  '{nextStepFile}',
];

// --- File Discovery ---

function getSourceFiles(dir) {
  const files = [];

  function walk(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      if (SKIP_DIRS.has(entry.name)) continue;

      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile() && SCAN_EXTENSIONS.has(path.extname(entry.name))) {
        files.push(fullPath);
      }
    }
  }

  walk(dir);
  return files;
}

// --- Code Block Stripping ---

function stripCodeBlocks(content) {
  return content.replaceAll(/```[\s\S]*?```/g, (m) => m.replaceAll(/[^\n]/g, ''));
}

function stripJsonExampleBlocks(content) {
  // Strip bare JSON example blocks: { and } each on their own line.
  // These are example/template data (not real file references).
  return content.replaceAll(/^\{\s*\n(?:.*\n)*?^\}\s*$/gm, (m) => m.replaceAll(/[^\n]/g, ''));
}

// --- Path Mapping ---

function mapInstalledToSource(refPath) {
  // Strip {project-root}/_bmad/ or {_bmad}/ prefix
  let cleaned = refPath.replace(/^\{project-root\}\/_bmad\//, '').replace(/^\{_bmad\}\//, '');

  // Also handle bare _bmad/ prefix (seen in some invoke-task)
  cleaned = cleaned.replace(/^_bmad\//, '');

  // Skip install-only paths (generated at install time, not in source)
  if (isInstallOnly(cleaned)) return null;

  // core/, bmm/, and utility/ are directly under src/
  if (cleaned.startsWith('core/') || cleaned.startsWith('bmm/') || cleaned.startsWith('utility/')) {
    return path.join(SRC_DIR, cleaned);
  }

  // Fallback: map directly under src/
  return path.join(SRC_DIR, cleaned);
}

// --- Reference Extraction ---

function isResolvable(refStr) {
  // Skip refs containing unresolvable runtime variables
  if (refStr.includes('{{')) return false;
  for (const v of UNRESOLVABLE_VARS) {
    if (refStr.includes(v)) return false;
  }
  return true;
}

function isInstallOnly(cleanedPath) {
  // Skip paths that only exist in the installed _bmad/ structure, not in src/
  for (const prefix of INSTALL_ONLY_PATHS) {
    if (cleanedPath.startsWith(prefix)) return true;
  }
  // Skip files that are generated during installation
  const basename = path.basename(cleanedPath);
  for (const generated of INSTALL_GENERATED_FILES) {
    if (basename === generated) return true;
  }
  return false;
}

function extractYamlRefs(filePath, content) {
  const refs = [];

  let doc;
  try {
    doc = yaml.parseDocument(content);
  } catch {
    return refs; // Skip unparseable YAML (schema validator handles this)
  }

  function checkValue(value, range, keyPath) {
    if (typeof value !== 'string') return;
    if (!isResolvable(value)) return;

    const line = range ? offsetToLine(content, range[0]) : undefined;

    // Check for {project-root}/_bmad/ refs
    const prMatch = value.match(/\{project-root\}\/_bmad\/[^\s'"<>})\]`]+/);
    if (prMatch) {
      refs.push({ file: filePath, raw: prMatch[0], type: 'project-root', line, key: keyPath });
    }

    // Check for {_bmad}/ refs
    const bmMatch = value.match(/\{_bmad\}\/[^\s'"<>})\]`]+/);
    if (bmMatch) {
      refs.push({ file: filePath, raw: bmMatch[0], type: 'project-root', line, key: keyPath });
    }

    // Check for relative paths
    const relMatch = value.match(/^\.\.?\/[^\s'"<>})\]`]+\.(?:md|yaml|yml|xml|json|csv|txt)$/);
    if (relMatch) {
      refs.push({ file: filePath, raw: relMatch[0], type: 'relative', line, key: keyPath });
    }
  }

  function walkNode(node, keyPath) {
    if (!node) return;

    if (yaml.isMap(node)) {
      for (const item of node.items) {
        const key = item.key && item.key.value !== undefined ? item.key.value : '?';
        const childPath = keyPath ? `${keyPath}.${key}` : String(key);
        walkNode(item.value, childPath);
      }
    } else if (yaml.isSeq(node)) {
      for (const [i, item] of node.items.entries()) {
        walkNode(item, `${keyPath}[${i}]`);
      }
    } else if (yaml.isScalar(node)) {
      checkValue(node.value, node.range, keyPath);
    }
  }

  walkNode(doc.contents, '');
  return refs;
}

function offsetToLine(content, offset) {
  let line = 1;
  for (let i = 0; i < offset && i < content.length; i++) {
    if (content[i] === '\n') line++;
  }
  return line;
}

function extractMarkdownRefs(filePath, content) {
  const refs = [];
  const stripped = stripJsonExampleBlocks(stripCodeBlocks(content));

  function runPattern(regex, type) {
    regex.lastIndex = 0;
    let match;
    while ((match = regex.exec(stripped)) !== null) {
      const raw = match[1];
      if (!isResolvable(raw)) continue;
      refs.push({ file: filePath, raw, type, line: offsetToLine(stripped, match.index) });
    }
  }

  // {project-root}/_bmad/ refs
  runPattern(PROJECT_ROOT_REF, 'project-root');

  // {_bmad}/ shorthand
  runPattern(BMAD_SHORTHAND_REF, 'project-root');

  // exec="..." attributes
  runPattern(EXEC_ATTR, 'exec-attr');

  // <invoke-task> tags
  runPattern(INVOKE_TASK, 'invoke-task');

  // Step metadata
  runPattern(STEP_META, 'relative');

  // Load directives
  runPattern(LOAD_DIRECTIVE, 'relative');

  // Relative paths in quotes
  runPattern(RELATIVE_PATH_QUOTED, 'relative');
  runPattern(RELATIVE_PATH_DOT, 'relative');

  return refs;
}

function extractCsvRefs(filePath, content) {
  const refs = [];

  let records;
  try {
    records = parseCsv(content, {
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true,
    });
  } catch (error) {
    // No CSV schema validator exists yet (planned as Layer 2c) — surface parse errors visibly.
    // YAML equivalent (line ~198) defers to validate-agent-schema.js; CSV has no such fallback.
    const rel = path.relative(PROJECT_ROOT, filePath);
    console.error(`  [CSV-PARSE-ERROR] ${rel}: ${error.message}`);
    if (process.env.GITHUB_ACTIONS) {
      console.log(`::warning file=${rel},line=1::${escapeAnnotation(`CSV parse error: ${error.message}`)}`);
    }
    return refs;
  }

  // Only process if workflow-file column exists
  const firstRecord = records[0];
  if (!firstRecord || !('workflow-file' in firstRecord)) {
    return refs;
  }

  for (const [i, record] of records.entries()) {
    const raw = record['workflow-file'];
    if (!raw || raw.trim() === '') continue;
    if (!isResolvable(raw)) continue;

    // Line = header (1) + data row index (0-based) + 1
    const line = i + 2;
    refs.push({ file: filePath, raw, type: 'project-root', line });
  }

  return refs;
}

// --- Reference Resolution ---

function resolveRef(ref) {
  if (ref.type === 'project-root') {
    return mapInstalledToSource(ref.raw);
  }

  if (ref.type === 'relative') {
    return path.resolve(path.dirname(ref.file), ref.raw);
  }

  if (ref.type === 'exec-attr') {
    let execPath = ref.raw;
    if (execPath.includes('{project-root}')) {
      return mapInstalledToSource(execPath);
    }
    if (execPath.includes('{_bmad}')) {
      return mapInstalledToSource(execPath);
    }
    if (execPath.startsWith('_bmad/')) {
      return mapInstalledToSource(execPath);
    }
    // Relative exec path
    return path.resolve(path.dirname(ref.file), execPath);
  }

  if (ref.type === 'invoke-task') {
    // Extract file path from invoke-task content
    const prMatch = ref.raw.match(/\{project-root\}\/_bmad\/([^\s'"<>})\]`]+)/);
    if (prMatch) return mapInstalledToSource(prMatch[0]);

    const bmMatch = ref.raw.match(/\{_bmad\}\/([^\s'"<>})\]`]+)/);
    if (bmMatch) return mapInstalledToSource(bmMatch[0]);

    const bareMatch = ref.raw.match(/_bmad\/([^\s'"<>})\]`]+)/);
    if (bareMatch) return mapInstalledToSource(bareMatch[0]);

    return null; // Can't resolve — skip
  }

  return null;
}

// --- Absolute Path Leak Detection ---

function checkAbsolutePathLeaks(filePath, content) {
  const leaks = [];
  const stripped = stripCodeBlocks(content);
  const lines = stripped.split('\n');

  for (const [i, line] of lines.entries()) {
    if (ABS_PATH_LEAK.test(line)) {
      leaks.push({ file: filePath, line: i + 1, content: line.trim() });
    }
  }

  return leaks;
}

// --- Exports (for testing) ---
module.exports = { extractCsvRefs };

// --- Main ---

if (require.main === module) {
  console.log(`\nValidating file references in: ${SRC_DIR}`);
  console.log(`Mode: ${STRICT ? 'STRICT (exit 1 on issues)' : 'WARNING (exit 0)'}${VERBOSE ? ' + VERBOSE' : ''}\n`);

  const files = getSourceFiles(SRC_DIR);
  console.log(`Found ${files.length} source files\n`);

  let totalRefs = 0;
  let brokenRefs = 0;
  let totalLeaks = 0;
  let filesWithIssues = 0;
  const allIssues = []; // Collect for $GITHUB_STEP_SUMMARY

  for (const filePath of files) {
    const relativePath = path.relative(PROJECT_ROOT, filePath);
    const content = fs.readFileSync(filePath, 'utf-8');
    const ext = path.extname(filePath);

    // Extract references
    let refs;
    if (ext === '.yaml' || ext === '.yml') {
      refs = extractYamlRefs(filePath, content);
    } else if (ext === '.csv') {
      refs = extractCsvRefs(filePath, content);
    } else {
      refs = extractMarkdownRefs(filePath, content);
    }

    // Resolve and classify all refs before printing anything.
    // This avoids the confusing pattern of printing headers at two different
    // times depending on verbosity — collect first, then print once.
    const broken = [];
    const ok = [];

    for (const ref of refs) {
      totalRefs++;
      const resolved = resolveRef(ref);

      if (resolved && !fs.existsSync(resolved)) {
        // Extensionless paths may be directory references or partial templates.
        // If the path has no extension, check whether it exists as a directory.
        // Flag it if nothing exists at all — likely a real broken reference.
        const hasExt = path.extname(resolved) !== '';
        if (!hasExt) {
          if (fs.existsSync(resolved)) {
            ok.push({ ref, tag: 'OK-DIR' });
          } else {
            // No extension and nothing exists — not a file, not a directory.
            // Flag as UNRESOLVED (distinct from BROKEN which means "file with extension not found").
            broken.push({ ref, resolved: path.relative(PROJECT_ROOT, resolved), kind: 'unresolved' });
            brokenRefs++;
          }
          continue;
        }
        broken.push({ ref, resolved: path.relative(PROJECT_ROOT, resolved), kind: 'broken' });
        brokenRefs++;
        continue;
      }

      if (resolved) {
        ok.push({ ref, tag: 'OK' });
      }
    }

    // Check absolute path leaks
    const leaks = checkAbsolutePathLeaks(filePath, content);
    totalLeaks += leaks.length;

    // Print results — file header appears once, in one place
    const hasFileIssues = broken.length > 0 || leaks.length > 0;

    if (hasFileIssues) {
      filesWithIssues++;
      console.log(`\n${relativePath}`);

      if (VERBOSE) {
        for (const { ref, tag, note } of ok) {
          const suffix = note ? ` (${note})` : '';
          console.log(`  [${tag}] ${ref.raw}${suffix}`);
        }
      }

      for (const { ref, resolved, kind } of broken) {
        const location = ref.line ? `line ${ref.line}` : ref.key ? `key: ${ref.key}` : '';
        const tag = kind === 'unresolved' ? 'UNRESOLVED' : 'BROKEN';
        const detail = kind === 'unresolved' ? 'Not found as file or directory' : 'Target not found';
        const issueType = kind === 'unresolved' ? 'unresolved path' : 'broken ref';
        console.log(`  [${tag}] ${ref.raw}${location ? ` (${location})` : ''}`);
        console.log(`     ${detail}: ${resolved}`);
        allIssues.push({ file: relativePath, line: ref.line || 1, ref: ref.raw, issue: issueType });
        if (process.env.GITHUB_ACTIONS) {
          const line = ref.line || 1;
          console.log(
            `::warning file=${relativePath},line=${line}::${escapeAnnotation(`${tag === 'UNRESOLVED' ? 'Unresolved path' : 'Broken reference'}: ${ref.raw} → ${resolved}`)}`,
          );
        }
      }

      for (const leak of leaks) {
        console.log(`  [ABS-PATH] Line ${leak.line}: ${leak.content}`);
        allIssues.push({ file: relativePath, line: leak.line, ref: leak.content, issue: 'abs-path' });
        if (process.env.GITHUB_ACTIONS) {
          console.log(`::warning file=${relativePath},line=${leak.line}::${escapeAnnotation(`Absolute path leak: ${leak.content}`)}`);
        }
      }
    } else if (VERBOSE && refs.length > 0) {
      console.log(`\n${relativePath}`);
      for (const { ref, tag, note } of ok) {
        const suffix = note ? ` (${note})` : '';
        console.log(`  [${tag}] ${ref.raw}${suffix}`);
      }
    }
  }

  // Summary
  console.log(`\n${'─'.repeat(60)}`);
  console.log(`\nSummary:`);
  console.log(`   Files scanned: ${files.length}`);
  console.log(`   References checked: ${totalRefs}`);
  console.log(`   Broken references: ${brokenRefs}`);
  console.log(`   Absolute path leaks: ${totalLeaks}`);

  const hasIssues = brokenRefs > 0 || totalLeaks > 0;

  if (hasIssues) {
    console.log(`\n   ${filesWithIssues} file(s) with issues`);

    if (STRICT) {
      console.log(`\n   [STRICT MODE] Exiting with failure.`);
    } else {
      console.log(`\n   Run with --strict to treat warnings as errors.`);
    }
  } else {
    console.log(`\n   All file references valid!`);
  }

  console.log('');

  // Write GitHub Actions step summary
  if (process.env.GITHUB_STEP_SUMMARY) {
    let summary = '## File Reference Validation\n\n';
    if (allIssues.length > 0) {
      summary += '| File | Line | Reference | Issue |\n';
      summary += '|------|------|-----------|-------|\n';
      for (const issue of allIssues) {
        summary += `| ${escapeTableCell(issue.file)} | ${issue.line} | ${escapeTableCell(issue.ref)} | ${issue.issue} |\n`;
      }
      summary += '\n';
    }
    summary += `**${files.length} files scanned, ${totalRefs} references checked, ${brokenRefs + totalLeaks} issues found**\n`;
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
  }

  process.exit(hasIssues && STRICT ? 1 : 0);
}

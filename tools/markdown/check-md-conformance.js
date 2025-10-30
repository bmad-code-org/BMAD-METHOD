/**
 * MD Conformance Checker (CommonMark-oriented)
 *
 * Checks .md files for:
 * 1) Blank line before/after bullet and numbered lists
 * 2) Blank line before/after tables
 * 3) Blank line before/after fenced code blocks
 * 4) Bullet marker normalization: "-" only (not "*" or "+")
 * 5) Code fence language present (fallback should be specified by author)
 *
 * Usage:
 *   node tools/markdown/check-md-conformance.js [paths...]
 *     - If a path is a directory, scans recursively for .md files
 *     - If a path is a file and ends with .md, scans that file
 *
 * Exit codes:
 *   0 -> No violations
 *   1 -> Violations found
 */

const fs = require('node:fs');
const path = require('node:path');

function listMarkdownFiles(targetPath) {
  const results = [];
  function walk(p) {
    const stat = fs.statSync(p);
    if (stat.isDirectory()) {
      const entries = fs.readdirSync(p);
      for (const e of entries) {
        if (e === 'node_modules' || e.startsWith('.git')) continue;
        walk(path.join(p, e));
      }
    } else if (stat.isFile() && p.toLowerCase().endsWith('.md')) {
      results.push(p);
    }
  }
  walk(targetPath);
  return results;
}

function isListLine(line) {
  return /^\s*([-*+])\s+/.test(line) || /^\s*\d+\.\s+/.test(line);
}

function isBulletLine(line) {
  return /^\s*([-*+])\s+/.test(line);
}

function bulletMarker(line) {
  const m = line.match(/^\s*([-*+])\s+/);
  return m ? m[1] : null;
}

function isTableLine(line) {
  // Simple heuristic: contains a pipe and not a code fence
  // We'll treat a group of lines with pipes as a table block
  const trimmed = line.trim();
  if (trimmed.startsWith('```')) return false;
  return /\|/.test(line) && !/^\s*\|\s*$/.test(line);
}

function isFenceStart(line) {
  return /^\s*```/.test(line);
}

function fenceLanguage(line) {
  const m = line.match(/^\s*```\s*([a-zA-Z0-9_+-]+)?/);
  return m ? m[1] || '' : '';
}

function isBlank(line) {
  return /^\s*$/.test(line);
}

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);

  const violations = [];

  let inFence = false;

  // Pass 1: fence tracking to avoid interpreting list/table inside code blocks
  const excluded = Array.from({ length: lines.length }).fill(false);
  for (const [i, line] of lines.entries()) {
    if (isFenceStart(line)) {
      if (inFence) {
        // closing fence
        inFence = false;
      } else {
        inFence = true;
      }
      excluded[i] = true;
      continue;
    }
    if (inFence) excluded[i] = true;
  }

  // Pass 2: checks
  // 2a) Code fences: language presence and blank lines around
  inFence = false;
  for (let i = 0; i < lines.length; i++) {
    if (excluded[i]) {
      if (isFenceStart(lines[i])) {
        // Fence boundary
        if (inFence) {
          // closing
          inFence = false;
          // blank line after?
          const next = i + 1;
          if (next < lines.length && !isBlank(lines[next])) {
            violations.push({
              type: 'fence-blank-after',
              line: i + 1,
              message: 'Missing blank line after code fence',
            });
          }
        } else {
          // opening
          inFence = true;
          // language present?
          const lang = fenceLanguage(lines[i]);
          if (!lang) {
            violations.push({
              type: 'fence-language-missing',
              line: i + 1,
              message: 'Code fence missing language identifier (e.g., ```bash)',
            });
          }
          // blank line before?
          const prev = i - 1;
          if (prev >= 0 && !isBlank(lines[prev])) {
            violations.push({
              type: 'fence-blank-before',
              line: i + 1,
              message: 'Missing blank line before code fence',
            });
          }
        }
      }
      continue;
    }
  }

  // 2b) Lists: blank lines before/after; bullets normalization
  // We'll detect contiguous list blocks.
  let i = 0;
  while (i < lines.length) {
    if (excluded[i]) {
      i++;
      continue;
    }
    if (isListLine(lines[i])) {
      // Start of a list block
      const start = i;
      // Require immediate previous line to be blank (not previous non-blank)
      const prev = start - 1;
      if (prev >= 0 && !isBlank(lines[prev])) {
        violations.push({ type: 'list-blank-before', line: start + 1, message: 'Missing blank line before list' });
      }

      // Track bullets normalization
      if (isBulletLine(lines[i])) {
        const marker = bulletMarker(lines[i]);
        if (marker && marker !== '-') {
          violations.push({ type: 'bullet-marker', line: i + 1, message: `Use '-' for bullets, found '${marker}'` });
        }
      }

      // Move to end of the list block (stop at first non-list line; do not consume trailing blanks)
      let end = start;
      while (end < lines.length && isListLine(lines[end])) {
        // Also check bullet markers inside block
        if (!excluded[end] && isBulletLine(lines[end])) {
          const marker = bulletMarker(lines[end]);
          if (marker && marker !== '-') {
            violations.push({ type: 'bullet-marker', line: end + 1, message: `Use '-' for bullets, found '${marker}'` });
          }
        }
        end++;
      }

      // Require immediate next line after block to be blank
      const next = end;
      if (next < lines.length && !isBlank(lines[next])) {
        const lastContentLine = end - 1;
        violations.push({ type: 'list-blank-after', line: lastContentLine + 1, message: 'Missing blank line after list' });
      }

      i = end;
      continue;
    }

    i++;
  }

  // 2c) Tables: detect blocks of lines containing '|' and ensure blank lines around
  i = 0;
  while (i < lines.length) {
    if (excluded[i]) {
      i++;
      continue;
    }
    if (isTableLine(lines[i])) {
      const start = i;
      // scan forward while lines look like table lines
      let end = start;
      while (end < lines.length && !excluded[end] && isTableLine(lines[end])) end++;
      // Require immediate previous line to be blank
      const prev = start - 1;
      if (prev >= 0 && !isBlank(lines[prev])) {
        violations.push({ type: 'table-blank-before', line: start + 1, message: 'Missing blank line before table' });
      }

      // Require immediate next line after block to be blank
      const next = end;
      if (next < lines.length && !isBlank(lines[next])) {
        const last = end - 1;
        violations.push({ type: 'table-blank-after', line: last + 1, message: 'Missing blank line after table' });
      }

      i = end;
      continue;
    }

    i++;
  }

  return violations;
}

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Usage: node tools/markdown/check-md-conformance.js [paths...]');
    process.exit(2);
  }

  // Expand inputs to files
  const files = [];
  for (const p of args) {
    const abs = path.resolve(p);
    if (!fs.existsSync(abs)) {
      console.error(`Path not found: ${abs}`);
      continue;
    }
    const stat = fs.statSync(abs);
    if (stat.isDirectory()) {
      files.push(...listMarkdownFiles(abs));
    } else if (stat.isFile() && abs.toLowerCase().endsWith('.md')) {
      files.push(abs);
    }
  }

  const summary = [];
  let total = 0;

  for (const f of files) {
    const violations = checkFile(f);
    if (violations.length > 0) {
      summary.push({ file: f, violations });
      total += violations.length;
    }
  }

  if (summary.length === 0) {
    console.log('MD Conformance: PASS (no violations)');
    process.exit(0);
  }

  // Pretty print
  console.log(`MD Conformance: FAIL (${total} violation(s) in ${summary.length} file(s))`);
  for (const { file, violations } of summary) {
    console.log(`\n- ${path.relative(process.cwd(), file)}`);
    for (const v of violations) {
      console.log(`  L${v.line.toString().padStart(4, ' ')}  ${v.type}  ${v.message}`);
    }
  }

  process.exit(1);
}

if (require.main === module) {
  main();
}

module.exports = { checkFile };

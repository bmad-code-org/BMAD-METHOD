#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

// Required section patterns per document type
// Each entry is an array of alternatives — at least one must match (case-insensitive heading)
const RULES = {
  'product-brief': {
    label: 'Product Brief',
    sections: [
      // Goals / business goals / what it needs to do
      [/^#+\s+(goals?|business\s+goals?|what\s+it\s+needs?\s+to\s+do|core\s+capabilit)/im],
      // Constraints / platform requirements
      [/^#+\s+(constraints?|platform\s+requirements?|limitations?)/im],
      // Vision / why / purpose
      [/^#+\s+(vision|why\s+this|purpose|north\s+star|strategic)/im],
      // Success metrics / how will we know / measures
      [/^#+\s+(success\s+metrics?|how\s+will\s+we\s+know|measures?\s+of\s+success|kpis?)/im],
    ],
    sectionNames: ['Goals', 'Constraints', 'Vision', 'Success Metrics'],
  },
  'page-spec': {
    label: 'Page Specification',
    sections: [
      [/^#+\s+overview/im],
      [/^#+\s+(layout|layout\s+structure)/im],
      [/^#+\s+(page\s+sections?|components?|sections?)/im],
      [/^#+\s+(page\s+states?|states?)/im],
      [/^#+\s+(checklist|validation|open\s+questions?)/im],
    ],
    sectionNames: ['Overview', 'Layout', 'Components/Sections', 'States', 'Validation/Checklist'],
  },
  'design-log': {
    label: 'Design Log',
    sections: [
      [/^#+\s+current/im],
      [/^#+\s+backlog/im],
      [/^#+\s+log/im],
    ],
    sectionNames: ['Current', 'Backlog', 'Log'],
  },
};

function detectDocType(filePath, content) {
  const base = path.basename(filePath).toLowerCase();

  // Filename-based detection
  if (base.includes('product-brief') || base.includes('productbrief')) return 'product-brief';
  if (base.includes('design-log') || base.includes('designlog')) return 'design-log';
  if (base.includes('page-spec') || base.includes('pagespec')) return 'page-spec';

  // Content-based detection (look for distinctive markers)
  if (/^#+\s+product brief/im.test(content)) return 'product-brief';
  if (/^#+\s+design log/im.test(content)) return 'design-log';
  if (/OBJECT ID:/m.test(content) || /page metadata/im.test(content)) return 'page-spec';

  // Fallback: check section presence heuristics
  const hasCurrentBacklogLog =
    /^#+\s+current/im.test(content) &&
    /^#+\s+backlog/im.test(content) &&
    /^#+\s+log/im.test(content);
  if (hasCurrentBacklogLog) return 'design-log';

  const hasPageStates = /^#+\s+page\s+states?/im.test(content);
  const hasOverview = /^#+\s+overview/im.test(content);
  if (hasPageStates || hasOverview) return 'page-spec';

  return null;
}

function validate(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const base = path.basename(filePath);
  const docType = detectDocType(filePath, content);

  if (!docType) {
    console.error(`\u2717 UNKNOWN — ${base}`);
    console.error('  Could not detect document type.');
    console.error('  Expected filename or content matching: product-brief, page-spec, or design-log');
    process.exit(1);
  }

  const rule = RULES[docType];
  const missing = [];

  for (let i = 0; i < rule.sections.length; i++) {
    const patterns = rule.sections[i];
    const found = patterns.some((pattern) => pattern.test(content));
    if (!found) {
      missing.push(rule.sectionNames[i]);
    }
  }

  if (missing.length === 0) {
    console.log(`\u2713 PASS \u2014 ${base}`);
    console.log(`  All required sections present. (${rule.label})`);
    return true;
  } else {
    console.log(`\u2717 FAIL \u2014 ${base}`);
    console.log(`  Missing sections:`);
    for (const s of missing) {
      console.log(`    - ${s}`);
    }
    return false;
  }
}

function main() {
  const filePaths = process.argv.slice(2);

  if (filePaths.length === 0) {
    console.error('Usage: node wds-validate.js <path/to/file.md> [path/to/another.md ...]');
    console.error('');
    console.error('Supported document types:');
    console.error('  product-brief  — must contain: Goals, Constraints, Vision, Success Metrics');
    console.error('  page-spec      — must contain: Overview, Layout, Components, States, Validation');
    console.error('  design-log     — must contain: Current, Backlog, Log');
    process.exit(1);
  }

  let allPassed = true;

  for (const filePath of filePaths) {
    const abs = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
    const passed = validate(abs);
    if (!passed) allPassed = false;
  }

  process.exit(allPassed ? 0 : 1);
}

main();

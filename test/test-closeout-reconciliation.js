/**
 * Closeout reconciliation workflow tests
 *
 * Ensures the implementation workflows explicitly enforce reconciliation
 * between story markdown Status fields and sprint-status.yaml before closeout.
 *
 * Usage: node test/test-closeout-reconciliation.js
 */

const fs = require('node:fs');

const colors = {
  reset: '\u001B[0m',
  green: '\u001B[32m',
  red: '\u001B[31m',
  cyan: '\u001B[36m',
  dim: '\u001B[2m',
};

let passed = 0;
let failed = 0;

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

const codeReview = fs.readFileSync('src/bmm-skills/4-implementation/bmad-code-review/steps/step-04-present.md', 'utf8');
const sprintStatus = fs.readFileSync('src/bmm-skills/4-implementation/bmad-sprint-status/SKILL.md', 'utf8');

console.log(`\n${colors.cyan}Closeout Reconciliation Tests${colors.reset}\n`);

assert(
  codeReview.includes('Re-open the story file after saving and verify the top-level `Status:` field equals `{new_status}`.'),
  'code-review reopens the story file to verify final status reconciliation',
);

assert(
  codeReview.includes(
    'If the story file does not match `{new_status}`, HALT with a closeout reconciliation failure instead of reporting completion.',
  ),
  'code-review halts when story markdown reconciliation fails',
);

assert(codeReview.includes('development_status[{story_key}]'), 'code-review verifies the sprint tracker entry during reconciliation');

assert(
  codeReview.includes(
    'If `development_status[{story_key}]` is missing, unreadable, or cannot be verified, HALT with a closeout reconciliation failure instead of reporting completion.',
  ),
  'code-review halts when the sprint tracker entry cannot be verified',
);

assert(
  codeReview.includes(
    'If `development_status[{story_key}]` does not match `{new_status}`, HALT with a closeout reconciliation failure instead of reporting completion.',
  ),
  'code-review halts when sprint tracker reconciliation fails',
);

assert(
  codeReview.includes(
    'If `{sprint_status}` file does not exist, set `{reconciliation_result}` = `story file verified; sprint tracker not applicable`.',
  ),
  'code-review treats skipped reconciliation as not applicable only when no sprint tracker exists',
);

assert(
  codeReview.includes(
    'If the live journey release-gate closeout above found missing evidence, red gates, skipped gates, blocked gates, environment-blocked gates, or incomplete/expired product-owner deferrals: keep `{new_status}` = `in-progress` regardless of resolved findings.',
  ),
  'code-review keeps live-gate blockers from being overwritten during final status selection',
);

assert(
  codeReview.includes('> **Reconciled:** `{reconciliation_result}`'),
  'code-review reports reconciliation status conditionally in the completion summary',
);

assert(
  sprintStatus.includes('Resolve the story path from `story_location` using `{project-root}` as the base for relative paths.'),
  'sprint-status defines how story_location is resolved during validate mode',
);

assert(
  sprintStatus.includes(
    'If the file is missing, unreadable, or the top-level `Status:` value is missing, record a drift entry with the path and reason.',
  ),
  'sprint-status treats missing story artifacts or missing Status values as validation failures',
);

assert(
  sprintStatus.includes('any drift_entries were recorded for review/done stories'),
  'sprint-status fails validate mode on any recorded reconciliation drift entries',
);

assert(
  sprintStatus.includes('story markdown Status fields with sprint-status.yaml before closeout'),
  'sprint-status reports reconciliation guidance when drift is detected',
);

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);

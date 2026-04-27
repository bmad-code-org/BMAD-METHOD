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
  codeReview.includes('If either artifact does not match, HALT with a closeout reconciliation failure instead of reporting completion.'),
  'code-review halts when closeout reconciliation fails',
);

assert(codeReview.includes('development_status[{story_key}]'), 'code-review verifies the sprint tracker entry during reconciliation');

assert(
  codeReview.includes('story markdown and sprint tracker agree on `{new_status}`'),
  'code-review reports successful reconciliation in the completion summary',
);

assert(sprintStatus.includes('story/tracker status drift detected'), 'sprint-status warns about story/tracker drift');

assert(
  sprintStatus.includes('use `story_location` to open the matching story markdown file'),
  'sprint-status validate mode uses story_location when checking story files against tracker state',
);

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);

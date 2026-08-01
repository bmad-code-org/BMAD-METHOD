/** Regression checks for retrospective mode orchestration instructions. */

'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const skill = fs.readFileSync(path.join(root, 'src/bmm-skills/ship/bmad-retrospective/SKILL.md'), 'utf8');
const documentReference = fs.readFileSync(path.join(root, 'src/bmm-skills/ship/bmad-retrospective/references/retro-document.md'), 'utf8');

const tests = [];

function test(name, check) {
  tests.push({ name, check });
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function section(content, heading, nextHeading) {
  const start = content.indexOf(heading);
  assert(start !== -1, `missing section ${heading}`);
  const end = nextHeading ? content.indexOf(nextHeading, start + heading.length) : -1;
  return content.slice(start, end === -1 ? undefined : end);
}

test('explicit spec folders take priority and invalid folders do not fall back', () => {
  assert(skill.includes('An explicit folder path takes priority over sprint status.'), 'missing explicit-folder priority');
  assert(skill.includes('Do not fall back to sprint mode for an invalid explicit folder.'), 'invalid explicit folders must stop');
  assert(skill.includes('stories_status.py inspect --folder'), 'missing folder inspector command');
});

test('automatic stories selection never guesses among headless candidates', () => {
  const resolution = section(skill, '## Input resolution', '## Completeness');
  assert(
    resolution.includes('When neither a folder nor an epic number was supplied and sprint status does not exist'),
    'stories detection must not replace an explicit sprint epic',
  );
  assert(resolution.includes('--root "{output_folder}/specs"'), 'missing output-folder spec root');
  assert(resolution.includes('--root "{planning_artifacts}"'), 'missing planning-artifacts spec root');
  assert(resolution.includes('--root "{implementation_artifacts}"'), 'missing implementation-artifacts spec root');
  assert(resolution.includes('Multiple candidates: show the paths and ask the user to choose.'), 'missing interactive choice');
  assert(resolution.includes('In a headless run, stop and require an explicit folder.'), 'headless multiple-candidate runs must stop');
});

test('stories mode resumes its stable retrospective from current evidence', () => {
  const workingState = section(skill, '## Working state and resumption', '## Flow');
  assert(workingState.includes('stories mode uses `{spec-folder}/RETROSPECTIVE.md`'), 'missing stable stories-mode output');
  assert(workingState.includes('resume at the first required phase absent from `completed_phases`'), 'missing explicit phase resumption');
  assert(
    workingState.includes('Current inventory, statuses, revisions, commits, and diffs take precedence'),
    'current evidence must win during resumption',
  );
  assert(workingState.includes('Stop on malformed or mismatched working state.'), 'missing malformed resume guard');
});

test('headless incomplete stories mode rejects before analysis', () => {
  assert(skill.includes('finalize it without Phase 1 analysis, and stop'), 'incomplete headless stories mode must stop before analysis');
  assert(skill.includes('force the final machine verdict to `rejected`'), 'pending stories must force rejection');
});

test('stories finalization cannot access sprint status or add another item store', () => {
  const storiesFinalization = section(documentReference, '## Stories mode finalization', '## Finish');
  assert(
    storiesFinalization.includes('Do not run `sprint_status.py`, read or write sprint status, create sprint status'),
    'stories finalization must forbid sprint-status access',
  );
  assert(
    storiesFinalization.includes('This is the only retrospective and action-item artifact for the run.'),
    'stories mode must not add a second action-item persistence format',
  );
  assert(
    storiesFinalization.includes("Compare the final inspection's `source_hashes` with the pre-run mapping."),
    'stories finalization must verify source hashes',
  );
});

test('sprint finalization keeps its existing helper update contract', () => {
  const sprintFinalization = section(documentReference, '## Sprint mode finalization', '## Stories mode finalization');
  for (const token of [
    'sprint_status.py update',
    '--set-retro-done',
    '--add-action',
    '--set-action-status',
    '--verdict',
    'retro_key_found: false',
    'retro_key_found: null',
  ]) {
    assert(sprintFinalization.includes(token), `sprint finalization lost ${token}`);
  }
});

let failures = 0;
for (const { name, check } of tests) {
  try {
    check();
    console.log(`ok - ${name}`);
  } catch (error) {
    failures++;
    console.error(`not ok - ${name}: ${error.message}`);
  }
}

console.log(`${tests.length - failures}/${tests.length} retrospective contract tests passed`);
if (failures) process.exit(1);

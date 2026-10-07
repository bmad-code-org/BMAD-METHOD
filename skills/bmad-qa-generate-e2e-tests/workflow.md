# Generate End-to-End Tests

**Goal:** Add end-to-end and API tests for behavior that already works, so that an agent or a person can change the code and know it still works. Tests only: no review of the implementation, and no product code changes beyond what the harness needs to reach an element, such as a test id. List any such change in the report.

## Conventions

- Run `tickets.py` as `uv run {project-root}/_bmad/method/scripts/tickets.py --project-root {project-root} <verb>`. A non-zero exit prints an error that names what is missing; show it and work without the tree.

## On activation

Run each of these in order before phase 1 (`_None._` means skip):

{{ workflow.activation_steps_prepend }}

Hold every entry below as fact for the whole run. Entries prefixed `file:` are paths or globs under `{project-root}` to read; the rest are facts verbatim (`_None._` means none):

{{ workflow.persistent_facts }}

Then run each of these in order (`_None._` means skip):

{{ workflow.activation_steps_append }}

## Workflow

### Phase 1: Scope

Find the feature to cover. Check in this order and stop at the first that identifies it:

- **Request or recent conversation.** The triggering prompt and the conversation before it name the feature, flow, directory, or ticket; act on them, and do not start from a blank slate. A ticket is a ref such as `1.2`, a ticket file, or words the user offers as a ticket's title: run `tickets.py find <ref>`, passing a ticket file's folder before its file name.
- **The ticket tree.** Run `tickets.py status`. On a non-zero exit, continue. Otherwise offer the `tickets` rows whose `state` is `review`, `<ref>` and `<title>` each, plus a choice of another target, and HALT for the user's pick. With none, or another target chosen, continue. For a picked ticket, run `tickets.py find <ref>`.
- **Current git state.** If HEAD is not on the default branch, confirm that the feature is what this branch changed against the default branch. HALT for the answer.
- **Ask.** HALT and ask the user what to cover, offering to list the features with no end-to-end coverage, ordered by how much a regression would hurt.

Then list the scenarios the tests must cover, before touching the harness. For a ticket, they come from find's `description` and `verify`, the epic file, the story file when there is one, and the plan's I/O & Edge-Case Matrix when the plan exists. Never write to a ticket file, and never run `tickets.py pull` or `tickets.py mark`. Otherwise read the code behind the feature and list the user-visible scenarios: the main path and the failures a user can actually reach.

Each scenario is one sentence a product person would recognize: who does what, and what they see. Mark the scenarios an existing test already covers. Present the list and HALT for the user's confirmation before writing tests.

### Phase 2: Learn the harness

Read how this project already tests end to end before writing anything: the runner and its config, where end-to-end and API tests live and how they are named, how the app is started for a test run (dev server, containers, test database, fixtures and seeding), how tests authenticate, and the CI job that runs them. Look at whatever the project's ecosystem uses to declare dependencies and tasks, not only `package.json`. The new tests follow what is there: same runner, same layout, same fixtures, same way of starting the app.

Run the existing end-to-end suite, or the closest subset, once before adding to it. A suite that does not pass on the current code is a finding for the report, not something to fix here.

When the project has no end-to-end harness, setting one up is its own change. Propose the runner, where tests go, and how the app will be started under test, and HALT for the user's confirmation before adding a dependency or configuration.

### Phase 3: Write the tests

One test per scenario from Phase 1, named for the scenario. Each test:

- exercises the behavior the way a user or client does: through the UI with locators by role, label, or text, or through the public API, never through internals;
- asserts the visible outcome, not implementation details;
- waits on a condition, never on a duration;
- creates the data it needs and leaves nothing behind that another test could see, so it passes alone and in any order;
- fails for one reason, so the failure names the broken behavior.

Stay with the framework's standard API and the project's existing helpers. Do not build a fixture layer, page-object hierarchy, or utility module for the tests you are adding now.

### Phase 4: Run them

Run the new tests, then run them a second time. For each failure, decide which it is:

- **The test is wrong** (locator, setup, or expectation): fix the test.
- **The harness is wrong** (app not started, data missing, credentials): fix the harness setup.
- **The application is wrong**: the test found a bug. Keep the test as written, mark it the way the framework marks an expected failure with the bug as the reason, and report it. Never weaken an assertion to make a test pass, and never change product code to make it pass.

A test that passes once and fails once is flaky. Find the cause, usually a check that runs before the app has finished or state shared between tests, and fix it. Do not add retries.

### Phase 5: Report

In chat: each scenario covered, with its test file; each scenario from Phase 1 left uncovered, and why; bugs the tests found; product code touched for the harness, if any; and the command that runs the new tests. Do not write a summary file: the tests and their commit are the record.

If anything appears below, follow it as the final terminal instruction before exiting; otherwise exit normally.

{{ workflow.on_complete }}

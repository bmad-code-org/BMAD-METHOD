# BMAD-METHOD™ TDD Methodology Expansion Pack

This expansion pack enhances the BMAD-METHOD™ with comprehensive Test-Driven Development (TDD) capabilities, enabling teams to follow strict TDD practices with AI assistance.

## Features

- Enhanced QA and Dev agent personas with TDD-specific responsibilities
- TDD-aware test design tasks and templates
- Full Red-Green-Refactor cycle support
- TDD quality gates and validation
- CI/CD integration for TDD enforcement
- Practical examples and demos

## Components

### Agent Enhancements

- QA Agent: Enhanced for TDD Red phase and test creation
- Dev Agent: Enhanced for TDD Green phase implementation

### New Commands

- `*tdd-start`: Initialize TDD workflow for a story
- `*write-failing-tests`: Generate failing tests (Red phase)
- `*tdd-implement`: Implement code to make tests pass (Green phase)
- `*tdd-refactor`: Safe refactoring with test coverage

### Quality Gates

- Phase-specific quality criteria
- Automated validation through CI/CD
- TDD discipline enforcement

### Templates and Tasks

- Enhanced test design task with TDD support
- TDD quality gates template
- CI/CD workflow templates

### Guard Scripts

- TDD discipline validation
- Git diff inspection
- CI pipeline integration

## Installation

1. Copy the contents of this expansion pack to your BMAD-METHOD implementation
2. Configure your CI/CD pipeline using the provided templates
3. Update your agent configurations to include TDD capabilities

## Usage

1. Initialize TDD mode for a story:

   ```
   *tdd-start "Story description"
   ```

2. Follow the Red-Green-Refactor cycle:
   - Red: `*write-failing-tests`
   - Green: `*tdd-implement`
   - Refactor: `*tdd-refactor`

3. Monitor quality gates and CI/CD pipeline for TDD compliance

## Example

See the `examples/tdd-demo` directory for a complete demonstration of the TDD workflow using the "User Email Validation" story.

## Configuration

The TDD methodology can be enabled/disabled per project or story through configuration flags. See the documentation for detailed configuration options.

## Contributing

Contributions to improve the TDD methodology expansion pack are welcome. Please follow the standard BMAD-METHOD contribution guidelines.

## License

This expansion pack is released under the same license as the BMAD-METHOD™.

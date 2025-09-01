# BMAD-METHOD™ TDD Methodology Expansion Pack

[![Status](https://img.shields.io/badge/status-production_ready-green)]()
[![TDD](https://img.shields.io/badge/methodology-TDD-blue)]()
[![Integration](https://img.shields.io/badge/integration-excellent-brightgreen)]()

This expansion pack enhances the BMAD-METHOD™ with comprehensive Test-Driven Development (TDD) capabilities, enabling teams to follow strict TDD practices with AI assistance.

## 🚀 Production Ready

**✅ EVALUATION COMPLETE**: This expansion pack has been thoroughly tested and evaluated on a real project (Calculator Demo). See [evaluation report](../../examples/tdd-demo-calculator/TDD_EVALUATION_REPORT.md) for detailed findings.

## Features

- 🧪 Enhanced QA and Dev agent personas with TDD-specific responsibilities
- 📋 TDD-aware test design tasks and templates
- 🔄 Full Red-Green-Refactor cycle support
- ✅ TDD quality gates and validation
- 🚀 CI/CD integration for TDD enforcement
- 💡 Practical examples and demos with complete working project

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

## Examples

### 🧮 Calculator Demo (Complete Working Example)

See `../../examples/tdd-demo-calculator/` for a complete demonstration of the TDD workflow:

- ✅ Full Red-Green-Refactor cycle completed
- ✅ 21 comprehensive test cases
- ✅ 100% test coverage achieved
- ✅ Complete story documentation
- ✅ Evaluation report with findings

### 📧 User Email Validation (Template Example)

See the `examples/tdd-demo/` directory for a template demonstration using the "User Email Validation" story.

## 📊 Evaluation Results

**Framework Rating: 9.5/10** - Production Ready ✅

- ✅ **Integration:** Seamless integration with core BMAD framework
- ✅ **Documentation:** Comprehensive and clear
- ✅ **Quality:** 100% test coverage maintained throughout TDD cycle
- ✅ **Process:** Complete Red-Green-Refactor workflow validated
- ✅ **Traceability:** Excellent story progression tracking

See detailed [evaluation report](../../examples/tdd-demo-calculator/TDD_EVALUATION_REPORT.md).

## Configuration

The TDD methodology can be enabled/disabled per project or story through configuration flags. See the documentation for detailed configuration options.

## Contributing

Contributions to improve the TDD methodology expansion pack are welcome. Please follow the standard BMAD-METHOD contribution guidelines.

## License

This expansion pack is released under the same license as the BMAD-METHOD™.

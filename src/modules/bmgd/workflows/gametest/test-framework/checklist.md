# Game Test Framework Setup - Validation Checklist

This checklist ensures the framework workflow completes successfully.

---

## Prerequisites

- [ ] Game project exists with identifiable engine
- [ ] Engine type detected (Unity, Unreal, or Godot)
- [ ] No existing test framework conflicts
- [ ] Write permissions to create directories

---

## Engine Detection

- [ ] Engine type correctly identified
- [ ] Engine version detected
- [ ] Project structure understood

---

## Unity-Specific Checks

- [ ] `Assets/Tests/` directory created
- [ ] `EditMode/` subdirectory created with `.asmdef`
- [ ] `PlayMode/` subdirectory created with `.asmdef`
- [ ] Assembly definitions reference game assembly
- [ ] `UNITY_INCLUDE_TESTS` constraint set
- [ ] Sample Edit Mode test created
- [ ] Sample Play Mode test created
- [ ] Tests compile without errors

---

## Unreal-Specific Checks

- [ ] `Source/<ProjectName>Tests/` directory created
- [ ] `<ProjectName>Tests.Build.cs` created
- [ ] Module references game module correctly
- [ ] Sample automation test created
- [ ] Test flags set correctly (`ProductFilter`)
- [ ] Tests compile without errors

---

## Godot-Specific Checks

- [ ] GUT plugin installed in `addons/gut/`
- [ ] `tests/` directory created
- [ ] `tests/unit/` subdirectory created
- [ ] `tests/integration/` subdirectory created
- [ ] `gut_config.json` created
- [ ] Sample test extends `GutTest`
- [ ] `before_each`/`after_each` patterns used
- [ ] Tests run without errors

---

## Sample Tests

- [ ] Sample tests follow engine conventions
- [ ] Tests use Arrange-Act-Assert pattern
- [ ] Tests include proper cleanup
- [ ] Tests demonstrate framework capabilities
- [ ] Tests are syntactically correct

---

## Documentation

- [ ] `tests/README.md` created
- [ ] Setup instructions included
- [ ] Running tests section included
- [ ] CI integration commands included
- [ ] Best practices section included

---

## Quality Checks

- [ ] No compilation/syntax errors
- [ ] No placeholder text left
- [ ] No hardcoded paths (use engine conventions)
- [ ] Cleanup prevents orphan objects
- [ ] Tests are deterministic

---

## Completion Criteria

- [ ] Engine correctly detected
- [ ] Directory structure created
- [ ] Configuration files generated
- [ ] Sample tests run successfully
- [ ] Documentation complete

---

**Completed by:** {name}
**Date:** {date}
**Engine:** {Unity | Unreal | Godot}

<!-- Powered by BMAD-CORE™ -->

# Game Test Automation

**Workflow ID**: `_bmad/bmgd/gametest/automate`
**Version**: 1.0 (BMad v6)

---

## Overview

Generate automated test code for game projects based on test design scenarios or by analyzing existing game code. Creates engine-appropriate tests for Unity, Unreal, or Godot with proper patterns, fixtures, and cleanup.

---

## Preflight Requirements

- ✅ Test framework already initialized (run `framework` workflow first)
- ✅ Test scenarios defined (from `test-design` or ad-hoc)
- ✅ Game code accessible for analysis

---

## Step 1: Analyze Codebase

### Actions

1. **Detect Game Engine**
   - Check for engine-specific project files
   - Load appropriate knowledge fragments

2. **Identify Testable Systems**
   - Pure logic classes (calculators, managers)
   - State machines (AI, gameplay)
   - Data structures (inventory, save data)

3. **Locate Existing Tests**
   - Find test directory structure
   - Identify test patterns already in use
   - Check for test helpers/fixtures

---

## Step 2: Generate Unit Tests

### Unity (C#)

**Knowledge Base Reference**: `knowledge/unity-testing.md`

```csharp
using NUnit.Framework;

[TestFixture]
public class {ClassName}Tests
{
    private {ClassName} _sut; // System Under Test

    [SetUp]
    public void Setup()
    {
        _sut = new {ClassName}();
    }

    [Test]
    public void {MethodName}_When{Condition}_Should{Expectation}()
    {
        // Arrange
        {setup_code}

        // Act
        var result = _sut.{MethodName}({parameters});

        // Assert
        Assert.AreEqual({expected}, result);
    }

    [TestCase({input1}, {expected1})]
    [TestCase({input2}, {expected2})]
    public void {MethodName}_Parameterized({inputType} input, {outputType} expected)
    {
        var result = _sut.{MethodName}(input);
        Assert.AreEqual(expected, result);
    }
}
```

### Unreal (C++)

**Knowledge Base Reference**: `knowledge/unreal-testing.md`

```cpp
#include "Misc/AutomationTest.h"

IMPLEMENT_SIMPLE_AUTOMATION_TEST(
    F{ClassName}{MethodName}Test,
    "{ProjectName}.{Category}.{TestName}",
    EAutomationTestFlags::ApplicationContextMask |
    EAutomationTestFlags::ProductFilter
)

bool F{ClassName}{MethodName}Test::RunTest(const FString& Parameters)
{
    // Arrange
    {setup_code}

    // Act
    auto Result = {ClassName}::{MethodName}({parameters});

    // Assert
    TestEqual("{assertion_message}", Result, {expected});

    return true;
}
```

### Godot (GDScript)

**Knowledge Base Reference**: `knowledge/godot-testing.md`

```gdscript
extends GutTest

var _sut: {ClassName}

func before_each():
    _sut = {ClassName}.new()

func after_each():
    _sut.free()

func test_{method_name}_when_{condition}_should_{expectation}():
    # Arrange
    {setup_code}

    # Act
    var result = _sut.{method_name}({parameters})

    # Assert
    assert_eq(result, {expected}, "{assertion_message}")

func test_{method_name}_parameterized():
    var test_cases = [
        {{"input": {input1}, "expected": {expected1}}},
        {{"input": {input2}, "expected": {expected2}}}
    ]

    for tc in test_cases:
        var result = _sut.{method_name}(tc.input)
        assert_eq(result, tc.expected)
```

---

## Step 3: Generate Integration Tests

### Scene/Level Testing

**Unity Play Mode**:

```csharp
[UnityTest]
public IEnumerator {SceneName}_Loads_WithoutErrors()
{
    SceneManager.LoadScene("{scene_name}");
    yield return new WaitForSeconds(2f);

    var errors = GameObject.FindObjectsOfType<ErrorHandler>()
        .Where(e => e.HasErrors);

    Assert.IsEmpty(errors, "Scene should load without errors");
}
```

**Unreal Functional Test**:

```cpp
void A{TestName}::StartTest()
{
    Super::StartTest();

    // Setup test scenario
    {setup}

    // Verify conditions
    if ({condition})
    {
        FinishTest(EFunctionalTestResult::Succeeded, "{message}");
    }
    else
    {
        FinishTest(EFunctionalTestResult::Failed, "{failure_message}");
    }
}
```

**Godot Integration**:

```gdscript
func test_{feature}_integration():
    var scene = load("res://scenes/{scene}.tscn").instantiate()
    add_child(scene)

    # Wait for scene ready
    await get_tree().process_frame

    # Test interaction
    {test_code}

    # Cleanup
    scene.queue_free()
```

---

## Step 4: Generate Smoke Tests

Create critical path tests that run on every build:

```
Smoke Test Criteria:
1. Game launches without crash
2. Main menu is navigable
3. New game starts successfully
4. Core gameplay loop executes
5. Save/load works
```

### Example Smoke Test

```csharp
// Unity
[UnityTest, Timeout(60000)]
public IEnumerator Smoke_NewGame_StartsSuccessfully()
{
    // Load main menu
    SceneManager.LoadScene("MainMenu");
    yield return new WaitForSeconds(2f);

    // Start new game
    var newGameButton = GameObject.Find("NewGameButton");
    newGameButton.GetComponent<Button>().onClick.Invoke();

    yield return new WaitForSeconds(5f);

    // Verify gameplay loaded
    var player = GameObject.FindWithTag("Player");
    Assert.IsNotNull(player, "Player should exist after new game");
}
```

---

## Step 5: Generate Test Report

After generating tests, create summary:

```markdown
## Automation Summary

**Engine**: {Unity | Unreal | Godot}
**Tests Generated**: {count}

### Test Distribution

| Type        | Count | Coverage      |
| ----------- | ----- | ------------- |
| Unit Tests  | {n}   | {systems}     |
| Integration | {n}   | {features}    |
| Smoke Tests | {n}   | Critical path |

### Files Created

- `tests/unit/{file1}.{ext}`
- `tests/unit/{file2}.{ext}`
- `tests/integration/{file3}.{ext}`

### Next Steps

1. Review generated tests
2. Fill in test-specific logic
3. Run tests to verify
4. Add to CI pipeline
```

---

## Test Patterns

### Common Patterns to Generate

1. **Calculator/Logic Tests** - Pure functions
2. **State Machine Tests** - State transitions
3. **Event Tests** - Signal/delegate firing
4. **Resource Tests** - ScriptableObject/Resource validation
5. **Serialization Tests** - Save/load round-trip

### Anti-Patterns to Avoid

- Testing engine functionality
- Hard-coded waits (use signals/events)
- Tests that depend on execution order
- Tests without cleanup

---

## Deliverables

1. **Unit Test Files** - Per-class test coverage
2. **Integration Test Files** - Feature-level tests
3. **Smoke Test Suite** - Critical path validation
4. **Automation Summary** - Coverage report

---

## Validation

Refer to `checklist.md` for validation criteria.

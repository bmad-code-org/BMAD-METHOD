<!-- Powered by BMAD-CORE™ -->

# Game Test Framework Setup

**Workflow ID**: `_bmad/bmgd/gametest/framework`
**Version**: 1.0 (BMad v6)

---

## Overview

Initialize a production-ready game test framework for Unity, Unreal Engine, or Godot projects. This workflow scaffolds the complete testing infrastructure including unit tests, integration tests, and play mode tests appropriate for the detected game engine.

---

## Preflight Requirements

**Critical:** Verify these requirements before proceeding. If any fail, HALT and notify the user.

- ✅ Game project exists with identifiable engine
- ✅ No test framework already configured (check for existing test directories)
- ✅ Project structure is accessible

---

## Step 1: Detect Game Engine

### Actions

1. **Identify Engine Type**

   Look for engine-specific files:
   - **Unity**: `Assets/`, `ProjectSettings/ProjectSettings.asset`, `*.unity` scene files
   - **Unreal**: `*.uproject`, `Source/`, `Config/DefaultEngine.ini`
   - **Godot**: `project.godot`, `*.tscn`, `*.gd` files

2. **Verify Engine Version**
   - Unity: Check `ProjectSettings/ProjectVersion.txt`
   - Unreal: Check `*.uproject` file for `EngineAssociation`
   - Godot: Check `project.godot` for `config_version`

3. **Check for Existing Test Framework**
   - Unity: Check for `Tests/` folder, `*.Tests.asmdef`
   - Unreal: Check for `Tests/` in Source, `*Tests.Build.cs`
   - Godot: Check for `tests/` folder, GUT plugin in `addons/gut/`

**Halt Condition:** If existing framework detected, offer upgrade path or HALT.

---

## Step 2: Scaffold Framework

### Unity Test Framework

**Knowledge Base Reference**: `knowledge/unity-testing.md`

1. **Create Directory Structure**

   ```
   Assets/
   ├── Tests/
   │   ├── EditMode/
   │   │   ├── EditModeTests.asmdef
   │   │   └── ExampleEditModeTest.cs
   │   └── PlayMode/
   │       ├── PlayModeTests.asmdef
   │       └── ExamplePlayModeTest.cs
   ```

2. **Generate Assembly Definitions**

   `EditModeTests.asmdef`:

   ```json
   {
     "name": "EditModeTests",
     "references": ["<GameAssembly>"],
     "includePlatforms": ["Editor"],
     "defineConstraints": ["UNITY_INCLUDE_TESTS"],
     "optionalUnityReferences": ["TestAssemblies"]
   }
   ```

   `PlayModeTests.asmdef`:

   ```json
   {
     "name": "PlayModeTests",
     "references": ["<GameAssembly>"],
     "includePlatforms": [],
     "defineConstraints": ["UNITY_INCLUDE_TESTS"],
     "optionalUnityReferences": ["TestAssemblies"]
   }
   ```

3. **Generate Sample Tests**

   Edit Mode test example:

   ```csharp
   using NUnit.Framework;

   [TestFixture]
   public class DamageCalculatorTests
   {
       [Test]
       public void Calculate_BaseDamage_ReturnsCorrectValue()
       {
           // Arrange
           var calculator = new DamageCalculator();

           // Act
           float result = calculator.Calculate(100f, 1f);

           // Assert
           Assert.AreEqual(100f, result);
       }
   }
   ```

   Play Mode test example:

   ```csharp
   using System.Collections;
   using NUnit.Framework;
   using UnityEngine;
   using UnityEngine.TestTools;

   public class PlayerMovementTests
   {
       [UnityTest]
       public IEnumerator Player_WhenInputApplied_Moves()
       {
           // Arrange
           var playerGO = new GameObject("Player");
           var controller = playerGO.AddComponent<PlayerController>();

           // Act
           controller.SetMoveInput(Vector2.right);
           yield return new WaitForSeconds(0.5f);

           // Assert
           Assert.Greater(playerGO.transform.position.x, 0f);

           // Cleanup
           Object.Destroy(playerGO);
       }
   }
   ```

---

### Unreal Engine Automation

**Knowledge Base Reference**: `knowledge/unreal-testing.md`

1. **Create Directory Structure**

   ```
   Source/
   ├── <ProjectName>/
   │   └── ...
   └── <ProjectName>Tests/
       ├── <ProjectName>Tests.Build.cs
       └── Private/
           ├── DamageCalculationTests.cpp
           └── PlayerCombatTests.cpp
   ```

2. **Generate Module Build File**

   `<ProjectName>Tests.Build.cs`:

   ```csharp
   using UnrealBuildTool;

   public class <ProjectName>Tests : ModuleRules
   {
       public <ProjectName>Tests(ReadOnlyTargetRules Target) : base(Target)
       {
           PCHUsage = ModuleRules.PCHUsageMode.UseExplicitOrSharedPCHs;

           PublicDependencyModuleNames.AddRange(new string[] {
               "Core",
               "CoreUObject",
               "Engine",
               "<ProjectName>"
           });

           PrivateDependencyModuleNames.AddRange(new string[] {
               "AutomationController"
           });
       }
   }
   ```

3. **Generate Sample Tests**

   ```cpp
   #include "Misc/AutomationTest.h"

   IMPLEMENT_SIMPLE_AUTOMATION_TEST(
       FDamageCalculationTest,
       "<ProjectName>.Combat.DamageCalculation",
       EAutomationTestFlags::ApplicationContextMask |
       EAutomationTestFlags::ProductFilter
   )

   bool FDamageCalculationTest::RunTest(const FString& Parameters)
   {
       // Arrange
       float BaseDamage = 100.f;
       float CritMultiplier = 2.f;

       // Act
       float Result = UDamageCalculator::Calculate(BaseDamage, CritMultiplier);

       // Assert
       TestEqual("Critical hit doubles damage", Result, 200.f);

       return true;
   }
   ```

---

### Godot GUT Framework

**Knowledge Base Reference**: `knowledge/godot-testing.md`

1. **Create Directory Structure**

   ```
   project/
   ├── addons/
   │   └── gut/ (plugin files)
   ├── tests/
   │   ├── unit/
   │   │   └── test_damage_calculator.gd
   │   └── integration/
   │       └── test_player_combat.gd
   └── gut_config.json
   ```

2. **Generate GUT Configuration**

   `gut_config.json`:

   ```json
   {
     "dirs": ["res://tests/"],
     "include_subdirs": true,
     "prefix": "test_",
     "suffix": ".gd",
     "should_exit": true,
     "should_exit_on_success": true,
     "log_level": 1,
     "junit_xml_file": "results.xml"
   }
   ```

3. **Generate Sample Tests**

   `tests/unit/test_damage_calculator.gd`:

   ```gdscript
   extends GutTest

   var calculator: DamageCalculator

   func before_each():
       calculator = DamageCalculator.new()

   func after_each():
       calculator.free()

   func test_calculate_base_damage():
       var result = calculator.calculate(100.0, 1.0)
       assert_eq(result, 100.0, "Base damage should equal input")

   func test_calculate_critical_hit():
       var result = calculator.calculate(100.0, 2.0)
       assert_eq(result, 200.0, "Critical hit should double damage")
   ```

---

## Step 3: Generate Documentation

Create `tests/README.md` with:

- Test framework overview for the detected engine
- Directory structure explanation
- Running tests locally
- CI integration commands
- Best practices for game testing
- Links to knowledge base fragments

---

## Step 4: Deliverables

### Primary Artifacts Created

1. **Directory Structure** - Engine-appropriate test folders
2. **Configuration Files** - Framework-specific config (asmdef, Build.cs, gut_config.json)
3. **Sample Tests** - Working examples for unit and integration tests
4. **Documentation** - `tests/README.md`

---

## Output Summary

After completing this workflow, provide a summary:

```markdown
## Game Test Framework Scaffold Complete

**Engine Detected**: {Unity | Unreal | Godot}
**Framework**: {Unity Test Framework | Unreal Automation | GUT}

**Artifacts Created**:

- ✅ Test directory structure
- ✅ Framework configuration
- ✅ Sample unit tests
- ✅ Sample integration/play mode tests
- ✅ Documentation

**Next Steps**:

1. Review sample tests and adapt to your game
2. Run initial tests to verify setup
3. Use `test-design` workflow to plan comprehensive test coverage
4. Use `automate` workflow to generate additional tests

**Knowledge Base References Applied**:

- {engine}-testing.md
- qa-automation.md
- test-priorities.md
```

---

## Validation

Refer to `checklist.md` for comprehensive validation criteria.

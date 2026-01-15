<!-- Powered by BMAD-CORE™ -->

# E2E Test Infrastructure Scaffold

**Workflow ID**: `_bmad/bmgd/gametest/e2e-scaffold`
**Version**: 1.0 (BMad v6)

---

## Overview

Scaffold complete E2E testing infrastructure for an existing game project. This workflow creates the foundation required for reliable, maintainable end-to-end tests: test fixtures, scenario builders, input simulators, and async assertion utilities — all tailored to the project's specific architecture.

E2E tests validate complete player journeys. Without proper infrastructure, they become brittle nightmares. This workflow prevents that.

---

## Preflight Requirements

**Critical:** Verify these requirements before proceeding. If any fail, HALT and guide the user.

- ✅ Test framework already initialized (run `test-framework` workflow first)
- ✅ Game has identifiable state manager class
- ✅ Main gameplay scene exists and is functional
- ✅ No existing E2E infrastructure (check for `Tests/PlayMode/E2E/`)

**Knowledge Base:** Load `knowledge/e2e-testing.md` before proceeding.

---

## Step 1: Analyze Game Architecture

### 1.1 Detect Game Engine

Identify engine type by checking for:

- **Unity**: `Assets/`, `ProjectSettings/`, `*.unity` scenes
- **Unreal**: `*.uproject`, `Source/`, `Config/DefaultEngine.ini`
- **Godot**: `project.godot`, `*.tscn`, `*.gd` files

Load the appropriate engine-specific knowledge fragment:
- Unity: `knowledge/unity-testing.md`
- Unreal: `knowledge/unreal-testing.md`
- Godot: `knowledge/godot-testing.md`

### 1.2 Identify Core Systems

Locate and document:

1. **Game State Manager**
   - Primary class that holds game state
   - Look for: `GameManager`, `GameStateManager`, `GameController`, `GameMode`
   - Note: initialization method, ready state property, save/load methods

2. **Input Handling**
   - Unity: New Input System (`InputSystem` package) vs Legacy (`Input.GetKey`)
   - Unreal: Enhanced Input vs Legacy
   - Godot: Built-in Input singleton
   - Custom input abstraction layer

3. **Event/Messaging System**
   - Event bus pattern
   - C# events/delegates
   - UnityEvents
   - Signals (Godot)

4. **Scene Structure**
   - Main gameplay scene name
   - Scene loading approach (additive, single)
   - Bootstrap/initialization flow

### 1.3 Identify Domain Concepts

For the ScenarioBuilder, identify:

- **Primary Entities**: Units, players, items, enemies, etc.
- **State Machine States**: Turn phases, game modes, player states
- **Spatial System**: Grid/hex positions, world coordinates, regions
- **Resources**: Currency, health, mana, ammunition, etc.

### 1.4 Check Existing Test Structure

```
Expected structure after test-framework workflow:
Tests/
├── EditMode/
│   └── ... (unit tests)
└── PlayMode/
    └── ... (integration tests)
```

If `Tests/PlayMode/E2E/` already exists, HALT and ask user how to proceed.

---

## Step 2: Generate Infrastructure

### 2.1 Create Directory Structure

```
Tests/PlayMode/E2E/
├── E2E.asmdef
├── Infrastructure/
│   ├── GameE2ETestFixture.cs
│   ├── ScenarioBuilder.cs
│   ├── InputSimulator.cs
│   └── AsyncAssert.cs
├── Scenarios/
│   └── (empty - user will add tests here)
├── TestData/
│   └── (empty - user will add fixtures here)
└── README.md
```

### 2.2 Generate Assembly Definition

**Unity: `E2E.asmdef`**

```json
{
  "name": "E2E",
  "rootNamespace": "{ProjectNamespace}.Tests.E2E",
  "references": [
    "{GameAssemblyName}",
    "Unity.InputSystem",
    "Unity.InputSystem.TestFramework"
  ],
  "includePlatforms": [],
  "excludePlatforms": [],
  "allowUnsafeCode": false,
  "overrideReferences": true,
  "precompiledReferences": [
    "nunit.framework.dll",
    "UnityEngine.TestRunner.dll",
    "UnityEditor.TestRunner.dll"
  ],
  "autoReferenced": false,
  "defineConstraints": [
    "UNITY_INCLUDE_TESTS"
  ],
  "versionDefines": [],
  "noEngineReferences": false
}
```

**Notes:**
- Replace `{ProjectNamespace}` with detected project namespace
- Replace `{GameAssemblyName}` with main game assembly
- Include `Unity.InputSystem` references only if Input System package detected

### 2.3 Generate GameE2ETestFixture

This is the base class all E2E tests inherit from.

**Unity Template:**

```csharp
using System.Collections;
using NUnit.Framework;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.TestTools;

namespace {Namespace}.Tests.E2E
{
    /// <summary>
    /// Base fixture for all E2E tests. Handles scene loading, game initialization,
    /// and provides access to core test utilities.
    /// </summary>
    public abstract class GameE2ETestFixture
    {
        /// <summary>
        /// Override to specify a different scene for specific test classes.
        /// </summary>
        protected virtual string SceneName => "{MainSceneName}";
        
        /// <summary>
        /// Primary game state manager reference.
        /// </summary>
        protected {GameStateClass} GameState { get; private set; }
        
        /// <summary>
        /// Input simulation utility.
        /// </summary>
        protected InputSimulator Input { get; private set; }
        
        /// <summary>
        /// Scenario configuration builder.
        /// </summary>
        protected ScenarioBuilder Scenario { get; private set; }
        
        [UnitySetUp]
        public IEnumerator BaseSetUp()
        {
            // Load the game scene
            yield return SceneManager.LoadSceneAsync(SceneName);
            yield return null; // Wait one frame for Awake/Start
            
            // Get core references
            GameState = Object.FindFirstObjectByType<{GameStateClass}>();
            Assert.IsNotNull(GameState, 
                $"{nameof({GameStateClass})} not found in scene '{SceneName}'");
            
            // Initialize test utilities
            Input = new InputSimulator();
            Scenario = new ScenarioBuilder(GameState);
            
            // Wait for game to reach ready state
            yield return WaitForGameReady();
            
            // Call derived class setup
            yield return SetUp();
        }
        
        [UnityTearDown]
        public IEnumerator BaseTearDown()
        {
            // Call derived class teardown first
            yield return TearDown();
            
            // Reset input state
            Input?.Reset();
            
            // Clear references
            GameState = null;
            Input = null;
            Scenario = null;
        }
        
        /// <summary>
        /// Override for test-class-specific setup. Called after scene loads and game is ready.
        /// </summary>
        protected virtual IEnumerator SetUp()
        {
            yield return null;
        }
        
        /// <summary>
        /// Override for test-class-specific teardown. Called before base cleanup.
        /// </summary>
        protected virtual IEnumerator TearDown()
        {
            yield return null;
        }
        
        /// <summary>
        /// Waits until the game reaches a playable state.
        /// </summary>
        protected virtual IEnumerator WaitForGameReady(float timeout = 10f)
        {
            yield return AsyncAssert.WaitUntil(
                () => GameState != null && GameState.{IsReadyProperty},
                "Game to reach ready state",
                timeout);
        }
        
        /// <summary>
        /// Captures screenshot on test failure for debugging.
        /// </summary>
        protected IEnumerator CaptureFailureScreenshot()
        {
            if (TestContext.CurrentContext.Result.Outcome.Status == 
                NUnit.Framework.Interfaces.TestStatus.Failed)
            {
                var texture = ScreenCapture.CaptureScreenshotAsTexture();
                var bytes = texture.EncodeToPNG();
                var testName = TestContext.CurrentContext.Test.Name;
                var path = $"TestResults/E2E_Failure_{testName}_{System.DateTime.Now:yyyyMMdd_HHmmss}.png";
                
                System.IO.Directory.CreateDirectory("TestResults");
                System.IO.File.WriteAllBytes(path, bytes);
                Debug.Log($"[E2E] Failure screenshot saved: {path}");
                
                Object.Destroy(texture);
            }
            yield return null;
        }
    }
}
```

**Customization Points:**
- `{Namespace}`: Project namespace (e.g., `AugustStorm`)
- `{MainSceneName}`: Detected main gameplay scene
- `{GameStateClass}`: Identified game state manager class
- `{IsReadyProperty}`: Property indicating game is initialized (e.g., `IsReady`, `IsInitialized`)

### 2.4 Generate ScenarioBuilder

Fluent API for configuring test scenarios. This must be customized to the game's domain.

**Unity Template:**

```csharp
using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace {Namespace}.Tests.E2E
{
    /// <summary>
    /// Fluent builder for configuring E2E test scenarios.
    /// Add domain-specific methods as needed for your game.
    /// </summary>
    public class ScenarioBuilder
    {
        private readonly {GameStateClass} _gameState;
        private readonly List<Func<IEnumerator>> _setupActions = new();
        
        public ScenarioBuilder({GameStateClass} gameState)
        {
            _gameState = gameState;
        }
        
        #region State Configuration
        
        /// <summary>
        /// Load a pre-configured scenario from a save file.
        /// </summary>
        public ScenarioBuilder FromSaveFile(string fileName)
        {
            _setupActions.Add(() => LoadSaveFile(fileName));
            return this;
        }
        
        // TODO: Add domain-specific configuration methods
        // Examples for a turn-based strategy game:
        //
        // public ScenarioBuilder WithUnit(Faction faction, Hex position, int mp = 6)
        // {
        //     _setupActions.Add(() => SpawnUnit(faction, position, mp));
        //     return this;
        // }
        //
        // public ScenarioBuilder OnTurn(int turnNumber)
        // {
        //     _setupActions.Add(() => SetTurn(turnNumber));
        //     return this;
        // }
        //
        // public ScenarioBuilder WithActiveFaction(Faction faction)
        // {
        //     _setupActions.Add(() => SetActiveFaction(faction));
        //     return this;
        // }
        
        #endregion
        
        #region Execution
        
        /// <summary>
        /// Execute all configured setup actions.
        /// </summary>
        public IEnumerator Build()
        {
            foreach (var action in _setupActions)
            {
                yield return action();
                yield return null; // Allow state to propagate
            }
            _setupActions.Clear();
        }
        
        /// <summary>
        /// Clear pending actions without executing.
        /// </summary>
        public void Reset()
        {
            _setupActions.Clear();
        }
        
        #endregion
        
        #region Private Implementation
        
        private IEnumerator LoadSaveFile(string fileName)
        {
            var path = $"TestData/{fileName}";
            // TODO: Implement save loading based on your save system
            // yield return _gameState.LoadGame(path);
            Debug.Log($"[ScenarioBuilder] Loading scenario from: {path}");
            yield return null;
        }
        
        // TODO: Implement domain-specific setup methods
        // private IEnumerator SpawnUnit(Faction faction, Hex position, int mp)
        // {
        //     var unit = _gameState.SpawnUnit(faction, position);
        //     unit.MovementPoints = mp;
        //     yield return null;
        // }
        
        #endregion
    }
}
```

**Note to Agent:** After generating the template, analyze the game's domain model and add 3-5 concrete configuration methods based on identified entities (Step 1.3).

### 2.5 Generate InputSimulator

Abstract player input for deterministic testing.

**Unity Template (New Input System):**

```csharp
using System.Collections;
using UnityEngine;
using UnityEngine.InputSystem;
using UnityEngine.InputSystem.LowLevel;

namespace {Namespace}.Tests.E2E
{
    /// <summary>
    /// Simulates player input for E2E tests.
    /// </summary>
    public class InputSimulator
    {
        private Mouse _mouse;
        private Keyboard _keyboard;
        private Camera _camera;
        
        public InputSimulator()
        {
            _mouse = Mouse.current ?? InputSystem.AddDevice<Mouse>();
            _keyboard = Keyboard.current ?? InputSystem.AddDevice<Keyboard>();
            _camera = Camera.main;
        }
        
        #region Mouse Input
        
        /// <summary>
        /// Click at a world position.
        /// </summary>
        public IEnumerator ClickWorldPosition(Vector3 worldPos)
        {
            var screenPos = _camera.WorldToScreenPoint(worldPos);
            yield return ClickScreenPosition(new Vector2(screenPos.x, screenPos.y));
        }
        
        /// <summary>
        /// Click at a screen position.
        /// </summary>
        public IEnumerator ClickScreenPosition(Vector2 screenPos)
        {
            // Move mouse to position
            InputState.Change(_mouse.position, screenPos);
            yield return null;
            
            // Press
            using (StateEvent.From(_mouse, out var eventPtr))
            {
                _mouse.CopyState<MouseState>(eventPtr);
                _mouse.leftButton.WriteValueIntoEvent(1f, eventPtr);
                InputSystem.QueueEvent(eventPtr);
            }
            yield return null;
            
            // Release
            using (StateEvent.From(_mouse, out var eventPtr))
            {
                _mouse.CopyState<MouseState>(eventPtr);
                _mouse.leftButton.WriteValueIntoEvent(0f, eventPtr);
                InputSystem.QueueEvent(eventPtr);
            }
            yield return null;
        }
        
        /// <summary>
        /// Click a UI button by name.
        /// </summary>
        public IEnumerator ClickButton(string buttonName)
        {
            var button = GameObject.Find(buttonName)?
                .GetComponent<UnityEngine.UI.Button>();

            if (button == null)
            {
                // Search in inactive objects within loaded scenes only
                var buttons = Object.FindObjectsByType<UnityEngine.UI.Button>(
                    FindObjectsInactive.Include, FindObjectsSortMode.None);
                foreach (var b in buttons)
                {
                    if (b.name == buttonName && b.gameObject.scene.isLoaded)
                    {
                        button = b;
                        break;
                    }
                }
            }

            UnityEngine.Assertions.Assert.IsNotNull(button,
                $"Button '{buttonName}' not found in active scenes");

            if (!button.interactable)
            {
                Debug.LogWarning($"[InputSimulator] Button '{buttonName}' is not interactable");
            }

            button.onClick.Invoke();
            yield return null;
        }
        
        /// <summary>
        /// Drag from one world position to another.
        /// </summary>
        public IEnumerator DragFromTo(Vector3 from, Vector3 to, float duration = 0.3f)
        {
            var fromScreen = (Vector2)_camera.WorldToScreenPoint(from);
            var toScreen = (Vector2)_camera.WorldToScreenPoint(to);
            
            // Move to start
            InputState.Change(_mouse.position, fromScreen);
            yield return null;
            
            // Press
            using (StateEvent.From(_mouse, out var eventPtr))
            {
                _mouse.CopyState<MouseState>(eventPtr);
                _mouse.leftButton.WriteValueIntoEvent(1f, eventPtr);
                InputSystem.QueueEvent(eventPtr);
            }
            yield return null;
            
            // Drag
            var elapsed = 0f;
            while (elapsed < duration)
            {
                var t = elapsed / duration;
                var pos = Vector2.Lerp(fromScreen, toScreen, t);
                InputState.Change(_mouse.position, pos);
                yield return null;
                elapsed += Time.deltaTime;
            }
            
            // Release at destination
            InputState.Change(_mouse.position, toScreen);
            using (StateEvent.From(_mouse, out var eventPtr))
            {
                _mouse.CopyState<MouseState>(eventPtr);
                _mouse.leftButton.WriteValueIntoEvent(0f, eventPtr);
                InputSystem.QueueEvent(eventPtr);
            }
            yield return null;
        }
        
        #endregion
        
        #region Keyboard Input
        
        /// <summary>
        /// Press and release a key.
        /// </summary>
        public IEnumerator PressKey(Key key)
        {
            var control = _keyboard[key];
            using (StateEvent.From(_keyboard, out var eventPtr))
            {
                control.WriteValueIntoEvent(1f, eventPtr);
                InputSystem.QueueEvent(eventPtr);
            }
            yield return null;
            
            using (StateEvent.From(_keyboard, out var eventPtr))
            {
                control.WriteValueIntoEvent(0f, eventPtr);
                InputSystem.QueueEvent(eventPtr);
            }
            yield return null;
        }
        
        /// <summary>
        /// Hold a key for a duration.
        /// </summary>
        public IEnumerator HoldKey(Key key, float duration)
        {
            var control = _keyboard[key];
            using (StateEvent.From(_keyboard, out var eventPtr))
            {
                control.WriteValueIntoEvent(1f, eventPtr);
                InputSystem.QueueEvent(eventPtr);
            }
            
            yield return new WaitForSeconds(duration);
            
            using (StateEvent.From(_keyboard, out var eventPtr))
            {
                control.WriteValueIntoEvent(0f, eventPtr);
                InputSystem.QueueEvent(eventPtr);
            }
            yield return null;
        }
        
        #endregion
        
        #region Utility
        
        /// <summary>
        /// Reset all input state.
        /// </summary>
        public void Reset()
        {
            if (_mouse != null)
            {
                InputState.Change(_mouse, new MouseState());
            }
            if (_keyboard != null)
            {
                InputState.Change(_keyboard, new KeyboardState());
            }
        }
        
        /// <summary>
        /// Update camera reference (call after scene load if needed).
        /// </summary>
        public void RefreshCamera()
        {
            _camera = Camera.main;
        }
        
        #endregion
    }
}
```

**Unity Template (Legacy Input):**

If legacy input system detected, generate a simpler version using `Input.mousePosition` simulation or UI event triggering.

### 2.6 Generate AsyncAssert

Wait-for-condition assertions with meaningful failure messages.

**Unity Template:**

```csharp
using System;
using System.Collections;
using NUnit.Framework;
using UnityEngine;

namespace {Namespace}.Tests.E2E
{
    /// <summary>
    /// Async assertion utilities for E2E tests.
    /// </summary>
    public static class AsyncAssert
    {
        /// <summary>
        /// Wait until condition is true, or fail with message after timeout.
        /// </summary>
        /// <param name="condition">Condition to wait for</param>
        /// <param name="description">Human-readable description of what we're waiting for</param>
        /// <param name="timeout">Maximum seconds to wait</param>
        public static IEnumerator WaitUntil(
            Func<bool> condition,
            string description,
            float timeout = 5f)
        {
            var elapsed = 0f;
            while (!condition() && elapsed < timeout)
            {
                yield return null;
                elapsed += Time.deltaTime;
            }
            
            Assert.IsTrue(condition(),
                $"Timeout after {timeout:F1}s waiting for: {description}");
        }
        
        /// <summary>
        /// Wait until condition is true, with periodic debug logging.
        /// </summary>
        public static IEnumerator WaitUntilVerbose(
            Func<bool> condition,
            string description,
            float timeout = 5f,
            float logInterval = 1f)
        {
            var elapsed = 0f;
            var lastLog = 0f;
            
            while (!condition() && elapsed < timeout)
            {
                if (elapsed - lastLog >= logInterval)
                {
                    Debug.Log($"[E2E] Waiting for: {description} ({elapsed:F1}s elapsed)");
                    lastLog = elapsed;
                }
                yield return null;
                elapsed += Time.deltaTime;
            }
            
            if (condition())
            {
                Debug.Log($"[E2E] Condition met: {description} (after {elapsed:F1}s)");
            }
            
            Assert.IsTrue(condition(),
                $"Timeout after {timeout:F1}s waiting for: {description}");
        }
        
        /// <summary>
        /// Wait for a value to equal expected.
        /// Note: For floating-point comparisons, use WaitForValueApprox instead
        /// to handle precision issues. This method uses exact equality.
        /// </summary>
        public static IEnumerator WaitForValue<T>(
            Func<T> getter,
            T expected,
            string description,
            float timeout = 5f) where T : IEquatable<T>
        {
            yield return WaitUntil(
                () => expected.Equals(getter()),
                $"{description} to equal '{expected}' (current: '{getter()}')",
                timeout);
        }

        /// <summary>
        /// Wait for a float value within tolerance (handles floating-point precision).
        /// </summary>
        public static IEnumerator WaitForValueApprox(
            Func<float> getter,
            float expected,
            string description,
            float tolerance = 0.0001f,
            float timeout = 5f)
        {
            yield return WaitUntil(
                () => Mathf.Abs(expected - getter()) < tolerance,
                $"{description} to equal ~{expected} ±{tolerance} (current: {getter()})",
                timeout);
        }

        /// <summary>
        /// Wait for a double value within tolerance (handles floating-point precision).
        /// </summary>
        public static IEnumerator WaitForValueApprox(
            Func<double> getter,
            double expected,
            string description,
            double tolerance = 0.0001,
            float timeout = 5f)
        {
            yield return WaitUntil(
                () => Math.Abs(expected - getter()) < tolerance,
                $"{description} to equal ~{expected} ±{tolerance} (current: {getter()})",
                timeout);
        }

        /// <summary>
        /// Wait for a value to not equal a specific value.
        /// </summary>
        public static IEnumerator WaitForValueNot<T>(
            Func<T> getter,
            T notExpected,
            string description,
            float timeout = 5f) where T : IEquatable<T>
        {
            yield return WaitUntil(
                () => !notExpected.Equals(getter()),
                $"{description} to change from '{notExpected}'",
                timeout);
        }
        
        /// <summary>
        /// Wait for a reference to become non-null.
        /// </summary>
        public static IEnumerator WaitForNotNull<T>(
            Func<T> getter,
            string description,
            float timeout = 5f) where T : class
        {
            yield return WaitUntil(
                () => getter() != null,
                $"{description} to exist (not null)",
                timeout);
        }
        
        /// <summary>
        /// Wait for a Unity Object to exist (handles Unity's fake null).
        /// </summary>
        public static IEnumerator WaitForUnityObject<T>(
            Func<T> getter,
            string description,
            float timeout = 5f) where T : UnityEngine.Object
        {
            yield return WaitUntil(
                () => getter() != null, // Unity overloads == for destroyed objects
                $"{description} to exist",
                timeout);
        }
        
        /// <summary>
        /// Assert that a condition does NOT become true within a time window.
        /// Useful for testing that something doesn't happen.
        /// </summary>
        public static IEnumerator AssertNeverTrue(
            Func<bool> condition,
            string description,
            float duration = 1f)
        {
            var elapsed = 0f;
            while (elapsed < duration)
            {
                Assert.IsFalse(condition(),
                    $"Condition unexpectedly became true: {description}");
                yield return null;
                elapsed += Time.deltaTime;
            }
        }
        
        /// <summary>
        /// Wait for a specific number of frames.
        /// Use sparingly - prefer WaitUntil with conditions.
        /// </summary>
        public static IEnumerator WaitFrames(int frameCount)
        {
            for (int i = 0; i < frameCount; i++)
            {
                yield return null;
            }
        }
        
        /// <summary>
        /// Wait for physics to settle (multiple FixedUpdates).
        /// </summary>
        public static IEnumerator WaitForPhysics(int fixedUpdateCount = 3)
        {
            for (int i = 0; i < fixedUpdateCount; i++)
            {
                yield return new WaitForFixedUpdate();
            }
        }
    }
}
```

---

## Step 3: Generate Example Test

Create a working E2E test that exercises the infrastructure and proves it works.

**Unity Template:**

```csharp
using System.Collections;
using NUnit.Framework;
using UnityEngine;
using UnityEngine.TestTools;

namespace {Namespace}.Tests.E2E
{
    /// <summary>
    /// Example E2E tests demonstrating infrastructure usage.
    /// Delete or modify these once you've verified the setup works.
    /// </summary>
    [Category("E2E")]
    public class ExampleE2ETests : GameE2ETestFixture
    {
        [UnityTest]
        public IEnumerator Infrastructure_GameLoadsAndReachesReadyState()
        {
            // This test verifies the E2E infrastructure is working correctly.
            // If this test passes, your infrastructure is properly configured.
            
            // The base fixture already loaded the scene and waited for ready,
            // so if we get here, everything worked.
            
            Assert.IsNotNull(GameState, "GameState should be available");
            Assert.IsNotNull(Input, "InputSimulator should be available");
            Assert.IsNotNull(Scenario, "ScenarioBuilder should be available");
            
            // Verify game is actually ready
            // NOTE: {IsReadyProperty} is a template placeholder. Replace it with your
            // game's actual ready-state property (e.g., IsReady, IsInitialized, HasLoaded).
            yield return AsyncAssert.WaitUntil(
                () => GameState.{IsReadyProperty},
                "Game should be in ready state");
            
            Debug.Log("[E2E] Infrastructure test passed - E2E framework is working!");
        }
        
        [UnityTest]
        public IEnumerator Infrastructure_InputSimulatorCanClickButtons()
        {
            // Test that input simulation works
            // Modify this to click an actual button in your game
            
            // Example: Click a button that should exist in your main scene
            // yield return Input.ClickButton("SomeButtonName");
            // yield return AsyncAssert.WaitUntil(
            //     () => /* button click result */,
            //     "Button click should have effect");
            
            Debug.Log("[E2E] Input simulation test - customize with your UI elements");
            yield return null;
        }
        
        [UnityTest]
        public IEnumerator Infrastructure_ScenarioBuilderCanConfigureState()
        {
            // Test that scenario builder works
            // Modify this to use your domain-specific setup methods
            
            // Example:
            // yield return Scenario
            //     .WithUnit(Faction.Player, new Hex(3, 3))
            //     .OnTurn(1)
            //     .Build();
            // 
            // Assert.AreEqual(1, GameState.TurnNumber);
            
            Debug.Log("[E2E] Scenario builder test - customize with your domain methods");
            yield return Scenario.Build(); // Execute empty builder (no-op)
        }
    }
}
```

---

## Step 4: Generate Documentation

Create a README explaining how to use the E2E infrastructure.

**Template: `Tests/PlayMode/E2E/README.md`**

```markdown
# E2E Testing Infrastructure

End-to-end tests that validate complete player journeys through the game.

## Quick Start

1. Create a new test class inheriting from `GameE2ETestFixture`
2. Use `Scenario` to configure game state
3. Use `Input` to simulate player actions
4. Use `AsyncAssert` to wait for and verify outcomes

## Example Test

```csharp
[UnityTest]
public IEnumerator Player_CanCompleteBasicAction()
{
    // GIVEN: Configured scenario
    yield return Scenario
        .WithSomeSetup()
        .Build();
    
    // WHEN: Player takes action
    yield return Input.ClickButton("ActionButton");
    
    // THEN: Expected outcome occurs
    yield return AsyncAssert.WaitUntil(
        () => GameState.ActionCompleted,
        "Action should complete");
}
```

## Infrastructure Components

### GameE2ETestFixture

Base class for all E2E tests. Provides:
- Automatic scene loading and cleanup
- Access to `GameState`, `Input`, and `Scenario`
- Override `SetUp()` and `TearDown()` for test-specific setup

### ScenarioBuilder

Fluent API for configuring test scenarios. Extend with domain-specific methods:

```csharp
// In ScenarioBuilder.cs, add methods like:
public ScenarioBuilder WithPlayer(Vector3 position)
{
    _setupActions.Add(() => SpawnPlayer(position));
    return this;
}
```

### InputSimulator

Simulates player input:
- `ClickWorldPosition(Vector3)` - Click in 3D space
- `ClickScreenPosition(Vector2)` - Click at screen coordinates
- `ClickButton(string)` - Click UI button by name
- `DragFromTo(Vector3, Vector3)` - Drag gesture
- `PressKey(Key)` - Keyboard input

### AsyncAssert

Async assertions with timeouts:
- `WaitUntil(condition, description, timeout)` - Wait for condition
- `WaitForValue(getter, expected, description)` - Wait for specific value
- `AssertNeverTrue(condition, description, duration)` - Assert something doesn't happen

## Directory Structure

```
E2E/
├── Infrastructure/     # Base classes and utilities (don't modify often)
├── Scenarios/          # Your actual E2E tests go here
└── TestData/           # Save files and fixtures for scenarios
```

## Running Tests

**In Unity Editor:**
- Window → General → Test Runner
- Select "PlayMode" tab
- Filter by "E2E" category

**Command Line:**
```bash
unity -runTests -testPlatform PlayMode -testCategory E2E -batchmode
```

## Best Practices

1. **Use Given-When-Then structure** for readable tests
2. **Wait for conditions, not time** - avoid `WaitForSeconds` as primary sync
3. **One journey per test** - keep tests focused
4. **Descriptive assertions** - include context in failure messages
5. **Clean up state** - don't let tests pollute each other

## Extending the Framework

### Adding Scenario Methods

Edit `ScenarioBuilder.cs` to add domain-specific setup:

```csharp
public ScenarioBuilder OnLevel(int level)
{
    _setupActions.Add(() => LoadLevel(level));
    return this;
}

private IEnumerator LoadLevel(int level)
{
    _gameState.LoadLevel(level);
    yield return null;
}
```

### Adding Input Methods

Edit `InputSimulator.cs` for game-specific input:

```csharp
public IEnumerator ClickHex(Hex hex)
{
    var worldPos = HexUtils.HexToWorld(hex);
    yield return ClickWorldPosition(worldPos);
}
```

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| Tests timeout waiting for ready | Game init takes too long | Increase timeout in `WaitForGameReady` |
| Input simulation doesn't work | Wrong input system | Check `InputSimulator` matches your setup |
| Flaky tests | Race conditions | Use `AsyncAssert.WaitUntil` instead of `WaitForSeconds` |
| Can't find GameState | Wrong scene or class name | Check `SceneName` and class reference |
```

---

## Step 5: Output Summary

After generating all files, provide this summary:

```markdown
## E2E Infrastructure Scaffold Complete

**Engine**: {Unity | Unreal | Godot}
**Version**: {detected_version}

### Files Created

```
Tests/PlayMode/E2E/
├── E2E.asmdef
├── Infrastructure/
│   ├── GameE2ETestFixture.cs
│   ├── ScenarioBuilder.cs
│   ├── InputSimulator.cs
│   └── AsyncAssert.cs
├── Scenarios/
│   └── (empty)
├── TestData/
│   └── (empty)
├── ExampleE2ETest.cs
└── README.md
```

### Configuration

| Setting | Value |
|---------|-------|
| Game State Class | `{GameStateClass}` |
| Main Scene | `{MainSceneName}` |
| Input System | `{InputSystemType}` |
| Ready Property | `{IsReadyProperty}` |

### Customization Required

1. **ScenarioBuilder**: Add domain-specific setup methods for your game entities
2. **InputSimulator**: Add game-specific input methods (e.g., hex clicking, gesture shortcuts)
3. **ExampleE2ETest**: Modify example tests to use your actual UI elements

### Next Steps

1. ✅ Run `ExampleE2ETests.Infrastructure_GameLoadsAndReachesReadyState` to verify setup
2. 📝 Extend `ScenarioBuilder` with your domain methods
3. 📝 Extend `InputSimulator` with game-specific input helpers
4. 🧪 Use `test-design` workflow to identify E2E scenarios
5. 🤖 Use `automate` workflow to generate E2E tests from scenarios

### Knowledge Applied

- `knowledge/e2e-testing.md` - Core E2E patterns and infrastructure
- `knowledge/{engine}-testing.md` - Engine-specific implementation details
```

---

## Validation

Refer to `checklist.md` for comprehensive validation criteria.

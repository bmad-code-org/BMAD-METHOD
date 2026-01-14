# End-to-End Testing for Games

## Overview

E2E tests validate complete gameplay flows from the player's perspective — the full orchestra, not individual instruments. Unlike integration tests that verify system interactions, E2E tests verify *player journeys* work correctly from start to finish.

This is the difference between "does the damage calculator work with the inventory system?" (integration) and "can a player actually complete a combat encounter from selection to resolution?" (E2E).

## E2E vs Integration vs Unit

| Aspect | Unit | Integration | E2E |
|--------|------|-------------|-----|
| Scope | Single class | System interaction | Complete flow |
| Speed | < 10ms | < 1s | 1-30s |
| Stability | Very stable | Stable | Requires care |
| Example | DamageCalc math | Combat + Inventory | Full combat encounter |
| Dependencies | None/mocked | Some real | All real |
| Catches | Logic bugs | Wiring bugs | Journey bugs |

## The E2E Testing Pyramid Addition

```
           /\
          /  \     Manual Playtesting
         /----\    (Fun, Feel, Experience)
        /      \
       /--------\   E2E Tests
      /          \  (Player Journeys)
     /------------\
    /              \ Integration Tests
   /----------------\ (System Interactions)
  /                  \ Unit Tests
 /____________________\ (Pure Logic)
```

E2E tests sit between integration tests and manual playtesting. They automate what *can* be automated about player experience while acknowledging that "is this fun?" still requires human judgment.

## E2E Infrastructure Requirements

Before writing E2E tests, scaffold supporting infrastructure. Without this foundation, E2E tests become brittle, flaky nightmares that erode trust faster than they build confidence.

### 1. Test Fixture Base Class

Provides scene loading, cleanup, and common utilities. Every E2E test inherits from this.

**Unity Example:**

```csharp
using System.Collections;
using NUnit.Framework;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.TestTools;

public abstract class GameE2ETestFixture
{
    protected virtual string SceneName => "GameScene";
    protected GameStateManager GameState { get; private set; }
    protected InputSimulator Input { get; private set; }
    protected ScenarioBuilder Scenario { get; private set; }
    
    [UnitySetUp]
    public IEnumerator BaseSetUp()
    {
        // Load the game scene
        yield return SceneManager.LoadSceneAsync(SceneName);
        yield return null; // Wait one frame for scene initialization
        
        // Get core references
        GameState = Object.FindFirstObjectByType<GameStateManager>();
        Assert.IsNotNull(GameState, $"GameStateManager not found in {SceneName}");
        
        // Initialize test utilities
        Input = new InputSimulator();
        Scenario = new ScenarioBuilder(GameState);
        
        // Wait for game to be ready
        yield return WaitForGameReady();
    }
    
    [UnityTearDown]
    public IEnumerator BaseTearDown()
    {
        // Clean up any test-spawned objects
        yield return CleanupTestObjects();
        
        // Reset input state
        Input?.Reset();
    }
    
    protected IEnumerator WaitForGameReady(float timeout = 10f)
    {
        yield return AsyncAssert.WaitUntil(
            () => GameState != null && GameState.IsReady,
            "Game ready state",
            timeout);
    }
    
    protected virtual IEnumerator CleanupTestObjects()
    {
        // Override in derived classes for game-specific cleanup
        yield return null;
    }
}
```

**Unreal Example:**

```cpp
// GameE2ETestBase.h
UCLASS()
class AGameE2ETestBase : public AFunctionalTest
{
    GENERATED_BODY()
    
protected:
    UPROPERTY()
    UGameStateManager* GameState;
    
    UPROPERTY()
    UInputSimulator* InputSim;
    
    UPROPERTY()
    UScenarioBuilder* Scenario;
    
    virtual void PrepareTest() override;
    virtual void StartTest() override;
    virtual void CleanUp() override;
    
    void WaitForGameReady(float Timeout = 10.f);
};
```

**Godot Example:**

```gdscript
extends GutTest
class_name GameE2ETestFixture

var game_state: GameStateManager
var input_sim: InputSimulator
var scenario: ScenarioBuilder
var _scene_instance: Node

func before_each():
    # Load game scene
    var scene = load("res://scenes/game.tscn")
    _scene_instance = scene.instantiate()
    add_child(_scene_instance)
    
    # Get references
    game_state = _scene_instance.get_node("GameStateManager")
    input_sim = InputSimulator.new()
    scenario = ScenarioBuilder.new(game_state)
    
    # Wait for ready
    await wait_for_game_ready()

func after_each():
    if _scene_instance:
        _scene_instance.queue_free()
    input_sim = null
    scenario = null

func wait_for_game_ready(timeout: float = 10.0):
    var elapsed = 0.0
    while not game_state.is_ready and elapsed < timeout:
        await get_tree().process_frame
        elapsed += get_process_delta_time()
    assert_true(game_state.is_ready, "Game should be ready")
```

### 2. Scenario Builder (Fluent API)

Configure game state for test scenarios without manual setup. This is the secret sauce — it lets you express test preconditions in domain language.

**Unity Example:**

```csharp
public class ScenarioBuilder
{
    private readonly GameStateManager _gameState;
    private readonly List<Func<IEnumerator>> _setupActions = new();
    
    public ScenarioBuilder(GameStateManager gameState)
    {
        _gameState = gameState;
    }
    
    // Domain-specific setup methods
    public ScenarioBuilder WithUnit(Faction faction, Hex position, int movementPoints = 6)
    {
        _setupActions.Add(() => SpawnUnit(faction, position, movementPoints));
        return this;
    }
    
    public ScenarioBuilder WithTerrain(Hex position, TerrainType terrain)
    {
        _setupActions.Add(() => SetTerrain(position, terrain));
        return this;
    }
    
    public ScenarioBuilder OnTurn(int turnNumber)
    {
        _setupActions.Add(() => SetTurn(turnNumber));
        return this;
    }
    
    public ScenarioBuilder OnPhase(TurnPhase phase)
    {
        _setupActions.Add(() => SetPhase(phase));
        return this;
    }
    
    public ScenarioBuilder WithActiveFaction(Faction faction)
    {
        _setupActions.Add(() => SetActiveFaction(faction));
        return this;
    }
    
    public ScenarioBuilder FromSaveFile(string saveFileName)
    {
        _setupActions.Add(() => LoadSaveFile(saveFileName));
        return this;
    }
    
    // Execute all setup actions
    public IEnumerator Build()
    {
        foreach (var action in _setupActions)
        {
            yield return action();
            yield return null; // Allow state to propagate
        }
        _setupActions.Clear();
    }
    
    // Private implementation methods
    private IEnumerator SpawnUnit(Faction faction, Hex position, int mp)
    {
        var unit = _gameState.SpawnUnit(faction, position);
        unit.MovementPoints = mp;
        yield return null;
    }
    
    private IEnumerator SetTerrain(Hex position, TerrainType terrain)
    {
        _gameState.Map.SetTerrain(position, terrain);
        yield return null;
    }
    
    private IEnumerator SetTurn(int turn)
    {
        _gameState.SetTurnNumber(turn);
        yield return null;
    }
    
    private IEnumerator SetPhase(TurnPhase phase)
    {
        _gameState.SetPhase(phase);
        yield return null;
    }
    
    private IEnumerator SetActiveFaction(Faction faction)
    {
        _gameState.SetActiveFaction(faction);
        yield return null;
    }
    
    private IEnumerator LoadSaveFile(string fileName)
    {
        var path = $"TestData/{fileName}";
        yield return _gameState.LoadGame(path);
    }
}
```

**Usage:**

```csharp
yield return Scenario
    .WithUnit(Faction.Player, new Hex(3, 4), movementPoints: 6)
    .WithUnit(Faction.Enemy, new Hex(5, 4))
    .WithTerrain(new Hex(4, 4), TerrainType.Forest)
    .OnTurn(1)
    .WithActiveFaction(Faction.Player)
    .Build();
```

### 3. Input Simulator

Abstract player input for deterministic testing. Don't simulate raw mouse positions — simulate player *intent*.

**Unity Example (New Input System):**

```csharp
using UnityEngine;
using UnityEngine.InputSystem;

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
    
    public IEnumerator ClickWorldPosition(Vector3 worldPos)
    {
        var screenPos = _camera.WorldToScreenPoint(worldPos);
        yield return ClickScreenPosition(screenPos);
    }
    
    public IEnumerator ClickHex(Hex hex)
    {
        var worldPos = HexUtils.HexToWorld(hex);
        yield return ClickWorldPosition(worldPos);
    }
    
    public IEnumerator ClickScreenPosition(Vector2 screenPos)
    {
        // Move mouse
        InputSystem.QueueStateEvent(_mouse, new MouseState { position = screenPos });
        yield return null;
        
        // Press
        InputSystem.QueueStateEvent(_mouse, new MouseState 
        { 
            position = screenPos, 
            buttons = 1 
        });
        yield return null;
        
        // Release
        InputSystem.QueueStateEvent(_mouse, new MouseState 
        { 
            position = screenPos, 
            buttons = 0 
        });
        yield return null;
    }
    
    public IEnumerator ClickButton(string buttonName)
    {
        var button = GameObject.Find(buttonName)?.GetComponent<UnityEngine.UI.Button>();
        Assert.IsNotNull(button, $"Button '{buttonName}' not found");
        
        button.onClick.Invoke();
        yield return null;
    }
    
    public IEnumerator DragFromTo(Vector3 from, Vector3 to, float duration = 0.5f)
    {
        var fromScreen = _camera.WorldToScreenPoint(from);
        var toScreen = _camera.WorldToScreenPoint(to);
        
        // Start drag
        InputSystem.QueueStateEvent(_mouse, new MouseState 
        { 
            position = fromScreen, 
            buttons = 1 
        });
        yield return null;
        
        // Interpolate drag
        var elapsed = 0f;
        while (elapsed < duration)
        {
            var t = elapsed / duration;
            var pos = Vector2.Lerp(fromScreen, toScreen, t);
            InputSystem.QueueStateEvent(_mouse, new MouseState 
            { 
                position = pos, 
                buttons = 1 
            });
            yield return null;
            elapsed += Time.deltaTime;
        }
        
        // End drag
        InputSystem.QueueStateEvent(_mouse, new MouseState 
        { 
            position = toScreen, 
            buttons = 0 
        });
        yield return null;
    }
    
    public IEnumerator PressKey(Key key)
    {
        _keyboard.SetKeyDown(key);
        yield return null;
        _keyboard.SetKeyUp(key);
        yield return null;
    }
    
    public void Reset()
    {
        // Reset any held state
        if (_mouse != null)
        {
            InputSystem.QueueStateEvent(_mouse, new MouseState());
        }
    }
}
```

### 4. Async Assertions

Wait-for-condition assertions with meaningful failure messages. The timeout and message are critical — when tests fail, you need to know *what* it was waiting for.

**Unity Example:**

```csharp
using System;
using System.Collections;
using NUnit.Framework;
using UnityEngine;

public static class AsyncAssert
{
    /// <summary>
    /// Wait until condition is true, or fail with message after timeout.
    /// </summary>
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
            $"Timeout after {timeout}s waiting for: {description}");
    }
    
    /// <summary>
    /// Wait until condition is true, with periodic logging.
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
                Debug.Log($"[E2E] Still waiting for: {description} ({elapsed:F1}s)");
                lastLog = elapsed;
            }
            yield return null;
            elapsed += Time.deltaTime;
        }
        
        Assert.IsTrue(condition(),
            $"Timeout after {timeout}s waiting for: {description}");
    }
    
    /// <summary>
    /// Wait for a specific value, with descriptive failure.
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
            $"{description} to equal {expected} (current: {getter()})",
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
    /// Wait for an event to fire.
    /// </summary>
    public static IEnumerator WaitForEvent<T>(
        Action<Action<T>> subscribe,
        Action<Action<T>> unsubscribe,
        string eventName,
        float timeout = 5f) where T : class
    {
        T received = null;
        Action<T> handler = e => received = e;
        
        subscribe(handler);
        
        yield return WaitUntil(
            () => received != null,
            $"Event '{eventName}' to fire",
            timeout);
        
        unsubscribe(handler);
    }
    
    /// <summary>
    /// Assert that something does NOT happen within a time window.
    /// </summary>
    public static IEnumerator WaitAndAssertNot(
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
}
```

## E2E Test Patterns

### Given-When-Then with Async

The core pattern for E2E tests. Clear structure, readable intent.

```csharp
[UnityTest]
public IEnumerator PlayerCanMoveUnitThroughZOC()
{
    // GIVEN: Soviet unit adjacent to German ZOC
    yield return Scenario
        .WithUnit(Faction.Soviet, new Hex(3, 4), movementPoints: 6)
        .WithUnit(Faction.German, new Hex(4, 4)) // Creates ZOC at adjacent hexes
        .WithActiveFaction(Faction.Soviet)
        .Build();
    
    // WHEN: Player selects unit and moves through ZOC
    yield return Input.ClickHex(new Hex(3, 4)); // Select unit
    yield return AsyncAssert.WaitUntil(
        () => GameState.Selection.HasSelectedUnit,
        "Unit should be selected");
    
    yield return Input.ClickHex(new Hex(5, 4)); // Click destination (through ZOC)
    
    // THEN: Unit arrives with reduced movement points (ZOC cost)
    yield return AsyncAssert.WaitUntil(
        () => GetUnitAt(new Hex(5, 4)) != null,
        "Unit should arrive at destination");
    
    var unit = GetUnitAt(new Hex(5, 4));
    Assert.Less(unit.MovementPoints, 3, 
        "ZOC passage should cost extra movement points");
}
```

### Full Turn Cycle

Testing the complete turn lifecycle.

```csharp
[UnityTest]
public IEnumerator FullTurnCycle_PlayerToAIAndBack()
{
    // GIVEN: Mid-game state with both factions having units
    yield return Scenario
        .FromSaveFile("mid_game_scenario.json")
        .Build();
    
    var startingTurn = GameState.TurnNumber;
    
    // WHEN: Player ends their turn
    yield return Input.ClickButton("EndPhaseButton");
    yield return AsyncAssert.WaitUntil(
        () => GameState.CurrentPhase == TurnPhase.EndPhaseConfirmation,
        "End phase confirmation");
    
    yield return Input.ClickButton("ConfirmButton");
    
    // THEN: AI executes its turn
    yield return AsyncAssert.WaitUntil(
        () => GameState.CurrentFaction == Faction.AI,
        "AI turn should begin");
    
    // AND: Eventually returns to player
    yield return AsyncAssert.WaitUntil(
        () => GameState.CurrentFaction == Faction.Player,
        "Player turn should return",
        timeout: 30f); // AI might take a while
    
    Assert.AreEqual(startingTurn + 1, GameState.TurnNumber,
        "Turn number should increment");
}
```

### Save/Load Round-Trip

Critical for any game with persistence.

```csharp
[UnityTest]
public IEnumerator SaveLoad_PreservesGameState()
{
    // GIVEN: Game in specific state
    yield return Scenario
        .WithUnit(Faction.Player, new Hex(5, 5), movementPoints: 3)
        .OnTurn(7)
        .Build();
    
    var unitPosition = new Hex(5, 5);
    var originalMP = GetUnitAt(unitPosition).MovementPoints;
    var originalTurn = GameState.TurnNumber;
    
    // WHEN: Save and reload
    var savePath = "test_save_roundtrip";
    yield return GameState.SaveGame(savePath);
    
    // Trash the current state
    yield return SceneManager.LoadSceneAsync(SceneName);
    yield return WaitForGameReady();
    
    // Load the save
    yield return GameState.LoadGame(savePath);
    yield return WaitForGameReady();
    
    // THEN: State is preserved
    Assert.AreEqual(originalTurn, GameState.TurnNumber,
        "Turn number should be preserved");
    
    var loadedUnit = GetUnitAt(unitPosition);
    Assert.IsNotNull(loadedUnit, "Unit should exist at saved position");
    Assert.AreEqual(originalMP, loadedUnit.MovementPoints,
        "Movement points should be preserved");
    
    // Cleanup
    var savedFilePath = GameState.GetSavePath(savePath);
    if (System.IO.File.Exists(savedFilePath))
    {
        try
        {
            System.IO.File.Delete(savedFilePath);
        }
        catch (System.IO.IOException ex)
        {
            Debug.LogWarning($"[E2E] Failed to delete test save file '{savedFilePath}': {ex.Message}");
        }
        catch (UnauthorizedAccessException ex)
        {
            Debug.LogWarning($"[E2E] Access denied deleting test save file '{savedFilePath}': {ex.Message}");
        }
    }
}
```

### UI Flow Testing

Testing complete UI journeys.

```csharp
[UnityTest]
public IEnumerator MainMenu_NewGame_ReachesGameplay()
{
    // GIVEN: At main menu
    yield return SceneManager.LoadSceneAsync("MainMenu");
    yield return null;
    
    // WHEN: Start new game flow
    yield return Input.ClickButton("NewGameButton");
    yield return AsyncAssert.WaitUntil(
        () => FindPanel("DifficultySelect") != null,
        "Difficulty selection should appear");
    
    yield return Input.ClickButton("NormalDifficultyButton");
    yield return Input.ClickButton("StartButton");
    
    // THEN: Game scene loads and is playable
    yield return AsyncAssert.WaitUntil(
        () => SceneManager.GetActiveScene().name == "GameScene",
        "Game scene should load",
        timeout: 10f);
    
    yield return WaitForGameReady();
    
    Assert.AreEqual(TurnPhase.PlayerMovement, GameState.CurrentPhase,
        "Should start in player movement phase");
}
```

## What to E2E Test

### High Priority (Test These)

| Category | Why | Examples |
|----------|-----|----------|
| Core gameplay loop | 90% of player time | Select → Move → Attack → End Turn |
| Turn/phase transitions | State machine boundaries | Phase changes, turn handoff |
| Save → Load → Resume | Data integrity | Full round-trip with verification |
| Win/lose conditions | Critical path endpoints | Victory triggers, game over |
| Critical UI flows | First impressions | Menu → Game → Pause → Resume |

### Medium Priority (Test Key Paths)

| Category | Why | Examples |
|----------|-----|----------|
| Undo/redo | Easy to break | Action reversal |
| Multiplayer sync | Complex state | Turn handoff in MP |
| Tutorial flow | First-time experience | Guided sequence |

### Low Priority (Usually Skip for E2E)

| Category | Why | Better Tested By |
|----------|-----|------------------|
| Edge cases | Combinatorial explosion | Unit tests |
| Visual correctness | Subjective, changes often | Manual testing |
| Performance | Needs dedicated tooling | Performance tests |
| Every permutation | Infinite combinations | Unit + integration |
| AI decision quality | Subjective | Playtesting |

## E2E Test Organization

```
Tests/
├── EditMode/
│   └── ... (existing unit tests)
├── PlayMode/
│   ├── Integration/
│   │   └── ... (existing integration tests)
│   └── E2E/
│       ├── E2E.asmdef
│       ├── Infrastructure/
│       │   ├── GameE2ETestFixture.cs
│       │   ├── ScenarioBuilder.cs
│       │   ├── InputSimulator.cs
│       │   └── AsyncAssert.cs
│       ├── Scenarios/
│       │   ├── TurnCycleE2ETests.cs
│       │   ├── MovementE2ETests.cs
│       │   ├── CombatE2ETests.cs
│       │   ├── SaveLoadE2ETests.cs
│       │   └── UIFlowE2ETests.cs
│       └── TestData/
│           ├── mid_game_scenario.json
│           ├── endgame_scenario.json
│           └── edge_case_setup.json
```

### Assembly Definition for E2E

```json
{
  "name": "E2E",
  "references": [
    "GameAssembly"
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
  "defineConstraints": [
    "UNITY_INCLUDE_TESTS"
  ],
  "autoReferenced": false
}
```

## CI Considerations

E2E tests are slower and potentially flaky. Handle with care.

### Separate CI Job

```yaml
# GitHub Actions example
e2e-tests:
  runs-on: ubuntu-latest
  timeout-minutes: 30
  steps:
    - uses: game-ci/unity-test-runner@v4
      with:
        testMode: PlayMode
        projectPath: .
        customParameters: -testCategory E2E
```

### Retry Strategy

```yaml
# Retry flaky tests once before failing
- uses: nick-fields/retry@v2
  with:
    timeout_minutes: 15
    max_attempts: 2
    command: |
      unity-test-runner --category E2E
```

### Failure Artifacts

Capture screenshots and logs on failure:

```csharp
[UnityTearDown]
public IEnumerator CaptureOnFailure()
{
    // Yield first to ensure we're on the main thread for screenshot capture
    yield return null;

    if (TestContext.CurrentContext.Result.Outcome.Status == TestStatus.Failed)
    {
        var screenshot = ScreenCapture.CaptureScreenshotAsTexture();
        var bytes = screenshot.EncodeToPNG();
        var screenshotPath = $"TestResults/Screenshots/{TestContext.CurrentContext.Test.Name}.png";
        System.IO.File.WriteAllBytes(screenshotPath, bytes);

        Debug.Log($"[E2E FAILURE] Screenshot saved: {screenshotPath}");
    }
}
```

### Execution Frequency

| Suite | When | Timeout |
|-------|------|---------|
| Unit tests | Every commit | 5 min |
| Integration | Every commit | 10 min |
| E2E (smoke) | Every commit | 15 min |
| E2E (full) | Nightly | 60 min |

## Avoiding Flaky Tests

E2E tests are notorious for flakiness. Fight it proactively.

### DO

- Use explicit waits with `AsyncAssert.WaitUntil`
- Wait for *game state*, not time
- Clean up thoroughly in TearDown
- Isolate tests completely
- Use deterministic scenarios
- Seed random number generators

### DON'T

- Use `yield return new WaitForSeconds(x)` as primary sync
- Depend on test execution order
- Share state between tests
- Rely on animation timing
- Assume frame-perfect timing
- Skip cleanup "because it's slow"

### Debugging Flaky Tests

```csharp
// Add verbose logging to track down race conditions
[UnityTest]
public IEnumerator FlakyTest_WithDebugging()
{
    Debug.Log($"[E2E] Test start: {Time.frameCount}");
    
    yield return Scenario.Build();
    Debug.Log($"[E2E] Scenario built: {Time.frameCount}");
    
    yield return Input.ClickHex(targetHex);
    Debug.Log($"[E2E] Input sent: {Time.frameCount}, Selection: {GameState.Selection}");
    
    yield return AsyncAssert.WaitUntilVerbose(
        () => ExpectedCondition(),
        "Expected condition",
        timeout: 10f,
        logInterval: 0.5f);
}
```

## Engine-Specific Notes

### Unity

- Use `[UnityTest]` attribute for coroutine-based tests
- Prefer `WaitUntil` over `WaitForSeconds`
- Use `Object.FindFirstObjectByType<T>()` (not the deprecated `FindObjectOfType`)
- Consider `InputTestFixture` for Input System simulation
- Remember: `yield return null` waits one frame

### Unreal

- Use `FFunctionalTest` actors for level-based E2E
- `LatentIt` for async test steps in Automation Framework
- Gauntlet for extended E2E suites running in isolated processes
- `ADD_LATENT_AUTOMATION_COMMAND` for sequenced operations

### Godot

- Use `await` for async operations in GUT
- `await get_tree().create_timer(x).timeout` for timed waits
- Scene instancing provides natural test isolation
- Use `queue_free()` for cleanup, not `free()` (avoids errors)

## Anti-Patterns

### The "Test Everything" Trap

Don't try to E2E test every edge case. That's what unit tests are for.

```csharp
// BAD: Testing edge case via E2E
[UnityTest]
public IEnumerator Movement_WithExactlyZeroMP_CannotMove() // Unit test this
{
    // 30 seconds of setup for a condition unit tests cover
}

// GOOD: E2E tests the journey, unit tests the edge cases
[UnityTest]
public IEnumerator Movement_TypicalPlayerJourney_WorksCorrectly()
{
    // Tests the common path players actually experience
}
```

### The "Magic Sleep" Pattern

```csharp
// BAD: Hoping 2 seconds is enough
yield return new WaitForSeconds(2f);
Assert.IsTrue(condition);

// GOOD: Wait for the actual condition
yield return AsyncAssert.WaitUntil(() => condition, "description");
```

### The "Shared State" Trap

```csharp
// BAD: Tests pollute each other
private static int testCounter = 0; // Shared between tests!

// GOOD: Each test is isolated
[SetUp]
public void Setup()
{
    // Fresh state every test
}
```

## Measuring E2E Test Value

### Coverage Metrics That Matter

- **Journey coverage**: How many critical player paths are tested?
- **Failure detection rate**: How many real bugs do E2E tests catch?
- **False positive rate**: How often do E2E tests fail spuriously?

### Warning Signs

- E2E suite takes > 30 minutes
- Flaky test rate > 5%
- E2E tests duplicate unit test coverage
- Team skips E2E tests because they're "always broken"

### Health Indicators

- E2E tests catch integration bugs unit tests miss
- New features include E2E tests for happy path
- Flaky tests are fixed or removed within a sprint
- E2E suite runs on every PR (at least smoke subset)

# Unity Test Framework Guide

## Overview

Unity provides a built-in Test Framework based on NUnit for writing and running automated tests. It supports Edit Mode tests (run without playing) and Play Mode tests (run during gameplay simulation).

## Test Framework Setup

### Package Installation

```json
// manifest.json - usually pre-installed
{
  "dependencies": {
    "com.unity.test-framework": "1.6.0"
  }
}
```

### Project Structure

```
Assets/
├── Scripts/
│   └── Runtime/
│       ├── Player/
│       │   └── PlayerController.cs
│       └── Combat/
│           └── DamageCalculator.cs
└── Tests/
    ├── EditMode/
    │   └── DamageCalculatorTests.cs
    └── PlayMode/
        └── PlayerMovementTests.cs
```

### Assembly Definitions

Create `.asmdef` files for test assemblies:

```json
// Tests/EditMode/EditModeTests.asmdef
{
  "name": "EditModeTests",
  "references": ["GameAssembly"],
  "includePlatforms": ["Editor"],
  "defineConstraints": ["UNITY_INCLUDE_TESTS"]
}

// Tests/PlayMode/PlayModeTests.asmdef
{
  "name": "PlayModeTests",
  "references": ["GameAssembly"],
  "includePlatforms": [],
  "defineConstraints": ["UNITY_INCLUDE_TESTS"]
}
```

## Edit Mode Tests

Edit Mode tests run in the Editor without entering Play Mode. Best for testing pure logic.

### Basic Test Structure

```csharp
using NUnit.Framework;

[TestFixture]
public class DamageCalculatorTests
{
    private DamageCalculator _calculator;

    [SetUp]
    public void Setup()
    {
        _calculator = new DamageCalculator();
    }

    [Test]
    public void Calculate_BaseDamage_ReturnsCorrectValue()
    {
        float result = _calculator.Calculate(100f, 1f);
        Assert.AreEqual(100f, result);
    }

    [Test]
    public void Calculate_CriticalHit_DoublesDamage()
    {
        float result = _calculator.Calculate(100f, multiplier: 2f);
        Assert.AreEqual(200f, result);
    }

    [TestCase(100f, 0.5f, 50f)]
    [TestCase(100f, 1.5f, 150f)]
    [TestCase(50f, 2f, 100f)]
    public void Calculate_Parameterized_ReturnsExpected(
        float base_, float mult, float expected)
    {
        Assert.AreEqual(expected, _calculator.Calculate(base_, mult));
    }
}
```

### Testing ScriptableObjects

```csharp
[Test]
public void WeaponStats_DPS_CalculatesCorrectly()
{
    var weapon = ScriptableObject.CreateInstance<WeaponStats>();
    weapon.baseDamage = 10f;
    weapon.attacksPerSecond = 2f;

    Assert.AreEqual(20f, weapon.DPS);

    // Cleanup
    Object.DestroyImmediate(weapon);
}
```

## Play Mode Tests

Play Mode tests run during gameplay simulation. Required for testing MonoBehaviours, physics, and runtime behavior.

### Basic Play Mode Test

```csharp
using System.Collections;
using NUnit.Framework;
using UnityEngine;
using UnityEngine.TestTools;

public class PlayerMovementTests
{
    private GameObject _player;
    private PlayerController _controller;

    [SetUp]
    public void Setup()
    {
        _player = new GameObject("Player");
        _controller = _player.AddComponent<PlayerController>();
        _player.AddComponent<Rigidbody>();
        _player.AddComponent<CapsuleCollider>();
    }

    [TearDown]
    public void TearDown()
    {
        Object.Destroy(_player);
    }

    [UnityTest]
    public IEnumerator Move_WhenInputApplied_ChangesPosition()
    {
        Vector3 startPos = _player.transform.position;

        _controller.SetInput(Vector2.right);

        yield return new WaitForSeconds(0.5f);

        Assert.Greater(_player.transform.position.x, startPos.x);
    }

    [UnityTest]
    public IEnumerator Jump_WhenGrounded_BecomesAirborne()
    {
        // Setup ground
        var ground = GameObject.CreatePrimitive(PrimitiveType.Plane);
        _player.transform.position = Vector3.up;

        yield return new WaitForFixedUpdate();

        _controller.Jump();

        yield return new WaitForSeconds(0.1f);

        Assert.IsFalse(_controller.IsGrounded);

        Object.Destroy(ground);
    }
}
```

### Testing Coroutines

```csharp
[UnityTest]
public IEnumerator Attack_Cooldown_PreventsSpam()
{
    _controller.Attack();
    Assert.IsTrue(_controller.IsAttacking);

    _controller.Attack(); // Should be blocked
    Assert.AreEqual(1, _controller.AttackCount);

    yield return new WaitForSeconds(_controller.AttackCooldown + 0.1f);

    _controller.Attack();
    Assert.AreEqual(2, _controller.AttackCount);
}
```

### Scene Testing

```csharp
using UnityEngine.SceneManagement;

[UnityTest]
public IEnumerator MainMenu_StartButton_LoadsGameScene()
{
    SceneManager.LoadScene("MainMenu");
    yield return null; // Wait for scene load

    var startButton = GameObject.Find("StartButton")
        .GetComponent<Button>();
    startButton.onClick.Invoke();

    yield return new WaitForSeconds(1f);

    Assert.AreEqual("GameScene", SceneManager.GetActiveScene().name);
}
```

## Integration Test Patterns

### Prefab Testing

```csharp
[UnityTest]
public IEnumerator EnemyPrefab_Spawns_WithCorrectComponents()
{
    var prefab = Resources.Load<GameObject>("Prefabs/Enemy");
    var instance = Object.Instantiate(prefab);

    yield return null;

    Assert.IsNotNull(instance.GetComponent<EnemyAI>());
    Assert.IsNotNull(instance.GetComponent<Health>());
    Assert.IsNotNull(instance.GetComponent<NavMeshAgent>());

    Object.Destroy(instance);
}
```

### Input System Testing

```csharp
using UnityEngine.InputSystem;

[UnityTest]
public IEnumerator InputAction_Fire_TriggersWeapon()
{
    var keyboard = InputSystem.AddDevice<Keyboard>();

    yield return null;

    Press(keyboard.spaceKey);
    yield return null;

    Assert.IsTrue(_controller.IsFiring);

    Release(keyboard.spaceKey);
    yield return null;

    Assert.IsFalse(_controller.IsFiring);
}
```

## Test Utilities

### Custom Assertions

```csharp
public static class GameAssert
{
    public static void AreApproximatelyEqual(
        Vector3 expected, Vector3 actual, float tolerance = 0.001f)
    {
        Assert.AreEqual(expected.x, actual.x, tolerance);
        Assert.AreEqual(expected.y, actual.y, tolerance);
        Assert.AreEqual(expected.z, actual.z, tolerance);
    }

    public static void IsWithinRange(float value, float min, float max)
    {
        Assert.GreaterOrEqual(value, min);
        Assert.LessOrEqual(value, max);
    }
}
```

### Test Fixtures

```csharp
public class TestScene : IDisposable
{
    public GameObject Player { get; private set; }
    public GameObject Ground { get; private set; }

    public TestScene()
    {
        Ground = GameObject.CreatePrimitive(PrimitiveType.Plane);
        Player = Object.Instantiate(Resources.Load<GameObject>("Player"));
        Player.transform.position = Vector3.up;
    }

    public void Dispose()
    {
        Object.Destroy(Player);
        Object.Destroy(Ground);
    }
}

[UnityTest]
public IEnumerator Player_FallsToGround()
{
    using var scene = new TestScene();

    yield return new WaitForSeconds(1f);

    Assert.Less(scene.Player.transform.position.y, 0.5f);
}
```

## CI Integration

### Command Line Execution

```bash
# Run Edit Mode tests
Unity -runTests -batchmode -projectPath . \
  -testPlatform EditMode \
  -testResults results.xml

# Run Play Mode tests
Unity -runTests -batchmode -projectPath . \
  -testPlatform PlayMode \
  -testResults results.xml
```

### GitHub Actions

```yaml
test:
  runs-on: ubuntu-latest
  steps:
    - uses: game-ci/unity-test-runner@v4
      with:
        projectPath: .
        testMode: all
        artifactsPath: TestResults
```

## Best Practices

### DO

- Test pure logic in Edit Mode (faster execution)
- Use Play Mode only when needed (physics, coroutines, MonoBehaviour)
- Create test fixtures for common setups
- Clean up created GameObjects in TearDown
- Use `[Category]` attributes for test organization
- Run tests before every commit

### DON'T

- Don't test Unity's built-in functionality
- Don't rely on specific frame timing (use WaitForSeconds)
- Don't leave test objects in scenes
- Don't test private methods directly (test through public API)
- Don't create tests that depend on execution order

## Troubleshooting

### Common Issues

| Issue                  | Cause              | Fix                                        |
| ---------------------- | ------------------ | ------------------------------------------ |
| Tests not appearing    | Missing asmdef     | Create test assembly definition            |
| NullReferenceException | Missing Setup      | Ensure [SetUp] initializes all fields      |
| Tests hang             | Infinite coroutine | Add timeout or max iterations              |
| Flaky physics tests    | Timing dependent   | Use WaitForFixedUpdate, increase tolerance |

## End-to-End Testing

For comprehensive E2E testing patterns, infrastructure scaffolding, and 
scenario builders, see **knowledge/e2e-testing.md**.

### Quick E2E Checklist for Unity

- [ ] Create `GameE2ETestFixture` base class
- [ ] Implement `ScenarioBuilder` for your game's domain
- [ ] Create `InputSimulator` wrapping Input System
- [ ] Add `AsyncAssert` utilities
- [ ] Organize E2E tests under `Tests/PlayMode/E2E/`
- [ ] Configure separate CI job for E2E suite

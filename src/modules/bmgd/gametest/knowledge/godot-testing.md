# Godot GUT Testing Guide

## Overview

GUT (Godot Unit Test) is the standard unit testing framework for Godot. It provides a full-featured testing framework with assertions, mocking, and CI integration.

## Installation

### Via Asset Library

1. Open AssetLib in Godot
2. Search for "GUT"
3. Download and install
4. Enable the plugin in Project Settings

### Via Git Submodule

```bash
git submodule add https://github.com/bitwes/Gut.git addons/gut
```

## Project Structure

```
project/
├── addons/
│   └── gut/
├── src/
│   ├── player/
│   │   └── player.gd
│   └── combat/
│       └── damage_calculator.gd
└── tests/
    ├── unit/
    │   └── test_damage_calculator.gd
    └── integration/
        └── test_player_combat.gd
```

## Basic Test Structure

### Simple Test Class

```gdscript
# tests/unit/test_damage_calculator.gd
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

func test_calculate_with_zero_multiplier():
    var result = calculator.calculate(100.0, 0.0)
    assert_eq(result, 0.0, "Zero multiplier should result in zero damage")
```

### Parameterized Tests

```gdscript
func test_damage_scenarios():
    var scenarios = [
        {"base": 100.0, "mult": 1.0, "expected": 100.0},
        {"base": 100.0, "mult": 2.0, "expected": 200.0},
        {"base": 50.0, "mult": 1.5, "expected": 75.0},
        {"base": 0.0, "mult": 2.0, "expected": 0.0},
    ]

    for scenario in scenarios:
        var result = calculator.calculate(scenario.base, scenario.mult)
        assert_eq(
            result,
            scenario.expected,
            "Base %s * %s should equal %s" % [
                scenario.base, scenario.mult, scenario.expected
            ]
        )
```

## Testing Nodes

### Scene Testing

```gdscript
# tests/integration/test_player.gd
extends GutTest

var player: Player
var player_scene = preload("res://src/player/player.tscn")

func before_each():
    player = player_scene.instantiate()
    add_child(player)

func after_each():
    player.queue_free()

func test_player_initial_health():
    assert_eq(player.health, 100, "Player should start with 100 health")

func test_player_takes_damage():
    player.take_damage(30)
    assert_eq(player.health, 70, "Health should be reduced by damage")

func test_player_dies_at_zero_health():
    player.take_damage(100)
    assert_true(player.is_dead, "Player should be dead at 0 health")
```

### Testing with Signals

```gdscript
func test_damage_emits_signal():
    watch_signals(player)

    player.take_damage(10)

    assert_signal_emitted(player, "health_changed")
    assert_signal_emit_count(player, "health_changed", 1)

func test_death_emits_signal():
    watch_signals(player)

    player.take_damage(100)

    assert_signal_emitted(player, "died")
```

### Testing with Await

```gdscript
func test_attack_cooldown():
    player.attack()
    assert_true(player.is_attacking)

    # Wait for cooldown
    await get_tree().create_timer(player.attack_cooldown).timeout

    assert_false(player.is_attacking)
    assert_true(player.can_attack)
```

## Mocking and Doubles

### Creating Doubles

```gdscript
func test_enemy_uses_pathfinding():
    var mock_pathfinding = double(Pathfinding).new()
    stub(mock_pathfinding, "find_path").to_return([Vector2(0, 0), Vector2(10, 10)])

    var enemy = Enemy.new()
    enemy.pathfinding = mock_pathfinding

    enemy.move_to(Vector2(10, 10))

    assert_called(mock_pathfinding, "find_path")
```

### Partial Doubles

```gdscript
func test_player_inventory():
    var player_double = partial_double(Player).new()
    stub(player_double, "save_to_disk").to_do_nothing()

    player_double.add_item("sword")

    assert_eq(player_double.inventory.size(), 1)
    assert_called(player_double, "save_to_disk")
```

## Physics Testing

### Testing Collision

```gdscript
func test_projectile_hits_enemy():
    var projectile = Projectile.new()
    var enemy = Enemy.new()

    add_child(projectile)
    add_child(enemy)

    projectile.global_position = Vector2(0, 0)
    enemy.global_position = Vector2(100, 0)

    projectile.velocity = Vector2(200, 0)

    # Simulate physics frames
    for i in range(60):
        await get_tree().physics_frame

    assert_true(enemy.was_hit, "Enemy should be hit by projectile")

    projectile.queue_free()
    enemy.queue_free()
```

### Testing Area2D

```gdscript
func test_pickup_collected():
    var pickup = Pickup.new()
    var player = player_scene.instantiate()

    add_child(pickup)
    add_child(player)

    pickup.global_position = Vector2(50, 50)
    player.global_position = Vector2(50, 50)

    # Wait for physics to process overlap
    await get_tree().physics_frame
    await get_tree().physics_frame

    assert_true(pickup.is_queued_for_deletion(), "Pickup should be collected")

    player.queue_free()
```

## Input Testing

### Simulating Input

```gdscript
func test_jump_on_input():
    var input_event = InputEventKey.new()
    input_event.keycode = KEY_SPACE
    input_event.pressed = true

    Input.parse_input_event(input_event)
    await get_tree().process_frame

    player._unhandled_input(input_event)

    assert_true(player.is_jumping, "Player should jump on space press")
```

### Testing Input Actions

```gdscript
func test_attack_action():
    # Simulate action press
    Input.action_press("attack")
    await get_tree().process_frame

    player._process(0.016)

    assert_true(player.is_attacking)

    Input.action_release("attack")
```

## Resource Testing

### Testing Custom Resources

```gdscript
func test_weapon_stats_resource():
    var weapon = WeaponStats.new()
    weapon.base_damage = 10.0
    weapon.attack_speed = 2.0

    assert_eq(weapon.dps, 20.0, "DPS should be damage * speed")

func test_save_load_resource():
    var original = PlayerData.new()
    original.level = 5
    original.gold = 1000

    ResourceSaver.save(original, "user://test_save.tres")
    var loaded = ResourceLoader.load("user://test_save.tres")

    assert_eq(loaded.level, 5)
    assert_eq(loaded.gold, 1000)

    DirAccess.remove_absolute("user://test_save.tres")
```

## GUT Configuration

### gut_config.json

```json
{
  "dirs": ["res://tests/"],
  "include_subdirs": true,
  "prefix": "test_",
  "suffix": ".gd",
  "should_exit": true,
  "should_exit_on_success": true,
  "log_level": 1,
  "junit_xml_file": "results.xml",
  "font_size": 16
}
```

## CI Integration

### Command Line Execution

```bash
# Run all tests
godot --headless -s addons/gut/gut_cmdln.gd

# Run specific tests
godot --headless -s addons/gut/gut_cmdln.gd \
  -gdir=res://tests/unit \
  -gprefix=test_

# With JUnit output
godot --headless -s addons/gut/gut_cmdln.gd \
  -gjunit_xml_file=results.xml
```

### GitHub Actions

```yaml
test:
  runs-on: ubuntu-latest
  container:
    image: barichello/godot-ci:4.2
  steps:
    - uses: actions/checkout@v4

    - name: Run Tests
      run: |
        godot --headless -s addons/gut/gut_cmdln.gd \
          -gjunit_xml_file=results.xml

    - name: Publish Results
      uses: mikepenz/action-junit-report@v4
      with:
        report_paths: results.xml
```

## Best Practices

### DO

- Use `before_each`/`after_each` for setup/teardown
- Free nodes after tests to prevent leaks
- Use meaningful assertion messages
- Group related tests in the same file
- Use `watch_signals` for signal testing
- Await physics frames when testing physics

### DON'T

- Don't test Godot's built-in functionality
- Don't rely on execution order between test files
- Don't leave orphan nodes
- Don't use `yield` (use `await` in Godot 4)
- Don't test private methods directly

## Troubleshooting

| Issue                | Cause              | Fix                                  |
| -------------------- | ------------------ | ------------------------------------ |
| Tests not found      | Wrong prefix/path  | Check gut_config.json                |
| Orphan nodes warning | Missing cleanup    | Add `queue_free()` in `after_each`   |
| Signal not detected  | Signal not watched | Call `watch_signals()` before action |
| Physics not working  | Missing frames     | Await `physics_frame`                |
| Flaky tests          | Timing issues      | Use proper await/signals             |

## C# Testing in Godot

Godot 4 supports C# via .NET 6+. You can use standard .NET testing frameworks alongside GUT.

### Project Setup for C#

```
project/
├── addons/
│   └── gut/
├── src/
│   ├── Player/
│   │   └── PlayerController.cs
│   └── Combat/
│       └── DamageCalculator.cs
├── tests/
│   ├── gdscript/
│   │   └── test_integration.gd
│   └── csharp/
│       ├── Tests.csproj
│       └── DamageCalculatorTests.cs
└── project.csproj
```

### C# Test Project Setup

Create a separate test project that references your game assembly:

```xml
<!-- tests/csharp/Tests.csproj -->
<Project Sdk="Godot.NET.Sdk/4.2.0">
  <PropertyGroup>
    <TargetFramework>net6.0</TargetFramework>
    <EnableDynamicLoading>true</EnableDynamicLoading>
    <IsPackable>false</IsPackable>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.NET.Test.Sdk" Version="17.8.0" />
    <PackageReference Include="xunit" Version="2.6.2" />
    <PackageReference Include="xunit.runner.visualstudio" Version="2.5.4" />
    <PackageReference Include="NSubstitute" Version="5.1.0" />
  </ItemGroup>

  <ItemGroup>
    <ProjectReference Include="../../project.csproj" />
  </ItemGroup>
</Project>
```

### Basic C# Unit Tests

```csharp
// tests/csharp/DamageCalculatorTests.cs
using Xunit;
using YourGame.Combat;

public class DamageCalculatorTests
{
    private readonly DamageCalculator _calculator;

    public DamageCalculatorTests()
    {
        _calculator = new DamageCalculator();
    }

    [Fact]
    public void Calculate_BaseDamage_ReturnsCorrectValue()
    {
        var result = _calculator.Calculate(100f, 1f);
        Assert.Equal(100f, result);
    }

    [Fact]
    public void Calculate_CriticalHit_DoublesDamage()
    {
        var result = _calculator.Calculate(100f, 2f);
        Assert.Equal(200f, result);
    }

    [Theory]
    [InlineData(100f, 0.5f, 50f)]
    [InlineData(100f, 1.5f, 150f)]
    [InlineData(50f, 2f, 100f)]
    public void Calculate_Parameterized_ReturnsExpected(
        float baseDamage, float multiplier, float expected)
    {
        var result = _calculator.Calculate(baseDamage, multiplier);
        Assert.Equal(expected, result);
    }
}
```

### Testing Godot Nodes in C#

For tests requiring Godot runtime, use a hybrid approach:

```csharp
// tests/csharp/PlayerControllerTests.cs
using Godot;
using Xunit;
using YourGame.Player;

public class PlayerControllerTests : IDisposable
{
    private readonly SceneTree _sceneTree;
    private PlayerController _player;

    public PlayerControllerTests()
    {
        // These tests must run within Godot runtime
        // Use GodotXUnit or similar adapter
    }

    [GodotFact] // Custom attribute for Godot runtime tests
    public async Task Player_Move_ChangesPosition()
    {
        var startPos = _player.GlobalPosition;

        _player.SetInput(new Vector2(1, 0));

        await ToSignal(GetTree().CreateTimer(0.5f), "timeout");

        Assert.True(_player.GlobalPosition.X > startPos.X);
    }

    public void Dispose()
    {
        _player?.QueueFree();
    }
}
```

### C# Mocking with NSubstitute

```csharp
using NSubstitute;
using Xunit;

public class EnemyAITests
{
    [Fact]
    public void Enemy_UsesPathfinding_WhenMoving()
    {
        var mockPathfinding = Substitute.For<IPathfinding>();
        mockPathfinding.FindPath(Arg.Any<Vector2>(), Arg.Any<Vector2>())
            .Returns(new[] { Vector2.Zero, new Vector2(10, 10) });

        var enemy = new EnemyAI(mockPathfinding);

        enemy.MoveTo(new Vector2(10, 10));

        mockPathfinding.Received().FindPath(
            Arg.Any<Vector2>(),
            Arg.Is<Vector2>(v => v == new Vector2(10, 10)));
    }
}
```

### Running C# Tests

```bash
# Run C# unit tests (no Godot runtime needed)
dotnet test tests/csharp/Tests.csproj

# Run with coverage
dotnet test tests/csharp/Tests.csproj --collect:"XPlat Code Coverage"

# Run specific test
dotnet test tests/csharp/Tests.csproj --filter "FullyQualifiedName~DamageCalculator"
```

### Hybrid Test Strategy

| Test Type     | Framework        | When to Use                        |
| ------------- | ---------------- | ---------------------------------- |
| Pure logic    | xUnit/NUnit (C#) | Classes without Godot dependencies |
| Node behavior | GUT (GDScript)   | MonoBehaviour-like testing         |
| Integration   | GUT (GDScript)   | Scene and signal testing           |
| E2E           | GUT (GDScript)   | Full gameplay flows                |

## End-to-End Testing

For comprehensive E2E testing patterns, infrastructure scaffolding, and
scenario builders, see **knowledge/e2e-testing.md**.

### E2E Infrastructure for Godot

#### GameE2ETestFixture (GDScript)

```gdscript
# tests/e2e/infrastructure/game_e2e_test_fixture.gd
extends GutTest
class_name GameE2ETestFixture

var game_state: GameStateManager
var input_sim: InputSimulator
var scenario: ScenarioBuilder
var _scene_instance: Node

## Override to specify a different scene for specific test classes.
func get_scene_path() -> String:
    return "res://scenes/game.tscn"

func before_each():
    # Load game scene
    var scene = load(get_scene_path())
    _scene_instance = scene.instantiate()
    add_child(_scene_instance)

    # Get references
    game_state = _scene_instance.get_node("GameStateManager")
    assert_not_null(game_state, "GameStateManager not found in scene")

    input_sim = InputSimulator.new()
    scenario = ScenarioBuilder.new(game_state)

    # Wait for ready
    await wait_for_game_ready()

func after_each():
    if _scene_instance:
        _scene_instance.queue_free()
        _scene_instance = null
    input_sim = null
    scenario = null

func wait_for_game_ready(timeout: float = 10.0):
    var elapsed = 0.0
    while not game_state.is_ready and elapsed < timeout:
        await get_tree().process_frame
        elapsed += get_process_delta_time()
    assert_true(game_state.is_ready, "Game should be ready within timeout")
```

#### ScenarioBuilder (GDScript)

```gdscript
# tests/e2e/infrastructure/scenario_builder.gd
extends RefCounted
class_name ScenarioBuilder

var _game_state: GameStateManager
var _setup_actions: Array[Callable] = []

func _init(game_state: GameStateManager):
    _game_state = game_state

## Load a pre-configured scenario from a save file.
func from_save_file(file_name: String) -> ScenarioBuilder:
    _setup_actions.append(func(): await _load_save_file(file_name))
    return self

## Configure the current turn number.
func on_turn(turn_number: int) -> ScenarioBuilder:
    _setup_actions.append(func(): _set_turn(turn_number))
    return self

## Spawn a unit at position.
func with_unit(faction: int, position: Vector2, movement_points: int = 6) -> ScenarioBuilder:
    _setup_actions.append(func(): await _spawn_unit(faction, position, movement_points))
    return self

## Execute all configured setup actions.
func build() -> void:
    for action in _setup_actions:
        await action.call()
    _setup_actions.clear()

## Clear pending actions without executing.
func reset() -> void:
    _setup_actions.clear()

# Private implementation
func _load_save_file(file_name: String) -> void:
    var path = "res://tests/e2e/test_data/%s" % file_name
    await _game_state.load_game(path)

func _set_turn(turn: int) -> void:
    _game_state.set_turn_number(turn)

func _spawn_unit(faction: int, pos: Vector2, mp: int) -> void:
    var unit = _game_state.spawn_unit(faction, pos)
    unit.movement_points = mp
```

#### InputSimulator (GDScript)

```gdscript
# tests/e2e/infrastructure/input_simulator.gd
extends RefCounted
class_name InputSimulator

## Click at a world position.
func click_world_position(world_pos: Vector2) -> void:
    var viewport = Engine.get_main_loop().root.get_viewport()
    var camera = viewport.get_camera_2d()
    var screen_pos = camera.get_screen_center_position() + (world_pos - camera.global_position)
    await click_screen_position(screen_pos)

## Click at a screen position.
func click_screen_position(screen_pos: Vector2) -> void:
    var press = InputEventMouseButton.new()
    press.button_index = MOUSE_BUTTON_LEFT
    press.pressed = true
    press.position = screen_pos

    var release = InputEventMouseButton.new()
    release.button_index = MOUSE_BUTTON_LEFT
    release.pressed = false
    release.position = screen_pos

    Input.parse_input_event(press)
    await Engine.get_main_loop().process_frame
    Input.parse_input_event(release)
    await Engine.get_main_loop().process_frame

## Click a UI button by name.
func click_button(button_name: String) -> void:
    var root = Engine.get_main_loop().root
    var button = _find_button_recursive(root, button_name)
    assert(button != null, "Button '%s' not found in scene tree" % button_name)

    if not button.visible:
        push_warning("[InputSimulator] Button '%s' is not visible" % button_name)
    if button.disabled:
        push_warning("[InputSimulator] Button '%s' is disabled" % button_name)

    button.pressed.emit()
    await Engine.get_main_loop().process_frame

func _find_button_recursive(node: Node, button_name: String) -> Button:
    if node is Button and node.name == button_name:
        return node
    for child in node.get_children():
        var found = _find_button_recursive(child, button_name)
        if found:
            return found
    return null

## Press and release a key.
func press_key(keycode: Key) -> void:
    var press = InputEventKey.new()
    press.keycode = keycode
    press.pressed = true

    var release = InputEventKey.new()
    release.keycode = keycode
    release.pressed = false

    Input.parse_input_event(press)
    await Engine.get_main_loop().process_frame
    Input.parse_input_event(release)
    await Engine.get_main_loop().process_frame

## Simulate an input action.
func action_press(action_name: String) -> void:
    Input.action_press(action_name)
    await Engine.get_main_loop().process_frame

func action_release(action_name: String) -> void:
    Input.action_release(action_name)
    await Engine.get_main_loop().process_frame

## Reset all input state.
func reset() -> void:
    Input.flush_buffered_events()
```

#### AsyncAssert (GDScript)

```gdscript
# tests/e2e/infrastructure/async_assert.gd
extends RefCounted
class_name AsyncAssert

## Wait until condition is true, or fail after timeout.
static func wait_until(
    condition: Callable,
    description: String,
    timeout: float = 5.0
) -> void:
    var elapsed := 0.0
    while not condition.call() and elapsed < timeout:
        await Engine.get_main_loop().process_frame
        elapsed += Engine.get_main_loop().root.get_process_delta_time()

    assert(condition.call(),
        "Timeout after %.1fs waiting for: %s" % [timeout, description])

## Wait for a value to equal expected.
static func wait_for_value(
    getter: Callable,
    expected: Variant,
    description: String,
    timeout: float = 5.0
) -> void:
    await wait_until(
        func(): return getter.call() == expected,
        "%s to equal '%s' (current: '%s')" % [description, expected, getter.call()],
        timeout)

## Wait for a float value within tolerance.
static func wait_for_value_approx(
    getter: Callable,
    expected: float,
    description: String,
    tolerance: float = 0.0001,
    timeout: float = 5.0
) -> void:
    await wait_until(
        func(): return absf(expected - getter.call()) < tolerance,
        "%s to equal ~%s ±%s (current: %s)" % [description, expected, tolerance, getter.call()],
        timeout)

## Assert that condition does NOT become true within duration.
static func assert_never_true(
    condition: Callable,
    description: String,
    duration: float = 1.0
) -> void:
    var elapsed := 0.0
    while elapsed < duration:
        assert(not condition.call(),
            "Condition unexpectedly became true: %s" % description)
        await Engine.get_main_loop().process_frame
        elapsed += Engine.get_main_loop().root.get_process_delta_time()

## Wait for specified number of frames.
static func wait_frames(count: int) -> void:
    for i in range(count):
        await Engine.get_main_loop().process_frame

## Wait for physics to settle.
static func wait_for_physics(frames: int = 3) -> void:
    for i in range(frames):
        await Engine.get_main_loop().root.get_tree().physics_frame
```

### Example E2E Test (GDScript)

```gdscript
# tests/e2e/scenarios/test_combat_flow.gd
extends GameE2ETestFixture

func test_player_can_attack_enemy():
    # GIVEN: Player and enemy in combat range
    await scenario \
        .with_unit(Faction.PLAYER, Vector2(100, 100)) \
        .with_unit(Faction.ENEMY, Vector2(150, 100)) \
        .build()

    var enemy = game_state.get_units(Faction.ENEMY)[0]
    var initial_health = enemy.health

    # WHEN: Player attacks
    await input_sim.click_world_position(Vector2(100, 100))  # Select player
    await AsyncAssert.wait_until(
        func(): return game_state.selected_unit != null,
        "Unit should be selected")

    await input_sim.click_world_position(Vector2(150, 100))  # Attack enemy

    # THEN: Enemy takes damage
    await AsyncAssert.wait_until(
        func(): return enemy.health < initial_health,
        "Enemy should take damage")

func test_turn_cycle_completes():
    # GIVEN: Game in progress
    await scenario.on_turn(1).build()
    var starting_turn = game_state.turn_number

    # WHEN: Player ends turn
    await input_sim.click_button("EndTurnButton")
    await AsyncAssert.wait_until(
        func(): return game_state.current_faction == Faction.ENEMY,
        "Should switch to enemy turn")

    # AND: Enemy turn completes
    await AsyncAssert.wait_until(
        func(): return game_state.current_faction == Faction.PLAYER,
        "Should return to player turn",
        30.0)  # AI might take a while

    # THEN: Turn number incremented
    assert_eq(game_state.turn_number, starting_turn + 1)
```

### Quick E2E Checklist for Godot

- [ ] Create `GameE2ETestFixture` base class extending GutTest
- [ ] Implement `ScenarioBuilder` for your game's domain
- [ ] Create `InputSimulator` wrapping Godot Input
- [ ] Add `AsyncAssert` utilities with proper await
- [ ] Organize E2E tests under `tests/e2e/scenarios/`
- [ ] Configure GUT to include E2E test directory
- [ ] Set up CI with headless Godot execution

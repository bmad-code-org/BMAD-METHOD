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

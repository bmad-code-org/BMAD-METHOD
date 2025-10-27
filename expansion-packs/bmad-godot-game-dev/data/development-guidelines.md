# Game Development Guidelines (Godot, GDScript & C#)

## Overview

This document establishes coding standards, architectural patterns, and development practices for game development using Godot Engine with GDScript and C#. These guidelines ensure consistency, performance (60+ FPS target), maintainability, and enforce Test-Driven Development (TDD) across all game development stories.

## Performance Philosophy

Following John Carmack's principles:

- **"Measure, don't guess"** - Profile everything with Godot's built-in profiler
- **"Focus on what matters: framerate and responsiveness"** - 60+ FPS is the minimum, not the target
- **"The best code is no code"** - Simplicity beats cleverness
- **"Think about cache misses, not instruction counts"** - Memory access patterns matter most

## GDScript Standards

### Naming Conventions

**Classes and Scripts:**

- PascalCase for class names: `PlayerController`, `GameData`, `InventorySystem`
- Snake_case for file names: `player_controller.gd`, `game_data.gd`
- Descriptive names that indicate purpose: `GameStateManager` not `GSM`

**Functions and Methods:**

- Snake_case for functions: `calculate_damage()`, `process_input()`
- Descriptive verb phrases: `activate_shield()` not `shield()`
- Private methods prefix with underscore: `_update_health()`

**Variables and Properties:**

- Snake_case for variables: `player_health`, `movement_speed`
- Constants in UPPER_SNAKE_CASE: `MAX_HEALTH`, `GRAVITY_FORCE`
- Export variables with clear names: `@export var jump_height: float = 5.0`
- Boolean variables with is/has/can prefix: `is_alive`, `has_key`, `can_jump`
- Signal names in snake_case: `health_changed`, `level_completed`

### Static Typing (MANDATORY for Performance)

**Always use static typing for 10-20% performance gain:**

```gdscript
# GOOD - Static typing
extends CharacterBody2D

@export var max_health: int = 100
@export var movement_speed: float = 300.0

var current_health: int
var velocity_multiplier: float = 1.0

func take_damage(amount: int) -> void:
    current_health -= amount
    if current_health <= 0:
        _die()

func _die() -> void:
    queue_free()

# BAD - Dynamic typing (avoid)
var health = 100  # No type specified
func take_damage(amount):  # No parameter or return type
    health -= amount
```

## C# Standards (for Performance-Critical Systems)

### When to Use C# vs GDScript

**Use C# for:**

- Complex algorithms (pathfinding, procedural generation)
- Heavy mathematical computations
- Performance-critical systems identified by profiler
- External .NET library integration
- Large-scale data processing

**Use GDScript for:**

- Rapid prototyping and iteration
- UI and menu systems
- Simple game logic
- Editor tools and scene management
- Quick gameplay tweaks

### C# Naming Conventions

```csharp
using Godot;

public partial class PlayerController : CharacterBody2D
{
    // Public fields (use sparingly, prefer properties)
    [Export] public float MoveSpeed = 300.0f;

    // Private fields with underscore prefix
    private int _currentHealth;
    private float _jumpVelocity;

    // Properties with PascalCase
    public int MaxHealth { get; set; } = 100;

    // Methods with PascalCase
    public void TakeDamage(int amount)
    {
        _currentHealth -= amount;
        if (_currentHealth <= 0)
        {
            Die();
        }
    }

    private void Die()
    {
        QueueFree();
    }
}
```

## Godot Architecture Patterns

### Node-Based Architecture

**Scene Composition Over Inheritance:**

```gdscript
# Player.tscn structure:
# Player (CharacterBody2D)
# ├── Sprite2D
# ├── CollisionShape2D
# ├── PlayerHealth (Node)
# ├── PlayerMovement (Node)
# └── PlayerInput (Node)

# PlayerHealth.gd - Single responsibility component
extends Node
class_name PlayerHealth

signal health_changed(new_health: int)
signal died

@export var max_health: int = 100
var current_health: int

func _ready() -> void:
    current_health = max_health

func take_damage(amount: int) -> void:
    current_health = max(0, current_health - amount)
    health_changed.emit(current_health)
    if current_health == 0:
        died.emit()
```

### Signal-Based Communication

**Decouple Systems with Signals:**

```gdscript
# GameManager.gd - Singleton/Autoload
extends Node

signal game_started
signal game_over
signal level_completed

var score: int = 0
var current_level: int = 1

func start_game() -> void:
    score = 0
    current_level = 1
    game_started.emit()
    get_tree().change_scene_to_file("res://scenes/levels/level_1.tscn")

# Player.gd - Connects to signals
extends CharacterBody2D

func _ready() -> void:
    GameManager.game_over.connect(_on_game_over)

func _on_game_over() -> void:
    set_physics_process(false)  # Stop player movement
    $AnimationPlayer.play("death")
```

### Resource-Based Data Management

**Use Custom Resources for Game Data:**

```gdscript
# WeaponData.gd - Custom Resource
extends Resource
class_name WeaponData

@export var weapon_name: String = "Sword"
@export var damage: int = 10
@export var attack_speed: float = 1.0
@export var sprite: Texture2D

# Weapon.gd - Uses the resource
extends Node2D
class_name Weapon

@export var weapon_data: WeaponData

func _ready() -> void:
    if weapon_data:
        $Sprite2D.texture = weapon_data.sprite

func attack() -> int:
    return weapon_data.damage if weapon_data else 0
```

## Performance Optimization

### Object Pooling (MANDATORY for Spawned Objects)

```gdscript
# ObjectPool.gd - Generic pooling system
extends Node
class_name ObjectPool

@export var pool_scene: PackedScene
@export var initial_size: int = 20

var _pool: Array[Node] = []

func _ready() -> void:
    for i in initial_size:
        var instance := pool_scene.instantiate()
        instance.set_process(false)
        instance.set_physics_process(false)
        instance.visible = false
        add_child(instance)
        _pool.append(instance)

func get_object() -> Node:
    for obj in _pool:
        if not obj.visible:
            obj.visible = true
            obj.set_process(true)
            obj.set_physics_process(true)
            return obj

    # Expand pool if needed
    var new_obj := pool_scene.instantiate()
    add_child(new_obj)
    _pool.append(new_obj)
    return new_obj

func return_object(obj: Node) -> void:
    obj.set_process(false)
    obj.set_physics_process(false)
    obj.visible = false
    obj.position = Vector2.ZERO
```

### Process Optimization

**Use Appropriate Process Methods:**

```gdscript
extends Node2D

# For physics calculations (fixed timestep)
func _physics_process(delta: float) -> void:
    # Movement, collision detection
    pass

# For visual updates and input
func _process(delta: float) -> void:
    # Animations, UI updates
    pass

# Use timers or signals instead of checking every frame
func _ready() -> void:
    var timer := Timer.new()
    timer.wait_time = 1.0
    timer.timeout.connect(_check_condition)
    add_child(timer)
    timer.start()

func _check_condition() -> void:
    # Check something once per second instead of 60 times
    pass
```

### Memory Management

**Prevent Memory Leaks:**

```gdscript
extends Node

var _connections: Array[Callable] = []

func _ready() -> void:
    # Store connections for cleanup
    var callable := GameManager.score_changed.connect(_on_score_changed)
    _connections.append(callable)

func _exit_tree() -> void:
    # Clean up connections
    for connection in _connections:
        if connection.is_valid():
            connection.disconnect()
    _connections.clear()

# Use queue_free() not free() for nodes
func remove_enemy(enemy: Node) -> void:
    enemy.queue_free()  # Safe deletion
```

## Test-Driven Development (MANDATORY)

### GUT (Godot Unit Test) for GDScript

**Write Tests FIRST:**

```gdscript
# test/unit/test_player_health.gd
extends GutTest

var player_health: PlayerHealth

func before_each() -> void:
    player_health = PlayerHealth.new()
    player_health.max_health = 100

func test_take_damage_reduces_health() -> void:
    # Arrange
    player_health.current_health = 100

    # Act
    player_health.take_damage(30)

    # Assert
    assert_eq(player_health.current_health, 70, "Health should be reduced by damage amount")

func test_health_cannot_go_negative() -> void:
    # Arrange
    player_health.current_health = 10

    # Act
    player_health.take_damage(20)

    # Assert
    assert_eq(player_health.current_health, 0, "Health should not go below 0")

func test_died_signal_emitted_at_zero_health() -> void:
    # Arrange
    player_health.current_health = 10
    watch_signals(player_health)

    # Act
    player_health.take_damage(10)

    # Assert
    assert_signal_emitted(player_health, "died")
```

### GoDotTest for C#

```csharp
using Godot;
using GoDotTest;

[TestClass]
public class PlayerControllerTests : TestClass
{
    private PlayerController _player;

    [TestInitialize]
    public void Setup()
    {
        _player = new PlayerController();
        _player.MaxHealth = 100;
    }

    [Test]
    public void TakeDamage_ReducesHealth()
    {
        // Arrange
        _player.CurrentHealth = 100;

        // Act
        _player.TakeDamage(30);

        // Assert
        AssertThat(_player.CurrentHealth).IsEqualTo(70);
    }

    [Test]
    public void TakeDamage_EmitsDiedSignal_WhenHealthReachesZero()
    {
        // Arrange
        _player.CurrentHealth = 10;
        var signalEmitted = false;
        _player.Died += () => signalEmitted = true;

        // Act
        _player.TakeDamage(10);

        // Assert
        AssertThat(signalEmitted).IsTrue();
    }
}
```

## Input Handling

### Godot Input System

**Input Map Configuration:**

```gdscript
# Configure in Project Settings -> Input Map
# Actions: "move_left", "move_right", "jump", "attack"

extends CharacterBody2D

@export var speed: float = 300.0
@export var jump_velocity: float = -400.0

func _physics_process(delta: float) -> void:
    # Add gravity
    if not is_on_floor():
        velocity.y += ProjectSettings.get_setting("physics/2d/default_gravity") * delta

    # Handle jump
    if Input.is_action_just_pressed("jump") and is_on_floor():
        velocity.y = jump_velocity

    # Handle movement
    var direction := Input.get_axis("move_left", "move_right")
    velocity.x = direction * speed

    move_and_slide()

# For responsive input (use _unhandled_input for UI priority)
func _unhandled_input(event: InputEvent) -> void:
    if event.is_action_pressed("attack"):
        _perform_attack()
```

## Scene Management

### Scene Loading and Transitions

```gdscript
# SceneManager.gd - Autoload singleton
extends Node

var current_scene: Node = null

func _ready() -> void:
    var root := get_tree().root
    current_scene = root.get_child(root.get_child_count() - 1)

func change_scene(path: String) -> void:
    call_deferred("_deferred_change_scene", path)

func _deferred_change_scene(path: String) -> void:
    # Free current scene
    current_scene.queue_free()

    # Load new scene
    var new_scene := ResourceLoader.load(path) as PackedScene
    current_scene = new_scene.instantiate()
    get_tree().root.add_child(current_scene)
    get_tree().current_scene = current_scene

# With loading screen
func change_scene_with_loading(path: String) -> void:
    # Show loading screen
    var loading_screen := preload("res://scenes/ui/loading_screen.tscn").instantiate()
    get_tree().root.add_child(loading_screen)

    # Load in background
    ResourceLoader.load_threaded_request(path)

    # Wait for completion
    while ResourceLoader.load_threaded_get_status(path) != ResourceLoader.THREAD_LOAD_LOADED:
        await get_tree().process_frame

    # Switch scenes
    loading_screen.queue_free()
    change_scene(path)
```

## Project Structure

```
res://
├── scenes/
│   ├── main/
│   │   ├── main_menu.tscn
│   │   └── game.tscn
│   ├── levels/
│   │   ├── level_1.tscn
│   │   └── level_2.tscn
│   ├── player/
│   │   └── player.tscn
│   └── ui/
│       ├── hud.tscn
│       └── pause_menu.tscn
├── scripts/
│   ├── player/
│   │   ├── player_controller.gd
│   │   └── player_health.gd
│   ├── enemies/
│   │   └── enemy_base.gd
│   ├── systems/
│   │   ├── game_manager.gd
│   │   └── scene_manager.gd
│   └── ui/
│       └── hud_controller.gd
├── resources/
│   ├── weapons/
│   │   └── sword_data.tres
│   └── enemies/
│       └── slime_data.tres
├── assets/
│   ├── sprites/
│   ├── audio/
│   └── fonts/
├── tests/
│   ├── unit/
│   │   └── test_player_health.gd
│   └── integration/
│       └── test_level_loading.gd
└── project.godot
```

## Development Workflow

### TDD Story Implementation Process

1. **Read Story Requirements:**
   - Understand acceptance criteria
   - Identify performance requirements (60+ FPS)
   - Determine GDScript vs C# needs

2. **Write Tests FIRST (Red Phase):**
   - Write failing unit tests in GUT/GoDotTest
   - Define expected behavior
   - Run tests to confirm they fail

3. **Implement Feature (Green Phase):**
   - Write minimal code to pass tests
   - Follow Godot patterns and conventions
   - Use static typing in GDScript
   - Choose appropriate language (GDScript/C#)

4. **Refactor (Refactor Phase):**
   - Optimize for performance
   - Clean up code structure
   - Ensure 60+ FPS maintained
   - Run profiler to validate

5. **Integration Testing:**
   - Test scene interactions
   - Validate performance targets
   - Test on all platforms

6. **Update Documentation:**
   - Mark story checkboxes complete
   - Document performance metrics
   - Update File List

### Performance Checklist

- [ ] Stable 60+ FPS achieved
- [ ] Static typing used in all GDScript
- [ ] Object pooling for spawned entities
- [ ] No memory leaks detected
- [ ] Draw calls optimized
- [ ] Appropriate process methods used
- [ ] Signals properly connected/disconnected
- [ ] Tests written FIRST (TDD)
- [ ] 80%+ test coverage

## Performance Targets

### Frame Rate Requirements

- **Desktop**: 60+ FPS minimum (144 FPS for high-refresh)
- **Mobile**: 60 FPS on mid-range devices
- **Web**: 60 FPS with appropriate export settings
- **Frame Time**: <16.67ms consistently

### Memory Management

- **Scene Memory**: Keep under platform limits
- **Texture Memory**: Optimize imports, use compression
- **Object Pooling**: Required for bullets, particles, enemies
- **Reference Cleanup**: Prevent memory leaks

### Optimization Priorities

1. **Profile First**: Use Godot profiler to identify bottlenecks
2. **Optimize Algorithms**: Better algorithms beat micro-optimizations
3. **Reduce Draw Calls**: Batch rendering, use atlases
4. **Static Typing**: 10-20% performance gain in GDScript
5. **Language Choice**: Use C# for compute-heavy operations

## General Optimization

### Anti-Patterns

1. **Security Holes**
   - Buffer overflows
   - SQL injection vectors
   - Unvalidated user input
   - Timing attacks
   - Memory disclosure
   - Race conditions with security impact

2. **Platform Sabotage**
   - Fighting Godot's scene system
   - Reimplementing platform features
   - Ignoring hardware capabilities

## GDScript Optimization

### Performance Destroyers

1. **Type System Crimes**
   - Dynamic typing anywhere (10-20% performance loss)
   - Variant usage in hot paths
   - Dictionary/Array without typed variants
   - Missing return type hints
   - Untyped function parameters

2. **Allocation Disasters**
   - Creating Arrays/Dictionaries in loops
   - String concatenation with +
   - Unnecessary Node instantiation
   - Resource loading in game loop
   - Signal connections without caching

3. **Process Method Abuse**
   - \_process() when \_physics_process() suffices
   - Frame-by-frame checks for rare events
   - get_node() calls every frame
   - Node path resolution in loops
   - Unnecessary process enabling

### GDScript Death Sentences

```gdscript
# CRIME: Dynamic typing
var health = 100  # Dies. var health: int = 100

# CRIME: String concatenation in loop
for i in range(1000):
    text += str(i)  # Dies. Use StringBuffer or Array.join()

# CRIME: get_node every frame
func _process(delta):
    $UI/Score.text = str(score)  # Dies. Cache the node reference

# CRIME: Creating objects in loop
for enemy in enemies:
    var bullet = Bullet.new()  # Dies. Object pool

# CRIME: Untyped arrays
var enemies = []  # Dies. var enemies: Array[Enemy] = []

# CRIME: Path finding every frame
func _process(delta):
    find_node("Player")  # Dies. Store reference in _ready()

# CRIME: Signal spam
for i in range(100):
    emit_signal("updated", i)  # Dies. Batch updates

# CRIME: Resource loading in game
func shoot():
    var bullet_scene = load("res://bullet.tscn")  # Dies. Preload

# CRIME: Checking rare conditions every frame
func _process(delta):
    if player_died:  # Dies. Use signals
        game_over()

# CRIME: Node creation without pooling
func spawn_particle():
    var p = Particle.new()  # Dies. Pool everything spawned
    add_child(p)
```

### The Only Acceptable GDScript Patterns

```gdscript
# GOOD: Static typing everywhere
var health: int = 100
var speed: float = 300.0
var enemies: Array[Enemy] = []

# GOOD: Cached node references
@onready var score_label: Label = $UI/Score
@onready var health_bar: ProgressBar = $UI/HealthBar

# GOOD: Preloaded resources
const BULLET_SCENE: PackedScene = preload("res://bullet.tscn")
const EXPLOSION_SOUND: AudioStream = preload("res://explosion.ogg")

# GOOD: Object pooling
var bullet_pool: Array[Bullet] = []
func _ready() -> void:
    for i in 50:
        var bullet := BULLET_SCENE.instantiate() as Bullet
        bullet.visible = false
        bullet_pool.append(bullet)

# GOOD: Typed dictionaries
var player_stats: Dictionary = {
    "health": 100,
    "armor": 50,
    "speed": 300.0
}

# GOOD: Efficient string building
func build_text(count: int) -> String:
    var parts: PackedStringArray = []
    for i in count:
        parts.append(str(i))
    return "".join(parts)

# GOOD: Timer-based checks
func _ready() -> void:
    var timer := Timer.new()
    timer.wait_time = 1.0
    timer.timeout.connect(_check_rare_condition)
    add_child(timer)
    timer.start()

# GOOD: Batch operations
var updates_pending: Array[int] = []
func queue_update(value: int) -> void:
    updates_pending.append(value)
    if updates_pending.size() == 1:
        call_deferred("_process_updates")

func _process_updates() -> void:
    # Process all updates at once
    for value in updates_pending:
        # Do work
        pass
    updates_pending.clear()

# GOOD: Const for compile-time optimization
const MAX_ENEMIES: int = 100
const GRAVITY: float = 980.0
const DEBUG_MODE: bool = false
```

### GDScript-Specific Optimization Rules

1. **ALWAYS use static typing** - Non-negotiable 10-20% free performance
2. **NEVER use get_node() in loops** - Cache everything in @onready
3. **NEVER load() in gameplay** - preload() or ResourceLoader
4. **NEVER create nodes without pooling** - Pool or die
5. **NEVER concatenate strings in loops** - PackedStringArray.join()
6. **ALWAYS use const for constants** - Compile-time optimization
7. **ALWAYS specify Array types** - Array[Type] not Array
8. **NEVER check conditions every frame** - Use signals and timers
9. **ALWAYS batch similar operations** - One update, not many
10. **NEVER trust the profiler isn't watching** - It always is

## Godot C# Optimization

### Anti-Patterns

1. **Performance Destroyers**
   - ANY allocation in render/game loop
   - String operations in hot paths
   - LINQ anywhere (it allocates, period)
   - Boxing/unboxing in performance code
   - Virtual calls when direct calls possible
   - Cache-hostile data layouts
   - Synchronous I/O blocking computation
2. **Algorithmic Incompetence**
   - O(n²) when O(n log n) exists
   - O(n³) = fired
   - Linear search in sorted data
   - Recalculating invariants
   - Branches in SIMD loops
   - Random memory access patterns

3. **Architectural Cancer**
   - Abstractions that don't eliminate code
   - Single-implementation interfaces
   - Factory factories
   - 3+ levels of indirection
   - Reflection in performance paths
   - Manager classes (lazy design)
   - Event systems for direct calls
   - Not using SIMD where available
   - Thread-unsafe code in parallel contexts

## C#/GODOT SPECIFIC DEATH SENTENCES

### Instant Rejection Patterns

```csharp
// CRIME: LINQ in game code
units.Where(u => u.IsAlive).ToList()  // Dies. Pre-filtered array.

// CRIME: String operations
$"Player {name} scored {score}"  // Dies. StringBuilder or byte buffer.

// CRIME: Boxing
object value = 42;  // Dies. Generic or specific type.

// CRIME: Foreach on List<T>
foreach(var item in list)  // Dies. for(int i = 0; i < list.Count; i++)

// CRIME: Properties doing work
public int Count => CalculateCount();  // Dies. Cache or field.

// CRIME: Virtual by default
public virtual void Update()  // Dies. Sealed unless NEEDED.

// CRIME: Events for direct calls
public event Action OnUpdate;  // Dies. Direct method call.

// CRIME: Reflection
typeof(T).GetMethod("Update")  // Dies. Direct call or delegates.

// CRIME: Async in game loop
await LoadDataAsync();  // Dies. Preload or synchronous.

// CRIME: GD.Print in production
GD.Print($"Debug: {value}");  // Dies. Conditional compilation.
```

### Godot-Specific Crimes

```csharp
// CRIME: GetNode every frame
GetNode<Label>("UI/Score")  // Dies. Cache in _Ready().

// CRIME: Creating Nodes dynamically
var bullet = bulletScene.Instantiate();  // Dies. Object pool.

// CRIME: Signal connections in loops
unit.HealthChanged += OnHealthChanged;  // Dies. Batch updates.

// CRIME: _Process without need
public override void _Process(double delta)  // Dies. Use _PhysicsProcess or events.

// CRIME: Autoload abuse
GetNode<GameManager>("/root/GameManager")  // Dies. Direct reference.
```

### The Only Acceptable Patterns

```csharp
// GOOD: Pre-allocated buffers
private readonly Unit[] _units = new Unit[MAX_UNITS];
private readonly int[] _indices = new int[MAX_UNITS];

// GOOD: Struct over class
public struct UnitData { public int Health; public Vector2I Position; }

// GOOD: Data-oriented design
public struct Units {
    public int[] Health;
    public Vector2I[] Positions;
    public bool[] IsAlive;
}

// GOOD: Zero-allocation update
public void Update() {
    int count = _activeCount;
    for (int i = 0; i < count; i++) {
        ref Unit unit = ref _units[i];
        unit.Position += unit.Velocity;
    }
}

// GOOD: Compile-time elimination
#if DEBUG
    GD.Print("Debug info");
#endif
```

These guidelines ensure consistent, high-quality Godot game development that meets performance targets, maintains code quality, and follows TDD practices across all implementation stories.

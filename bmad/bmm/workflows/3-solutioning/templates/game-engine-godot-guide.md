# Godot Game Engine Architecture Guide

This guide provides Godot-specific guidance for solution architecture generation.

---

## Godot-Specific Questions

### 1. Godot Version and Language Strategy

**Ask:**

- Which Godot version? (3.x, 4.x)
- Language preference? (GDScript only, C# only, or Mixed GDScript+C#)
- Target platform(s)? (PC, Mobile, Web, Console)

**Guidance:**

- **Godot 4.x**: Modern, Vulkan renderer, better 3D, C# improving
- **Godot 3.x**: Stable, mature ecosystem, OpenGL
- **GDScript**: Python-like, fast iteration, integrated with editor
- **C#**: Better performance for complex systems, familiar to Unity devs
- **Mixed**: GDScript for game logic, C# for performance-critical (physics, AI)

**Record ADR:** Godot version and language strategy

---

### 2. Node-Based Architecture

**Ask:**

- Scene composition strategy? (Nested scenes, scene inheritance, or flat hierarchy)
- Node organization patterns? (By feature, by type, or hybrid)

**Guidance:**

- **Scenes as Prefabs**: Each reusable entity is a scene (Player.tscn, Enemy.tscn)
- **Scene Inheritance**: Extend base scenes for variations (BaseEnemy → FlyingEnemy)
- **Node Signals**: Use built-in signal system for decoupled communication
- **Autoload Singletons**: For global managers (GameManager, AudioManager)

**Godot Pattern:**

```gdscript
# Player.gd
extends CharacterBody2D

signal health_changed(new_health)
signal died

@export var max_health: int = 100
var health: int = max_health

func take_damage(amount: int) -> void:
    health -= amount
    health_changed.emit(health)
    if health <= 0:
        died.emit()
        queue_free()
```

**Record ADR:** Scene architecture and node organization

---

### 3. Resource Management

**Ask:**

- Use Godot Resources for data? (Custom Resource types for game data)
- Asset loading strategy? (preload vs load vs ResourceLoader)

**Guidance:**

- **Resources**: Like Unity ScriptableObjects, serializable data containers
- **preload()**: Load at compile time (fast, but increases binary size)
- **load()**: Load at runtime (slower, but smaller binary)
- **ResourceLoader.load_threaded_request()**: Async loading for large assets

**Pattern:**

```gdscript
# EnemyData.gd
class_name EnemyData
extends Resource

@export var enemy_name: String
@export var health: int
@export var speed: float
@export var prefab_scene: PackedScene
```

**Record ADR:** Resource and asset loading strategy

---

## Godot-Specific Architecture Sections

### Signal-Driven Communication

**Godot's built-in Observer pattern:**

```gdscript
# GameManager.gd (Autoload singleton)
extends Node

signal game_started
signal game_paused
signal game_over(final_score: int)

func start_game() -> void:
    game_started.emit()

func pause_game() -> void:
    get_tree().paused = true
    game_paused.emit()

# In Player.gd
func _ready() -> void:
    GameManager.game_started.connect(_on_game_started)
    GameManager.game_over.connect(_on_game_over)

func _on_game_started() -> void:
    position = Vector2.ZERO
    health = max_health
```

**Benefits:**

- Decoupled systems
- No FindNode or get_node everywhere
- Type-safe with typed signals (Godot 4)

---

### Godot Scene Architecture

**Scene organization patterns:**

**1. Composition Pattern:**

```
Player (CharacterBody2D)
├── Sprite2D
├── CollisionShape2D
├── AnimationPlayer
├── HealthComponent (Node - custom script)
├── InputComponent (Node - custom script)
└── WeaponMount (Node2D)
    └── Weapon (instanced scene)
```

**2. Scene Inheritance:**

```
BaseEnemy.tscn
├── Inherits → FlyingEnemy.tscn (adds wings, aerial movement)
└── Inherits → GroundEnemy.tscn (adds ground collision)
```

**3. Autoload Singletons:**

```
# In Project Settings > Autoload:
GameManager → res://scripts/managers/game_manager.gd
AudioManager → res://scripts/managers/audio_manager.gd
SaveManager → res://scripts/managers/save_manager.gd
```

---

### Performance Optimization

**Godot-specific considerations:**

- **Static Typing**: Use type hints for GDScript performance (`var health: int = 100`)
- **Object Pooling**: Implement manually or use addons
- **CanvasItem batching**: Reduce draw calls with texture atlases
- **Viewport rendering**: Offload effects to separate viewports
- **GDScript vs C#**: C# faster for heavy computation, GDScript faster for simple logic

**Target Performance:**

- **PC**: 60 FPS minimum
- **Mobile**: 60 FPS (high-end), 30 FPS (low-end)
- **Web**: 30-60 FPS depending on complexity

**Profiler:**

- Use Godot's built-in profiler (Debug > Profiler)
- Monitor FPS, draw calls, physics time

---

### Testing Strategy

**GUT (Godot Unit Test):**

```gdscript
# test_player.gd
extends GutTest

func test_player_takes_damage():
    var player = Player.new()
    add_child(player)
    player.health = 100

    player.take_damage(20)

    assert_eq(player.health, 80, "Player health should decrease")
```

**GoDotTest for C#:**

```csharp
[Test]
public void PlayerTakesDamage_DecreasesHealth()
{
    var player = new Player();
    player.Health = 100;

    player.TakeDamage(20);

    Assert.That(player.Health, Is.EqualTo(80));
}
```

**Recommended Coverage:**

- 80% minimum test coverage (from expansion pack)
- Test game systems, not rendering
- Use GUT for GDScript, GoDotTest for C#

---

### Source Tree Structure

**Godot-specific folders:**

```
project/
├── scenes/              # All .tscn scene files
│   ├── main_menu.tscn
│   ├── levels/
│   │   ├── level_1.tscn
│   │   └── level_2.tscn
│   ├── player/
│   │   └── player.tscn
│   └── enemies/
│       ├── base_enemy.tscn
│       └── flying_enemy.tscn
├── scripts/             # GDScript and C# files
│   ├── player/
│   │   ├── player.gd
│   │   └── player_input.gd
│   ├── enemies/
│   ├── managers/
│   │   ├── game_manager.gd  (Autoload)
│   │   └── audio_manager.gd (Autoload)
│   └── ui/
├── resources/           # Custom Resource types
│   ├── enemy_data.gd
│   └── level_data.gd
├── assets/
│   ├── sprites/
│   ├── textures/
│   ├── audio/
│   │   ├── music/
│   │   └── sfx/
│   ├── fonts/
│   └── shaders/
├── addons/              # Godot plugins
└── project.godot        # Project settings
```

---

### Deployment and Build

**Platform-specific:**

- **PC**: Export presets for Windows, Linux, macOS
- **Mobile**: Android (APK/AAB), iOS (Xcode project)
- **Web**: HTML5 export (SharedArrayBuffer requirements)
- **Console**: Partner programs for Switch, Xbox, PlayStation

**Export templates:**

- Download from Godot website for each platform
- Configure export presets in Project > Export

**Build automation:**

- Use `godot --export` command-line for CI/CD
- Example: `godot --export-release "Windows Desktop" output/game.exe`

---

## Specialist Recommendations

### Audio Designer

**When needed:** Games with music, sound effects, ambience
**Responsibilities:**

- AudioStreamPlayer node architecture (2D vs 3D audio)
- Audio bus setup in Godot's audio mixer
- Music transitions with AudioStreamPlayer.finished signal
- Sound effect implementation
- Audio performance optimization

### Performance Optimizer

**When needed:** Mobile games, large-scale games, complex 3D
**Responsibilities:**

- Godot profiler analysis
- Static typing optimization
- Draw call reduction
- Physics optimization (collision layers/masks)
- Memory management
- C# performance optimization for heavy systems

### Multiplayer Architect

**When needed:** Multiplayer/co-op games
**Responsibilities:**

- High-level multiplayer API or ENet
- RPC architecture (remote procedure calls)
- State synchronization patterns
- Client-server vs peer-to-peer
- Anti-cheat considerations
- Latency compensation

### Monetization Specialist

**When needed:** F2P, mobile games with IAP
**Responsibilities:**

- In-app purchase integration (via plugins)
- Ad network integration
- Analytics integration
- Economy design
- Godot-specific monetization patterns

---

## Common Pitfalls

1. **Over-using get_node()** - Cache node references in `@onready` variables
2. **Not using type hints** - Static typing improves GDScript performance
3. **Deep node hierarchies** - Keep scene trees shallow for performance
4. **Ignoring signals** - Use signals instead of polling or direct coupling
5. **Not leveraging autoload** - Use autoload singletons for global state
6. **Poor scene organization** - Plan scene structure before building
7. **Forgetting to queue_free()** - Memory leaks from unreleased nodes

---

## Godot vs Unity Differences

### Architecture Differences:

| Unity                  | Godot          | Notes                                   |
| ---------------------- | -------------- | --------------------------------------- |
| GameObject + Component | Node hierarchy | Godot nodes have built-in functionality |
| MonoBehaviour          | Node + Script  | Attach scripts to nodes                 |
| ScriptableObject       | Resource       | Custom data containers                  |
| UnityEvent             | Signal         | Godot signals are built-in              |
| Prefab                 | Scene (.tscn)  | Scenes are reusable like prefabs        |
| Singleton pattern      | Autoload       | Built-in singleton system               |

### Language Differences:

| Unity C#                              | GDScript                                    | Notes                       |
| ------------------------------------- | ------------------------------------------- | --------------------------- |
| `public class Player : MonoBehaviour` | `class_name Player extends CharacterBody2D` | GDScript more concise       |
| `void Start()`                        | `func _ready():`                            | Initialization              |
| `void Update()`                       | `func _process(delta):`                     | Per-frame update            |
| `void FixedUpdate()`                  | `func _physics_process(delta):`             | Physics update              |
| `[SerializeField]`                    | `@export`                                   | Inspector-visible variables |
| `GetComponent<T>()`                   | `get_node("NodeName")` or `$NodeName`       | Node access                 |

---

## Key Architecture Decision Records

### ADR Template for Godot Projects

**ADR-XXX: [Title]**

**Context:**
What Godot-specific issue are we solving?

**Options:**

1. GDScript solution
2. C# solution
3. GDScript + C# hybrid
4. Third-party addon (Godot Asset Library)

**Decision:**
We chose [Option X]

**Godot-specific Rationale:**

- GDScript vs C# performance tradeoffs
- Engine integration (signals, nodes, resources)
- Community support and addons
- Team expertise
- Platform compatibility

**Consequences:**

- Impact on performance
- Learning curve
- Maintenance considerations
- Platform limitations (Web export with C#)

---

_This guide is specific to Godot Engine. For other engines, see:_

- game-engine-unity-guide.md
- game-engine-unreal-guide.md
- game-engine-web-guide.md

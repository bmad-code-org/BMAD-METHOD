# Unity Game Engine Architecture Guide

This guide provides Unity-specific guidance for solution architecture generation.

---

## Unity-Specific Questions

### 1. Unity Version and Render Pipeline

**Ask:**

- Which Unity version are you targeting? (2021 LTS, 2022 LTS, 2023+, 6000+)
- Which render pipeline? (Built-in, URP Universal Render Pipeline, HDRP High Definition)
- Target platform(s)? (PC, Mobile, Console, WebGL)

**Guidance:**

- **2021/2022 LTS**: Stable, well-supported, good for production
- **URP**: Best for mobile and cross-platform (lower overhead)
- **HDRP**: High-fidelity graphics for PC/console only
- **Built-in**: Legacy, avoid for new projects

**Record ADR:** Unity version and render pipeline choice

---

### 2. Architecture Pattern

**Ask:**

- Component-based MonoBehaviour architecture? (Unity standard)
- ECS (Entity Component System) for performance-critical systems?
- Hybrid (MonoBehaviour + ECS where needed)?

**Guidance:**

- **MonoBehaviour**: Standard, easy to use, good for most games
- **ECS/DOTS**: High performance, steep learning curve, use for massive scale (1000s of entities)
- **Hybrid**: MonoBehaviour for gameplay, ECS for particles/crowds

**Record ADR:** Architecture pattern choice and justification

---

### 3. Data Management Strategy

**Ask:**

- ScriptableObjects for data-driven design?
- JSON/XML config files?
- Addressables for asset management?

**Guidance:**

- **ScriptableObjects**: Unity-native, inspector-friendly, good for game data (enemies, items, levels)
- **Addressables**: Essential for large games, enables asset streaming and DLC
- Avoid Resources folder (deprecated pattern)

**Record ADR:** Data management approach

---

## Unity-Specific Architecture Sections

### Game Systems Architecture

**Components to define:**

- **Player Controller**: Character movement, input handling
- **Camera System**: Follow camera, cinemachine usage
- **Game State Manager**: Scene transitions, game modes, pause/resume
- **Save System**: PlayerPrefs vs JSON vs Cloud Save
- **Input System**: New Input System vs Legacy

**Unity-specific patterns:**

```csharp
// Singleton GameManager pattern
public class GameManager : MonoBehaviour
{
    public static GameManager Instance { get; private set; }

    void Awake()
    {
        if (Instance == null) Instance = this;
        else Destroy(gameObject);
        DontDestroyOnLoad(gameObject);
    }
}

// ScriptableObject data pattern
[CreateAssetMenu(fileName = "EnemyData", menuName = "Game/Enemy")]
public class EnemyData : ScriptableObject
{
    public string enemyName;
    public int health;
    public float speed;
    public GameObject prefab;
}
```

---

### Unity Events and Communication

**Ask:**

- UnityEvents for inspector-wired connections?
- C# Events for code-based pub/sub?
- Message system for decoupled communication?

**Guidance:**

- **UnityEvents**: Good for designer-configurable connections
- **C# Events**: Better performance, type-safe
- **Avoid** FindObjectOfType and GetComponent in Update()

**Pattern:**

```csharp
// Event-driven damage system
public class HealthSystem : MonoBehaviour
{
    public UnityEvent<int> OnDamaged;
    public UnityEvent OnDeath;

    public void TakeDamage(int amount)
    {
        health -= amount;
        OnDamaged?.Invoke(amount);
        if (health <= 0) OnDeath?.Invoke();
    }
}
```

---

### Performance Optimization

**Unity-specific considerations:**

- **Object Pooling**: Essential for bullets, particles, enemies
- **Sprite Batching**: Use sprite atlases, minimize draw calls
- **Physics Optimization**: Layer-based collision matrix
- **Profiler Usage**: CPU, GPU, Memory, Physics profilers
- **IL2CPP vs Mono**: Build performance differences

**Target Performance:**

- Mobile: 60 FPS minimum (30 FPS for complex 3D)
- PC: 60 FPS minimum
- Monitor with Unity Profiler

---

### Testing Strategy

**Unity Test Framework:**

- **Edit Mode Tests**: Test pure C# logic, no Unity lifecycle
- **Play Mode Tests**: Test MonoBehaviour components in play mode
- Use `[UnityTest]` attribute for coroutine tests
- Mock Unity APIs with interfaces

**Example:**

```csharp
[UnityTest]
public IEnumerator Player_TakesDamage_DecreasesHealth()
{
    var player = new GameObject().AddComponent<Player>();
    player.health = 100;

    player.TakeDamage(20);

    yield return null; // Wait one frame

    Assert.AreEqual(80, player.health);
}
```

---

### Source Tree Structure

**Unity-specific folders:**

```
Assets/
├── Scenes/              # All .unity scene files
│   ├── MainMenu.unity
│   ├── Level1.unity
│   └── Level2.unity
├── Scripts/             # All C# code
│   ├── Player/
│   ├── Enemies/
│   ├── Managers/
│   ├── UI/
│   └── Utilities/
├── Prefabs/             # Reusable game objects
├── ScriptableObjects/   # Game data assets
│   ├── Enemies/
│   ├── Items/
│   └── Levels/
├── Materials/
├── Textures/
├── Audio/
│   ├── Music/
│   └── SFX/
├── Fonts/
├── Animations/
├── Resources/           # Avoid - use Addressables instead
└── Plugins/             # Third-party SDKs
```

---

### Deployment and Build

**Platform-specific:**

- **PC**: Standalone builds (Windows/Mac/Linux)
- **Mobile**: IL2CPP mandatory for iOS, recommended for Android
- **WebGL**: Compression, memory limitations
- **Console**: Platform-specific SDKs and certification

**Build pipeline:**

- Unity Cloud Build OR
- CI/CD with command-line builds: `Unity -batchmode -buildTarget ...`

---

## Specialist Recommendations

### Audio Designer

**When needed:** Games with music, sound effects, ambience
**Responsibilities:**

- Audio system architecture (2D vs 3D audio)
- Audio mixer setup
- Music transitions and adaptive audio
- Sound effect implementation
- Audio performance optimization

### Performance Optimizer

**When needed:** Mobile games, large-scale games, VR
**Responsibilities:**

- Profiling and optimization
- Memory management
- Draw call reduction
- Physics optimization
- Asset optimization (textures, meshes, audio)

### Multiplayer Architect

**When needed:** Multiplayer/co-op games
**Responsibilities:**

- Netcode architecture (Netcode for GameObjects, Mirror, Photon)
- Client-server vs peer-to-peer
- State synchronization
- Anti-cheat considerations
- Latency compensation

### Monetization Specialist

**When needed:** F2P, mobile games with IAP
**Responsibilities:**

- Unity IAP integration
- Ad network integration (AdMob, Unity Ads)
- Analytics integration
- Economy design (virtual currency, shop)

---

## Common Pitfalls

1. **Over-using GetComponent** - Cache references in Awake/Start
2. **Empty Update methods** - Remove them, they have overhead
3. **String comparisons for tags** - Use CompareTag() instead
4. **Resources folder abuse** - Migrate to Addressables
5. **Not using object pooling** - Instantiate/Destroy is expensive
6. **Ignoring the Profiler** - Profile early, profile often
7. **Not testing on target hardware** - Mobile performance differs vastly

---

## Key Architecture Decision Records

### ADR Template for Unity Projects

**ADR-XXX: [Title]**

**Context:**
What Unity-specific issue are we solving?

**Options:**

1. Unity Built-in Solution (e.g., Built-in Input System)
2. Unity Package (e.g., New Input System)
3. Third-party Asset (e.g., Rewired)
4. Custom Implementation

**Decision:**
We chose [Option X]

**Unity-specific Rationale:**

- Version compatibility
- Performance characteristics
- Community support
- Asset Store availability
- License considerations

**Consequences:**

- Impact on build size
- Platform compatibility
- Learning curve for team

---

_This guide is specific to Unity Engine. For other engines, see:_

- game-engine-godot-guide.md
- game-engine-unreal-guide.md
- game-engine-web-guide.md

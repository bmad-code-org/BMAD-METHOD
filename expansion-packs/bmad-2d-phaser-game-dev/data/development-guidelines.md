<!-- Powered by BMAD™ Core -->

# Game Development Guidelines

## Overview

This document establishes coding standards, architectural patterns, and development practices for 2D game development using Phaser 3 and TypeScript. These guidelines ensure consistency, performance, and maintainability across all game development stories.

## TypeScript Standards

### Strict Mode Configuration

**Required tsconfig.json settings:**

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### Type Definitions

**Game Object Interfaces:**

```typescript
// Core game entity interface
interface GameEntity {
  readonly id: string;
  position: Phaser.Math.Vector2;
  active: boolean;
  destroy(): void;
}

// Player controller interface
interface PlayerController {
  readonly inputEnabled: boolean;
  handleInput(input: InputState): void;
  update(delta: number): void;
}

// Game system interface
interface GameSystem {
  readonly name: string;
  initialize(): void;
  update(delta: number): void;
  shutdown(): void;
}
```

**Scene Data Interfaces:**

```typescript
// Scene transition data
interface SceneData {
  [key: string]: any;
}

// Game state interface
interface GameState {
  currentLevel: number;
  score: number;
  lives: number;
  settings: GameSettings;
}

interface GameSettings {
  musicVolume: number;
  sfxVolume: number;
  difficulty: 'easy' | 'normal' | 'hard';
  controls: ControlScheme;
}
```

### Naming Conventions

**Classes and Interfaces:**

- PascalCase for classes: `PlayerSprite`, `GameManager`, `AudioSystem`
- PascalCase with 'I' prefix for interfaces: `IGameEntity`, `IPlayerController`
- Descriptive names that indicate purpose: `CollisionManager` not `CM`

**Methods and Variables:**

- camelCase for methods and variables: `updatePosition()`, `playerSpeed`
- Descriptive names: `calculateDamage()` not `calcDmg()`
- Boolean variables with is/has/can prefix: `isActive`, `hasCollision`, `canMove`

**Constants:**

- UPPER_SNAKE_CASE for constants: `MAX_PLAYER_SPEED`, `DEFAULT_VOLUME`
- Group related constants in enums or const objects

**Files and Directories:**

- kebab-case for file names: `player-controller.ts`, `audio-manager.ts`
- PascalCase for scene files: `MenuScene.ts`, `GameScene.ts`

## Phaser 3 Architecture Patterns

### Scene Organization

**Scene Lifecycle Management:**

```typescript
class GameScene extends Phaser.Scene {
  private gameManager!: GameManager;
  private inputManager!: InputManager;

  constructor() {
    super({ key: 'GameScene' });
  }

  preload(): void {
    // Load only scene-specific assets
    this.load.image('player', 'assets/player.png');
  }

  create(data: SceneData): void {
    // Initialize game systems
    this.gameManager = new GameManager(this);
    this.inputManager = new InputManager(this);

    // Set up scene-specific logic
    this.setupGameObjects();
    this.setupEventListeners();
  }

  update(time: number, delta: number): void {
    // Update all game systems
    this.gameManager.update(delta);
    this.inputManager.update(delta);
  }

  shutdown(): void {
    // Clean up resources
    this.gameManager.destroy();
    this.inputManager.destroy();

    // Remove event listeners
    this.events.off('*');
  }
}
```

**Scene Transitions:**

```typescript
// Proper scene transitions with data
this.scene.start('NextScene', {
  playerScore: this.playerScore,
  currentLevel: this.currentLevel + 1,
});

// Scene overlays for UI
this.scene.launch('PauseMenuScene');
this.scene.pause();
```

### Game Object Patterns

**Component-Based Architecture:**

```typescript
// Base game entity
abstract class GameEntity extends Phaser.GameObjects.Sprite {
  protected components: Map<string, GameComponent> = new Map();

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    scene.add.existing(this);
  }

  addComponent<T extends GameComponent>(component: T): T {
    this.components.set(component.name, component);
    return component;
  }

  getComponent<T extends GameComponent>(name: string): T | undefined {
    return this.components.get(name) as T;
  }

  update(delta: number): void {
    this.components.forEach((component) => component.update(delta));
  }

  destroy(): void {
    this.components.forEach((component) => component.destroy());
    this.components.clear();
    super.destroy();
  }
}

// Example player implementation
class Player extends GameEntity {
  private movement!: MovementComponent;
  private health!: HealthComponent;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player');

    this.movement = this.addComponent(new MovementComponent(this));
    this.health = this.addComponent(new HealthComponent(this, 100));
  }
}
```

### System Management

**Singleton Managers:**

```typescript
class GameManager {
  private static instance: GameManager;
  private scene: Phaser.Scene;
  private gameState: GameState;

  constructor(scene: Phaser.Scene) {
    if (GameManager.instance) {
      throw new Error('GameManager already exists!');
    }

    this.scene = scene;
    this.gameState = this.loadGameState();
    GameManager.instance = this;
  }

  static getInstance(): GameManager {
    if (!GameManager.instance) {
      throw new Error('GameManager not initialized!');
    }
    return GameManager.instance;
  }

  update(delta: number): void {
    // Update game logic
  }

  destroy(): void {
    GameManager.instance = null!;
  }
}
```

## Performance Optimization

### Object Pooling

**Required for High-Frequency Objects:**

```typescript
class BulletPool {
  private pool: Bullet[] = [];
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, initialSize: number = 50) {
    this.scene = scene;

    // Pre-create bullets
    for (let i = 0; i < initialSize; i++) {
      const bullet = new Bullet(scene, 0, 0);
      bullet.setActive(false);
      bullet.setVisible(false);
      this.pool.push(bullet);
    }
  }

  getBullet(): Bullet | null {
    const bullet = this.pool.find((b) => !b.active);
    if (bullet) {
      bullet.setActive(true);
      bullet.setVisible(true);
      return bullet;
    }

    // Pool exhausted - create new bullet
    console.warn('Bullet pool exhausted, creating new bullet');
    return new Bullet(this.scene, 0, 0);
  }

  releaseBullet(bullet: Bullet): void {
    bullet.setActive(false);
    bullet.setVisible(false);
    bullet.setPosition(0, 0);
  }
}
```

### Frame Rate Optimization

**Performance Monitoring:**

```typescript
class PerformanceMonitor {
  private frameCount: number = 0;
  private lastTime: number = 0;
  private frameRate: number = 60;

  update(time: number): void {
    this.frameCount++;

    if (time - this.lastTime >= 1000) {
      this.frameRate = this.frameCount;
      this.frameCount = 0;
      this.lastTime = time;

      if (this.frameRate < 55) {
        console.warn(`Low frame rate detected: ${this.frameRate} FPS`);
        this.optimizePerformance();
      }
    }
  }

  private optimizePerformance(): void {
    // Reduce particle counts, disable effects, etc.
  }
}
```

**Update Loop Optimization:**

```typescript
// Avoid expensive operations in update loops
class GameScene extends Phaser.Scene {
  private updateTimer: number = 0;
  private readonly UPDATE_INTERVAL = 100; // ms

  update(time: number, delta: number): void {
    // High-frequency updates (every frame)
    this.updatePlayer(delta);
    this.updatePhysics(delta);

    // Low-frequency updates (10 times per second)
    this.updateTimer += delta;
    if (this.updateTimer >= this.UPDATE_INTERVAL) {
      this.updateUI();
      this.updateAI();
      this.updateTimer = 0;
    }
  }
}
```

## Input Handling

### Cross-Platform Input

**Input Abstraction:**

```typescript
interface InputState {
  moveLeft: boolean;
  moveRight: boolean;
  jump: boolean;
  action: boolean;
  pause: boolean;
}

class InputManager {
  private inputState: InputState = {
    moveLeft: false,
    moveRight: false,
    jump: false,
    action: false,
    pause: false,
  };

  private keys!: { [key: string]: Phaser.Input.Keyboard.Key };
  private pointer!: Phaser.Input.Pointer;

  constructor(private scene: Phaser.Scene) {
    this.setupKeyboard();
    this.setupTouch();
  }

  private setupKeyboard(): void {
    this.keys = this.scene.input.keyboard.addKeys('W,A,S,D,SPACE,ESC,UP,DOWN,LEFT,RIGHT');
  }

  private setupTouch(): void {
    this.scene.input.on('pointerdown', this.handlePointerDown, this);
    this.scene.input.on('pointerup', this.handlePointerUp, this);
  }

  update(): void {
    // Update input state from multiple sources
    this.inputState.moveLeft = this.keys.A.isDown || this.keys.LEFT.isDown;
    this.inputState.moveRight = this.keys.D.isDown || this.keys.RIGHT.isDown;
    this.inputState.jump = Phaser.Input.Keyboard.JustDown(this.keys.SPACE);
    // ... handle touch input
  }

  getInputState(): InputState {
    return { ...this.inputState };
  }
}
```

## Error Handling

### Graceful Degradation

**Asset Loading Error Handling:**

```typescript
class AssetManager {
  loadAssets(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.scene.load.on('filecomplete', this.handleFileComplete, this);
      this.scene.load.on('loaderror', this.handleLoadError, this);
      this.scene.load.on('complete', () => resolve());

      this.scene.load.start();
    });
  }

  private handleLoadError(file: Phaser.Loader.File): void {
    console.error(`Failed to load asset: ${file.key}`);

    // Use fallback assets
    this.loadFallbackAsset(file.key);
  }

  private loadFallbackAsset(key: string): void {
    // Load placeholder or default assets
    switch (key) {
      case 'player':
        this.scene.load.image('player', 'assets/defaults/default-player.png');
        break;
      default:
        console.warn(`No fallback for asset: ${key}`);
    }
  }
}
```

### Runtime Error Recovery

**System Error Handling:**

```typescript
class GameSystem {
  protected handleError(error: Error, context: string): void {
    console.error(`Error in ${context}:`, error);

    // Report to analytics/logging service
    this.reportError(error, context);

    // Attempt recovery
    this.attemptRecovery(context);
  }

  private attemptRecovery(context: string): void {
    switch (context) {
      case 'update':
        // Reset system state
        this.reset();
        break;
      case 'render':
        // Disable visual effects
        this.disableEffects();
        break;
      default:
        // Generic recovery
        this.safeShutdown();
    }
  }
}
```

## Testing Standards

### Unit Testing

**Game Logic Testing:**

```typescript
// Example test for game mechanics
describe('HealthComponent', () => {
  let healthComponent: HealthComponent;

  beforeEach(() => {
    const mockEntity = {} as GameEntity;
    healthComponent = new HealthComponent(mockEntity, 100);
  });

  test('should initialize with correct health', () => {
    expect(healthComponent.currentHealth).toBe(100);
    expect(healthComponent.maxHealth).toBe(100);
  });

  test('should handle damage correctly', () => {
    healthComponent.takeDamage(25);
    expect(healthComponent.currentHealth).toBe(75);
    expect(healthComponent.isAlive()).toBe(true);
  });

  test('should handle death correctly', () => {
    healthComponent.takeDamage(150);
    expect(healthComponent.currentHealth).toBe(0);
    expect(healthComponent.isAlive()).toBe(false);
  });
});
```

### Integration Testing

**Scene Testing:**

```typescript
describe('GameScene Integration', () => {
  let scene: GameScene;
  let mockGame: Phaser.Game;

  beforeEach(() => {
    // Mock Phaser game instance
    mockGame = createMockGame();
    scene = new GameScene();
  });

  test('should initialize all systems', () => {
    scene.create({});

    expect(scene.gameManager).toBeDefined();
    expect(scene.inputManager).toBeDefined();
  });
});
```

## File Organization

### Project Structure

```
src/
├── scenes/
│   ├── BootScene.ts          # Initial loading and setup
│   ├── PreloadScene.ts       # Asset loading with progress
│   ├── MenuScene.ts          # Main menu and navigation
│   ├── GameScene.ts          # Core gameplay
│   └── UIScene.ts            # Overlay UI elements
├── gameObjects/
│   ├── entities/
│   │   ├── Player.ts         # Player game object
│   │   ├── Enemy.ts          # Enemy base class
│   │   └── Collectible.ts    # Collectible items
│   ├── components/
│   │   ├── MovementComponent.ts
│   │   ├── HealthComponent.ts
│   │   └── CollisionComponent.ts
│   └── ui/
│       ├── Button.ts         # Interactive buttons
│       ├── HealthBar.ts      # Health display
│       └── ScoreDisplay.ts   # Score UI
├── systems/
│   ├── GameManager.ts        # Core game state management
│   ├── InputManager.ts       # Cross-platform input handling
│   ├── AudioManager.ts       # Sound and music system
│   ├── SaveManager.ts        # Save/load functionality
│   └── PerformanceMonitor.ts # Performance tracking
├── utils/
│   ├── ObjectPool.ts         # Generic object pooling
│   ├── MathUtils.ts          # Game math helpers
│   ├── AssetLoader.ts        # Asset management utilities
│   └── EventBus.ts           # Global event system
├── types/
│   ├── GameTypes.ts          # Core game type definitions
│   ├── UITypes.ts            # UI-related types
│   └── SystemTypes.ts        # System interface definitions
├── config/
│   ├── GameConfig.ts         # Phaser game configuration
│   ├── GameBalance.ts        # Game balance parameters
│   └── AssetConfig.ts        # Asset loading configuration
└── main.ts                   # Application entry point
```

## Development Workflow

### Story Implementation Process

1. **Read Story Requirements:**
   - Understand acceptance criteria
   - Identify technical requirements
   - Review performance constraints

2. **Plan Implementation:**
   - Identify files to create/modify
   - Consider component architecture
   - Plan testing approach

3. **Implement Feature:**
   - Follow TypeScript strict mode
   - Use established patterns
   - Maintain 60 FPS performance

4. **Test Implementation:**
   - Write unit tests for game logic
   - Test cross-platform functionality
   - Validate performance targets

5. **Update Documentation:**
   - Mark story checkboxes complete
   - Document any deviations
   - Update architecture if needed

### Code Review Checklist

**Before Committing:**

- [ ] TypeScript compiles without errors
- [ ] All tests pass
- [ ] Performance targets met (60 FPS)
- [ ] No console errors or warnings
- [ ] Cross-platform compatibility verified
- [ ] Memory usage within bounds
- [ ] Code follows naming conventions
- [ ] Error handling implemented
- [ ] Documentation updated

## Performance Targets

### Frame Rate Requirements

- **Desktop**: Maintain 60 FPS at 1080p
- **Mobile**: Maintain 60 FPS on mid-range devices, minimum 30 FPS on low-end
- **Optimization**: Implement dynamic quality scaling when performance drops

### Memory Management

- **Total Memory**: Under 100MB for full game
- **Per Scene**: Under 50MB per gameplay scene
- **Asset Loading**: Progressive loading to stay under limits
- **Garbage Collection**: Minimize object creation in update loops

### Loading Performance

- **Initial Load**: Under 5 seconds for game start
- **Scene Transitions**: Under 2 seconds between scenes
- **Asset Streaming**: Background loading for upcoming content

These guidelines ensure consistent, high-quality game development that meets performance targets and maintains code quality across all implementation stories.

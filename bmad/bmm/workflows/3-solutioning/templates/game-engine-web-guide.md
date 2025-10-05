# Web Game Engine Architecture Guide

This guide provides web game engine-specific guidance (Phaser, PixiJS, Three.js, Babylon.js) for solution architecture generation.

---

## Web Game-Specific Questions

### 1. Engine and Technology Selection

**Ask:**

- Which engine? (Phaser 3, PixiJS, Three.js, Babylon.js, custom Canvas/WebGL)
- TypeScript or JavaScript?
- Build tool? (Vite, Webpack, Rollup, Parcel)
- Target platform(s)? (Desktop web, mobile web, PWA, Cordova/Capacitor wrapper)

**Guidance:**

- **Phaser 3**: Full-featured 2D game framework, great for beginners
- **PixiJS**: 2D rendering library, more low-level than Phaser
- **Three.js**: 3D graphics library, mature ecosystem
- **Babylon.js**: Complete 3D game engine, WebXR support
- **TypeScript**: Recommended for all web games (type safety, better tooling)
- **Vite**: Modern, fast, HMR - best for development

**Record ADR:** Engine selection and build tooling

---

### 2. Architecture Pattern

**Ask:**

- Scene-based architecture? (Phaser scenes, custom scene manager)
- ECS (Entity Component System)? (Libraries: bitECS, ecsy)
- State management? (Redux, Zustand, custom FSM)

**Guidance:**

- **Scene-based**: Natural for Phaser, good for level-based games
- **ECS**: Better performance for large entity counts (100s+)
- **FSM**: Good for simple state transitions (menu → game → gameover)

**Phaser Pattern:**

```typescript
// MainMenuScene.ts
export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainMenu' });
  }

  create() {
    this.add.text(400, 300, 'Main Menu', { fontSize: '32px' });

    const startButton = this.add
      .text(400, 400, 'Start Game', { fontSize: '24px' })
      .setInteractive()
      .on('pointerdown', () => {
        this.scene.start('GameScene');
      });
  }
}
```

**Record ADR:** Architecture pattern and scene management

---

### 3. Asset Management

**Ask:**

- Asset loading strategy? (Preload all, lazy load, progressive)
- Texture atlas usage? (TexturePacker, built-in tools)
- Audio format strategy? (MP3, OGG, WebM)

**Guidance:**

- **Preload**: Load all assets at start (simple, small games)
- **Lazy load**: Load per-level (better for larger games)
- **Texture atlases**: Essential for performance (reduce draw calls)
- **Audio**: MP3 for compatibility, OGG for smaller size, use both

**Phaser loading:**

```typescript
class PreloadScene extends Phaser.Scene {
  preload() {
    // Show progress bar
    this.load.on('progress', (value: number) => {
      console.log('Loading: ' + Math.round(value * 100) + '%');
    });

    // Load assets
    this.load.atlas('sprites', 'assets/sprites.png', 'assets/sprites.json');
    this.load.audio('music', ['assets/music.mp3', 'assets/music.ogg']);
    this.load.audio('jump', ['assets/sfx/jump.mp3', 'assets/sfx/jump.ogg']);
  }

  create() {
    this.scene.start('MainMenu');
  }
}
```

**Record ADR:** Asset loading and management strategy

---

## Web Game-Specific Architecture Sections

### Performance Optimization

**Web-specific considerations:**

- **Object Pooling**: Mandatory for bullets, particles, enemies (avoid GC pauses)
- **Sprite Batching**: Use texture atlases, minimize state changes
- **Canvas vs WebGL**: WebGL for better performance (most games)
- **Draw Call Reduction**: Batch similar sprites, use sprite sheets
- **Memory Management**: Watch heap size, profile with Chrome DevTools

**Object Pooling Pattern:**

```typescript
class BulletPool {
  private pool: Bullet[] = [];
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, size: number) {
    this.scene = scene;
    for (let i = 0; i < size; i++) {
      const bullet = new Bullet(scene);
      bullet.setActive(false).setVisible(false);
      this.pool.push(bullet);
    }
  }

  spawn(x: number, y: number, velocityX: number, velocityY: number): Bullet | null {
    const bullet = this.pool.find((b) => !b.active);
    if (bullet) {
      bullet.spawn(x, y, velocityX, velocityY);
    }
    return bullet || null;
  }
}
```

**Target Performance:**

- **Desktop**: 60 FPS minimum
- **Mobile**: 60 FPS (high-end), 30 FPS (low-end)
- **Profile with**: Chrome DevTools Performance tab, Phaser Debug plugin

---

### Input Handling

**Multi-input support:**

```typescript
class GameScene extends Phaser.Scene {
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd?: { [key: string]: Phaser.Input.Keyboard.Key };

  create() {
    // Keyboard
    this.cursors = this.input.keyboard?.createCursorKeys();
    this.wasd = this.input.keyboard?.addKeys('W,S,A,D') as any;

    // Mouse/Touch
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.handleClick(pointer.x, pointer.y);
    });

    // Gamepad (optional)
    this.input.gamepad?.on('down', (pad, button, index) => {
      this.handleGamepadButton(button);
    });
  }

  update() {
    // Handle keyboard input
    if (this.cursors?.left.isDown || this.wasd?.A.isDown) {
      this.player.moveLeft();
    }
  }
}
```

---

### State Persistence

**LocalStorage pattern:**

```typescript
interface GameSaveData {
  level: number;
  score: number;
  playerStats: {
    health: number;
    lives: number;
  };
}

class SaveManager {
  private static SAVE_KEY = 'game_save_data';

  static save(data: GameSaveData): void {
    localStorage.setItem(this.SAVE_KEY, JSON.stringify(data));
  }

  static load(): GameSaveData | null {
    const data = localStorage.getItem(this.SAVE_KEY);
    return data ? JSON.parse(data) : null;
  }

  static clear(): void {
    localStorage.removeItem(this.SAVE_KEY);
  }
}
```

---

### Source Tree Structure

**Phaser + TypeScript + Vite:**

```
project/
├── public/              # Static assets
│   ├── assets/
│   │   ├── sprites/
│   │   ├── audio/
│   │   │   ├── music/
│   │   │   └── sfx/
│   │   └── fonts/
│   └── index.html
├── src/
│   ├── main.ts         # Game initialization
│   ├── config.ts       # Phaser config
│   ├── scenes/         # Game scenes
│   │   ├── PreloadScene.ts
│   │   ├── MainMenuScene.ts
│   │   ├── GameScene.ts
│   │   └── GameOverScene.ts
│   ├── entities/       # Game objects
│   │   ├── Player.ts
│   │   ├── Enemy.ts
│   │   └── Bullet.ts
│   ├── systems/        # Game systems
│   │   ├── InputManager.ts
│   │   ├── AudioManager.ts
│   │   └── SaveManager.ts
│   ├── utils/          # Utilities
│   │   ├── ObjectPool.ts
│   │   └── Constants.ts
│   └── types/          # TypeScript types
│       └── index.d.ts
├── tests/              # Unit tests
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

### Testing Strategy

**Jest + TypeScript:**

```typescript
// Player.test.ts
import { Player } from '../entities/Player';

describe('Player', () => {
  let player: Player;

  beforeEach(() => {
    // Mock Phaser scene
    const mockScene = {
      add: { sprite: jest.fn() },
      physics: { add: { sprite: jest.fn() } },
    } as any;

    player = new Player(mockScene, 0, 0);
  });

  test('takes damage correctly', () => {
    player.health = 100;
    player.takeDamage(20);
    expect(player.health).toBe(80);
  });

  test('dies when health reaches zero', () => {
    player.health = 10;
    player.takeDamage(20);
    expect(player.alive).toBe(false);
  });
});
```

**E2E Testing:**

- Playwright for browser automation
- Cypress for interactive testing
- Test game states, not individual frames

---

### Deployment and Build

**Build for production:**

```json
// package.json scripts
{
  "scripts": {
    "dev": "vite",
    "build": "tsc andand vite build",
    "preview": "vite preview",
    "test": "jest"
  }
}
```

**Deployment targets:**

- **Static hosting**: Netlify, Vercel, GitHub Pages, AWS S3
- **CDN**: Cloudflare, Fastly for global distribution
- **PWA**: Service worker for offline play
- **Mobile wrapper**: Cordova or Capacitor for app stores

**Optimization:**

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ['phaser'], // Separate Phaser bundle
        },
      },
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in prod
      },
    },
  },
});
```

---

## Specialist Recommendations

### Audio Designer

**When needed:** Games with music, sound effects, ambience
**Responsibilities:**

- Web Audio API architecture
- Audio sprite creation (combine sounds into one file)
- Music loop management
- Sound effect implementation
- Audio performance on web (decode strategy)

### Performance Optimizer

**When needed:** Mobile web games, complex games
**Responsibilities:**

- Chrome DevTools profiling
- Object pooling implementation
- Draw call optimization
- Memory management
- Bundle size optimization
- Network performance (asset loading)

### Monetization Specialist

**When needed:** F2P web games
**Responsibilities:**

- Ad network integration (Google AdSense, AdMob for web)
- In-game purchases (Stripe, PayPal)
- Analytics (Google Analytics, custom events)
- A/B testing frameworks
- Economy design

### Platform Specialist

**When needed:** Mobile wrapper apps (Cordova/Capacitor)
**Responsibilities:**

- Native plugin integration
- Platform-specific performance tuning
- App store submission
- Device compatibility testing
- Push notification setup

---

## Common Pitfalls

1. **Not using object pooling** - Frequent instantiation causes GC pauses
2. **Too many draw calls** - Use texture atlases and sprite batching
3. **Loading all assets at once** - Causes long initial load times
4. **Not testing on mobile** - Performance vastly different on phones
5. **Ignoring bundle size** - Large bundles = slow load times
6. **Not handling window resize** - Web games run in resizable windows
7. **Forgetting audio autoplay restrictions** - Browsers block auto-play without user interaction

---

## Engine-Specific Patterns

### Phaser 3

```typescript
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO, // WebGL with Canvas fallback
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 300 }, debug: false },
  },
  scene: [PreloadScene, MainMenuScene, GameScene, GameOverScene],
};

const game = new Phaser.Game(config);
```

### PixiJS

```typescript
const app = new PIXI.Application({
  width: 800,
  height: 600,
  backgroundColor: 0x1099bb,
});

document.body.appendChild(app.view);

const sprite = PIXI.Sprite.from('assets/player.png');
app.stage.addChild(sprite);

app.ticker.add((delta) => {
  sprite.rotation += 0.01 * delta;
});
```

### Three.js

```typescript
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  renderer.render(scene, camera);
}
animate();
```

---

## Key Architecture Decision Records

### ADR Template for Web Games

**ADR-XXX: [Title]**

**Context:**
What web game-specific issue are we solving?

**Options:**

1. Phaser 3 (full framework)
2. PixiJS (rendering library)
3. Three.js/Babylon.js (3D)
4. Custom Canvas/WebGL

**Decision:**
We chose [Option X]

**Web-specific Rationale:**

- Engine features vs bundle size
- Community and plugin ecosystem
- TypeScript support
- Performance on target devices (mobile web)
- Browser compatibility
- Development velocity

**Consequences:**

- Impact on bundle size (Phaser ~1.2MB gzipped)
- Learning curve
- Platform limitations
- Plugin availability

---

_This guide is specific to web game engines. For native engines, see:_

- game-engine-unity-guide.md
- game-engine-godot-guide.md
- game-engine-unreal-guide.md

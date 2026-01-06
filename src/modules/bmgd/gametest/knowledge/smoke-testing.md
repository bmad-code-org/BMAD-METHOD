# Smoke Testing Guide

## Overview

Smoke testing (Build Verification Testing) validates that a build's critical functionality works before investing time in detailed testing. A failed smoke test means "stop, this build is broken."

## Purpose

| Goal                | Description                                    |
| ------------------- | ---------------------------------------------- |
| Fast feedback       | Know within minutes if build is viable         |
| Block bad builds    | Prevent broken builds from reaching QA/players |
| Critical path focus | Test only what matters most                    |
| CI/CD integration   | Automated gate before deployment               |

## Smoke Test Principles

### What Makes a Good Smoke Test

- **Fast**: Complete in 5-15 minutes
- **Critical**: Tests only essential functionality
- **Deterministic**: Same result every run
- **Automated**: No human intervention required
- **Clear**: Pass/fail with actionable feedback

### What to Include

| Category          | Examples                       |
| ----------------- | ------------------------------ |
| Boot sequence     | Game launches without crash    |
| Core loop         | Player can perform main action |
| Save/Load         | Data persists correctly        |
| Critical UI       | Menus are navigable            |
| Platform services | Connects to required services  |

### What NOT to Include

- Edge cases and boundary conditions
- Performance benchmarks (separate tests)
- Full feature coverage
- Content verification
- Balance testing

## Smoke Test Scenarios

### Boot and Load

```
TEST: Game Launches
  WHEN game executable is started
  THEN main menu appears within 60 seconds
  AND no crashes occur
  AND required services connect

TEST: New Game Start
  GIVEN game at main menu
  WHEN "New Game" is selected
  THEN gameplay loads within 30 seconds
  AND player can control character

TEST: Continue Game
  GIVEN existing save file
  WHEN "Continue" is selected
  THEN correct save loads
  AND game state matches saved state
```

### Core Gameplay

```
TEST: Player Movement
  GIVEN player in game world
  WHEN movement input applied
  THEN player moves in expected direction
  AND no physics glitches occur

TEST: Core Action (Game-Specific)
  GIVEN player can perform primary action
  WHEN action is triggered
  THEN action executes correctly
  AND expected results occur

  Examples:
  - Shooter: Can fire weapon, bullets hit targets
  - RPG: Can attack enemy, damage is applied
  - Puzzle: Can interact with puzzle elements
  - Platformer: Can jump, platforms are solid
```

### Save System

```
TEST: Save Creates File
  GIVEN player makes progress
  WHEN save is triggered
  THEN save file is created
  AND save completes without error

TEST: Load Restores State
  GIVEN valid save file exists
  WHEN load is triggered
  THEN saved state is restored
  AND gameplay can continue
```

### Critical UI

```
TEST: Menu Navigation
  GIVEN main menu is displayed
  WHEN each menu option is selected
  THEN correct screen/action occurs
  AND navigation back works

TEST: Settings Persist
  GIVEN settings are changed
  WHEN game is restarted
  THEN settings remain changed
```

## Automated Smoke Test Examples

### Unity

```csharp
using System.Collections;
using NUnit.Framework;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.TestTools;
using UnityEngine.SceneManagement;

[TestFixture]
public class SmokeTests
{
    [UnityTest, Timeout(60000)]
    public IEnumerator Game_Launches_ToMainMenu()
    {
        // Load main menu scene
        SceneManager.LoadScene("MainMenu");
        yield return new WaitForSeconds(5f);

        // Verify menu is active
        var mainMenu = GameObject.Find("MainMenuCanvas");
        Assert.IsNotNull(mainMenu, "Main menu should be present");
        Assert.IsTrue(mainMenu.activeInHierarchy, "Main menu should be active");
    }

    [UnityTest, Timeout(120000)]
    public IEnumerator NewGame_LoadsGameplay()
    {
        // Start from main menu
        SceneManager.LoadScene("MainMenu");
        yield return new WaitForSeconds(2f);

        // Click new game
        var newGameButton = GameObject.Find("NewGameButton")
            .GetComponent<Button>();
        newGameButton.onClick.Invoke();

        yield return new WaitForSeconds(10f);

        // Verify gameplay scene loaded
        Assert.AreEqual("GameplayScene", SceneManager.GetActiveScene().name);

        // Verify player exists and can be controlled
        var player = GameObject.FindWithTag("Player");
        Assert.IsNotNull(player, "Player should exist");
    }

    [UnityTest, Timeout(30000)]
    public IEnumerator Player_CanMove()
    {
        // Load gameplay
        SceneManager.LoadScene("GameplayScene");
        yield return new WaitForSeconds(3f);

        var player = GameObject.FindWithTag("Player");
        var startPos = player.transform.position;

        // Simulate movement input
        var controller = player.GetComponent<PlayerController>();
        controller.SetMoveInput(Vector2.right);

        yield return new WaitForSeconds(1f);

        // Verify movement occurred
        Assert.Greater(player.transform.position.x, startPos.x,
            "Player should have moved");
    }

    [UnityTest, Timeout(30000)]
    public IEnumerator SaveLoad_RoundTrip_Works()
    {
        // Setup test state
        SceneManager.LoadScene("GameplayScene");
        yield return new WaitForSeconds(2f);

        var player = GameObject.FindWithTag("Player");
        player.transform.position = new Vector3(100, 0, 100);

        // Save
        SaveManager.Save("smoke_test");
        yield return null;

        // Reset position
        player.transform.position = Vector3.zero;

        // Load
        SaveManager.Load("smoke_test");
        yield return null;

        // Verify
        Assert.AreEqual(100f, player.transform.position.x, 1f);
    }
}
```

### Unreal

```cpp
// SmokeTests.cpp
IMPLEMENT_SIMPLE_AUTOMATION_TEST(
    FGameLaunchTest,
    "Smoke.Launch.MainMenu",
    EAutomationTestFlags::ApplicationContextMask | EAutomationTestFlags::SmokeFilter
)

bool FGameLaunchTest::RunTest(const FString& Parameters)
{
    // Verify main menu widget exists
    UWorld* World = GEngine->GetWorldContexts()[0].World();
    APlayerController* PC = World->GetFirstPlayerController();

    TestNotNull("Player controller exists", PC);

    // Check main menu is visible
    AMyHUD* HUD = Cast<AMyHUD>(PC->GetHUD());
    TestTrue("Main menu is visible", HUD->IsMainMenuVisible());

    return true;
}

IMPLEMENT_SIMPLE_AUTOMATION_TEST(
    FPlayerMovementTest,
    "Smoke.Gameplay.Movement",
    EAutomationTestFlags::ApplicationContextMask | EAutomationTestFlags::SmokeFilter
)

bool FPlayerMovementTest::RunTest(const FString& Parameters)
{
    APawn* Player = GetTestPlayer();
    FVector StartPos = Player->GetActorLocation();

    // Apply movement
    APlayerController* PC = Cast<APlayerController>(Player->GetController());
    PC->AddMovementInput(FVector::ForwardVector, 1.0f);

    // Wait for physics
    ADD_LATENT_AUTOMATION_COMMAND(FWaitForSeconds(0.5f));
    // Note: FVerifyPlayerMoved is a custom latent command - implement to verify player position changed
    ADD_LATENT_AUTOMATION_COMMAND(FVerifyPlayerMoved(StartPos));

    return true;
}
```

### Godot

```gdscript
# test_smoke.gd
extends GutTest

func test_game_launches():
    # Switch to main menu
    get_tree().change_scene_to_file("res://scenes/main_menu.tscn")
    await get_tree().process_frame
    await get_tree().create_timer(2.0).timeout

    # Verify main menu loaded
    var menu = get_tree().current_scene
    assert_not_null(menu, "Main menu should load")
    assert_eq(menu.name, "MainMenu", "Should be main menu scene")

func test_new_game_starts():
    get_tree().change_scene_to_file("res://scenes/main_menu.tscn")
    await get_tree().process_frame

    # Find and click new game button
    var button = get_tree().current_scene.get_node("NewGameButton")
    button.pressed.emit()

    await get_tree().create_timer(5.0).timeout

    # Verify gameplay loaded
    var scene = get_tree().current_scene
    assert_eq(scene.name, "GameWorld", "Should load gameplay scene")

    var player = scene.get_node("Player")
    assert_not_null(player, "Player should exist")

func test_player_can_move():
    get_tree().change_scene_to_file("res://scenes/game_world.tscn")
    await get_tree().create_timer(1.0).timeout

    var player = get_tree().current_scene.get_node("Player")
    var start_pos = player.position

    # Simulate input
    Input.action_press("move_right")
    await get_tree().create_timer(0.5).timeout
    Input.action_release("move_right")

    assert_gt(player.position.x, start_pos.x, "Player should have moved right")

func test_save_load_works():
    get_tree().change_scene_to_file("res://scenes/game_world.tscn")
    await get_tree().create_timer(1.0).timeout

    var player = get_tree().current_scene.get_node("Player")
    player.position = Vector2(500, 300)

    # Save
    SaveManager.save_game("smoke_test")
    await get_tree().process_frame

    # Reset
    player.position = Vector2.ZERO

    # Load
    SaveManager.load_game("smoke_test")
    await get_tree().process_frame

    assert_almost_eq(player.position.x, 500.0, 1.0, "Position should restore")
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Smoke Tests

on: [push, pull_request]

jobs:
  smoke-test:
    runs-on: ubuntu-latest
    timeout-minutes: 20

    steps:
      - uses: actions/checkout@v4

      - name: Build Game
        run: ./build.sh --configuration Release

      - name: Run Smoke Tests
        run: |
          ./game --headless --run-tests=Smoke --test-timeout=600

      - name: Upload Results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: smoke-test-results
          path: test-results/
```

### Test Execution Order

1. **Build verification** - Binary exists and is valid
2. **Launch test** - Game starts without crash
3. **Menu navigation** - Can navigate to gameplay
4. **Core loop** - Primary mechanic works
5. **Save/Load** - Persistence functions
6. **Cleanup** - No resource leaks

## Smoke Test Metrics

| Metric         | Target   | Action if Failed   |
| -------------- | -------- | ------------------ |
| Pass rate      | 100%     | Block deployment   |
| Execution time | < 15 min | Optimize tests     |
| Flakiness      | 0%       | Fix or remove test |

## Best Practices

### DO

- Run smoke tests on every build
- Keep tests fast and focused
- Fail loudly and clearly
- Test on target platform, not just dev environment
- Include platform service connectivity
- Run before any manual QA begins

### DON'T

- Include slow or flaky tests
- Test edge cases or rare scenarios
- Allow smoke test failures to ship
- Skip smoke tests for "small" changes
- Make smoke tests depend on external services
- Let smoke suite grow beyond 15 minutes

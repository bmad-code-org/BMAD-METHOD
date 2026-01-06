# Platform Certification Testing Guide

## Overview

Certification testing ensures games meet platform holder requirements (Sony TRC, Microsoft XR, Nintendo Guidelines). Failing certification delays launch and costs money—test thoroughly before submission.

## Platform Requirements Overview

### Major Platforms

| Platform        | Requirements Doc                       | Submission Portal         |
| --------------- | -------------------------------------- | ------------------------- |
| PlayStation     | TRC (Technical Requirements Checklist) | PlayStation Partners      |
| Xbox            | XR (Xbox Requirements)                 | Xbox Partner Center       |
| Nintendo Switch | Guidelines                             | Nintendo Developer Portal |
| Steam           | Guidelines (less strict)               | Steamworks                |
| iOS             | App Store Guidelines                   | App Store Connect         |
| Android         | Play Store Policies                    | Google Play Console       |

## Common Certification Categories

### Account and User Management

```
REQUIREMENT: User Switching
  GIVEN user is playing game
  WHEN system-level user switch occurs
  THEN game handles transition gracefully
  AND no data corruption
  AND correct user data loads

REQUIREMENT: Guest Accounts
  GIVEN guest user plays game
  WHEN guest makes progress
  THEN progress is not saved to other accounts
  AND appropriate warnings displayed

REQUIREMENT: Parental Controls
  GIVEN parental controls restrict content
  WHEN restricted content is accessed
  THEN content is blocked or modified
  AND appropriate messaging shown
```

### System Events

```
REQUIREMENT: Suspend/Resume (PS4/PS5)
  GIVEN game is running
  WHEN console enters rest mode
  AND console wakes from rest mode
  THEN game resumes correctly
  AND network reconnects if needed
  AND no audio/visual glitches

REQUIREMENT: Controller Disconnect
  GIVEN player is in gameplay
  WHEN controller battery dies
  THEN game pauses immediately
  AND reconnect prompt appears
  AND gameplay resumes when connected

REQUIREMENT: Storage Full
  GIVEN storage is nearly full
  WHEN game attempts save
  THEN graceful error handling
  AND user informed of issue
  AND no data corruption
```

### Network Requirements

```
REQUIREMENT: PSN/Xbox Live Unavailable
  GIVEN online features
  WHEN platform network is unavailable
  THEN offline features still work
  AND appropriate error messages
  AND no crashes

REQUIREMENT: Network Transition
  GIVEN active online session
  WHEN network connection lost
  THEN graceful handling
  AND reconnection attempted
  AND user informed of status

REQUIREMENT: NAT Type Handling
  GIVEN various NAT configurations
  WHEN multiplayer is attempted
  THEN appropriate feedback on connectivity
  AND fallback options offered
```

### Save Data

```
REQUIREMENT: Save Data Integrity
  GIVEN save data exists
  WHEN save is loaded
  THEN data is validated
  AND corrupted data handled gracefully
  AND no crashes on invalid data

REQUIREMENT: Cloud Save Sync
  GIVEN cloud saves enabled
  WHEN save conflict occurs
  THEN user chooses which to keep
  AND no silent data loss

REQUIREMENT: Save Data Portability (PS4→PS5)
  GIVEN save from previous generation
  WHEN loaded on current generation
  THEN data migrates correctly
  AND no features lost
```

## Platform-Specific Requirements

### PlayStation (TRC)

| Requirement | Description                 | Priority |
| ----------- | --------------------------- | -------- |
| TRC R4010   | Suspend/resume handling     | Critical |
| TRC R4037   | User switching              | Critical |
| TRC R4062   | Parental controls           | Critical |
| TRC R4103   | PS VR comfort ratings       | VR only  |
| TRC R4120   | DualSense haptics standards | PS5      |
| TRC R5102   | PSN sign-in requirements    | Online   |

### Xbox (XR)

| Requirement | Description                   | Priority    |
| ----------- | ----------------------------- | ----------- |
| XR-015      | Title timeout handling        | Critical    |
| XR-045      | User sign-out handling        | Critical    |
| XR-067      | Active user requirement       | Critical    |
| XR-074      | Quick Resume support          | Series X/S  |
| XR-115      | Xbox Accessibility Guidelines | Recommended |

### Nintendo Switch

| Requirement        | Description         | Priority |
| ------------------ | ------------------- | -------- |
| Docked/Handheld    | Seamless transition | Critical |
| Joy-Con detachment | Controller handling | Critical |
| Home button        | Immediate response  | Critical |
| Screenshots/Video  | Proper support      | Required |
| Sleep mode         | Resume correctly    | Critical |

## Automated Test Examples

### System Event Testing

```cpp
// Unreal - Suspend/Resume Test
IMPLEMENT_SIMPLE_AUTOMATION_TEST(
    FSuspendResumeTest,
    "Certification.System.SuspendResume",
    EAutomationTestFlags::ApplicationContextMask | EAutomationTestFlags::ProductFilter
)

bool FSuspendResumeTest::RunTest(const FString& Parameters)
{
    // Get game state before suspend
    FGameState StateBefore = GetCurrentGameState();

    // Simulate suspend
    FCoreDelegates::ApplicationWillEnterBackgroundDelegate.Broadcast();

    // Simulate resume
    FCoreDelegates::ApplicationHasEnteredForegroundDelegate.Broadcast();

    // Verify state matches
    FGameState StateAfter = GetCurrentGameState();

    TestEqual("Player position preserved",
        StateAfter.PlayerPosition, StateBefore.PlayerPosition);
    TestEqual("Game progress preserved",
        StateAfter.Progress, StateBefore.Progress);

    return true;
}
```

```csharp
// Unity - Controller Disconnect Test
[UnityTest]
public IEnumerator ControllerDisconnect_ShowsPauseMenu()
{
    // Simulate gameplay
    GameManager.Instance.StartGame();
    yield return new WaitForSeconds(1f);

    // Simulate controller disconnect
    InputSystem.DisconnectDevice(Gamepad.current);
    yield return null;

    // Verify pause menu shown
    Assert.IsTrue(PauseMenu.IsVisible, "Pause menu should appear");
    Assert.IsTrue(Time.timeScale == 0, "Game should be paused");

    // Simulate reconnect
    InputSystem.ReconnectDevice(Gamepad.current);
    yield return null;

    // Verify prompt appears
    Assert.IsTrue(ReconnectPrompt.IsVisible);
}
```

```gdscript
# Godot - Save Corruption Test
func test_corrupted_save_handling():
    # Create corrupted save file
    var file = FileAccess.open("user://save_corrupt.dat", FileAccess.WRITE)
    file.store_string("CORRUPTED_GARBAGE_DATA")
    file.close()

    # Attempt to load
    var result = SaveManager.load("save_corrupt")

    # Should handle gracefully
    assert_null(result, "Should return null for corrupted save")
    assert_false(OS.has_feature("crashed"), "Should not crash")

    # Should show user message
    var message_shown = ErrorDisplay.current_message != ""
    assert_true(message_shown, "Should inform user of corruption")
```

## Pre-Submission Checklist

### General Requirements

- [ ] Game boots to interactive state within platform time limit
- [ ] Controller disconnect pauses game
- [ ] User sign-out handled correctly
- [ ] Save data validates on load
- [ ] No crashes in 8+ hours of automated testing
- [ ] Memory usage within platform limits
- [ ] Load times meet requirements

### Platform Services

- [ ] Achievements/Trophies work correctly
- [ ] Friends list integration works
- [ ] Invite system functions
- [ ] Store/DLC integration validated
- [ ] Cloud saves sync properly

### Accessibility (Increasingly Required)

- [ ] Text size options
- [ ] Colorblind modes
- [ ] Subtitle options
- [ ] Controller remapping
- [ ] Screen reader support (where applicable)

### Content Compliance

- [ ] Age rating displayed correctly
- [ ] Parental controls respected
- [ ] No prohibited content
- [ ] Required legal text present

## Common Certification Failures

| Issue                 | Platform     | Fix                                 |
| --------------------- | ------------ | ----------------------------------- |
| Home button delay     | All consoles | Respond within required time        |
| Controller timeout    | PlayStation  | Handle reactivation properly        |
| Save on suspend       | PlayStation  | Don't save during suspend           |
| User context loss     | Xbox         | Track active user correctly         |
| Joy-Con drift         | Switch       | Proper deadzone handling            |
| Background memory     | Mobile       | Release resources when backgrounded |
| Crash on corrupt data | All          | Validate all loaded data            |

## Testing Matrix

### Build Configurations to Test

| Configuration   | Scenarios               |
| --------------- | ----------------------- |
| First boot      | No save data exists     |
| Return user     | Save data present       |
| Upgrade path    | Previous version save   |
| Fresh install   | After uninstall         |
| Low storage     | Minimum space available |
| Network offline | No connectivity         |

### Hardware Variants

| Platform    | Variants to Test                |
| ----------- | ------------------------------- |
| PlayStation | PS4, PS4 Pro, PS5               |
| Xbox        | One, One X, Series S, Series X  |
| Switch      | Docked, Handheld, Lite          |
| PC          | Min spec, recommended, high-end |

## Best Practices

### DO

- Read platform requirements document thoroughly
- Test on actual hardware, not just dev kits
- Automate certification test scenarios
- Submit with extra time for re-submission
- Document all edge case handling
- Test with real user accounts

### DON'T

- Assume debug builds behave like retail
- Skip testing on oldest supported hardware
- Ignore platform-specific features
- Wait until last minute to test certification items
- Use placeholder content in submission build
- Skip testing with real platform services

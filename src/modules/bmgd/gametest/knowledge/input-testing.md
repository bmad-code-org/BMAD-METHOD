# Input Testing Guide

## Overview

Input testing validates that all supported input devices work correctly across platforms. Poor input handling frustrates players instantly—responsive, accurate input is foundational to game feel.

## Input Categories

### Device Types

| Device            | Platforms      | Key Concerns                        |
| ----------------- | -------------- | ----------------------------------- |
| Keyboard + Mouse  | PC             | Key conflicts, DPI sensitivity      |
| Gamepad (Xbox/PS) | PC, Console    | Deadzone, vibration, button prompts |
| Touch             | Mobile, Switch | Multi-touch, gesture recognition    |
| Motion Controls   | Switch, VR     | Calibration, drift, fatigue         |
| Specialty         | Various        | Flight sticks, wheels, fight sticks |

### Input Characteristics

| Characteristic | Description                  | Test Focus                       |
| -------------- | ---------------------------- | -------------------------------- |
| Responsiveness | Input-to-action delay        | Should feel instant (< 100ms)    |
| Accuracy       | Input maps to correct action | No ghost inputs or missed inputs |
| Consistency    | Same input = same result     | Deterministic behavior           |
| Accessibility  | Alternative input support    | Remapping, assist options        |

## Test Scenarios

### Keyboard and Mouse

```
SCENARIO: All Keybinds Functional
  GIVEN default keyboard bindings
  WHEN each bound key is pressed
  THEN corresponding action triggers
  AND no key conflicts exist

SCENARIO: Key Remapping
  GIVEN player remaps "Jump" from Space to F
  WHEN F is pressed
  THEN jump action triggers
  AND Space no longer triggers jump
  AND remapping persists after restart

SCENARIO: Mouse Sensitivity
  GIVEN sensitivity set to 5 (mid-range)
  WHEN mouse moves 10cm
  THEN camera rotation matches expected degrees
  AND movement feels consistent at different frame rates

SCENARIO: Mouse Button Support
  GIVEN mouse with 5+ buttons
  WHEN side buttons are pressed
  THEN they can be bound to actions
  AND they function correctly in gameplay
```

### Gamepad

```
SCENARIO: Analog Stick Deadzone
  GIVEN controller with slight stick drift
  WHEN stick is in neutral position
  THEN no movement occurs (deadzone filters drift)
  AND intentional small movements still register

SCENARIO: Trigger Pressure
  GIVEN analog triggers
  WHEN trigger is partially pressed
  THEN partial values are read (e.g., 0.5 for half-press)
  AND full press reaches 1.0

SCENARIO: Controller Hot-Swap
  GIVEN game running with keyboard
  WHEN gamepad is connected
  THEN input prompts switch to gamepad icons
  AND gamepad input works immediately
  AND keyboard still works if used

SCENARIO: Vibration Feedback
  GIVEN rumble-enabled controller
  WHEN damage is taken
  THEN controller vibrates appropriately
  AND vibration intensity matches damage severity
```

### Touch Input

```
SCENARIO: Multi-Touch Accuracy
  GIVEN virtual joystick and buttons
  WHEN left thumb on joystick AND right thumb on button
  THEN both inputs register simultaneously
  AND no interference between touch points

SCENARIO: Gesture Recognition
  GIVEN swipe-to-attack mechanic
  WHEN player swipes right
  THEN attack direction matches swipe
  AND swipe is distinguished from tap

SCENARIO: Touch Target Size
  GIVEN minimum touch target of 44x44 points
  WHEN buttons are placed
  THEN all interactive elements meet minimum size
  AND elements have adequate spacing
```

## Platform-Specific Testing

### PC

- Multiple keyboard layouts (QWERTY, AZERTY, QWERTZ)
- Different mouse DPI settings (400-3200+)
- Multiple monitors (cursor confinement)
- Background application conflicts
- Steam Input API integration

### Console

| Platform    | Specific Tests                             |
| ----------- | ------------------------------------------ |
| PlayStation | Touchpad, adaptive triggers, haptics       |
| Xbox        | Impulse triggers, Elite controller paddles |
| Switch      | Joy-Con detachment, gyro, HD rumble        |

### Mobile

- Different screen sizes and aspect ratios
- Notch/cutout avoidance
- External controller support
- Apple MFi / Android gamepad compatibility

## Automated Test Examples

### Unity

```csharp
using UnityEngine.InputSystem;

[UnityTest]
public IEnumerator Movement_WithGamepad_RespondsToStick()
{
    var gamepad = InputSystem.AddDevice<Gamepad>();

    yield return null;

    // Simulate stick input
    Set(gamepad.leftStick, new Vector2(1, 0));
    yield return new WaitForSeconds(0.1f);

    Assert.Greater(player.transform.position.x, 0f,
        "Player should move right");

    InputSystem.RemoveDevice(gamepad);
}

[UnityTest]
public IEnumerator InputLatency_UnderLoad_StaysAcceptable()
{
    float inputTime = Time.realtimeSinceStartup;
    bool actionTriggered = false;

    player.OnJump += () => {
        float latency = (Time.realtimeSinceStartup - inputTime) * 1000;
        Assert.Less(latency, 100f, "Input latency should be under 100ms");
        actionTriggered = true;
    };

    var keyboard = InputSystem.AddDevice<Keyboard>();
    Press(keyboard.spaceKey);

    yield return new WaitForSeconds(0.2f);

    Assert.IsTrue(actionTriggered, "Jump should have triggered");
}

[Test]
public void Deadzone_FiltersSmallInputs()
{
    var settings = new InputSettings { stickDeadzone = 0.2f };

    // Input below deadzone
    var filtered = InputProcessor.ApplyDeadzone(new Vector2(0.1f, 0.1f), settings);
    Assert.AreEqual(Vector2.zero, filtered);

    // Input above deadzone
    filtered = InputProcessor.ApplyDeadzone(new Vector2(0.5f, 0.5f), settings);
    Assert.AreNotEqual(Vector2.zero, filtered);
}
```

### Unreal

```cpp
bool FInputTest::RunTest(const FString& Parameters)
{
    // Test gamepad input mapping
    APlayerController* PC = GetWorld()->GetFirstPlayerController();

    // Simulate gamepad stick input
    FInputKeyParams Params;
    Params.Key = EKeys::Gamepad_LeftX;
    Params.Delta = FVector(1.0f, 0, 0);
    PC->InputKey(Params);

    // Verify movement
    APawn* Pawn = PC->GetPawn();
    FVector Velocity = Pawn->GetVelocity();

    TestTrue("Pawn should be moving", Velocity.SizeSquared() > 0);

    return true;
}
```

### Godot

```gdscript
func test_input_action_mapping():
    # Verify action exists
    assert_true(InputMap.has_action("jump"))

    # Simulate input
    var event = InputEventKey.new()
    event.keycode = KEY_SPACE
    event.pressed = true

    Input.parse_input_event(event)
    await get_tree().process_frame

    assert_true(Input.is_action_just_pressed("jump"))

func test_gamepad_deadzone():
    var input = Vector2(0.15, 0.1)
    var deadzone = 0.2

    var processed = input_processor.apply_deadzone(input, deadzone)

    assert_eq(processed, Vector2.ZERO, "Small input should be filtered")

func test_controller_hotswap():
    # Simulate controller connect
    Input.joy_connection_changed(0, true)
    await get_tree().process_frame

    var prompt_icon = ui.get_action_prompt("jump")

    assert_true(prompt_icon.texture.resource_path.contains("gamepad"),
        "Should show gamepad prompts after controller connect")
```

## Accessibility Testing

### Requirements Checklist

- [ ] Full keyboard navigation (no mouse required)
- [ ] Remappable controls for all actions
- [ ] Button hold alternatives to rapid press
- [ ] Toggle options for hold actions
- [ ] One-handed control schemes
- [ ] Colorblind-friendly UI indicators
- [ ] Screen reader support for menus

### Accessibility Test Scenarios

```
SCENARIO: Keyboard-Only Navigation
  GIVEN mouse is disconnected
  WHEN navigating through all menus
  THEN all menu items are reachable via keyboard
  AND focus indicators are clearly visible

SCENARIO: Button Hold Toggle
  GIVEN "sprint requires hold" is toggled OFF
  WHEN sprint button is tapped once
  THEN sprint activates
  AND sprint stays active until tapped again

SCENARIO: Reduced Button Mashing
  GIVEN QTE assist mode enabled
  WHEN QTE sequence appears
  THEN single press advances sequence
  AND no rapid input required
```

## Performance Metrics

| Metric                  | Target          | Maximum Acceptable |
| ----------------------- | --------------- | ------------------ |
| Input-to-render latency | < 50ms          | 100ms              |
| Polling rate match      | 1:1 with device | No input loss      |
| Deadzone processing     | < 1ms           | 5ms                |
| Rebind save/load        | < 100ms         | 500ms              |

## Best Practices

### DO

- Test with actual hardware, not just simulated input
- Support simultaneous keyboard + gamepad
- Provide sensible default deadzones
- Show device-appropriate button prompts
- Allow complete control remapping
- Test at different frame rates

### DON'T

- Assume controller layout (Xbox vs PlayStation)
- Hard-code input mappings
- Ignore analog input precision
- Skip accessibility considerations
- Forget about input during loading/cutscenes
- Neglect testing with worn/drifting controllers

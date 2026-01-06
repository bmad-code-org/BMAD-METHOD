# Save System Testing Guide

## Overview

Save system testing ensures data persistence, integrity, and compatibility across game versions. Save bugs are among the most frustrating for players—data loss destroys trust.

## Test Categories

### Data Integrity

| Test Type            | Description                                 | Priority |
| -------------------- | ------------------------------------------- | -------- |
| Round-trip           | Save → Load → Verify all data matches       | P0       |
| Corruption detection | Tampered/corrupted files handled gracefully | P0       |
| Partial write        | Power loss during save doesn't corrupt      | P0       |
| Large saves          | Performance with max-size save files        | P1       |
| Edge values          | Min/max values for all saved fields         | P1       |

### Version Compatibility

| Scenario                | Expected Behavior                     |
| ----------------------- | ------------------------------------- |
| Current → Current       | Full compatibility                    |
| Old → New (upgrade)     | Migration with data preservation      |
| New → Old (downgrade)   | Graceful rejection or limited support |
| Corrupted version field | Fallback to recovery mode             |

## Test Scenarios

### Core Save/Load Tests

```
SCENARIO: Basic Save Round-Trip
  GIVEN player has 100 health, 50 gold, position (10, 5, 20)
  AND player has inventory: ["sword", "potion", "key"]
  WHEN game is saved
  AND game is reloaded
  THEN player health equals 100
  AND player gold equals 50
  AND player position equals (10, 5, 20)
  AND inventory contains exactly ["sword", "potion", "key"]

SCENARIO: Save During Gameplay
  GIVEN player is in combat
  AND enemy has 50% health remaining
  WHEN autosave triggers
  AND game is reloaded
  THEN combat state is restored
  AND enemy health equals 50%

SCENARIO: Multiple Save Slots
  GIVEN save slot 1 has character "Hero" at level 10
  AND save slot 2 has character "Mage" at level 5
  WHEN switching between slots
  THEN correct character data loads for each slot
  AND no cross-contamination between slots
```

### Edge Cases

```
SCENARIO: Maximum Inventory Save
  GIVEN player has 999 items in inventory
  WHEN game is saved
  AND game is reloaded
  THEN all 999 items are preserved
  AND save/load completes within 5 seconds

SCENARIO: Unicode Character Names
  GIVEN player name is "プレイヤー名"
  WHEN game is saved
  AND game is reloaded
  THEN player name displays correctly

SCENARIO: Extreme Play Time
  GIVEN play time is 9999:59:59
  WHEN game is saved
  AND game is reloaded
  THEN play time displays correctly
  AND timer continues from saved value
```

### Corruption Recovery

```
SCENARIO: Corrupted Save Detection
  GIVEN save file has been manually corrupted
  WHEN game attempts to load
  THEN error is detected before loading
  AND user is informed of corruption
  AND game does not crash

SCENARIO: Missing Save File
  GIVEN save file has been deleted externally
  WHEN game attempts to load
  THEN graceful error handling
  AND option to start new game or restore backup

SCENARIO: Interrupted Save (Power Loss)
  GIVEN save operation is interrupted mid-write
  WHEN game restarts
  THEN backup save is detected and offered
  AND no data loss from previous valid save
```

## Platform-Specific Testing

### PC (Steam/Epic)

- Cloud save sync conflicts
- Multiple Steam accounts on same PC
- Offline → Online sync
- Save location permissions (Program Files issues)

### Console (PlayStation/Xbox/Switch)

- System-level save management
- Storage full scenarios
- User switching mid-game
- Suspend/resume with unsaved changes
- Cloud save quota limits

### Mobile

- App termination during save
- Low storage warnings
- iCloud/Google Play sync
- Device migration

## Automated Test Examples

### Unity

```csharp
[Test]
public void SaveLoad_PlayerStats_PreservesAllValues()
{
    var original = new PlayerData
    {
        Health = 75,
        MaxHealth = 100,
        Gold = 1234567,
        Position = new Vector3(100.5f, 0, -50.25f),
        PlayTime = 36000f // 10 hours
    };

    SaveManager.Save(original, "test_slot");
    var loaded = SaveManager.Load("test_slot");

    Assert.AreEqual(original.Health, loaded.Health);
    Assert.AreEqual(original.Gold, loaded.Gold);
    Assert.AreEqual(original.Position, loaded.Position);
    Assert.AreEqual(original.PlayTime, loaded.PlayTime, 0.01f);
}

[Test]
public void SaveLoad_CorruptedFile_HandlesGracefully()
{
    File.WriteAllText(SaveManager.GetPath("corrupt"), "INVALID DATA");

    Assert.Throws<SaveCorruptedException>(() =>
        SaveManager.Load("corrupt"));

    // Game should not crash
    Assert.IsTrue(SaveManager.IsValidSaveSlot("corrupt") == false);
}
```

### Unreal

```cpp
bool FSaveSystemTest::RunTest(const FString& Parameters)
{
    // Create test save
    USaveGame* SaveGame = UGameplayStatics::CreateSaveGameObject(
        UMySaveGame::StaticClass());
    UMySaveGame* MySave = Cast<UMySaveGame>(SaveGame);

    MySave->PlayerLevel = 50;
    MySave->Gold = 999999;
    MySave->QuestsCompleted = {"Quest1", "Quest2", "Quest3"};

    // Save
    UGameplayStatics::SaveGameToSlot(MySave, "TestSlot", 0);

    // Load
    USaveGame* Loaded = UGameplayStatics::LoadGameFromSlot("TestSlot", 0);
    UMySaveGame* LoadedSave = Cast<UMySaveGame>(Loaded);

    TestEqual("Level preserved", LoadedSave->PlayerLevel, 50);
    TestEqual("Gold preserved", LoadedSave->Gold, 999999);
    TestEqual("Quests count", LoadedSave->QuestsCompleted.Num(), 3);

    return true;
}
```

### Godot

```gdscript
func test_save_load_round_trip():
    var original = {
        "health": 100,
        "position": Vector3(10, 0, 20),
        "inventory": ["sword", "shield"],
        "quest_flags": {"intro_complete": true, "boss_defeated": false}
    }

    SaveManager.save_game(original, "test_save")
    var loaded = SaveManager.load_game("test_save")

    assert_eq(loaded.health, 100)
    assert_eq(loaded.position, Vector3(10, 0, 20))
    assert_eq(loaded.inventory.size(), 2)
    assert_true(loaded.quest_flags.intro_complete)
    assert_false(loaded.quest_flags.boss_defeated)

func test_corrupted_save_detection():
    var file = FileAccess.open("user://saves/corrupt.sav", FileAccess.WRITE)
    file.store_string("CORRUPTED GARBAGE DATA")
    file.close()

    var result = SaveManager.load_game("corrupt")

    assert_null(result, "Should return null for corrupted save")
    assert_false(SaveManager.is_valid_save("corrupt"))
```

## Migration Testing

### Version Upgrade Matrix

| From Version   | To Version       | Test Focus                   |
| -------------- | ---------------- | ---------------------------- |
| 1.0 → 1.1      | Minor update     | New fields default correctly |
| 1.x → 2.0      | Major update     | Schema migration works       |
| Beta → Release | Launch migration | All beta saves convert       |

### Migration Test Template

```
SCENARIO: Save Migration v1.0 to v2.0
  GIVEN save file from version 1.0
  AND save contains old inventory format (array)
  WHEN game version 2.0 loads the save
  THEN inventory is migrated to new format (dictionary)
  AND all items are preserved
  AND migration is logged
  AND backup of original is created
```

## Performance Benchmarks

| Metric                   | Target          | Maximum |
| ------------------------ | --------------- | ------- |
| Save time (typical)      | < 500ms         | 2s      |
| Save time (large)        | < 2s            | 5s      |
| Load time (typical)      | < 1s            | 3s      |
| Save file size (typical) | < 1MB           | 10MB    |
| Memory during save       | < 50MB overhead | 100MB   |

## Best Practices

### DO

- Use atomic saves (write to temp, then rename)
- Keep backup of previous save
- Version your save format
- Encrypt sensitive data
- Test on minimum-spec hardware
- Compress large saves

### DON'T

- Store absolute file paths
- Save derived/calculated data
- Trust save file contents blindly
- Block gameplay during save
- Forget to handle storage-full scenarios
- Skip testing save migration paths

# Unreal Engine Automation Testing Guide

## Overview

Unreal Engine provides a comprehensive automation system for testing games, including:

- **Automation Framework** - Low-level test infrastructure
- **Functional Tests** - In-game scenario testing
- **Gauntlet** - Extended testing and automation

## Automation Framework

### Test Types

| Type          | Flag            | Use Case                   |
| ------------- | --------------- | -------------------------- |
| Unit Tests    | `SmokeFilter`   | Fast, isolated logic tests |
| Feature Tests | `ProductFilter` | Feature validation         |
| Stress Tests  | `StressFilter`  | Performance under load     |
| Perf Tests    | `PerfFilter`    | Benchmark comparisons      |

### Basic Test Structure

```cpp
// MyGameTests.cpp
#include "Misc/AutomationTest.h"

IMPLEMENT_SIMPLE_AUTOMATION_TEST(
    FDamageCalculationTest,
    "MyGame.Combat.DamageCalculation",
    EAutomationTestFlags::ApplicationContextMask |
    EAutomationTestFlags::ProductFilter
)

bool FDamageCalculationTest::RunTest(const FString& Parameters)
{
    // Arrange
    float BaseDamage = 100.f;
    float CritMultiplier = 2.f;

    // Act
    float Result = UDamageCalculator::Calculate(BaseDamage, CritMultiplier);

    // Assert
    TestEqual("Critical hit doubles damage", Result, 200.f);

    return true;
}
```

### Complex Test with Setup/Teardown

```cpp
IMPLEMENT_COMPLEX_AUTOMATION_TEST(
    FInventorySystemTest,
    "MyGame.Systems.Inventory",
    EAutomationTestFlags::ApplicationContextMask |
    EAutomationTestFlags::ProductFilter
)

void FInventorySystemTest::GetTests(
    TArray<FString>& OutBeautifiedNames,
    TArray<FString>& OutTestCommands) const
{
    OutBeautifiedNames.Add("AddItem");
    OutTestCommands.Add("AddItem");

    OutBeautifiedNames.Add("RemoveItem");
    OutTestCommands.Add("RemoveItem");

    OutBeautifiedNames.Add("StackItems");
    OutTestCommands.Add("StackItems");
}

bool FInventorySystemTest::RunTest(const FString& Parameters)
{
    // Setup
    UInventoryComponent* Inventory = NewObject<UInventoryComponent>();

    if (Parameters == "AddItem")
    {
        UItemData* Sword = NewObject<UItemData>();
        Sword->ItemID = "sword_01";

        bool bAdded = Inventory->AddItem(Sword);

        TestTrue("Item added successfully", bAdded);
        TestEqual("Inventory count", Inventory->GetItemCount(), 1);
    }
    else if (Parameters == "RemoveItem")
    {
        // ... test logic
    }
    else if (Parameters == "StackItems")
    {
        // ... test logic
    }

    return true;
}
```

### Latent Actions (Async Tests)

```cpp
DEFINE_LATENT_AUTOMATION_COMMAND_ONE_PARAMETER(
    FWaitForActorSpawn,
    FString, ActorName
);

bool FWaitForActorSpawn::Update()
{
    UWorld* World = GEngine->GetWorldContexts()[0].World();
    AActor* Actor = nullptr;

    for (TActorIterator<AActor> It(World); It; ++It)
    {
        if (It->GetName() == ActorName)
        {
            Actor = *It;
            break;
        }
    }

    return Actor != nullptr; // Return true when complete
}

bool FSpawnTest::RunTest(const FString& Parameters)
{
    // Spawn enemy
    ADD_LATENT_AUTOMATION_COMMAND(FSpawnEnemy("Goblin"));

    // Wait for spawn
    ADD_LATENT_AUTOMATION_COMMAND(FWaitForActorSpawn("Goblin"));

    // Verify
    ADD_LATENT_AUTOMATION_COMMAND(FVerifyEnemyState("Goblin", "Idle"));

    return true;
}
```

## Functional Tests

Functional tests run inside the game world and can test gameplay scenarios.

### Setup

1. Create a test map (`TestMap_Combat.umap`)
2. Add `AFunctionalTest` actors to the map
3. Configure test parameters in Details panel

### Blueprint Functional Test

```cpp
// In Blueprint:
// 1. Create child of AFunctionalTest
// 2. Override "Start Test" event
// 3. Call "Finish Test" when complete
```

### C++ Functional Test

```cpp
UCLASS()
class APlayerCombatTest : public AFunctionalTest
{
    GENERATED_BODY()

public:
    virtual void StartTest() override;

protected:
    UPROPERTY(EditAnywhere)
    TSubclassOf<AEnemy> EnemyClass;

    UPROPERTY(EditAnywhere)
    float ExpectedDamage = 50.f;

private:
    void OnEnemyDamaged(float Damage);
};

void APlayerCombatTest::StartTest()
{
    Super::StartTest();

    // Spawn test enemy
    AEnemy* Enemy = GetWorld()->SpawnActor<AEnemy>(EnemyClass);
    Enemy->OnDamaged.AddDynamic(this, &APlayerCombatTest::OnEnemyDamaged);

    // Get player and attack
    APlayerCharacter* Player = Cast<APlayerCharacter>(
        UGameplayStatics::GetPlayerCharacter(this, 0));
    Player->Attack(Enemy);
}

void APlayerCombatTest::OnEnemyDamaged(float Damage)
{
    if (FMath::IsNearlyEqual(Damage, ExpectedDamage, 0.1f))
    {
        FinishTest(EFunctionalTestResult::Succeeded, "Damage correct");
    }
    else
    {
        FinishTest(EFunctionalTestResult::Failed,
            FString::Printf(TEXT("Expected %f, got %f"),
                ExpectedDamage, Damage));
    }
}
```

## Gauntlet Framework

Gauntlet extends automation for large-scale testing, performance benchmarking, and multi-client scenarios.

### Gauntlet Test Configuration

```cpp
// MyGameTest.cs (Gauntlet config)
namespace MyGame.Automation
{
    public class PerformanceTestConfig : UnrealTestConfig
    {
        [AutoParam]
        public string MapName = "TestMap_Performance";

        [AutoParam]
        public int Duration = 300; // 5 minutes

        public override void ApplyToConfig(UnrealAppConfig Config)
        {
            base.ApplyToConfig(Config);
            Config.AddCmdLineArg("-game");
            Config.AddCmdLineArg($"-ExecCmds=open {MapName}");
        }
    }
}
```

### Running Gauntlet

```bash
# Run performance test
RunUAT.bat RunUnreal -project=MyGame -platform=Win64 \
  -configuration=Development -build=local \
  -test=MyGame.PerformanceTest -Duration=300
```

## Blueprint Testing

### Test Helpers in Blueprint

Create a Blueprint Function Library with test utilities:

```cpp
UCLASS()
class UTestHelpers : public UBlueprintFunctionLibrary
{
    GENERATED_BODY()

public:
    UFUNCTION(BlueprintCallable, Category = "Testing")
    static void AssertTrue(bool Condition, const FString& Message);

    UFUNCTION(BlueprintCallable, Category = "Testing")
    static void AssertEqual(int32 A, int32 B, const FString& Message);

    UFUNCTION(BlueprintCallable, Category = "Testing")
    static AActor* SpawnTestActor(
        UObject* WorldContext,
        TSubclassOf<AActor> ActorClass,
        FVector Location);
};
```

## Performance Testing

### Frame Time Measurement

```cpp
bool FFrameTimeTest::RunTest(const FString& Parameters)
{
    TArray<float> FrameTimes;
    float TotalTime = 0.f;

    // Collect frame times
    ADD_LATENT_AUTOMATION_COMMAND(FCollectFrameTimes(
        FrameTimes, 1000 // frames
    ));

    // Analyze
    ADD_LATENT_AUTOMATION_COMMAND(FAnalyzeFrameTimes(
        FrameTimes,
        16.67f, // Target: 60fps
        0.99f   // 99th percentile threshold
    ));

    return true;
}
```

### Memory Tracking

```cpp
bool FMemoryLeakTest::RunTest(const FString& Parameters)
{
    SIZE_T BaselineMemory = FPlatformMemory::GetStats().UsedPhysical;

    // Perform operations
    for (int i = 0; i < 100; i++)
    {
        UObject* Obj = NewObject<UMyObject>();
        // ... use object
        Obj->MarkAsGarbage();  // UE5 API (was MarkPendingKill in UE4)
    }

    CollectGarbage(GARBAGE_COLLECTION_KEEPFLAGS);

    SIZE_T FinalMemory = FPlatformMemory::GetStats().UsedPhysical;
    SIZE_T Leaked = FinalMemory - BaselineMemory;

    TestTrue("No significant leak", Leaked < 1024 * 1024); // 1MB tolerance

    return true;
}
```

## CI Integration

### Command Line

```bash
# Run all tests (UE5)
UnrealEditor.exe MyGame -ExecCmds="Automation RunTests Now" -unattended -nopause

# Run specific test
UnrealEditor.exe MyGame -ExecCmds="Automation RunTests MyGame.Combat" -unattended

# Run with report
UnrealEditor.exe MyGame \
  -ExecCmds="Automation RunTests Now; Automation ReportResults" \
  -ReportOutputPath=TestResults.xml

# Note: For UE4, use UE4Editor.exe instead of UnrealEditor.exe
```

### GitHub Actions

```yaml
test:
  runs-on: [self-hosted, windows, unreal]
  steps:
    - name: Run Tests
      run: |
        # UE5: UnrealEditor-Cmd.exe, UE4: UE4Editor-Cmd.exe
        & "$env:UE_ROOT/Engine/Binaries/Win64/UnrealEditor-Cmd.exe" `
          "${{ github.workspace }}/MyGame.uproject" `
          -ExecCmds="Automation RunTests Now" `
          -unattended -nopause -nullrhi
```

## Best Practices

### DO

- Use `SmokeFilter` for fast CI tests
- Create dedicated test maps for functional tests
- Clean up spawned actors after tests
- Use latent commands for async operations
- Profile tests to keep CI fast

### DON'T

- Don't test engine functionality
- Don't rely on specific tick order
- Don't leave test actors in production maps
- Don't ignore test warnings
- Don't skip garbage collection in tests

## Troubleshooting

| Issue          | Cause           | Fix                          |
| -------------- | --------------- | ---------------------------- |
| Test not found | Wrong flags     | Check `EAutomationTestFlags` |
| Crash in test  | Missing world   | Use proper test context      |
| Flaky results  | Timing issues   | Use latent commands          |
| Slow tests     | Too many actors | Optimize test setup          |

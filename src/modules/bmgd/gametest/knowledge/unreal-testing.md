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

## End-to-End Testing

For comprehensive E2E testing patterns, infrastructure scaffolding, and
scenario builders, see **knowledge/e2e-testing.md**.

### E2E Infrastructure for Unreal

E2E tests in Unreal leverage Functional Tests with custom infrastructure for scenario setup, input simulation, and async assertions.

#### Project Structure

```
Source/
├── MyGame/
│   └── ... (game code)
└── MyGameTests/
    ├── MyGameTests.Build.cs
    ├── Public/
    │   ├── GameE2ETestBase.h
    │   ├── ScenarioBuilder.h
    │   ├── InputSimulator.h
    │   └── AsyncTestHelpers.h
    ├── Private/
    │   ├── GameE2ETestBase.cpp
    │   ├── ScenarioBuilder.cpp
    │   ├── InputSimulator.cpp
    │   ├── AsyncTestHelpers.cpp
    │   └── E2E/
    │       ├── CombatE2ETests.cpp
    │       ├── TurnCycleE2ETests.cpp
    │       └── SaveLoadE2ETests.cpp
    └── TestMaps/
        ├── E2E_Combat.umap
        └── E2E_TurnCycle.umap
```

#### Test Module Build File

```cpp
// MyGameTests.Build.cs
using UnrealBuildTool;

public class MyGameTests : ModuleRules
{
    public MyGameTests(ReadOnlyTargetRules Target) : base(Target)
    {
        PCHUsage = ModuleRules.PCHUsageMode.UseExplicitOrSharedPCHs;

        PublicDependencyModuleNames.AddRange(new string[] {
            "Core",
            "CoreUObject",
            "Engine",
            "InputCore",
            "EnhancedInput",
            "MyGame"
        });

        PrivateDependencyModuleNames.AddRange(new string[] {
            "FunctionalTesting",
            "AutomationController"
        });

        // Only include in editor/test builds
        if (Target.bBuildDeveloperTools || Target.Configuration == UnrealTargetConfiguration.Debug)
        {
            PrecompileForTargets = PrecompileTargetsType.Any;
        }
    }
}
```

#### GameE2ETestBase (Base Class)

```cpp
// GameE2ETestBase.h
#pragma once

#include "CoreMinimal.h"
#include "FunctionalTest.h"
#include "GameE2ETestBase.generated.h"

class UScenarioBuilder;
class UInputSimulator;
class UGameStateManager;

/**
 * Base class for all E2E functional tests.
 * Provides scenario setup, input simulation, and async assertion utilities.
 */
UCLASS(Abstract)
class MYGAMETESTS_API AGameE2ETestBase : public AFunctionalTest
{
    GENERATED_BODY()

public:
    AGameE2ETestBase();

protected:
    /** Game state manager reference, found automatically on test start. */
    UPROPERTY(BlueprintReadOnly, Category = "E2E")
    UGameStateManager* GameState;

    /** Input simulation utility. */
    UPROPERTY(BlueprintReadOnly, Category = "E2E")
    UInputSimulator* InputSim;

    /** Scenario configuration builder. */
    UPROPERTY(BlueprintReadOnly, Category = "E2E")
    UScenarioBuilder* Scenario;

    /** Timeout for waiting operations (seconds). */
    UPROPERTY(EditAnywhere, Category = "E2E")
    float DefaultTimeout = 10.0f;

    // AFunctionalTest interface
    virtual void PrepareTest() override;
    virtual void StartTest() override;
    virtual void CleanUp() override;

    /** Override to specify custom game state class. */
    virtual TSubclassOf<UGameStateManager> GetGameStateClass() const;

    /**
     * Wait until game state reports ready.
     * Calls OnGameReady() when complete or fails test on timeout.
     */
    UFUNCTION(BlueprintCallable, Category = "E2E")
    void WaitForGameReady();

    /** Called when game is ready. Override to begin test logic. */
    virtual void OnGameReady();

    /**
     * Wait until condition is true, then call callback.
     * Fails test if timeout exceeded.
     */
    void WaitUntil(TFunction<bool()> Condition, const FString& Description,
                   TFunction<void()> OnComplete, float Timeout = -1.0f);

    /**
     * Wait for a specific value, then call callback.
     */
    template<typename T>
    void WaitForValue(TFunction<T()> Getter, T Expected,
                      const FString& Description, TFunction<void()> OnComplete,
                      float Timeout = -1.0f);

    /**
     * Assert condition and fail test with message if false.
     */
    void AssertTrue(bool Condition, const FString& Message);

    /**
     * Assert values are equal within tolerance.
     */
    void AssertNearlyEqual(float Actual, float Expected,
                           const FString& Message, float Tolerance = 0.0001f);

private:
    FTimerHandle WaitTimerHandle;
    float WaitElapsed;
    float WaitTimeout;
    TFunction<bool()> WaitCondition;
    TFunction<void()> WaitCallback;
    FString WaitDescription;

    void TickWaitCondition();
};
```

```cpp
// GameE2ETestBase.cpp
#include "GameE2ETestBase.h"
#include "ScenarioBuilder.h"
#include "InputSimulator.h"
#include "GameStateManager.h"
#include "Engine/World.h"
#include "TimerManager.h"
#include "Kismet/GameplayStatics.h"

AGameE2ETestBase::AGameE2ETestBase()
{
    // Default test settings
    TimeLimit = 120.0f; // 2 minute max for E2E tests
    TimesUpMessage = TEXT("E2E test exceeded time limit");
}

void AGameE2ETestBase::PrepareTest()
{
    Super::PrepareTest();

    // Create utilities
    InputSim = NewObject<UInputSimulator>(this);
    Scenario = NewObject<UScenarioBuilder>(this);
}

void AGameE2ETestBase::StartTest()
{
    Super::StartTest();

    // Find game state manager
    TSubclassOf<UGameStateManager> GameStateClass = GetGameStateClass();
    TArray<AActor*> FoundActors;
    UGameplayStatics::GetAllActorsOfClass(GetWorld(), GameStateClass, FoundActors);

    if (FoundActors.Num() > 0)
    {
        GameState = Cast<UGameStateManager>(
            FoundActors[0]->GetComponentByClass(GameStateClass));
    }

    if (!GameState)
    {
        FinishTest(EFunctionalTestResult::Failed,
            FString::Printf(TEXT("GameStateManager not found in test world")));
        return;
    }

    // Initialize scenario builder with game state
    Scenario->Initialize(GameState);

    // Wait for game to be ready
    WaitForGameReady();
}

void AGameE2ETestBase::CleanUp()
{
    // Clear timer
    if (WaitTimerHandle.IsValid())
    {
        GetWorld()->GetTimerManager().ClearTimer(WaitTimerHandle);
    }

    // Reset input state
    if (InputSim)
    {
        InputSim->Reset();
    }

    Super::CleanUp();
}

TSubclassOf<UGameStateManager> AGameE2ETestBase::GetGameStateClass() const
{
    return UGameStateManager::StaticClass();
}

void AGameE2ETestBase::WaitForGameReady()
{
    WaitUntil(
        [this]() { return GameState && GameState->IsReady(); },
        TEXT("Game to reach ready state"),
        [this]() { OnGameReady(); },
        DefaultTimeout
    );
}

void AGameE2ETestBase::OnGameReady()
{
    // Override in derived classes to begin test logic
}

void AGameE2ETestBase::WaitUntil(
    TFunction<bool()> Condition,
    const FString& Description,
    TFunction<void()> OnComplete,
    float Timeout)
{
    WaitCondition = Condition;
    WaitCallback = OnComplete;
    WaitDescription = Description;
    WaitElapsed = 0.0f;
    WaitTimeout = (Timeout < 0.0f) ? DefaultTimeout : Timeout;

    // Check immediately
    if (WaitCondition())
    {
        WaitCallback();
        return;
    }

    // Set up polling timer
    GetWorld()->GetTimerManager().SetTimer(
        WaitTimerHandle,
        this,
        &AGameE2ETestBase::TickWaitCondition,
        0.1f, // Check every 100ms
        true
    );
}

void AGameE2ETestBase::TickWaitCondition()
{
    WaitElapsed += 0.1f;

    if (WaitCondition())
    {
        GetWorld()->GetTimerManager().ClearTimer(WaitTimerHandle);
        WaitCallback();
    }
    else if (WaitElapsed >= WaitTimeout)
    {
        GetWorld()->GetTimerManager().ClearTimer(WaitTimerHandle);
        FinishTest(EFunctionalTestResult::Failed,
            FString::Printf(TEXT("Timeout after %.1fs waiting for: %s"),
                WaitTimeout, *WaitDescription));
    }
}

void AGameE2ETestBase::AssertTrue(bool Condition, const FString& Message)
{
    if (!Condition)
    {
        FinishTest(EFunctionalTestResult::Failed, Message);
    }
}

void AGameE2ETestBase::AssertNearlyEqual(
    float Actual, float Expected,
    const FString& Message, float Tolerance)
{
    if (!FMath::IsNearlyEqual(Actual, Expected, Tolerance))
    {
        FinishTest(EFunctionalTestResult::Failed,
            FString::Printf(TEXT("%s: Expected ~%f, got %f"),
                *Message, Expected, Actual));
    }
}
```

#### ScenarioBuilder

```cpp
// ScenarioBuilder.h
#pragma once

#include "CoreMinimal.h"
#include "UObject/NoExportTypes.h"
#include "ScenarioBuilder.generated.h"

class UGameStateManager;

/**
 * Fluent API for configuring E2E test scenarios.
 */
UCLASS(BlueprintType)
class MYGAMETESTS_API UScenarioBuilder : public UObject
{
    GENERATED_BODY()

public:
    /** Initialize with game state reference. */
    void Initialize(UGameStateManager* InGameState);

    /**
     * Load scenario from save file.
     * @param FileName Save file name (without path)
     */
    UFUNCTION(BlueprintCallable, Category = "Scenario")
    UScenarioBuilder* FromSaveFile(const FString& FileName);

    /**
     * Set the current turn number.
     */
    UFUNCTION(BlueprintCallable, Category = "Scenario")
    UScenarioBuilder* OnTurn(int32 TurnNumber);

    /**
     * Set the active faction.
     */
    UFUNCTION(BlueprintCallable, Category = "Scenario")
    UScenarioBuilder* WithActiveFaction(EFaction Faction);

    /**
     * Spawn a unit at position.
     * @param Faction Unit's faction
     * @param Position World position
     * @param MovementPoints Starting movement points
     */
    UFUNCTION(BlueprintCallable, Category = "Scenario")
    UScenarioBuilder* WithUnit(EFaction Faction, FVector Position,
                               int32 MovementPoints = 6);

    /**
     * Set terrain at position.
     */
    UFUNCTION(BlueprintCallable, Category = "Scenario")
    UScenarioBuilder* WithTerrain(FVector Position, ETerrainType Terrain);

    /**
     * Execute all queued setup actions.
     * @param OnComplete Called when all actions complete
     */
    void Build(TFunction<void()> OnComplete);

    /** Clear pending actions without executing. */
    UFUNCTION(BlueprintCallable, Category = "Scenario")
    void Reset();

private:
    UPROPERTY()
    UGameStateManager* GameState;

    TArray<TFunction<void(TFunction<void()>)>> SetupActions;

    void ExecuteNextAction(int32 Index, TFunction<void()> FinalCallback);
};
```

```cpp
// ScenarioBuilder.cpp
#include "ScenarioBuilder.h"
#include "GameStateManager.h"

void UScenarioBuilder::Initialize(UGameStateManager* InGameState)
{
    GameState = InGameState;
    SetupActions.Empty();
}

UScenarioBuilder* UScenarioBuilder::FromSaveFile(const FString& FileName)
{
    SetupActions.Add([this, FileName](TFunction<void()> Done) {
        FString Path = FString::Printf(TEXT("TestData/%s"), *FileName);
        GameState->LoadGame(Path, FOnLoadComplete::CreateLambda([Done](bool bSuccess) {
            Done();
        }));
    });
    return this;
}

UScenarioBuilder* UScenarioBuilder::OnTurn(int32 TurnNumber)
{
    SetupActions.Add([this, TurnNumber](TFunction<void()> Done) {
        GameState->SetTurnNumber(TurnNumber);
        Done();
    });
    return this;
}

UScenarioBuilder* UScenarioBuilder::WithActiveFaction(EFaction Faction)
{
    SetupActions.Add([this, Faction](TFunction<void()> Done) {
        GameState->SetActiveFaction(Faction);
        Done();
    });
    return this;
}

UScenarioBuilder* UScenarioBuilder::WithUnit(
    EFaction Faction, FVector Position, int32 MovementPoints)
{
    SetupActions.Add([this, Faction, Position, MovementPoints](TFunction<void()> Done) {
        AUnit* Unit = GameState->SpawnUnit(Faction, Position);
        if (Unit)
        {
            Unit->SetMovementPoints(MovementPoints);
        }
        Done();
    });
    return this;
}

UScenarioBuilder* UScenarioBuilder::WithTerrain(
    FVector Position, ETerrainType Terrain)
{
    SetupActions.Add([this, Position, Terrain](TFunction<void()> Done) {
        GameState->GetMap()->SetTerrain(Position, Terrain);
        Done();
    });
    return this;
}

void UScenarioBuilder::Build(TFunction<void()> OnComplete)
{
    if (SetupActions.Num() == 0)
    {
        OnComplete();
        return;
    }

    ExecuteNextAction(0, OnComplete);
}

void UScenarioBuilder::Reset()
{
    SetupActions.Empty();
}

void UScenarioBuilder::ExecuteNextAction(
    int32 Index, TFunction<void()> FinalCallback)
{
    if (Index >= SetupActions.Num())
    {
        SetupActions.Empty();
        FinalCallback();
        return;
    }

    SetupActions[Index]([this, Index, FinalCallback]() {
        ExecuteNextAction(Index + 1, FinalCallback);
    });
}
```

#### InputSimulator

```cpp
// InputSimulator.h
#pragma once

#include "CoreMinimal.h"
#include "UObject/NoExportTypes.h"
#include "InputCoreTypes.h"
#include "InputSimulator.generated.h"

class APlayerController;

/**
 * Simulates player input for E2E tests.
 */
UCLASS(BlueprintType)
class MYGAMETESTS_API UInputSimulator : public UObject
{
    GENERATED_BODY()

public:
    /**
     * Click at a world position.
     * @param WorldPos Position in world space
     * @param OnComplete Called when click completes
     */
    void ClickWorldPosition(FVector WorldPos, TFunction<void()> OnComplete);

    /**
     * Click at screen coordinates.
     */
    void ClickScreenPosition(FVector2D ScreenPos, TFunction<void()> OnComplete);

    /**
     * Click a UI button by name.
     * @param ButtonName Name of the button widget
     * @param OnComplete Called when click completes
     */
    UFUNCTION(BlueprintCallable, Category = "Input")
    void ClickButton(const FString& ButtonName, TFunction<void()> OnComplete);

    /**
     * Press and release a key.
     */
    void PressKey(FKey Key, TFunction<void()> OnComplete);

    /**
     * Trigger an input action.
     */
    void TriggerAction(FName ActionName, TFunction<void()> OnComplete);

    /**
     * Drag from one position to another.
     */
    void DragFromTo(FVector From, FVector To, float Duration,
                    TFunction<void()> OnComplete);

    /** Reset all input state. */
    UFUNCTION(BlueprintCallable, Category = "Input")
    void Reset();

private:
    APlayerController* GetPlayerController() const;
    void SimulateMouseClick(FVector2D ScreenPos, TFunction<void()> OnComplete);
};
```

```cpp
// InputSimulator.cpp
#include "InputSimulator.h"
#include "GameFramework/PlayerController.h"
#include "Blueprint/UserWidget.h"
#include "Components/Button.h"
#include "Blueprint/WidgetBlueprintLibrary.h"
#include "Kismet/GameplayStatics.h"
#include "Engine/World.h"
#include "TimerManager.h"
#include "Framework/Application/SlateApplication.h"

void UInputSimulator::ClickWorldPosition(
    FVector WorldPos, TFunction<void()> OnComplete)
{
    APlayerController* PC = GetPlayerController();
    if (!PC)
    {
        OnComplete();
        return;
    }

    FVector2D ScreenPos;
    if (PC->ProjectWorldLocationToScreen(WorldPos, ScreenPos, true))
    {
        ClickScreenPosition(ScreenPos, OnComplete);
    }
    else
    {
        OnComplete();
    }
}

void UInputSimulator::ClickScreenPosition(
    FVector2D ScreenPos, TFunction<void()> OnComplete)
{
    SimulateMouseClick(ScreenPos, OnComplete);
}

void UInputSimulator::ClickButton(
    const FString& ButtonName, TFunction<void()> OnComplete)
{
    APlayerController* PC = GetPlayerController();
    if (!PC)
    {
        UE_LOG(LogTemp, Warning,
            TEXT("[InputSimulator] No PlayerController found"));
        OnComplete();
        return;
    }

    // Find button in all widgets
    TArray<UUserWidget*> FoundWidgets;
    UWidgetBlueprintLibrary::GetAllWidgetsOfClass(
        PC->GetWorld(), FoundWidgets, UUserWidget::StaticClass(), false);

    UButton* TargetButton = nullptr;
    for (UUserWidget* Widget : FoundWidgets)
    {
        if (UButton* Button = Cast<UButton>(
            Widget->GetWidgetFromName(FName(*ButtonName))))
        {
            TargetButton = Button;
            break;
        }
    }

    if (TargetButton)
    {
        if (!TargetButton->GetIsEnabled())
        {
            UE_LOG(LogTemp, Warning,
                TEXT("[InputSimulator] Button '%s' is not enabled"), *ButtonName);
        }

        // Simulate click via delegate
        TargetButton->OnClicked.Broadcast();

        // Delay to allow UI to process
        FTimerHandle TimerHandle;
        PC->GetWorld()->GetTimerManager().SetTimer(
            TimerHandle,
            [OnComplete]() { OnComplete(); },
            0.1f,
            false
        );
    }
    else
    {
        UE_LOG(LogTemp, Warning,
            TEXT("[InputSimulator] Button '%s' not found"), *ButtonName);
        OnComplete();
    }
}

void UInputSimulator::PressKey(FKey Key, TFunction<void()> OnComplete)
{
    APlayerController* PC = GetPlayerController();
    if (!PC)
    {
        OnComplete();
        return;
    }

    // Simulate key press
    FInputKeyEventArgs PressArgs(PC->GetLocalPlayer()->GetControllerId(),
        Key, EInputEvent::IE_Pressed, 1.0f, false);
    PC->InputKey(PressArgs);

    // Delay then release
    FTimerHandle TimerHandle;
    PC->GetWorld()->GetTimerManager().SetTimer(
        TimerHandle,
        [this, PC, Key, OnComplete]() {
            FInputKeyEventArgs ReleaseArgs(PC->GetLocalPlayer()->GetControllerId(),
                Key, EInputEvent::IE_Released, 0.0f, false);
            PC->InputKey(ReleaseArgs);
            OnComplete();
        },
        0.1f,
        false
    );
}

void UInputSimulator::TriggerAction(FName ActionName, TFunction<void()> OnComplete)
{
    APlayerController* PC = GetPlayerController();
    if (!PC)
    {
        OnComplete();
        return;
    }

    // For Enhanced Input System
    if (UEnhancedInputComponent* EIC = Cast<UEnhancedInputComponent>(
        PC->InputComponent.Get()))
    {
        // Trigger the action through the input subsystem
        // Implementation depends on your input action setup
    }

    OnComplete();
}

void UInputSimulator::DragFromTo(
    FVector From, FVector To, float Duration, TFunction<void()> OnComplete)
{
    APlayerController* PC = GetPlayerController();
    if (!PC)
    {
        OnComplete();
        return;
    }

    FVector2D FromScreen, ToScreen;
    PC->ProjectWorldLocationToScreen(From, FromScreen, true);
    PC->ProjectWorldLocationToScreen(To, ToScreen, true);

    // Simulate drag start
    FSlateApplication::Get().ProcessMouseButtonDownEvent(
        nullptr, FPointerEvent(
            0, FromScreen, FromScreen, TSet<FKey>(),
            EKeys::LeftMouseButton, 0, FModifierKeysState()
        )
    );

    // Interpolate drag over duration
    float Elapsed = 0.0f;
    float Interval = 0.05f;

    FTimerHandle DragTimer;
    PC->GetWorld()->GetTimerManager().SetTimer(
        DragTimer,
        [this, PC, FromScreen, ToScreen, Duration, &Elapsed, Interval, OnComplete, &DragTimer]() {
            Elapsed += Interval;
            float Alpha = FMath::Clamp(Elapsed / Duration, 0.0f, 1.0f);
            FVector2D CurrentPos = FMath::Lerp(FromScreen, ToScreen, Alpha);

            FSlateApplication::Get().ProcessMouseMoveEvent(
                FPointerEvent(
                    0, CurrentPos, CurrentPos - FVector2D(1, 0),
                    TSet<FKey>({EKeys::LeftMouseButton}),
                    FModifierKeysState()
                )
            );

            if (Alpha >= 1.0f)
            {
                PC->GetWorld()->GetTimerManager().ClearTimer(DragTimer);

                FSlateApplication::Get().ProcessMouseButtonUpEvent(
                    FPointerEvent(
                        0, ToScreen, ToScreen, TSet<FKey>(),
                        EKeys::LeftMouseButton, 0, FModifierKeysState()
                    )
                );

                OnComplete();
            }
        },
        Interval,
        true
    );
}

void UInputSimulator::Reset()
{
    // Release any held inputs
    FSlateApplication::Get().ClearAllUserFocus();
}

APlayerController* UInputSimulator::GetPlayerController() const
{
    UWorld* World = GEngine->GetWorldContexts()[0].World();
    return World ? UGameplayStatics::GetPlayerController(World, 0) : nullptr;
}

void UInputSimulator::SimulateMouseClick(
    FVector2D ScreenPos, TFunction<void()> OnComplete)
{
    // Press
    FSlateApplication::Get().ProcessMouseButtonDownEvent(
        nullptr, FPointerEvent(
            0, ScreenPos, ScreenPos, TSet<FKey>(),
            EKeys::LeftMouseButton, 0, FModifierKeysState()
        )
    );

    // Delay then release
    UWorld* World = GEngine->GetWorldContexts()[0].World();
    if (World)
    {
        FTimerHandle TimerHandle;
        World->GetTimerManager().SetTimer(
            TimerHandle,
            [ScreenPos, OnComplete]() {
                FSlateApplication::Get().ProcessMouseButtonUpEvent(
                    FPointerEvent(
                        0, ScreenPos, ScreenPos, TSet<FKey>(),
                        EKeys::LeftMouseButton, 0, FModifierKeysState()
                    )
                );
                OnComplete();
            },
            0.1f,
            false
        );
    }
    else
    {
        OnComplete();
    }
}
```

#### AsyncTestHelpers

```cpp
// AsyncTestHelpers.h
#pragma once

#include "CoreMinimal.h"
#include "Misc/AutomationTest.h"

/**
 * Latent command to wait for a condition.
 */
DEFINE_LATENT_AUTOMATION_COMMAND_THREE_PARAMETER(
    FWaitUntilCondition,
    TFunction<bool()>, Condition,
    FString, Description,
    float, Timeout
);

/**
 * Latent command to wait for a value to equal expected.
 */
template<typename T>
class FWaitForValue : public IAutomationLatentCommand
{
public:
    FWaitForValue(TFunction<T()> InGetter, T InExpected,
                  const FString& InDescription, float InTimeout)
        : Getter(InGetter)
        , Expected(InExpected)
        , Description(InDescription)
        , Timeout(InTimeout)
        , Elapsed(0.0f)
    {}

    virtual bool Update() override
    {
        Elapsed += FApp::GetDeltaTime();

        if (Getter() == Expected)
        {
            return true;
        }

        if (Elapsed >= Timeout)
        {
            UE_LOG(LogTemp, Error,
                TEXT("Timeout after %.1fs waiting for: %s"),
                Timeout, *Description);
            return true;
        }

        return false;
    }

private:
    TFunction<T()> Getter;
    T Expected;
    FString Description;
    float Timeout;
    float Elapsed;
};

/**
 * Latent command to wait for float value within tolerance.
 */
class FWaitForValueApprox : public IAutomationLatentCommand
{
public:
    FWaitForValueApprox(TFunction<float()> InGetter, float InExpected,
                        const FString& InDescription,
                        float InTolerance = 0.0001f, float InTimeout = 5.0f)
        : Getter(InGetter)
        , Expected(InExpected)
        , Description(InDescription)
        , Tolerance(InTolerance)
        , Timeout(InTimeout)
        , Elapsed(0.0f)
    {}

    virtual bool Update() override
    {
        Elapsed += FApp::GetDeltaTime();

        if (FMath::IsNearlyEqual(Getter(), Expected, Tolerance))
        {
            return true;
        }

        if (Elapsed >= Timeout)
        {
            UE_LOG(LogTemp, Error,
                TEXT("Timeout after %.1fs waiting for: %s (expected ~%f, got %f)"),
                Timeout, *Description, Expected, Getter());
            return true;
        }

        return false;
    }

private:
    TFunction<float()> Getter;
    float Expected;
    FString Description;
    float Tolerance;
    float Timeout;
    float Elapsed;
};

/**
 * Latent command to assert condition never becomes true.
 */
DEFINE_LATENT_AUTOMATION_COMMAND_THREE_PARAMETER(
    FAssertNeverTrue,
    TFunction<bool()>, Condition,
    FString, Description,
    float, Duration
);

/** Helper macros for E2E tests */
#define E2E_WAIT_UNTIL(Cond, Desc, Timeout) \
    ADD_LATENT_AUTOMATION_COMMAND(FWaitUntilCondition(Cond, Desc, Timeout))

#define E2E_WAIT_FOR_VALUE(Getter, Expected, Desc, Timeout) \
    ADD_LATENT_AUTOMATION_COMMAND(FWaitForValue<decltype(Expected)>(Getter, Expected, Desc, Timeout))

#define E2E_WAIT_FOR_FLOAT(Getter, Expected, Desc, Tolerance, Timeout) \
    ADD_LATENT_AUTOMATION_COMMAND(FWaitForValueApprox(Getter, Expected, Desc, Tolerance, Timeout))
```

### Example E2E Test

```cpp
// CombatE2ETests.cpp
#include "GameE2ETestBase.h"
#include "ScenarioBuilder.h"
#include "InputSimulator.h"
#include "AsyncTestHelpers.h"

/**
 * E2E test: Player can attack enemy and deal damage.
 */
UCLASS()
class AE2E_PlayerAttacksEnemy : public AGameE2ETestBase
{
    GENERATED_BODY()

protected:
    virtual void OnGameReady() override
    {
        // GIVEN: Player and enemy units in combat range
        Scenario
            ->WithUnit(EFaction::Player, FVector(100, 100, 0), 6)
            ->WithUnit(EFaction::Enemy, FVector(200, 100, 0), 6)
            ->WithActiveFaction(EFaction::Player)
            ->Build([this]() { OnScenarioReady(); });
    }

private:
    void OnScenarioReady()
    {
        // Store enemy reference and initial health
        TArray<AUnit*> Enemies = GameState->GetUnits(EFaction::Enemy);
        if (Enemies.Num() == 0)
        {
            FinishTest(EFunctionalTestResult::Failed, TEXT("No enemy found"));
            return;
        }

        AUnit* Enemy = Enemies[0];
        float InitialHealth = Enemy->GetHealth();

        // WHEN: Player selects unit and attacks
        InputSim->ClickWorldPosition(FVector(100, 100, 0), [this]() {
            WaitUntil(
                [this]() { return GameState->GetSelectedUnit() != nullptr; },
                TEXT("Unit should be selected"),
                [this, Enemy, InitialHealth]() { PerformAttack(Enemy, InitialHealth); }
            );
        });
    }

    void PerformAttack(AUnit* Enemy, float InitialHealth)
    {
        // Click on enemy to attack
        InputSim->ClickWorldPosition(Enemy->GetActorLocation(), [this, Enemy, InitialHealth]() {
            // THEN: Enemy takes damage
            WaitUntil(
                [Enemy, InitialHealth]() { return Enemy->GetHealth() < InitialHealth; },
                TEXT("Enemy should take damage"),
                [this]() {
                    FinishTest(EFunctionalTestResult::Succeeded,
                        TEXT("Player successfully attacked enemy"));
                }
            );
        });
    }
};

/**
 * E2E test: Full turn cycle completes correctly.
 */
UCLASS()
class AE2E_TurnCycleCompletes : public AGameE2ETestBase
{
    GENERATED_BODY()

protected:
    int32 StartingTurn;

    virtual void OnGameReady() override
    {
        // GIVEN: Game in progress
        Scenario
            ->OnTurn(1)
            ->WithActiveFaction(EFaction::Player)
            ->Build([this]() { OnScenarioReady(); });
    }

private:
    void OnScenarioReady()
    {
        StartingTurn = GameState->GetTurnNumber();

        // WHEN: Player ends turn
        InputSim->ClickButton(TEXT("EndTurnButton"), [this]() {
            WaitUntil(
                [this]() {
                    return GameState->GetActiveFaction() == EFaction::Enemy;
                },
                TEXT("Should switch to enemy turn"),
                [this]() { WaitForPlayerTurnReturn(); }
            );
        });
    }

    void WaitForPlayerTurnReturn()
    {
        // Wait for AI turn to complete
        WaitUntil(
            [this]() {
                return GameState->GetActiveFaction() == EFaction::Player;
            },
            TEXT("Should return to player turn"),
            [this]() { VerifyTurnIncremented(); },
            30.0f // AI might take a while
        );
    }

    void VerifyTurnIncremented()
    {
        // THEN: Turn number incremented
        int32 CurrentTurn = GameState->GetTurnNumber();
        if (CurrentTurn == StartingTurn + 1)
        {
            FinishTest(EFunctionalTestResult::Succeeded,
                TEXT("Turn cycle completed successfully"));
        }
        else
        {
            FinishTest(EFunctionalTestResult::Failed,
                FString::Printf(TEXT("Expected turn %d, got %d"),
                    StartingTurn + 1, CurrentTurn));
        }
    }
};
```

### Running E2E Tests

```bash
# Run all E2E tests
UnrealEditor-Cmd.exe MyGame.uproject \
    -ExecCmds="Automation RunTests MyGame.E2E" \
    -unattended -nopause -nullrhi

# Run specific E2E test
UnrealEditor-Cmd.exe MyGame.uproject \
    -ExecCmds="Automation RunTests MyGame.E2E.Combat.PlayerAttacksEnemy" \
    -unattended -nopause

# Run with detailed logging
UnrealEditor-Cmd.exe MyGame.uproject \
    -ExecCmds="Automation RunTests MyGame.E2E" \
    -unattended -nopause -log=E2ETests.log
```

### Quick E2E Checklist for Unreal

- [ ] Create `GameE2ETestBase` class extending `AFunctionalTest`
- [ ] Implement `ScenarioBuilder` for your game's domain
- [ ] Create `InputSimulator` wrapping Slate input system
- [ ] Add `AsyncTestHelpers` with latent commands
- [ ] Create dedicated E2E test maps with spawn points
- [ ] Organize E2E tests under `Source/MyGameTests/Private/E2E/`
- [ ] Configure separate CI job for E2E suite with extended timeout
- [ ] Use Gauntlet for extended E2E scenarios if needed

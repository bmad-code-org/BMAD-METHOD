# E2E Infrastructure Scaffold Checklist

## Preflight Validation

- [ ] Test framework already initialized (`Tests/` directory exists with proper structure)
- [ ] Game state manager class identified
- [ ] Main gameplay scene identified and loads without errors
- [ ] No existing E2E infrastructure conflicts

## Architecture Analysis

- [ ] Game engine correctly detected
- [ ] Engine version identified
- [ ] Input system type determined (New Input System, Legacy, Custom)
- [ ] Game state manager class located
- [ ] Ready/initialized state property identified
- [ ] Key domain entities catalogued for ScenarioBuilder

## Generated Files

### Directory Structure
- [ ] `Tests/PlayMode/E2E/` directory created
- [ ] `Tests/PlayMode/E2E/Infrastructure/` directory created
- [ ] `Tests/PlayMode/E2E/Scenarios/` directory created
- [ ] `Tests/PlayMode/E2E/TestData/` directory created

### Infrastructure Files
- [ ] `E2E.asmdef` created with correct assembly references
- [ ] `GameE2ETestFixture.cs` created with correct class references
- [ ] `ScenarioBuilder.cs` created with at least placeholder methods
- [ ] `InputSimulator.cs` created matching detected input system
- [ ] `AsyncAssert.cs` created with core assertion methods

### Example and Documentation
- [ ] `ExampleE2ETest.cs` created with working infrastructure test
- [ ] `README.md` created with usage documentation

## Code Quality

### GameE2ETestFixture
- [ ] Correct namespace applied
- [ ] Correct `GameStateClass` reference
- [ ] Correct `SceneName` default
- [ ] `WaitForGameReady` uses correct ready property
- [ ] `UnitySetUp` and `UnityTearDown` properly structured
- [ ] Virtual methods for derived class customization

### ScenarioBuilder
- [ ] Fluent API pattern correctly implemented
- [ ] `Build()` executes all queued actions
- [ ] At least one domain-specific method added (or clear TODOs)
- [ ] `FromSaveFile` method scaffolded

### InputSimulator
- [ ] Matches detected input system (New vs Legacy)
- [ ] Mouse click simulation works
- [ ] Button click by name works
- [ ] Keyboard input scaffolded
- [ ] `Reset()` method cleans up state

### AsyncAssert
- [ ] `WaitUntil` includes timeout and descriptive failure
- [ ] `WaitForValue` provides current vs expected in failure
- [ ] `AssertNeverTrue` for negative assertions
- [ ] Frame/physics wait utilities included

## Assembly Definition

- [ ] References main game assembly
- [ ] References Unity.InputSystem (if applicable)
- [ ] `overrideReferences` set to true
- [ ] `precompiledReferences` includes nunit.framework.dll
- [ ] `precompiledReferences` includes UnityEngine.TestRunner.dll
- [ ] `precompiledReferences` includes UnityEditor.TestRunner.dll
- [ ] `UNITY_INCLUDE_TESTS` define constraint set

## Verification

- [ ] Project compiles without errors after scaffold
- [ ] `ExampleE2ETests.Infrastructure_GameLoadsAndReachesReadyState` passes
- [ ] Test appears in Test Runner under PlayMode → E2E category

## Documentation Quality

- [ ] README explains all infrastructure components
- [ ] Quick start example is copy-pasteable
- [ ] Extension instructions are clear
- [ ] Troubleshooting table addresses common issues

## Handoff

- [ ] Summary output provided with all configuration values
- [ ] Next steps clearly listed
- [ ] Customization requirements highlighted
- [ ] Knowledge fragments referenced

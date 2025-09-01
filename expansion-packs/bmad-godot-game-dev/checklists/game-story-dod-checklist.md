# Game Development Story Definition of Done (DoD) Checklist (Godot)

## Instructions for Developer Agent

Before marking a story as 'Ready for Review', please go through each item in this checklist. Report the status of each item (e.g., [x] Done, [ ] Not Done, [N/A] Not Applicable) and provide brief comments if necessary.

[[LLM: INITIALIZATION INSTRUCTIONS - GODOT GAME STORY DOD VALIDATION

This checklist is for GAME DEVELOPER AGENTS to self-validate their Godot implementation work before marking a story complete.

IMPORTANT: This is a self-assessment following TDD principles. Be honest about what's actually done vs what should be done. Performance targets (60+ FPS) are non-negotiable.

EXECUTION APPROACH:

1. Verify tests were written FIRST (TDD compliance)
2. Go through each section systematically
3. Mark items as [x] Done, [ ] Not Done, or [N/A] Not Applicable
4. Add brief comments explaining any [ ] or [N/A] items
5. Report performance metrics (FPS, draw calls, memory)
6. Flag any technical debt or optimization needs

The goal is performant, tested, quality delivery following John Carmack's optimization philosophy.]]

## Checklist Items

1. **Test-Driven Development Compliance:**

   [[LLM: TDD is mandatory. Tests must be written FIRST. No exceptions.]]
   - [ ] Tests were written BEFORE implementation (Red phase)
   - [ ] Tests initially failed as expected
   - [ ] Implementation made tests pass (Green phase)
   - [ ] Code was refactored while maintaining passing tests (Refactor phase)
   - [ ] GUT tests written for all GDScript code
   - [ ] GoDotTest tests written for all C# code
   - [ ] Test coverage meets 80% minimum requirement
   - [ ] Performance benchmarks defined and passing

2. **Requirements & Game Design:**

   [[LLM: Requirements drive implementation. GDD alignment is critical.]]
   - [ ] All functional requirements from story implemented
   - [ ] All acceptance criteria met and tested
   - [ ] Game Design Document (GDD) requirements implemented
   - [ ] Player experience goals achieved
   - [ ] Core gameplay loop functions correctly
   - [ ] Fun factor validated through testing

3. **Godot Standards & Architecture:**

   [[LLM: Godot best practices ensure maintainability and performance.]]
   - [ ] Node hierarchy follows Godot conventions
   - [ ] Scene composition patterns properly used
   - [ ] Signal connections documented and optimized
   - [ ] Autoload/singleton usage justified
   - [ ] Resource system used appropriately
   - [ ] Export variables properly configured
   - [ ] Node groups used for efficient queries
   - [ ] Scene inheritance utilized where appropriate

4. **Code Quality & Language Strategy:**

   [[LLM: Language choice impacts performance. GDScript for iteration, C# for computation.]]
   - [ ] GDScript code uses static typing throughout
   - [ ] C# code follows .NET conventions
   - [ ] Language choice (GDScript vs C#) justified for each system
   - [ ] Interop between languages minimized
   - [ ] Memory management patterns followed (pooling, references)
   - [ ] No GDScript/C# marshalling in hot paths
   - [ ] Code comments explain optimization decisions
   - [ ] No new script errors or warnings

5. **Performance Validation:**

   [[LLM: 60+ FPS is the minimum, not the target. Profile everything.]]
   - [ ] Stable 60+ FPS achieved on target hardware
   - [ ] Frame time consistently under 16.67ms
   - [ ] Draw calls within budget for scene type
   - [ ] Memory usage within platform limits
   - [ ] No memory leaks detected
   - [ ] Object pooling implemented where needed
   - [ ] Godot profiler shows no bottlenecks
   - [ ] Performance regression tests pass

6. **Platform Testing:**

   [[LLM: Test on all target platforms. Platform-specific issues kill games.]]
   - [ ] Functionality verified in Godot Editor
   - [ ] Desktop export tested (Windows/Mac/Linux)
   - [ ] Mobile export tested if applicable (iOS/Android)
   - [ ] Web export tested if applicable (HTML5)
   - [ ] Input handling works on all platforms
   - [ ] Platform-specific optimizations applied
   - [ ] Export settings properly configured
   - [ ] Build sizes within acceptable limits

7. **Game Functionality:**

   [[LLM: Games must be fun AND functional. Test the player experience.]]
   - [ ] Game mechanics work as specified
   - [ ] Player controls responsive (<50ms input latency)
   - [ ] UI elements function correctly (Control nodes)
   - [ ] Audio integration works (AudioStreamPlayer)
   - [ ] Visual feedback and animations smooth
   - [ ] Particle effects within performance budget
   - [ ] Save/load system functions correctly
   - [ ] Scene transitions work smoothly

8. **Testing Coverage:**

   [[LLM: Comprehensive testing prevents player frustration.]]
   - [ ] Unit tests (GUT/GoDotTest) all passing
   - [ ] Integration tests for scene interactions pass
   - [ ] Performance tests meet benchmarks
   - [ ] Edge cases and error conditions handled
   - [ ] Multiplayer tests pass (if applicable)
   - [ ] Platform-specific tests complete
   - [ ] Regression tests for existing features pass
   - [ ] Manual playtesting completed

9. **Story Administration:**

   [[LLM: Documentation enables team collaboration.]]
   - [ ] All tasks within story marked complete [x]
   - [ ] Implementation decisions documented
   - [ ] Performance optimizations noted
   - [ ] File List section updated with all changes
   - [ ] Debug Log references added
   - [ ] Completion Notes comprehensive
   - [ ] Change Log updated
   - [ ] Status set to 'Ready for Review'

10. **Project & Dependencies:**

    [[LLM: Project must build and run. Dependencies must be justified.]]
    - [ ] Godot project opens without errors
    - [ ] Project exports successfully for all platforms
    - [ ] Any new plugins/addons pre-approved
    - [ ] Asset import settings optimized
    - [ ] Project settings properly configured
    - [ ] Version control files (.tscn/.tres) clean
    - [ ] No uncommitted debug code
    - [ ] Build automation scripts updated

11. **Optimization & Polish:**

    [[LLM: Following Carmack's philosophy - measure, optimize, verify.]]
    - [ ] Hot paths identified and optimized
    - [ ] Critical code moved to C# if needed
    - [ ] Draw call batching implemented
    - [ ] Texture atlasing used where appropriate
    - [ ] LOD system implemented if needed
    - [ ] Occlusion culling configured
    - [ ] Static typing used throughout GDScript
    - [ ] Signal connections optimized

12. **Documentation:**

    [[LLM: Good documentation prevents future confusion.]]
    - [ ] GDScript documentation comments complete
    - [ ] C# XML documentation complete
    - [ ] Node purposes documented in scenes
    - [ ] Export variable tooltips added
    - [ ] Performance notes included
    - [ ] Platform-specific notes documented
    - [ ] Known issues or limitations noted

## Performance Metrics Report

[[LLM: Report actual performance metrics, not estimates.]]

- **Frame Rate:** \_\_\_ FPS (Target: 60+)
- **Frame Time:** \_\_\_ ms (Target: <16.67ms)
- **Draw Calls:** **_ (Budget: _**)
- **Memory Usage:** **_ MB (Limit: _**)
- **Scene Load Time:** \_\_\_ seconds
- **Input Latency:** \_\_\_ ms
- **Test Coverage:** \_\_\_% (Minimum: 80%)

## Final Confirmation

[[LLM: FINAL GODOT DOD SUMMARY

After completing the checklist:

1. Confirm TDD was followed (tests written first)
2. Report performance metrics with specific numbers
3. List any items marked [ ] with explanations
4. Identify optimization opportunities
5. Note any technical debt created
6. Confirm the story is truly ready for review
7. State whether 60+ FPS target is met

Remember Carmack's principle: "Focus on what matters: framerate and responsiveness."

Be honest - performance issues and bugs found now are easier to fix than after release.]]

- [ ] I, the Game Developer Agent, confirm that:
  - [ ] TDD was followed (tests written first)
  - [ ] All applicable items above have been addressed
  - [ ] Performance targets (60+ FPS) are met
  - [ ] Tests provide 80%+ coverage
  - [ ] The story is ready for review

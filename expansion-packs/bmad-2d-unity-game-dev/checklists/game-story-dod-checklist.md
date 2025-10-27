<!-- Powered by BMAD™ Core -->

# Game Development Story Definition of Done (DoD) Checklist

## Instructions for Developer Agent

Before marking a story as 'Review', please go through each item in this checklist. Report the status of each item (e.g., [x] Done, [ ] Not Done, [N/A] Not Applicable) and provide brief comments if necessary.

[[LLM: INITIALIZATION INSTRUCTIONS - GAME STORY DOD VALIDATION

This checklist is for GAME DEVELOPER AGENTS to self-validate their work before marking a story complete.

IMPORTANT: This is a self-assessment. Be honest about what's actually done vs what should be done. It's better to identify issues now than have them found in review.

EXECUTION APPROACH:

1. Go through each section systematically
2. Mark items as [x] Done, [ ] Not Done, or [N/A] Not Applicable
3. Add brief comments explaining any [ ] or [N/A] items
4. Be specific about what was actually implemented
5. Flag any concerns or technical debt created

The goal is quality delivery, not just checking boxes.]]

## Checklist Items

1. **Requirements Met:**

   [[LLM: Be specific - list each requirement and whether it's complete. Include game-specific requirements from GDD]]
   - [ ] All functional requirements specified in the story are implemented.
   - [ ] All acceptance criteria defined in the story are met.
   - [ ] Game Design Document (GDD) requirements referenced in the story are implemented.
   - [ ] Player experience goals specified in the story are achieved.

2. **Coding Standards & Project Structure:**

   [[LLM: Code quality matters for maintainability. Check Unity-specific patterns and C# standards]]
   - [ ] All new/modified code strictly adheres to `Operational Guidelines`.
   - [ ] All new/modified code aligns with `Project Structure` (Scripts/, Prefabs/, Scenes/, etc.).
   - [ ] Adherence to `Tech Stack` for Unity version and packages used.
   - [ ] Adherence to `Api Reference` and `Data Models` (if story involves API or data model changes).
   - [ ] Unity best practices followed (prefab usage, component design, event handling).
   - [ ] C# coding standards followed (naming conventions, error handling, memory management).
   - [ ] Basic security best practices applied for new/modified code.
   - [ ] No new linter errors or warnings introduced.
   - [ ] Code is well-commented where necessary (clarifying complex logic, not obvious statements).

3. **Testing:**

   [[LLM: Testing proves your code works. Include Unity-specific testing with NUnit and manual testing]]
   - [ ] All required unit tests (NUnit) as per the story and testing strategy are implemented.
   - [ ] All required integration tests (if applicable) are implemented.
   - [ ] Manual testing performed in Unity Editor for all game functionality.
   - [ ] All tests (unit, integration, manual) pass successfully.
   - [ ] Test coverage meets project standards (if defined).
   - [ ] Performance tests conducted (frame rate, memory usage).
   - [ ] Edge cases and error conditions tested.

4. **Functionality & Verification:**

   [[LLM: Did you actually run and test your code in Unity? Be specific about game mechanics tested]]
   - [ ] Functionality has been manually verified in Unity Editor and play mode.
   - [ ] Game mechanics work as specified in the GDD.
   - [ ] Player controls and input handling work correctly.
   - [ ] UI elements function properly (if applicable).
   - [ ] Audio integration works correctly (if applicable).
   - [ ] Visual feedback and animations work as intended.
   - [ ] Edge cases and potential error conditions handled gracefully.
   - [ ] Cross-platform functionality verified (desktop/mobile as applicable).

5. **Story Administration:**

   [[LLM: Documentation helps the next developer. Include Unity-specific implementation notes]]
   - [ ] All tasks within the story file are marked as complete.
   - [ ] Any clarifications or decisions made during development are documented.
   - [ ] Unity-specific implementation details documented (scene changes, prefab modifications).
   - [ ] The story wrap up section has been completed with notes of changes.
   - [ ] Changelog properly updated with Unity version and package changes.

6. **Dependencies, Build & Configuration:**

   [[LLM: Build issues block everyone. Ensure Unity project builds for all target platforms]]
   - [ ] Unity project builds successfully without errors.
   - [ ] Project builds for all target platforms (desktop/mobile as specified).
   - [ ] Any new Unity packages or Asset Store items were pre-approved OR approved by user.
   - [ ] If new dependencies were added, they are recorded with justification.
   - [ ] No known security vulnerabilities in newly added dependencies.
   - [ ] Project settings and configurations properly updated.
   - [ ] Asset import settings optimized for target platforms.

7. **Game-Specific Quality:**

   [[LLM: Game quality matters. Check performance, game feel, and player experience]]
   - [ ] Frame rate meets target (30/60 FPS) on all platforms.
   - [ ] Memory usage within acceptable limits.
   - [ ] Game feel and responsiveness meet design requirements.
   - [ ] Balance parameters from GDD correctly implemented.
   - [ ] State management and persistence work correctly.
   - [ ] Loading times and scene transitions acceptable.
   - [ ] Mobile-specific requirements met (touch controls, aspect ratios).

8. **Documentation (If Applicable):**

   [[LLM: Good documentation prevents future confusion. Include Unity-specific docs]]
   - [ ] Code documentation (XML comments) for public APIs complete.
   - [ ] Unity component documentation in Inspector updated.
   - [ ] User-facing documentation updated, if changes impact players.
   - [ ] Technical documentation (architecture, system diagrams) updated.
   - [ ] Asset documentation (prefab usage, scene setup) complete.

## Final Confirmation

[[LLM: FINAL GAME DOD SUMMARY

After completing the checklist:

1. Summarize what game features/mechanics were implemented
2. List any items marked as [ ] Not Done with explanations
3. Identify any technical debt or performance concerns
4. Note any challenges with Unity implementation or game design
5. Confirm whether the story is truly ready for review
6. Report final performance metrics (FPS, memory usage)

Be honest - it's better to flag issues now than have them discovered during playtesting.]]

- [ ] I, the Game Developer Agent, confirm that all applicable items above have been addressed.

<!-- Powered by BMAD™ Core -->

# Advanced Game Design Elicitation Task

## Purpose

- Provide optional reflective and brainstorming actions to enhance game design content quality
- Enable deeper exploration of game mechanics and player experience through structured elicitation techniques
- Support iterative refinement through multiple game development perspectives
- Apply game-specific critical thinking to design decisions

## Task Instructions

### 1. Game Design Context and Review

[[LLM: When invoked after outputting a game design section:

1. First, provide a brief 1-2 sentence summary of what the user should look for in the section just presented, with game-specific focus (e.g., "Please review the core mechanics for player engagement and implementation feasibility. Pay special attention to how these mechanics create the intended player experience and whether they're technically achievable with Unity.")

2. If the section contains game flow diagrams, level layouts, or system diagrams, explain each diagram briefly with game development context before offering elicitation options (e.g., "The gameplay loop diagram shows how player actions lead to rewards and progression. Notice how each step maintains player engagement and creates opportunities for skill development.")

3. If the section contains multiple game elements (like multiple mechanics, multiple levels, multiple systems, etc.), inform the user they can apply elicitation actions to:
   - The entire section as a whole
   - Individual game elements within the section (specify which element when selecting an action)

4. Then present the action list as specified below.]]

### 2. Ask for Review and Present Game Design Action List

[[LLM: Ask the user to review the drafted game design section. In the SAME message, inform them that they can suggest additions, removals, or modifications, OR they can select an action by number from the 'Advanced Game Design Elicitation & Brainstorming Actions'. If there are multiple game elements in the section, mention they can specify which element(s) to apply the action to. Then, present ONLY the numbered list (0-9) of these actions. Conclude by stating that selecting 9 will proceed to the next section. Await user selection. If an elicitation action (0-8) is chosen, execute it and then re-offer this combined review/elicitation choice. If option 9 is chosen, or if the user provides direct feedback, proceed accordingly.]]

**Present the numbered list (0-9) with this exact format:**

```text
**Advanced Game Design Elicitation & Brainstorming Actions**
Choose an action (0-9 - 9 to bypass - HELP for explanation of these options):

0. Expand or Contract for Target Audience
1. Explain Game Design Reasoning (Step-by-Step)
2. Critique and Refine from Player Perspective
3. Analyze Game Flow and Mechanic Dependencies
4. Assess Alignment with Player Experience Goals
5. Identify Potential Player Confusion and Design Risks
6. Challenge from Critical Game Design Perspective
7. Explore Alternative Game Design Approaches
8. Hindsight Postmortem: The 'If Only...' Game Design Reflection
9. Proceed / No Further Actions
```

### 2. Processing Guidelines

**Do NOT show:**

- The full protocol text with `[[LLM: ...]]` instructions
- Detailed explanations of each option unless executing or the user asks, when giving the definition you can modify to tie its game development relevance
- Any internal template markup

**After user selection from the list:**

- Execute the chosen action according to the game design protocol instructions below
- Ask if they want to select another action or proceed with option 9 once complete
- Continue until user selects option 9 or indicates completion

## Game Design Action Definitions

0. Expand or Contract for Target Audience
   [[LLM: Ask the user whether they want to 'expand' on the game design content (add more detail, elaborate on mechanics, include more examples) or 'contract' it (simplify mechanics, focus on core features, reduce complexity). Also, ask if there's a specific player demographic or experience level they have in mind (casual players, hardcore gamers, children, etc.). Once clarified, perform the expansion or contraction from your current game design role's perspective, tailored to the specified player audience if provided.]]

1. Explain Game Design Reasoning (Step-by-Step)
   [[LLM: Explain the step-by-step game design thinking process that you used to arrive at the current proposal for this game content. Focus on player psychology, engagement mechanics, technical feasibility, and how design decisions support the overall player experience goals.]]

2. Critique and Refine from Player Perspective
   [[LLM: From your current game design role's perspective, review your last output or the current section for potential player confusion, engagement issues, balance problems, or areas for improvement. Consider how players will actually interact with and experience these systems, then suggest a refined version that better serves player enjoyment and understanding.]]

3. Analyze Game Flow and Mechanic Dependencies
   [[LLM: From your game design role's standpoint, examine the content's structure for logical gameplay progression, mechanic interdependencies, and player learning curve. Confirm if game elements are introduced in an effective order that teaches players naturally and maintains engagement throughout the experience.]]

4. Assess Alignment with Player Experience Goals
   [[LLM: Evaluate how well the current game design content contributes to the stated player experience goals and core game pillars. Consider whether the mechanics actually create the intended emotions and engagement patterns. Identify any misalignments between design intentions and likely player reactions.]]

5. Identify Potential Player Confusion and Design Risks
   [[LLM: Based on your game design expertise, brainstorm potential sources of player confusion, overlooked edge cases in gameplay, balance issues, technical implementation risks, or unintended player behaviors that could emerge from the current design. Consider both new and experienced players' perspectives.]]

6. Challenge from Critical Game Design Perspective
   [[LLM: Adopt a critical game design perspective on the current content. If the user specifies another viewpoint (e.g., 'as a casual player', 'as a speedrunner', 'as a mobile player', 'as a technical implementer'), critique the content from that specified perspective. If no other role is specified, play devil's advocate from your game design expertise, arguing against the current design proposal and highlighting potential weaknesses, player experience issues, or implementation challenges. This can include questioning scope creep, unnecessary complexity, or features that don't serve the core player experience.]]

7. Explore Alternative Game Design Approaches
   [[LLM: From your game design role's perspective, first broadly brainstorm a range of diverse approaches to achieving the same player experience goals or solving the same design challenge. Consider different genres, mechanics, interaction models, or technical approaches. Then, from this wider exploration, select and present 2-3 distinct alternative design approaches, detailing the pros, cons, player experience implications, and technical feasibility you foresee for each.]]

8. Hindsight Postmortem: The 'If Only...' Game Design Reflection
   [[LLM: In your current game design persona, imagine this is a postmortem for a shipped game based on the current design content. What's the one 'if only we had designed/considered/tested X...' that your role would highlight from a game design perspective? Include the imagined player reactions, review scores, or development consequences. This should be both insightful and somewhat humorous, focusing on common game design pitfalls.]]

9. Proceed / No Further Actions
   [[LLM: Acknowledge the user's choice to finalize the current game design work, accept the AI's last output as is, or move on to the next step without selecting another action from this list. Prepare to proceed accordingly.]]

## Game Development Context Integration

This elicitation task is specifically designed for game development and should be used in contexts where:

- **Game Mechanics Design**: When defining core gameplay systems and player interactions
- **Player Experience Planning**: When designing for specific emotional responses and engagement patterns
- **Technical Game Architecture**: When balancing design ambitions with implementation realities
- **Game Balance and Progression**: When designing difficulty curves and player advancement systems
- **Platform Considerations**: When adapting designs for different devices and input methods

The questions and perspectives offered should always consider:

- Player psychology and motivation
- Technical feasibility with Unity and C#
- Performance implications for stable frame rate targets
- Cross-platform compatibility (PC, console, mobile)
- Game development best practices and common pitfalls

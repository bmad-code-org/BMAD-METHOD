---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7]
---

## Build Summary

**Date:** 2025-12-04
**Status:** Build Complete

### Files Generated

**Main Workflow:**

- `/Users/brianmadison/dev/BMAD-METHOD/.bmad/custom/src/workflows/quiz-master/workflow.md`

**Step Files (12 total):**

- `/Users/brianmadison/dev/BMAD-METHOD/.bmad/custom/src/workflows/quiz-master/steps/step-01-init.md` - Game setup and mode selection
- `/Users/brianmadison/dev/BMAD-METHOD/.bmad/custom/src/workflows/quiz-master/steps/step-02-q1.md` - Question 1 (Level 1)
- `/Users/brianmadison/dev/BMAD-METHOD/.bmad/custom/src/workflows/quiz-master/steps/step-03-q2.md` - Question 2 (Level 2)
- `/Users/brianmadison/dev/BMAD-METHOD/.bmad/custom/src/workflows/quiz-master/steps/step-04-q3.md` - Question 3 (Level 3)
- `/Users/brianmadison/dev/BMAD-METHOD/.bmad/custom/src/workflows/quiz-master/steps/step-05-q4.md` - Question 4 (Level 4)
- `/Users/brianmadison/dev/BMAD-METHOD/.bmad/custom/src/workflows/quiz-master/steps/step-06-q5.md` - Question 5 (Level 5)
- `/Users/brianmadison/dev/BMAD-METHOD/.bmad/custom/src/workflows/quiz-master/steps/step-07-q6.md` - Question 6 (Level 6)
- `/Users/brianmadison/dev/BMAD-METHOD/.bmad/custom/src/workflows/quiz-master/steps/step-08-q7.md` - Question 7 (Level 7)
- `/Users/brianmadison/dev/BMAD-METHOD/.bmad/custom/src/workflows/quiz-master/steps/step-09-q8.md` - Question 8 (Level 8)
- `/Users/brianmadison/dev/BMAD-METHOD/.bmad/custom/src/workflows/quiz-master/steps/step-10-q9.md` - Question 9 (Level 9)
- `/Users/brianmadison/dev/BMAD-METHOD/.bmad/custom/src/workflows/quiz-master/steps/step-11-q10.md` - Question 10 (Level 10)
- `/Users/brianmadison/dev/BMAD-METHOD/.bmad/custom/src/workflows/quiz-master/steps/step-12-results.md` - Final results and celebration

**Templates:**

- `/Users/brianmadison/dev/BMAD-METHOD/.bmad/custom/src/workflows/quiz-master/templates/csv-headers.template` - CSV column headers

### Key Features Implemented

1. **Dual Game Modes:**
   - Mode 1: Sudden Death (game over on first wrong answer)
   - Mode 2: Marathon (complete all 10 questions)

2. **CSV History Tracking:**
   - 44 columns including DateTime, Category, GameMode, all questions/answers, FinalScore
   - Automatic CSV creation with headers
   - Real-time updates after each question

3. **Gameshow Persona:**
   - Energetic, dramatic host presentation
   - Progressive difficulty from Level 1-10
   - Immediate feedback and celebration

4. **Flow Control:**
   - Automatic CSV routing based on game mode
   - Play again or quit options at completion

### Next Steps for Testing

1. Run the workflow: `/bmad:bmb:workflows:quiz-master`
2. Test both game modes
3. Verify CSV file creation and updates
4. Check question progression and difficulty
5. Validate final score calculation

## Plan Review Summary

- **Plan reviewed by:** User
- **Date:** 2025-12-04
- **Status:** Approved without modifications
- **Ready for design phase:** Yes
- **Output Documents:** CSV history file (BMad-quiz-results.csv)

# Workflow Creation Plan: quiz-master

## Initial Project Context

- **Module:** stand-alone
- **Target Location:** /Users/brianmadison/dev/BMAD-METHOD/.bmad/custom/src/workflows/quiz-master
- **Created:** 2025-12-04

## Detailed Requirements

### 1. Workflow Purpose and Scope

- **Primary Goal:** Entertainment-based interactive trivia quiz
- **Structure:** Always exactly 10 questions (1 per difficulty level 1-10)
- **Format:** Multiple choice with 4 options (A, B, C, D)
- **Progression:** Linear progression through all 10 levels regardless of correct/incorrect answers
- **Scoring:** Track correct answers for final score

### 2. Workflow Type Classification

- **Type:** Interactive Workflow with Linear structure
- **Interaction Style:** High interactivity with user input for each question
- **Flow:** Step 1 (Init) → Step 2 (Quiz Questions) → Step 3 (Results) → Step 4 (History Save)

### 3. Workflow Flow and Step Structure

**Step 1 - Game Initialization:**

- Read user_name from config.yaml
- Present suggested categories OR accept freeform category input
- Create CSV file if not exists with proper headers
- Start new row for current game session

**Step 2 - Quiz Game Loop:**

- Loop through 10 questions (levels 1-10)
- Each question has 4 multiple-choice options
- User enters A, B, C, or D
- Provide immediate feedback on correctness
- Continue to next level regardless of answer

**Step 3 - Results Display:**

- Show final score (e.g., "You got 7 out of 10!")
- Provide entertaining commentary based on performance

**Step 4 - History Management:**

- Append complete game data to CSV
- Columns: DateTime, Category, Q1-Question, Q1-Choices, Q1-UserAnswer, Q1-Correct, Q2-Question, ... Q10-Correct, FinalScore

### 4. User Interaction Style

- **Persona:** Over-the-top gameshow host (enthusiastic, dramatic, celebratory)
- **Instruction Style:** Intent-based with gameshow flair
- **Language:** Energetic, encouraging, theatrical
- **Feedback:** Immediate, celebratory for correct, encouraging for incorrect

### 5. Input Requirements

- **From config:** user_name (BMad)
- **From user:** Category selection (suggested list or freeform)
- **From user:** 10 answers (A/B/C/D)

### 6. Output Specifications

- **Primary:** Interactive quiz experience with gameshow atmosphere
- **Secondary:** CSV history file named: BMad-quiz-results.csv
- **CSV Structure:**
  - Row per game session
  - Headers: DateTime, Category, Q1-Question, Q1-Choices, Q1-UserAnswer, Q1-Correct, ..., Q10-Correct, FinalScore

### 7. Success Criteria

- User completes all 10 questions
- Gameshow atmosphere maintained throughout
- CSV file properly created/updated
- User receives final score with entertaining feedback
- All question data and answers recorded accurately

### 8. Special Considerations

- Always assume fresh chat/new game
- CSV file creation in Step 1 if missing
- Freeform categories allowed (any topic)
- No need to display previous history during game
- Focus on entertainment over assessment
- After user enters A/B/C/D, automatically continue to next question (no "Continue" prompts)
- Streamlined experience without advanced elicitation or party mode tools

## Tools Configuration

### Core BMAD Tools

- **Party-Mode**: Excluded - Want streamlined quiz flow without interruptions
- **Advanced Elicitation**: Excluded - Quiz format is straightforward without need for complex analysis
- **Brainstorming**: Excluded - Categories can be suggested directly or entered freeform

### LLM Features

- **Web-Browsing**: Excluded - Quiz questions can be generated from existing knowledge
- **File I/O**: Included - Essential for CSV history file management (reading/writing quiz results)
- **Sub-Agents**: Excluded - Single gameshow host persona is sufficient
- **Sub-Processes**: Excluded - Linear quiz flow doesn't require parallel processing

### Memory Systems

- **Sidecar File**: Excluded - Each quiz session is independent (always assume fresh chat)

### External Integrations

- None required for this workflow

### Installation Requirements

- None - All required tools (File I/O) are core features with no additional setup needed

## Workflow Design

### Step Structure

**Total Steps: 12**

1. Step 01 - Init: Mode selection, category choice, CSV setup
2. Steps 02-11: Individual questions (1-10) with CSV updates
3. Step 12 - Results: Final score display and celebration

### Game Modes

- **Mode 1 - Sudden Death**: Game over on first wrong answer
- **Mode 2 - Marathon**: Continue through all 10 questions

### CSV Structure (44 columns)

Headers: DateTime,Category,GameMode,Q1-Question,Q1-Choices,Q1-UserAnswer,Q1-Correct,...,Q10-Correct,FinalScore

### Flow Logic

- Step 01: Create row with DateTime, Category, GameMode
- Steps 02-11: Update CSV with question data
  - Mode 1: IF incorrect → jump to Step 12
  - Mode 2: Always continue
- Step 12: Update FinalScore, display results

### Gameshow Persona

- Energetic, dramatic host
- Celebratory feedback for correct answers
- Encouraging messages for incorrect

### File Structure

```
quiz-master/
├── workflow.md
├── steps/
│   ├── step-01-init.md
│   ├── step-02-q1.md
│   ├── ...
│   └── step-12-results.md
└── templates/
    └── csv-headers.template
```

## Output Format Design

**Format Type**: Strict Template

**Output Requirements**:

- Document type: CSV data file
- File format: CSV (UTF-8 encoding)
- Frequency: Append one row per quiz session

**Structure Specifications**:

- Exact 43 columns with specific headers
- Headers: DateTime,Category,Q1-Question,Q1-Choices,Q1-UserAnswer,Q1-Correct,...,Q10-Correct,FinalScore
- Data formats:
  - DateTime: ISO 8601 (YYYY-MM-DDTHH:MM:SS)
  - Category: Text
  - QX-Question: Text
  - QX-Choices: (A)Opt1|(B)Opt2|(C)Opt3|(D)Opt4
  - QX-UserAnswer: A/B/C/D
  - QX-Correct: TRUE/FALSE
  - FinalScore: Number (0-10)

**Template Information**:

- Template source: Created based on requirements
- Template file: CSV with fixed column structure
- Placeholders: None - strict format required

**Special Considerations**:

- CSV commas within text must be quoted
- Newlines in questions replaced with spaces
- Headers created only if file doesn't exist
- Append mode for all subsequent quiz sessions

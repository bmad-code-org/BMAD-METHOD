# BMAD Automation Prompt

Execute the following BMAD command and complete the entire workflow:

```
{COMMAND}
```

## Instructions

1. Execute the command above completely
2. Follow all prompts and complete the workflow
3. Do not ask for confirmation - proceed automatically with reasonable defaults
4. If you encounter any blocking issues, document them and move on
5. Update the sprint-status.yaml file as appropriate

## Context

- Timestamp: {TIMESTAMP}
- This is an automated execution - proceed without user interaction
- Use best judgment for any decisions that would normally require user input
- Prioritize completing the workflow over perfection

## Expected Behavior

- For `/bmad-bmm-create-story`: Create the story file and update sprint-status.yaml to `ready-for-dev`
- For `/bmad-bmm-dev-story`: Implement the story and update sprint-status.yaml to `review`
- For `/bmad-bmm-code-review`: Review the implementation and update sprint-status.yaml to `done` if approved

Proceed with the command execution now.

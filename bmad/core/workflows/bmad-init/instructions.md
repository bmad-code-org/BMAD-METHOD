# BMAD Init - System Initialization Instructions

<workflow>

<step n="1" goal="Welcome and Status Check">
  <action>Display welcome banner with BMAD branding</action>
  <action>Check for BMAD installation at {project-root}/bmad</action>
  <check>If installation found:</check>
    <action>Display current version from {project-root}/bmad/_cfg/manifest.yaml</action>
    <action>Show installation date and status</action>
  <check>If not found:</check>
    <action>Display warning that BMAD is not installed</action>
    <action>Suggest running the installer first</action>
    <action>Exit workflow</action>
  <action>Display formatted status summary:
    ╔════════════════════════════════════════╗
    ║         BMAD INITIALIZATION            ║
    ╚════════════════════════════════════════╝

    Status: [Installed/Not Found]
    Location: {project-root}/bmad
    Version: [from manifest]
    Installed: [date from manifest]

  </action>
</step>

<step n="2" goal="Present Initialization Options">
  <action>Display available initialization and maintenance tasks</action>
  <ask>Select an initialization task:

    1. Customize Installed Agents and Agent Party (Coming Soon)
       - Assign new names and personas to agents
       - Create runtime agent variants
       - NOTE: This can all be done manually, but doing it through here will be easier and also update the party-mode manifest

    2. Verify Installation (Coming Soon)
       - Check all files are properly installed
       - Validate configurations

    3. Exit

    Please select an option (1-3).

  </ask>
</step>

<step n="3" goal="Process User Selection">
  <check>If user selected "1":</check>
    <action>Display message: ⚠️ Installed Agent Auto Customization is coming soon.</action>
    <<action>Return to step 2</action>

<check>If user selected "2":</check>
<action>Display message: ⚠️ Installation verification is coming soon.</action>
<action>Return to step 2</action>

<check>If user selected "3":</check>
<action>Display message: Exiting BMAD Init. Thank you!</action>
<goto step="5">Exit workflow</goto>
</step>

<step n="4" goal="Post-Task Options">
  <action>Display completion status of the executed task</action>
  <ask>Task completed successfully!

Would you like to perform another initialization task? (y/n):</ask>
<check>If user responds "y":</check>
<goto step="2">Return to menu</goto>
<check>If user responds "n":</check>
<goto step="5">Exit workflow</goto>
</step>

<step n="5" goal="Exit Workflow">
  <action>Display farewell message</action>
  <action>Suggest user start a new context or clear context if needed</action>
  <action>Exit workflow</action>
</step>

</workflow>

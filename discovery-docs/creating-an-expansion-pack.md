# Guide: Creating a BMAD Expansion Pack with the BMAD Method

This guide walks you through using the BMAD (Build Me a Dream) method to create your own expansion pack. This process is a form of "dogfooding," where we use the tool to build the tool.

## Phase 1: Ideation & Planning (Using the Product Owner Agent)

The first step is to define the purpose and scope of your expansion pack. We will use the **Product Owner (`po`)** agent from `bmad-core` to facilitate this.

### Step 1.1: Activate the Product Owner Agent

In your terminal, activate the `po` agent:
```bash
# This command is hypothetical, adapt to your BMAD alias
bmad activate po
```

### Step 1.2: Define the Project Brief

Work with the `po` agent to create a `project-brief-tmpl.yaml`. This will define the "what" and "why" of your expansion pack.

**Your Goal:** Answer the agent's questions to fill out the brief. Key sections are:
- **`problem_statement`**: What problem does your expansion pack solve?
- **`solution_statement`**: How does it solve the problem?
- **`target_users`**: Who will use this pack?
- **`key_features`**: List the core features (e.g., new agents, workflows, tasks).
- **`success_metrics`**: How do you know if it's successful?

**Example Interaction:**
```
You: "I want to create a new expansion pack for generating marketing copy."
PO Agent: "Excellent. Let's start with the problem statement. What specific challenge are marketing teams facing that this pack will address?"
```

The output of this step should be a completed `project-brief.yaml` file for your new expansion pack.

## Phase 2: Architecture & Design (Using the Architect Agent)

Now that you have a brief, you need to design the components of your expansion pack. We'll use the **Architect (`architect`)** agent.

### Step 2.1: Activate the Architect Agent
```bash
bmad activate architect
```

### Step 2.2: Create the Architecture Document

Provide the `project-brief.yaml` to the `architect` agent. Its job is to translate the brief into a technical design.

**Your Goal:** Work with the agent to define:
- **New Agents**: What are their names, roles, and capabilities? (e.g., `seo-analyst`, `copywriter`, `social-media-strategist`).
- **New Tasks**: What specific, single-purpose tasks will these agents perform? (e.g., `generate-headline`, `analyze-keywords`, `draft-tweet`).
- **New Workflows**: What multi-step processes will you create? (e.g., `blog-post-workflow`, `ad-campaign-workflow`).
- **Templates & Checklists**: What reusable templates (`ad-copy-tmpl.yaml`) or checklists (`seo-checklist.md`) are needed?

The output of this phase is an `architecture.yaml` document that serves as the blueprint for your expansion pack.

## Phase 3: Implementation (Using the Dev Agent)

This is where you create the actual files for your expansion pack. We'll use the **Developer (`dev`)** agent.

### Step 3.1: Activate the Dev Agent
```bash
bmad activate dev
```

### Step 3.2: Scaffold the Directory Structure

First, create the folder structure for your new pack.
```bash
mkdir -p expansion-packs/bmad-your-new-pack/{agents,agent-teams,checklists,data,tasks,templates,workflows}
```

### Step 3.3: Create Each Component

Use the `dev` agent to generate the content for each file defined in your `architecture.yaml`.

**Your Goal:** For each component, instruct the `dev` agent to create the file.

**Example Interaction (Creating an Agent):**
```
You: "Create a new agent file named 'copywriter.md' in the 'agents' folder. The agent's purpose is to write compelling marketing copy based on a brief."
Dev Agent: "Understood. Here is the draft for 'copywriter.md'. Please review the prompt and let me know if it meets the requirements."
```

Repeat this process for all agents, tasks, workflows, templates, and checklists. The `dev` agent should write the YAML and Markdown files for you.

## Phase 4: Testing & Refinement (Using the QA Agent)

Once the files are created, you need to test them. We'll use the **QA (`qa`)** agent.

### Step 4.1: Activate the QA Agent
```bash
bmad activate qa
```

### Step 4.2: Run Through a Workflow

Choose one of the workflows you created and try to execute it with the BMAD system.

**Your Goal:** Follow the workflow from start to finish, using the new agents and tasks.

**Example Interaction:**
```
You: "I am starting the 'blog-post-workflow'. The first step is to use the 'seo-analyst' agent to run the 'analyze-keywords' task."
QA Agent: "Acknowledged. Please provide the inputs for the 'analyze-keywords' task. I will be monitoring the output against the expected results defined in our test plan."
```

As you go, the `qa` agent will help you identify bugs, inconsistencies, or areas for improvement in your prompts, templates, and agent instructions.

## Phase 5: Documentation & Packaging

The final step is to create the user-facing documentation and configuration.

### Step 5.1: Create `config.yaml`

Create a `config.yaml` file in the root of your expansion pack directory. Fill in the metadata:
```yaml
name: bmad-your-new-pack
version: 0.1.0
short-title: Your New Pack
description: >-
  A brief but clear description of what your expansion pack does.
author: Your Name
slashPrefix: bmad-ynp
```

### Step 5.2: Write the `README.md`

This is the most important piece of documentation. It should include:
- An overview of the pack.
- A list of the included agents and workflows.
- Installation and usage instructions.
- Example use cases.

You can use the **`dev`** or **`po`** agent to help you write a clear and comprehensive `README.md` based on all the components you've built.

---

By following this guide, you have successfully used the BMAD method to define, design, build, test, and document a new, ready-to-use expansion pack.

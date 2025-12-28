# Custom Content Installation

This guide explains how to create and install custom BMAD content including agents, workflows, and modules. Custom content extends BMAD's functionality with specialized tools and workflows that can be shared across projects or teams.

For detailed information about the different types of custom content available, see [Custom Content](modules/bmb-bmad-builder/custom-content.md).

You can find example custom modules in the `samples/sample-custom-modules/` folder of the repository. Download either of the sample folders to try them out.

## Content Types Overview

BMAD Core supports several categories of custom content:

- Custom Stand Alone Modules
- Custom Add On Modules
- Custom Global Modules
- Custom Agents
- Custom Workflows

## Making Custom Content Installable

### Custom Modules

To create an installable custom module:

1. **Folder Structure**
   - Create a folder with a short, abbreviated name (e.g., `cis` for Creative Intelligence Suite)
   - The folder name serves as the module code

2. **Required File**
   - Include a `module.yaml` file in the root folder (this drives questions for the final generated config.yaml at install target)

3. **Folder Organization**
   Follow these conventions for optimal compatibility:

   ```
   module-code/
     module.yaml
     agents/
     workflows/
     tools/
     templates/
     ...
   ```

   - `agents/` - Agent definitions
   - `workflows/` - Workflow definitions
   - Additional custom folders are supported but following conventions is recommended for agent and workflow discovery

**Note:** Full documentation for global modules and add-on modules will be available as support is finalized.

### Standalone Content (Agents, Workflows, Tasks, Tools, Templates, Prompts)

For standalone content that isn't part of a cohesive module collection, follow this structure:

1. **Module Configuration**
   - Create a folder with a `module.yaml` file (similar to custom modules)
   - Add the property `unitary: true` in the module.yaml
     - The `unitary: true` property indicates this is a collection of potentially unrelated items that don't depend on each other
   - Any content you add to this folder should still be nested under workflows and agents - but the key with stand alone content is they do not rely on each other.
     - Agents do not reference other workflows even if stored in a unitary:true module. But unitary Agents can have their own workflows in their sidecar, or reference workflows as requirements from other modules - with a process known as workflow vendoring. Keep in mind, this will require that the workflow referenced from the other module would need to be available for the end user to install, so its recommended to only vendor workflows from the core module, or official bmm modules (See [Workflow Vendoring, Customization, and Inheritance](workflow-vendoring-customization-inheritance.md)).

2. **Folder Structure**
   Organize content in specific named folders:

   ```
   module-name/
     module.yaml        # Contains unitary: true
     agents/
     workflows/
     templates/
     tools/
     tasks/
     prompts/
   ```

3. **Individual Item Organization**
   Each item should have its own subfolder:
   ```text
   my-custom-stuff/
     module.yaml
     agents/
       larry/larry.agent.md
       curly/curly.agent.md
       moe/moe.agent.md
       moe/moe-sidecar/memories.csv
   ```

**Future Feature:** Unitary modules will support selective installation, allowing users to pick and choose which specific items to install.

**Note:** Documentation explaining the distinctions between these content types and their specific use cases will be available soon.

## Installation Process

### Prerequisites

Ensure your content follows the proper conventions and includes a `module.yaml` file (only one per top-level folder).

### New Project Installation

When setting up a new BMAD project:

1. The installer will prompt: `Would you like to install a local custom module (this includes custom agents and workflows also)? (y/N)`
2. Select 'y' to specify the path to your module folder containing `module.yaml`

### Existing Project Modification

To add custom content to an existing BMAD project:

1. Run the installer against your project location
2. Select `Modify BMAD Installation`
3. Choose the option to add, modify, or update custom modules

### Upcoming Features

- **Unitary Module Selection:** For modules with `type: unitary` (instead of `type: module`), you'll be able to select specific items to install
- **Add-on Module Dependencies:** The installer will verify and install dependencies for add-on modules automatically

## Quick Updates

When updates to BMAD Core or core modules (BMM, CIS, etc.) become available, the quick update process will:

1. Apply available updates to core modules
2. Recompile all agents with customizations from the `_config/agents` folder
3. Retain your custom content from a cached location
4. Preserve your existing configurations and customizations

This means you don't need to keep the source module files locally. When updates are available, simply point to the updated module location during the update process.

## Important Considerations

### Module Naming Conflicts

When installing unofficial modules, ensure unique identification to avoid conflicts:

1. **Module Codes:** Each module must have a unique code (e.g., don't use `bmm` for custom modules)
2. **Module Names:** Avoid using names that conflict with existing modules
3. **Multiple Custom Modules:** If creating multiple custom modules, use distinct codes for each

**Examples of conflicts to avoid:**

- Don't create a custom module with code `bmm` (already used by BMad Method)
- Don't name multiple custom modules with the same code like `mca`

### Best Practices

- Use descriptive, unique codes for your modules
- Document any dependencies your custom modules have
- Test custom modules in isolation before sharing
- Consider version numbering for your custom content to track updates

# Workflow Vendoring, Customization, and Inheritance (Official Support Consing Soon)

Vendoring and Inheritance of workflows are 2 ways of sharing or reutilizing workflows - but with some key distinctions and use cases.

## Workflow Vendoring

Workflow Vendoring allows an agent to have access to a workflow from another module, without having to install said module. At install time, the module workflow being vendored will be cloned and installed into the module that is receiving the vendored workflow the agent needs.

### How to Vendor

Lets assume you are building a module, and you do not want to recreate a workflow from the BMad Method, such as workflows/4-implementation/dev-story/workflow.md. Instead of copying all the context to your module, and having to maintain it over time as updates are made, you can instead use the exec-vendor menu item in your agent.

From your modules agent definition, you would implement the menu item as follows in the agent:

```yaml
    - trigger: develop-story
      exec-vendor: "{project-root}/_bmad/<source-module>/workflows/4-production/dev-story/workflow.md"
      exec: "{project-root}/_bmad/<my-module>/workflows/dev-story/workflow.md"
      description: "Execute Dev Story workflow, implementing tasks and tests, or performing updates to the story"
```

At install time, it will clone the workflow and all of its required assets, and the agent that gets built will have an exec to a path installed in its own module. The content gets added to the folder you specify in exec. While it does not have to exactly match the source path, you will want to ensure you are specifying the workflow.md to be in a new location (in other words in this example, dev-story would not already be the path of another custom module workflow that already exists.)

## Workflow Inheritance (Official Support Coming Post Beta)

Workflow Inheritance is a different concept, that allows you to modify or extend existing workflow.

Party Mode from the core is an example of a workflow that is designed with inheritance in mind - customization for specific party needs. While party mode itself is generic - there might be specific agent collaborations you want to create. Without having to reinvent the whole party mode concept, or copy and paste all of its content - you could inherit from party mode to extend it to be specific.

Some possible examples could be:

- Retrospective
- Sprint Planning
- Collaborative Brainstorming Sessions

## Workflow Customization (Official Support Coming Post Beta)

Similar to Workflow Inheritance, Workflow Customization will soon be allowed for certain workflows that are meant to be user customized - similar in process to how agents are customized now.

This will take the shape of workflows with optional hooks, configurable inputs, and the ability to replace whole at install time.

For example, assume you are using the Create PRD workflow, which is comprised of 11 steps, and you want to always include specifics about your companies domain, technical landscape or something else. While project-context can be helpful with that, you can also through hooks and step overrides, have full replace steps, the key requirement being to ensure your step replace file is an exact file name match of an existing step, follows all conventions, and ends in a similar fashion to either hook back in to call the next existing step, or more custom steps that eventually hook back into the flow.

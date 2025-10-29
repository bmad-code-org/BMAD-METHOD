# BMAD Workflow Markdown Formatting Integration

This document explains how to integrate automatic markdown formatting into BMAD workflows to ensure consistent output that meets GitHub issue #483 requirements.

## Quick Integration

### Option 1: Post-Process After Workflow Completion

Add this to your workflow instructions after the final step:

```xml
<step n="final" goal="Format output files">
  <action>Run markdown formatter on generated files</action>
  <action>Ensure CRLF line endings and GFM compliance</action>
</step>
```

Then in your workflow execution, call:

```javascript
const { formatWorkflowOutput } = require('../../../src/utility/workflow-output-formatter.js');
await formatWorkflowOutput(outputFilePath);
```

### Option 2: Format Content Before Writing

For workflows that generate content in memory before writing:

```javascript
const { formatMarkdown } = require('../../../src/utility/workflow-output-formatter.js');

// Format content before writing
const formattedContent = formatMarkdown(generatedMarkdown);
await fs.writeFile(outputPath, formattedContent, 'utf8');
```

## Integration Examples

### Story Creation Workflow

The `create-story` workflow can be enhanced by adding formatting to the template output phase:

```xml
<step n="8" goal="Validate, save, and format story">
  <invoke-task>Validate against checklist</invoke-task>
  <action>Save document to {default_output_file}</action>
  <action>Format markdown output for CRLF compliance and GFM standards</action>
</step>
```

### Directory-Wide Processing

To format all markdown files in an output directory:

```javascript
const { formatMarkdownDirectory } = require('../../../src/utility/workflow-output-formatter.js');

// Format all .md files in the stories directory
const count = await formatMarkdownDirectory('/path/to/stories', {
  markdownOptions: {
    forceLineEnding: 'crlf',
    enforceGFMCompliance: true,
  },
  verbose: true,
});

console.log(`Formatted ${count} markdown files`);
```

## Configuration Options

### Markdown Formatter Options

```javascript
const options = {
  // Line ending preferences
  forceLineEnding: 'crlf', // 'lf', 'crlf', or 'auto'

  // Content normalization
  normalizeWhitespace: true, // Fix spacing around headings/sections
  enforceGFMCompliance: true, // Ensure GitHub Flavored Markdown compliance
  fixSmartQuotes: true, // Replace smart quotes with standard quotes
  maxConsecutiveBlankLines: 2, // Limit consecutive blank lines

  // Debugging
  debug: false, // Enable detailed logging
};
```

### Workflow Formatter Options

```javascript
const workflowOptions = {
  // Processing control
  autoFormat: true, // Automatically format output files
  verbose: false, // Enable console logging

  // File patterns
  patterns: ['**/*.md'], // Which files to process

  // Markdown options (passed to MarkdownFormatter)
  markdownOptions: {
    forceLineEnding: 'crlf',
    normalizeWhitespace: true,
    enforceGFMCompliance: true,
  },
};
```

## Common Integration Patterns

### Pattern 1: Single File Output Workflow

For workflows that generate a single markdown file:

```javascript
// In your workflow processing
const { WorkflowOutputFormatter } = require('../../../src/utility/workflow-output-formatter.js');

const formatter = new WorkflowOutputFormatter({
  verbose: true,
  markdownOptions: {
    forceLineEnding: 'crlf',
  },
});

// After generating the file
await formatter.formatFile(outputFilePath);
```

### Pattern 2: Multi-File Output Workflow

For workflows that generate multiple files:

```javascript
// Format entire output directory
await formatter.formatDirectory(outputDirectory);
```

### Pattern 3: Template Processing Integration

For workflows using templates with `<template-output>` tags:

```xml
<step n="X" goal="Generate and format section">
  <template-output file="{default_output_file}">section_content</template-output>
  <action>Apply markdown formatting to maintain consistency</action>
</step>
```

## Testing Your Integration

### Verify CRLF Line Endings

```bash
# Check line endings in generated files
file generated-story.md
# Should show: "with CRLF line terminators"

# Or count line ending types
grep -c $'\r' generated-story.md    # Count CRLF
grep -c $'[^\r]\n' generated-story.md  # Count LF-only
```

### Validate GFM Compliance

Use the included test utilities:

```javascript
const { MarkdownFormatter } = require('../../../src/utility/markdown-formatter.js');

const formatter = new MarkdownFormatter();
const issues = formatter.validate(markdownContent);

if (issues.length > 0) {
  console.log('GFM compliance issues:', issues);
}
```

## Troubleshooting

### Line Endings Not Applied

- Check that `forceLineEnding: 'crlf'` is set in options
- Verify the file is being processed (enable `verbose: true`)
- Ensure no other tools are overriding line endings after formatting

### Spacing Issues Persist

- Confirm `normalizeWhitespace: true` is enabled
- Check if the content has complex markdown structures that need manual review
- Review `maxConsecutiveBlankLines` setting

### Performance Concerns

- Use `formatFile()` for single files instead of `formatDirectory()`
- Consider processing only modified files in incremental workflows
- Disable `debug` mode in production workflows

## Best Practices

1. **Always format after generation**: Apply formatting as the last step after all content is generated

2. **Use consistent options**: Create a shared configuration object for all workflows in a module

3. **Enable verbose logging during development**: Set `verbose: true` while testing integration

4. **Test with problematic content**: Use the test fixtures in `test/fixtures/markdown-issues/` to verify your integration handles edge cases

5. **Document workflow changes**: Update workflow README files to indicate markdown formatting is applied

## Migration Guide

To add formatting to existing workflows:

1. **Identify output files**: Find where markdown files are written in your workflow
2. **Add formatter import**: Include the workflow-output-formatter module
3. **Apply formatting**: Call `formatWorkflowOutput()` after file generation
4. **Test thoroughly**: Verify line endings and formatting are correct
5. **Update documentation**: Document the formatting integration

This ensures all generated markdown meets the requirements specified in GitHub issue #483.

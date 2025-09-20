<!-- Powered by BMAD™ Core -->

# Gemini Analysis Task

## Purpose

This task provides access to Google Gemini CLI's massive context window for analyzing large codebases, big files, or complex multi-file operations that exceed normal context limits. Gemini CLI can handle entire project contexts that would overflow standard AI context windows.

## Key Capabilities

- **Massive Context Window**: Analyze entire codebases without context limitations
- **File & Directory Inclusion**: Use `@` syntax for precise file/directory targeting
- **Multi-File Analysis**: Compare and analyze multiple large files simultaneously
- **Codebase Flattening**: Alternative to local flattener for large projects
- **Feature Verification**: Check if specific features are implemented across entire projects
- **Pattern Discovery**: Find patterns, implementations, and architectural decisions project-wide

## When to Use Gemini Analysis

### Ideal Use Cases

- **Large Codebase Architecture Analysis**: Understanding overall system design
- **Multi-File Pattern Searching**: Finding implementations across multiple files
- **Feature Implementation Verification**: Checking if features exist project-wide
- **Brownfield Project Discovery**: Understanding existing large codebases
- **Context-Heavy Debugging**: Analyzing complex interactions across many files
- **Comprehensive Code Reviews**: Reviewing entire feature implementations

### Context Size Triggers

- Files or directories totaling >100KB of content
- Analysis requiring >20 files simultaneously
- Project-wide architectural understanding needed
- Current context window insufficient for task

## Analysis Modes

### 1. Single File Analysis

**Use Case**: Deep analysis of large individual files
**Command Pattern**: `gemini "@file/path Analyze this file's structure and purpose"`
**Examples**:

- `@src/main.py Explain this file's architecture and key patterns`
- `@config/webpack.config.js Break down this configuration and its impact`

### 2. Directory Analysis

**Use Case**: Understanding structure and patterns within specific directories
**Command Pattern**: `gemini "@directory/ Analyze the architecture of this codebase section"`
**Examples**:

- `@src/components/ Summarize the component architecture and patterns`
- `@api/routes/ Document all API endpoints and their purposes`

### 3. Multi-Path Analysis

**Use Case**: Comparing and analyzing relationships between multiple areas
**Command Pattern**: `gemini "@path1 @path2 Analyze relationships between these areas"`
**Examples**:

- `@src/ @tests/ Analyze test coverage for the source code`
- `@frontend/ @backend/ How do these communicate and what are the integration points?`

### 4. Project Overview

**Use Case**: Comprehensive understanding of entire project
**Command Pattern**: `gemini --all-files "Provide comprehensive project analysis"`
**Examples**:

- `--all-files "Give me an architectural overview of this entire project"`
- `--all-files "Summarize the technology stack and key architectural decisions"`

### 5. Feature Verification

**Use Case**: Checking if specific features or patterns are implemented
**Command Pattern**: `gemini "@codebase/ Has [feature] been implemented? Show relevant files"`
**Examples**:

- `@src/ @lib/ Has dark mode been implemented? Show relevant files and functions`
- `@api/ @middleware/ Is rate limiting implemented? Show the implementation details`

### 6. Pattern Discovery

**Use Case**: Finding specific coding patterns, security measures, or architectural decisions
**Command Pattern**: `gemini "@codebase/ Find all instances of [pattern] and list with file paths"`
**Examples**:

- `@src/ Are there any React hooks that handle WebSocket connections?`
- `@backend/ Is proper error handling implemented for all endpoints?`

## Task Process

### 1. Analysis Request Processing

#### Gather Requirements

- **Analysis Type**: Which mode fits the user's need?
- **Target Paths**: What files/directories should be included?
- **Analysis Depth**: High-level overview vs detailed analysis?
- **Specific Questions**: What particular aspects to focus on?
- **Output Format**: How should results be presented?

#### Path Validation

- **Existence Check**: Verify all specified paths exist
- **Size Assessment**: Estimate total content size
- **Permission Validation**: Ensure readable access
- **Safety Check**: Confirm read-only analysis scope

### 2. Command Construction

#### Basic Command Structure

```bash
gemini [options] "@path1 @path2 [prompt]"
```

#### Option Selection

- **Standard Mode**: `gemini "@path prompt"`
- **All Files Mode**: `gemini --all-files "prompt"`
- **Safe Mode**: `gemini --approval-mode default "@path prompt"`
- **Sandbox Mode**: `gemini --sandbox "@path prompt"` (if editing needed)

#### Path Formatting

- **Single File**: `@src/main.py`
- **Directory**: `@src/components/`
- **Multiple Paths**: `@src/ @tests/ @docs/`
- **Current Directory**: `@./`
- **Specific Files**: `@package.json @README.md`

### 3. Safety and Validation

#### Pre-Execution Checks

- **Read-Only Confirmation**: Ensure analysis-only intent
- **Path Sanitization**: Validate and clean file paths
- **Size Warnings**: Alert for extremely large contexts
- **Approval Mode**: Set appropriate safety level

#### Command Safety Options

```yaml
safety_levels:
  read_only: 'Default - analysis only, no modifications'
  default: 'Prompt for any file modifications'
  auto_edit: 'Auto-approve edit tools only'
  sandbox: 'Run in safe sandbox environment'
```

### 4. Execution and Results

#### Command Execution

1. **Validate Paths**: Confirm all targets exist and are accessible
2. **Construct Command**: Build proper Gemini CLI command
3. **Execute Analysis**: Run Gemini CLI with specified parameters
4. **Capture Output**: Collect and format analysis results
5. **Error Handling**: Manage CLI failures or timeouts

#### Result Processing

- **Output Formatting**: Structure results for readability
- **Key Insights Extraction**: Highlight critical findings
- **Follow-up Suggestions**: Recommend next steps
- **Source Documentation**: Reference analyzed files/paths

### 5. Integration with BMAD Workflow

#### Result Documentation

- **Store in Project**: Save significant analyses in `docs/analysis/`
- **Reference in Stories**: Link analyses to relevant development stories
- **Architecture Updates**: Update architecture docs with findings
- **Knowledge Preservation**: Maintain analysis artifacts for team reference

#### Follow-Up Actions

- **Story Creation**: Generate development stories from findings
- **Architecture Review**: Update architectural documentation
- **Technical Debt**: Identify and document technical debt items
- **Research Coordination**: Trigger detailed research if needed

## Command Templates

### Architecture Analysis

```bash
# Overall project architecture
gemini --all-files "Analyze the overall architecture of this project. Include technology stack, key patterns, and architectural decisions."

# Specific component architecture
gemini "@src/components/ Analyze the component architecture. What patterns are used and how are components organized?"

# Backend architecture
gemini "@api/ @services/ @middleware/ Analyze the backend architecture. How are routes organized and what patterns are used?"
```

### Feature Verification

```bash
# Authentication implementation
gemini "@src/ @api/ Is JWT authentication fully implemented? Show all auth-related files and middleware."

# Security measures
gemini "@src/ @api/ What security measures are implemented? Look for input validation, CORS, rate limiting."

# Testing coverage
gemini "@src/ @tests/ Analyze test coverage. Which areas are well-tested and which need more tests?"
```

### Code Quality Analysis

```bash
# Error handling patterns
gemini "@src/ @api/ How is error handling implemented throughout the codebase? Show examples."

# Performance considerations
gemini "@src/ @lib/ What performance optimizations are in place? Identify potential bottlenecks."

# Code organization
gemini "@src/ How is the code organized? What are the main modules and their responsibilities?"
```

### Technology Assessment

```bash
# Dependency analysis
gemini "@package.json @src/ What are the key dependencies and how are they used in the code?"

# Build system analysis
gemini "@webpack.config.js @package.json @src/ How is the build system configured and what optimizations are in place?"

# Database integration
gemini "@models/ @migrations/ @src/ How is the database integrated? What ORM patterns are used?"
```

## Error Handling

### Common Issues

- **Path Not Found**: Specified files/directories don't exist
- **Context Too Large**: Even Gemini's context has limits
- **CLI Unavailable**: Gemini CLI not installed or configured
- **Permission Denied**: Cannot read specified files
- **Command Timeout**: Analysis takes too long to complete

### Error Recovery

- **Path Validation**: Pre-validate all paths before execution
- **Graceful Degradation**: Suggest smaller scope if context too large
- **Alternative Approaches**: Offer local flattener or partial analysis
- **Clear Error Messages**: Provide actionable error information
- **Fallback Options**: Suggest manual analysis approaches

### Safety Measures

- **Read-Only Default**: Never modify files without explicit permission
- **Approval Prompts**: Confirm any file modifications
- **Sandbox Options**: Use sandbox mode for risky operations
- **Timeout Protection**: Prevent hanging operations
- **Resource Monitoring**: Track memory and processing usage

## Integration Notes

### With Existing BMAD Tools

- **Flattener Integration**: Use existing flattener for preprocessing when needed
- **Research Coordination**: Can trigger research system for follow-up analysis
- **Story Generation**: Results can inform story creation
- **Architecture Documentation**: Updates architectural understanding

### With Core Configuration

- **Command Templates**: Stored in core-config.yaml for consistency
- **Default Settings**: Safety and approval modes configured globally
- **Path Patterns**: Common path combinations for different project types
- **Integration Points**: How Gemini analysis feeds into BMAD workflow

### Agent Accessibility

All agents with Gemini analysis capability will have access to:

- **Standard Analysis**: `*gemini-analyze` command for common patterns
- **Custom Queries**: Ability to specify custom analysis prompts
- **Result Integration**: Automatic integration with agent workflows
- **Safety Controls**: Appropriate safety measures for agent context

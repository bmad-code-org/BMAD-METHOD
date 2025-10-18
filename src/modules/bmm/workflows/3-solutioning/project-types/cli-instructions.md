# CLI Tool Architecture Instructions

## Intent-Based Technical Decision Guidance

<critical>
This is a STARTING POINT for CLI tool architecture decisions.
The LLM should:
- Understand the tool's purpose and target users from requirements
- Guide framework choice based on distribution needs and complexity
- Focus on CLI-specific UX patterns
- Consider packaging and distribution strategy
- Keep it simple unless complexity is justified
</critical>

## Language and Framework Selection

**Choose Based on Distribution and Users**

- **Node.js**: NPM distribution, JavaScript ecosystem, cross-platform
- **Go**: Single binary distribution, excellent performance
- **Python**: Data/science tools, rich ecosystem, pip distribution
- **Rust**: Performance-critical, memory-safe, growing ecosystem
- **Bash**: Simple scripts, Unix-only, no dependencies

Consider your users: Developers might have Node/Python, but end users need standalone binaries.

## CLI Framework Choice

**Match Complexity to Needs**
Based on the tool's requirements:

- **Simple scripts**: Use built-in argument parsing
- **Command-based**: Commander.js, Click, Cobra, Clap
- **Interactive**: Inquirer, Prompt, Dialoguer
- **Full TUI**: Blessed, Bubble Tea, Ratatui

Don't use a heavy framework for a simple script, but don't parse args manually for complex CLIs.

## Command Architecture

**Command Structure Design**

- Single command vs. sub-commands
- Flag and argument patterns
- Configuration file support
- Environment variable integration

Follow platform conventions (POSIX-style flags, standard exit codes).

## User Experience Patterns

**CLI UX Best Practices**

- Help text and usage examples
- Progress indicators for long operations
- Colored output for clarity
- Machine-readable output options (JSON, quiet mode)
- Sensible defaults with override options

## Configuration Management

**Settings Strategy**
Based on tool complexity:

- Command-line flags for one-off changes
- Config files for persistent settings
- Environment variables for deployment config
- Cascading configuration (defaults → config → env → flags)

## Error Handling

**User-Friendly Errors**

- Clear error messages with actionable fixes
- Exit codes following conventions
- Verbose/debug modes for troubleshooting
- Graceful handling of common issues

## Installation and Distribution

**Packaging Strategy**

- **NPM/PyPI**: For developer tools
- **Homebrew/Snap/Chocolatey**: For end-user tools
- **Binary releases**: GitHub releases with multiple platforms
- **Docker**: For complex dependencies
- **Shell script**: For simple Unix tools

## Testing Strategy

**CLI Testing Approach**

- Unit tests for core logic
- Integration tests for commands
- Snapshot testing for output
- Cross-platform testing if targeting multiple OS

## Performance Considerations

**Optimization Where Needed**

- Startup time for frequently-used commands
- Streaming for large data processing
- Parallel execution where applicable
- Efficient file system operations

## Plugin Architecture

**Extensibility** (if needed)

- Plugin system design
- Hook mechanisms
- API for extensions
- Plugin discovery and loading

Only if the PRD indicates extensibility requirements.

## Adaptive Guidance Examples

**For a Build Tool:**
Focus on performance, watch mode, configuration management, and plugin system.

**For a Dev Utility:**
Emphasize developer experience, integration with existing tools, and clear output.

**For a Data Processing Tool:**
Focus on streaming, progress reporting, error recovery, and format conversion.

**For a System Admin Tool:**
Emphasize permission handling, logging, dry-run mode, and safety checks.

## Key Principles

1. **Follow platform conventions** - Users expect familiar patterns
2. **Fail fast with clear errors** - Don't leave users guessing
3. **Provide escape hatches** - Debug mode, verbose output, dry runs
4. **Document through examples** - Show, don't just tell
5. **Respect user time** - Fast startup, helpful defaults

## Output Format

Document as:

- **Language**: [Choice with version]
- **Framework**: [CLI framework if applicable]
- **Distribution**: [How users will install]
- **Key commands**: [Primary user interactions]

Keep focus on user-facing behavior and implementation simplicity.

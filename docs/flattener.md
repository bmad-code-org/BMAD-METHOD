# Codebase Flattener Tool

The BMAD-METHOD™ includes a powerful codebase flattener tool designed to prepare your project files for AI model consumption when uploading to web AI tools. This tool aggregates your entire codebase into a single XML file, making it easy to share your project context with AI assistants for analysis, debugging, or development assistance.

## Features

- **AI-Optimized Output**: Generates clean XML format specifically designed for AI model consumption
- **Smart Filtering**: Automatically respects `.gitignore` patterns to exclude unnecessary files, plus optional project-level `.bmad-flattenignore` for additional exclusions if planning to flatten an existing repository for external update and analysis
- **Binary File Detection**: Intelligently identifies and excludes binary files, focusing on source code
- **Progress Tracking**: Real-time progress indicators and comprehensive completion statistics
- **Flexible Output**: Customizable output file location and naming

## Usage

```bash
# Basic usage - creates flattened-codebase.xml in current directory
npx bmad-method flatten

# Specify custom input directory
npx bmad-method flatten --input /path/to/source/directory
npx bmad-method flatten -i /path/to/source/directory

# Specify custom output file
npx bmad-method flatten --output my-project.xml
npx bmad-method flatten -o /path/to/output/codebase.xml

# Combine input and output options
npx bmad-method flatten --input /path/to/source --output /path/to/output/codebase.xml
```

## Example Output

The tool will display progress and provide a comprehensive summary:

```text
📊 Completion Summary:
✅ Successfully processed 156 files into flattened-codebase.xml
📁 Output file: /path/to/your/project/flattened-codebase.xml
📏 Total source size: 2.3 MB
📄 Generated XML size: 2.1 MB
📝 Total lines of code: 15,847
🔢 Estimated tokens: 542,891
📊 File breakdown: 142 text, 14 binary, 0 errors
```

The generated XML file contains your project's text-based source files in a structured format that AI models can easily parse and understand, making it perfect for code reviews, architecture discussions, or getting AI assistance with your BMAD-METHOD™ projects.

## Advanced Usage & Options

- CLI options
  - `-i, --input <path>`: Directory to flatten. Default: current working directory or auto-detected project root when run interactively.
  - `-o, --output <path>`: Output file path. Default: `flattened-codebase.xml` in the chosen directory.
- Interactive mode
  - If you do not pass `--input` and `--output` and the terminal is interactive (TTY), the tool will attempt to detect your project root (by looking for markers like `.git`, `package.json`, etc.) and prompt you to confirm or override the paths.
  - In non-interactive contexts (e.g., CI), it will prefer the detected root silently; otherwise it falls back to the current directory and default filename.
- File discovery and ignoring
  - Uses `git ls-files` when inside a git repository for speed and correctness; otherwise falls back to a glob-based scan.
  - Applies your `.gitignore` plus a curated set of default ignore patterns (e.g., `node_modules`, build outputs, caches, logs, IDE folders, lockfiles, large media/binaries, `.env*`, and previously generated XML outputs).
  - Supports an optional `.bmad-flattenignore` file at the project root for additional ignore patterns (gitignore-style). If present, its rules are applied after `.gitignore` and the defaults.

## `.bmad-flattenignore` example

Create a `.bmad-flattenignore` file in the root of your project to exclude files that must remain in git but should not be included in the flattened XML:

```text
seeds/**
scripts/private/**
**/*.snap
```

- Binary handling
  - Binary files are detected and excluded from the XML content. They are counted in the final summary but not embedded in the output.
- XML format and safety
  - UTF-8 encoded file with root element `<files>`.
  - Each text file is emitted as a `<file path="relative/path">` element whose content is wrapped in `<![CDATA[ ... ]]>`.
  - The tool safely handles occurrences of `]]>` inside content by splitting the CDATA to preserve correctness.
  - File contents are preserved as-is and indented for readability inside the XML.
- Performance
  - Concurrency is selected automatically based on your CPU and workload size. No configuration required.
  - Running inside a git repo improves discovery performance.

## Minimal XML example

```xml
<?xml version="1.0" encoding="UTF-8"?>
<files>
  <file path="src/index.js"><![CDATA[
    // your source content
  ]]></file>
</files>
```

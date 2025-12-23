# Downloads

Download BMAD Method resources for offline use, AI training, or integration.

## LLM-Optimized Files

These files are designed for AI consumption - perfect for loading into Claude, ChatGPT, or any LLM context window.

| File                                | Description                         | Use Case                   |
| ----------------------------------- | ----------------------------------- | -------------------------- |
| **[llms.txt](/llms.txt)**           | Documentation index with summaries  | Quick overview, navigation |
| **[llms-full.txt](/llms-full.txt)** | Complete documentation concatenated | Full context loading       |

### Using with LLMs

**Claude Projects:**

```
Upload llms-full.txt as project knowledge
```

**ChatGPT:**

```
Paste llms.txt for navigation, or sections from llms-full.txt as needed
```

**API Usage:**

```python
import requests
docs = requests.get("https://bmad-code-org.github.io/BMAD-METHOD/llms-full.txt").text
# Include in your system prompt or context
```

## Source Bundles

Download the complete source code for offline development or contribution.

| Bundle                                              | Contents                                    |
| --------------------------------------------------- | ------------------------------------------- |
| **[bmad-sources.zip](/downloads/bmad-sources.zip)** | Complete `/src/` directory with all modules |
| **[bmad-prompts.zip](/downloads/bmad-prompts.zip)** | Agent prompts and workflows from `/_bmad/`  |

## Installation Options

### NPM (Recommended)

```bash
npx bmad-method@alpha install
```

### Manual Installation

1. Download `bmad-prompts.zip`
2. Extract to your project root
3. Configure your IDE per the [IDE Guides](/docs/ide-info/)

## Version Information

- **Current Version:** See [CHANGELOG](https://github.com/bmad-code-org/BMAD-METHOD/blob/main/CHANGELOG.md)
- **Release Notes:** Available on [GitHub Releases](https://github.com/bmad-code-org/BMAD-METHOD/releases)

## API Access

For programmatic access to BMAD documentation:

```bash
# Get documentation index
curl https://bmad-code-org.github.io/BMAD-METHOD/llms.txt

# Get full documentation
curl https://bmad-code-org.github.io/BMAD-METHOD/llms-full.txt
```

## Contributing

Want to improve BMAD Method? Check out:

- [Contributing Guide](https://github.com/bmad-code-org/BMAD-METHOD/blob/main/CONTRIBUTING.md)
- [GitHub Repository](https://github.com/bmad-code-org/BMAD-METHOD)

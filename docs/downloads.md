---
title: Downloads
---

Download BMad Method resources for offline use, AI training, or integration.

## Source Bundles

Download these from the `downloads/` folder on the documentation site.

| File               | Description                     |
| ------------------ | ------------------------------- |
| `bmad-sources.zip` | Complete BMad source files      |
| `bmad-prompts.zip` | Agent and workflow prompts only |

## LLM-Optimized Files

These files are designed for AI consumption - perfect for loading into Claude, ChatGPT, or any LLM context window. See [API Access](#api-access) below for URLs.

| File            | Description                         | Use Case                   |
| --------------- | ----------------------------------- | -------------------------- |
| `llms.txt`      | Documentation index with summaries  | Quick overview, navigation |
| `llms-full.txt` | Complete documentation concatenated | Full context loading       |

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

## Installation Options

```bash
npx bmad-method install
```

[More details](/docs/how-to/install-bmad.md)

## Version Information

- **Current Version:** See [CHANGELOG](https://github.com/bmad-code-org/BMAD-METHOD/blob/main/CHANGELOG.md)
- **Release Notes:** Available on [GitHub Releases](https://github.com/bmad-code-org/BMAD-METHOD/releases)

## API Access

For programmatic access to BMad documentation:

```bash
# Get documentation index
curl https://bmad-code-org.github.io/BMAD-METHOD/llms.txt

# Get full documentation
curl https://bmad-code-org.github.io/BMAD-METHOD/llms-full.txt
```

## Contributing

Want to improve BMad Method? Check out:

- [Contributing Guide](https://github.com/bmad-code-org/BMAD-METHOD/blob/main/CONTRIBUTING.md)
- [GitHub Repository](https://github.com/bmad-code-org/BMAD-METHOD)

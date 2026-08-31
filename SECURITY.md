# Security Policy

## Supported Versions

We release security patches for the following versions:

| Version  | Supported          |
| -------- | ------------------ |
| Latest   | :white_check_mark: |
| < Latest | :x:                |

We recommend always using the latest version of BMad Method to ensure you have the most recent security updates.

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security issue, please report it responsibly.

### How to Report

**Do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report them via one of these methods:

1. **GitHub Security Advisories** (Preferred): Use [GitHub's private vulnerability reporting](https://github.com/bmad-code-org/BMAD-METHOD/security/advisories/new) to submit a confidential report.

2. **Email**: Send a report to [security@bmadcode.com](mailto:security@bmadcode.com). Please avoid including exploit code in the body if the issue is severe — send a short description and we will arrange a channel for details.

3. **Discord**: Contact a maintainer directly via DM on our [Discord server](https://discord.gg/gk8jAdXWmj).

BMad Method is an open source project maintained by a small team. We do not operate a paid bug bounty program, and we cannot offer payment for reports. We do credit reporters in published advisories.

### What to Include

Please include as much of the following information as possible:

- Type of vulnerability (e.g., prompt injection, path traversal, etc.)
- Full paths of source file(s) related to the vulnerability
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if available)
- Impact assessment of the vulnerability
- Which trust boundary you believe is crossed (see [Security Model](#security-model) below)

### Response Timeline

We aim to respond on a best-effort basis:

- **Initial Response**: Usually within a few days of receiving your report
- **Status Update**: An assessment once we have been able to reproduce and evaluate the issue
- **Resolution**: Critical issues are prioritized ahead of other work; lower-severity issues are scheduled alongside normal development

If you have not heard from us within two weeks, please follow up by email or on Discord — it is more likely that a notification was missed than that your report was dismissed.

### What to Expect

1. We will acknowledge receipt of your report
2. We will investigate and validate the vulnerability
3. We will work on a fix and coordinate disclosure timing with you
4. We will credit you in the security advisory (unless you prefer to remain anonymous)

## Security Model

BMad Method is a framework in which AI agents read instructions from markdown files and act on them. **Executing instructions found in files is the intended design, not a vulnerability.** Understanding this is essential to judging what counts as a security issue.

The framework's security boundary is this: content that a user did not author or knowingly install should not be able to change agent behavior in ways the user did not intend, and agent actions should stay within the file system scope the user configured.

A report is most useful when it names the specific boundary being crossed.

## Security Scope

### In Scope

- Vulnerabilities in BMad Method core framework code, installer, or update mechanism
- Untrusted content — web pages, API responses, issue or PR bodies, dependency metadata, or other data pulled in at runtime — altering agent behavior in ways the user did not intend
- Path traversal or file system access outside the configured project scope
- Escapes from configured file-access or tool-permission limits
- Credential, token, or secret exposure through framework code, logs, or generated artifacts
- Supply chain vulnerabilities in dependencies we ship
- Code injection in framework scripts or generated build artifacts

### Out of Scope

- **An agent following the instructions in a module the user installed.** Installing a BMad module is equivalent to running its code. Users are responsible for vetting modules they install, including third-party ones.
- **An agent following instructions the user wrote.** Custom agents, workflows, and prompts do what their author tells them to do.
- Security issues in user-created custom agents or modules
- Vulnerabilities in third-party AI providers (Claude, GPT, etc.) or in the AI IDEs and CLIs that host BMad
- Model behavior in general — hallucination, inaccurate output, or an agent making a poor decision is a quality issue, not a vulnerability
- Issues that require physical access to a user's machine
- Social engineering attacks
- Denial of service attacks that don't exploit a specific vulnerability
- Findings from automated scanners without a demonstrated, reachable impact in BMad Method

## Security Best Practices for Users

When using BMad Method:

1. **Vet What You Install**: Treat installing a module or expansion pack as running its code — review modules from sources you do not know
2. **Review Agent Outputs**: Always review AI-generated code before executing it
3. **Limit File Access**: Configure your AI IDE to limit file system access where possible
4. **Keep Updated**: Regularly update to the latest version
5. **Validate Dependencies**: Review any dependencies added by generated code
6. **Environment Isolation**: Consider running AI-assisted development in isolated environments

## Acknowledgments

We appreciate the security research community's efforts in helping keep BMad Method secure. Contributors who report valid security issues will be acknowledged in our security advisories.

---

Thank you for helping keep BMad Method and our community safe.

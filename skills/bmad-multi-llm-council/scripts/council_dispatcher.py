#!/usr/bin/env python3
"""
council_dispatcher.py — Lightweight, Zero-Dependency Swarm Cross-Review Dispatcher for BMAD.
Dispatches a unified diff to available external LLM CLIs (MiniMax, Kimi, Gemini, Codex)
and formats findings for the BMAD triage flow.
"""

import sys
import os
import subprocess
import shutil

ADAPTERS = [
    {
        "name": "minimax",
        "bin": os.path.expanduser("~/.local/bin/minimax"),
        "cmd": lambda bin_path, sys_prompt, prompt: [bin_path, "-s", sys_prompt, prompt]
    },
    {
        "name": "kimi",
        "bin": os.path.expanduser("~/.kimi-code/bin/kimi"),
        "cmd": lambda bin_path, sys_prompt, prompt: [bin_path, "-p", f"{sys_prompt}\n\n{prompt}"]
    },
    {
        "name": "gemini",
        "bin": shutil.which("gemini"),
        "cmd": lambda bin_path, sys_prompt, prompt: [bin_path, "-p", f"{sys_prompt}\n\n{prompt}"] if bin_path else None
    },
    {
        "name": "codex",
        "bin": shutil.which("codex"),
        "cmd": lambda bin_path, sys_prompt, prompt: [bin_path, "-p", f"{sys_prompt}\n\n{prompt}"] if bin_path else None
    }
]

SYSTEM_PROMPT = """You are an independent Senior Adversarial Code Reviewer operating under the BMAD Method.
Inspect the unified diff strictly for:
1. Logic regressions and contract violations.
2. Multi-tenancy isolation leaks and missing tenant scoping on queries/mutations.
3. Unsafe concurrency, data races, or unhandled async leaks.
4. Security vulnerabilities (injections, exposed credentials, authorization bypasses).

RULES:
- Ignore style or aesthetic suggestions.
- Report only concrete, reproducible bugs with file/line evidence.
- If the diff is clean and safe, return strictly: APPROVED.
"""

def detect_adapter():
    for adapter in ADAPTERS:
        bin_path = adapter["bin"]
        if bin_path and os.path.exists(bin_path) and os.access(bin_path, os.X_OK):
            return adapter
    return None

def main():
    if len(sys.argv) < 2:
        print("Usage: council_dispatcher.py <diff_file_path>", file=sys.stderr)
        sys.exit(1)

    diff_path = sys.argv[1]
    if not os.path.exists(diff_path):
        print(f"Error: Diff file '{diff_path}' not found", file=sys.stderr)
        sys.exit(1)

    with open(diff_path, "r", encoding="utf-8") as f:
        diff_content = f.read()

    adapter = detect_adapter()
    if not adapter:
        fallback_dir = "_bmad-output/review-prompts"
        os.makedirs(fallback_dir, exist_ok=True)
        fallback_file = os.path.join(fallback_dir, "council-review-manual.md")
        with open(fallback_file, "w", encoding="utf-8") as f:
            f.write(f"# BMAD Council Review Prompt\n\n{SYSTEM_PROMPT}\n\n## Unified Diff:\n```diff\n{diff_content}\n```\n")
        print(f"WARN: No external authenticated CLI found. Prompt written to '{fallback_file}'. Status: HALT_INSPECT")
        sys.exit(0)

    print(f"[*] Dispatching cross-review to external model via adapter: {adapter['name']}")
    cmd = adapter["cmd"](adapter["bin"], SYSTEM_PROMPT, diff_content)
    try:
        res = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
        output = res.stdout.strip()
        if "APPROVED" in output:
            print("✅ Council Gate: APPROVED by independent reviewer.")
            sys.exit(0)
        else:
            print(f"⚠️ Council Gate: FINDINGS identified by {adapter['name']}:\n\n{output}")
            sys.exit(1)
    except subprocess.TimeoutExpired:
        print(f"ERROR: Reviewer timeout waiting for CLI '{adapter['name']}'.", file=sys.stderr)
        sys.exit(2)

if __name__ == "__main__":
    main()

# Test Suite

Tests for the BMAD-METHOD tooling infrastructure.

## Supported Commands

```bash
# Full local quality gate
npm run quality

# Full local test gate
npm test

# JavaScript installer and validator coverage
npm run test:install
npm run test:channels
npm run validate:refs
npm run validate:skills

# Python script and black-box tests
npm run test:python
```

`npm run test:python` uses `uv run --python 3.11 --with "pytest>=8,<10" pytest`.
Pytest discovery is configured in `pytest.ini` to collect from `src` and
`test/python`, including both `test*.py` and the existing hyphenated
`test-*.py` test filenames. VS Code uses the same pytest configuration through
workspace settings.

## Retained JavaScript Test Areas

Installer tests remain JavaScript because they exercise the Node installer,
installation channels, package assembly, and related CLI behavior:

- `test/test-installation-components.js`
- `test/test-installer-channels.js`

## Python Test Policy

New non-installer regression coverage should use Python tests near the relevant
Python script under `src/**/scripts/tests`, black-box tests under `test/python`,
or an existing suite that already covers the behavior. Do not add a new
standalone JavaScript runner or npm target for non-installer regressions.

Use `npm run test:python` for Python script coverage. It is included in
`npm test`, `npm run quality`, and the validate job in
`.github/workflows/quality.yaml`.

## JavaScript Bridge Pattern

When a Python test needs to black-box a real JS production export, use
`test/python/support/js_bridge.{js,py}` — the one supported way to call JS
production code from pytest. Never reimplement the JS logic in Python.

```python
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / "support"))
import js_bridge  # noqa: E402

result = js_bridge.call(
    "tools/installer/modules/custom-module-manager.js",
    "CustomModuleManager.parseSource",
    "https://github.com/foo/bar",
)
```

`js_bridge.call(module_path, export, *args)` runs `module_path` (relative to
the repo root) through a small Node subprocess (`js_bridge.js`) and returns
the JSON-decoded result. `export` is either a bare export name
(`require(module_path)[export](...args)`) or a dotted `Class.method` name
(`new require(module_path)[Class]()[method](...args)`). If the export can't
be found or the call throws, the bridge exits non-zero and `call` raises
`RuntimeError` with the underlying stderr message. See
`test/python/test_js_bridge.py` for a working example.

For default-export factory modules (the `options => (tree, file) => void`
shape used by rehype/unified-style plugins), use `js_bridge.transform`
instead:

```python
tree = js_bridge.transform(
    "website/src/rehype-base-paths.js",
    "default",
    {"base": "/BMAD-METHOD/"},
    tree,
)
```

`js_bridge.transform(module_path, export, options, tree, file=None)` calls
`require(module_path)[export](options)` to get the transformer, then calls
`transformer(tree, file)` and returns the (possibly mutated) `tree` argument
— not the transformer's own (conventionally undefined) return value. Each
call round-trips through a Node subprocess, so the returned tree is a new
object; rebind `tree = js_bridge.transform(...)` rather than relying on
in-place mutation. See `test/python/test_rehype_markdown_links.py` and
`test/python/test_rehype_base_paths.py` for working examples.

## Test Fixtures

Located in `test/fixtures/`:

```text
test/fixtures/
└── file-refs-csv/    # Fixtures for file reference CSV tests
```
